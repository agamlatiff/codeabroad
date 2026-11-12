package mock

import (
	"context"
	"fmt"
	"time"

	"codeabroad/backend/internal/domain"
)

// GamificationRepository implements domain.GamificationRepository for unit testing
type GamificationRepository struct {
	Stats               map[string]*domain.UserGamificationStats
	ShopItems           map[string]*domain.ShopItem
	Inventory           map[string][]domain.UserInventoryItem // key: userID
	Badges              map[string]*domain.BadgeDefinition
	UserBadges          map[string][]domain.UserBadge        // key: userID
	ChestClaims         map[string][]domain.DailyChestClaim  // key: userID
	CoachingSubmissions []domain.CoachingSubmission

	GetStatusErr       error
	GetStatsErr        error
	UpdateStatsErr     error
	AddXPAndGemsErr    error
	GetShopItemsErr    error
	GetShopItemByIDErr error
	GetUserInventoryErr error
	BuyShopItemErr     error
	GetBadgesErr       error
	GetUserBadgesErr   error
	AwardBadgeErr      error
	GetChestClaimsErr  error
	ClaimChestErr      error
	CreateCoachingErr  error
}

// NewGamificationRepository creates an in-memory mock GamificationRepository
func NewGamificationRepository() *GamificationRepository {
	return &GamificationRepository{
		Stats:       make(map[string]*domain.UserGamificationStats),
		ShopItems:   make(map[string]*domain.ShopItem),
		Inventory:   make(map[string][]domain.UserInventoryItem),
		Badges:      make(map[string]*domain.BadgeDefinition),
		UserBadges:  make(map[string][]domain.UserBadge),
		ChestClaims: make(map[string][]domain.DailyChestClaim),
	}
}

var _ domain.GamificationRepository = (*GamificationRepository)(nil)

func (m *GamificationRepository) GetStatus(ctx context.Context, userID string) (*domain.GamificationStatus, error) {
	if m.GetStatusErr != nil {
		return nil, m.GetStatusErr
	}
	st := m.Stats[userID]
	xp, level, streak, gems := 0, 1, 0, 0
	if st != nil {
		xp = st.XP
		level = st.CurrentLevel
		streak = st.Streak
		gems = st.Gems
	}

	invItems := m.Inventory[userID]
	invMap := make(map[string]int)
	for _, it := range invItems {
		invMap[it.ItemID] += it.Quantity
	}

	today := time.Now().Format("2006-01-02")
	var claimedChests []int
	for _, c := range m.ChestClaims[userID] {
		if c.ClaimDate == today {
			claimedChests = append(claimedChests, c.Tier)
		}
	}

	return &domain.GamificationStatus{
		XP:             xp,
		CurrentLevel:   level,
		Streak:         streak,
		Gems:           gems,
		Inventory:      invMap,
		InventoryItems: invItems,
		ClaimedChests:  claimedChests,
		Badges:         m.UserBadges[userID],
	}, nil
}

func (m *GamificationRepository) GetGamificationStats(ctx context.Context, userID string) (*domain.UserGamificationStats, error) {
	if m.GetStatsErr != nil {
		return nil, m.GetStatsErr
	}
	st, ok := m.Stats[userID]
	if !ok {
		return &domain.UserGamificationStats{
			XP:           0,
			CurrentLevel: 1,
			Streak:       0,
			Gems:         0,
		}, nil
	}
	return st, nil
}

func (m *GamificationRepository) UpdateStats(ctx context.Context, userID string, xp int, level int, streak int, gems int, lastActiveAt *time.Time) error {
	if m.UpdateStatsErr != nil {
		return m.UpdateStatsErr
	}
	st, ok := m.Stats[userID]
	if !ok {
		st = &domain.UserGamificationStats{}
		m.Stats[userID] = st
	}
	st.XP = xp
	st.CurrentLevel = level
	st.Streak = streak
	st.Gems = gems
	st.LastActiveAt = lastActiveAt
	return nil
}

func (m *GamificationRepository) AddXPAndGems(ctx context.Context, userID string, xp int, level int, gems int) (*domain.UserGamificationStats, error) {
	if m.AddXPAndGemsErr != nil {
		return nil, m.AddXPAndGemsErr
	}
	st, ok := m.Stats[userID]
	if !ok {
		st = &domain.UserGamificationStats{CurrentLevel: 1}
		m.Stats[userID] = st
	}
	st.XP += xp
	st.CurrentLevel = level
	st.Gems += gems
	now := time.Now()
	st.LastActiveAt = &now
	return st, nil
}

func (m *GamificationRepository) GetShopItems(ctx context.Context, onlyAvailable bool) ([]domain.ShopItem, error) {
	if m.GetShopItemsErr != nil {
		return nil, m.GetShopItemsErr
	}
	var res []domain.ShopItem
	for _, it := range m.ShopItems {
		if !onlyAvailable || it.IsAvailable {
			res = append(res, *it)
		}
	}
	return res, nil
}

func (m *GamificationRepository) GetShopItemByID(ctx context.Context, itemID string) (*domain.ShopItem, error) {
	if m.GetShopItemByIDErr != nil {
		return nil, m.GetShopItemByIDErr
	}
	it, ok := m.ShopItems[itemID]
	if !ok {
		return nil, nil
	}
	return it, nil
}

func (m *GamificationRepository) GetUserInventory(ctx context.Context, userID string) ([]domain.UserInventoryItem, error) {
	if m.GetUserInventoryErr != nil {
		return nil, m.GetUserInventoryErr
	}
	return m.Inventory[userID], nil
}

func (m *GamificationRepository) BuyShopItem(ctx context.Context, userID string, itemID string, priceGems int) (*domain.UserInventoryItem, int, error) {
	if m.BuyShopItemErr != nil {
		return nil, 0, m.BuyShopItemErr
	}
	st, ok := m.Stats[userID]
	if !ok || st.Gems < priceGems {
		return nil, 0, domain.ErrBadRequest
	}
	st.Gems -= priceGems

	invList := m.Inventory[userID]
	for i, it := range invList {
		if it.ItemID == itemID {
			invList[i].Quantity++
			m.Inventory[userID] = invList
			return &invList[i], st.Gems, nil
		}
	}

	newItem := domain.UserInventoryItem{
		ID:        fmt.Sprintf("inv_%d", len(invList)+1),
		UserID:    userID,
		ItemID:    itemID,
		Quantity:  1,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	m.Inventory[userID] = append(m.Inventory[userID], newItem)
	return &newItem, st.Gems, nil
}

func (m *GamificationRepository) GetBadges(ctx context.Context) ([]domain.BadgeDefinition, error) {
	if m.GetBadgesErr != nil {
		return nil, m.GetBadgesErr
	}
	var res []domain.BadgeDefinition
	for _, b := range m.Badges {
		res = append(res, *b)
	}
	return res, nil
}

func (m *GamificationRepository) GetUserBadges(ctx context.Context, userID string) ([]domain.UserBadge, error) {
	if m.GetUserBadgesErr != nil {
		return nil, m.GetUserBadgesErr
	}
	return m.UserBadges[userID], nil
}

func (m *GamificationRepository) AwardBadge(ctx context.Context, userID string, badgeKey string, newLevel int) (*domain.UserBadge, error) {
	if m.AwardBadgeErr != nil {
		return nil, m.AwardBadgeErr
	}
	ub := domain.UserBadge{
		ID:        fmt.Sprintf("ub_%d", len(m.UserBadges[userID])+1),
		UserID:    userID,
		BadgeKey:  badgeKey,
		AwardedAt: time.Now(),
	}
	m.UserBadges[userID] = append(m.UserBadges[userID], ub)
	return &ub, nil
}

func (m *GamificationRepository) GetDailyChestClaims(ctx context.Context, userID string, claimDate string) ([]domain.DailyChestClaim, error) {
	if m.GetChestClaimsErr != nil {
		return nil, m.GetChestClaimsErr
	}
	var res []domain.DailyChestClaim
	for _, c := range m.ChestClaims[userID] {
		if c.ClaimDate == claimDate {
			res = append(res, c)
		}
	}
	return res, nil
}

func (m *GamificationRepository) ClaimDailyChest(ctx context.Context, claim *domain.DailyChestClaim, newLevel int) error {
	if m.ClaimChestErr != nil {
		return m.ClaimChestErr
	}
	if claim.ID == "" {
		claim.ID = fmt.Sprintf("ch_%d", len(m.ChestClaims[claim.UserID])+1)
	}
	if claim.CreatedAt.IsZero() {
		claim.CreatedAt = time.Now()
	}
	m.ChestClaims[claim.UserID] = append(m.ChestClaims[claim.UserID], *claim)
	return nil
}

func (m *GamificationRepository) CreateCoachingSubmission(ctx context.Context, sub *domain.CoachingSubmission) error {
	if m.CreateCoachingErr != nil {
		return m.CreateCoachingErr
	}
	if sub.ID == "" {
		sub.ID = fmt.Sprintf("coach_%d", len(m.CoachingSubmissions)+1)
	}
	if sub.CreatedAt.IsZero() {
		sub.CreatedAt = time.Now()
		sub.UpdatedAt = time.Now()
	}
	m.CoachingSubmissions = append(m.CoachingSubmissions, *sub)
	return nil
}
