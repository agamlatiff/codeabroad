package auth

import (
	"context"
	"crypto/subtle"
	"strings"
	"sync"
	"time"
)

type sessionEntry struct {
	token     string
	expiresAt time.Time
}

// MockSessionRepository implements SessionRepository for unit testing
type MockSessionRepository struct {
	mu               sync.Mutex
	Sessions         map[string]sessionEntry // key: userID:sessionID
	TTLs             map[string]time.Duration
	SetSessionErr    error
	GetSessionErr    error
	RotateSessionErr error
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

func (m *MockSessionRepository) SetSession(ctx context.Context, userID string, sessionID string, tokenHash string, ttl time.Duration) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	if m.SetSessionErr != nil {
		return m.SetSessionErr
	}
	key := userID + ":" + sessionID
	m.Sessions[key] = sessionEntry{
		token:     tokenHash,
		expiresAt: time.Now().Add(ttl),
	}
	m.TTLs[key] = ttl
	m.TTLs[userID] = ttl
	return nil
}

func (m *MockSessionRepository) GetSession(ctx context.Context, userID string, sessionID string) (string, error) {
	m.mu.Lock()
	defer m.mu.Unlock()

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
		delete(m.TTLs, key)
		return "", ErrTokenExpired
	}
	return entry.token, nil
}

func (m *MockSessionRepository) RotateSession(
	ctx context.Context,
	userID string,
	sessionID string,
	expectedTokenHash string,
	newTokenHash string,
	ttl time.Duration,
) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	if m.RotateSessionErr != nil {
		return m.RotateSessionErr
	}
	key := userID + ":" + sessionID
	entry, ok := m.Sessions[key]
	if !ok {
		return ErrTokenExpired
	}
	if time.Now().After(entry.expiresAt) {
		delete(m.Sessions, key)
		delete(m.TTLs, key)
		return ErrTokenExpired
	}
	if subtle.ConstantTimeCompare([]byte(entry.token), []byte(expectedTokenHash)) != 1 {
		// Revoke session upon mismatch to enforce refresh token reuse detection.
		delete(m.Sessions, key)
		delete(m.TTLs, key)
		return ErrTokenExpired
	}
	m.Sessions[key] = sessionEntry{
		token:     newTokenHash,
		expiresAt: time.Now().Add(ttl),
	}
	m.TTLs[key] = ttl
	m.TTLs[userID] = ttl
	return nil
}

func (m *MockSessionRepository) DeleteSession(ctx context.Context, userID string, sessionID string) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	if m.DeleteSessErr != nil {
		return m.DeleteSessErr
	}
	key := userID + ":" + sessionID
	delete(m.Sessions, key)
	delete(m.TTLs, key)
	return nil
}

func (m *MockSessionRepository) DeleteAllSessions(ctx context.Context, userID string) error {
	m.mu.Lock()
	defer m.mu.Unlock()

	if m.DeleteAllSessErr != nil {
		return m.DeleteAllSessErr
	}
	prefix := userID + ":"
	for k := range m.Sessions {
		if strings.HasPrefix(k, prefix) {
			delete(m.Sessions, k)
			delete(m.TTLs, k)
		}
	}
	return nil
}
