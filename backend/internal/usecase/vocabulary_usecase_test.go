package usecase_test

import (
	"codeabroad/backend/internal/domain"
	"codeabroad/backend/internal/usecase"
	"context"
	"testing"
)

type mockVocabularyRepository struct {
	dailyVocabs []domain.Vocabulary
	allVocabs   []domain.Vocabulary
	err         error
}

func (m *mockVocabularyRepository) GetDailyVocabularies(ctx context.Context, limit int) ([]domain.Vocabulary, error) {
	if m.err != nil {
		return nil, m.err
	}
	if limit > len(m.dailyVocabs) {
		limit = len(m.dailyVocabs)
	}
	return m.dailyVocabs[:limit], nil
}

func (m *mockVocabularyRepository) ListVocabularies(ctx context.Context, category string, limit, offset int) ([]domain.Vocabulary, int, error) {
	if m.err != nil {
		return nil, 0, m.err
	}
	var filtered []domain.Vocabulary
	for _, v := range m.allVocabs {
		if category == "" || v.Category == category {
			filtered = append(filtered, v)
		}
	}
	total := len(filtered)
	if offset >= total {
		return []domain.Vocabulary{}, total, nil
	}
	end := offset + limit
	if end > total {
		end = total
	}
	return filtered[offset:end], total, nil
}

func TestVocabularyUsecase_GetDailyVocabularies(t *testing.T) {
	mockRepo := &mockVocabularyRepository{
		dailyVocabs: []domain.Vocabulary{
			{ID: "v1", Term: "挨拶", Reading: "あいさつ • Aisatsu", Meaning: "Sapaan Pagi & Etika Kantor", Category: "Etika Kantor"},
			{ID: "v2", Term: "実装", Reading: "じっそう • Jissou", Meaning: "Implementasi Fitur", Category: "Pengembangan"},
			{ID: "v3", Term: "朝会", Reading: "あさかい • Asakai", Meaning: "Standup Pagi IT", Category: "Etika Kantor"},
		},
	}

	uc := usecase.NewVocabularyUsecase(mockRepo)
	vocabs, err := uc.GetDailyVocabularies(context.Background())
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(vocabs) != 3 {
		t.Errorf("expected 3 vocabs, got %d", len(vocabs))
	}
	if vocabs[0].Term != "挨拶" {
		t.Errorf("expected first vocab term '挨拶', got '%s'", vocabs[0].Term)
	}
}

func TestVocabularyUsecase_ListVocabularies(t *testing.T) {
	mockRepo := &mockVocabularyRepository{
		allVocabs: []domain.Vocabulary{
			{ID: "v1", Term: "挨拶", Category: "Etika Kantor"},
			{ID: "v2", Term: "実装", Category: "Pengembangan"},
			{ID: "v3", Term: "朝会", Category: "Etika Kantor"},
		},
	}

	uc := usecase.NewVocabularyUsecase(mockRepo)

	// Test category filter
	filtered, total, err := uc.ListVocabularies(context.Background(), "Etika Kantor", 1, 10)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if total != 2 {
		t.Errorf("expected total 2, got %d", total)
	}
	if len(filtered) != 2 {
		t.Errorf("expected 2 items, got %d", len(filtered))
	}

	// Test pagination defaults
	all, totalAll, err := uc.ListVocabularies(context.Background(), "", 0, 0)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if totalAll != 3 {
		t.Errorf("expected total 3, got %d", totalAll)
	}
	if len(all) != 3 {
		t.Errorf("expected 3 items, got %d", len(all))
	}
}
