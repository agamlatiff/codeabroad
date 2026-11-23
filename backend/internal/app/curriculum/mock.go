package curriculum

import (
	"context"
	"encoding/json"
	"fmt"
	"math"
	"sort"
	"strings"
	"sync"
	"time"

	"merantalk/backend/internal/app/user"
	"merantalk/backend/internal/shared/apperror"
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
	LevelLanguages       map[string]string
	UserMaxLevelOrder    map[string]int
	UserInactiveLevels   map[string]bool
	MissingUsers         map[string]bool
	AttemptSummaries     map[string]*LessonAttemptSummary
	DailyReplayXP        map[string]int
	UserXP               map[string]int
	UserGems             map[string]int
	UserStreak           map[string]int
	UserLastActiveAt     map[string]*time.Time
	NextLessonID         *string
	KanaCatalog          []KanaCharacterItem
	KanaUserProgress     map[string]map[string]*KanaCharacterItem
	GrammarUserProgress  map[string]map[string]UserGrammarProgress
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
		LevelLanguages:      make(map[string]string),
		UserMaxLevelOrder:   make(map[string]int),
		UserInactiveLevels:  make(map[string]bool),
		MissingUsers:        make(map[string]bool),
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
	res := make([]GrammarPoint, 0)
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
		return nil, ErrLessonNotFound
	}
	u, hasUnit := m.Units[l.UnitID]
	if hasUnit && !isCurriculumUnit(u) {
		return nil, ErrLessonNotFound
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
	isUnlocked := l.IsUnlocked
	if !isUnlocked && userID == "" {
		if unlocked, uErr := m.isLessonUnlockedLocked(userID, id); uErr == nil {
			isUnlocked = unlocked
		}
	}
	return &LessonDetailResponse{
		ID:          l.ID,
		UnitID:      l.UnitID,
		Slug:        l.Slug,
		LevelID:     levelID,
		UnitType:    unitType,
		Title:       l.Title,
		ShortTitle:  l.ShortTitle,
		IconName:    l.IconName,
		XPReward:    l.XPReward,
		OrderIndex:  l.OrderIndex,
		IsUnlocked:  isUnlocked,
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

func (m *MockRepository) IsLevelCurriculumCompleted(ctx context.Context, userID string, levelID string) (bool, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	for _, l := range m.Lessons {
		u := m.Units[l.UnitID]
		if !isCurriculumUnit(u) || u.LevelID != levelID {
			continue
		}
		p := m.LessonProgress[fmt.Sprintf("%s:%s", userID, l.ID)]
		if p == nil || !p.IsCompleted {
			return false, nil
		}
	}
	return true, nil
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

	if userID == "" {
		minUnitOrder := curUnit.OrderIndex
		for _, u := range m.Units {
			if isCurriculumUnit(u) && u.LevelID == curUnit.LevelID && u.OrderIndex < minUnitOrder {
				minUnitOrder = u.OrderIndex
			}
		}
		return curUnit.OrderIndex == minUnitOrder, nil
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
			if languageID != "" {
				if langID, hasLang := m.LevelLanguages[u.LevelID]; hasLang && langID != languageID {
					continue
				}
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
	if m.MissingUsers[userID] {
		return user.ErrUserNotFound
	}
	curLesson, hasLesson := m.Lessons[payload.Progress.LessonID]
	if !hasLesson {
		return ErrLessonNotFound
	}
	if curUnit, hasUnit := m.Units[curLesson.UnitID]; hasUnit && !isCurriculumUnit(curUnit) {
		return ErrLessonNotFound
	}
	unlocked, lockErr := m.isLessonUnlockedLocked(userID, payload.Progress.LessonID)
	if lockErr != nil {
		return lockErr
	}
	if !unlocked {
		return ErrLessonLocked
	}
	if curLesson.ID != "" {
		payload.Progress.LessonID = curLesson.ID
	}
	payload.UnitID = curLesson.UnitID
	if curUnit, hasUnit := m.Units[curLesson.UnitID]; hasUnit {
		payload.LevelID = curUnit.LevelID
		payload.UnitType = curUnit.UnitType
	}
	if payload.ActivityType == "" {
		payload.ActivityType = "lesson_completed"
	}
	if _, exists := m.UserXP[userID]; !exists {
		if initialXP := payload.NewXP - payload.XPEarned; initialXP > 0 {
			m.UserXP[userID] = initialXP
		} else {
			m.UserXP[userID] = 0
		}
	}
	if _, exists := m.UserGems[userID]; !exists {
		if payload.NewGems > 0 {
			m.UserGems[userID] = payload.NewGems
		} else {
			m.UserGems[userID] = 0
		}
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
	payload.SessionScore = verifiedScore
	if payload.Metadata == nil {
		payload.Metadata = make(map[string]any)
	}
	payload.Metadata["lesson_id"] = payload.Progress.LessonID
	payload.Metadata["score"] = verifiedScore
	payload.Metadata["is_practice"] = payload.WasCompleted

	failedReplay := payload.WasCompleted && verifiedScore < minLessonPassScore

	if payload.WasCompleted {
		payload.XPEarned = helper.CalculateReplayXP(verifiedScore)
		payload.Metadata["is_practice"] = true
		payload.Metadata["is_replay"] = true

		if payload.XPEarned > 0 {
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
		}

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

	if failedReplay {
		payload.NewXP = m.UserXP[userID]
		payload.NewLevel = helper.CalculateLevel(payload.NewXP)
		payload.NewStreak = m.UserStreak[userID]
		payload.NewGems = m.UserGems[userID]
		if existingLast := m.UserLastActiveAt[userID]; existingLast != nil {
			payload.LastActiveAt = existingLast.UTC()
		}
		return nil
	}

	now := payload.LastActiveAt
	if now.IsZero() {
		now = time.Now().UTC()
	}
	newStreak, _ := helper.EvaluateDailyStreak(m.UserStreak[userID], m.UserLastActiveAt[userID], now)
	payload.NewStreak = newStreak
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
	GetVersionCallCount    int
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

	m.GetVersionCallCount++
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

func (m *MockCurriculumCacheRepository) SetCurriculumIfVersion(ctx context.Context, userID string, languageID string, expectedVersion string, curriculum *CurriculumResponse, ttl time.Duration) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	m.SetCurriculumCallCount++
	if m.SetCurriculumErr != nil {
		return m.SetCurriculumErr
	}
	if curriculum == nil || userID == "" || languageID == "" || expectedVersion == "" {
		return nil
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

// ResolveLessonID resolves an optional mock lesson slug to its canonical lesson ID.
func (m *MockRepository) ResolveLessonID(ctx context.Context, idOrSlug string) (string, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	if _, ok := m.Lessons[idOrSlug]; ok {
		return idOrSlug, nil
	}
	for _, l := range m.Lessons {
		if l != nil && l.Slug != "" && l.Slug == idOrSlug {
			return l.ID, nil
		}
	}
	return idOrSlug, nil
}

// GetLessonSlugByID returns the mock slug for lessonID if configured.
func (m *MockRepository) GetLessonSlugByID(ctx context.Context, lessonID string) (*string, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	if l, ok := m.Lessons[lessonID]; ok && l.Slug != "" {
		s := l.Slug
		return &s, nil
	}
	return nil, nil
}

// GetGrammarPointsByLanguageCode returns mock grammar points optionally filtered by levelCode.
func (m *MockRepository) GetGrammarPointsByLanguageCode(ctx context.Context, languageCode string, levelCode string) ([]GrammarPoint, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	if m.GetGrammarPointsErr != nil {
		return nil, m.GetGrammarPointsErr
	}
	targetLvl := strings.ToUpper(strings.TrimSpace(levelCode))
	if targetLvl == "ALL" || targetLvl == "SEMUA" {
		targetLvl = ""
	}
	var res []GrammarPoint
	for _, gp := range m.GrammarPoints {
		if gp == nil {
			continue
		}
		if targetLvl != "" && strings.ToUpper(gp.LevelCode) != targetLvl {
			continue
		}
		res = append(res, *gp)
	}
	sort.Slice(res, func(i, j int) bool {
		if res[i].OrderIndex != res[j].OrderIndex {
			return res[i].OrderIndex < res[j].OrderIndex
		}
		return res[i].ID < res[j].ID
	})
	return res, nil
}

// ListKanaWithProgress returns mock Kana characters annotated with per-user practice state.
func (m *MockRepository) ListKanaWithProgress(ctx context.Context, userID string, script string) ([]KanaCharacterItem, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	normalized := strings.ToLower(strings.TrimSpace(script))
	res := make([]KanaCharacterItem, 0, len(m.KanaCatalog))
	userMap := m.KanaUserProgress[userID]
	for _, ch := range m.KanaCatalog {
		if normalized != "" && ch.Script != normalized {
			continue
		}
		item := ch
		if userMap != nil {
			if st, ok := userMap[ch.Character]; ok && st != nil {
				item.PracticeCount = st.PracticeCount
				item.CorrectCount = st.CorrectCount
				item.MasteryScore = st.MasteryScore
				item.IsMastered = st.IsMastered
			}
		}
		res = append(res, item)
	}
	return res, nil
}

// RecordKanaPractice stores mock Kana mastery updates atomically for testing.
func (m *MockRepository) RecordKanaPractice(ctx context.Context, userID string, results []KanaPracticeItem) (int, int, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	if m.KanaUserProgress == nil {
		m.KanaUserProgress = make(map[string]map[string]*KanaCharacterItem)
	}
	if m.KanaUserProgress[userID] == nil {
		m.KanaUserProgress[userID] = make(map[string]*KanaCharacterItem)
	}
	known := make(map[string]bool, len(m.KanaCatalog))
	for _, ch := range m.KanaCatalog {
		known[ch.Character] = true
	}

	updated := 0
	for _, r := range results {
		ch := strings.TrimSpace(r.Character)
		if ch == "" || !known[ch] {
			continue
		}
		st, ok := m.KanaUserProgress[userID][ch]
		if !ok || st == nil {
			st = &KanaCharacterItem{Character: ch}
			m.KanaUserProgress[userID][ch] = st
		}
		st.PracticeCount++
		if r.IsCorrect {
			st.CorrectCount++
			if st.PracticeCount == 1 {
				st.MasteryScore = 50
			} else {
				st.MasteryScore += 35
			}
			if st.MasteryScore > 100 {
				st.MasteryScore = 100
			}
		} else {
			st.MasteryScore -= 10
			if st.MasteryScore < 0 {
				st.MasteryScore = 0
			}
		}
		st.IsMastered = st.MasteryScore >= 70 || st.CorrectCount >= 2
		updated++
	}

	masteredTotal := 0
	for _, st := range m.KanaUserProgress[userID] {
		if st != nil && st.IsMastered {
			masteredTotal++
		}
	}
	return updated, masteredTotal, nil
}

// GetUserGrammarProgressMap returns mock user grammar progress entries keyed by grammar_point_id.
func (m *MockRepository) GetUserGrammarProgressMap(ctx context.Context, userID string) (map[string]UserGrammarProgress, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	res := make(map[string]UserGrammarProgress)
	if m.GrammarUserProgress == nil {
		return res, nil
	}
	for gpID, p := range m.GrammarUserProgress[userID] {
		res[gpID] = p
	}
	return res, nil
}

// RecordGrammarCheck stores mock interactive grammar understanding check results atomically.
func (m *MockRepository) RecordGrammarCheck(
	ctx context.Context,
	userID string,
	grammarPointIDOrCode string,
	correctCount int,
	totalQuestions int,
) (*SubmitGrammarCheckResponse, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

	trimmed := strings.TrimSpace(grammarPointIDOrCode)
	var gpID string
	for _, gp := range m.GrammarPoints {
		if gp == nil {
			continue
		}
		if strings.EqualFold(gp.ID, trimmed) || strings.EqualFold(gp.Code, trimmed) {
			gpID = gp.ID
			break
		}
	}
	if gpID == "" {
		return nil, apperror.ErrNotFound
	}

	if m.GrammarUserProgress == nil {
		m.GrammarUserProgress = make(map[string]map[string]UserGrammarProgress)
	}
	if m.GrammarUserProgress[userID] == nil {
		m.GrammarUserProgress[userID] = make(map[string]UserGrammarProgress)
	}

	now := time.Now().UTC()
	quizScore := int(math.Round(float64(correctCount) * 100.0 / float64(totalQuestions)))
	if quizScore < 0 {
		quizScore = 0
	} else if quizScore > 100 {
		quizScore = 100
	}
	passedNow := correctCount >= totalQuestions

	prev, exists := m.GrammarUserProgress[userID][gpID]
	nextReview := now.Add(24 * time.Hour)
	if exists && prev.IsUnderstood && passedNow {
		nextReview = now.Add(7 * 24 * time.Hour)
	} else if passedNow {
		nextReview = now.Add(3 * 24 * time.Hour)
	}

	prog := UserGrammarProgress{
		ID:              fmt.Sprintf("ugp-%s-%s", userID, gpID),
		UserID:          userID,
		GrammarPointID:  gpID,
		QuizScore:       quizScore,
		CorrectCount:    correctCount,
		TotalQuestions:  totalQuestions,
		AttemptsCount:   1,
		IsUnderstood:    passedNow,
		NextReviewAt:    &nextReview,
		LastAttemptedAt: now,
	}
	if passedNow {
		prog.UnderstoodAt = &now
	}
	if exists {
		if prev.QuizScore > prog.QuizScore {
			prog.QuizScore = prev.QuizScore
		}
		if prev.CorrectCount > prog.CorrectCount {
			prog.CorrectCount = prev.CorrectCount
		}
		prog.AttemptsCount = prev.AttemptsCount + 1
		prog.IsUnderstood = prev.IsUnderstood || passedNow
		if prev.UnderstoodAt != nil {
			prog.UnderstoodAt = prev.UnderstoodAt
		}
	}
	m.GrammarUserProgress[userID][gpID] = prog

	understoodTotal := 0
	for _, p := range m.GrammarUserProgress[userID] {
		if p.IsUnderstood {
			understoodTotal++
		}
	}
	return &SubmitGrammarCheckResponse{
		Progress:        prog,
		UnderstoodTotal: understoodTotal,
	}, nil
}

