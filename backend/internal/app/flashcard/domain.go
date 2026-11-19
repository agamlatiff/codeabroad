package flashcard

import (
	"context"
	"math"
	"time"

	"codeabroad/backend/internal/shared/apperror"
)

// Domain errors for the flashcard bounded context.
var (
	ErrDeckNotFound         = apperror.NewNotFoundError("FLASHCARD_DECK_NOT_FOUND", "dek flashcard tidak ditemukan")
	ErrCardNotFound         = apperror.NewNotFoundError("FLASHCARD_CARD_NOT_FOUND", "kartu flashcard tidak ditemukan")
	ErrInvalidQualityRating = apperror.NewBadRequestError("INVALID_QUALITY_RATING", "rating ingatan harus antara 0 sampai 5", nil)
)

// SampleCard represents a compact preview card bundled with a flashcard deck for fanned UI previews.
type SampleCard struct {
	ID          string `json:"id"`
	FrontText   string `json:"front_text"`
	Reading     string `json:"reading"`
	BackMeaning string `json:"back_meaning"`
	Status      string `json:"status"`
}

// Deck represents a standalone topic flashcard deck with per-user Anki memory cycle counters.
type Deck struct {
	ID             string       `json:"id"`
	LanguageCode   string       `json:"language_code"`
	Title          string       `json:"title"`
	Description    string       `json:"description"`
	Category       string       `json:"category"`
	IconName       string       `json:"icon_name"`
	AccentColor    string       `json:"accent_color"`
	JLPTLevel      string       `json:"jlpt_level"`
	SortOrder      int          `json:"sort_order"`
	TotalCards     int          `json:"total_cards"`
	NewCards       int          `json:"new_cards"`
	LearnedCards   int          `json:"learned_cards"`
	DueCards       int          `json:"due_cards"`
	ScheduledCards int          `json:"scheduled_cards"`
	SampleCards    []SampleCard `json:"sample_cards"`
	CreatedAt      time.Time    `json:"created_at"`
}

// Card represents a single flashcard item with optional user SM-2 scheduling state.
type Card struct {
	ID             string     `json:"id"`
	DeckID         string     `json:"deck_id"`
	FrontText      string     `json:"front_text"`
	Reading        string     `json:"reading"`
	BackMeaning    string     `json:"back_meaning"`
	PartOfSpeech   string     `json:"part_of_speech"`
	SortOrder      int        `json:"sort_order"`
	EaseFactor     float64    `json:"ease_factor"`
	IntervalDays   int        `json:"interval_days"`
	Repetitions    int        `json:"repetitions"`
	NextReviewAt   *time.Time `json:"next_review_at,omitempty"`
	LastReviewedAt *time.Time `json:"last_reviewed_at,omitempty"`
}

// CardProgress holds the persisted SM-2 scheduling state for a user and card.
type CardProgress struct {
	UserID         string
	CardID         string
	EaseFactor     float64
	IntervalDays   int
	Repetitions    int
	NextReviewAt   time.Time
	LastReviewedAt time.Time
}

// DeckDetailResponse bundles a deck's metadata with all of its ordered cards.
type DeckDetailResponse struct {
	Deck  Deck   `json:"deck"`
	Cards []Card `json:"cards"`
}

// DueQueueResponse bundles the scheduled flashcard review queue and summary stats.
type DueQueueResponse struct {
	TotalDue     int    `json:"total_due"`
	TotalLearned int    `json:"total_learned"`
	Cards        []Card `json:"cards"`
}

// ReviewCardRequest represents the user's self-assessed recall quality (0..5).
type ReviewCardRequest struct {
	Quality *int `json:"quality"`
}

// ReviewCardResponse returns the updated SM-2 schedule and XP earned for a review.
type ReviewCardResponse struct {
	CardID       string    `json:"card_id"`
	EaseFactor   float64   `json:"ease_factor"`
	IntervalDays int       `json:"interval_days"`
	Repetitions  int       `json:"repetitions"`
	NextReviewAt time.Time `json:"next_review_at"`
	XPAwarded    int       `json:"xp_awarded"`
}

// SM2Result holds the computed SM-2 schedule values.
type SM2Result struct {
	EaseFactor   float64
	IntervalDays int
	Repetitions  int
	NextReviewAt time.Time
}

// CalculateSM2 computes the next Anki-modified SM-2 spaced-repetition schedule for a flashcard.
func CalculateSM2(quality int, prevReps int, prevInterval int, prevEase float64, now time.Time) SM2Result {
	if prevEase < 1.3 {
		prevEase = 2.5
	}

	var reps int
	var interval int
	var ease = prevEase
	var nextReviewAt time.Time

	switch {
	case quality < 3:
		// Again (Ulangi): reset repetition ladder and keep due inside current learning window.
		reps = 0
		interval = 1
		ease = prevEase - 0.20
		nextReviewAt = now.Add(1 * time.Minute)
	case quality == 3:
		// Hard (Susah): short 10m learning step for new cards; modest 1.2x multiplier for reviewed cards.
		if prevReps == 0 {
			reps = 1
			interval = 1
			nextReviewAt = now.Add(10 * time.Minute)
		} else {
			reps = prevReps
			baseInterval := prevInterval
			if baseInterval < 1 {
				baseInterval = 1
			}
			interval = int(math.Round(float64(baseInterval) * 1.2))
			if interval < 1 {
				interval = 1
			}
			nextReviewAt = now.Add(time.Duration(interval) * 24 * time.Hour)
		}
		ease = prevEase - 0.15
	case quality == 4:
		// Good (Ingat): classic 1d -> 3d -> interval * ease progression.
		reps = prevReps + 1
		switch reps {
		case 1:
			interval = 1
		case 2:
			interval = 3
		default:
			interval = int(math.Round(float64(prevInterval) * prevEase))
			if interval < 4 {
				interval = 4
			}
		}
		nextReviewAt = now.Add(time.Duration(interval) * 24 * time.Hour)
	default:
		// Easy (Mudah): immediate 4d jump for new cards, 1.3x bonus + ease boost for reviewed cards.
		reps = prevReps + 1
		if prevReps == 0 {
			interval = 4
		} else {
			interval = int(math.Round(float64(prevInterval) * prevEase * 1.3))
			if interval < 4 {
				interval = 4
			}
		}
		ease = prevEase + 0.15
		nextReviewAt = now.Add(time.Duration(interval) * 24 * time.Hour)
	}

	if ease < 1.3 {
		ease = 1.3
	}
	ease = math.Round(ease*100) / 100

	return SM2Result{
		EaseFactor:   ease,
		IntervalDays: interval,
		Repetitions:  reps,
		NextReviewAt: nextReviewAt,
	}
}

// Repository defines persistence operations for flashcard decks, cards, and user progress.
type Repository interface {
	ListDecks(ctx context.Context, userID string, languageCode string, jlptLevel string) ([]Deck, error)
	GetDeckWithCards(ctx context.Context, userID string, deckID string) (*DeckDetailResponse, error)
	ListDueCards(ctx context.Context, userID string, languageCode string, limit int) (*DueQueueResponse, error)
	CardExists(ctx context.Context, cardID string) (bool, error)
	GetCardProgress(ctx context.Context, userID string, cardID string) (*CardProgress, error)
	UpsertCardProgress(ctx context.Context, progress *CardProgress) error
}

// Usecase defines business operations for the hybrid flashcard feature.
type Usecase interface {
	ListDecks(ctx context.Context, userID string, languageCode string, jlptLevel string) ([]Deck, error)
	GetDeck(ctx context.Context, userID string, deckID string) (*DeckDetailResponse, error)
	GetDueQueue(ctx context.Context, userID string, languageCode string, limit int) (*DueQueueResponse, error)
	ReviewCard(ctx context.Context, userID string, cardID string, quality int) (*ReviewCardResponse, error)
}
