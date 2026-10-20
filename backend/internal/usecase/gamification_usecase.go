package usecase

import (
	"codeabroad/backend/internal/domain"
	"context"
	"fmt"
	"time"
)

// GamificationUsecase implements domain.GamificationUsecase
type GamificationUsecase struct {
	gamificationRepo domain.GamificationRepository
	userRepo         domain.UserRepository
}

// NewGamificationUsecase creates a new GamificationUsecase instance
func NewGamificationUsecase(
	gamificationRepo domain.GamificationRepository,
	userRepo domain.UserRepository,
) domain.GamificationUsecase {
	return &GamificationUsecase{
		gamificationRepo: gamificationRepo,
		userRepo:         userRepo,
	}
}

// GetStatus returns the unified gamification profile
func (u *GamificationUsecase) GetStatus(ctx context.Context, userID string) (*domain.GamificationStatus, error) {
	return u.gamificationRepo.GetStatus(ctx, userID)
}

// ClaimDailyChest validates and awards a milestone chest
func (u *GamificationUsecase) ClaimDailyChest(ctx context.Context, userID string, tier int) (*domain.GamificationStatus, int, int, error) {
	var gemsAwarded, xpAwarded int
	switch tier {
	case 1:
		gemsAwarded = 5
		xpAwarded = 0
	case 2:
		gemsAwarded = 15
		xpAwarded = 10
	case 3:
		gemsAwarded = 25
		xpAwarded = 25
	default:
		return nil, 0, 0, domain.NewBadRequestError("INVALID_TIER", "tier harus bernilai 1, 2, atau 3", nil)
	}

	err := u.gamificationRepo.ClaimDailyChest(ctx, userID, tier, gemsAwarded, xpAwarded)
	if err != nil {
		return nil, 0, 0, err
	}

	// Update user XP if XP awarded
	if xpAwarded > 0 && u.userRepo != nil {
		user, err := u.userRepo.GetByID(ctx, userID)
		if err == nil && user != nil {
			newXP := user.XP + xpAwarded
			newLevel := (newXP / 100) + 1
			now := time.Now()
			_ = u.userRepo.UpdateGamification(ctx, userID, newXP, newLevel, user.Streak, &now)
		}
	}

	status, err := u.gamificationRepo.GetStatus(ctx, userID)
	if err != nil {
		return nil, gemsAwarded, xpAwarded, err
	}

	return status, gemsAwarded, xpAwarded, nil
}

// BuyShopItem handles purchasing items from Akihabara Arcade
func (u *GamificationUsecase) BuyShopItem(ctx context.Context, userID string, itemID string) (*domain.GamificationStatus, error) {
	var price int
	switch itemID {
	case "streak-freeze":
		price = 20
	case "xp-booster":
		price = 35
	case "cv-review":
		price = 100
	case "mock-interview":
		price = 150
	default:
		return nil, domain.NewBadRequestError("INVALID_ITEM", fmt.Sprintf("item '%s' tidak tersedia di toko", itemID), nil)
	}

	_, _, err := u.gamificationRepo.BuyShopItem(ctx, userID, itemID, price)
	if err != nil {
		return nil, err
	}

	return u.gamificationRepo.GetStatus(ctx, userID)
}

// ClaimMonthlyBadge awards the monthly challenge badge
func (u *GamificationUsecase) ClaimMonthlyBadge(ctx context.Context, userID string) (*domain.GamificationStatus, error) {
	now := time.Now()
	badgeKey := fmt.Sprintf("codeabroad_monthly_badge_%d_%d", now.Year(), int(now.Month()))
	title := fmt.Sprintf("Lencana Emas Roppongi %s", now.Format("January 2006"))
	desc := "Menyelesaikan tantangan bulanan Tokyo Guild dan kurikulum CodeAbroad."
	icon := "🏅"
	gemReward := 50

	err := u.gamificationRepo.ClaimMonthlyBadge(ctx, userID, badgeKey, title, desc, icon, gemReward)
	if err != nil {
		return nil, err
	}

	return u.gamificationRepo.GetStatus(ctx, userID)
}

// SubmitCoaching processes CV review and mock interview requests
func (u *GamificationUsecase) SubmitCoaching(ctx context.Context, userID string, req *domain.CoachingSubmissionRequest) (*domain.CoachingSubmission, *domain.GamificationStatus, error) {
	if req.Type != "cv-review" && req.Type != "mock-interview" {
		return nil, nil, domain.NewBadRequestError("INVALID_COACHING_TYPE", "tipe coaching harus 'cv-review' atau 'mock-interview'", nil)
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
	}

	err := u.gamificationRepo.CreateCoachingSubmission(ctx, userID, sub)
	if err != nil {
		return nil, nil, err
	}

	status, err := u.gamificationRepo.GetStatus(ctx, userID)
	if err != nil {
		return sub, nil, nil
	}

	return sub, status, nil
}
