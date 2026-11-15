package gamification_test

import (
	"context"
	"errors"
	"testing"

	"codeabroad/backend/internal/app/gamification"
	"codeabroad/backend/internal/app/user"
)

func setupMockGamificationRepo() *gamification.MockRepository {
	repo := gamification.NewMockRepository()
	repo.Stats["user-1"] = &user.UserGamificationStats{
		XP:           100,
		CurrentLevel: 2,
		Streak:       5,
		Gems:         50,
	}
	repo.Inventory["user-1"] = []gamification.UserInventoryItem{
		{ID: "inv-1", UserID: "user-1", ItemID: "streak_freeze", Quantity: 1},
	}
	repo.ShopItems["streak_freeze"] = &gamification.ShopItem{
		ID: "streak_freeze", Name: "Streak Freeze", PriceGems: 20, IsAvailable: true,
	}
	repo.ShopItems["rare_theme"] = &gamification.ShopItem{
		ID: "rare_theme", Name: "Rare Theme", PriceGems: 100, IsAvailable: false,
	}
	repo.ShopItems["expensive_item"] = &gamification.ShopItem{
		ID: "expensive_item", Name: "VIP Pass", PriceGems: 200, IsAvailable: true,
	}
	return repo
}

func TestBuyShopItem_Success(t *testing.T) {
	repo := setupMockGamificationRepo()
	uc := gamification.NewUsecase(repo)

	inv, status, err := uc.BuyShopItem(context.Background(), "user-1", "streak_freeze")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if inv.Quantity != 2 {
		t.Errorf("expected quantity 2, got %d", inv.Quantity)
	}
	if status.Gems != 30 {
		t.Errorf("expected 30 gems remaining, got %d", status.Gems)
	}
}

func TestBuyShopItem_Unavailable(t *testing.T) {
	repo := setupMockGamificationRepo()
	uc := gamification.NewUsecase(repo)

	_, _, err := uc.BuyShopItem(context.Background(), "user-1", "rare_theme")
	if !errors.Is(err, gamification.ErrItemUnavailable) {
		t.Errorf("expected ErrItemUnavailable, got %v", err)
	}
}

func TestBuyShopItem_InsufficientGems(t *testing.T) {
	repo := setupMockGamificationRepo()
	uc := gamification.NewUsecase(repo)

	_, _, err := uc.BuyShopItem(context.Background(), "user-1", "expensive_item")
	if !errors.Is(err, gamification.ErrInsufficientGems) {
		t.Errorf("expected ErrInsufficientGems, got %v", err)
	}
}

func TestClaimDailyChest_Tier1AndDuplicateReject(t *testing.T) {
	repo := setupMockGamificationRepo()
	uc := gamification.NewUsecase(repo)

	claim, status, err := uc.ClaimDailyChest(context.Background(), "user-1", 1)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if claim.GemsAwarded != 5 {
		t.Errorf("expected 5 gems awarded, got %d", claim.GemsAwarded)
	}
	if status.Gems != 55 {
		t.Errorf("expected 55 gems, got %d", status.Gems)
	}

	_, _, err = uc.ClaimDailyChest(context.Background(), "user-1", 1)
	if !errors.Is(err, gamification.ErrChestAlreadyClaimed) {
		t.Errorf("expected ErrChestAlreadyClaimed on duplicate claim, got %v", err)
	}
}

func TestSubmitCoaching_Validation(t *testing.T) {
	repo := setupMockGamificationRepo()
	uc := gamification.NewUsecase(repo)

	// Reject javascript: XSS URI
	_, _, err := uc.SubmitCoaching(context.Background(), "user-1", &gamification.CoachingSubmissionRequest{
		Type:       "cv-review",
		TargetRole: "JLPT N3",
		ResumeURL:  "javascript:alert(1)",
	})
	if !errors.Is(err, gamification.ErrInvalidCoachingPayload) {
		t.Errorf("expected ErrInvalidCoachingPayload for javascript URI, got %v", err)
	}

	// Reject missing required fields for mock-interview
	_, _, err = uc.SubmitCoaching(context.Background(), "user-1", &gamification.CoachingSubmissionRequest{
		Type: "mock-interview",
	})
	if !errors.Is(err, gamification.ErrInvalidCoachingPayload) {
		t.Errorf("expected ErrInvalidCoachingPayload for missing mock-interview fields, got %v", err)
	}

	// Valid cv-review submission
	sub, _, err := uc.SubmitCoaching(context.Background(), "user-1", &gamification.CoachingSubmissionRequest{
		Type:       "cv-review",
		TargetRole: "  Persiapan Kerja Jepang  ",
		ResumeURL:  "https://drive.google.com/file/d/abc",
	})
	if err != nil {
		t.Fatalf("expected valid cv-review to succeed, got %v", err)
	}
	if sub.TargetRole != "Persiapan Kerja Jepang" {
		t.Errorf("expected trimmed target_role, got %q", sub.TargetRole)
	}
}
