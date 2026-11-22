package flashcard

import (
	"context"
	"encoding/base64"
	"errors"
	"testing"
	"time"

	"merantalk/backend/internal/app/gamification"
	"merantalk/backend/internal/app/user"
	"merantalk/backend/internal/shared/apperror"
)

type stubFlashcardRepo struct {
	lastFilter    DeckListFilter
	decks         []Deck
	cardExists    bool
	masteredCount int
}

func (s *stubFlashcardRepo) ListDecks(_ context.Context, _ string, _ string, _ string) ([]Deck, error) {
	return s.decks, nil
}

func (s *stubFlashcardRepo) ListDecksPaginated(_ context.Context, _ string, filter DeckListFilter) (*PaginatedDecksResponse, error) {
	s.lastFilter = filter

	start := 0
	if filter.HasCursor {
		for i, d := range s.decks {
			if d.SortOrder > filter.CursorSort || (d.SortOrder == filter.CursorSort && d.ID > filter.CursorID) {
				start = i
				break
			}
			if i == len(s.decks)-1 {
				start = len(s.decks)
			}
		}
	}

	end := start + filter.Limit
	hasMore := false
	if end < len(s.decks) {
		hasMore = true
	} else {
		end = len(s.decks)
	}

	items := s.decks[start:end]
	var nextCursor *string
	if hasMore && len(items) > 0 {
		last := items[len(items)-1]
		c := EncodeDeckCursor(last.SortOrder, last.ID)
		nextCursor = &c
	}

	return &PaginatedDecksResponse{
		Items:      items,
		NextCursor: nextCursor,
		HasMore:    hasMore,
		TotalCount: len(s.decks),
		LevelCounts: map[string]int{
			"ALL": len(s.decks),
			"N5":  len(s.decks),
			"N4":  0,
			"N3":  0,
			"N2":  0,
			"N1":  0,
		},
	}, nil
}

func (s *stubFlashcardRepo) GetDeckWithCards(_ context.Context, _ string, _ string) (*DeckDetailResponse, error) {
	return nil, ErrDeckNotFound
}

func (s *stubFlashcardRepo) ListDueCards(_ context.Context, _ string, _ string, _ int) (*DueQueueResponse, error) {
	return &DueQueueResponse{}, nil
}

func (s *stubFlashcardRepo) CardExists(_ context.Context, _ string) (bool, error) {
	return s.cardExists, nil
}

func (s *stubFlashcardRepo) GetCardProgress(_ context.Context, _ string, _ string) (*CardProgress, error) {
	return nil, nil
}

func (s *stubFlashcardRepo) UpsertCardProgress(_ context.Context, _ *CardProgress) error {
	return nil
}

func (s *stubFlashcardRepo) CountMasteredCards(_ context.Context, _ string) (int, error) {
	return s.masteredCount, nil
}

type stubBadgeAwarder struct {
	awardedKeys []string
}

func (s *stubBadgeAwarder) AwardBadge(_ context.Context, _ string, badgeKey string, _ int) (*gamification.UserBadge, error) {
	s.awardedKeys = append(s.awardedKeys, badgeKey)
	return &gamification.UserBadge{BadgeKey: badgeKey, NewlyAwarded: true}, nil
}

func TestDeckCursorRoundtripAndValidation(t *testing.T) {
	const deckUUID = "f1000001-0000-0000-0000-000000000012"
	encoded := EncodeDeckCursor(12, deckUUID)

	sortOrder, id, err := DecodeDeckCursor(encoded)
	if err != nil {
		t.Fatalf("expected valid cursor decode, got err: %v", err)
	}
	if sortOrder != 12 || id != deckUUID {
		t.Fatalf("unexpected decoded cursor (%d, %s)", sortOrder, id)
	}

	invalidCases := []string{
		"!!!not-base64!!!",
		base64.RawURLEncoding.EncodeToString([]byte("invalidformat")),
		base64.RawURLEncoding.EncodeToString([]byte("abc:" + deckUUID)),
		base64.RawURLEncoding.EncodeToString([]byte("12:not-a-uuid")),
		base64.RawURLEncoding.EncodeToString([]byte("12:")),
	}

	for _, tc := range invalidCases {
		if _, _, err := DecodeDeckCursor(tc); !errors.Is(err, ErrInvalidCursor) {
			t.Fatalf("expected ErrInvalidCursor for %q, got %v", tc, err)
		}
	}
}

func TestListDecksPaginated_NormalizationClampingAndPaging(t *testing.T) {
	decks := []Deck{
		{ID: "f1000001-0000-0000-0000-000000000001", SortOrder: 1, Title: "Deck 1", JLPTLevel: "N5"},
		{ID: "f1000001-0000-0000-0000-000000000002", SortOrder: 2, Title: "Deck 2", JLPTLevel: "N5"},
		{ID: "f1000001-0000-0000-0000-000000000003", SortOrder: 3, Title: "Deck 3", JLPTLevel: "N5"},
	}

	repo := &stubFlashcardRepo{decks: decks}
	uc := NewUsecase(repo, nil)

	if _, err := uc.ListDecksPaginated(context.Background(), "", DeckListFilter{}); !errors.Is(err, apperror.ErrUnauthorized) {
		t.Fatalf("expected ErrUnauthorized for empty userID, got %v", err)
	}

	res, err := uc.ListDecksPaginated(context.Background(), "user-1", DeckListFilter{
		LanguageCode: " ",
		JLPTLevel:    " all ",
		Category:     " VOCAB ",
		Search:       "  salam  ",
		Limit:        0,
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if repo.lastFilter.LanguageCode != "ja" || repo.lastFilter.JLPTLevel != "" || repo.lastFilter.Category != "vocab" || repo.lastFilter.Search != "salam" {
		t.Fatalf("unexpected normalized filter: %+v", repo.lastFilter)
	}
	if repo.lastFilter.Limit != defaultDeckPageLimit {
		t.Fatalf("expected default limit %d, got %d", defaultDeckPageLimit, repo.lastFilter.Limit)
	}
	if len(res.Items) != 3 || res.HasMore {
		t.Fatalf("expected all 3 items and HasMore=false, got len=%d hasMore=%v", len(res.Items), res.HasMore)
	}

	// Verify max limit clamp
	if _, err := uc.ListDecksPaginated(context.Background(), "user-1", DeckListFilter{Limit: 999}); err != nil {
		t.Fatalf("unexpected error with large limit: %v", err)
	}
	if repo.lastFilter.Limit != maxDeckPageLimit {
		t.Fatalf("expected clamped limit %d, got %d", maxDeckPageLimit, repo.lastFilter.Limit)
	}

	// Verify cursor slicing
	page1, err := uc.ListDecksPaginated(context.Background(), "user-1", DeckListFilter{Limit: 2})
	if err != nil {
		t.Fatalf("page1 error: %v", err)
	}
	if len(page1.Items) != 2 || !page1.HasMore || page1.NextCursor == nil {
		t.Fatalf("expected 2 items with next cursor on page 1, got len=%d hasMore=%v", len(page1.Items), page1.HasMore)
	}

	page2, err := uc.ListDecksPaginated(context.Background(), "user-1", DeckListFilter{Limit: 2, Cursor: *page1.NextCursor})
	if err != nil {
		t.Fatalf("page2 error: %v", err)
	}
	if len(page2.Items) != 1 || page2.HasMore || page2.Items[0].ID != decks[2].ID {
		t.Fatalf("expected final item on page 2, got %+v", page2)
	}

	if _, err := uc.ListDecksPaginated(context.Background(), "user-1", DeckListFilter{Cursor: "broken"}); !errors.Is(err, ErrInvalidCursor) {
		t.Fatalf("expected ErrInvalidCursor on broken cursor, got %v", err)
	}
}

func TestReviewCard_XPBoosterAndSRSVeteranBadge(t *testing.T) {
	fcRepo := &stubFlashcardRepo{cardExists: true, masteredCount: 25}
	uRepo := user.NewMockRepository()
	future := time.Now().UTC().Add(10 * time.Minute)
	uRepo.Users["user-1"] = &user.User{
		UserAccount: user.UserAccount{ID: "user-1", Email: "learner@merantalk.id"},
		UserGamificationStats: user.UserGamificationStats{
			XP:                 100,
			CurrentLevel:       2,
			Streak:             3,
			XPBoosterExpiresAt: &future,
		},
	}
	awarder := &stubBadgeAwarder{}
	uc := NewUsecaseWithBadges(fcRepo, uRepo, awarder)

	res, err := uc.ReviewCard(context.Background(), "user-1", "card-1", 4)
	if err != nil {
		t.Fatalf("expected ReviewCard to succeed, got %v", err)
	}
	if res.XPAwarded != 10 {
		t.Fatalf("expected 10 XP with active 2x xp-booster, got %d", res.XPAwarded)
	}
	if uRepo.Users["user-1"].XP != 110 {
		t.Fatalf("expected user XP updated to 110, got %d", uRepo.Users["user-1"].XP)
	}
	if len(awarder.awardedKeys) != 1 || awarder.awardedKeys[0] != "srs_veteran" {
		t.Fatalf("expected srs_veteran badge awarded, got %+v", awarder.awardedKeys)
	}
}
