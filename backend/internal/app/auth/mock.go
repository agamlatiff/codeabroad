package auth

import (
	"context"
	"strings"
	"time"
)

type sessionEntry struct {
	token     string
	expiresAt time.Time
}

// MockSessionRepository implements SessionRepository for unit testing
type MockSessionRepository struct {
	Sessions         map[string]sessionEntry // key: userID:sessionID
	TTLs             map[string]time.Duration
	SetSessionErr    error
	GetSessionErr    error
	DeleteSessErr    error
	DeleteAllSessErr error
}

// NewMockSessionRepository creates an in-memory mock SessionRepository
func NewMockSessionRepository() *MockSessionRepository {
	return &MockSessionRepository{
		Sessions: make(map[string]sessionEntry),
		TTLs:     make(map[string]time.Duration),
	}
}

var _ SessionRepository = (*MockSessionRepository)(nil)

func (m *MockSessionRepository) SetSession(ctx context.Context, userID string, sessionID string, token string, ttl time.Duration) error {
	if m.SetSessionErr != nil {
		return m.SetSessionErr
	}
	key := userID + ":" + sessionID
	m.Sessions[key] = sessionEntry{
		token:     token,
		expiresAt: time.Now().Add(ttl),
	}
	m.TTLs[key] = ttl
	m.TTLs[userID] = ttl
	return nil
}

func (m *MockSessionRepository) GetSession(ctx context.Context, userID string, sessionID string) (string, error) {
	if m.GetSessionErr != nil {
		return "", m.GetSessionErr
	}
	key := userID + ":" + sessionID
	entry, ok := m.Sessions[key]
	if !ok {
		return "", ErrTokenExpired
	}
	if time.Now().After(entry.expiresAt) {
		delete(m.Sessions, key)
		return "", ErrTokenExpired
	}
	return entry.token, nil
}

func (m *MockSessionRepository) DeleteSession(ctx context.Context, userID string, sessionID string) error {
	if m.DeleteSessErr != nil {
		return m.DeleteSessErr
	}
	delete(m.Sessions, userID+":"+sessionID)
	return nil
}

func (m *MockSessionRepository) DeleteAllSessions(ctx context.Context, userID string) error {
	if m.DeleteAllSessErr != nil {
		return m.DeleteAllSessErr
	}
	prefix := userID + ":"
	for k := range m.Sessions {
		if strings.HasPrefix(k, prefix) {
			delete(m.Sessions, k)
		}
	}
	return nil
}
