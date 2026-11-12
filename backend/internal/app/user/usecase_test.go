package user_test

import (
	"context"
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
		},
	}

	uc := user.NewUsecase(repo)
	res, err := uc.ClaimDailyReward(context.Background(), "user-123", "lesson_milestone")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if res.XPAwarded != 30 {
		t.Errorf("expected 30 XP, got %d", res.XPAwarded)
	}
	if res.CurrentXP != 80 {
		t.Errorf("expected 80 XP, got %d", res.CurrentXP)
	}
}

