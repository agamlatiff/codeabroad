package user

import (
	"codeabroad/backend/internal/domain"
	"context"
	"fmt"
	"time"
)

type usecase struct {
	userRepo domain.UserRepository
	helper   *Helper
}

// New creates a new User Usecase instance conforming to domain.UserUsecase
func New(userRepo domain.UserRepository) domain.UserUsecase {
	return &usecase{
		userRepo: userRepo,
		helper:   NewHelper(),
	}
}

// GetProfile retrieves the profile details for a given user ID
func (u *usecase) GetProfile(ctx context.Context, userID string) (*domain.User, error) {
	if userID == "" {
		return nil, domain.ErrUnauthorized
	}

	user, err := u.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user profile: %w", err)
	}
	if user == nil {
		return nil, domain.ErrUserNotFound
	}
	return user, nil
}

// UpdateProfile updates user profile preferences, country, career path, and tech stack
func (u *usecase) UpdateProfile(ctx context.Context, userID string, req *domain.UpdateProfileRequest) (*domain.User, error) {
	if userID == "" {
		return nil, domain.ErrUnauthorized
	}
	if err := u.helper.ValidateRoadmapView(req.PreferredRoadmapView); err != nil {
		return nil, err
	}
	return u.userRepo.UpdateProfile(ctx, userID, req)
}

// GetActivityLogs orchestrates daily attendance verification, streak updates, and 7-day consistency summary assembly
func (u *usecase) GetActivityLogs(ctx context.Context, userID string) (*domain.UserActivitySummaryResponse, error) {
	if userID == "" {
		return nil, domain.ErrUnauthorized
	}

	user, err := u.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch user for activity logs: %w", err)
	}
	if user == nil {
		return nil, domain.ErrUserNotFound
	}

	now := time.Now().UTC()
	todayStr := now.Format("2006-01-02")
	startOfToday, startOfTomorrow, calendarStart := u.helper.ResolveCalendarWindow(now)

	alreadyActiveToday, err := u.userRepo.HasActivityInRange(ctx, userID, startOfToday, startOfTomorrow)
	if err == nil && !alreadyActiveToday {
		_ = u.userRepo.LogActivity(ctx, &domain.UserActivityLog{
			UserID:       userID,
			ActivityType: "daily_login",
			XPEarned:     0,
			Metadata:     map[string]interface{}{"date": todayStr},
		})
		if newStreak, changed := u.helper.EvaluateDailyStreak(user.Streak, user.LastActiveAt, now); changed {
			user.Streak = newStreak
			user.LastActiveAt = &now
			_ = u.userRepo.UpdateGamification(ctx, userID, user.XP, user.CurrentLevel, newStreak, &now)
		}
	}

	dailyStats, err := u.userRepo.GetDailyActivityStatsSince(ctx, userID, calendarStart)
	if err != nil {
		return nil, fmt.Errorf("failed to get daily activity stats: %w", err)
	}

	return u.helper.BuildWeeklyActivitySummary(user.Streak, user.LastActiveAt, dailyStats, now), nil
}

// ClaimDailyReward validates reward type and claims the daily habit reward
func (u *usecase) ClaimDailyReward(ctx context.Context, userID string, rewardType string) (*domain.DailyRewardClaimResponse, error) {
	if userID == "" {
		return nil, domain.ErrUnauthorized
	}

	xpAwarded, err := u.helper.ResolveDailyRewardXP(rewardType)
	if err != nil {
		return nil, err
	}

	user, err := u.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch user: %w", err)
	}
	if user == nil {
		return nil, domain.ErrUserNotFound
	}

	newLevel := u.helper.CalculateLevel(user.XP + xpAwarded)
	return u.userRepo.ClaimDailyReward(ctx, userID, rewardType, xpAwarded, newLevel)
}

// GetDailyRewardsStatus checks reward claim status for the authenticated user
func (u *usecase) GetDailyRewardsStatus(ctx context.Context, userID string) (*domain.DailyRewardsStatusResponse, error) {
	if userID == "" {
		return nil, domain.ErrUnauthorized
	}
	return u.userRepo.GetDailyRewardsStatus(ctx, userID)
}
