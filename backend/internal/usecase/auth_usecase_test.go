package usecase_test

import (
	"context"
	"testing"
	"time"

	"codeabroad/backend/internal/config"
	"codeabroad/backend/internal/domain"
	"codeabroad/backend/internal/usecase"
	"golang.org/x/crypto/bcrypt"
)

// mockUserRepository implements an in-memory domain.UserRepository for unit testing
type mockUserRepository struct {
	usersByID       map[string]*domain.User
	usersByEmail    map[string]*domain.User
	usersByUsername map[string]*domain.User
}

func newMockUserRepository() *mockUserRepository {
	return &mockUserRepository{
		usersByID:       make(map[string]*domain.User),
		usersByEmail:    make(map[string]*domain.User),
		usersByUsername: make(map[string]*domain.User),
	}
}

func (m *mockUserRepository) Create(ctx context.Context, user *domain.User) error {
	m.usersByID[user.ID] = user
	m.usersByEmail[user.Email] = user
	m.usersByUsername[user.Username] = user
	return nil
}

func (m *mockUserRepository) GetByEmail(ctx context.Context, email string) (*domain.User, error) {
	return m.usersByEmail[email], nil
}

func (m *mockUserRepository) GetByUsername(ctx context.Context, username string) (*domain.User, error) {
	return m.usersByUsername[username], nil
}

func (m *mockUserRepository) GetByID(ctx context.Context, id string) (*domain.User, error) {
	return m.usersByID[id], nil
}

func (m *mockUserRepository) UpdateOnboarding(ctx context.Context, userID string, countryID string, careerPathID string, primaryStack string, level string, targetTimeline string, languageLevel string, bonusXP int) error {
	return nil
}

func (m *mockUserRepository) GetProfileWithDetails(ctx context.Context, userID string) (*domain.OnboardingProfileResponse, error) {
	return nil, nil
}

// mockSessionRepository implements an in-memory domain.SessionRepository for unit testing
type mockSessionRepository struct {
	sessions map[string]string
	ttls     map[string]time.Duration
}

func newMockSessionRepository() *mockSessionRepository {
	return &mockSessionRepository{
		sessions: make(map[string]string),
		ttls:     make(map[string]time.Duration),
	}
}

func (m *mockSessionRepository) SetSession(ctx context.Context, userID, token string, ttl time.Duration) error {
	m.sessions[userID] = token
	m.ttls[userID] = ttl
	return nil
}

func (m *mockSessionRepository) GetSession(ctx context.Context, userID string) (string, error) {
	token, ok := m.sessions[userID]
	if !ok {
		return "", domain.ErrTokenExpired
	}
	return token, nil
}

func (m *mockSessionRepository) DeleteSession(ctx context.Context, userID string) error {
	delete(m.sessions, userID)
	return nil
}

func setupTestUsecase() (domain.AuthUsecase, *mockUserRepository, *mockSessionRepository) {
	userRepo := newMockUserRepository()
	sessionRepo := newMockSessionRepository()
	cfg := &config.Config{
		JWTSecret:                  "super-secret-jwt-key-must-be-at-least-32-chars-long",
		JWTAccessExpirationMinutes: 15,
		JWTRefreshExpirationDays:   30,
	}

	authUc := usecase.NewAuthUsecase(userRepo, sessionRepo, cfg)
	return authUc, userRepo, sessionRepo
}

func TestRegister_Success(t *testing.T) {
	authUc, userRepo, sessionRepo := setupTestUsecase()
	ctx := context.Background()

	req := &domain.RegisterRequest{
		Name:     "Test User",
		Username: "testuser",
		Email:    "test@example.com",
		Password: "Password123!",
	}

	res, err := authUc.Register(ctx, req)
	if err != nil {
		t.Fatalf("expected no error, got: %v", err)
	}

	if res.AccessToken == "" || res.RefreshToken == "" {
		t.Fatal("expected access and refresh tokens to be generated")
	}

	if res.User.Email != req.Email || res.User.Username != req.Username {
		t.Fatalf("expected user details to match, got email: %s, username: %s", res.User.Email, res.User.Username)
	}

	// Verify persistence in repository
	savedUser, _ := userRepo.GetByEmail(ctx, req.Email)
	if savedUser == nil {
		t.Fatal("expected user to be persisted in repository")
	}

	// Verify session in Redis
	sessionToken, _ := sessionRepo.GetSession(ctx, savedUser.ID)
	if sessionToken != res.RefreshToken {
		t.Fatalf("expected session token to match refresh token, got: %s", sessionToken)
	}
}

func TestRegister_DuplicateEmail(t *testing.T) {
	authUc, _, _ := setupTestUsecase()
	ctx := context.Background()

	req := &domain.RegisterRequest{
		Name:     "Test User",
		Username: "user1",
		Email:    "duplicate@example.com",
		Password: "Password123!",
	}

	_, err := authUc.Register(ctx, req)
	if err != nil {
		t.Fatalf("first registration failed: %v", err)
	}

	// Try registering with same email
	reqDuplicate := &domain.RegisterRequest{
		Name:     "Test User 2",
		Username: "user2",
		Email:    "duplicate@example.com",
		Password: "Password123!",
	}

	_, err = authUc.Register(ctx, reqDuplicate)
	if err == nil {
		t.Fatal("expected error for duplicate email, got nil")
	}

	if err != domain.ErrEmailAlreadyExists {
		t.Fatalf("expected domain.ErrEmailAlreadyExists, got: %v", err)
	}
}

func TestRegister_DuplicateUsername(t *testing.T) {
	authUc, _, _ := setupTestUsecase()
	ctx := context.Background()

	req := &domain.RegisterRequest{
		Name:     "Test User",
		Username: "unique_user",
		Email:    "email1@example.com",
		Password: "Password123!",
	}

	_, err := authUc.Register(ctx, req)
	if err != nil {
		t.Fatalf("first registration failed: %v", err)
	}

	// Try registering with same username but different email
	reqDuplicate := &domain.RegisterRequest{
		Name:     "Test User 2",
		Username: "unique_user",
		Email:    "email2@example.com",
		Password: "Password123!",
	}

	_, err = authUc.Register(ctx, reqDuplicate)
	if err == nil {
		t.Fatal("expected error for duplicate username, got nil")
	}

	if err != domain.ErrUsernameTaken {
		t.Fatalf("expected domain.ErrUsernameTaken, got: %v", err)
	}
}

func TestLogin_Success(t *testing.T) {
	authUc, userRepo, _ := setupTestUsecase()
	ctx := context.Background()

	password := "Password123!"
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	user := &domain.User{
		ID:           "usr_123",
		Name:         "Existing User",
		Username:     "existing",
		Email:        "existing@example.com",
		PasswordHash: string(hashedPassword),
	}
	_ = userRepo.Create(ctx, user)

	loginReq := &domain.LoginRequest{
		Email:    "existing@example.com",
		Password: password,
	}

	res, err := authUc.Login(ctx, loginReq)
	if err != nil {
		t.Fatalf("expected successful login, got: %v", err)
	}

	if res.AccessToken == "" || res.RefreshToken == "" {
		t.Fatal("expected access and refresh tokens")
	}
}

func TestLogin_RememberMe_True(t *testing.T) {
	authUc, userRepo, sessionRepo := setupTestUsecase()
	ctx := context.Background()

	password := "Password123!"
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	user := &domain.User{
		ID:           "usr_remember_true",
		Name:         "Persistent User",
		Username:     "persistent_user",
		Email:        "persistent@example.com",
		PasswordHash: string(hashedPassword),
	}
	_ = userRepo.Create(ctx, user)

	loginReq := &domain.LoginRequest{
		Email:      "persistent@example.com",
		Password:   password,
		RememberMe: true,
	}

	res, err := authUc.Login(ctx, loginReq)
	if err != nil {
		t.Fatalf("expected successful login, got: %v", err)
	}

	if res.AccessToken == "" || res.RefreshToken == "" {
		t.Fatal("expected access and refresh tokens")
	}

	// Verify session TTL is 30 days (30 * 24 hours as defined in setupTestUsecase config)
	expectedTTL := 30 * 24 * time.Hour
	actualTTL := sessionRepo.ttls[user.ID]
	if actualTTL != expectedTTL {
		t.Fatalf("expected session TTL to be %v for RememberMe=true, got: %v", expectedTTL, actualTTL)
	}
}

func TestLogin_RememberMe_False(t *testing.T) {
	authUc, userRepo, sessionRepo := setupTestUsecase()
	ctx := context.Background()

	password := "Password123!"
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	user := &domain.User{
		ID:           "usr_remember_false",
		Name:         "Temporary User",
		Username:     "temporary_user",
		Email:        "temporary@example.com",
		PasswordHash: string(hashedPassword),
	}
	_ = userRepo.Create(ctx, user)

	loginReq := &domain.LoginRequest{
		Email:      "temporary@example.com",
		Password:   password,
		RememberMe: false,
	}

	res, err := authUc.Login(ctx, loginReq)
	if err != nil {
		t.Fatalf("expected successful login, got: %v", err)
	}

	if res.AccessToken == "" || res.RefreshToken == "" {
		t.Fatal("expected access and refresh tokens")
	}

	// Verify session TTL is 24 hours for temporary session
	expectedTTL := 24 * time.Hour
	actualTTL := sessionRepo.ttls[user.ID]
	if actualTTL != expectedTTL {
		t.Fatalf("expected session TTL to be %v for RememberMe=false, got: %v", expectedTTL, actualTTL)
	}
}

func TestLogin_InvalidCredentials(t *testing.T) {
	authUc, _, _ := setupTestUsecase()
	ctx := context.Background()

	// Non-existent email
	loginReq := &domain.LoginRequest{
		Email:    "nonexistent@example.com",
		Password: "Password123!",
	}

	_, err := authUc.Login(ctx, loginReq)
	if err != domain.ErrInvalidCredentials {
		t.Fatalf("expected domain.ErrInvalidCredentials, got: %v", err)
	}
}

func TestRefreshToken_Success(t *testing.T) {
	authUc, _, sessionRepo := setupTestUsecase()
	ctx := context.Background()

	// 1. Register first
	regReq := &domain.RegisterRequest{
		Name:     "Refresh User",
		Username: "refreshuser",
		Email:    "refresh@example.com",
		Password: "Password123!",
	}
	regRes, err := authUc.Register(ctx, regReq)
	if err != nil {
		t.Fatalf("register failed: %v", err)
	}

	// 2. Perform Token Refresh
	refreshRes, err := authUc.RefreshToken(ctx, regRes.RefreshToken)
	if err != nil {
		t.Fatalf("expected successful refresh, got: %v", err)
	}

	if refreshRes.AccessToken == "" || refreshRes.RefreshToken == "" {
		t.Fatal("expected new tokens to be issued")
	}

	// Token rotation check: verify session repo now holds the NEW refresh token
	storedToken, _ := sessionRepo.GetSession(ctx, regRes.User.ID)
	if storedToken != refreshRes.RefreshToken {
		t.Fatalf("expected session to store new refresh token %s, got: %s", refreshRes.RefreshToken, storedToken)
	}
}

func TestGetProfile_Success(t *testing.T) {
	authUc, userRepo, _ := setupTestUsecase()
	ctx := context.Background()

	user := &domain.User{
		ID:       "usr_profile_1",
		Name:     "Profile User",
		Username: "profileuser",
		Email:    "profile@example.com",
	}
	_ = userRepo.Create(ctx, user)

	profile, err := authUc.GetProfile(ctx, "usr_profile_1")
	if err != nil {
		t.Fatalf("expected profile, got error: %v", err)
	}

	if profile.ID != user.ID || profile.Email != user.Email {
		t.Fatalf("profile data mismatch: %+v", profile)
	}
}

func TestGetProfile_NotFound(t *testing.T) {
	authUc, _, _ := setupTestUsecase()
	ctx := context.Background()

	_, err := authUc.GetProfile(ctx, "non_existent_id")
	if err != domain.ErrUserNotFound {
		t.Fatalf("expected domain.ErrUserNotFound, got: %v", err)
	}
}

func TestAuthUsecase_Logout_Success(t *testing.T) {
	authUc, _, sessionRepo := setupTestUsecase()
	ctx := context.Background()

	userID := "usr_test_logout"
	_ = sessionRepo.SetSession(ctx, userID, "valid_refresh_token", 24*time.Hour)

	// Ensure session exists
	token, err := sessionRepo.GetSession(ctx, userID)
	if err != nil || token == "" {
		t.Fatalf("expected active session, got error: %v", err)
	}

	// Perform logout
	if err := authUc.Logout(ctx, userID); err != nil {
		t.Fatalf("expected successful logout, got: %v", err)
	}

	// Verify session has been deleted
	_, err = sessionRepo.GetSession(ctx, userID)
	if err != domain.ErrTokenExpired {
		t.Fatalf("expected session to be deleted/expired, got: %v", err)
	}
}

func TestAuthUsecase_Logout_EmptyUserID(t *testing.T) {
	authUc, _, _ := setupTestUsecase()
	ctx := context.Background()

	err := authUc.Logout(ctx, "")
	if err != domain.ErrUnauthorized {
		t.Fatalf("expected ErrUnauthorized, got: %v", err)
	}
}
