package usecase

import (
	"codeabroad/backend/internal/domain"
	"context"
)

type vocabularyUsecase struct {
	vocabRepo domain.VocabularyRepository
}

// NewVocabularyUsecase creates a new VocabularyUsecase instance
func NewVocabularyUsecase(vocabRepo domain.VocabularyRepository) domain.VocabularyUsecase {
	return &vocabularyUsecase{vocabRepo: vocabRepo}
}

// GetDailyVocabularies returns 5 rotating IT Tokyo vocabularies
func (u *vocabularyUsecase) GetDailyVocabularies(ctx context.Context) ([]domain.Vocabulary, error) {
	return u.vocabRepo.GetDailyVocabularies(ctx, 5)
}

// ListVocabularies returns paginated vocabularies with total count
func (u *vocabularyUsecase) ListVocabularies(ctx context.Context, category string, page, limit int) ([]domain.Vocabulary, int, error) {
	if page <= 0 {
		page = 1
	}
	if limit <= 0 {
		limit = 20
	}
	offset := (page - 1) * limit
	return u.vocabRepo.ListVocabularies(ctx, category, limit, offset)
}
