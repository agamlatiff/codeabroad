package curriculum

import (
	"context"
	"errors"
	"fmt"
	"log"
	"sort"
	"strings"
	"sync"
	"time"

	"merantalk/backend/internal/app/exercise"
	"merantalk/backend/internal/app/gamification"
	"merantalk/backend/internal/app/language"
	"merantalk/backend/internal/app/user"
	"merantalk/backend/internal/shared/apperror"
	"golang.org/x/sync/singleflight"
)

type activeLanguageCache interface {
	GetActiveLanguage(ctx context.Context, userID string) (string, error)
	SetActiveLanguage(ctx context.Context, userID string, languageID string, ttl time.Duration) error
}

type usecase struct {
	curriculumRepo   Repository
	langRepo         language.Repository
	exerciseRepo     exercise.Repository
	userRepo         user.Repository
	gamificationRepo gamification.Repository
	cacheRepo        CurriculumCacheRepository
	helper           *Helper
	sfGroup          singleflight.Group
}

// NewUsecaseWithCache creates a new Curriculum Usecase instance with curriculum Redis caching support
func NewUsecaseWithCache(
	curriculumRepo Repository,
	langRepo language.Repository,
	exerciseRepo exercise.Repository,
	userRepo user.Repository,
	gamificationRepo gamification.Repository,
	cacheRepo CurriculumCacheRepository,
) Usecase {
	return &usecase{
		curriculumRepo:   curriculumRepo,
		langRepo:         langRepo,
		exerciseRepo:     exerciseRepo,
		userRepo:         userRepo,
		gamificationRepo: gamificationRepo,
		cacheRepo:        cacheRepo,
		helper:           NewHelper(),
	}
}

// NewUsecase creates a new Curriculum Usecase instance without caching
func NewUsecase(
	curriculumRepo Repository,
	langRepo language.Repository,
	exerciseRepo exercise.Repository,
	userRepo user.Repository,
	gamificationRepo gamification.Repository,
) Usecase {
	return NewUsecaseWithCache(curriculumRepo, langRepo, exerciseRepo, userRepo, gamificationRepo, nil)
}

func sortProficiencyLevels(levels []language.ProficiencyLevel) []language.ProficiencyLevel {
	sorted := make([]language.ProficiencyLevel, len(levels))
	copy(sorted, levels)
	sort.Slice(sorted, func(i, j int) bool {
		if sorted[i].OrderIndex != sorted[j].OrderIndex {
			return sorted[i].OrderIndex < sorted[j].OrderIndex
		}
		return sorted[i].ID < sorted[j].ID
	})
	return sorted
}

func (u *usecase) isUserPro(ctx context.Context, userID string) bool {
	if userID == "" || u.userRepo == nil {
		return false
	}
	usr, err := u.userRepo.GetByID(ctx, userID)
	return err == nil && usr != nil && usr.IsPro()
}

func (u *usecase) hydrateEnrollment(ctx context.Context, enr *language.UserLanguageEnrollment) (*language.UserLanguageEnrollment, error) {
	if enr == nil {
		return nil, language.ErrEnrollmentNotFound
	}
	copyEnr := *enr
	if copyEnr.Language == nil && copyEnr.LanguageID != "" {
		lang, lErr := u.langRepo.GetLanguageByID(ctx, copyEnr.LanguageID)
		if lErr == nil && lang != nil {
			copyEnr.Language = lang
		} else if lErr != nil && !errors.Is(lErr, language.ErrLanguageNotFound) {
			return nil, lErr
		}
	}
	if copyEnr.CurrentLevel == nil && copyEnr.CurrentLevelID != nil && *copyEnr.CurrentLevelID != "" {
		lvl, lvErr := u.langRepo.GetLevelByID(ctx, *copyEnr.CurrentLevelID)
		if lvErr == nil && lvl != nil {
			copyEnr.CurrentLevel = lvl
		} else if lvErr != nil && !errors.Is(lvErr, language.ErrProficiencyLevelNotFound) {
			return nil, lvErr
		}
	}
	// Fallback for nullable current_level_id (ERD ON DELETE SET NULL) when the referenced level was removed
	if copyEnr.CurrentLevel == nil && copyEnr.LanguageID != "" {
		levels, lErr := u.langRepo.GetLevelsByLanguageID(ctx, copyEnr.LanguageID)
		if lErr != nil {
			return nil, lErr
		}
		if len(levels) > 0 {
			sorted := sortProficiencyLevels(levels)
			fallback := sorted[0]
			copyEnr.CurrentLevel = &fallback
			copyEnr.CurrentLevelID = &fallback.ID
			if copyEnr.ID != "" {
				if updErr := u.langRepo.UpdateEnrollmentLevel(ctx, copyEnr.ID, fallback.ID); updErr != nil {
					log.Printf("curriculum: failed to persist fallback level %s for enrollment %s: %v", fallback.ID, copyEnr.ID, updErr)
				}
			}
		}
	}
	return &copyEnr, nil
}

func (u *usecase) resolveEnrollmentForCurriculum(ctx context.Context, userID string, languageID string) (*language.UserLanguageEnrollment, error) {
	enrollment, err := u.langRepo.GetActiveEnrollment(ctx, userID, languageID)
	if err == nil && enrollment != nil {
		return u.hydrateEnrollment(ctx, enrollment)
	}
	if languageID == "" || !errors.Is(err, language.ErrEnrollmentNotFound) {
		return nil, err
	}

	enrollments, listErr := u.langRepo.GetEnrollmentsByUserID(ctx, userID)
	if listErr != nil {
		return nil, listErr
	}
	for i := range enrollments {
		if enrollments[i].LanguageID == languageID {
			return u.hydrateEnrollment(ctx, &enrollments[i])
		}
	}
	return nil, language.ErrEnrollmentNotFound
}

func (u *usecase) resolveGuestEnrollment(ctx context.Context, languageID string) (*language.UserLanguageEnrollment, error) {
	if u.langRepo == nil {
		return nil, language.ErrLanguageNotFound
	}
	var selectedLang *language.Language
	if languageID != "" {
		lang, err := u.langRepo.GetLanguageByID(ctx, languageID)
		if err != nil {
			return nil, err
		}
		if lang == nil {
			return nil, language.ErrLanguageNotFound
		}
		if !lang.IsActive {
			return nil, language.ErrLanguageNotActive
		}
		selectedLang = lang
	} else {
		langs, err := u.langRepo.GetAllLanguages(ctx, true)
		if err != nil {
			return nil, err
		}
		for i := range langs {
			if strings.EqualFold(langs[i].Code, "ja") {
				selectedLang = &langs[i]
				break
			}
		}
		if selectedLang == nil && len(langs) > 0 {
			selectedLang = &langs[0]
		}
		if selectedLang == nil {
			return nil, language.ErrLanguageNotFound
		}
	}

	levels, err := u.langRepo.GetLevelsByLanguageID(ctx, selectedLang.ID)
	if err != nil {
		return nil, err
	}
	if len(levels) == 0 {
		return nil, language.ErrProficiencyLevelNotFound
	}
	sorted := sortProficiencyLevels(levels)
	lvl := sorted[0]
	return &language.UserLanguageEnrollment{
		LanguageID:     selectedLang.ID,
		Language:       selectedLang,
		CurrentLevelID: &lvl.ID,
		CurrentLevel:   &lvl,
		IsActive:       true,
	}, nil
}

func applyGuestCurriculumUnlocks(units []UnitNodeResponse) *string {
	var firstLessonID *string
	for i := range units {
		isTrialUnit := i == 0
		units[i].IsUnlocked = isTrialUnit
		for j := range units[i].Lessons {
			units[i].Lessons[j].IsUnlocked = isTrialUnit
			if isTrialUnit && firstLessonID == nil {
				id := units[i].Lessons[j].ID
				firstLessonID = &id
			}
		}
	}
	return firstLessonID
}

// requiredTierForLevel maps a proficiency level code to its access tier:
// N5 (beginner) -> "guest", N4/N3 -> "free" (login required), N2/N1 -> "pro" (paid subscription).
func requiredTierForLevel(levelCode string) string {
	switch strings.ToUpper(strings.TrimSpace(levelCode)) {
	case "", "N5", "A1", "HSK1", "TOPIK1":
		return "guest"
	case "N4", "N3", "A2", "B1", "HSK2", "HSK3", "TOPIK2", "TOPIK3":
		return "free"
	case "N2", "N1", "B2", "C1", "C2", "HSK4", "HSK5", "HSK6", "TOPIK4", "TOPIK5", "TOPIK6":
		return "pro"
	default:
		return "free"
	}
}

func (u *usecase) checkLevelAccess(ctx context.Context, userID string, levelCode string) error {
	tier := requiredTierForLevel(levelCode)
	if tier == "guest" {
		return nil
	}
	if userID == "" {
		return apperror.NewUnauthorizedError(
			"LOGIN_REQUIRED_FOR_LEVEL",
			fmt.Sprintf("Masuk atau daftar gratis untuk membuka materi level %s.", strings.ToUpper(strings.TrimSpace(levelCode))),
		)
	}
	if tier == "pro" {
		normalizedCode := strings.ToUpper(strings.TrimSpace(levelCode))
		if u.userRepo == nil {
			return apperror.NewForbiddenError(
				"PRO_REQUIRED_FOR_LEVEL",
				fmt.Sprintf("Upgrade ke Merantalk Pro untuk membuka materi level %s.", normalizedCode),
				map[string]any{"required_tier": "pro", "level_code": normalizedCode},
			)
		}
		usr, err := u.userRepo.GetByID(ctx, userID)
		if err != nil {
			return fmt.Errorf("failed to verify user subscription tier: %w", err)
		}
		if usr == nil || !usr.IsPro() {
			return apperror.NewForbiddenError(
				"PRO_REQUIRED_FOR_LEVEL",
				fmt.Sprintf("Upgrade ke Merantalk Pro untuk membuka materi level %s.", normalizedCode),
				map[string]any{"required_tier": "pro", "level_code": normalizedCode},
			)
		}
	}
	return nil
}

// GetCurriculum retrieves the full active language curriculum tree with calculated unit unlocks
func (u *usecase) GetCurriculum(ctx context.Context, userID string, req *GetCurriculumRequest) (*CurriculumResponse, error) {
	languageID := ""
	levelCode := ""
	if req != nil {
		languageID = req.LanguageID
		levelCode = strings.ToUpper(strings.TrimSpace(req.LevelCode))
	}

	sfKeyPrefix := userID
	if sfKeyPrefix == "" {
		sfKeyPrefix = "guest"
	}
	sfKey := fmt.Sprintf("%s:%s:%s", sfKeyPrefix, languageID, levelCode)
	val, err, _ := u.sfGroup.Do(sfKey, func() (any, error) {
		return u.getCurriculumInternal(ctx, userID, languageID, levelCode)
	})
	if err != nil {
		return nil, err
	}
	if val == nil {
		return nil, language.ErrEnrollmentNotFound
	}
	return val.(*CurriculumResponse), nil
}

func (u *usecase) getCurriculumInternal(ctx context.Context, userID string, languageID string, levelCode string) (*CurriculumResponse, error) {
	isGuest := userID == ""
	hasExplicitLevel := levelCode != ""

	// Capture cache version epoch BEFORE reading Postgres or checking Redis active_lang cache
	// so concurrent level-up/completion invalidations cannot let stale data populate the new epoch.
	cacheVer := ""
	canCache := false
	if !isGuest && !hasExplicitLevel && u.cacheRepo != nil {
		ver, verErr := u.cacheRepo.GetCurriculumVersion(ctx, userID)
		if verErr != nil {
			log.Printf("curriculum: failed to read curriculum cache version for user %s: %v", userID, verErr)
		} else if ver != "" {
			cacheVer = ver
			canCache = true
		}
	}

	// Fast Redis-first hit path when active language ID is known in Redis
	var activeCache activeLanguageCache
	if canCache {
		if ac, ok := u.cacheRepo.(activeLanguageCache); ok {
			activeCache = ac
			if cachedActiveLangID, acErr := activeCache.GetActiveLanguage(ctx, userID); acErr == nil && cachedActiveLangID != "" {
				if languageID == "" || languageID == cachedActiveLangID {
					cached, _, cacheErr := u.cacheRepo.GetCurriculumWithVersion(ctx, userID, cachedActiveLangID)
					if cacheErr != nil {
						log.Printf("curriculum: failed to read curriculum cache for user %s: %v", userID, cacheErr)
						canCache = false
					} else if cached != nil {
						return cached, nil
					}
				}
			}
		}
	}

	var (
		enrollment *language.UserLanguageEnrollment
		err        error
	)
	if isGuest {
		enrollment, err = u.resolveGuestEnrollment(ctx, languageID)
	} else {
		enrollment, err = u.resolveEnrollmentForCurriculum(ctx, userID, languageID)
	}
	if err != nil {
		return nil, err
	}
	if enrollment == nil || enrollment.Language == nil {
		return nil, language.ErrEnrollmentNotFound
	}
	if enrollment.CurrentLevel == nil {
		return nil, language.ErrProficiencyLevelNotFound
	}

	// Load all proficiency levels for this language so clients can render the N5-N1 switcher
	var availableLevels []language.ProficiencyLevel
	if allLvls, lvlErr := u.langRepo.GetLevelsByLanguageID(ctx, enrollment.Language.ID); lvlErr == nil && len(allLvls) > 0 {
		availableLevels = sortProficiencyLevels(allLvls)
	}

	selectedLevel := *enrollment.CurrentLevel
	if hasExplicitLevel {
		matched := false
		for i := range availableLevels {
			if strings.EqualFold(availableLevels[i].Code, levelCode) {
				selectedLevel = availableLevels[i]
				matched = true
				break
			}
		}
		if !matched {
			return nil, language.ErrProficiencyLevelNotFound
		}
		if accessErr := u.checkLevelAccess(ctx, userID, selectedLevel.Code); accessErr != nil {
			return nil, accessErr
		}
	}

	// Lookup cached curriculum for active tracks only; preserve the pre-DB cacheVer on miss.
	if !isGuest && !hasExplicitLevel && u.cacheRepo != nil && enrollment.IsActive && canCache {
		cached, _, cacheErr := u.cacheRepo.GetCurriculumWithVersion(ctx, userID, enrollment.Language.ID)
		if cacheErr != nil {
			log.Printf("curriculum: failed to read curriculum cache for user %s: %v", userID, cacheErr)
			canCache = false
		} else if cached != nil {
			if activeCache != nil {
				_ = activeCache.SetActiveLanguage(ctx, userID, enrollment.Language.ID, curriculumCacheBaseTTL)
			}
			return cached, nil
		}
	} else {
		canCache = false
	}

	var (
		units     []UnitNodeResponse
		lessons   []LessonNodeResponse
		unitsErr  error
		lessonErr error
		wg        sync.WaitGroup
	)
	wg.Add(2)
	go func() {
		defer wg.Done()
		units, unitsErr = u.curriculumRepo.GetUnitsByLevelID(ctx, selectedLevel.ID, userID)
	}()
	go func() {
		defer wg.Done()
		lessons, lessonErr = u.curriculumRepo.GetLessonsByLevelID(ctx, selectedLevel.ID, userID)
	}()
	wg.Wait()

	if unitsErr != nil {
		return nil, fmt.Errorf("failed to query units for level: %w", unitsErr)
	}
	if lessonErr != nil {
		return nil, fmt.Errorf("failed to batch query lessons for level: %w", lessonErr)
	}

	lessonsByUnit := make(map[string][]LessonNodeResponse, len(units))
	for _, lesson := range lessons {
		lessonsByUnit[lesson.UnitID] = append(lessonsByUnit[lesson.UnitID], lesson)
	}

	for i := range units {
		unitLessons := lessonsByUnit[units[i].ID]
		if unitLessons == nil {
			unitLessons = []LessonNodeResponse{}
		}
		units[i].Lessons = unitLessons
		units[i].TotalLessons = len(unitLessons)
		units[i].CompletedLessons = 0
		for _, l := range unitLessons {
			if l.IsCompleted {
				units[i].CompletedLessons++
			}
		}
	}

	unlockedUnits, totalLessons, completedLessons, progressPercent, currentLessonID := u.helper.CalculateCurriculumUnlocks(units)
	if unlockedUnits == nil {
		unlockedUnits = []UnitNodeResponse{}
	}
	if isGuest {
		currentLessonID = applyGuestCurriculumUnlocks(unlockedUnits)
	} else if !enrollment.IsActive {
		for i := range unlockedUnits {
			unlockedUnits[i].IsUnlocked = false
			for j := range unlockedUnits[i].Lessons {
				unlockedUnits[i].Lessons[j].IsUnlocked = false
			}
		}
		currentLessonID = nil
	} else if u.isUserPro(ctx, userID) {
		var firstLessonID *string
		var firstUncompletedID *string
		for i := range unlockedUnits {
			unlockedUnits[i].IsUnlocked = true
			for j := range unlockedUnits[i].Lessons {
				unlockedUnits[i].Lessons[j].IsUnlocked = true
				if firstLessonID == nil {
					id := unlockedUnits[i].Lessons[j].ID
					firstLessonID = &id
				}
				if !unlockedUnits[i].Lessons[j].IsCompleted && firstUncompletedID == nil {
					id := unlockedUnits[i].Lessons[j].ID
					firstUncompletedID = &id
				}
			}
		}
		if firstUncompletedID != nil {
			currentLessonID = firstUncompletedID
		} else if firstLessonID != nil {
			currentLessonID = firstLessonID
		}
	}

	res := &CurriculumResponse{
		Language:         *enrollment.Language,
		Level:            selectedLevel,
		AvailableLevels:  availableLevels,
		TotalLessons:     totalLessons,
		CompletedLessons: completedLessons,
		ProgressPercent:  progressPercent,
		CurrentLessonID:  currentLessonID,
		Units:            unlockedUnits,
	}

	// Cache curriculum response only if version lookup succeeded and epoch has not advanced during DB read
	if u.cacheRepo != nil && canCache {
		if setErr := u.cacheRepo.SetCurriculumIfVersion(ctx, userID, enrollment.Language.ID, cacheVer, res, 15*time.Minute); setErr != nil {
			log.Printf("curriculum: failed to cache curriculum for user %s: %v", userID, setErr)
		} else if activeCache != nil {
			_ = activeCache.SetActiveLanguage(ctx, userID, enrollment.Language.ID, 15*time.Minute)
		}
	}

	return res, nil
}

type lessonSlugResolver interface {
	ResolveLessonID(ctx context.Context, idOrSlug string) (string, error)
	GetLessonSlugByID(ctx context.Context, lessonID string) (*string, error)
}

type grammarLevelFilterRepository interface {
	GetGrammarPointsByLanguageCode(ctx context.Context, languageCode string, levelCode string) ([]GrammarPoint, error)
}

type kanaRepository interface {
	ListKanaWithProgress(ctx context.Context, userID string, script string) ([]KanaCharacterItem, error)
	RecordKanaPractice(ctx context.Context, userID string, results []KanaPracticeItem) (int, int, error)
}

type grammarProgressRepository interface {
	GetUserGrammarProgressMap(ctx context.Context, userID string) (map[string]UserGrammarProgress, error)
	RecordGrammarCheck(ctx context.Context, userID string, grammarPointIDOrCode string, correctCount int, totalQuestions int) (*SubmitGrammarCheckResponse, error)
}

type rawLessonExerciseReader interface {
	GetRawExercisesByLessonID(ctx context.Context, lessonID string) ([]exercise.Exercise, error)
}

// GetLessonDetail retrieves a lesson node and its child exercises for the learn workspace
// Supports both authenticated users and unauthenticated Unit-1 trial guests (userID == "").
func (u *usecase) GetLessonDetail(ctx context.Context, userID string, lessonID string) (*LessonDetailResponse, error) {
	if lessonID == "" {
		return nil, apperror.ErrBadRequest
	}

	resolvedLessonID := lessonID
	if resolver, ok := u.curriculumRepo.(lessonSlugResolver); ok {
		var rErr error
		resolvedLessonID, rErr = resolver.ResolveLessonID(ctx, lessonID)
		if rErr != nil {
			return nil, rErr
		}
	}

	lesson, err := u.curriculumRepo.GetLessonByID(ctx, resolvedLessonID, userID)
	if err != nil {
		return nil, err
	}
	if lesson == nil {
		return nil, ErrLessonNotFound
	}

	canonicalLessonID := lesson.ID
	if canonicalLessonID == "" {
		canonicalLessonID = lessonID
	}

	// Enforce tier access (N5 guest, N4-N3 free login, N2-N1 Pro) on direct lesson URLs
	if lesson.LevelID != "" && u.langRepo != nil {
		if lvl, lvlErr := u.langRepo.GetLevelByID(ctx, lesson.LevelID); lvlErr == nil && lvl != nil {
			if accessErr := u.checkLevelAccess(ctx, userID, lvl.Code); accessErr != nil {
				return nil, accessErr
			}
		}
	}

	if !lesson.IsUnlocked {
		unlocked, err := u.curriculumRepo.IsLessonUnlocked(ctx, userID, canonicalLessonID)
		if err != nil {
			return nil, fmt.Errorf("failed to verify lesson unlock status: %w", err)
		}
		if !unlocked && !u.isUserPro(ctx, userID) {
			return nil, ErrLessonLocked
		}
		lesson.IsUnlocked = true
	}

	var (
		exercises []exercise.Exercise
		exErr     error
		gps       []GrammarPoint
		gpErr     error
		wg        sync.WaitGroup
	)

	if u.exerciseRepo != nil {
		wg.Add(1)
		go func() {
			defer wg.Done()
			if !isCheckpointLessonSlug(lesson.Slug) {
				if rawReader, ok := u.exerciseRepo.(rawLessonExerciseReader); ok {
					exercises, exErr = rawReader.GetRawExercisesByLessonID(ctx, canonicalLessonID)
					return
				}
			}
			exercises, exErr = u.exerciseRepo.GetExercisesByLessonID(ctx, canonicalLessonID)
		}()
	}

	wg.Add(1)
	go func() {
		defer wg.Done()
		gps, gpErr = u.curriculumRepo.GetGrammarPointsByLessonID(ctx, canonicalLessonID)
	}()

	wg.Wait()

	if exErr != nil {
		return nil, fmt.Errorf("failed to query exercises for lesson: %w", exErr)
	}
	if gpErr != nil {
		return nil, fmt.Errorf("failed to query grammar points for lesson: %w", gpErr)
	}
	lesson.Exercises = exercise.SanitizeExercises(exercises)

	if len(gps) > 0 {
		lesson.GrammarPoints = gps
	} else {
		lesson.GrammarPoints = []GrammarPoint{}
	}

	lesson.StudyItems = buildLessonStudyItemsAndHints(lesson.Slug, exercises, lesson.Exercises, lesson.GrammarPoints)

	return lesson, nil
}

func (u *usecase) evaluateLessonBadges(ctx context.Context, userID string, payload *LessonCompletionPayload) ([]gamification.BadgeDefinition, int) {
	if u.gamificationRepo == nil || payload == nil {
		return nil, 0
	}

	// Always include first_step so transient post-commit failures self-heal on subsequent completions;
	// DB ON CONFLICT DO NOTHING guarantees first_step and streak badges cannot be double-awarded.
	candidates := []string{"first_step"}
	if payload.NewStreak >= 7 {
		candidates = append(candidates, "streak_7")
	}
	if payload.NewStreak >= 30 {
		candidates = append(candidates, "streak_30")
	}

	existingBadges, err := u.gamificationRepo.GetUserBadges(ctx, userID)
	if err != nil {
		log.Printf("curriculum: failed to query user badges for user %s: %v", userID, err)
		return nil, 0
	}
	owned := make(map[string]bool, len(existingBadges))
	for _, ub := range existingBadges {
		owned[ub.BadgeKey] = true
	}

	hasPendingCandidate := false
	for _, key := range candidates {
		if !owned[key] {
			hasPendingCandidate = true
			break
		}
	}
	if !hasPendingCandidate {
		return nil, 0
	}

	badgeDefByID := make(map[string]gamification.BadgeDefinition)
	if defs, defErr := u.gamificationRepo.GetBadges(ctx); defErr != nil {
		log.Printf("curriculum: failed to fetch badge definitions for user %s: %v", userID, defErr)
	} else {
		for _, def := range defs {
			badgeDefByID[def.ID] = def
		}
	}

	var awarded []gamification.BadgeDefinition
	extraXP := 0
	for _, key := range candidates {
		if owned[key] {
			continue
		}
		def := badgeDefByID[key]
		projectedLevel := u.helper.CalculateLevel(payload.NewXP + extraXP + def.XPReward)
		ub, awardErr := u.gamificationRepo.AwardBadge(ctx, userID, key, projectedLevel)
		if awardErr != nil {
			log.Printf("curriculum: failed to award badge %s to user %s: %v", key, userID, awardErr)
			continue
		}
		owned[key] = true
		if ub != nil && ub.Badge != nil && ub.NewlyAwarded {
			awarded = append(awarded, *ub.Badge)
			extraXP += ub.Badge.XPReward
		}
	}
	return awarded, extraXP
}

// CompleteLesson records lesson mastery, deposits XP rewards, and checks unit milestones
func (u *usecase) CompleteLesson(ctx context.Context, userID string, req *CompleteLessonRequest) (*CompleteLessonResponse, error) {
	if userID == "" {
		return nil, apperror.ErrUnauthorized
	}
	if req == nil || req.LessonID == "" {
		return nil, apperror.ErrBadRequest
	}

	resolvedLessonID := req.LessonID
	if resolver, ok := u.curriculumRepo.(lessonSlugResolver); ok {
		var rErr error
		resolvedLessonID, rErr = resolver.ResolveLessonID(ctx, req.LessonID)
		if rErr != nil {
			return nil, rErr
		}
	}

	now := time.Now().UTC()
	progress := &UserLessonProgress{
		UserID:      userID,
		LessonID:    resolvedLessonID,
		IsCompleted: true,
		Score:       req.Score,
		IsSkipped:   false,
		CompletedAt: now,
	}

	// Atomic Unit-of-Work: verify user, lesson eligibility, attempts, derived score, progress, gamification stats, and activity log under TX lock
	payload := &LessonCompletionPayload{
		Progress:     progress,
		LastActiveAt: now,
		ActivityType: "lesson_completed",
		Metadata:     map[string]any{"lesson_id": resolvedLessonID, "score": req.Score},
	}

	if err := u.curriculumRepo.RecordLessonCompletionTx(ctx, payload); err != nil {
		var domainErr *apperror.DomainError
		if errors.As(err, &domainErr) || errors.Is(err, user.ErrUserNotFound) {
			return nil, err
		}
		return nil, fmt.Errorf("failed to record lesson completion tx: %w", err)
	}

	canonicalLessonID := progress.LessonID
	if canonicalLessonID == "" {
		canonicalLessonID = req.LessonID
	}

	var nextLessonID *string
	if nextID, nextErr := u.curriculumRepo.GetNextLessonID(ctx, canonicalLessonID); nextErr != nil {
		log.Printf("curriculum: failed to resolve next lesson id after %s: %v", canonicalLessonID, nextErr)
	} else if nextID != nil {
		nextLessonID = nextID
	}

	// Automatically advance current_level_id only when no subsequent curriculum lesson remains in the current level
	if nextLessonID == nil {
		if advancedNextLessonID := u.maybeAdvanceEnrollmentLevel(ctx, userID, payload.UnitID, payload.LevelID, payload.UnitType); advancedNextLessonID != nil {
			nextLessonID = advancedNextLessonID
		}
	}

	// Invalidate user's cached curriculum atomically via epoch increment after any level advancement
	if u.cacheRepo != nil {
		if invErr := u.cacheRepo.InvalidateCurriculum(ctx, userID); invErr != nil {
			log.Printf("curriculum: failed to invalidate curriculum cache for user %s: %v", userID, invErr)
		}
	}

	awardedBadges, extraBadgeXP := u.evaluateLessonBadges(ctx, userID, payload)
	finalXP := payload.NewXP + extraBadgeXP
	finalLevel := u.helper.CalculateLevel(finalXP)
	finalStreak := payload.NewStreak
	finalGems := payload.NewGems
	if len(awardedBadges) > 0 && u.userRepo != nil {
		if refreshedUser, refErr := u.userRepo.GetByID(ctx, userID); refErr != nil {
			log.Printf("curriculum: failed to refresh user stats after awarding badges for user %s: %v", userID, refErr)
		} else if refreshedUser != nil {
			if refreshedUser.XP > finalXP {
				finalXP = refreshedUser.XP
				finalLevel = u.helper.CalculateLevel(finalXP)
			}
			if refreshedUser.CurrentLevel > finalLevel {
				finalLevel = refreshedUser.CurrentLevel
			}
			if refreshedUser.Streak > finalStreak {
				finalStreak = refreshedUser.Streak
			}
			if refreshedUser.Gems > finalGems {
				finalGems = refreshedUser.Gems
			}
		}
	}

	lastActive := payload.LastActiveAt
	if lastActive.IsZero() {
		lastActive = now
	}

	var nextLessonSlug *string
	if nextLessonID != nil {
		if resolver, ok := u.curriculumRepo.(lessonSlugResolver); ok {
			if s, sErr := resolver.GetLessonSlugByID(ctx, *nextLessonID); sErr == nil && s != nil && *s != "" {
				nextLessonSlug = s
			}
		}
	}

	sessionScore := payload.SessionScore
	return &CompleteLessonResponse{
		Progress:     *progress,
		SessionScore: &sessionScore,
		XPEarned:     payload.XPEarned,
		Gamification: user.UserGamificationStats{
			XP:           finalXP,
			CurrentLevel: finalLevel,
			Streak:       finalStreak,
			Gems:         finalGems,
			LastActiveAt: &lastActive,
		},
		UnlockedNextLessonID:   nextLessonID,
		UnlockedNextLessonSlug: nextLessonSlug,
		AwardedBadges:          awardedBadges,
	}, nil
}

func (u *usecase) maybeAdvanceEnrollmentLevel(ctx context.Context, userID string, unitID string, levelID string, unitType string) *string {
	if u.langRepo == nil || u.curriculumRepo == nil {
		return nil
	}

	if levelID == "" {
		if unitID == "" {
			return nil
		}
		unit, err := u.curriculumRepo.GetUnitByID(ctx, unitID)
		if err != nil || unit == nil || unit.LevelID == "" {
			return nil
		}
		levelID = unit.LevelID
		if unitType == "" {
			unitType = unit.UnitType
		}
	}
	if unitType != "" && unitType != "curriculum" {
		return nil
	}

	var targetEnrollment *language.UserLanguageEnrollment
	if activeEnr, actErr := u.langRepo.GetActiveEnrollment(ctx, userID, ""); actErr == nil && activeEnr != nil {
		if !activeEnr.IsActive || activeEnr.CurrentLevelID == nil || *activeEnr.CurrentLevelID != levelID {
			return nil
		}
		targetEnrollment = activeEnr
	} else {
		enrollments, err := u.langRepo.GetEnrollmentsByUserID(ctx, userID)
		if err != nil {
			return nil
		}
		for i := range enrollments {
			enr := &enrollments[i]
			if enr.IsActive && enr.CurrentLevelID != nil && *enr.CurrentLevelID == levelID {
				targetEnrollment = enr
				break
			}
		}
	}
	if targetEnrollment == nil {
		return nil
	}

	lessons, err := u.curriculumRepo.GetLessonsByLevelID(ctx, levelID, userID)
	if err != nil || len(lessons) == 0 {
		return nil
	}
	for _, l := range lessons {
		if !l.IsCompleted || l.Score < minLessonPassScore {
			return nil
		}
	}

	levels, err := u.langRepo.GetLevelsByLanguageID(ctx, targetEnrollment.LanguageID)
	if err != nil || len(levels) == 0 {
		return nil
	}
	sortedLevels := sortProficiencyLevels(levels)

	for i, lvl := range sortedLevels {
		if lvl.ID == levelID {
			if i+1 < len(sortedLevels) {
				nextLevel := sortedLevels[i+1]
				nextLessons, lErr := u.curriculumRepo.GetLessonsByLevelID(ctx, nextLevel.ID, userID)
				if lErr != nil || len(nextLessons) == 0 {
					return nil
				}
				if err := u.langRepo.UpdateEnrollmentLevelIfCurrent(ctx, targetEnrollment.ID, levelID, nextLevel.ID); err != nil {
					if !errors.Is(err, language.ErrEnrollmentLevelChanged) {
						log.Printf("curriculum: failed to advance enrollment level for user %s: %v", userID, err)
					}
					return nil
				}
				nextLessonID := nextLessons[0].ID
				return &nextLessonID
			}
			return nil
		}
	}
	return nil
}

// GetGrammarPoints retrieves active-language grammar reference points for a proficiency level.
// Grammar points serve as an open active-language reference (N5..N1) for both guests and logged-in users;
// authenticated users additionally receive personalized mastery and quiz progress enrichment.
func (u *usecase) GetGrammarPoints(ctx context.Context, userID string, levelID string) ([]GrammarPoint, error) {
	if levelID == "" {
		return nil, apperror.ErrBadRequest
	}

	lvl, err := u.langRepo.GetLevelByID(ctx, levelID)
	if err != nil {
		return nil, err
	}
	if lvl == nil {
		return nil, language.ErrProficiencyLevelNotFound
	}

	lang, lErr := u.langRepo.GetLanguageByID(ctx, lvl.LanguageID)
	if lErr != nil {
		return nil, lErr
	}
	if lang == nil {
		return nil, language.ErrLanguageNotFound
	}
	if !lang.IsActive {
		return nil, language.ErrLanguageNotActive
	}

	points, err := u.curriculumRepo.GetGrammarPointsByLevelID(ctx, levelID)
	if err != nil {
		return nil, err
	}
	if points == nil {
		points = []GrammarPoint{}
	}
	return u.enrichGrammarPointsWithUserProgress(ctx, userID, points), nil
}

// GetGrammarPointsByLevelFilter retrieves active-language grammar reference points across levels (N5..N1) or a specific level code.
func (u *usecase) GetGrammarPointsByLevelFilter(ctx context.Context, userID string, languageCode string, levelCode string) ([]GrammarPoint, error) {
	langCode := strings.ToLower(strings.TrimSpace(languageCode))
	if langCode == "" {
		langCode = "ja"
	}
	if u.langRepo != nil {
		langs, err := u.langRepo.GetAllLanguages(ctx, false)
		if err != nil {
			return nil, err
		}
		if len(langs) > 0 {
			var matched *language.Language
			for i := range langs {
				if strings.EqualFold(langs[i].Code, langCode) {
					matched = &langs[i]
					break
				}
			}
			if matched == nil {
				return nil, language.ErrLanguageNotFound
			}
			if !matched.IsActive {
				return nil, language.ErrLanguageNotActive
			}
		}
	}

	filterRepo, ok := u.curriculumRepo.(grammarLevelFilterRepository)
	if !ok {
		return []GrammarPoint{}, nil
	}
	points, err := filterRepo.GetGrammarPointsByLanguageCode(ctx, langCode, levelCode)
	if err != nil {
		return nil, err
	}
	if points == nil {
		points = []GrammarPoint{}
	}
	return u.enrichGrammarPointsWithUserProgress(ctx, userID, points), nil
}

func (u *usecase) enrichGrammarPointsWithUserProgress(ctx context.Context, userID string, points []GrammarPoint) []GrammarPoint {
	if userID == "" || len(points) == 0 {
		return points
	}
	progRepo, ok := u.curriculumRepo.(grammarProgressRepository)
	if !ok {
		return points
	}
	progMap, err := progRepo.GetUserGrammarProgressMap(ctx, userID)
	if err != nil || len(progMap) == 0 {
		return points
	}
	for i := range points {
		if st, exists := progMap[points[i].ID]; exists {
			points[i].IsUnderstood = st.IsUnderstood
			points[i].QuizScore = st.QuizScore
			points[i].AttemptsCount = st.AttemptsCount
			points[i].NextReviewAt = st.NextReviewAt
		}
	}
	return points
}

// SubmitGrammarCheck saves a user's interactive grammar understanding check score & SRS review schedule.
func (u *usecase) SubmitGrammarCheck(
	ctx context.Context,
	userID string,
	grammarPointIDOrCode string,
	req *SubmitGrammarCheckRequest,
) (*SubmitGrammarCheckResponse, error) {
	if userID == "" {
		return nil, apperror.ErrUnauthorized
	}
	if strings.TrimSpace(grammarPointIDOrCode) == "" || req == nil || req.TotalQuestions < 1 || req.CorrectCount < 0 || req.CorrectCount > req.TotalQuestions {
		return nil, apperror.ErrBadRequest
	}
	progRepo, ok := u.curriculumRepo.(grammarProgressRepository)
	if !ok {
		return &SubmitGrammarCheckResponse{}, nil
	}
	return progRepo.RecordGrammarCheck(ctx, userID, grammarPointIDOrCode, req.CorrectCount, req.TotalQuestions)
}

// GetKanaChart returns the Hiragana or Katakana Gojuon matrix annotated with user mastery stats (zeroed for guests).
func (u *usecase) GetKanaChart(ctx context.Context, userID string, script string) (*KanaChartResponse, error) {
	normalized := strings.ToLower(strings.TrimSpace(script))
	if normalized == "all" {
		normalized = ""
	}
	if normalized != "" && normalized != "hiragana" && normalized != "katakana" && normalized != "kanji" {
		return nil, apperror.ErrBadRequest
	}
	kRepo, ok := u.curriculumRepo.(kanaRepository)
	if !ok {
		return &KanaChartResponse{Script: normalized, Characters: []KanaCharacterItem{}}, nil
	}
	items, err := kRepo.ListKanaWithProgress(ctx, userID, normalized)
	if err != nil {
		return nil, err
	}
	if items == nil {
		items = []KanaCharacterItem{}
	}
	masteredCount := 0
	for _, item := range items {
		if item.IsMastered {
			masteredCount++
		}
	}
	respScript := normalized
	if respScript == "" {
		respScript = "all"
	}
	return &KanaChartResponse{
		Script:        respScript,
		Total:         len(items),
		MasteredCount: masteredCount,
		Characters:    items,
	}, nil
}

const maxKanaPracticeBatch = 200

// SubmitKanaPractice saves one or more Kana tracing or row-drill practice results.
func (u *usecase) SubmitKanaPractice(ctx context.Context, userID string, req *KanaPracticeRequest) (*KanaPracticeResponse, error) {
	if userID == "" {
		return nil, apperror.ErrUnauthorized
	}
	if req == nil || len(req.Results) == 0 {
		return nil, apperror.ErrBadRequest
	}
	if len(req.Results) > maxKanaPracticeBatch {
		return nil, apperror.NewBadRequestError(
			"KANA_PRACTICE_BATCH_TOO_LARGE",
			"jumlah hasil latihan kana maksimal 200 item per permintaan",
			nil,
		)
	}
	kRepo, ok := u.curriculumRepo.(kanaRepository)
	if !ok {
		return &KanaPracticeResponse{}, nil
	}
	updatedCount, masteredTotal, err := kRepo.RecordKanaPractice(ctx, userID, req.Results)
	if err != nil {
		return nil, err
	}
	return &KanaPracticeResponse{
		UpdatedCount:  updatedCount,
		MasteredTotal: masteredTotal,
	}, nil
}

