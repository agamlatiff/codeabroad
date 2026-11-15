package gamification

import (
	"context"
	"fmt"
	"strings"
	"time"

	"codeabroad/backend/internal/shared/apperror"
)

type usecase struct {
	gamificationRepo Repository
	helper           *Helper
}

// NewUsecase creates a new Gamification Usecase instance
func NewUsecase(gamificationRepo Repository) Usecase {
	return &usecase{
		gamificationRepo: gamificationRepo,
		helper:           NewHelper(),
	}
}

// GetStatus returns the single source of truth gamified state for a user
func (u *usecase) GetStatus(ctx context.Context, userID string) (*GamificationStatus, error) {
	if userID == "" {
		return nil, apperror.ErrUnauthorized
	}
	return u.gamificationRepo.GetStatus(ctx, userID)
}

// ListShopItems returns catalog items available in the Akihabara arcade
func (u *usecase) ListShopItems(ctx context.Context) ([]ShopItem, error) {
	return u.gamificationRepo.GetShopItems(ctx, true)
}

// BuyShopItem purchases an arcade consumable or cosmetic item using earned gems
func (u *usecase) BuyShopItem(ctx context.Context, userID string, itemID string) (*UserInventoryItem, *GamificationStatus, error) {
	if userID == "" {
		return nil, nil, apperror.ErrUnauthorized
	}
	trimmedItemID := strings.TrimSpace(itemID)
	if trimmedItemID == "" {
		return nil, nil, apperror.ErrBadRequest
	}

	item, err := u.gamificationRepo.GetShopItemByID(ctx, trimmedItemID)
	if err != nil {
		return nil, nil, err
	}
	if !item.IsAvailable || item.PriceGems < 0 {
		return nil, nil, ErrItemUnavailable
	}

	inv, _, err := u.gamificationRepo.BuyShopItem(ctx, userID, trimmedItemID, item.PriceGems)
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
func (u *usecase) ListBadges(ctx context.Context, userID string) ([]BadgeDefinition, []UserBadge, error) {
	if userID == "" {
		return nil, nil, apperror.ErrUnauthorized
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
func (u *usecase) ClaimDailyChest(ctx context.Context, userID string, tier int) (*DailyChestClaim, *GamificationStatus, error) {
	if userID == "" {
		return nil, nil, apperror.ErrUnauthorized
	}

	gems, xp, err := u.helper.ResolveChestReward(tier)
	if err != nil {
		return nil, nil, err
	}

	claim := &DailyChestClaim{
		UserID:      userID,
		ClaimDate:   time.Now().UTC().Format("2006-01-02"),
		Tier:        tier,
		GemsAwarded: gems,
		XPAwarded:   xp,
	}

	if err := u.gamificationRepo.ClaimDailyChest(ctx, claim, 0); err != nil {
		return nil, nil, err
	}

	status, err := u.gamificationRepo.GetStatus(ctx, userID)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to fetch updated status: %w", err)
	}

	return claim, status, nil
}

// SubmitCoaching creates a mentorship review submission
func (u *usecase) SubmitCoaching(ctx context.Context, userID string, req *CoachingSubmissionRequest) (*CoachingSubmission, *GamificationStatus, error) {
	if userID == "" {
		return nil, nil, apperror.ErrUnauthorized
	}
	if req == nil || req.Type == "" {
		return nil, nil, apperror.ErrBadRequest
	}

	targetRole := strings.TrimSpace(req.TargetRole)
	githubURL := strings.TrimSpace(req.GitHubURL)
	resumeURL := strings.TrimSpace(req.ResumeURL)
	discordHandle := strings.TrimSpace(req.DiscordHandle)
	interviewLanguage := strings.TrimSpace(req.InterviewLanguage)
	focusTopic := strings.TrimSpace(req.FocusTopic)
	preferredTime := strings.TrimSpace(req.PreferredTime)
	notes := strings.TrimSpace(req.Notes)

	if githubURL != "" && !u.helper.ValidateHTTPURL(githubURL) {
		return nil, nil, ErrInvalidCoachingPayload
	}
	if resumeURL != "" && !u.helper.ValidateHTTPURL(resumeURL) {
		return nil, nil, ErrInvalidCoachingPayload
	}

	switch req.Type {
	case "cv-review":
		if targetRole == "" || resumeURL == "" {
			return nil, nil, ErrInvalidCoachingPayload
		}
	case "mock-interview":
		if discordHandle == "" || focusTopic == "" {
			return nil, nil, ErrInvalidCoachingPayload
		}
	default:
		return nil, nil, ErrInvalidCoachingPayload
	}

	sub := &CoachingSubmission{
		UserID:            userID,
		Type:              req.Type,
		TargetRole:        targetRole,
		GitHubURL:         githubURL,
		ResumeURL:         resumeURL,
		DiscordHandle:     discordHandle,
		InterviewLanguage: interviewLanguage,
		FocusTopic:        focusTopic,
		PreferredTime:     preferredTime,
		Notes:             notes,
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
