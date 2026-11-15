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
		},
	}

	uc := user.NewUsecase(repo)
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

	// Golden chest should award 50 XP and bump level from 1 (80 XP) to 2 (130 XP)
	chestRes, err := uc.ClaimDailyReward(context.Background(), "user-123", "golden_chest")
	if err != nil {
		t.Fatalf("expected no error for golden_chest, got %v", err)
	}
	if chestRes.XPAwarded != 50 {
		t.Errorf("expected 50 XP, got %d", chestRes.XPAwarded)
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
		UserProfile: user.UserProfile{Name: "Initial", Username: "learner123", DailyGoalMinutes: 15, PreferredRoadmapView: "map"},
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
	spacedBio := "  Backend Engineer  "
	view := "syllabus"
	updated, err := uc.UpdateProfile(context.Background(), "user-123", &user.UpdateProfileRequest{
		Name:                 &spacedName,
		Bio:                  &spacedBio,
		PreferredRoadmapView: &view,
	})
	if err != nil {
		t.Fatalf("expected valid update to succeed, got %v", err)
	}
	if updated.Name != "Budi Santoso" {
		t.Errorf("expected trimmed name 'Budi Santoso', got %q", updated.Name)
	}
	if updated.Bio == nil || *updated.Bio != "Backend Engineer" {
		t.Errorf("expected trimmed bio 'Backend Engineer', got %v", updated.Bio)
	}
	if updated.PreferredRoadmapView != "syllabus" {
		t.Errorf("expected preferred_roadmap_view 'syllabus', got %q", updated.PreferredRoadmapView)
	}
}

