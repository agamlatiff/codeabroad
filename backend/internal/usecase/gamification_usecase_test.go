package usecase_test

import (
	"codeabroad/backend/internal/domain"
	"codeabroad/backend/internal/usecase"
	"context"
	"testing"
)

type mockGamificationRepository struct {
	status     *domain.GamificationStatus
	claimErr   error
	buyErr     error
	badgeErr   error
	coachErr   error
	lastSub    *domain.CoachingSubmission
	lastClaim  int
	lastBought string
}

func newMockGamificationRepository() *mockGamificationRepository {
	return &mockGamificationRepository{
		status: &domain.GamificationStatus{
			Gems: 100,
			Inventory: map[string]int{
				"streak-freeze":  1,
				"xp-booster":     0,
				"cv-review":      1,
				"mock-interview": 1,
			},
			ClaimedChests:       []int{},
			MonthlyBadgeClaimed: false,
		},
	}
}

func (m *mockGamificationRepository) GetStatus(ctx context.Context, userID string) (*domain.GamificationStatus, error) {
	return m.status, nil
}

func (m *mockGamificationRepository) ClaimDailyChest(ctx context.Context, userID string, tier int, gemsAwarded int, xpAwarded int) error {
	if m.claimErr != nil {
		return m.claimErr
	}
	m.lastClaim = tier
	m.status.ClaimedChests = append(m.status.ClaimedChests, tier)
	m.status.Gems += gemsAwarded
	return nil
}

func (m *mockGamificationRepository) BuyShopItem(ctx context.Context, userID string, itemID string, price int) (int, map[string]int, error) {
	if m.buyErr != nil {
		return 0, nil, m.buyErr
	}
	m.lastBought = itemID
	m.status.Gems -= price
	m.status.Inventory[itemID]++
	return m.status.Gems, m.status.Inventory, nil
}

func (m *mockGamificationRepository) ClaimMonthlyBadge(ctx context.Context, userID string, badgeKey string, title string, description string, icon string, gemReward int) error {
	if m.badgeErr != nil {
		return m.badgeErr
	}
	m.status.MonthlyBadgeClaimed = true
	m.status.Gems += gemReward
	return nil
}

func (m *mockGamificationRepository) CreateCoachingSubmission(ctx context.Context, userID string, sub *domain.CoachingSubmission) error {
	if m.coachErr != nil {
		return m.coachErr
	}
	m.lastSub = sub
	m.status.Inventory[sub.Type]--
	sub.ID = "sub-123"
	sub.Status = "in_review"
	return nil
}

func TestGamificationUsecase_GetStatus(t *testing.T) {
	repo := newMockGamificationRepository()
	u := usecase.NewGamificationUsecase(repo, nil)

	status, err := u.GetStatus(context.Background(), "user-1")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if status.Gems != 100 {
		t.Errorf("expected 100 gems, got %d", status.Gems)
	}
}

func TestGamificationUsecase_ClaimDailyChest(t *testing.T) {
	repo := newMockGamificationRepository()
	u := usecase.NewGamificationUsecase(repo, nil)

	// Valid claim tier 2
	status, gems, xp, err := u.ClaimDailyChest(context.Background(), "user-1", 2)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if gems != 15 || xp != 10 {
		t.Errorf("expected 15 gems & 10 xp, got %d gems & %d xp", gems, xp)
	}
	if status.Gems != 115 {
		t.Errorf("expected 115 total gems, got %d", status.Gems)
	}

	// Invalid tier
	_, _, _, err = u.ClaimDailyChest(context.Background(), "user-1", 5)
	if err == nil {
		t.Errorf("expected error for invalid tier, got nil")
	}
}

func TestGamificationUsecase_BuyShopItem(t *testing.T) {
	repo := newMockGamificationRepository()
	u := usecase.NewGamificationUsecase(repo, nil)

	status, err := u.BuyShopItem(context.Background(), "user-1", "streak-freeze")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if status.Gems != 80 {
		t.Errorf("expected 80 gems after buying streak-freeze, got %d", status.Gems)
	}
	if status.Inventory["streak-freeze"] != 2 {
		t.Errorf("expected 2 streak-freezes, got %d", status.Inventory["streak-freeze"])
	}

	// Invalid item
	_, err = u.BuyShopItem(context.Background(), "user-1", "magic-sword")
	if err == nil {
		t.Errorf("expected error for invalid item, got nil")
	}
}

func TestGamificationUsecase_ClaimMonthlyBadge(t *testing.T) {
	repo := newMockGamificationRepository()
	u := usecase.NewGamificationUsecase(repo, nil)

	status, err := u.ClaimMonthlyBadge(context.Background(), "user-1")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !status.MonthlyBadgeClaimed {
		t.Errorf("expected monthly badge to be claimed")
	}
	if status.Gems != 150 {
		t.Errorf("expected 150 gems after monthly badge, got %d", status.Gems)
	}
}

func TestGamificationUsecase_SubmitCoaching(t *testing.T) {
	repo := newMockGamificationRepository()
	u := usecase.NewGamificationUsecase(repo, nil)

	sub, status, err := u.SubmitCoaching(context.Background(), "user-1", &domain.CoachingSubmissionRequest{
		Type:       "cv-review",
		TargetRole: "Golang SWE",
		GitHubURL:  "https://github.com/developer",
		ResumeURL:  "https://resume.com/cv.pdf",
	})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if sub.ID != "sub-123" {
		t.Errorf("expected submission id sub-123, got %s", sub.ID)
	}
	if status.Inventory["cv-review"] != 0 {
		t.Errorf("expected cv-review coupon to be decremented to 0, got %d", status.Inventory["cv-review"])
	}

	// Invalid type
	_, _, err = u.SubmitCoaching(context.Background(), "user-1", &domain.CoachingSubmissionRequest{
		Type: "flight-ticket",
	})
	if err == nil {
		t.Errorf("expected error for invalid coaching type, got nil")
	}
}
