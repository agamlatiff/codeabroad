package gamification_test

import (
	"context"
	"testing"
	"time"

	"codeabroad/backend/internal/domain"
	gamificationUsecasePkg "codeabroad/backend/internal/usecase/gamification"
)

type mockGamificationRepo struct {
	status    *domain.GamificationStatus
	stats     *domain.UserGamificationStats
	shopItems []domain.ShopItem
	claims    []domain.DailyChestClaim
}

func newMockGamificationRepo() *mockGamificationRepo {
	return &mockGamificationRepo{
		status: &domain.GamificationStatus{
			XP:           100,
			CurrentLevel: 2,
			Streak:       5,
			Gems:         50,
			Inventory:    map[string]int{"streak_freeze": 1},
		},
		stats: &domain.UserGamificationStats{
			XP:           100,
			CurrentLevel: 2,
			Streak:       5,
			Gems:         50,
		},
		shopItems: []domain.ShopItem{
			{ID: "streak_freeze", Name: "Streak Freeze", PriceGems: 20, IsAvailable: true},
			{ID: "rare_theme", Name: "Rare Theme", PriceGems: 100, IsAvailable: false},
		},
	}
}

func (m *mockGamificationRepo) GetStatus(ctx context.Context, userID string) (*domain.GamificationStatus, error) {
	return m.status, nil
}
func (m *mockGamificationRepo) GetGamificationStats(ctx context.Context, userID string) (*domain.UserGamificationStats, error) {
	return m.stats, nil
}
func (m *mockGamificationRepo) UpdateStats(ctx context.Context, userID string, xp int, level int, streak int, gems int, lastActiveAt *time.Time) error {
	m.stats.XP = xp
	m.stats.CurrentLevel = level
	m.stats.Streak = streak
	m.stats.Gems = gems
	return nil
}
func (m *mockGamificationRepo) AddXPAndGems(ctx context.Context, userID string, xp int, level int, gems int) (*domain.UserGamificationStats, error) {
	m.stats.XP += xp
	m.stats.CurrentLevel = level
	m.stats.Gems += gems
	return m.stats, nil
}
func (m *mockGamificationRepo) GetShopItems(ctx context.Context, onlyAvailable bool) ([]domain.ShopItem, error) {
	if !onlyAvailable {
		return m.shopItems, nil
	}
	var res []domain.ShopItem
	for _, it := range m.shopItems {
		if it.IsAvailable {
			res = append(res, it)
		}
	}
	return res, nil
}
func (m *mockGamificationRepo) GetShopItemByID(ctx context.Context, itemID string) (*domain.ShopItem, error) {
	for _, it := range m.shopItems {
		if it.ID == itemID {
			return &it, nil
		}
	}
	return nil, domain.ErrShopItemNotFound
}
func (m *mockGamificationRepo) GetUserInventory(ctx context.Context, userID string) ([]domain.UserInventoryItem, error) {
	return nil, nil
}
func (m *mockGamificationRepo) BuyShopItem(ctx context.Context, userID string, itemID string, priceGems int) (*domain.UserInventoryItem, int, error) {
	if m.stats.Gems < priceGems {
		return nil, 0, domain.ErrInsufficientGems
	}
	m.stats.Gems -= priceGems
	m.status.Gems = m.stats.Gems
	m.status.Inventory[itemID]++
	return &domain.UserInventoryItem{ItemID: itemID, Quantity: m.status.Inventory[itemID]}, m.stats.Gems, nil
}
func (m *mockGamificationRepo) GetBadges(ctx context.Context) ([]domain.BadgeDefinition, error) {
	return []domain.BadgeDefinition{{ID: "badge-1", Title: "First Step"}}, nil
}
func (m *mockGamificationRepo) GetUserBadges(ctx context.Context, userID string) ([]domain.UserBadge, error) {
	return nil, nil
}
func (m *mockGamificationRepo) AwardBadge(ctx context.Context, userID string, badgeKey string, newLevel int) (*domain.UserBadge, error) {
	return nil, nil
}
func (m *mockGamificationRepo) GetDailyChestClaims(ctx context.Context, userID string, claimDate string) ([]domain.DailyChestClaim, error) {
	return m.claims, nil
}
func (m *mockGamificationRepo) ClaimDailyChest(ctx context.Context, claim *domain.DailyChestClaim, newLevel int) error {
	m.claims = append(m.claims, *claim)
	m.stats.Gems += claim.GemsAwarded
	m.stats.XP += claim.XPAwarded
	m.stats.CurrentLevel = newLevel
	m.status.Gems = m.stats.Gems
	m.status.XP = m.stats.XP
	m.status.CurrentLevel = newLevel
	m.status.ClaimedChests = append(m.status.ClaimedChests, claim.Tier)
	return nil
}
func (m *mockGamificationRepo) CreateCoachingSubmission(ctx context.Context, sub *domain.CoachingSubmission) error {
	return nil
}

func TestBuyShopItem_Success(t *testing.T) {
	repo := newMockGamificationRepo()
	uc := gamificationUsecasePkg.New(repo)

	inv, status, err := uc.BuyShopItem(context.Background(), "user-1", "streak_freeze")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if inv.Quantity != 2 {
		t.Errorf("expected quantity 2, got %d", inv.Quantity)
	}
	if status.Gems != 30 { // 50 - 20
		t.Errorf("expected 30 gems remaining, got %d", status.Gems)
	}
}

func TestBuyShopItem_Unavailable(t *testing.T) {
	repo := newMockGamificationRepo()
	uc := gamificationUsecasePkg.New(repo)

	_, _, err := uc.BuyShopItem(context.Background(), "user-1", "rare_theme")
	if err != domain.ErrItemUnavailable {
		t.Errorf("expected ErrItemUnavailable, got %v", err)
	}
}

func TestClaimDailyChest_Tier1(t *testing.T) {
	repo := newMockGamificationRepo()
	uc := gamificationUsecasePkg.New(repo)

	claim, status, err := uc.ClaimDailyChest(context.Background(), "user-1", 1)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if claim.GemsAwarded != 5 {
		t.Errorf("expected 5 gems awarded, got %d", claim.GemsAwarded)
	}
	if status.Gems != 55 { // 50 + 5
		t.Errorf("expected 55 gems, got %d", status.Gems)
	}
}

