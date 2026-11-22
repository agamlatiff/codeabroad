package flashcard

import (
	"context"
	"strings"
	"time"

	"merantalk/backend/internal/app/gamification"
	"merantalk/backend/internal/app/user"
	"merantalk/backend/internal/shared/apperror"
	"merantalk/backend/internal/shared/progression"
)

const (
	defaultLanguageCode  = "ja"
	defaultDueLimit      = 20
	maxDueLimit          = 50
	defaultDeckPageLimit = 12
	maxDeckPageLimit     = 30
)

// BadgeAwarder is a narrow dependency for unlocking flashcard mastery achievement badges.
type BadgeAwarder interface {
	AwardBadge(ctx context.Context, userID string, badgeKey string, newLevel int) (*gamification.UserBadge, error)
}

type atomicXPActivityRecorder interface {
	RecordXPActivity(ctx context.Context, userID string, activityType string, baseXP int, applyXPBooster bool, metadata map[string]any) (xpAwarded int, newXP int, newLevel int, newStreak int, err error)
}

type usecase struct {
	repo         Repository
	userRepo     user.Repository
	badgeAwarder BadgeAwarder
}

// NewUsecase creates a new flashcard domain usecase.
func NewUsecase(repo Repository, userRepo user.Repository) Usecase {
	return &usecase{
		repo:     repo,
		userRepo: userRepo,
	}
}

// NewUsecaseWithBadges creates a flashcard usecase capable of awarding achievement badges.
func NewUsecaseWithBadges(repo Repository, userRepo user.Repository, badgeAwarder BadgeAwarder) Usecase {
	return &usecase{
		repo:         repo,
		userRepo:     userRepo,
		badgeAwarder: badgeAwarder,
	}
}

func normalizeLanguageCode(languageCode string) string {
	trimmed := strings.ToLower(strings.TrimSpace(languageCode))
	if trimmed == "" {
		return defaultLanguageCode
	}
	return trimmed
}

func normalizeJLPTLevelFilter(level string) string {
	trimmed := strings.ToUpper(strings.TrimSpace(level))
	if trimmed == "" || trimmed == "ALL" || trimmed == "SEMUA" {
		return ""
	}
	return trimmed
}

func normalizeCategoryFilter(category string) string {
	trimmed := strings.ToLower(strings.TrimSpace(category))
	if trimmed == "" || trimmed == "all" || trimmed == "semua" {
		return ""
	}
	return trimmed
}

func (u *usecase) ListDecks(ctx context.Context, userID string, languageCode string, jlptLevel string) ([]Deck, error) {
	if userID == "" {
		return nil, apperror.ErrUnauthorized
	}
	return u.repo.ListDecks(ctx, userID, normalizeLanguageCode(languageCode), normalizeJLPTLevelFilter(jlptLevel))
}

func (u *usecase) ListDecksPaginated(ctx context.Context, userID string, filter DeckListFilter) (*PaginatedDecksResponse, error) {
	if userID == "" {
		return nil, apperror.ErrUnauthorized
	}

	limit := filter.Limit
	if limit <= 0 {
		limit = defaultDeckPageLimit
	} else if limit > maxDeckPageLimit {
		limit = maxDeckPageLimit
	}

	normalized := DeckListFilter{
		LanguageCode: normalizeLanguageCode(filter.LanguageCode),
		JLPTLevel:    normalizeJLPTLevelFilter(filter.JLPTLevel),
		Category:     normalizeCategoryFilter(filter.Category),
		Search:       strings.TrimSpace(filter.Search),
		Cursor:       strings.TrimSpace(filter.Cursor),
		Limit:        limit,
	}

	if normalized.Cursor != "" {
		sortOrder, id, err := DecodeDeckCursor(normalized.Cursor)
		if err != nil {
			return nil, err
		}
		normalized.CursorSort = sortOrder
		normalized.CursorID = id
		normalized.HasCursor = true
	}

	res, err := u.repo.ListDecksPaginated(ctx, userID, normalized)
	if err != nil {
		return nil, err
	}
	if res.Items == nil {
		res.Items = []Deck{}
	}
	if res.LevelCounts == nil {
		res.LevelCounts = map[string]int{
			"ALL": 0,
			"N5":  0,
			"N4":  0,
			"N3":  0,
			"N2":  0,
			"N1":  0,
		}
	}
	return res, nil
}

func (u *usecase) GetDeck(ctx context.Context, userID string, deckID string) (*DeckDetailResponse, error) {
	if userID == "" {
		return nil, apperror.ErrUnauthorized
	}
	if strings.TrimSpace(deckID) == "" {
		return nil, apperror.ErrBadRequest
	}
	return u.repo.GetDeckWithCards(ctx, userID, strings.TrimSpace(deckID))
}

func (u *usecase) GetDueQueue(ctx context.Context, userID string, languageCode string, limit int) (*DueQueueResponse, error) {
	if userID == "" {
		return nil, apperror.ErrUnauthorized
	}
	if limit <= 0 {
		limit = defaultDueLimit
	} else if limit > maxDueLimit {
		limit = maxDueLimit
	}
	return u.repo.ListDueCards(ctx, userID, normalizeLanguageCode(languageCode), limit)
}

func (u *usecase) ReviewCard(ctx context.Context, userID string, cardID string, quality int) (*ReviewCardResponse, error) {
	if userID == "" {
		return nil, apperror.ErrUnauthorized
	}
	trimmedCardID := strings.TrimSpace(cardID)
	if trimmedCardID == "" {
		return nil, apperror.ErrBadRequest
	}
	if quality < 0 || quality > 5 {
		return nil, ErrInvalidQualityRating
	}

	exists, err := u.repo.CardExists(ctx, trimmedCardID)
	if err != nil {
		return nil, err
	}
	if !exists {
		return nil, ErrCardNotFound
	}

	prev, err := u.repo.GetCardProgress(ctx, userID, trimmedCardID)
	if err != nil {
		return nil, err
	}

	prevReps := 0
	prevInterval := 0
	prevEase := 2.5
	if prev != nil {
		prevReps = prev.Repetitions
		prevInterval = prev.IntervalDays
		prevEase = prev.EaseFactor
	}

	now := time.Now().UTC()
	sm2 := CalculateSM2(quality, prevReps, prevInterval, prevEase, now)

	if err := u.repo.UpsertCardProgress(ctx, &CardProgress{
		UserID:         userID,
		CardID:         trimmedCardID,
		EaseFactor:     sm2.EaseFactor,
		IntervalDays:   sm2.IntervalDays,
		Repetitions:    sm2.Repetitions,
		NextReviewAt:   sm2.NextReviewAt,
		LastReviewedAt: now,
	}); err != nil {
		return nil, err
	}

	xpAwarded := 5
	if quality < 3 {
		xpAwarded = 2
	}

	currentStreak := 0
	currentLevel := 0
	if u.userRepo != nil {
		meta := map[string]any{
			"card_id": trimmedCardID,
			"quality": quality,
		}
		if recorder, ok := u.userRepo.(atomicXPActivityRecorder); ok {
			awarded, _, lvl, streak, recErr := recorder.RecordXPActivity(ctx, userID, "srs_review_completed", xpAwarded, true, meta)
			if recErr != nil {
				return nil, recErr
			}
			xpAwarded = awarded
			currentLevel = lvl
			currentStreak = streak
		} else if usr, err := u.userRepo.GetByID(ctx, userID); err == nil && usr != nil {
			boosterActive := usr.XPBoosterExpiresAt != nil && usr.XPBoosterExpiresAt.After(now)
			if boosterActive {
				xpAwarded *= 2
			}
			meta["xp_booster_applied"] = boosterActive
			_ = u.userRepo.LogActivity(ctx, &user.UserActivityLog{
				UserID:       userID,
				ActivityType: "srs_review_completed",
				XPEarned:     xpAwarded,
				Metadata:     meta,
			})

			refreshedUser := usr
			if latest, getErr := u.userRepo.GetByID(ctx, userID); getErr == nil && latest != nil {
				refreshedUser = latest
			} else {
				refreshedUser.Streak, _ = progression.EvaluateDailyStreak(usr.LastActiveAt, usr.Streak, now)
			}
			newXP := refreshedUser.XP + xpAwarded
			newLevel := progression.CalculateLevel(newXP)
			currentStreak = refreshedUser.Streak
			currentLevel = newLevel
			_ = u.userRepo.UpdateGamification(ctx, userID, newXP, newLevel, refreshedUser.Streak, &now)
		}
	}

	if u.badgeAwarder != nil {
		if currentStreak >= 7 {
			_, _ = u.badgeAwarder.AwardBadge(ctx, userID, "streak_7", currentLevel)
		}
		if currentStreak >= 30 {
			_, _ = u.badgeAwarder.AwardBadge(ctx, userID, "streak_30", currentLevel)
		}
		if quality >= 3 {
			if masteredCount, countErr := u.repo.CountMasteredCards(ctx, userID); countErr == nil && masteredCount >= 25 {
				_, _ = u.badgeAwarder.AwardBadge(ctx, userID, "srs_veteran", currentLevel)
			}
		}
	}

	return &ReviewCardResponse{
		CardID:       trimmedCardID,
		EaseFactor:   sm2.EaseFactor,
		IntervalDays: sm2.IntervalDays,
		Repetitions:  sm2.Repetitions,
		NextReviewAt: sm2.NextReviewAt,
		XPAwarded:    xpAwarded,
	}, nil
}
