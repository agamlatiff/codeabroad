package user

import (
	"context"
	"fmt"
	"log"
	"sync"
	"time"

	"merantalk/backend/internal/shared/apperror"
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

// UpdateProfile updates user profile preferences and learning goals
func (u *usecase) UpdateProfile(ctx context.Context, userID string, req *UpdateProfileRequest) (*User, error) {
	if userID == "" {
		return nil, apperror.ErrUnauthorized
	}
	if err := u.helper.ValidateAndNormalizeUpdateProfile(req); err != nil {
		return nil, err
	}
	return u.userRepo.UpdateProfile(ctx, userID, req)
}

// GetActivityLogs orchestrates daily attendance verification, streak updates, and 7-day consistency summary assembly
func (u *usecase) GetActivityLogs(ctx context.Context, userID string) (*UserActivitySummaryResponse, error) {
	if userID == "" {
		return nil, apperror.ErrUnauthorized
	}

	now := time.Now().UTC()
	todayStr := now.In(u.helper.DefaultLocation()).Format("2006-01-02")
	startOfToday, startOfTomorrow, calendarStart := u.helper.ResolveCalendarWindow(now)

	if _, err := u.userRepo.EnsureDailyLogin(ctx, userID, todayStr, startOfToday, startOfTomorrow); err != nil {
		log.Printf("[WARN] [user.GetActivityLogs] failed to ensure daily login for user %s: %v", userID, err)
	}

	var (
		wg         sync.WaitGroup
		usr        *User
		usrErr     error
		dailyStats map[string]DailyActivityStat
		statsErr   error
	)
	wg.Add(2)

	go func() {
		defer wg.Done()
		usr, usrErr = u.userRepo.GetByID(ctx, userID)
	}()

	go func() {
		defer wg.Done()
		dailyStats, statsErr = u.userRepo.GetDailyActivityStatsSince(ctx, userID, calendarStart)
	}()

	wg.Wait()

	if usrErr != nil {
		return nil, fmt.Errorf("failed to fetch user for activity logs: %w", usrErr)
	}
	if usr == nil {
		return nil, ErrUserNotFound
	}
	if statsErr != nil {
		return nil, fmt.Errorf("failed to get daily activity stats: %w", statsErr)
	}

	return u.helper.BuildWeeklyActivitySummary(usr.Streak, usr.LastActiveAt, dailyStats, now), nil
}

// ClaimDailyReward validates reward type and claims the daily habit reward
func (u *usecase) ClaimDailyReward(ctx context.Context, userID string, rewardType string) (*DailyRewardClaimResponse, error) {
	if userID == "" {
		return nil, apperror.ErrUnauthorized
	}

	xpAwarded, gemsAwarded, err := u.helper.ResolveDailyReward(rewardType)
	if err != nil {
		return nil, err
	}

	return u.userRepo.ClaimDailyReward(ctx, userID, rewardType, xpAwarded, gemsAwarded)
}

// GetDailyRewardsStatus checks reward claim status for the authenticated user
func (u *usecase) GetDailyRewardsStatus(ctx context.Context, userID string) (*DailyRewardsStatusResponse, error) {
	if userID == "" {
		return nil, apperror.ErrUnauthorized
	}
	return u.userRepo.GetDailyRewardsStatus(ctx, userID)
}

