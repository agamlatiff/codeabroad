package roadmap_test

import (
	"codeabroad/backend/internal/domain"
	"codeabroad/backend/internal/mock"
	"codeabroad/backend/internal/usecase/roadmap"
	"context"
	"testing"
)

func TestRoadmapUsecase_GetTrackRoadmap(t *testing.T) {
	ctx := context.Background()
	rmRepo := mock.NewRoadmapRepository()
	cpRepo := mock.NewCareerPathRepository()
	userRepo := mock.NewUserRepository()

	cpSlugID := "cp-1"
	rm := &domain.RoadmapResponse{
		ID:           "rm-1",
		CareerPathID: &cpSlugID,
		Title:        "Go Backend Developer",
		IsActive:     true,
		Modules: []domain.ModuleResponse{
			{ID: "mod-1", ModuleNumber: 1, Title: "Go Foundations", IsUnlocked: true},
		},
	}
	rmRepo.RoadmapsBySlug["golang"] = rm
	rmRepo.FullSyllabus["rm-1"] = rm

	u := roadmap.New(rmRepo, cpRepo, userRepo)

	// Happy path: get by slug
	res, err := u.GetTrackRoadmap(ctx, "golang", "user-1")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if res.Title != "Go Backend Developer" {
		t.Errorf("expected title 'Go Backend Developer', got %s", res.Title)
	}
	if len(res.Modules) != 1 {
		t.Errorf("expected 1 module, got %d", len(res.Modules))
	}

	// Error path: not found slug
	_, err = u.GetTrackRoadmap(ctx, "nonexistent", "user-1")
	if err == nil {
		t.Fatalf("expected error for nonexistent roadmap, got nil")
	}
}

func TestRoadmapUsecase_GetActiveUserRoadmap(t *testing.T) {
	ctx := context.Background()
	rmRepo := mock.NewRoadmapRepository()
	cpRepo := mock.NewCareerPathRepository()
	userRepo := mock.NewUserRepository()

	tsID := "ts-1"
	user := &domain.User{
		ID:          "user-1",
		TechStackID: &tsID,
	}
	_ = userRepo.Create(ctx, user)

	rm := &domain.RoadmapResponse{
		ID:       "rm-1",
		Title:    "Go Backend Developer",
		IsActive: true,
	}
	rmRepo.RoadmapsByTechStackID[tsID] = rm
	rmRepo.FullSyllabus["rm-1"] = rm

	u := roadmap.New(rmRepo, cpRepo, userRepo)

	// Happy path: priority by tech stack ID
	res, err := u.GetActiveUserRoadmap(ctx, "user-1")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if res.ID != "rm-1" {
		t.Errorf("expected roadmap ID 'rm-1', got %s", res.ID)
	}

	// Fallback path: user has no tech_stack_id, fallbacks to default 'golang' track
	userNoStack := &domain.User{
		ID: "user-2",
	}
	_ = userRepo.Create(ctx, userNoStack)
	rmRepo.RoadmapsBySlug["golang"] = rm

	resFallback, err := u.GetActiveUserRoadmap(ctx, "user-2")
	if err != nil {
		t.Fatalf("expected no error on fallback, got %v", err)
	}
	if resFallback.ID != "rm-1" {
		t.Errorf("expected fallback roadmap ID 'rm-1', got %s", resFallback.ID)
	}
}

func TestRoadmapUsecase_ProgressionAndGating(t *testing.T) {
	ctx := context.Background()
	rmRepo := mock.NewRoadmapRepository()
	cpRepo := mock.NewCareerPathRepository()
	userRepo := mock.NewUserRepository()

	// Setup raw roadmap with 2 modules
	rawRM := &domain.RoadmapResponse{
		ID:    "rm-gating",
		Title: "Go Curriculum",
		Modules: []domain.ModuleResponse{
			{
				ID:           "mod-1",
				ModuleNumber: 1,
				Title:        "Module 1",
				Chapters: []domain.ChapterResponse{
					{
						ID:            "chap-1",
						ModuleID:      "mod-1",
						ChapterNumber: 1,
						Quests: []domain.QuestSummaryResponse{
							{ID: "q-1", Status: "completed"},
							{ID: "q-2", Status: "completed"},
							{ID: "q-3", Status: "completed"},
							{ID: "q-4", Status: "completed"},
							{ID: "q-5", Status: "available"}, // 4 of 5 = 80%
						},
					},
				},
			},
			{
				ID:           "mod-2",
				ModuleNumber: 2,
				Title:        "Module 2",
				Chapters: []domain.ChapterResponse{
					{
						ID:            "chap-2",
						ModuleID:      "mod-2",
						ChapterNumber: 1,
						Quests: []domain.QuestSummaryResponse{
							{ID: "q-6", Status: "available"},
						},
					},
				},
			},
		},
	}
	rmRepo.RoadmapsBySlug["golang"] = rawRM
	rmRepo.FullSyllabus["rm-gating"] = rawRM

	u := roadmap.New(rmRepo, cpRepo, userRepo)

	res, err := u.GetTrackRoadmap(ctx, "golang", "user-progression")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	// Module 1 assertions: 4/5 completed = 80%, unlocked
	mod1 := res.Modules[0]
	if mod1.ProgressRate != 80.0 {
		t.Errorf("expected module 1 progress rate 80.0, got %f", mod1.ProgressRate)
	}
	if !mod1.IsUnlocked {
		t.Errorf("expected module 1 to be unlocked")
	}
	if mod1.IsCompleted {
		t.Errorf("expected module 1 not to be fully completed yet")
	}

	// Module 2 assertions: unlocked because module 1 is >= 80%
	mod2 := res.Modules[1]
	if !mod2.IsUnlocked {
		t.Errorf("expected module 2 to be unlocked when module 1 is at 80%%")
	}
	if mod2.ProgressRate != 0.0 {
		t.Errorf("expected module 2 progress rate 0.0, got %f", mod2.ProgressRate)
	}
}
