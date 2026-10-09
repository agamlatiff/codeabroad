package usecase_test

import (
	"codeabroad/backend/internal/domain"
	"codeabroad/backend/internal/usecase"
	"context"
	"testing"
)

type mockQuestRepository struct {
	questsByID  map[string]*domain.Quest
	dailyQuests []domain.Quest
}

func newMockQuestRepository() *mockQuestRepository {
	return &mockQuestRepository{
		questsByID: make(map[string]*domain.Quest),
	}
}

func (m *mockQuestRepository) GetByID(ctx context.Context, id string, userID string) (*domain.Quest, error) {
	q, ok := m.questsByID[id]
	if !ok {
		return nil, domain.ErrQuestNotFound
	}
	return q, nil
}

func (m *mockQuestRepository) GetByChapterID(ctx context.Context, chapterID string, userID string) ([]domain.Quest, error) {
	var list []domain.Quest
	for _, q := range m.questsByID {
		if q.ChapterID != nil && *q.ChapterID == chapterID {
			list = append(list, *q)
		}
	}
	return list, nil
}

func (m *mockQuestRepository) GetDailyQuests(ctx context.Context, userID string) ([]domain.Quest, error) {
	return m.dailyQuests, nil
}

func (m *mockQuestRepository) ListQuests(ctx context.Context, filter domain.QuestFilter, userID string) ([]domain.Quest, error) {
	var list []domain.Quest
	for _, q := range m.questsByID {
		list = append(list, *q)
	}
	return list, nil
}

func (m *mockQuestRepository) GetNextSequentialQuest(ctx context.Context, currentQuestID string, userID string) (*domain.QuestSummary, error) {
	return &domain.QuestSummary{
		ID:    "next-q",
		Title: "Next Sequential Quest",
	}, nil
}

type mockUserQuestRepository struct {
	userQuests map[string]*domain.UserQuest
}

func newMockUserQuestRepository() *mockUserQuestRepository {
	return &mockUserQuestRepository{
		userQuests: make(map[string]*domain.UserQuest),
	}
}

func (m *mockUserQuestRepository) GetByUserAndQuest(ctx context.Context, userID, questID string) (*domain.UserQuest, error) {
	return m.userQuests[userID+":"+questID], nil
}

func (m *mockUserQuestRepository) UpsertUserQuest(ctx context.Context, uq *domain.UserQuest) error {
	m.userQuests[uq.UserID+":"+uq.QuestID] = uq
	return nil
}

func (m *mockUserQuestRepository) MarkCompleted(ctx context.Context, userID, questID, code string, passed, total int) error {
	m.userQuests[userID+":"+questID] = &domain.UserQuest{
		UserID:         userID,
		QuestID:        questID,
		Status:         "completed",
		CodeSubmission: &code,
		TestsPassed:    passed,
		TotalTests:     total,
	}
	return nil
}

func (m *mockUserQuestRepository) CountCompletedByCareerPath(ctx context.Context, userID, careerPathID string) (int, error) {
	return 1, nil
}

func (m *mockUserQuestRepository) CountTotalByCareerPath(ctx context.Context, careerPathID string) (int, error) {
	return 5, nil
}

func TestQuestUsecase_RunUnitTests_GoJWT(t *testing.T) {
	ctx := context.Background()
	qRepo := newMockQuestRepository()
	uqRepo := newMockUserQuestRepository()
	userRepo := newOnboardingMockUserRepo()

	questID := "d1000001-0000-0000-0000-000000000001"
	qRepo.questsByID[questID] = &domain.Quest{
		ID:    questID,
		Title: "Bab 2: Gin JWT Auth Middleware",
		AcceptanceCriteria: []domain.AcceptanceCriterion{
			{ID: "crit_1", Description: "Check Bearer"},
			{ID: "crit_2", Description: "Set user_id"},
			{ID: "crit_3", Description: "Call c.Next()"},
		},
	}

	u := usecase.NewQuestUsecase(qRepo, uqRepo, userRepo)

	// Skenario 1: Solusi lulus (Passing)
	passingCode := `
		package middleware
		func AuthMiddleware() gin.HandlerFunc {
			return func(c *gin.Context) {
				if !strings.HasPrefix(h, "Bearer ") { c.AbortWithStatusJSON(401, nil); return }
				c.Set("user_id", "uid-123")
				c.Next()
			}
		}
	`
	res, err := u.RunUnitTests(ctx, questID, &domain.RunTestsRequest{Code: passingCode})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if !res.Success {
		t.Errorf("expected test execution to succeed, got false")
	}
	if res.TestsPassed != 3 {
		t.Errorf("expected 3 tests passed, got %d", res.TestsPassed)
	}

	// Skenario 2: Solusi gagal (Failing criteria)
	failingCode := `package middleware; func AuthMiddleware() {}`
	failRes, err := u.RunUnitTests(ctx, questID, &domain.RunTestsRequest{Code: failingCode})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if failRes.Success {
		t.Errorf("expected test execution to fail for empty implementation")
	}
	if failRes.TestsPassed == 3 {
		t.Errorf("expected tests passed < 3, got %d", failRes.TestsPassed)
	}
}

func TestQuestUsecase_SubmitQuest(t *testing.T) {
	ctx := context.Background()
	qRepo := newMockQuestRepository()
	uqRepo := newMockUserQuestRepository()
	userRepo := newOnboardingMockUserRepo()

	userID := "user-123"
	_ = userRepo.Create(ctx, &domain.User{ID: userID, XP: 100, CurrentLevel: 1, Streak: 3})

	questID := "d1000001-0000-0000-0000-000000000001"
	qRepo.questsByID[questID] = &domain.Quest{
		ID:       questID,
		Title:    "Bab 2: Gin JWT Auth Middleware",
		XPReward: 50,
		NihongoNotes: &domain.NihongoNote{
			Term: "認可", Reading: "Nin-ka", Meaning: "Authorization",
		},
	}

	u := usecase.NewQuestUsecase(qRepo, uqRepo, userRepo)

	passingCode := `
		if !strings.HasPrefix(h, "Bearer ") { c.AbortWithStatusJSON(401, nil); return }
		c.Set("user_id", "uid-123")
		c.Next()
	`

	subRes, err := u.SubmitQuest(ctx, questID, userID, &domain.SubmitQuestRequest{Code: passingCode})
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}
	if subRes.XPAwarded != 50 {
		t.Errorf("expected 50 XP awarded, got %d", subRes.XPAwarded)
	}
	if subRes.CurrentXP != 150 {
		t.Errorf("expected current XP 150, got %d", subRes.CurrentXP)
	}
	if subRes.UnlockedVocab == nil || subRes.UnlockedVocab.Term != "認可" {
		t.Errorf("expected unlocked vocab 認可, got %v", subRes.UnlockedVocab)
	}
}
