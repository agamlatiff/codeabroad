package flashcard

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"strings"

	"merantalk/backend/infrastructure/postgres"
	"merantalk/backend/internal/shared/apperror"
	"github.com/jackc/pgx/v5"
)

type postgresRepository struct {
	db *postgres.PostgresDB
}

// NewRepository creates a PostgreSQL-backed flashcard repository.
func NewRepository(db *postgres.PostgresDB) Repository {
	return &postgresRepository{db: db}
}

const deckSelectFromClause = `
		SELECT
			d.id::text,
			COALESCE(d.slug, '') AS db_slug,
			d.language_code,
			d.title,
			d.description,
			d.category,
			d.icon_name,
			d.accent_color,
			d.jlpt_level,
			d.sort_order,
			COUNT(c.id)::int AS total_cards,
			GREATEST(COUNT(c.id) - COUNT(p.id), 0)::int AS new_cards,
			COUNT(p.id)::int AS learned_cards,
			COUNT(CASE WHEN p.id IS NOT NULL AND p.next_review_at <= NOW() THEN 1 END)::int AS due_cards,
			COUNT(CASE WHEN p.id IS NOT NULL AND p.next_review_at > NOW() THEN 1 END)::int AS scheduled_cards,
			COALESCE((
				SELECT json_agg(
					json_build_object(
						'id', s.id::text,
						'front_text', s.front_text,
						'reading', s.reading,
						'back_meaning', s.back_meaning,
						'status', s.status
					)
					ORDER BY s.sort_order ASC, s.created_at ASC
				)
				FROM (
					SELECT
						fc.id,
						fc.front_text,
						fc.reading,
						fc.back_meaning,
						CASE
							WHEN ufp.id IS NULL THEN 'new'
							WHEN ufp.next_review_at <= NOW() OR ufp.repetitions = 0 THEN 'due'
							ELSE 'mastered'
						END AS status,
						fc.sort_order,
						fc.created_at
					FROM flashcard_cards fc
					LEFT JOIN user_flashcard_progress ufp
						ON ufp.card_id = fc.id AND ufp.user_id = $1::uuid
					WHERE fc.deck_id = d.id
					ORDER BY fc.sort_order ASC, fc.created_at ASC
					LIMIT 4
				) s
			), '[]'::json) AS sample_cards,
			d.created_at
		FROM flashcard_decks d
		LEFT JOIN flashcard_cards c ON c.deck_id = d.id
		LEFT JOIN user_flashcard_progress p ON p.card_id = c.id AND p.user_id = $1::uuid
`

type rowScanner interface {
	Scan(dest ...any) error
}

func scanDeckRow(scanner rowScanner) (Deck, error) {
	var d Deck
	var dbSlug string
	var sampleCardsRaw []byte
	err := scanner.Scan(
		&d.ID,
		&dbSlug,
		&d.LanguageCode,
		&d.Title,
		&d.Description,
		&d.Category,
		&d.IconName,
		&d.AccentColor,
		&d.JLPTLevel,
		&d.SortOrder,
		&d.TotalCards,
		&d.NewCards,
		&d.LearnedCards,
		&d.DueCards,
		&d.ScheduledCards,
		&sampleCardsRaw,
		&d.CreatedAt,
	)
	if strings.TrimSpace(dbSlug) != "" {
		d.Slug = strings.TrimSpace(dbSlug)
	} else {
		d.Slug = SlugifyDeckTitle(d.Title)
	}
	d.SampleCards = []SampleCard{}
	if err == nil && len(sampleCardsRaw) > 0 {
		_ = json.Unmarshal(sampleCardsRaw, &d.SampleCards)
	}
	return d, err
}

func (r *postgresRepository) ListDecks(ctx context.Context, userID string, languageCode string, jlptLevel string) ([]Deck, error) {
	query := deckSelectFromClause + `
		WHERE d.language_code = $2
		  AND ($3 = '' OR UPPER(d.jlpt_level) = UPPER($3))
		GROUP BY d.id
		ORDER BY d.sort_order ASC, d.id ASC
	`

	rows, err := r.db.Pool.Query(ctx, query, userID, languageCode, jlptLevel)
	if err != nil {
		return nil, fmt.Errorf("list flashcard decks: %w", err)
	}
	defer rows.Close()

	decks := make([]Deck, 0, 30)
	for rows.Next() {
		d, err := scanDeckRow(rows)
		if err != nil {
			return nil, fmt.Errorf("scan flashcard deck: %w", err)
		}
		decks = append(decks, d)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate flashcard decks: %w", err)
	}
	return decks, nil
}

func appendDeckCategoryAndSearchClauses(clauses []string, args []any, filter DeckListFilter) ([]string, []any) {
	if filter.Category != "" {
		if filter.Category == "vocab" {
			clauses = append(clauses, "LOWER(d.category) NOT IN ('hiragana', 'katakana', 'kanji')")
		} else {
			args = append(args, filter.Category)
			clauses = append(clauses, fmt.Sprintf("LOWER(d.category) = $%d", len(args)))
		}
	}
	if filter.Search != "" {
		args = append(args, "%"+filter.Search+"%")
		idx := len(args)
		clauses = append(
			clauses,
			fmt.Sprintf("(d.title ILIKE $%d OR d.description ILIKE $%d OR d.jlpt_level ILIKE $%d)", idx, idx, idx),
		)
	}
	return clauses, args
}

func (r *postgresRepository) queryDeckLevelCounts(ctx context.Context, filter DeckListFilter) (map[string]int, error) {
	counts := map[string]int{
		"ALL": 0,
		"N5":  0,
		"N4":  0,
		"N3":  0,
		"N2":  0,
		"N1":  0,
	}

	clauses := []string{"d.language_code = $1"}
	args := []any{filter.LanguageCode}
	clauses, args = appendDeckCategoryAndSearchClauses(clauses, args, filter)

	query := `
		SELECT UPPER(d.jlpt_level) AS lvl, COUNT(*)::int AS cnt
		FROM flashcard_decks d
		WHERE ` + strings.Join(clauses, " AND ") + `
		GROUP BY UPPER(d.jlpt_level)
	`

	rows, err := r.db.Pool.Query(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("count flashcard decks by level: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var lvl string
		var cnt int
		if err := rows.Scan(&lvl, &cnt); err != nil {
			return nil, fmt.Errorf("scan flashcard deck level count: %w", err)
		}
		counts["ALL"] += cnt
		if _, ok := counts[lvl]; ok {
			counts[lvl] = cnt
		}
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate flashcard deck level counts: %w", err)
	}
	return counts, nil
}

func (r *postgresRepository) ListDecksPaginated(ctx context.Context, userID string, filter DeckListFilter) (*PaginatedDecksResponse, error) {
	levelCounts, err := r.queryDeckLevelCounts(ctx, filter)
	if err != nil {
		return nil, err
	}

	totalCount := levelCounts["ALL"]
	if filter.JLPTLevel != "" {
		totalCount = levelCounts[strings.ToUpper(filter.JLPTLevel)]
	}

	clauses := []string{"d.language_code = $2"}
	args := []any{userID, filter.LanguageCode}

	if filter.JLPTLevel != "" {
		args = append(args, strings.ToUpper(filter.JLPTLevel))
		clauses = append(clauses, fmt.Sprintf("d.jlpt_level = $%d", len(args)))
	}
	clauses, args = appendDeckCategoryAndSearchClauses(clauses, args, filter)

	if filter.HasCursor {
		args = append(args, filter.CursorSort, filter.CursorID)
		sortIdx := len(args) - 1
		idIdx := len(args)
		clauses = append(clauses, fmt.Sprintf("(d.sort_order, d.id) > ($%d, $%d::uuid)", sortIdx, idIdx))
	}

	args = append(args, filter.Limit+1)
	limitIdx := len(args)

	query := deckSelectFromClause + `
		WHERE ` + strings.Join(clauses, " AND ") + `
		GROUP BY d.id
		ORDER BY d.sort_order ASC, d.id ASC
		LIMIT $` + fmt.Sprintf("%d", limitIdx)

	rows, err := r.db.Pool.Query(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("list paginated flashcard decks: %w", err)
	}
	defer rows.Close()

	decks := make([]Deck, 0, filter.Limit)
	for rows.Next() {
		d, err := scanDeckRow(rows)
		if err != nil {
			return nil, fmt.Errorf("scan paginated flashcard deck: %w", err)
		}
		decks = append(decks, d)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate paginated flashcard decks: %w", err)
	}

	var nextCursor *string
	hasMore := len(decks) > filter.Limit
	if hasMore {
		decks = decks[:filter.Limit]
		last := decks[len(decks)-1]
		encoded := EncodeDeckCursor(last.SortOrder, last.ID)
		nextCursor = &encoded
	}

	return &PaginatedDecksResponse{
		Items:       decks,
		NextCursor:  nextCursor,
		HasMore:     hasMore,
		TotalCount:  totalCount,
		LevelCounts: levelCounts,
	}, nil
}

func (r *postgresRepository) resolveDeckUUID(ctx context.Context, deckIDOrSlug string) (string, error) {
	trimmed := strings.TrimSpace(deckIDOrSlug)
	if trimmed == "" {
		return "", ErrDeckNotFound
	}
	if apperror.ValidateEntityUUID(trimmed) == nil {
		return trimmed, nil
	}

	normalized := strings.ToLower(trimmed)
	var directID string
	err := r.db.Pool.QueryRow(
		ctx,
		`SELECT id::text FROM flashcard_decks WHERE LOWER(COALESCE(slug, '')) = $1 LIMIT 1`,
		normalized,
	).Scan(&directID)
	if err == nil && directID != "" {
		return directID, nil
	}

	rows, err := r.db.Pool.Query(
		ctx,
		`SELECT id::text, title, category FROM flashcard_decks ORDER BY sort_order ASC, created_at ASC`,
	)
	if err != nil {
		return "", fmt.Errorf("resolve flashcard deck slug: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var id, title, category string
		if scanErr := rows.Scan(&id, &title, &category); scanErr != nil {
			return "", fmt.Errorf("scan flashcard deck slug row: %w", scanErr)
		}
		if SlugifyDeckTitle(title) == normalized || strings.EqualFold(category, normalized) {
			return id, nil
		}
	}
	if err := rows.Err(); err != nil {
		return "", fmt.Errorf("iterate flashcard deck slug rows: %w", err)
	}
	return "", ErrDeckNotFound
}

func (r *postgresRepository) GetDeckWithCards(ctx context.Context, userID string, deckID string) (*DeckDetailResponse, error) {
	resolvedDeckID, err := r.resolveDeckUUID(ctx, deckID)
	if err != nil {
		return nil, err
	}

	deckQuery := deckSelectFromClause + `
		WHERE d.id = $2::uuid
		GROUP BY d.id
	`

	deck, err := scanDeckRow(r.db.Pool.QueryRow(ctx, deckQuery, userID, resolvedDeckID))
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrDeckNotFound
		}
		return nil, fmt.Errorf("get flashcard deck: %w", err)
	}

	cardsQuery := `
		SELECT
			c.id::text,
			c.deck_id::text,
			c.front_text,
			c.reading,
			c.back_meaning,
			c.part_of_speech,
			c.sort_order,
			COALESCE(p.ease_factor, 2.5),
			COALESCE(p.interval_days, 0),
			COALESCE(p.repetitions, 0),
			p.next_review_at,
			p.last_reviewed_at
		FROM flashcard_cards c
		LEFT JOIN user_flashcard_progress p ON p.card_id = c.id AND p.user_id = $1::uuid
		WHERE c.deck_id = $2::uuid
		ORDER BY c.sort_order ASC, c.created_at ASC
	`

	rows, err := r.db.Pool.Query(ctx, cardsQuery, userID, resolvedDeckID)
	if err != nil {
		return nil, fmt.Errorf("list deck cards: %w", err)
	}
	defer rows.Close()

	cards := make([]Card, 0)
	for rows.Next() {
		var c Card
		if err := rows.Scan(
			&c.ID,
			&c.DeckID,
			&c.FrontText,
			&c.Reading,
			&c.BackMeaning,
			&c.PartOfSpeech,
			&c.SortOrder,
			&c.EaseFactor,
			&c.IntervalDays,
			&c.Repetitions,
			&c.NextReviewAt,
			&c.LastReviewedAt,
		); err != nil {
			return nil, fmt.Errorf("scan deck card: %w", err)
		}
		cards = append(cards, c)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate deck cards: %w", err)
	}

	return &DeckDetailResponse{
		Deck:  deck,
		Cards: cards,
	}, nil
}

func (r *postgresRepository) ListDueCards(ctx context.Context, userID string, languageCode string, limit int) (*DueQueueResponse, error) {
	statsQuery := `
		SELECT
			COUNT(p.id)::int AS total_learned,
			COUNT(CASE WHEN p.next_review_at <= NOW() THEN 1 END)::int AS total_due
		FROM user_flashcard_progress p
		INNER JOIN flashcard_cards c ON c.id = p.card_id
		INNER JOIN flashcard_decks d ON d.id = c.deck_id
		WHERE p.user_id = $1::uuid AND d.language_code = $2
	`
	var totalLearned, totalDue int
	if err := r.db.Pool.QueryRow(ctx, statsQuery, userID, languageCode).Scan(&totalLearned, &totalDue); err != nil {
		return nil, fmt.Errorf("count due flashcards: %w", err)
	}

	cardsQuery := `
		SELECT
			c.id::text,
			c.deck_id::text,
			c.front_text,
			c.reading,
			c.back_meaning,
			c.part_of_speech,
			c.sort_order,
			p.ease_factor,
			p.interval_days,
			p.repetitions,
			p.next_review_at,
			p.last_reviewed_at
		FROM user_flashcard_progress p
		INNER JOIN flashcard_cards c ON c.id = p.card_id
		INNER JOIN flashcard_decks d ON d.id = c.deck_id
		WHERE p.user_id = $1::uuid
		  AND d.language_code = $2
		  AND p.next_review_at <= NOW()
		ORDER BY p.next_review_at ASC
		LIMIT $3
	`

	rows, err := r.db.Pool.Query(ctx, cardsQuery, userID, languageCode, limit)
	if err != nil {
		return nil, fmt.Errorf("list due flashcards: %w", err)
	}
	defer rows.Close()

	cards := make([]Card, 0)
	for rows.Next() {
		var c Card
		if err := rows.Scan(
			&c.ID,
			&c.DeckID,
			&c.FrontText,
			&c.Reading,
			&c.BackMeaning,
			&c.PartOfSpeech,
			&c.SortOrder,
			&c.EaseFactor,
			&c.IntervalDays,
			&c.Repetitions,
			&c.NextReviewAt,
			&c.LastReviewedAt,
		); err != nil {
			return nil, fmt.Errorf("scan due flashcard: %w", err)
		}
		cards = append(cards, c)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate due flashcards: %w", err)
	}

	return &DueQueueResponse{
		TotalDue:     totalDue,
		TotalLearned: totalLearned,
		Cards:        cards,
	}, nil
}

func (r *postgresRepository) CardExists(ctx context.Context, cardID string) (bool, error) {
	var exists bool
	err := r.db.Pool.QueryRow(
		ctx,
		`SELECT EXISTS(SELECT 1 FROM flashcard_cards WHERE id = $1::uuid)`,
		cardID,
	).Scan(&exists)
	if err != nil {
		return false, fmt.Errorf("check flashcard exists: %w", err)
	}
	return exists, nil
}

func (r *postgresRepository) GetCardProgress(ctx context.Context, userID string, cardID string) (*CardProgress, error) {
	query := `
		SELECT
			user_id::text,
			card_id::text,
			ease_factor,
			interval_days,
			repetitions,
			next_review_at,
			COALESCE(last_reviewed_at, NOW())
		FROM user_flashcard_progress
		WHERE user_id = $1::uuid AND card_id = $2::uuid
	`
	var p CardProgress
	err := r.db.Pool.QueryRow(ctx, query, userID, cardID).Scan(
		&p.UserID,
		&p.CardID,
		&p.EaseFactor,
		&p.IntervalDays,
		&p.Repetitions,
		&p.NextReviewAt,
		&p.LastReviewedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("get flashcard progress: %w", err)
	}
	return &p, nil
}

func (r *postgresRepository) UpsertCardProgress(ctx context.Context, progress *CardProgress) error {
	query := `
		INSERT INTO user_flashcard_progress (
			user_id,
			card_id,
			ease_factor,
			interval_days,
			repetitions,
			next_review_at,
			last_reviewed_at,
			updated_at
		) VALUES ($1::uuid, $2::uuid, $3, $4, $5, $6, $7, NOW())
		ON CONFLICT (user_id, card_id)
		DO UPDATE SET
			ease_factor = EXCLUDED.ease_factor,
			interval_days = EXCLUDED.interval_days,
			repetitions = EXCLUDED.repetitions,
			next_review_at = EXCLUDED.next_review_at,
			last_reviewed_at = EXCLUDED.last_reviewed_at,
			updated_at = NOW()
	`
	_, err := r.db.Pool.Exec(
		ctx,
		query,
		progress.UserID,
		progress.CardID,
		progress.EaseFactor,
		progress.IntervalDays,
		progress.Repetitions,
		progress.NextReviewAt,
		progress.LastReviewedAt,
	)
	if err != nil {
		return fmt.Errorf("upsert flashcard progress: %w", err)
	}

	// Bidirectional sync: reviewing a pure character card (Hiragana/Katakana/Kanji) updates /kana mastery too.
	incCorrect := 0
	initScore := 10
	scoreDelta := -10
	if progress.Repetitions > 0 {
		incCorrect = 1
		initScore = 50
		scoreDelta = 35
	}
	kanaSyncQuery := `
		INSERT INTO user_kana_progress (user_id, character, practice_count, correct_count, mastery_score, is_mastered, last_practiced_at)
		SELECT $1::uuid, kc.character, 1, $3, $4, false, NOW()
		FROM flashcard_cards fc
		JOIN flashcard_decks fd ON fd.id = fc.deck_id
		JOIN kana_characters kc ON kc.character = fc.front_text
		WHERE fc.id = $2::uuid
		  AND fd.category IN ('hiragana', 'katakana', 'kanji')
		ON CONFLICT (user_id, character)
		DO UPDATE SET
			practice_count    = user_kana_progress.practice_count + 1,
			correct_count     = user_kana_progress.correct_count + EXCLUDED.correct_count,
			mastery_score     = LEAST(100, GREATEST(0, user_kana_progress.mastery_score + $5)),
			is_mastered       = (
				LEAST(100, GREATEST(0, user_kana_progress.mastery_score + $5)) >= 70
				OR (user_kana_progress.correct_count + EXCLUDED.correct_count) >= 2
			),
			last_practiced_at = NOW()
	`
	_, _ = r.db.Pool.Exec(ctx, kanaSyncQuery, progress.UserID, progress.CardID, incCorrect, initScore, scoreDelta)
	return nil
}
