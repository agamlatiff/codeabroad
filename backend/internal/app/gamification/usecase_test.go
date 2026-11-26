package gamification_test

import (
	"context"
	"errors"
	"testing"

	"merantalk/backend/internal/app/gamification"
	"merantalk/backend/internal/app/user"
	"merantalk/backend/internal/shared/apperror"
)

func setupMockGamificationRepo() *gamification.MockRepository {
	repo := gamification.NewMockRepository()
	repo.Stats["user-1"] = &user.UserGamificationStats{
		XP:           100,
		CurrentLevel: 2,
		Streak:       5,
		Gems:         50,
	}
	repo.DailyQuestsDone["user-1"] = 3
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

	// Reject when user has no cv-review coupon
	_, _, err = uc.SubmitCoaching(context.Background(), "user-1", &gamification.CoachingSubmissionRequest{
		Type:       "cv-review",
		TargetRole: "Persiapan Kerja Jepang",
		ResumeURL:  "https://drive.google.com/file/d/abc",
	})
	if !errors.Is(err, gamification.ErrInsufficientCoupons) {
		t.Errorf("expected ErrInsufficientCoupons when user has no coupon, got %v", err)
	}

	// Seed 1 cv-review coupon and verify valid submission consumes it
	repo.Inventory["user-1"] = []gamification.UserInventoryItem{
		{UserID: "user-1", ItemID: "cv-review", Quantity: 1},
	}
	sub, status, err := uc.SubmitCoaching(context.Background(), "user-1", &gamification.CoachingSubmissionRequest{
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
	if status.Inventory["cv-review"] != 0 {
		t.Errorf("expected cv-review coupon to be consumed (0 remaining), got %d", status.Inventory["cv-review"])
	}
}

func TestGetStatus_And_ListCatalogAndBadges(t *testing.T) {
	repo := setupMockGamificationRepo()
	repo.Badges["first_step"] = &gamification.BadgeDefinition{
		ID:       "first_step",
		Title:    "Langkah Pertama",
		XPReward: 50,
	}
	uc := gamification.NewUsecase(repo)

	if _, err := uc.GetStatus(context.Background(), ""); !errors.Is(err, apperror.ErrUnauthorized) {
		t.Errorf("expected ErrUnauthorized for empty userID, got %v", err)
	}
	status, err := uc.GetStatus(context.Background(), "user-1")
	if err != nil {
		t.Fatalf("expected GetStatus to succeed, got %v", err)
	}
	if status.Gems != 50 {
		t.Errorf("expected 50 gems, got %d", status.Gems)
	}

	items, err := uc.ListShopItems(context.Background())
	if err != nil {
		t.Fatalf("expected ListShopItems to succeed, got %v", err)
	}
	if len(items) != 2 {
		t.Errorf("expected 2 active shop items (rare_theme excluded), got %d", len(items))
	}

	awarded, err := repo.AwardBadge(context.Background(), "user-1", "first_step", 2)
	if err != nil || awarded.Badge == nil {
		t.Fatalf("expected first AwardBadge to return populated Badge, err=%v", err)
	}
	repeatAwarded, err := repo.AwardBadge(context.Background(), "user-1", "first_step", 2)
	if err != nil || repeatAwarded.Badge == nil {
		t.Fatalf("expected idempotent AwardBadge to preserve populated Badge, err=%v", err)
	}

	catalog, userBadges, err := uc.ListBadges(context.Background(), "user-1")
	if err != nil {
		t.Fatalf("expected ListBadges to succeed, got %v", err)
	}
	if len(catalog) != 1 || len(userBadges) != 1 {
		t.Errorf("expected 1 catalog badge and 1 user badge, got catalog=%d user=%d", len(catalog), len(userBadges))
	}
}

func TestBuyShopItem_InvalidInputAndNotFound(t *testing.T) {
	repo := setupMockGamificationRepo()
	uc := gamification.NewUsecase(repo)

	if _, _, err := uc.BuyShopItem(context.Background(), "user-1", "   "); !errors.Is(err, apperror.ErrBadRequest) {
		t.Errorf("expected ErrBadRequest for whitespace item_id, got %v", err)
	}
	if _, _, err := uc.BuyShopItem(context.Background(), "user-1", "unknown-item"); !errors.Is(err, gamification.ErrShopItemNotFound) {
		t.Errorf("expected ErrShopItemNotFound for unknown item_id, got %v", err)
	}
}

func TestActivateShopItem_XPBoosterLifecycle(t *testing.T) {
	repo := setupMockGamificationRepo()
	uc := gamification.NewUsecase(repo)

	if _, err := uc.ActivateShopItem(context.Background(), "user-1", "streak-freeze"); !errors.Is(err, gamification.ErrItemNotActivatable) {
		t.Fatalf("expected ErrItemNotActivatable for non-booster item, got %v", err)
	}
	if _, err := uc.ActivateShopItem(context.Background(), "user-1", "xp-booster"); !errors.Is(err, gamification.ErrItemNotOwned) {
		t.Fatalf("expected ErrItemNotOwned when inventory is empty, got %v", err)
	}

	repo.Inventory["user-1"] = append(repo.Inventory["user-1"], gamification.UserInventoryItem{
		UserID: "user-1", ItemID: "xp-booster", Quantity: 1,
	})
	status, err := uc.ActivateShopItem(context.Background(), "user-1", "xp-booster")
	if err != nil {
		t.Fatalf("expected xp-booster activation to succeed, got %v", err)
	}
	if !status.XPBoosterActive || status.XPBoosterExpiresAt == nil {
		t.Fatalf("expected active xp-booster status, got %+v", status)
	}
	if status.Inventory["xp-booster"] != 0 {
		t.Errorf("expected xp-booster quantity consumed to 0, got %d", status.Inventory["xp-booster"])
	}
}

func TestClaimMonthlyBadge_ThresholdAndConflict(t *testing.T) {
	repo := setupMockGamificationRepo()
	repo.MonthlyCompleted["user-1"] = 24
	uc := gamification.NewUsecase(repo)

	if _, _, err := uc.ClaimMonthlyBadge(context.Background(), "user-1"); !errors.Is(err, gamification.ErrMonthlyBadgeNotUnlocked) {
		t.Fatalf("expected ErrMonthlyBadgeNotUnlocked at 24 completions, got %v", err)
	}

	repo.MonthlyCompleted["user-1"] = 25
	claim, status, err := uc.ClaimMonthlyBadge(context.Background(), "user-1")
	if err != nil {
		t.Fatalf("expected monthly badge claim to succeed, got %v", err)
	}
	if claim.XPAwarded != gamification.MonthlyBadgeXPReward || !status.MonthlyBadgeClaimed {
		t.Fatalf("expected 150 XP and claimed=true, got claim=%+v status=%+v", claim, status)
	}
	if status.XP != 250 || status.CurrentLevel != 3 {
		t.Errorf("expected XP 250 level 3, got xp=%d lvl=%d", status.XP, status.CurrentLevel)
	}

	if _, _, err := uc.ClaimMonthlyBadge(context.Background(), "user-1"); !errors.Is(err, gamification.ErrMonthlyBadgeAlreadyClaimed) {
		t.Fatalf("expected ErrMonthlyBadgeAlreadyClaimed on duplicate claim, got %v", err)
	}
}

func TestListBadges_RetainsEarnedBadgeOutsideDefaultCatalog(t *testing.T) {
	repo := setupMockGamificationRepo()
	repo.Badges["first_step"] = &gamification.BadgeDefinition{
		ID:       "first_step",
		Title:    "Langkah Pertama",
		XPReward: 50,
	}
	// Simulate an already-earned badge whose catalog entry was filtered out of GetBadges()
	repo.UserBadges["user-1"] = []gamification.UserBadge{
		{
			ID:       "ub-legacy",
			UserID:   "user-1",
			BadgeKey: "multilingual_explorer",
			Badge: &gamification.BadgeDefinition{
				ID:       "multilingual_explorer",
				Title:    "Penjelajah Multibahasa",
				XPReward: 50,
			},
		},
	}

	uc := gamification.NewUsecase(repo)
	catalog, userBadges, err := uc.ListBadges(context.Background(), "user-1")
	if err != nil {
		t.Fatalf("expected ListBadges to succeed, got %v", err)
	}
	if len(catalog) != 2 || len(userBadges) != 1 {
		t.Fatalf("expected 2 catalog entries (retained earned badge) and 1 user badge, got catalog=%d user=%d", len(catalog), len(userBadges))
	}
}

func TestClaimDailyQuestAndChest_UnlocksStreakBadges(t *testing.T) {
	repo := setupMockGamificationRepo()
	repo.Stats["user-1"].Streak = 7
	repo.Badges["streak_7"] = &gamification.BadgeDefinition{ID: "streak_7", Title: "Konsisten 7 Hari", XPReward: 50}
	repo.Badges["streak_30"] = &gamification.BadgeDefinition{ID: "streak_30", Title: "Dedikasi 30 Hari", XPReward: 150}
	repo.DailyQuests["user-1"] = []gamification.DailyQuestItem{
		{ID: "q-1", Title: "Tuntaskan 1 Pelajaran", XPReward: 20, IsCompleted: true},
	}

	uc := gamification.NewUsecase(repo)
	res, err := uc.ClaimDailyQuest(context.Background(), "user-1", "q-1")
	if err != nil {
		t.Fatalf("expected ClaimDailyQuest to succeed, got %v", err)
	}
	if res.XPAwarded != 20 {
		t.Fatalf("expected 20 XP from quest, got %d", res.XPAwarded)
	}
	if res.CurrentXP != 170 {
		t.Fatalf("expected CurrentXP=170 (100 base + 20 quest + 50 streak_7 badge), got %d", res.CurrentXP)
	}
	if len(repo.UserBadges["user-1"]) != 1 || repo.UserBadges["user-1"][0].BadgeKey != "streak_7" {
		t.Fatalf("expected streak_7 badge unlocked via ClaimDailyQuest, got %+v", repo.UserBadges["user-1"])
	}

	repo.Stats["user-1"].Streak = 30
	_, status, err := uc.ClaimDailyChest(context.Background(), "user-1", 1)
	if err != nil {
		t.Fatalf("expected ClaimDailyChest to succeed, got %v", err)
	}
	if len(status.Badges) != 2 {
		t.Fatalf("expected 2 badges including streak_30 in refreshed status, got %d (%+v)", len(status.Badges), status.Badges)
	}
}
