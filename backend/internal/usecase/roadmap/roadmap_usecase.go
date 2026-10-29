package roadmap

import (
	"codeabroad/backend/internal/domain"
	"context"
	"fmt"
)

type usecase struct {
	roadmapRepo    domain.RoadmapRepository
	careerPathRepo domain.CareerPathRepository
	userRepo       domain.UserRepository
	helper         *Helper
}

// New creates a new Roadmap Usecase instance conforming to domain.RoadmapUsecase
func New(
	roadmapRepo domain.RoadmapRepository,
	careerPathRepo domain.CareerPathRepository,
	userRepo domain.UserRepository,
) domain.RoadmapUsecase {
	return &usecase{
		roadmapRepo:    roadmapRepo,
		careerPathRepo: careerPathRepo,
		userRepo:       userRepo,
		helper:         NewHelper(),
	}
}

// fetchAndProcessSyllabus retrieves the raw tree from repository and applies business progression logic via roadmap helper
func (u *usecase) fetchAndProcessSyllabus(ctx context.Context, roadmapID string, userID string) (*domain.RoadmapResponse, error) {
	rm, err := u.roadmapRepo.GetFullSyllabus(ctx, roadmapID, userID)
	if err != nil {
		return nil, err
	}
	u.helper.ApplyProgressionRules(rm)
	return rm, nil
}

// GetTrackRoadmap retrieves the syllabus tree for a specific career track slug
func (u *usecase) GetTrackRoadmap(ctx context.Context, slug string, userID string) (*domain.RoadmapResponse, error) {
	if slug == "" || slug == "active" {
		return u.GetActiveUserRoadmap(ctx, userID)
	}

	rm, err := u.roadmapRepo.GetByCareerPathSlug(ctx, slug)
	if err != nil {
		return nil, err
	}

	return u.fetchAndProcessSyllabus(ctx, rm.ID, userID)
}

// GetActiveUserRoadmap retrieves the syllabus tree for the logged-in user's chosen career track
func (u *usecase) GetActiveUserRoadmap(ctx context.Context, userID string) (*domain.RoadmapResponse, error) {
	user, err := u.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user: %w", err)
	}

	var rm *domain.RoadmapResponse

	// 1. Priority: If user has a selected TechStackID, fetch directly by tech stack UUID
	if user.TechStackID != nil && *user.TechStackID != "" {
		rm, err = u.roadmapRepo.GetByTechStackID(ctx, *user.TechStackID)
		if err == nil {
			return u.fetchAndProcessSyllabus(ctx, rm.ID, userID)
		}
	}

	// 2. Fallback to PrimaryStack slug if available (e.g. "golang", "react")
	if user.PrimaryStack != nil && *user.PrimaryStack != "" {
		rm, err = u.roadmapRepo.GetByCareerPathSlug(ctx, *user.PrimaryStack)
		if err == nil {
			return u.fetchAndProcessSyllabus(ctx, rm.ID, userID)
		}
	}

	// 3. Fallback: If tech stack is still not resolved, fallback to default track (golang)
	rm, err = u.roadmapRepo.GetByCareerPathSlug(ctx, "golang")
	if err != nil {
		return nil, fmt.Errorf("failed to get default roadmap track: %w", err)
	}

	return u.fetchAndProcessSyllabus(ctx, rm.ID, userID)
}
