package auth_test

import (
	"context"
	"testing"
	"time"

	"codeabroad/backend/config"
	"codeabroad/backend/internal/app/auth"
	"codeabroad/backend/internal/app/user"
	"golang.org/x/crypto/bcrypt"
)

func setupTestUsecase() (auth.Usecase, *user.MockRepository, *auth.MockSessionRepository) {
	cfg := &config.Config{
		JWTSecret:                  "test-secret-at-least-32-chars-long-key-12345",
		JWTAccessExpirationMinutes: 15,
		JWTRefreshExpirationDays:   30,
	}
	userRepo := user.NewMockRepository()
	sessionRepo := auth.NewMockSessionRepository()
	authUc := auth.NewUsecase(userRepo, sessionRepo, cfg)
	return authUc, userRepo, sessionRepo
}

func TestRegister_Success(t *testing.T) {
	authUc, userRepo, sessionRepo := setupTestUsecase()
	ctx := context.Background()

	req := &auth.RegisterRequest{
		Name:     "Test User",
		Username: "testuser",
		Email:    "test@example.com",
		Password: "Password123!",
	}

	res, err := authUc.Register(ctx, req)
	if err != nil {
		t.Fatalf("expected successful registration, got: %v", err)
	}

	if res.AccessToken == "" || res.RefreshToken == "" {
		t.Fatal("expected access and refresh tokens to be returned")
	}

	if res.User.Email != "test@example.com" {
		t.Fatalf("expected email test@example.com, got: %s", res.User.Email)
	}

	savedUser, err := userRepo.GetByEmail(ctx, "test@example.com")
	if err != nil || savedUser == nil {
		t.Fatal("expected user to be persisted in repository")
	}

	if len(sessionRepo.Sessions) == 0 {
		t.Fatal("expected session to be saved in session repository")
	}
}

func TestRegister_DuplicateEmail(t *testing.T) {
	authUc, _, _ := setupTestUsecase()
	ctx := context.Background()

	req := &auth.RegisterRequest{
		Name:     "Test User",
		Username: "testuser1",
		Email:    "duplicate@example.com",
		Password: "Password123!",
	}

	_, err := authUc.Register(ctx, req)
	if err != nil {
		t.Fatalf("first registration failed: %v", err)
	}

	reqDuplicate := &auth.RegisterRequest{
		Name:     "Test User 2",
		Username: "testuser2",
		Email:    "duplicate@example.com",
		Password: "Password123!",
	}

	_, err = authUc.Register(ctx, reqDuplicate)
	if err != user.ErrEmailAlreadyExists {
		t.Fatalf("expected user.ErrEmailAlreadyExists, got: %v", err)
	}
}

func TestRegister_DuplicateUsername(t *testing.T) {
	authUc, _, _ := setupTestUsecase()
	ctx := context.Background()

	req := &auth.RegisterRequest{
		Name:     "Test User",
		Username: "unique_user",
		Email:    "email1@example.com",
		Password: "Password123!",
	}

	_, err := authUc.Register(ctx, req)
	if err != nil {
		t.Fatalf("first registration failed: %v", err)
	}

	reqDuplicate := &auth.RegisterRequest{
		Name:     "Test User 2",
		Username: "unique_user",
		Email:    "email2@example.com",
		Password: "Password123!",
	}

	_, err = authUc.Register(ctx, reqDuplicate)
	if err != user.ErrUsernameTaken {
		t.Fatalf("expected user.ErrUsernameTaken, got: %v", err)
	}
}

func TestLogin_Success(t *testing.T) {
	authUc, userRepo, _ := setupTestUsecase()
	ctx := context.Background()

	password := "Password123!"
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	u := &user.User{
		UserAccount: user.UserAccount{
			ID:           "usr_123",
			Email:        "existing@example.com",
			PasswordHash: string(hashedPassword),
		},
		UserProfile: user.UserProfile{
			Name:     "Existing User",
			Username: "existing",
		},
	}
	_ = userRepo.Create(ctx, u)

	loginReq := &auth.LoginRequest{
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

	u := &user.User{
		UserAccount: user.UserAccount{
			ID:           "usr_remember_true",
			Email:        "persistent@example.com",
			PasswordHash: string(hashedPassword),
		},
		UserProfile: user.UserProfile{
			Name:     "Persistent User",
			Username: "persistent_user",
		},
	}
	_ = userRepo.Create(ctx, u)

	loginReq := &auth.LoginRequest{
		Email:      "persistent@example.com",
		Password:   password,
		RememberMe: true,
	}

	_, err := authUc.Login(ctx, loginReq)
	if err != nil {
		t.Fatalf("expected successful login, got: %v", err)
	}

	expectedTTL := 30 * 24 * time.Hour
	actualTTL := sessionRepo.TTLs[u.ID]
	if actualTTL != expectedTTL {
		t.Fatalf("expected session TTL to be %v for RememberMe=true, got: %v", expectedTTL, actualTTL)
	}
}

func TestLogin_RememberMe_False(t *testing.T) {
	authUc, userRepo, sessionRepo := setupTestUsecase()
	ctx := context.Background()

	password := "Password123!"
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	u := &user.User{
		UserAccount: user.UserAccount{
			ID:           "usr_remember_false",
			Email:        "temporary@example.com",
			PasswordHash: string(hashedPassword),
		},
		UserProfile: user.UserProfile{
			Name:     "Temporary User",
			Username: "temporary_user",
		},
	}
	_ = userRepo.Create(ctx, u)

	loginReq := &auth.LoginRequest{
		Email:      "temporary@example.com",
		Password:   password,
		RememberMe: false,
	}

	_, err := authUc.Login(ctx, loginReq)
	if err != nil {
		t.Fatalf("expected successful login, got: %v", err)
	}

	expectedTTL := 24 * time.Hour
	actualTTL := sessionRepo.TTLs[u.ID]
	if actualTTL != expectedTTL {
		t.Fatalf("expected session TTL to be %v for RememberMe=false, got: %v", expectedTTL, actualTTL)
	}
}

func TestLogin_InvalidCredentials(t *testing.T) {
	authUc, _, _ := setupTestUsecase()
	ctx := context.Background()

	loginReq := &auth.LoginRequest{
		Email:    "nonexistent@example.com",
		Password: "Password123!",
	}

	_, err := authUc.Login(ctx, loginReq)
	if err != auth.ErrInvalidCredentials {
		t.Fatalf("expected auth.ErrInvalidCredentials, got: %v", err)
	}
}

func TestRefreshToken_Success(t *testing.T) {
	authUc, _, _ := setupTestUsecase()
	ctx := context.Background()

	regReq := &auth.RegisterRequest{
		Name:     "Refresh User",
		Username: "refreshuser",
		Email:    "refresh@example.com",
		Password: "Password123!",
	}
	regRes, err := authUc.Register(ctx, regReq)
	if err != nil {
		t.Fatalf("register failed: %v", err)
	}

	refreshRes, err := authUc.RefreshToken(ctx, regRes.RefreshToken)
	if err != nil {
		t.Fatalf("expected successful refresh, got: %v", err)
	}

	if refreshRes.AccessToken == "" || refreshRes.RefreshToken == "" {
		t.Fatal("expected new tokens to be issued")
	}
}

func TestAuthUsecase_Logout_Success(t *testing.T) {
	authUc, _, sessionRepo := setupTestUsecase()
	ctx := context.Background()

	userID := "usr_test_logout"
	sessionID := "sess_device_1"
	_ = sessionRepo.SetSession(ctx, userID, sessionID, "valid_refresh_token", 24*time.Hour)

	if err := authUc.Logout(ctx, userID, sessionID); err != nil {
		t.Fatalf("expected successful logout, got: %v", err)
	}

	_, err := sessionRepo.GetSession(ctx, userID, sessionID)
	if err != auth.ErrTokenExpired {
		t.Fatalf("expected session to be deleted/expired, got: %v", err)
	}
}

func TestLogin_MultiDevice_ConcurrentSessions(t *testing.T) {
	authUc, userRepo, sessionRepo := setupTestUsecase()
	ctx := context.Background()

	password := "SecretPass123!"
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	u := &user.User{
		UserAccount: user.UserAccount{
			ID:           "usr_multidevice_456",
			Email:        "multidevice@example.com",
			PasswordHash: string(hashedPassword),
		},
		UserProfile: user.UserProfile{
			Name:     "Multi Device User",
			Username: "multidevice",
		},
	}
	_ = userRepo.Create(ctx, u)

	// 1. Login from Device 1 (Laptop)
	loginReq1 := &auth.LoginRequest{
		Email:    "multidevice@example.com",
		Password: password,
	}
	res1, err := authUc.Login(ctx, loginReq1)
	if err != nil {
		t.Fatalf("device 1 login failed: %v", err)
	}

	// 2. Login from Device 2 (Mobile Phone)
	loginReq2 := &auth.LoginRequest{
		Email:    "multidevice@example.com",
		Password: password,
	}
	res2, err := authUc.Login(ctx, loginReq2)
	if err != nil {
		t.Fatalf("device 2 login failed: %v", err)
	}

	// Verify both sessions exist simultaneously in Redis
	if len(sessionRepo.Sessions) != 2 {
		t.Fatalf("expected 2 active sessions in Redis, got: %d", len(sessionRepo.Sessions))
	}

	// 3. Both devices can refresh their tokens independently
	refreshed1, err := authUc.RefreshToken(ctx, res1.RefreshToken)
	if err != nil {
		t.Fatalf("device 1 refresh failed (should NOT be kicked out): %v", err)
	}

	refreshed2, err := authUc.RefreshToken(ctx, res2.RefreshToken)
	if err != nil {
		t.Fatalf("device 2 refresh failed: %v", err)
	}

	if refreshed1.AccessToken == "" || refreshed2.AccessToken == "" {
		t.Fatal("expected both tokens to be refreshed")
	}

	// 4. Logout Device 1 (terminates only Laptop session)
	// Helper ParseRefreshToken to get device 1 session ID
	cfg := &config.Config{JWTSecret: "test-secret-at-least-32-chars-long-key-12345"}
	helper := auth.NewHelper(cfg)
	claims1, _ := helper.ParseRefreshToken(refreshed1.RefreshToken)

	if err := authUc.Logout(ctx, u.ID, claims1.SessionID); err != nil {
		t.Fatalf("device 1 logout failed: %v", err)
	}

	// Device 1 is now logged out
	_, err = authUc.RefreshToken(ctx, refreshed1.RefreshToken)
	if err != auth.ErrTokenExpired {
		t.Fatalf("expected device 1 to be logged out, got: %v", err)
	}

	// Device 2 is STILL ACTIVE!
	_, err = authUc.RefreshToken(ctx, refreshed2.RefreshToken)
	if err != nil {
		t.Fatalf("device 2 should still be active, got: %v", err)
	}

	// 5. LogoutAll terminates all remaining sessions
	if err := authUc.LogoutAll(ctx, u.ID); err != nil {
		t.Fatalf("logout all failed: %v", err)
	}

	if len(sessionRepo.Sessions) != 0 {
		t.Fatalf("expected all sessions to be purged, remaining: %d", len(sessionRepo.Sessions))
	}
}
