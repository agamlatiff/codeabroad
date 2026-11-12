package gamification_test

import (
	"context"
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
	if err != gamification.ErrItemUnavailable {
		t.Errorf("expected ErrItemUnavailable, got %v", err)
	}
}

func TestClaimDailyChest_Tier1(t *testing.T) {
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
}

