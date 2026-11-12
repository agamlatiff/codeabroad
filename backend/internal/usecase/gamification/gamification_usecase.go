package gamification

import (
	"codeabroad/backend/internal/domain"
	"context"
	"fmt"
	"time"
)

type usecase struct {
	gamificationRepo domain.GamificationRepository
	helper           *Helper
}

// New creates a new Gamification Usecase instance conforming to domain.GamificationUsecase
func New(gamificationRepo domain.GamificationRepository) domain.GamificationUsecase {
	return &usecase{
		gamificationRepo: gamificationRepo,
		helper:           NewHelper(),
	}
}

// GetStatus returns the single source of truth gamified state for a user
func (u *usecase) GetStatus(ctx context.Context, userID string) (*domain.GamificationStatus, error) {
	if userID == "" {
		return nil, domain.ErrUnauthorized
	}
	return u.gamificationRepo.GetStatus(ctx, userID)
}

// ListShopItems returns catalog items available in the Akihabara arcade
func (u *usecase) ListShopItems(ctx context.Context) ([]domain.ShopItem, error) {
	return u.gamificationRepo.GetShopItems(ctx, true)
}

// BuyShopItem purchases an arcade consumable or cosmetic item using earned gems
func (u *usecase) BuyShopItem(ctx context.Context, userID string, itemID string) (*domain.UserInventoryItem, *domain.GamificationStatus, error) {
	if userID == "" {
		return nil, nil, domain.ErrUnauthorized
	}
	if itemID == "" {
		return nil, nil, domain.ErrBadRequest
	}

	item, err := u.gamificationRepo.GetShopItemByID(ctx, itemID)
	if err != nil {
		return nil, nil, err
	}
	if !item.IsAvailable {
		return nil, nil, domain.ErrItemUnavailable
	}

	inv, _, err := u.gamificationRepo.BuyShopItem(ctx, userID, itemID, item.PriceGems)
	if err != nil {
		return nil, nil, err
	}

	status, err := u.gamificationRepo.GetStatus(ctx, userID)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to fetch updated status: %w", err)
	}

	return inv, status, nil
}

// ListBadges returns all achievements in the system and marks which ones the user has unlocked
func (u *usecase) ListBadges(ctx context.Context, userID string) ([]domain.BadgeDefinition, []domain.UserBadge, error) {
	if userID == "" {
		return nil, nil, domain.ErrUnauthorized
	}

	allBadges, err := u.gamificationRepo.GetBadges(ctx)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to query all badges: %w", err)
	}

	userBadges, err := u.gamificationRepo.GetUserBadges(ctx, userID)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to query user badges: %w", err)
	}

	return allBadges, userBadges, nil
}

// ClaimDailyChest awards gems and XP for unlocking a milestone chest
func (u *usecase) ClaimDailyChest(ctx context.Context, userID string, tier int) (*domain.DailyChestClaim, *domain.GamificationStatus, error) {
	if userID == "" {
		return nil, nil, domain.ErrUnauthorized
	}

	gems, xp, err := u.helper.ResolveChestReward(tier)
	if err != nil {
		return nil, nil, err
	}

	stats, err := u.gamificationRepo.GetGamificationStats(ctx, userID)
	if err != nil {
		return nil, nil, err
	}

	_, newLevel := u.helper.CalculateProgression(stats.XP, xp)
	now := time.Now().UTC()
	claim := &domain.DailyChestClaim{
		UserID:      userID,
		ClaimDate:   now.Format("2006-01-02"),
		Tier:        tier,
		GemsAwarded: gems,
		XPAwarded:   xp,
	}

	if err := u.gamificationRepo.ClaimDailyChest(ctx, claim, newLevel); err != nil {
		return nil, nil, err
	}

	status, err := u.gamificationRepo.GetStatus(ctx, userID)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to fetch updated status: %w", err)
	}

	return claim, status, nil
}

// SubmitCoaching creates a mentorship review submission
func (u *usecase) SubmitCoaching(ctx context.Context, userID string, req *domain.CoachingSubmissionRequest) (*domain.CoachingSubmission, *domain.GamificationStatus, error) {
	if userID == "" {
		return nil, nil, domain.ErrUnauthorized
	}
	if req == nil || req.Type == "" {
		return nil, nil, domain.ErrBadRequest
	}

	sub := &domain.CoachingSubmission{
		UserID:            userID,
		Type:              req.Type,
		TargetRole:        req.TargetRole,
		GitHubURL:         req.GitHubURL,
		ResumeURL:         req.ResumeURL,
		DiscordHandle:     req.DiscordHandle,
		InterviewLanguage: req.InterviewLanguage,
		FocusTopic:        req.FocusTopic,
		PreferredTime:     req.PreferredTime,
		Notes:             req.Notes,
		Status:            "pending",
	}

	if err := u.gamificationRepo.CreateCoachingSubmission(ctx, sub); err != nil {
		return nil, nil, fmt.Errorf("failed to record coaching submission: %w", err)
	}

	status, err := u.gamificationRepo.GetStatus(ctx, userID)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to fetch status: %w", err)
	}

	return sub, status, nil
}

