package mock

import (
	"codeabroad/backend/internal/domain"
	"context"
)

// RoadmapRepository implements domain.RoadmapRepository for unit testing
type RoadmapRepository struct {
	RoadmapsByTechStackID map[string]*domain.RoadmapResponse
	RoadmapsBySlug        map[string]*domain.RoadmapResponse
	FullSyllabus          map[string]*domain.RoadmapResponse
}

// NewRoadmapRepository creates an in-memory mock RoadmapRepository
func NewRoadmapRepository() *RoadmapRepository {
	return &RoadmapRepository{
		RoadmapsByTechStackID: make(map[string]*domain.RoadmapResponse),
		RoadmapsBySlug:        make(map[string]*domain.RoadmapResponse),
		FullSyllabus:          make(map[string]*domain.RoadmapResponse),
	}
}

func (m *RoadmapRepository) GetByTechStackID(ctx context.Context, techStackID string) (*domain.RoadmapResponse, error) {
	rm, ok := m.RoadmapsByTechStackID[techStackID]
	if !ok {
		return nil, domain.ErrRoadmapNotFound
	}
	return rm, nil
}

func (m *RoadmapRepository) GetByCareerPathSlug(ctx context.Context, slug string) (*domain.RoadmapResponse, error) {
	rm, ok := m.RoadmapsBySlug[slug]
	if !ok {
		return nil, domain.ErrRoadmapNotFound
	}
	return rm, nil
}

func (m *RoadmapRepository) GetFullSyllabus(ctx context.Context, roadmapID string, userID string) (*domain.RoadmapResponse, error) {
	rm, ok := m.FullSyllabus[roadmapID]
	if !ok {
		return nil, domain.ErrRoadmapNotFound
	}
	return rm, nil
}
