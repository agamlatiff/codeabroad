package user

import (
	"context"
	"fmt"
	"log"
	"time"

	"codeabroad/backend/internal/shared/apperror"
)

type usecase struct {
	userRepo Repository
	helper   *Helper
}

// NewUsecase creates a new User Usecase instance
func NewUsecase(userRepo Repository) Usecase {
	return &usecase{
		userRepo: userRepo,
		helper:   NewHelper(),
	}
}

// GetProfile retrieves the profile details for a given user ID
func (u *usecase) GetProfile(ctx context.Context, userID string) (*User, error) {
	if userID == "" {
		return nil, apperror.ErrUnauthorized
	}

	usr, err := u.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user profile: %w", err)
	}
	if usr == nil {
		return nil, ErrUserNotFound
	}
	return usr, nil
}

// UpdateProfile updates user profile preferences, country, career path, and tech stack
func (u *usecase) UpdateProfile(ctx context.Context, userID string, req *UpdateProfileRequest) (*User, error) {
	if userID == "" {
		return nil, apperror.ErrUnauthorized
	}
	if err := u.helper.ValidateRoadmapView(req.PreferredRoadmapView); err != nil {
		return nil, err
	}
	return u.userRepo.UpdateProfile(ctx, userID, req)
}

// GetActivityLogs orchestrates daily attendance verification, streak updates, and 7-day consistency summary assembly
func (u *usecase) GetActivityLogs(ctx context.Context, userID string) (*UserActivitySummaryResponse, error) {
	if userID == "" {
		return nil, apperror.ErrUnauthorized
	}

	usr, err := u.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch user for activity logs: %w", err)
	}
	if usr == nil {
		return nil, ErrUserNotFound
	}

	now := time.Now().UTC()
	todayStr := now.In(u.helper.DefaultLocation()).Format("2006-01-02")
	startOfToday, startOfTomorrow, calendarStart := u.helper.ResolveCalendarWindow(now)

	alreadyActiveToday, err := u.userRepo.HasActivityInRange(ctx, userID, startOfToday, startOfTomorrow)
	if err == nil && !alreadyActiveToday {
		if err := u.userRepo.LogActivity(ctx, &UserActivityLog{
			UserID:       userID,
			ActivityType: "daily_login",
			XPEarned:     0,
			Metadata:     map[string]interface{}{"date": todayStr},
		}); err != nil {
			log.Printf("[WARN] [user.GetActivityLogs] failed to log daily login activity for user %s: %v", userID, err)
		}
		if newStreak, changed := u.helper.EvaluateDailyStreak(usr.Streak, usr.LastActiveAt, now); changed {
			usr.Streak = newStreak
			usr.LastActiveAt = &now
			if err := u.userRepo.UpdateGamification(ctx, userID, usr.XP, usr.CurrentLevel, newStreak, &now); err != nil {
				log.Printf("[WARN] [user.GetActivityLogs] failed to update streak gamification for user %s: %v", userID, err)
			}
		}
	}

	dailyStats, err := u.userRepo.GetDailyActivityStatsSince(ctx, userID, calendarStart)
	if err != nil {
		return nil, fmt.Errorf("failed to get daily activity stats: %w", err)
	}

	return u.helper.BuildWeeklyActivitySummary(usr.Streak, usr.LastActiveAt, dailyStats, now), nil
}

// ClaimDailyReward validates reward type and claims the daily habit reward
func (u *usecase) ClaimDailyReward(ctx context.Context, userID string, rewardType string) (*DailyRewardClaimResponse, error) {
	if userID == "" {
		return nil, apperror.ErrUnauthorized
	}

	xpAwarded, err := u.helper.ResolveDailyRewardXP(rewardType)
	if err != nil {
		return nil, err
	}

	usr, err := u.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch user: %w", err)
	}
	if usr == nil {
		return nil, ErrUserNotFound
	}

	newLevel := u.helper.CalculateLevel(usr.XP + xpAwarded)
	return u.userRepo.ClaimDailyReward(ctx, userID, rewardType, xpAwarded, newLevel)
}

// GetDailyRewardsStatus checks reward claim status for the authenticated user
func (u *usecase) GetDailyRewardsStatus(ctx context.Context, userID string) (*DailyRewardsStatusResponse, error) {
	if userID == "" {
		return nil, apperror.ErrUnauthorized
	}
	return u.userRepo.GetDailyRewardsStatus(ctx, userID)
}

