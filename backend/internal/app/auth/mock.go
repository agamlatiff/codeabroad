package auth

import (
	"context"
	"time"
)

type sessionEntry struct {
	token     string
	expiresAt time.Time
}

// MockSessionRepository implements SessionRepository for unit testing
type MockSessionRepository struct {
	Sessions      map[string]sessionEntry
	TTLs          map[string]time.Duration
	SetSessionErr error
	GetSessionErr error
	DeleteSessErr error
}

// NewMockSessionRepository creates an in-memory mock SessionRepository
func NewMockSessionRepository() *MockSessionRepository {
	return &MockSessionRepository{
		Sessions: make(map[string]sessionEntry),
		TTLs:     make(map[string]time.Duration),
	}
}

var _ SessionRepository = (*MockSessionRepository)(nil)

func (m *MockSessionRepository) SetSession(ctx context.Context, userID string, token string, ttl time.Duration) error {
	if m.SetSessionErr != nil {
		return m.SetSessionErr
	}
	m.Sessions[userID] = sessionEntry{
		token:     token,
		expiresAt: time.Now().Add(ttl),
	}
	m.TTLs[userID] = ttl
	return nil
}

func (m *MockSessionRepository) GetSession(ctx context.Context, userID string) (string, error) {
	if m.GetSessionErr != nil {
		return "", m.GetSessionErr
	}
	entry, ok := m.Sessions[userID]
	if !ok {
		return "", ErrTokenExpired
	}
	if time.Now().After(entry.expiresAt) {
		delete(m.Sessions, userID)
		return "", ErrTokenExpired
	}
	return entry.token, nil
}

func (m *MockSessionRepository) DeleteSession(ctx context.Context, userID string) error {
	if m.DeleteSessErr != nil {
		return m.DeleteSessErr
	}
	delete(m.Sessions, userID)
	return nil
}

