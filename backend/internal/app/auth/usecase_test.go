package auth_test

import (
	"context"
	"testing"
	"time"

	"codeabroad/backend/internal/app/auth"
	"codeabroad/backend/config"
	"codeabroad/backend/internal/app/user"
	"golang.org/x/crypto/bcrypt"
)

func setupTestUsecase() (auth.Usecase, *user.MockRepository, *auth.MockSessionRepository) {
	userRepo := user.NewMockRepository()
	sessionRepo := auth.NewMockSessionRepository()
	cfg := &config.Config{
		JWTSecret:                  "super-secret-jwt-key-must-be-at-least-32-chars-long",
		JWTAccessExpirationMinutes: 15,
		JWTRefreshExpirationDays:   30,
	}

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
		t.Fatalf("expected no error, got: %v", err)
	}

	if res.AccessToken == "" || res.RefreshToken == "" {
		t.Fatal("expected access and refresh tokens to be generated")
	}

	if res.User.Email != req.Email || res.User.Username != req.Username {
		t.Fatalf("expected user details to match, got email: %s, username: %s", res.User.Email, res.User.Username)
	}

	savedUser, _ := userRepo.GetByEmail(ctx, req.Email)
	if savedUser == nil {
		t.Fatal("expected user to be persisted in repository")
	}

	sessionToken, _ := sessionRepo.GetSession(ctx, savedUser.ID)
	if sessionToken != res.RefreshToken {
		t.Fatalf("expected session token to match refresh token, got: %s", sessionToken)
	}
}

func TestRegister_DuplicateEmail(t *testing.T) {
	authUc, _, _ := setupTestUsecase()
	ctx := context.Background()

	req := &auth.RegisterRequest{
		Name:     "Test User",
		Username: "user1",
		Email:    "duplicate@example.com",
		Password: "Password123!",
	}

	_, err := authUc.Register(ctx, req)
	if err != nil {
		t.Fatalf("first registration failed: %v", err)
	}

	reqDuplicate := &auth.RegisterRequest{
		Name:     "Test User 2",
		Username: "user2",
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

	res, err := authUc.Login(ctx, loginReq)
	if err != nil {
		t.Fatalf("expected successful login, got: %v", err)
	}

	if res.AccessToken == "" || res.RefreshToken == "" {
		t.Fatal("expected access and refresh tokens")
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
	authUc, _, sessionRepo := setupTestUsecase()
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

	storedToken, _ := sessionRepo.GetSession(ctx, regRes.User.ID)
	if storedToken != refreshRes.RefreshToken {
		t.Fatalf("expected session to store new refresh token %s, got: %s", refreshRes.RefreshToken, storedToken)
	}
}

func TestAuthUsecase_Logout_Success(t *testing.T) {
	authUc, _, sessionRepo := setupTestUsecase()
	ctx := context.Background()

	userID := "usr_test_logout"
	_ = sessionRepo.SetSession(ctx, userID, "valid_refresh_token", 24*time.Hour)

	if err := authUc.Logout(ctx, userID); err != nil {
		t.Fatalf("expected successful logout, got: %v", err)
	}

	_, err := sessionRepo.GetSession(ctx, userID)
	if err != auth.ErrTokenExpired {
		t.Fatalf("expected session to be deleted/expired, got: %v", err)
	}
}

