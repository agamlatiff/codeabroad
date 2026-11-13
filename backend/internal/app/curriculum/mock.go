package curriculum

import (
	"context"
	"encoding/json"
	"fmt"
	"sort"
	"strings"
	"sync"
	"time"
)

// MockRepository implements Repository for unit testing
type MockRepository struct {
	mu                       sync.Mutex
	GrammarPoints            map[string]*GrammarPoint
	Units                    map[string]*UnitNodeResponse
	Lessons                  map[string]*LessonNodeResponse
	LessonProgress           map[string]*UserLessonProgress
	LevelOrders              map[string]int
	UserMaxLevelOrder        map[string]int
	TotalLessonExercises     map[string]int
	AttemptedLessonExercises map[string]int
	UserXP                   map[string]int
	NextLessonID             *string
	GetGrammarPointsErr      error
	GetGrammarPointErr       error
	GetUnitsErr              error
	GetUnitByIDErr           error
	GetLessonsErr            error
	GetLessonByIDErr         error
	GetNextLessonIDErr       error
	GetLessonProgressErr     error
	UpsertProgressErr        error
	RecordCompletionErr      error
	SkipPrecedingErr         error
	CountAttemptsErr         error
}

// NewMockRepository creates an in-memory mock curriculum Repository
func NewMockRepository() *MockRepository {
	return &MockRepository{
		GrammarPoints:            make(map[string]*GrammarPoint),
		Units:                    make(map[string]*UnitNodeResponse),
		Lessons:                  make(map[string]*LessonNodeResponse),
		LessonProgress:           make(map[string]*UserLessonProgress),
		LevelOrders:              make(map[string]int),
		UserMaxLevelOrder:        make(map[string]int),
		TotalLessonExercises:     make(map[string]int),
		AttemptedLessonExercises: make(map[string]int),
		UserXP:                   make(map[string]int),
	}
}

var _ Repository = (*MockRepository)(nil)

func (m *MockRepository) GetGrammarPointsByLevelID(ctx context.Context, levelID string) ([]GrammarPoint, error) {
	if m.GetGrammarPointsErr != nil {
		return nil, m.GetGrammarPointsErr
	}
	var res []GrammarPoint
	for _, gp := range m.GrammarPoints {
		if gp.LevelID == levelID {
			res = append(res, *gp)
		}
	}
	sort.Slice(res, func(i, j int) bool {
		return res[i].OrderIndex < res[j].OrderIndex
	})
	return res, nil
}

func (m *MockRepository) GetGrammarPointByID(ctx context.Context, id string) (*GrammarPoint, error) {
	if m.GetGrammarPointErr != nil {
		return nil, m.GetGrammarPointErr
	}
	gp, ok := m.GrammarPoints[id]
	if !ok {
		return nil, nil
	}
	return gp, nil
}

func (m *MockRepository) GetGrammarPointsByLessonID(ctx context.Context, lessonID string) ([]GrammarPoint, error) {
	if m.GetGrammarPointsErr != nil {
		return nil, m.GetGrammarPointsErr
	}
	var res []GrammarPoint
	for _, gp := range m.GrammarPoints {
		res = append(res, *gp)
	}
	return res, nil
}

func (m *MockRepository) GetUnitsByLevelID(ctx context.Context, levelID string, userID string) ([]UnitNodeResponse, error) {
	if m.GetUnitsErr != nil {
		return nil, m.GetUnitsErr
	}
	var res []UnitNodeResponse
	for _, u := range m.Units {
		if u.LevelID == levelID {
			res = append(res, *u)
		}
	}
	sort.Slice(res, func(i, j int) bool {
		return res[i].OrderIndex < res[j].OrderIndex
	})
	return res, nil
}

func (m *MockRepository) GetUnitByID(ctx context.Context, id string) (*Unit, error) {
	if m.GetUnitByIDErr != nil {
		return nil, m.GetUnitByIDErr
	}
	u, ok := m.Units[id]
	if !ok {
		return nil, nil
	}
	return &Unit{
		ID:          u.ID,
		LevelID:     u.LevelID,
		Title:       u.Title,
		Description: u.Description,
		UnitType:    u.UnitType,
		OrderIndex:  u.OrderIndex,
		CreatedAt:   u.CreatedAt,
	}, nil
}

func (m *MockRepository) GetLessonsByLevelID(ctx context.Context, levelID string, userID string) ([]LessonNodeResponse, error) {
	if m.GetLessonsErr != nil {
		return nil, m.GetLessonsErr
	}
	unitMap := make(map[string]bool)
	for _, u := range m.Units {
		if u.LevelID == levelID {
			unitMap[u.ID] = true
		}
	}
	var res []LessonNodeResponse
	for _, l := range m.Lessons {
		if unitMap[l.UnitID] {
			res = append(res, *l)
		}
	}
	sort.Slice(res, func(i, j int) bool {
		uI := m.Units[res[i].UnitID]
		uJ := m.Units[res[j].UnitID]
		if uI != nil && uJ != nil && uI.OrderIndex != uJ.OrderIndex {
			return uI.OrderIndex < uJ.OrderIndex
		}
		return res[i].OrderIndex < res[j].OrderIndex
	})
	return res, nil
}

func (m *MockRepository) GetLessonsByUnitID(ctx context.Context, unitID string, userID string) ([]LessonNodeResponse, error) {
	if m.GetLessonsErr != nil {
		return nil, m.GetLessonsErr
	}
	var res []LessonNodeResponse
	for _, l := range m.Lessons {
		if l.UnitID == unitID {
			res = append(res, *l)
		}
	}
	sort.Slice(res, func(i, j int) bool {
		return res[i].OrderIndex < res[j].OrderIndex
	})
	return res, nil
}

func (m *MockRepository) GetLessonByID(ctx context.Context, id string, userID string) (*LessonDetailResponse, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	if m.GetLessonByIDErr != nil {
		return nil, m.GetLessonByIDErr
	}
	l, ok := m.Lessons[id]
	if !ok {
		return nil, nil
	}
	isCompleted := l.IsCompleted
	score := l.Score
	isSkipped := l.IsSkipped
	completedAt := l.CompletedAt
	if p, ok := m.LessonProgress[fmt.Sprintf("%s:%s", userID, id)]; ok {
		isCompleted = p.IsCompleted
		score = p.Score
		isSkipped = p.IsSkipped
		cAt := p.CompletedAt
		completedAt = &cAt
	}
	return &LessonDetailResponse{
		ID:          l.ID,
		UnitID:      l.UnitID,
		Title:       l.Title,
		XPReward:    l.XPReward,
		OrderIndex:  l.OrderIndex,
		IsUnlocked:  l.IsUnlocked,
		IsCompleted: isCompleted,
		Score:       score,
		IsSkipped:   isSkipped,
		CompletedAt: completedAt,
	}, nil
}

func (m *MockRepository) GetNextLessonID(ctx context.Context, currentLessonID string) (*string, error) {
	if m.GetNextLessonIDErr != nil {
		return nil, m.GetNextLessonIDErr
	}
	return m.NextLessonID, nil
}

func (m *MockRepository) IsLessonUnlocked(ctx context.Context, userID string, lessonID string) (bool, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	curLesson, ok := m.Lessons[lessonID]
	if !ok {
		return false, ErrLessonNotFound
	}
	curUnit := m.Units[curLesson.UnitID]
	if maxOrder, ok := m.UserMaxLevelOrder[userID]; ok && curUnit != nil {
		if targetOrder, exists := m.LevelOrders[curUnit.LevelID]; exists && targetOrder > maxOrder {
			return false, nil
		}
	}

	key := fmt.Sprintf("%s:%s", userID, lessonID)
	if p, ok := m.LessonProgress[key]; ok && p.IsCompleted {
		return true, nil
	}

	if curUnit == nil {
		return true, nil
	}

	for _, l := range m.Lessons {
		u := m.Units[l.UnitID]
		if u == nil || u.LevelID != curUnit.LevelID {
			continue
		}
		isPreceding := u.OrderIndex < curUnit.OrderIndex ||
			(u.OrderIndex == curUnit.OrderIndex && l.OrderIndex < curLesson.OrderIndex)

		if isPreceding {
			pKey := fmt.Sprintf("%s:%s", userID, l.ID)
			prog := m.LessonProgress[pKey]
			if prog == nil || !prog.IsCompleted {
				return false, nil
			}
		}
	}
	return true, nil
}

func (m *MockRepository) GetUserLessonProgress(ctx context.Context, userID string, lessonID string) (*UserLessonProgress, error) {
	if m.GetLessonProgressErr != nil {
		return nil, m.GetLessonProgressErr
	}
	key := fmt.Sprintf("%s:%s", userID, lessonID)
	p, ok := m.LessonProgress[key]
	if !ok {
		return nil, nil
	}
	return p, nil
}

func (m *MockRepository) UpsertLessonProgress(ctx context.Context, progress *UserLessonProgress) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	return m.upsertLessonProgressLocked(progress)
}

func (m *MockRepository) upsertLessonProgressLocked(progress *UserLessonProgress) error {
	if m.UpsertProgressErr != nil {
		return m.UpsertProgressErr
	}
	if progress.ID == "" {
		progress.ID = fmt.Sprintf("prog_%d", len(m.LessonProgress)+1)
	}
	if progress.CompletedAt.IsZero() {
		progress.CompletedAt = time.Now()
	}
	key := fmt.Sprintf("%s:%s", progress.UserID, progress.LessonID)
	if existing, ok := m.LessonProgress[key]; ok {
		if existing.Score > progress.Score {
			progress.Score = existing.Score
		}
	}
	m.LessonProgress[key] = progress
	return nil
}

func (m *MockRepository) SkipPrecedingLessons(ctx context.Context, userID string, upToLevelOrder int, languageID string) error {
	if m.SkipPrecedingErr != nil {
		return m.SkipPrecedingErr
	}
	for _, l := range m.Lessons {
		key := fmt.Sprintf("%s:%s", userID, l.ID)
		m.LessonProgress[key] = &UserLessonProgress{
			ID:          fmt.Sprintf("skip_%s", l.ID),
			UserID:      userID,
			LessonID:    l.ID,
			IsCompleted: true,
			IsSkipped:   true,
			Score:       100,
			CompletedAt: time.Now(),
		}
	}
	return nil
}

func (m *MockRepository) RecordLessonCompletionTx(ctx context.Context, payload *LessonCompletionPayload) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	if m.RecordCompletionErr != nil {
		return m.RecordCompletionErr
	}
	if payload == nil || payload.Progress == nil {
		return nil
	}

	userID := payload.Progress.UserID
	if _, exists := m.UserXP[userID]; !exists {
		m.UserXP[userID] = payload.NewXP - payload.XPEarned
	}

	key := fmt.Sprintf("%s:%s", userID, payload.Progress.LessonID)
	if existing, ok := m.LessonProgress[key]; ok && existing.IsCompleted {
		payload.XPEarned = 5
		if payload.Metadata != nil {
			payload.Metadata["is_replay"] = true
		}
	}

	if err := m.upsertLessonProgressLocked(payload.Progress); err != nil {
		return err
	}

	m.UserXP[userID] += payload.XPEarned
	payload.NewXP = m.UserXP[userID]
	payload.NewLevel = (payload.NewXP / 100) + 1
	return nil
}

func (m *MockRepository) CountLessonExerciseAttempts(ctx context.Context, userID string, lessonID string) (int, int, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	if m.CountAttemptsErr != nil {
		return 0, 0, m.CountAttemptsErr
	}
	total := m.TotalLessonExercises[lessonID]
	attempted := m.AttemptedLessonExercises[fmt.Sprintf("%s:%s", userID, lessonID)]
	return total, attempted, nil
}

// MockRoadmapCacheRepository provides an in-memory mock for RoadmapCacheRepository
type MockRoadmapCacheRepository struct {
	Cache               map[string][]byte
	GetRoadmapErr       error
	SetRoadmapErr       error
	InvalidateErr       error
	GetRoadmapCallCount int
	SetRoadmapCallCount int
	InvalidateCallCount int
}

// NewMockRoadmapCacheRepository creates an in-memory mock cache repository
func NewMockRoadmapCacheRepository() *MockRoadmapCacheRepository {
	return &MockRoadmapCacheRepository{
		Cache: make(map[string][]byte),
	}
}

var _ RoadmapCacheRepository = (*MockRoadmapCacheRepository)(nil)

func (m *MockRoadmapCacheRepository) GetRoadmap(ctx context.Context, userID string, languageID string) (*RoadmapResponse, error) {
	m.GetRoadmapCallCount++
	if m.GetRoadmapErr != nil {
		return nil, m.GetRoadmapErr
	}
	key := fmt.Sprintf("%s:%s", userID, languageID)
	data, ok := m.Cache[key]
	if !ok {
		return nil, nil
	}
	var res RoadmapResponse
	if err := json.Unmarshal(data, &res); err != nil {
		return nil, err
	}
	return &res, nil
}

func (m *MockRoadmapCacheRepository) SetRoadmap(ctx context.Context, userID string, languageID string, roadmap *RoadmapResponse, ttl time.Duration) error {
	m.SetRoadmapCallCount++
	if m.SetRoadmapErr != nil {
		return m.SetRoadmapErr
	}
	key := fmt.Sprintf("%s:%s", userID, languageID)
	data, err := json.Marshal(roadmap)
	if err != nil {
		return err
	}
	m.Cache[key] = data
	return nil
}

func (m *MockRoadmapCacheRepository) InvalidateRoadmap(ctx context.Context, userID string) error {
	m.InvalidateCallCount++
	if m.InvalidateErr != nil {
		return m.InvalidateErr
	}
	prefix := userID + ":"
	for k := range m.Cache {
		if strings.HasPrefix(k, prefix) {
			delete(m.Cache, k)
		}
	}
	return nil
}

