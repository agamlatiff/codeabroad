package usecase

import (
	"codeabroad/backend/internal/domain"
	"context"
	"fmt"
)

type roadmapUsecase struct {
	roadmapRepo    domain.RoadmapRepository
	careerPathRepo domain.CareerPathRepository
	userRepo       domain.UserRepository
}

// NewRoadmapUsecase creates a new RoadmapUsecase instance
func NewRoadmapUsecase(
	roadmapRepo domain.RoadmapRepository,
	careerPathRepo domain.CareerPathRepository,
	userRepo domain.UserRepository,
) domain.RoadmapUsecase {
	return &roadmapUsecase{
		roadmapRepo:    roadmapRepo,
		careerPathRepo: careerPathRepo,
		userRepo:       userRepo,
	}
}

// GetTrackRoadmap retrieves the syllabus tree for a specific career track slug
func (u *roadmapUsecase) GetTrackRoadmap(ctx context.Context, slug string, userID string) (*domain.Roadmap, error) {
	if slug == "" || slug == "active" {
		return u.GetActiveUserRoadmap(ctx, userID)
	}

	rm, err := u.roadmapRepo.GetByCareerPathSlug(ctx, slug)
	if err != nil {
		return nil, err
	}

	return u.roadmapRepo.GetFullSyllabus(ctx, rm.ID, userID)
}

// GetActiveUserRoadmap retrieves the syllabus tree for the logged-in user's chosen career track
func (u *roadmapUsecase) GetActiveUserRoadmap(ctx context.Context, userID string) (*domain.Roadmap, error) {
	user, err := u.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user: %w", err)
	}

	var careerPathID string
	if user.CareerPathID != nil && *user.CareerPathID != "" {
		careerPathID = *user.CareerPathID
	} else {
		// Default to backend track if user has not selected one
		cp, err := u.careerPathRepo.GetBySlug(ctx, "backend")
		if err != nil {
			return nil, fmt.Errorf("failed to get default career path: %w", err)
		}
		careerPathID = cp.ID
	}

	rm, err := u.roadmapRepo.GetByCareerPathID(ctx, careerPathID)
	if err != nil {
		// Fallback to slug search if ID matching yields empty
		rm, err = u.roadmapRepo.GetByCareerPathSlug(ctx, "backend")
		if err != nil {
			return nil, err
		}
	}

	return u.roadmapRepo.GetFullSyllabus(ctx, rm.ID, userID)
}
