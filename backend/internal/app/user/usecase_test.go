package user_test

import (
	"context"
	"errors"
	"strings"
	"testing"

	"codeabroad/backend/internal/app/user"
)

func TestGetProfile_Success(t *testing.T) {
	repo := user.NewMockRepository()
	repo.Users["user-123"] = &user.User{
		UserAccount: user.UserAccount{
			ID:    "user-123",
			Email: "learner@codeabroad.io",
		},
		UserProfile: user.UserProfile{
			Name:             "CodeAbroad Learner",
			Username:         "learner123",
			DailyGoalMinutes: 15,
		},
	}

	uc := user.NewUsecase(repo)
	res, err := uc.GetProfile(context.Background(), "user-123")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if res.Name != "CodeAbroad Learner" {
		t.Errorf("expected name 'CodeAbroad Learner', got '%s'", res.Name)
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
		UserAccount: user.UserAccount{ID: "user-123", Email: "learner@codeabroad.io"},
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
		UserAccount: user.UserAccount{ID: "user-123", Email: "learner@codeabroad.io"},
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

