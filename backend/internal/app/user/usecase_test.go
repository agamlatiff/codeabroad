package user_test

import (
	"context"
	"errors"
	"strings"
	"testing"
	"time"

	"merantalk/backend/internal/app/user"
	"merantalk/backend/internal/shared/apperror"
)

func TestGetProfile_Success(t *testing.T) {
	repo := user.NewMockRepository()
	repo.Users["user-123"] = &user.User{
		UserAccount: user.UserAccount{
			ID:    "user-123",
			Email: "learner@merantalk.id",
		},
		UserProfile: user.UserProfile{
			Name:             "Merantalk Learner",
			Username:         "learner123",
			DailyGoalMinutes: 15,
		},
	}

	uc := user.NewUsecase(repo)
	res, err := uc.GetProfile(context.Background(), "user-123")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if res.Name != "Merantalk Learner" {
		t.Errorf("expected name 'Merantalk Learner', got '%s'", res.Name)
	}
	if res.DailyGoalMinutes != 15 {
		t.Errorf("expected daily goal 15, got %d", res.DailyGoalMinutes)
	}
}

func TestClaimDailyReward_Success(t *testing.T) {
	repo := user.NewMockRepository()
	repo.Users["user-123"] = &user.User{
		UserAccount: user.UserAccount{
			ID: "user-123",
		},
		UserGamificationStats: user.UserGamificationStats{
			XP:           50,
			CurrentLevel: 1,
			Streak:       3,
			Gems:         10,
		},
	}

	uc := user.NewUsecase(repo)

	// Golden chest must fail before daily XP threshold (50 XP) is reached
	if _, err := uc.ClaimDailyReward(context.Background(), "user-123", "golden_chest"); !errors.Is(err, user.ErrDailyRewardNotUnlocked) {
		t.Fatalf("expected ErrDailyRewardNotUnlocked before earning daily XP, got %v", err)
	}

	// Vocab quest must fail before reviewing at least 3 flashcards today (WIB)
	repo.FlashcardsReviewedToday["user-123"] = 2
	if _, err := uc.ClaimDailyReward(context.Background(), "user-123", "vocab_quest"); !errors.Is(err, user.ErrDailyRewardNotUnlocked) {
		t.Fatalf("expected ErrDailyRewardNotUnlocked before reviewing 3 flashcards, got %v", err)
	}

	// Simulate 3 flashcards reviewed today
	repo.FlashcardsReviewedToday["user-123"] = 3

	res, err := uc.ClaimDailyReward(context.Background(), "user-123", "vocab_quest")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if res.XPAwarded != 30 {
		t.Errorf("expected 30 XP, got %d", res.XPAwarded)
	}
	if res.CurrentXP != 80 {
		t.Errorf("expected 80 XP, got %d", res.CurrentXP)
	}

	// Simulate completing a 20 XP lesson today so daily XP reaches 30 + 20 = 50 XP
	_ = repo.LogActivity(context.Background(), &user.UserActivityLog{
		UserID:       "user-123",
		ActivityType: "lesson_completed",
		XPEarned:     20,
	})

	// Golden chest should award 50 XP + 20 Gems and bump level from 1 (80 XP) to 2 (130 XP)
	chestRes, err := uc.ClaimDailyReward(context.Background(), "user-123", "golden_chest")
	if err != nil {
		t.Fatalf("expected no error for golden_chest, got %v", err)
	}
	if chestRes.XPAwarded != 50 || chestRes.GemsAwarded != 20 {
		t.Errorf("expected 50 XP and 20 Gems, got %d XP and %d Gems", chestRes.XPAwarded, chestRes.GemsAwarded)
	}
	if chestRes.CurrentGems != 30 {
		t.Errorf("expected 30 Gems total, got %d", chestRes.CurrentGems)
	}
	if chestRes.CurrentLevel != 2 {
		t.Errorf("expected level 2 at 130 XP, got %d", chestRes.CurrentLevel)
	}

	// Re-claiming same reward type should fail with ErrDailyRewardAlreadyClaimed
	_, err = uc.ClaimDailyReward(context.Background(), "user-123", "vocab_quest")
	if !errors.Is(err, user.ErrDailyRewardAlreadyClaimed) {
		t.Errorf("expected ErrDailyRewardAlreadyClaimed, got %v", err)
	}
}

func TestUpdateProfile_ValidationAndTrimming(t *testing.T) {
	repo := user.NewMockRepository()
	repo.Users["user-123"] = &user.User{
		UserAccount: user.UserAccount{ID: "user-123", Email: "learner@merantalk.id"},
		UserProfile: user.UserProfile{Name: "Initial", Username: "learner123", DailyGoalMinutes: 15},
	}
	uc := user.NewUsecase(repo)

	if _, err := uc.UpdateProfile(context.Background(), "user-123", &user.UpdateProfileRequest{}); err == nil {
		t.Fatal("expected error for empty update payload")
	}

	blank := "   "
	if _, err := uc.UpdateProfile(context.Background(), "user-123", &user.UpdateProfileRequest{Name: &blank}); err == nil {
		t.Fatal("expected error for blank name")
	}

	tooLongName := strings.Repeat("a", user.MaxProfileNameLength+1)
	if _, err := uc.UpdateProfile(context.Background(), "user-123", &user.UpdateProfileRequest{Name: &tooLongName}); err == nil {
		t.Fatal("expected error for oversized name")
	}

	invalidGoal := 99
	if _, err := uc.UpdateProfile(context.Background(), "user-123", &user.UpdateProfileRequest{DailyGoalMinutes: &invalidGoal}); err == nil {
		t.Fatal("expected error for invalid daily goal")
	}

	spacedName := "  Budi Santoso  "
	spacedBio := "  JLPT N4 Learner  "
	updated, err := uc.UpdateProfile(context.Background(), "user-123", &user.UpdateProfileRequest{
		Name: &spacedName,
		Bio:  &spacedBio,
	})
	if err != nil {
		t.Fatalf("expected valid update to succeed, got %v", err)
	}
	if updated.Name != "Budi Santoso" {
		t.Errorf("expected trimmed name 'Budi Santoso', got %q", updated.Name)
	}
	if updated.Bio == nil || *updated.Bio != "JLPT N4 Learner" {
		t.Errorf("expected trimmed bio 'JLPT N4 Learner', got %v", updated.Bio)
	}
}

func TestGetActivityLogs_IdempotentDailyLogin(t *testing.T) {
	repo := user.NewMockRepository()
	repo.Users["user-123"] = &user.User{
		UserAccount: user.UserAccount{ID: "user-123", Email: "learner@merantalk.id"},
		UserProfile: user.UserProfile{Name: "Learner", Username: "learner123"},
		UserGamificationStats: user.UserGamificationStats{
			XP:           20,
			CurrentLevel: 1,
			Streak:       0,
		},
	}

	uc := user.NewUsecase(repo)
	res1, err := uc.GetActivityLogs(context.Background(), "user-123")
	if err != nil {
		t.Fatalf("first GetActivityLogs failed: %v", err)
	}
	if res1.CurrentStreak != 1 {
		t.Errorf("expected streak 1 after first daily login, got %d", res1.CurrentStreak)
	}
	if len(repo.ActivityLogs) != 1 {
		t.Fatalf("expected 1 daily_login activity log, got %d", len(repo.ActivityLogs))
	}

	// Second call on same day must not create duplicate daily_login logs
	res2, err := uc.GetActivityLogs(context.Background(), "user-123")
	if err != nil {
		t.Fatalf("second GetActivityLogs failed: %v", err)
	}
	if res2.CurrentStreak != 1 {
		t.Errorf("expected streak to remain 1, got %d", res2.CurrentStreak)
	}
	if len(repo.ActivityLogs) != 1 {
		t.Errorf("expected still 1 daily_login activity log on repeat call, got %d", len(repo.ActivityLogs))
	}
}

type stubStreakBadgeAwarder struct {
	awardedKeys []string
}

func (s *stubStreakBadgeAwarder) AwardStreakBadge(_ context.Context, _ string, badgeKey string, _ int) error {
	s.awardedKeys = append(s.awardedKeys, badgeKey)
	return nil
}

func TestClaimDailyReward_EvaluatesStreakBadges(t *testing.T) {
	repo := user.NewMockRepository()
	yesterday := time.Now().UTC().Add(-24 * time.Hour)
	repo.Users["user-streak"] = &user.User{
		UserAccount: user.UserAccount{ID: "user-streak"},
		UserGamificationStats: user.UserGamificationStats{
			XP:           120,
			CurrentLevel: 2,
			Streak:       29,
			LastActiveAt: &yesterday,
		},
	}
	repo.FlashcardsReviewedToday["user-streak"] = 3

	awarder := &stubStreakBadgeAwarder{}
	uc := user.NewUsecaseWithBadges(repo, awarder)

	res, err := uc.ClaimDailyReward(context.Background(), "user-streak", "vocab_quest")
	if err != nil {
		t.Fatalf("expected ClaimDailyReward to succeed, got %v", err)
	}
	if res.Streak != 30 {
		t.Fatalf("expected streak incremented to 30, got %d", res.Streak)
	}
	if len(awarder.awardedKeys) != 2 || awarder.awardedKeys[0] != "streak_7" || awarder.awardedKeys[1] != "streak_30" {
		t.Fatalf("expected streak_7 and streak_30 badges evaluated, got %#v", awarder.awardedKeys)
	}
}

func TestBuildWeeklyActivitySummary_AnchoredYesterdayDoesNotLightToday(t *testing.T) {
	wib := time.FixedZone("WIB", 7*3600)
	// Sunday 2026-11-22 10:00 WIB -> todayIndex = 6, yesterday (Saturday) = 5
	now := time.Date(2026, 11, 22, 10, 0, 0, 0, wib)
	yesterday := now.AddDate(0, 0, -1)

	summary := user.NewHelper().BuildWeeklyActivitySummary(3, &yesterday, map[string]user.DailyActivityStat{}, now)
	if len(summary.WeeklyLogs) != 7 {
		t.Fatalf("expected 7 weekly log entries, got %d", len(summary.WeeklyLogs))
	}
	if summary.WeeklyLogs[6].IsToday != true {
		t.Fatalf("expected Sunday index 6 to be IsToday=true")
	}
	if summary.WeeklyLogs[6].IsActive {
		t.Fatalf("expected today (before any today activity) NOT to be marked active when lastActiveAt was yesterday")
	}
	for _, idx := range []int{3, 4, 5} {
		if !summary.WeeklyLogs[idx].IsActive {
			t.Errorf("expected anchored streak day index %d (%s) to be active", idx, summary.WeeklyLogs[idx].Date)
		}
	}
	todayStr := now.Format("2006-01-02")
	for _, dt := range summary.ActiveDates {
		if dt == todayStr {
			t.Fatalf("expected ActiveDates not to include %s when lastActiveAt was yesterday and dailyStats has no today row", todayStr)
		}
	}
}

func TestUpdateProfile_AvatarURLValidation(t *testing.T) {
	repo := user.NewMockRepository()
	repo.Users["user-123"] = &user.User{
		UserAccount: user.UserAccount{ID: "user-123", Email: "learner@merantalk.id"},
		UserProfile: user.UserProfile{Name: "Learner", Username: "learner123", DailyGoalMinutes: 15},
	}
	uc := user.NewUsecase(repo)

	invalidURLs := []string{
		"//evil.example/pixel.png",
		"/\\evil.example/pixel.png",
		"javascript:alert(1)",
	}
	for _, raw := range invalidURLs {
		avatar := raw
		_, err := uc.UpdateProfile(context.Background(), "user-123", &user.UpdateProfileRequest{
			AvatarURL: &avatar,
		})
		if err == nil {
			t.Fatalf("expected invalid avatar_url %q to be rejected", raw)
		}
		var domainErr *apperror.DomainError
		if !errors.As(err, &domainErr) || domainErr.Code != "INVALID_AVATAR_URL" {
			t.Fatalf("expected INVALID_AVATAR_URL for %q, got: %v", raw, err)
		}
	}

	validURLs := []string{
		"/avatars/default.png",
		"https://api.dicebear.com/7.x/adventurer/svg?seed=akira",
	}
	for _, raw := range validURLs {
		avatar := raw
		updated, err := uc.UpdateProfile(context.Background(), "user-123", &user.UpdateProfileRequest{
			AvatarURL: &avatar,
		})
		if err != nil {
			t.Fatalf("expected valid avatar_url %q to succeed, got: %v", raw, err)
		}
		if updated.AvatarURL == nil || *updated.AvatarURL != raw {
			t.Fatalf("expected AvatarURL %q, got %v", raw, updated.AvatarURL)
		}
	}
}

