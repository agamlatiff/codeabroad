package exercise

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"hash/fnv"
	"log"
	"sort"
	"strings"
	"time"

	"merantalk/backend/infrastructure/postgres"
	"merantalk/backend/internal/app/language"
	"merantalk/backend/internal/shared/apperror"
	"github.com/jackc/pgx/v5"
)

// PostgresRepository implements Repository, SRSRepository, and ReadinessExamRepository
type PostgresRepository struct {
	db *postgres.PostgresDB
}

// NewRepository creates a new PostgreSQL exercise repository instance
func NewRepository(db *postgres.PostgresDB) Repository {
	return &PostgresRepository{db: db}
}

// NewSRSRepository creates a new PostgreSQL scheduled review repository instance
func NewSRSRepository(db *postgres.PostgresDB) SRSRepository {
	return &PostgresRepository{db: db}
}

// NewReadinessExamRepository creates a new PostgreSQL readiness exam repository instance
func NewReadinessExamRepository(db *postgres.PostgresDB) ReadinessExamRepository {
	return &PostgresRepository{db: db}
}

// ParseCorrectAnswerJSON extracts a canonical comparable answer string from any supported DB JSONB shape.
func ParseCorrectAnswerJSON(correctJSON []byte) string {
	if len(correctJSON) == 0 {
		return ""
	}

	var strAnswer string
	if err := json.Unmarshal(correctJSON, &strAnswer); err == nil && strAnswer != "" {
		return strAnswer
	}

	var tokenSlice []string
	if err := json.Unmarshal(correctJSON, &tokenSlice); err == nil && len(tokenSlice) > 0 {
		return strings.TrimSpace(strings.Join(tokenSlice, " "))
	}

	var mapAnswer map[string]any
	if err := json.Unmarshal(correctJSON, &mapAnswer); err == nil {
		for _, key := range []string{"selected", "selected_id", "expected_transcript", "exact_match", "answer", "correct"} {
			if val, ok := mapAnswer[key].(string); ok && strings.TrimSpace(val) != "" {
				return strings.TrimSpace(val)
			}
		}
	}

	return string(correctJSON)
}

// ParseAcceptableAnswersJSON extracts acceptable answer strings from either []string or [][]string DB JSONB shapes.
func ParseAcceptableAnswersJSON(acceptableJSON []byte) []string {
	if len(acceptableJSON) == 0 {
		return []string{}
	}

	var flat []string
	if err := json.Unmarshal(acceptableJSON, &flat); err == nil {
		if flat == nil {
			return []string{}
		}
		return flat
	}

	var matrix [][]string
	if err := json.Unmarshal(acceptableJSON, &matrix); err == nil {
		flattened := make([]string, 0, len(matrix))
		for _, tokens := range matrix {
			joined := strings.TrimSpace(strings.Join(tokens, " "))
			if joined != "" {
				flattened = append(flattened, joined)
			}
		}
		return flattened
	}

	return []string{}
}

func appendUniqueFold(items []string, candidate string, excludeFold string) []string {
	trimmed := strings.TrimSpace(candidate)
	if trimmed == "" || strings.EqualFold(trimmed, excludeFold) {
		return items
	}
	for _, existing := range items {
		if strings.EqualFold(strings.TrimSpace(existing), trimmed) {
			return items
		}
	}
	return append(items, trimmed)
}

func parseObjectOptionPair(raw any) (id string, text string, ok bool) {
	m, isMap := raw.(map[string]any)
	if !isMap {
		return "", "", false
	}
	rawID, _ := m["id"].(string)
	rawText, _ := m["text"].(string)
	id = strings.TrimSpace(rawID)
	text = strings.TrimSpace(rawText)
	if id == "" || text == "" {
		return "", "", false
	}
	return id, text, true
}

func syncObjectOptionAcceptableAnswers(ex *Exercise) {
	if ex == nil || len(ex.Content) == 0 {
		return
	}
	correct := strings.TrimSpace(ex.CorrectAnswer)
	if correct == "" {
		return
	}
	rawOpts, ok := ex.Content["options"].([]any)
	if !ok {
		return
	}
	for _, o := range rawOpts {
		id, text, ok := parseObjectOptionPair(o)
		if !ok {
			continue
		}
		if strings.EqualFold(correct, id) {
			ex.AcceptableAnswers = appendUniqueFold(ex.AcceptableAnswers, id, text)
			ex.CorrectAnswer = text
			return
		} else if strings.EqualFold(correct, text) {
			ex.AcceptableAnswers = appendUniqueFold(ex.AcceptableAnswers, id, correct)
			return
		}
	}
}

func syncObjectOptionDiagnosticRubric(ex *Exercise) {
	if ex == nil || len(ex.Content) == 0 || len(ex.DiagnosticRubric) == 0 {
		return
	}
	rawOpts, ok := ex.Content["options"].([]any)
	if !ok {
		return
	}
	lowerRubric := make(map[string]any, len(ex.DiagnosticRubric)*2)
	for k, v := range ex.DiagnosticRubric {
		if lk := strings.ToLower(strings.TrimSpace(k)); lk != "" {
			lowerRubric[lk] = v
		}
	}
	for _, o := range rawOpts {
		id, text, ok := parseObjectOptionPair(o)
		if !ok {
			continue
		}
		lowerID := strings.ToLower(id)
		lowerText := strings.ToLower(text)

		idVal, hasID := ex.DiagnosticRubric[id]
		if !hasID {
			idVal, hasID = lowerRubric[lowerID]
		}
		textVal, hasText := ex.DiagnosticRubric[text]
		if !hasText {
			textVal, hasText = lowerRubric[lowerText]
		}
		if hasID && !hasText {
			ex.DiagnosticRubric[text] = idVal
			lowerRubric[lowerText] = idVal
		} else if hasText && !hasID {
			ex.DiagnosticRubric[id] = textVal
			lowerRubric[lowerID] = textVal
		}
	}
}

func unmarshalJSONMap(raw []byte, contextLabel string) map[string]any {
	var out map[string]any
	if len(raw) > 0 {
		if err := json.Unmarshal(raw, &out); err != nil {
			log.Printf("exercise: failed to unmarshal %s JSONB: %v", contextLabel, err)
		}
	}
	if out == nil {
		out = make(map[string]any)
	}
	return out
}

// HydrateSanitizedExerciseJSONFields populates only student-safe exercise fields (skipping answer/rubric JSONB unmarshaling).
func HydrateSanitizedExerciseJSONFields(ex *Exercise, contentJSON []byte) {
	ex.XPReward = 10
	rawContent := unmarshalJSONMap(contentJSON, fmt.Sprintf("exercise content (%s)", ex.ID))
	if rawOpts, ok := rawContent["options"].([]any); ok {
		for _, o := range rawOpts {
			if s, ok := o.(string); ok {
				ex.Options = append(ex.Options, s)
			} else if m, ok := o.(map[string]any); ok {
				if text, ok := m["text"].(string); ok && text != "" {
					ex.Options = append(ex.Options, text)
				}
			}
		}
	}
	if rawHint, ok := rawContent["hint"].(string); ok && rawHint != "" {
		ex.Hint = &rawHint
	}
	if rawMedia, ok := rawContent["audio_url"].(string); ok && rawMedia != "" {
		ex.MediaURL = &rawMedia
	} else if rawMedia, ok := rawContent["media_url"].(string); ok && rawMedia != "" {
		ex.MediaURL = &rawMedia
	}
	if xpVal, ok := rawContent["xp_reward"].(float64); ok && xpVal > 0 {
		ex.XPReward = int(xpVal)
	}
	if ex.Options == nil {
		ex.Options = []string{}
	}
	sanitizedContent := make(map[string]any, len(rawContent))
	for k, v := range rawContent {
		if !strippedContentKeys[k] {
			sanitizedContent[k] = v
		}
	}
	ex.Content = sanitizedContent
}

// HydrateExerciseJSONFields populates normalized JSONB fields on an Exercise from raw DB columns.
func HydrateExerciseJSONFields(ex *Exercise, contentJSON, correctJSON, acceptableJSON, diagnosticJSON []byte) {
	ex.XPReward = 10

	ex.Content = unmarshalJSONMap(contentJSON, fmt.Sprintf("exercise content (%s)", ex.ID))
	if rawOpts, ok := ex.Content["options"].([]any); ok {
		for _, o := range rawOpts {
			if s, ok := o.(string); ok {
				ex.Options = append(ex.Options, s)
			} else if m, ok := o.(map[string]any); ok {
				if text, ok := m["text"].(string); ok && text != "" {
					ex.Options = append(ex.Options, text)
				}
			}
		}
	}
	if rawHint, ok := ex.Content["hint"].(string); ok && rawHint != "" {
		ex.Hint = &rawHint
	}
	if rawMedia, ok := ex.Content["audio_url"].(string); ok && rawMedia != "" {
		ex.MediaURL = &rawMedia
	} else if rawMedia, ok := ex.Content["media_url"].(string); ok && rawMedia != "" {
		ex.MediaURL = &rawMedia
	}
	if xpVal, ok := ex.Content["xp_reward"].(float64); ok && xpVal > 0 {
		ex.XPReward = int(xpVal)
	}
	if ex.Options == nil {
		ex.Options = []string{}
	}

	ex.CorrectAnswer = ParseCorrectAnswerJSON(correctJSON)
	ex.AcceptableAnswers = ParseAcceptableAnswersJSON(acceptableJSON)
	syncObjectOptionAcceptableAnswers(ex)

	ex.DiagnosticRubric = unmarshalJSONMap(diagnosticJSON, fmt.Sprintf("exercise diagnostic_rubric (%s)", ex.ID))
	syncObjectOptionDiagnosticRubric(ex)
}

const (
	exerciseSelectColumns = `
		id, lesson_id, grammar_point_id, skill_pillar, exercise_type, prompt,
		content, correct_answer, acceptable_answers, diagnostic_rubric, explanation, order_index, created_at
	`
	prefixedExerciseSelectColumns = `
		e.id, e.lesson_id, e.grammar_point_id, e.skill_pillar, e.exercise_type, e.prompt,
		e.content, e.correct_answer, e.acceptable_answers, e.diagnostic_rubric, e.explanation, e.order_index, e.created_at
	`
	sanitizedExerciseSelectColumns = `
		id, lesson_id, grammar_point_id, skill_pillar, exercise_type, prompt, content, order_index, created_at
	`
	prefixedSanitizedExerciseSelectColumns = `
		e.id, e.lesson_id, e.grammar_point_id, e.skill_pillar, e.exercise_type, e.prompt, e.content, e.order_index, e.created_at
	`
)

type sanitizedExerciseScanBuf struct {
	ex          Exercise
	contentJSON []byte
}

func (b *sanitizedExerciseScanBuf) dests() []any {
	return []any{
		&b.ex.ID, &b.ex.LessonID, &b.ex.GrammarPointID, &b.ex.SkillPillar, &b.ex.ExerciseType, &b.ex.Prompt,
		&b.contentJSON, &b.ex.OrderIndex, &b.ex.CreatedAt,
	}
}

func (b *sanitizedExerciseScanBuf) materialize() *Exercise {
	HydrateSanitizedExerciseJSONFields(&b.ex, b.contentJSON)
	return &b.ex
}

func scanSanitizedExerciseRows(rows pgx.Rows, capHint int, errLabel string) ([]Exercise, error) {
	exercises := make([]Exercise, 0, capHint)
	for rows.Next() {
		var buf sanitizedExerciseScanBuf
		if err := rows.Scan(buf.dests()...); err != nil {
			return nil, fmt.Errorf("failed to scan %s row: %w", errLabel, err)
		}
		exercises = append(exercises, *buf.materialize())
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error in %s: %w", errLabel, err)
	}
	return exercises, nil
}

type exerciseScanBuf struct {
	ex             Exercise
	contentJSON    []byte
	correctJSON    []byte
	acceptableJSON []byte
	diagnosticJSON []byte
}

func (b *exerciseScanBuf) dests() []any {
	return []any{
		&b.ex.ID, &b.ex.LessonID, &b.ex.GrammarPointID, &b.ex.SkillPillar, &b.ex.ExerciseType, &b.ex.Prompt,
		&b.contentJSON, &b.correctJSON, &b.acceptableJSON, &b.diagnosticJSON, &b.ex.Explanation, &b.ex.OrderIndex, &b.ex.CreatedAt,
	}
}

func (b *exerciseScanBuf) materialize() *Exercise {
	HydrateExerciseJSONFields(&b.ex, b.contentJSON, b.correctJSON, b.acceptableJSON, b.diagnosticJSON)
	return &b.ex
}

func scanExerciseRow(scanner interface{ Scan(dest ...any) error }) (*Exercise, error) {
	var buf exerciseScanBuf
	if err := scanner.Scan(buf.dests()...); err != nil {
		return nil, err
	}
	return buf.materialize(), nil
}

func scanExerciseRows(rows pgx.Rows, capHint int, errLabel string) ([]Exercise, error) {
	exercises := make([]Exercise, 0, capHint)
	for rows.Next() {
		ex, err := scanExerciseRow(rows)
		if err != nil {
			return nil, fmt.Errorf("failed to scan %s row: %w", errLabel, err)
		}
		exercises = append(exercises, *ex)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error in %s: %w", errLabel, err)
	}
	return exercises, nil
}

// GetExercisesByLessonID retrieves all exercises belonging to a specific lesson node (sanitized projection)
func (r *PostgresRepository) GetExercisesByLessonID(ctx context.Context, lessonID string) ([]Exercise, error) {
	if err := apperror.ValidateEntityUUID(lessonID); err != nil {
		return nil, err
	}
	query := `SELECT ` + sanitizedExerciseSelectColumns + ` FROM exercises WHERE lesson_id = NULLIF($1, '')::uuid ORDER BY order_index ASC, id ASC`
	rows, err := r.db.Pool.Query(ctx, query, lessonID)
	if err != nil {
		return nil, fmt.Errorf("failed to query exercises by lesson id: %w", err)
	}
	defer rows.Close()

	return scanSanitizedExerciseRows(rows, 10, "exercise")
}

// GetRawExercisesByLessonID retrieves all exercises for a lesson including answer keys
// strictly for server-side study card & hint generation (callers must sanitize before returning).
func (r *PostgresRepository) GetRawExercisesByLessonID(ctx context.Context, lessonID string) ([]Exercise, error) {
	if err := apperror.ValidateEntityUUID(lessonID); err != nil {
		return nil, err
	}
	query := `SELECT ` + exerciseSelectColumns + ` FROM exercises WHERE lesson_id = NULLIF($1, '')::uuid ORDER BY order_index ASC, id ASC`
	rows, err := r.db.Pool.Query(ctx, query, lessonID)
	if err != nil {
		return nil, fmt.Errorf("failed to query raw exercises by lesson id: %w", err)
	}
	defer rows.Close()

	return scanExerciseRows(rows, 10, "raw exercise")
}

// GetExerciseByID retrieves a single exercise by UUID
func (r *PostgresRepository) GetExerciseByID(ctx context.Context, id string) (*Exercise, error) {
	if err := apperror.ValidateEntityUUID(id); err != nil {
		return nil, err
	}
	query := `SELECT ` + exerciseSelectColumns + ` FROM exercises WHERE id = NULLIF($1, '')::uuid`
	ex, err := scanExerciseRow(r.db.Pool.QueryRow(ctx, query, id))
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrExerciseNotFound
		}
		return nil, fmt.Errorf("failed to query exercise by id: %w", err)
	}
	return ex, nil
}

// GetPlacementExercises retrieves diagnostic placement test exercises for a destination language
func (r *PostgresRepository) GetPlacementExercises(ctx context.Context, languageID string, limit int) ([]Exercise, error) {
	if err := apperror.ValidateEntityUUID(languageID); err != nil {
		return nil, err
	}
	query := `
		WITH placement_unit_exists AS (
			SELECT EXISTS (
				SELECT 1
				FROM units u
				JOIN proficiency_levels pl ON u.level_id = pl.id
				WHERE pl.language_id = NULLIF($1, '')::uuid
				  AND u.unit_type = 'diagnostic_exam'
				  AND u.order_index <= 0
			) AS has_placement
		)
		SELECT ` + prefixedExerciseSelectColumns + `
		FROM exercises e
		JOIN lessons l ON e.lesson_id = l.id
		JOIN units u ON l.unit_id = u.id
		JOIN proficiency_levels pl ON u.level_id = pl.id
		CROSS JOIN placement_unit_exists pue
		WHERE pl.language_id = NULLIF($1, '')::uuid
		  AND (
			(pue.has_placement AND u.unit_type = 'diagnostic_exam' AND u.order_index <= 0)
			OR (NOT pue.has_placement AND u.unit_type = 'curriculum')
		  )
		ORDER BY pl.order_index ASC, u.order_index ASC, l.order_index ASC, e.order_index ASC, e.id ASC
		LIMIT $2
	`
	rows, err := r.db.Pool.Query(ctx, query, languageID, limit)
	if err != nil {
		return nil, fmt.Errorf("failed to query placement exercises: %w", err)
	}
	defer rows.Close()

	return scanExerciseRows(rows, limit, "placement exercise")
}

// GetReadinessExamExercises retrieves all sectional questions for an official mock exam
func (r *PostgresRepository) GetReadinessExamExercises(ctx context.Context, levelID string) ([]Exercise, error) {
	if err := apperror.ValidateEntityUUID(levelID); err != nil {
		return nil, err
	}
	query := `
		SELECT ` + prefixedExerciseSelectColumns + `
		FROM exercises e
		JOIN lessons l ON e.lesson_id = l.id
		JOIN units u ON l.unit_id = u.id
		WHERE u.level_id = NULLIF($1, '')::uuid
		  AND u.unit_type = 'diagnostic_exam'
		  AND u.order_index > 0
		ORDER BY e.skill_pillar ASC, e.order_index ASC, e.id ASC
	`
	rows, err := r.db.Pool.Query(ctx, query, levelID)
	if err != nil {
		return nil, fmt.Errorf("failed to query readiness exam exercises: %w", err)
	}
	defer rows.Close()

	return scanExerciseRows(rows, 20, "readiness exam exercise")
}

// splitFlashcardFrontText extracts clean display term and optional kana reading from `term（kana）`.
func splitFlashcardFrontText(frontText string) (term string, kana string) {
	trimmed := strings.TrimSpace(frontText)
	openIdx := strings.Index(trimmed, "（")
	closeIdx := strings.LastIndex(trimmed, "）")
	if openIdx > 0 && closeIdx > openIdx+len("（") {
		return strings.TrimSpace(trimmed[:openIdx]), strings.TrimSpace(trimmed[openIdx+len("（") : closeIdx])
	}
	return trimmed, ""
}

// buildDeterministicQuizChoices returns up to 3 deduplicated meaning options sorted deterministically per card.
func buildDeterministicQuizChoices(cardID string, correctMeaning string, distractors []string) []string {
	correct := strings.TrimSpace(correctMeaning)
	if correct == "" {
		return nil
	}

	seen := map[string]bool{strings.ToLower(correct): true}
	choices := []string{correct}
	for _, d := range distractors {
		trimmed := strings.TrimSpace(d)
		if trimmed == "" {
			continue
		}
		key := strings.ToLower(trimmed)
		if seen[key] {
			continue
		}
		seen[key] = true
		choices = append(choices, trimmed)
		if len(choices) >= 3 {
			break
		}
	}

	hashChoice := func(choice string) uint64 {
		h := fnv.New64a()
		_, _ = h.Write([]byte(cardID))
		_, _ = h.Write([]byte(":"))
		_, _ = h.Write([]byte(choice))
		return h.Sum64()
	}

	sort.Slice(choices, func(i, j int) bool {
		hi := hashChoice(choices[i])
		hj := hashChoice(choices[j])
		if hi == hj {
			return choices[i] < choices[j]
		}
		return hi < hj
	})
	return choices
}

// GetDailyVocabularies extracts daily rotated pure-vocabulary cards from flashcards scoped to the user's active language and JLPT level.
func (r *PostgresRepository) GetDailyVocabularies(ctx context.Context, userID string, limit int) ([]VocabularyItem, error) {
	if err := apperror.ValidateUserUUID(userID); err != nil {
		return nil, err
	}
	limit = normalizeLimit(limit, 10, 50)

	query := `
		WITH active_enrollment AS (
			SELECT
				ule.current_level_id,
				COALESCE(lang.code, 'ja') AS language_code,
				COALESCE(active_pl.code, 'N5') AS level_code
			FROM user_language_enrollments ule
			LEFT JOIN languages lang ON lang.id = ule.language_id
			LEFT JOIN proficiency_levels active_pl ON ule.current_level_id = active_pl.id
			WHERE ule.user_id = $1::uuid
			  AND ule.is_active = true
			LIMIT 1
		),
		user_curriculum_progress AS (
			SELECT COUNT(*)::int AS completed_lessons
			FROM user_lesson_progress ulp
			INNER JOIN lessons l ON l.id = ulp.lesson_id
			INNER JOIN units u ON u.id = l.unit_id
			LEFT JOIN active_enrollment ae ON true
			WHERE ulp.user_id = $1::uuid
			  AND ulp.is_completed = true
			  AND u.unit_type = 'curriculum'
			  AND (ae.current_level_id IS NULL OR u.level_id = ae.current_level_id)
		),
		wib_day AS (
			SELECT
				((NOW() AT TIME ZONE 'Asia/Jakarta')::date)::text AS date_key,
				((NOW() AT TIME ZONE 'Asia/Jakarta')::date AT TIME ZONE 'Asia/Jakarta') AS start_ts
		)
		SELECT
			fc.id::text,
			fd.id::text AS deck_id,
			fd.title AS deck_title,
			fd.language_code,
			fc.front_text,
			fc.reading,
			fc.back_meaning,
			COALESCE(NULLIF(fc.part_of_speech, ''), fd.title) AS category,
			fd.jlpt_level AS difficulty_level,
			COALESCE(ufp.last_reviewed_at >= wib_day.start_ts, false) AS is_reviewed_today,
			COALESCE(
				ARRAY(
					SELECT back_meaning
					FROM (
						SELECT DISTINCT d_fc.back_meaning
						FROM flashcard_cards d_fc
						INNER JOIN flashcard_decks d_fd ON d_fd.id = d_fc.deck_id
						WHERE d_fd.language_code = fd.language_code
						  AND LOWER(COALESCE(d_fd.category, '')) NOT IN ('hiragana', 'katakana')
						  AND d_fc.id <> fc.id
						  AND LOWER(TRIM(d_fc.back_meaning)) <> LOWER(TRIM(fc.back_meaning))
					) distinct_meanings
					ORDER BY md5(fc.id::text || distinct_meanings.back_meaning || wib_day.date_key)
					LIMIT 2
				),
				ARRAY[]::text[]
			) AS distractors
		FROM flashcard_cards fc
		INNER JOIN flashcard_decks fd ON fd.id = fc.deck_id
		CROSS JOIN wib_day
		LEFT JOIN active_enrollment ae ON true
		LEFT JOIN user_curriculum_progress ucp ON true
		LEFT JOIN user_flashcard_progress ufp ON ufp.card_id = fc.id AND ufp.user_id = $1::uuid
		WHERE fd.language_code = COALESCE(ae.language_code, 'ja')
		  AND LOWER(COALESCE(fd.category, '')) NOT IN ('hiragana', 'katakana')
		ORDER BY
			CASE WHEN UPPER(fd.jlpt_level) = UPPER(COALESCE(ae.level_code, 'N5')) THEN 0 ELSE 1 END ASC,
			CASE WHEN fd.sort_order <= GREATEST(8, COALESCE(ucp.completed_lessons, 0) + 6) THEN 0 ELSE 1 END ASC,
			CASE
				WHEN ufp.last_reviewed_at >= wib_day.start_ts THEN 0
				WHEN ufp.id IS NOT NULL AND (ufp.next_review_at <= wib_day.start_ts + INTERVAL '1 day' OR ufp.repetitions = 0) THEN 0
				WHEN ufp.id IS NULL THEN 0
				ELSE 1
			END ASC,
			md5($1::text || ':' || fc.id::text || ':' || wib_day.date_key) ASC,
			fd.sort_order ASC,
			fc.sort_order ASC
		LIMIT $2
	`

	rows, err := r.db.Pool.Query(ctx, query, userID, limit)
	if err != nil {
		return nil, fmt.Errorf("failed to query daily vocabularies: %w", err)
	}
	defer rows.Close()

	items := make([]VocabularyItem, 0, limit)
	for rows.Next() {
		var item VocabularyItem
		var frontText, romaji string
		var distractors []string
		if err := rows.Scan(
			&item.ID,
			&item.DeckID,
			&item.DeckTitle,
			&item.LanguageCode,
			&frontText,
			&romaji,
			&item.Meaning,
			&item.Category,
			&item.DifficultyLevel,
			&item.IsReviewedToday,
			&distractors,
		); err != nil {
			return nil, fmt.Errorf("failed to scan daily vocabulary row: %w", err)
		}
		term, kana := splitFlashcardFrontText(frontText)
		romaji = strings.TrimSpace(romaji)
		item.Term = term
		item.TargetText = term
		item.Kana = kana
		item.Romaji = romaji
		item.Translation = item.Meaning
		item.QuizChoices = buildDeterministicQuizChoices(item.ID, item.Meaning, distractors)

		readingHead := kana
		if readingHead == "" {
			readingHead = term
		}
		if romaji != "" && romaji != readingHead {
			item.Reading = fmt.Sprintf("%s • %s", readingHead, romaji)
		} else {
			item.Reading = readingHead
		}

		items = append(items, item)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error in daily vocabularies: %w", err)
	}
	return items, nil
}

// CreateAttempt logs telemetry data for an answered exercise
func (r *PostgresRepository) CreateAttempt(ctx context.Context, attempt *UserExerciseAttempt) error {
	if attempt == nil {
		return apperror.ErrBadRequest
	}
	if err := apperror.ValidateUserUUID(attempt.UserID); err != nil {
		return err
	}
	if err := apperror.ValidateEntityUUID(attempt.ExerciseID); err != nil {
		return err
	}
	selectedPayload := attempt.SelectedAnswer
	if selectedPayload == nil {
		selectedPayload = map[string]any{}
	}
	selectedJSON, err := json.Marshal(selectedPayload)
	if err != nil {
		selectedJSON = []byte("{}")
	}

	query := `
		INSERT INTO user_exercise_attempts (user_id, exercise_id, is_correct, selected_answer, time_spent_seconds, created_at)
		VALUES ($1, $2, $3, $4, $5, NOW())
		RETURNING id, created_at
	`
	err = r.db.Pool.QueryRow(
		ctx, query,
		attempt.UserID, attempt.ExerciseID, attempt.IsCorrect, selectedJSON, attempt.TimeSpentSeconds,
	).Scan(&attempt.ID, &attempt.CreatedAt)
	if err != nil {
		return fmt.Errorf("failed to insert exercise attempt: %w", err)
	}
	attempt.SelectedAnswer = selectedPayload
	return nil
}

// GetDueReviews retrieves scheduled review cards due for review as of the specified time
func (r *PostgresRepository) GetDueReviews(ctx context.Context, userID string, now time.Time, limit int) ([]UserSRSReview, error) {
	reviews, _, err := r.GetDueReviewsWithTotal(ctx, userID, now, limit)
	return reviews, err
}

// GetDueReviewsWithTotal retrieves due SRS cards alongside total due count via COUNT(*) OVER() in one query.
func (r *PostgresRepository) GetDueReviewsWithTotal(ctx context.Context, userID string, now time.Time, limit int) ([]UserSRSReview, int, error) {
	if err := apperror.ValidateUserUUID(userID); err != nil {
		return nil, 0, err
	}
	query := `
		SELECT 
			r.id, r.user_id, r.exercise_id, r.repetition_count, r.interval_days, r.ease_factor, r.next_review_at, r.last_reviewed_at,
			` + prefixedExerciseSelectColumns + `,
			COUNT(*) OVER() AS total_due
		FROM user_srs_reviews r
		JOIN exercises e ON r.exercise_id = e.id
		JOIN lessons l ON e.lesson_id = l.id
		JOIN units u ON l.unit_id = u.id
		JOIN proficiency_levels pl ON u.level_id = pl.id
		JOIN user_language_enrollments ule ON ule.language_id = pl.language_id
		  AND ule.user_id = r.user_id
		  AND ule.is_active = true
		WHERE r.user_id = NULLIF($1, '')::uuid AND r.next_review_at <= $2
		ORDER BY r.next_review_at ASC, r.repetition_count ASC, r.id ASC
		LIMIT $3
	`
	rows, err := r.db.Pool.Query(ctx, query, userID, now, limit)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to query due srs reviews: %w", err)
	}
	defer rows.Close()

	reviews := make([]UserSRSReview, 0, limit)
	totalDue := 0
	for rows.Next() {
		var rev UserSRSReview
		var exBuf exerciseScanBuf
		var rowTotal int
		scanArgs := append([]any{
			&rev.ID, &rev.UserID, &rev.ExerciseID, &rev.RepetitionCount,
			&rev.IntervalDays, &rev.EaseFactor, &rev.NextReviewAt, &rev.LastReviewedAt,
		}, exBuf.dests()...)
		scanArgs = append(scanArgs, &rowTotal)

		if err := rows.Scan(scanArgs...); err != nil {
			return nil, 0, fmt.Errorf("failed to scan srs review row: %w", err)
		}
		rev.Exercise = exBuf.materialize()
		totalDue = rowTotal
		reviews = append(reviews, rev)
	}
	if err := rows.Err(); err != nil {
		return nil, 0, fmt.Errorf("rows iteration error in due srs reviews: %w", err)
	}
	return reviews, totalDue, nil
}

// GetReview retrieves a single SRS card for a user and exercise
func (r *PostgresRepository) GetReview(ctx context.Context, userID string, exerciseID string) (*UserSRSReview, error) {
	if err := apperror.ValidateUserUUID(userID); err != nil {
		return nil, err
	}
	if err := apperror.ValidateEntityUUID(exerciseID); err != nil {
		return nil, err
	}
	query := `
		SELECT id, user_id, exercise_id, repetition_count, interval_days, ease_factor, next_review_at, last_reviewed_at
		FROM user_srs_reviews
		WHERE user_id = NULLIF($1, '')::uuid AND exercise_id = NULLIF($2, '')::uuid
	`
	var rev UserSRSReview
	err := r.db.Pool.QueryRow(ctx, query, userID, exerciseID).Scan(
		&rev.ID, &rev.UserID, &rev.ExerciseID, &rev.RepetitionCount, &rev.IntervalDays, &rev.EaseFactor, &rev.NextReviewAt, &rev.LastReviewedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrReviewNotFound
		}
		return nil, fmt.Errorf("failed to query srs review: %w", err)
	}
	return &rev, nil
}

func normalizeReviewForUpsert(review *UserSRSReview) time.Time {
	nextReview := review.NextReviewAt
	if nextReview.IsZero() {
		nextReview = time.Now().UTC().AddDate(0, 0, 1)
	}
	if review.IntervalDays < 1 {
		review.IntervalDays = 1
	}
	if review.EaseFactor < 1.30 {
		review.EaseFactor = 1.30
	}
	return nextReview
}

const upsertSRSReviewQuery = `
	INSERT INTO user_srs_reviews (
		user_id, exercise_id, repetition_count, interval_days, ease_factor, next_review_at, last_reviewed_at
	) VALUES ($1, $2, $3, $4, $5, $6, $7)
	ON CONFLICT (user_id, exercise_id)
	DO UPDATE SET
		repetition_count = EXCLUDED.repetition_count,
		interval_days = EXCLUDED.interval_days,
		ease_factor = EXCLUDED.ease_factor,
		next_review_at = EXCLUDED.next_review_at,
		last_reviewed_at = EXCLUDED.last_reviewed_at
	RETURNING id, repetition_count, next_review_at
`

// UpsertReview records or updates an adaptive review scheduling record atomically
func (r *PostgresRepository) UpsertReview(ctx context.Context, review *UserSRSReview) error {
	if review == nil {
		return apperror.ErrBadRequest
	}
	if err := apperror.ValidateUserUUID(review.UserID); err != nil {
		return err
	}
	if err := apperror.ValidateEntityUUID(review.ExerciseID); err != nil {
		return err
	}
	nextReview := normalizeReviewForUpsert(review)
	err := r.db.Pool.QueryRow(
		ctx, upsertSRSReviewQuery,
		review.UserID, review.ExerciseID, review.RepetitionCount, review.IntervalDays, review.EaseFactor, nextReview, review.LastReviewedAt,
	).Scan(&review.ID, &review.RepetitionCount, &review.NextReviewAt)
	if err != nil {
		return fmt.Errorf("failed to upsert srs review: %w", err)
	}
	return nil
}

// ApplyReviewTx atomically locks, reads, computes, and upserts a scheduled review card within a single transaction.
func (r *PostgresRepository) ApplyReviewTx(ctx context.Context, userID, exerciseID string, compute func(prevReps, prevInterval int, prevEase float64) *UserSRSReview) (*UserSRSReview, error) {
	return r.applyReviewTx(ctx, userID, exerciseID, false, time.Time{}, compute)
}

// ApplyDueReviewTx atomically verifies the scheduled review card exists and is due before computing and persisting adaptive schedule updates.
func (r *PostgresRepository) ApplyDueReviewTx(ctx context.Context, userID, exerciseID string, now time.Time, compute func(prevReps, prevInterval int, prevEase float64) *UserSRSReview) (*UserSRSReview, error) {
	return r.applyReviewTx(ctx, userID, exerciseID, true, now, compute)
}

func (r *PostgresRepository) applyReviewTx(
	ctx context.Context,
	userID, exerciseID string,
	requireDue bool,
	now time.Time,
	compute func(prevReps, prevInterval int, prevEase float64) *UserSRSReview,
) (*UserSRSReview, error) {
	if err := apperror.ValidateUserUUID(userID); err != nil {
		return nil, err
	}
	if err := apperror.ValidateEntityUUID(exerciseID); err != nil {
		return nil, err
	}
	tx, err := r.db.Pool.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin srs review tx: %w", err)
	}
	defer func() { _ = tx.Rollback(ctx) }()

	// Serialize concurrent first-time inserts or updates for the same (user, exercise) pair.
	if _, err := tx.Exec(ctx, `SELECT pg_advisory_xact_lock(hashtextextended($1 || ':' || $2, 0))`, userID, exerciseID); err != nil {
		return nil, fmt.Errorf("failed to acquire srs review lock: %w", err)
	}

	prevReps := 0
	prevInterval := 1
	prevEase := 2.5

	var rev UserSRSReview
	selectQuery := `
		SELECT repetition_count, interval_days, ease_factor, next_review_at
		FROM user_srs_reviews
		WHERE user_id = $1 AND exercise_id = $2
		FOR UPDATE
	`
	err = tx.QueryRow(ctx, selectQuery, userID, exerciseID).Scan(&rev.RepetitionCount, &rev.IntervalDays, &rev.EaseFactor, &rev.NextReviewAt)
	if err != nil {
		if !errors.Is(err, pgx.ErrNoRows) {
			return nil, fmt.Errorf("failed to lock existing srs review: %w", err)
		}
		if requireDue {
			return nil, ErrReviewNotFound
		}
	} else {
		if requireDue && !rev.NextReviewAt.IsZero() && rev.NextReviewAt.After(now) {
			return nil, ErrReviewNotDue
		}
		prevReps = rev.RepetitionCount
		prevInterval = rev.IntervalDays
		prevEase = rev.EaseFactor
	}

	updated := compute(prevReps, prevInterval, prevEase)
	nextReview := normalizeReviewForUpsert(updated)
	err = tx.QueryRow(
		ctx, upsertSRSReviewQuery,
		updated.UserID, updated.ExerciseID, updated.RepetitionCount, updated.IntervalDays, updated.EaseFactor, nextReview, updated.LastReviewedAt,
	).Scan(&updated.ID, &updated.RepetitionCount, &updated.NextReviewAt)
	if err != nil {
		return nil, fmt.Errorf("failed to upsert srs review in tx: %w", err)
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit srs review tx: %w", err)
	}
	return updated, nil
}

// GetDueCount counts all pending scheduled review cards due on or before now
func (r *PostgresRepository) GetDueCount(ctx context.Context, userID string, now time.Time) (int, error) {
	if err := apperror.ValidateUserUUID(userID); err != nil {
		return 0, err
	}
	query := `
		SELECT COUNT(*)
		FROM user_srs_reviews r
		JOIN exercises e ON r.exercise_id = e.id
		JOIN lessons l ON e.lesson_id = l.id
		JOIN units u ON l.unit_id = u.id
		JOIN proficiency_levels pl ON u.level_id = pl.id
		JOIN user_language_enrollments ule ON ule.language_id = pl.language_id
		  AND ule.user_id = r.user_id
		  AND ule.is_active = true
		WHERE r.user_id = NULLIF($1, '')::uuid
		  AND r.next_review_at <= $2
	`
	var count int
	err := r.db.Pool.QueryRow(ctx, query, userID, now).Scan(&count)
	if err != nil {
		return 0, fmt.Errorf("failed to query srs due count: %w", err)
	}
	return count, nil
}

// CountMasteredReviews counts how many SRS cards a user has mastered (repetition_count >= 3)
func (r *PostgresRepository) CountMasteredReviews(ctx context.Context, userID string) (int, error) {
	if err := apperror.ValidateUserUUID(userID); err != nil {
		return 0, err
	}
	query := `
		SELECT COUNT(*)
		FROM user_srs_reviews r
		JOIN exercises e ON e.id = r.exercise_id
		WHERE r.user_id = NULLIF($1, '')::uuid
		  AND r.repetition_count >= 3
	`
	var count int
	err := r.db.Pool.QueryRow(ctx, query, userID).Scan(&count)
	if err != nil {
		return 0, fmt.Errorf("failed to count mastered srs reviews: %w", err)
	}
	return count, nil
}

func prepareExamAttemptFields(attempt *ReadinessExamAttempt) (map[string]any, []byte, int) {
	report := attempt.AnalysisReport
	if report == nil {
		report = make(map[string]any)
	}
	reportJSON, err := json.Marshal(report)
	if err != nil {
		reportJSON = []byte("{}")
	}

	overall := attempt.OverallScore
	if overall == 0 && attempt.ScorePercent > 0 {
		overall = attempt.ScorePercent
	}
	if attempt.AttemptedAt.IsZero() {
		attempt.AttemptedAt = time.Now().UTC()
	}
	return report, reportJSON, overall
}

const insertExamAttemptQuery = `
	INSERT INTO readiness_exam_attempts (
		user_id, level_id, reading_score, listening_score, writing_score, speaking_score, overall_score, is_passed, analysis_report, attempted_at
	) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
	RETURNING id
`

// CreateExamAttempt records a completed diagnostic mock exam submission
func (r *PostgresRepository) CreateExamAttempt(ctx context.Context, attempt *ReadinessExamAttempt) error {
	if attempt == nil {
		return apperror.ErrBadRequest
	}
	if err := apperror.ValidateUserUUID(attempt.UserID); err != nil {
		return err
	}
	if err := apperror.ValidateEntityUUID(attempt.LevelID); err != nil {
		return err
	}
	report, reportJSON, overall := prepareExamAttemptFields(attempt)

	err := r.db.Pool.QueryRow(
		ctx, insertExamAttemptQuery,
		attempt.UserID, attempt.LevelID,
		attempt.ReadingScore, attempt.ListeningScore, attempt.WritingScore, attempt.SpeakingScore,
		overall, attempt.IsPassed, reportJSON, attempt.AttemptedAt,
	).Scan(&attempt.ID)
	if err != nil {
		return fmt.Errorf("failed to insert readiness exam attempt: %w", err)
	}
	attempt.OverallScore = overall
	attempt.ScorePercent = overall
	attempt.AnalysisReport = report
	return nil
}

var (
	_ TransactionalExamRecorder   = (*PostgresRepository)(nil)
	_ TransactionalSRSReviewer    = (*PostgresRepository)(nil)
	_ TransactionalDueSRSReviewer = (*PostgresRepository)(nil)
	_ TotalDueSRSReader           = (*PostgresRepository)(nil)
	_ SRSMasteryCounter           = (*PostgresRepository)(nil)
)

// RecordExamSubmissionTx atomically guards against duplicate passed exams, inserts the attempt,
// and advances the active enrollment proficiency level inside a single database transaction.
func (r *PostgresRepository) RecordExamSubmissionTx(
	ctx context.Context,
	attempt *ReadinessExamAttempt,
	enrollmentID string,
	expectedLevelID string,
	nextLevelID string,
) (bool, error) {
	if attempt == nil {
		return false, apperror.ErrBadRequest
	}
	if err := apperror.ValidateUserUUID(attempt.UserID); err != nil {
		return false, err
	}
	if err := apperror.ValidateEntityUUID(attempt.LevelID); err != nil {
		return false, err
	}
	report, reportJSON, overall := prepareExamAttemptFields(attempt)

	tx, err := r.db.Pool.Begin(ctx)
	if err != nil {
		return false, fmt.Errorf("failed to begin exam submission transaction: %w", err)
	}
	defer func() {
		_ = tx.Rollback(ctx)
	}()

	if _, err := tx.Exec(ctx, "SELECT pg_advisory_xact_lock(hashtextextended($1 || ':' || $2, 0))", attempt.UserID, attempt.LevelID); err != nil {
		return false, fmt.Errorf("failed to acquire exam lock: %w", err)
	}

	var alreadyPassed bool
	if err := tx.QueryRow(
		ctx,
		`SELECT EXISTS(SELECT 1 FROM readiness_exam_attempts WHERE user_id = $1 AND level_id = $2::uuid AND is_passed = true)`,
		attempt.UserID, attempt.LevelID,
	).Scan(&alreadyPassed); err != nil {
		return false, fmt.Errorf("failed to verify existing passed exam inside tx: %w", err)
	}
	if alreadyPassed {
		return false, ErrExamAlreadyPassed
	}

	if err := tx.QueryRow(
		ctx, insertExamAttemptQuery,
		attempt.UserID, attempt.LevelID,
		attempt.ReadingScore, attempt.ListeningScore, attempt.WritingScore, attempt.SpeakingScore,
		overall, attempt.IsPassed, reportJSON, attempt.AttemptedAt,
	).Scan(&attempt.ID); err != nil {
		return false, fmt.Errorf("failed to insert readiness exam attempt: %w", err)
	}

	levelAdvanced := false
	if attempt.IsPassed && enrollmentID != "" && expectedLevelID != "" && nextLevelID != "" {
		tag, err := tx.Exec(
			ctx,
			`UPDATE user_language_enrollments SET current_level_id = $2 WHERE id = $1 AND current_level_id = $3`,
			enrollmentID, nextLevelID, expectedLevelID,
		)
		if err != nil {
			return false, fmt.Errorf("failed to advance enrollment level: %w", err)
		}
		levelAdvanced = tag.RowsAffected() > 0
	}

	if err := tx.Commit(ctx); err != nil {
		return false, fmt.Errorf("failed to commit exam submission transaction: %w", err)
	}

	attempt.OverallScore = overall
	attempt.ScorePercent = overall
	attempt.AnalysisReport = report
	return levelAdvanced, nil
}

const examAttemptSelectFrom = `
	SELECT 
		a.id, a.user_id, a.level_id, a.reading_score, a.listening_score, a.writing_score, a.speaking_score, a.overall_score,
		a.is_passed, a.analysis_report, a.attempted_at,
		pl.id, pl.language_id, pl.code, pl.name, pl.tier, pl.official_exam_name, pl.passing_score_percent, pl.order_index, pl.created_at
	FROM readiness_exam_attempts a
	JOIN proficiency_levels pl ON a.level_id = pl.id
`

func scanExamAttemptRow(scanner interface{ Scan(dest ...any) error }) (*ReadinessExamAttempt, error) {
	var a ReadinessExamAttempt
	var pl language.ProficiencyLevel
	var reportJSON []byte

	if err := scanner.Scan(
		&a.ID, &a.UserID, &a.LevelID,
		&a.ReadingScore, &a.ListeningScore, &a.WritingScore, &a.SpeakingScore, &a.OverallScore,
		&a.IsPassed, &reportJSON, &a.AttemptedAt,
		&pl.ID, &pl.LanguageID, &pl.Code, &pl.Name, &pl.Tier, &pl.OfficialExamName, &pl.PassingScorePercent, &pl.OrderIndex, &pl.CreatedAt,
	); err != nil {
		return nil, err
	}
	a.AnalysisReport = unmarshalJSONMap(reportJSON, fmt.Sprintf("exam analysis_report (%s)", a.ID))
	if maxScore, ok := extractReportInt(a.AnalysisReport, "max_score"); ok && maxScore > 0 {
		a.MaxScore = maxScore
	}
	a.ScorePercent = a.OverallScore
	a.Level = &pl
	return &a, nil
}

// GetLatestPassedAttempt retrieves the most recent passed exam for certificate rendering
func (r *PostgresRepository) GetLatestPassedAttempt(ctx context.Context, userID string, levelID string) (*ReadinessExamAttempt, error) {
	if err := apperror.ValidateUserUUID(userID); err != nil {
		return nil, err
	}
	if err := apperror.ValidateEntityUUID(levelID); err != nil {
		return nil, err
	}
	query := examAttemptSelectFrom + `
		WHERE a.user_id = NULLIF($1, '')::uuid AND a.level_id = NULLIF($2, '')::uuid AND a.is_passed = true
		ORDER BY a.attempted_at DESC, a.id ASC
		LIMIT 1
	`
	a, err := scanExamAttemptRow(r.db.Pool.QueryRow(ctx, query, userID, levelID))
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to query latest passed exam attempt: %w", err)
	}
	return a, nil
}

