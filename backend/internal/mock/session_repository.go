package mock

import (
	"context"
	"time"

	"codeabroad/backend/internal/domain"
)

type sessionEntry struct {
	token     string
	expiresAt time.Time
}

// SessionRepository implements domain.SessionRepository for unit testing
type SessionRepository struct {
	Sessions       map[string]sessionEntry
	SetSessionErr  error
	GetSessionErr  error
	DeleteSessErr  error
}

// NewSessionRepository creates an in-memory mock SessionRepository
func NewSessionRepository() *SessionRepository {
	return &SessionRepository{
		Sessions: make(map[string]sessionEntry),
	}
}

var _ domain.SessionRepository = (*SessionRepository)(nil)

func (m *SessionRepository) SetSession(ctx context.Context, userID string, token string, ttl time.Duration) error {
	if m.SetSessionErr != nil {
		return m.SetSessionErr
	}
	m.Sessions[userID] = sessionEntry{
		token:     token,
		expiresAt: time.Now().Add(ttl),
	}
	return nil
}

func (m *SessionRepository) GetSession(ctx context.Context, userID string) (string, error) {
	if m.GetSessionErr != nil {
		return "", m.GetSessionErr
	}
	entry, ok := m.Sessions[userID]
	if !ok {
		return "", nil
	}
	if time.Now().After(entry.expiresAt) {
		delete(m.Sessions, userID)
		return "", nil
	}
	return entry.token, nil
}

func (m *SessionRepository) DeleteSession(ctx context.Context, userID string) error {
	if m.DeleteSessErr != nil {
		return m.DeleteSessErr
	}
	delete(m.Sessions, userID)
	return nil
}

