package mock

import (
	"codeabroad/backend/internal/domain"
	"context"
)

// CareerPathRepository implements domain.CareerPathRepository for unit testing
type CareerPathRepository struct {
	CareerPaths map[string]*domain.CareerPath
}

// NewCareerPathRepository creates an in-memory mock CareerPathRepository
func NewCareerPathRepository() *CareerPathRepository {
	return &CareerPathRepository{
		CareerPaths: make(map[string]*domain.CareerPath),
	}
}

func (m *CareerPathRepository) GetAll(ctx context.Context) ([]domain.CareerPath, error) {
	var list []domain.CareerPath
	for _, cp := range m.CareerPaths {
		list = append(list, *cp)
	}
	return list, nil
}

func (m *CareerPathRepository) GetByID(ctx context.Context, id string) (*domain.CareerPath, error) {
	cp, ok := m.CareerPaths[id]
	if !ok {
		return nil, domain.ErrNotFound
	}
	return cp, nil
}

func (m *CareerPathRepository) GetBySlug(ctx context.Context, slug string) (*domain.CareerPath, error) {
	cp, ok := m.CareerPaths[slug]
	if !ok {
		return nil, domain.ErrNotFound
	}
	return cp, nil
}
