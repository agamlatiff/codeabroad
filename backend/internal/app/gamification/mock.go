package gamification

import (
	"context"
	"fmt"
	"time"

	"codeabroad/backend/internal/app/user"
)

// MockRepository implements Repository for unit testing
type MockRepository struct {
	Stats               map[string]*user.UserGamificationStats
	ShopItems           map[string]*ShopItem
	Inventory           map[string][]UserInventoryItem
	Badges              map[string]*BadgeDefinition
	UserBadges          map[string][]UserBadge
	ChestClaims         map[string][]DailyChestClaim
	CoachingSubmissions []CoachingSubmission

	GetStatusErr        error
	GetStatsErr         error
	UpdateStatsErr      error
	AddXPAndGemsErr     error
	GetShopItemsErr     error
	GetShopItemByIDErr  error
	GetUserInventoryErr error
	BuyShopItemErr      error
	GetBadgesErr        error
	GetUserBadgesErr    error
	AwardBadgeErr       error
	GetChestClaimsErr   error
	ClaimChestErr       error
	CreateCoachingErr   error
}

// NewMockRepository creates an in-memory mock gamification Repository
func NewMockRepository() *MockRepository {
	return &MockRepository{
		Stats:       make(map[string]*user.UserGamificationStats),
		ShopItems:   make(map[string]*ShopItem),
		Inventory:   make(map[string][]UserInventoryItem),
		Badges:      make(map[string]*BadgeDefinition),
		UserBadges:  make(map[string][]UserBadge),
		ChestClaims: make(map[string][]DailyChestClaim),
	}
}

var _ Repository = (*MockRepository)(nil)

func (m *MockRepository) GetStatus(ctx context.Context, userID string) (*GamificationStatus, error) {
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

	today := time.Now().UTC().Format("2006-01-02")
	var claimedChests []int
	for _, c := range m.ChestClaims[userID] {
		if c.ClaimDate == today {
			claimedChests = append(claimedChests, c.Tier)
		}
	}

	return &GamificationStatus{
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

func (m *MockRepository) GetGamificationStats(ctx context.Context, userID string) (*user.UserGamificationStats, error) {
	if m.GetStatsErr != nil {
		return nil, m.GetStatsErr
	}
	st, ok := m.Stats[userID]
	if !ok {
		return &user.UserGamificationStats{
			XP:           0,
			CurrentLevel: 1,
			Streak:       0,
			Gems:         0,
		}, nil
	}
	return st, nil
}

func (m *MockRepository) UpdateStats(ctx context.Context, userID string, xp int, level int, streak int, gems int, lastActiveAt *time.Time) error {
	if m.UpdateStatsErr != nil {
		return m.UpdateStatsErr
	}
	st, ok := m.Stats[userID]
	if !ok {
		st = &user.UserGamificationStats{}
		m.Stats[userID] = st
	}
	st.XP = xp
	st.CurrentLevel = level
	st.Streak = streak
	st.Gems = gems
	st.LastActiveAt = lastActiveAt
	return nil
}

func (m *MockRepository) AddXPAndGems(ctx context.Context, userID string, xp int, level int, gems int) (*user.UserGamificationStats, error) {
	if m.AddXPAndGemsErr != nil {
		return nil, m.AddXPAndGemsErr
	}
	st, ok := m.Stats[userID]
	if !ok {
		st = &user.UserGamificationStats{CurrentLevel: 1}
		m.Stats[userID] = st
	}
	st.XP += xp
	st.CurrentLevel = level
	st.Gems += gems
	now := time.Now()
	st.LastActiveAt = &now
	return st, nil
}

func (m *MockRepository) GetShopItems(ctx context.Context, onlyAvailable bool) ([]ShopItem, error) {
	if m.GetShopItemsErr != nil {
		return nil, m.GetShopItemsErr
	}
	res := make([]ShopItem, 0)
	for _, it := range m.ShopItems {
		item := *it
		if item.Title == "" {
			item.Title = item.Name
		}
		if item.Name == "" {
			item.Name = item.Title
		}
		if item.Subtitle == "" {
			item.Subtitle = item.Description
		}
		if item.Description == "" {
			item.Description = item.Subtitle
		}
		if item.Badge == "" {
			item.Badge = item.Icon
		}
		if item.Icon == "" {
			item.Icon = item.Badge
		}
		if !onlyAvailable || item.IsAvailable || item.IsActive {
			res = append(res, item)
		}
	}
	return res, nil
}

func (m *MockRepository) GetShopItemByID(ctx context.Context, itemID string) (*ShopItem, error) {
	if m.GetShopItemByIDErr != nil {
		return nil, m.GetShopItemByIDErr
	}
	it, ok := m.ShopItems[itemID]
	if !ok {
		return nil, ErrShopItemNotFound
	}
	item := *it
	if item.Title == "" {
		item.Title = item.Name
	}
	if item.Name == "" {
		item.Name = item.Title
	}
	if item.Subtitle == "" {
		item.Subtitle = item.Description
	}
	if item.Description == "" {
		item.Description = item.Subtitle
	}
	if item.Badge == "" {
		item.Badge = item.Icon
	}
	if item.Icon == "" {
		item.Icon = item.Badge
	}
	return &item, nil
}

func (m *MockRepository) GetUserInventory(ctx context.Context, userID string) ([]UserInventoryItem, error) {
	if m.GetUserInventoryErr != nil {
		return nil, m.GetUserInventoryErr
	}
	return m.Inventory[userID], nil
}

func (m *MockRepository) BuyShopItem(ctx context.Context, userID string, itemID string, priceGems int) (*UserInventoryItem, int, error) {
	if m.BuyShopItemErr != nil {
		return nil, 0, m.BuyShopItemErr
	}
	st, ok := m.Stats[userID]
	if !ok || st.Gems < priceGems {
		return nil, 0, ErrInsufficientGems
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

	newItem := UserInventoryItem{
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

func (m *MockRepository) GetBadges(ctx context.Context) ([]BadgeDefinition, error) {
	if m.GetBadgesErr != nil {
		return nil, m.GetBadgesErr
	}
	res := make([]BadgeDefinition, 0)
	for _, b := range m.Badges {
		badge := *b
		if badge.XPReward == 0 && badge.XPBonus > 0 {
			badge.XPReward = badge.XPBonus
		}
		if badge.XPBonus == 0 && badge.XPReward > 0 {
			badge.XPBonus = badge.XPReward
		}
		res = append(res, badge)
	}
	return res, nil
}

func (m *MockRepository) GetUserBadges(ctx context.Context, userID string) ([]UserBadge, error) {
	if m.GetUserBadgesErr != nil {
		return nil, m.GetUserBadgesErr
	}
	ubList := m.UserBadges[userID]
	res := make([]UserBadge, 0, len(ubList))
	for _, ub := range ubList {
		badgeCopy := ub
		if badgeCopy.Badge != nil {
			bd := *badgeCopy.Badge
			if bd.XPReward == 0 && bd.XPBonus > 0 {
				bd.XPReward = bd.XPBonus
			}
			if bd.XPBonus == 0 && bd.XPReward > 0 {
				bd.XPBonus = bd.XPReward
			}
			badgeCopy.Badge = &bd
		}
		res = append(res, badgeCopy)
	}
	return res, nil
}

func (m *MockRepository) AwardBadge(ctx context.Context, userID string, badgeKey string, newLevel int) (*UserBadge, error) {
	if m.AwardBadgeErr != nil {
		return nil, m.AwardBadgeErr
	}
	ub := UserBadge{
		ID:        fmt.Sprintf("ub_%d", len(m.UserBadges[userID])+1),
		UserID:    userID,
		BadgeKey:  badgeKey,
		AwardedAt: time.Now(),
	}
	m.UserBadges[userID] = append(m.UserBadges[userID], ub)
	return &ub, nil
}

func (m *MockRepository) GetDailyChestClaims(ctx context.Context, userID string, claimDate string) ([]DailyChestClaim, error) {
	if m.GetChestClaimsErr != nil {
		return nil, m.GetChestClaimsErr
	}
	var res []DailyChestClaim
	for _, c := range m.ChestClaims[userID] {
		if c.ClaimDate == claimDate {
			res = append(res, c)
		}
	}
	return res, nil
}

func (m *MockRepository) ClaimDailyChest(ctx context.Context, claim *DailyChestClaim, newLevel int) error {
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
	st, ok := m.Stats[claim.UserID]
	if !ok {
		st = &user.UserGamificationStats{CurrentLevel: 1}
		m.Stats[claim.UserID] = st
	}
	st.Gems += claim.GemsAwarded
	st.XP += claim.XPAwarded
	st.CurrentLevel = newLevel
	return nil
}

func (m *MockRepository) CreateCoachingSubmission(ctx context.Context, sub *CoachingSubmission) error {
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

