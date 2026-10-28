package usecase_test

import (
	"codeabroad/backend/internal/domain"
	"codeabroad/backend/internal/usecase"
	"context"
	"testing"
)

type mockRoadmapRepository struct {
	roadmapsByCareerPathID map[string]*domain.RoadmapResponse
	roadmapsBySlug         map[string]*domain.RoadmapResponse
	fullSyllabus           map[string]*domain.RoadmapResponse
}

func newMockRoadmapRepository() *mockRoadmapRepository {
	return &mockRoadmapRepository{
		roadmapsByCareerPathID: make(map[string]*domain.RoadmapResponse),
		roadmapsBySlug:         make(map[string]*domain.RoadmapResponse),
		fullSyllabus:           make(map[string]*domain.RoadmapResponse),
	}
}

func (m *mockRoadmapRepository) GetByCareerPathID(ctx context.Context, careerPathID string) (*domain.RoadmapResponse, error) {
	rm, ok := m.roadmapsByCareerPathID[careerPathID]
	if !ok {
		return nil, domain.ErrRoadmapNotFound
	}
	return rm, nil
}

func (m *mockRoadmapRepository) GetByCareerPathSlug(ctx context.Context, slug string) (*domain.RoadmapResponse, error) {
	rm, ok := m.roadmapsBySlug[slug]
	if !ok {
		return nil, domain.ErrRoadmapNotFound
	}
	return rm, nil
}

func (m *mockRoadmapRepository) GetFullSyllabus(ctx context.Context, roadmapID string, userID string) (*domain.RoadmapResponse, error) {
	rm, ok := m.fullSyllabus[roadmapID]
	if !ok {
		return nil, domain.ErrRoadmapNotFound
	}
	return rm, nil
}

func TestRoadmapUsecase_GetTrackRoadmap(t *testing.T) {
	ctx := context.Background()
	rmRepo := newMockRoadmapRepository()
	cpRepo := newMockCareerPathRepository()
	userRepo := newOnboardingMockUserRepo()

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
	rmRepo.roadmapsBySlug["backend"] = rm
	rmRepo.fullSyllabus["rm-1"] = rm

	u := usecase.NewRoadmapUsecase(rmRepo, cpRepo, userRepo)

	// Happy path: get by slug
	res, err := u.GetTrackRoadmap(ctx, "backend", "user-1")
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
	rmRepo := newMockRoadmapRepository()
	cpRepo := newMockCareerPathRepository()
	userRepo := newOnboardingMockUserRepo()

	cpID := "cp-1"
	user := &domain.User{
		ID:           "user-1",
		CareerPathID: &cpID,
	}
	_ = userRepo.Create(ctx, user)

	rm := &domain.RoadmapResponse{
		ID:           "rm-1",
		CareerPathID: &cpID,
		Title:        "Go Backend Developer",
		IsActive:     true,
	}
	rmRepo.roadmapsByCareerPathID[cpID] = rm
	rmRepo.fullSyllabus["rm-1"] = rm

	u := usecase.NewRoadmapUsecase(rmRepo, cpRepo, userRepo)

	res, err := u.GetActiveUserRoadmap(ctx, "user-1")
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if res.ID != "rm-1" {
		t.Errorf("expected roadmap ID 'rm-1', got %s", res.ID)
	}
}
