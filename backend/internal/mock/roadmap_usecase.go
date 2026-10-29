package mock

import (
	"codeabroad/backend/internal/domain"
	"context"
)

// RoadmapUsecase implements domain.RoadmapUsecase for unit testing
type RoadmapUsecase struct {
	Roadmap *domain.Roadmap
	Err     error
}

// NewRoadmapUsecase creates an in-memory mock RoadmapUsecase
func NewRoadmapUsecase() *RoadmapUsecase {
	return &RoadmapUsecase{}
}

func (m *RoadmapUsecase) GetTrackRoadmap(ctx context.Context, slug string, userID string) (*domain.Roadmap, error) {
	if m.Err != nil {
		return nil, m.Err
	}
	return m.Roadmap, nil
}

func (m *RoadmapUsecase) GetActiveUserRoadmap(ctx context.Context, userID string) (*domain.Roadmap, error) {
	if m.Err != nil {
		return nil, m.Err
	}
	return m.Roadmap, nil
}
