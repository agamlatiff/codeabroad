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
	mu                   sync.Mutex
	GrammarPoints        map[string]*GrammarPoint
	LessonGrammarPoints  map[string][]string
	Units                map[string]*UnitNodeResponse
	Lessons              map[string]*LessonNodeResponse
	LessonProgress       map[string]*UserLessonProgress
	LevelOrders          map[string]int
	UserMaxLevelOrder    map[string]int
	UserInactiveLevels   map[string]bool
	AttemptSummaries     map[string]*LessonAttemptSummary
	DailyReplayXP        map[string]int
	UserXP               map[string]int
	UserGems             map[string]int
	UserStreak           map[string]int
	UserLastActiveAt     map[string]*time.Time
	NextLessonID         *string
	GetGrammarPointsErr  error
	GetUnitsErr          error
	GetUnitByIDErr       error
	GetLessonsErr        error
	GetLessonByIDErr     error
	GetNextLessonIDErr   error
	RecordCompletionErr  error
	SkipPrecedingErr     error
	GetAttemptSummaryErr error
}

func isCurriculumUnit(u *UnitNodeResponse) bool {
	return u != nil && (u.UnitType == "" || u.UnitType == "curriculum")
}

// NewMockRepository creates an in-memory mock curriculum Repository
func NewMockRepository() *MockRepository {
	return &MockRepository{
		GrammarPoints:       make(map[string]*GrammarPoint),
		LessonGrammarPoints: make(map[string][]string),
		Units:               make(map[string]*UnitNodeResponse),
		Lessons:             make(map[string]*LessonNodeResponse),
		LessonProgress:      make(map[string]*UserLessonProgress),
		LevelOrders:         make(map[string]int),
		UserMaxLevelOrder:   make(map[string]int),
		UserInactiveLevels:  make(map[string]bool),
		AttemptSummaries:    make(map[string]*LessonAttemptSummary),
		DailyReplayXP:       make(map[string]int),
		UserXP:              make(map[string]int),
		UserGems:            make(map[string]int),
		UserStreak:          make(map[string]int),
		UserLastActiveAt:    make(map[string]*time.Time),
	}
}

var _ Repository = (*MockRepository)(nil)

func (m *MockRepository) GetGrammarPointsByLevelID(ctx context.Context, levelID string) ([]GrammarPoint, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

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
		if res[i].OrderIndex != res[j].OrderIndex {
			return res[i].OrderIndex < res[j].OrderIndex
		}
		return res[i].ID < res[j].ID
	})
	return res, nil
}

// GetGrammarPointsByLessonID returns distinct grammar points linked to a lesson in mock state

func (m *MockRepository) GetGrammarPointsByLessonID(ctx context.Context, lessonID string) ([]GrammarPoint, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	if m.GetGrammarPointsErr != nil {
		return nil, m.GetGrammarPointsErr
	}
	var res []GrammarPoint
	if gpIDs, ok := m.LessonGrammarPoints[lessonID]; ok {
		allowed := make(map[string]bool, len(gpIDs))
		for _, id := range gpIDs {
			allowed[id] = true
		}
		for _, gp := range m.GrammarPoints {
			if allowed[gp.ID] {
				res = append(res, *gp)
			}
		}
	} else {
		for _, gp := range m.GrammarPoints {
			res = append(res, *gp)
		}
	}
	sort.Slice(res, func(i, j int) bool {
		if res[i].OrderIndex != res[j].OrderIndex {
			return res[i].OrderIndex < res[j].OrderIndex
		}
		return res[i].ID < res[j].ID
	})
	return res, nil
}

func (m *MockRepository) GetUnitsByLevelID(ctx context.Context, levelID string, userID string) ([]UnitNodeResponse, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	if m.GetUnitsErr != nil {
		return nil, m.GetUnitsErr
	}
	var res []UnitNodeResponse
	for _, u := range m.Units {
		if u.LevelID == levelID && isCurriculumUnit(u) {
			res = append(res, *u)
		}
	}
	sort.Slice(res, func(i, j int) bool {
		if res[i].OrderIndex != res[j].OrderIndex {
			return res[i].OrderIndex < res[j].OrderIndex
		}
		return res[i].ID < res[j].ID
	})
	return res, nil
}

func (m *MockRepository) GetUnitByID(ctx context.Context, id string) (*Unit, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	if m.GetUnitByIDErr != nil {
		return nil, m.GetUnitByIDErr
	}
	u, ok := m.Units[id]
	if !ok {
		return nil, ErrUnitNotFound
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
	m.mu.Lock()
	defer m.mu.Unlock()

	if m.GetLessonsErr != nil {
		return nil, m.GetLessonsErr
	}
	unitMap := make(map[string]bool)
	for _, u := range m.Units {
		if u.LevelID == levelID && isCurriculumUnit(u) {
			unitMap[u.ID] = true
		}
	}
	var res []LessonNodeResponse
	for _, l := range m.Lessons {
		if unitMap[l.UnitID] {
			item := *l
			if p, ok := m.LessonProgress[fmt.Sprintf("%s:%s", userID, l.ID)]; ok {
				item.IsCompleted = p.IsCompleted
				item.Score = p.Score
				item.IsSkipped = p.IsSkipped
				cAt := p.CompletedAt
				item.CompletedAt = &cAt
			}
			res = append(res, item)
		}
	}
	sort.Slice(res, func(i, j int) bool {
		uI := m.Units[res[i].UnitID]
		uJ := m.Units[res[j].UnitID]
		if uI != nil && uJ != nil {
			if uI.OrderIndex != uJ.OrderIndex {
				return uI.OrderIndex < uJ.OrderIndex
			}
			if uI.ID != uJ.ID {
				return uI.ID < uJ.ID
			}
		}
		if res[i].OrderIndex != res[j].OrderIndex {
			return res[i].OrderIndex < res[j].OrderIndex
		}
		return res[i].ID < res[j].ID
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
	u, hasUnit := m.Units[l.UnitID]
	if hasUnit && !isCurriculumUnit(u) {
		return nil, nil
	}
	var levelID, unitType string
	if u != nil {
		levelID = u.LevelID
		unitType = u.UnitType
		if unitType == "" {
			unitType = "curriculum"
		}
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
		LevelID:     levelID,
		UnitType:    unitType,
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
	m.mu.Lock()
	defer m.mu.Unlock()

	if m.GetNextLessonIDErr != nil {
		return nil, m.GetNextLessonIDErr
	}
	if m.NextLessonID != nil {
		return m.NextLessonID, nil
	}
	curLesson, ok := m.Lessons[currentLessonID]
	if !ok {
		return nil, nil
	}
	curUnit := m.Units[curLesson.UnitID]
	if curUnit == nil {
		return nil, nil
	}
	type lessonEntry struct {
		lesson *LessonNodeResponse
		unit   *UnitNodeResponse
	}
	var ordered []lessonEntry
	for _, l := range m.Lessons {
		u := m.Units[l.UnitID]
		if !isCurriculumUnit(u) || u.LevelID != curUnit.LevelID {
			continue
		}
		ordered = append(ordered, lessonEntry{lesson: l, unit: u})
	}
	sort.Slice(ordered, func(i, j int) bool {
		if ordered[i].unit.OrderIndex != ordered[j].unit.OrderIndex {
			return ordered[i].unit.OrderIndex < ordered[j].unit.OrderIndex
		}
		if ordered[i].unit.ID != ordered[j].unit.ID {
			return ordered[i].unit.ID < ordered[j].unit.ID
		}
		if ordered[i].lesson.OrderIndex != ordered[j].lesson.OrderIndex {
			return ordered[i].lesson.OrderIndex < ordered[j].lesson.OrderIndex
		}
		return ordered[i].lesson.ID < ordered[j].lesson.ID
	})
	for i, entry := range ordered {
		if entry.lesson.ID == curLesson.ID && i+1 < len(ordered) {
			nextID := ordered[i+1].lesson.ID
			return &nextID, nil
		}
	}
	return nil, nil
}

func (m *MockRepository) IsLessonUnlocked(ctx context.Context, userID string, lessonID string) (bool, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	return m.isLessonUnlockedLocked(userID, lessonID)
}

func (m *MockRepository) isLessonUnlockedLocked(userID string, lessonID string) (bool, error) {

	curLesson, ok := m.Lessons[lessonID]
	if !ok {
		return false, ErrLessonNotFound
	}
	curUnit := m.Units[curLesson.UnitID]
	if curUnit != nil && !isCurriculumUnit(curUnit) {
		return false, nil
	}
	if curUnit != nil && m.UserInactiveLevels[fmt.Sprintf("%s:%s", userID, curUnit.LevelID)] {
		return false, nil
	}
	if maxOrder, ok := m.UserMaxLevelOrder[userID]; ok && curUnit != nil {
		if targetOrder, exists := m.LevelOrders[curUnit.LevelID]; exists && targetOrder > maxOrder {
			return false, nil
		}
	}

	if curUnit == nil {
		return true, nil
	}

	for _, l := range m.Lessons {
		u := m.Units[l.UnitID]
		if !isCurriculumUnit(u) || u.LevelID != curUnit.LevelID {
			continue
		}
		isPreceding := u.OrderIndex < curUnit.OrderIndex ||
			(u.OrderIndex == curUnit.OrderIndex && u.ID < curUnit.ID) ||
			(u.OrderIndex == curUnit.OrderIndex && u.ID == curUnit.ID && (l.OrderIndex < curLesson.OrderIndex || (l.OrderIndex == curLesson.OrderIndex && l.ID < curLesson.ID)))

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

func (m *MockRepository) upsertLessonProgressLocked(progress *UserLessonProgress) error {
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
	m.mu.Lock()
	defer m.mu.Unlock()

	if m.SkipPrecedingErr != nil {
		return m.SkipPrecedingErr
	}
	for _, l := range m.Lessons {
		if u, ok := m.Units[l.UnitID]; ok {
			if !isCurriculumUnit(u) {
				continue
			}
			if lvlOrder, hasOrder := m.LevelOrders[u.LevelID]; hasOrder && lvlOrder >= upToLevelOrder {
				continue
			}
		}
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
	curLesson, hasLesson := m.Lessons[payload.Progress.LessonID]
	if hasLesson {
		unlocked, lockErr := m.isLessonUnlockedLocked(userID, payload.Progress.LessonID)
		if lockErr != nil || !unlocked {
			return ErrLessonLocked
		}
		if curLesson.ID != "" {
			payload.Progress.LessonID = curLesson.ID
		}
	}
	if payload.ActivityType == "" {
		payload.ActivityType = "lesson_completed"
	}
	if _, exists := m.UserXP[userID]; !exists {
		m.UserXP[userID] = payload.NewXP - payload.XPEarned
	}
	if _, exists := m.UserGems[userID]; !exists {
		m.UserGems[userID] = payload.NewGems
	}
	payload.PreviousStreak = m.UserStreak[userID]

	key := fmt.Sprintf("%s:%s", userID, payload.Progress.LessonID)
	existing, hasExisting := m.LessonProgress[key]
	payload.WasCompleted = hasExisting && existing.IsCompleted

	// Mirror PostgreSQL transactional verification & score derivation under mutex lock
	if m.GetAttemptSummaryErr != nil {
		return m.GetAttemptSummaryErr
	}
	summaryCopy := &LessonAttemptSummary{}
	if s, ok := m.AttemptSummaries[key]; ok && s != nil {
		copyVal := *s
		summaryCopy = &copyVal
	}
	helper := NewHelper()
	verifiedScore, err := helper.ComputeVerifiedLessonScore(payload.Progress.Score, summaryCopy, payload.WasCompleted)
	if err != nil {
		return err
	}
	payload.Progress.Score = verifiedScore
	if payload.Metadata == nil {
		payload.Metadata = make(map[string]any)
	}
	payload.Metadata["lesson_id"] = payload.Progress.LessonID
	payload.Metadata["score"] = verifiedScore
	payload.Metadata["is_practice"] = payload.WasCompleted

	if payload.WasCompleted {
		payload.XPEarned = 5
		payload.Metadata["is_practice"] = true
		payload.Metadata["is_replay"] = true

		loc, locErr := time.LoadLocation("Asia/Jakarta")
		if locErr != nil {
			loc = time.FixedZone("WIB", 7*3600)
		}
		now := payload.LastActiveAt
		if now.IsZero() {
			now = time.Now().UTC()
		}
		dayKey := fmt.Sprintf("%s:%s", userID, now.In(loc).Format("2006-01-02"))
		used := m.DailyReplayXP[dayKey]
		if used+payload.XPEarned > dailyReplayXPCap {
			remaining := dailyReplayXPCap - used
			if remaining < 0 {
				remaining = 0
			}
			payload.XPEarned = remaining
		}
		m.DailyReplayXP[dayKey] += payload.XPEarned

		if !existing.CompletedAt.IsZero() {
			payload.Progress.CompletedAt = existing.CompletedAt
		}
	} else if hasLesson {
		reward := curLesson.XPReward
		if reward <= 0 {
			reward = 15
		}
		payload.XPEarned = reward
	}

	if payload.Metadata != nil {
		if _, mErr := json.Marshal(payload.Metadata); mErr != nil {
			return fmt.Errorf("failed to marshal xp metadata: %w", mErr)
		}
	}

	if err := m.upsertLessonProgressLocked(payload.Progress); err != nil {
		return err
	}

	// Mirror PostgreSQL monotonic cutoff_at = NOW() consuming fresh attempts upon completion
	if s, ok := m.AttemptSummaries[key]; ok && s != nil {
		s.FreshAttemptedExercises = 0
		s.FreshCorrectExercises = 0
	}

	now := payload.LastActiveAt
	if now.IsZero() {
		now = time.Now().UTC()
	}
	if lastActive, hasTracked := m.UserLastActiveAt[userID]; hasTracked {
		newStreak, _ := helper.EvaluateDailyStreak(m.UserStreak[userID], lastActive, now)
		payload.NewStreak = newStreak
	}
	nowCopy := now
	m.UserLastActiveAt[userID] = &nowCopy

	m.UserXP[userID] += payload.XPEarned
	payload.NewXP = m.UserXP[userID]
	payload.NewLevel = helper.CalculateLevel(payload.NewXP)
	payload.NewGems = m.UserGems[userID]
	m.UserStreak[userID] = payload.NewStreak
	return nil
}

// MockCurriculumCacheRepository provides an in-memory mock for CurriculumCacheRepository
type MockCurriculumCacheRepository struct {
	mu                     sync.Mutex
	Cache                  map[string][]byte
	Versions               map[string]int
	GetCurriculumErr       error
	SetCurriculumErr       error
	InvalidateErr          error
	GetCurriculumCallCount int
	SetCurriculumCallCount int
	InvalidateCallCount    int
}

// NewMockCurriculumCacheRepository creates an in-memory mock cache repository
func NewMockCurriculumCacheRepository() *MockCurriculumCacheRepository {
	return &MockCurriculumCacheRepository{
		Cache:    make(map[string][]byte),
		Versions: make(map[string]int),
	}
}

var _ CurriculumCacheRepository = (*MockCurriculumCacheRepository)(nil)

func (m *MockCurriculumCacheRepository) GetCurriculumVersion(ctx context.Context, userID string) (string, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	if m.GetCurriculumErr != nil {
		return "", m.GetCurriculumErr
	}
	return fmt.Sprintf("%d", m.Versions[userID]), nil
}

func (m *MockCurriculumCacheRepository) GetCurriculumWithVersion(ctx context.Context, userID string, languageID string) (*CurriculumResponse, string, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.GetCurriculumCallCount++
	if m.GetCurriculumErr != nil {
		return nil, "", m.GetCurriculumErr
	}
	ver := fmt.Sprintf("%d", m.Versions[userID])
	key := fmt.Sprintf("%s:%s", userID, languageID)
	data, ok := m.Cache[key]
	if !ok {
		return nil, ver, nil
	}
	var res CurriculumResponse
	if err := json.Unmarshal(data, &res); err != nil {
		delete(m.Cache, key)
		return nil, ver, nil
	}
	return &res, ver, nil
}

func (m *MockCurriculumCacheRepository) GetCurriculum(ctx context.Context, userID string, languageID string) (*CurriculumResponse, error) {
	res, _, err := m.GetCurriculumWithVersion(ctx, userID, languageID)
	return res, err
}

func (m *MockCurriculumCacheRepository) SetCurriculum(ctx context.Context, userID string, languageID string, curriculum *CurriculumResponse, ttl time.Duration) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.SetCurriculumCallCount++
	if m.SetCurriculumErr != nil {
		return m.SetCurriculumErr
	}
	key := fmt.Sprintf("%s:%s", userID, languageID)
	data, err := json.Marshal(curriculum)
	if err != nil {
		return err
	}
	m.Cache[key] = data
	return nil
}

func (m *MockCurriculumCacheRepository) SetCurriculumIfVersion(ctx context.Context, userID string, languageID string, expectedVersion string, curriculum *CurriculumResponse, ttl time.Duration) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.SetCurriculumCallCount++
	if m.SetCurriculumErr != nil {
		return m.SetCurriculumErr
	}
	if expectedVersion == "" {
		expectedVersion = "0"
	}
	currentVersion := fmt.Sprintf("%d", m.Versions[userID])
	if expectedVersion != currentVersion {
		return nil
	}
	key := fmt.Sprintf("%s:%s", userID, languageID)
	data, err := json.Marshal(curriculum)
	if err != nil {
		return err
	}
	m.Cache[key] = data
	return nil
}

func (m *MockCurriculumCacheRepository) InvalidateCurriculum(ctx context.Context, userID string) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.InvalidateCallCount++
	if m.InvalidateErr != nil {
		return m.InvalidateErr
	}
	m.Versions[userID]++
	prefix := userID + ":"
	for k := range m.Cache {
		if strings.HasPrefix(k, prefix) {
			delete(m.Cache, k)
		}
	}
	return nil
}

