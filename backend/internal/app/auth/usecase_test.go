package auth_test

import (
	"context"
	"errors"
	"strings"
	"testing"
	"time"

	"codeabroad/backend/config"
	"codeabroad/backend/internal/app/auth"
	"codeabroad/backend/internal/app/user"
	"codeabroad/backend/internal/shared/apperror"
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

	if res.User.DailyGoalMinutes != 15 {
		t.Fatalf("expected DailyGoalMinutes 15, got: %d", res.User.DailyGoalMinutes)
	}

	if res.User.PreferredRoadmapView != "map" {
		t.Fatalf("expected PreferredRoadmapView 'map', got: %s", res.User.PreferredRoadmapView)
	}

	savedUser, err := userRepo.GetByEmail(ctx, "test@example.com")
	if err != nil || savedUser == nil {
		t.Fatal("expected user to be persisted in repository")
	}

	if savedUser.DailyGoalMinutes != 15 || savedUser.PreferredRoadmapView != "map" {
		t.Fatalf("expected persisted defaults DailyGoalMinutes=15 and PreferredRoadmapView='map', got %d and %q", savedUser.DailyGoalMinutes, savedUser.PreferredRoadmapView)
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

func TestRegister_InvalidUsername(t *testing.T) {
	authUc, _, _ := setupTestUsecase()
	ctx := context.Background()

	invalidUsernames := []string{
		"ab",
		"user name",
		"user/name",
		"user@name",
		"   ",
	}

	for _, invalid := range invalidUsernames {
		req := &auth.RegisterRequest{
			Name:     "Invalid User",
			Username: invalid,
			Email:    "invalid@example.com",
			Password: "Password123!",
		}
		_, err := authUc.Register(ctx, req)
		if err != auth.ErrInvalidUsername {
			t.Fatalf("expected ErrInvalidUsername for '%s', got: %v", invalid, err)
		}
	}
}

func TestRegister_UsernameNormalized(t *testing.T) {
	authUc, userRepo, _ := setupTestUsecase()
	ctx := context.Background()

	req := &auth.RegisterRequest{
		Name:     "Upper User",
		Username: "  JohnDoe  ",
		Email:    "johndoe@example.com",
		Password: "Password123!",
	}

	res, err := authUc.Register(ctx, req)
	if err != nil {
		t.Fatalf("expected registration to succeed, got: %v", err)
	}

	if res.User.Username != "johndoe" {
		t.Fatalf("expected username to be normalized to 'johndoe', got: %s", res.User.Username)
	}

	saved, err := userRepo.GetByUsername(ctx, "johndoe")
	if err != nil || saved == nil {
		t.Fatal("expected user to be queryable by normalized username 'johndoe'")
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

func TestEvaluateLoginStreak_TimezoneAware(t *testing.T) {
	cfg := &config.Config{JWTSecret: "test-secret-at-least-32-chars-long-key-12345"}
	helper := auth.NewHelper(cfg)

	// User logged in on Nov 10 at 23:30 WIB (which is Nov 10 16:30 UTC)
	wib := helper.DefaultLocation()
	day1Login := time.Date(2026, 11, 10, 23, 30, 0, 0, wib)

	// User logs in again on Nov 11 at 00:30 WIB (which is Nov 10 17:30 UTC - still Nov 10 in UTC!)
	day2Login := time.Date(2026, 11, 11, 0, 30, 0, 0, wib)

	// In WIB, this is consecutive days (Nov 10 -> Nov 11), so streak must increment from 1 to 2
	newStreak, changed := helper.EvaluateLoginStreak(1, &day1Login, day2Login)
	if !changed {
		t.Fatal("expected streak change to true")
	}
	if newStreak != 2 {
		t.Fatalf("expected streak to increment to 2 in WIB, got: %d", newStreak)
	}

	// Logging in again on the SAME WIB day (e.g. 14:00 WIB on Nov 11) should NOT increment streak again
	sameDayLogin := time.Date(2026, 11, 11, 14, 0, 0, 0, wib)
	newStreakSameDay, changedSameDay := helper.EvaluateLoginStreak(2, &day2Login, sameDayLogin)
	if changedSameDay {
		t.Fatal("expected no streak change on same calendar day")
	}
	if newStreakSameDay != 2 {
		t.Fatalf("expected streak to remain 2, got: %d", newStreakSameDay)
	}
}

func TestRegister_InvalidNamePostTrim(t *testing.T) {
	invalidNames := []string{
		"",
		"   ",
		"\t\n",
		" a ",
		" あ ",
	}

	for _, name := range invalidNames {
		authUc, userRepo, _ := setupTestUsecase()
		ctx := context.Background()

		req := &auth.RegisterRequest{
			Name:     name,
			Username: "valid_user",
			Email:    "valid@example.com",
			Password: "Password123!",
		}

		_, err := authUc.Register(ctx, req)
		if !errors.Is(err, apperror.ErrBadRequest) || !errors.Is(err, auth.ErrInvalidName) {
			t.Fatalf("expected BadRequest ErrInvalidName for %q, got: %v", name, err)
		}
		if len(userRepo.Users) != 0 {
			t.Fatalf("expected no user persisted for invalid name %q", name)
		}
	}

	authUc, _, _ := setupTestUsecase()
	res, err := authUc.Register(context.Background(), &auth.RegisterRequest{
		Name:     "  Budi Pratama  ",
		Username: "budi_pratama",
		Email:    "budi.trimmed@example.com",
		Password: "Password123!",
	})
	if err != nil {
		t.Fatalf("expected valid trimmed name to succeed, got: %v", err)
	}
	if res.User.Name != "Budi Pratama" {
		t.Fatalf("expected trimmed name 'Budi Pratama', got: %q", res.User.Name)
	}
}

func TestRegister_EmptyEmailPostTrim(t *testing.T) {
	emptyEmails := []string{"", "   ", "\t\n"}

	for _, email := range emptyEmails {
		authUc, userRepo, _ := setupTestUsecase()
		ctx := context.Background()

		req := &auth.RegisterRequest{
			Name:     "Valid Name",
			Username: "valid_user",
			Email:    email,
			Password: "Password123!",
		}

		_, err := authUc.Register(ctx, req)
		if !errors.Is(err, apperror.ErrBadRequest) || !errors.Is(err, auth.ErrInvalidEmail) {
			t.Fatalf("expected BadRequest ErrInvalidEmail for %q, got: %v", email, err)
		}
		if len(userRepo.Users) != 0 {
			t.Fatalf("expected no user persisted for empty email %q", email)
		}
	}
}

func TestRegister_PasswordValidation(t *testing.T) {
	whitespacePasswords := []string{"", "        ", "\t\n\r   "}
	for _, pwd := range whitespacePasswords {
		authUc, userRepo, _ := setupTestUsecase()
		_, err := authUc.Register(context.Background(), &auth.RegisterRequest{
			Name:     "Valid Name",
			Username: "valid_user",
			Email:    "ws@example.com",
			Password: pwd,
		})
		if !errors.Is(err, apperror.ErrBadRequest) || !errors.Is(err, auth.ErrInvalidPassword) {
			t.Fatalf("expected BadRequest ErrInvalidPassword for whitespace password %q, got: %v", pwd, err)
		}
		if len(userRepo.Users) != 0 {
			t.Fatalf("expected no user persisted for whitespace password")
		}
	}

	tooLongPasswords := []struct {
		name string
		pwd  string
	}{
		{name: "25_3byte_chars_75_bytes", pwd: strings.Repeat("あ", 25)},
		{name: "19_4byte_emojis_76_bytes", pwd: strings.Repeat("🔒", 19)},
		{name: "73_ascii_bytes", pwd: strings.Repeat("a", 73)},
	}

	for _, tc := range tooLongPasswords {
		authUc, userRepo, _ := setupTestUsecase()
		_, err := authUc.Register(context.Background(), &auth.RegisterRequest{
			Name:     "Valid Name",
			Username: "valid_user",
			Email:    "longpwd@example.com",
			Password: tc.pwd,
		})
		if !errors.Is(err, apperror.ErrBadRequest) || !errors.Is(err, auth.ErrPasswordTooLong) {
			t.Fatalf("%s: expected BadRequest ErrPasswordTooLong, got: %v", tc.name, err)
		}
		if len(userRepo.Users) != 0 {
			t.Fatalf("%s: expected no user persisted", tc.name)
		}
	}

	helper := auth.NewHelper(&config.Config{JWTSecret: "test-secret-at-least-32-chars-long-key-12345"})
	if _, err := helper.HashPassword(strings.Repeat("あ", 25)); !errors.Is(err, apperror.ErrBadRequest) || !errors.Is(err, auth.ErrPasswordTooLong) {
		t.Fatalf("expected HashPassword to return BadRequest ErrPasswordTooLong, got: %v", err)
	}

	// Exact 72-byte multi-byte UTF-8 boundary (24 * 3 bytes = 72 bytes) must succeed
	authUc, _, _ := setupTestUsecase()
	_, err := authUc.Register(context.Background(), &auth.RegisterRequest{
		Name:     "Boundary User",
		Username: "boundary_user",
		Email:    "boundary72@example.com",
		Password: strings.Repeat("あ", 24),
	})
	if err != nil {
		t.Fatalf("expected 72-byte multi-byte UTF-8 password to succeed, got: %v", err)
	}
}

func TestRegister_SetSessionFailure_GracefulDegradation(t *testing.T) {
	authUc, userRepo, sessionRepo := setupTestUsecase()
	ctx := context.Background()
	sessionRepo.SetSessionErr = errors.New("redis connection refused")

	req := &auth.RegisterRequest{
		Name:     "Graceful User",
		Username: "graceful_user",
		Email:    "graceful@example.com",
		Password: "Password123!",
	}

	res, err := authUc.Register(ctx, req)
	if err != nil {
		t.Fatalf("expected Register to succeed gracefully when SetSession fails, got: %v", err)
	}
	if res == nil {
		t.Fatal("expected non-nil AuthResponse")
	}
	if res.AccessToken == "" {
		t.Fatal("expected AccessToken to be issued")
	}
	if res.RefreshToken != "" {
		t.Fatalf("expected empty RefreshToken when session persistence fails, got: %q", res.RefreshToken)
	}
	if res.User.DailyGoalMinutes != 15 || res.User.PreferredRoadmapView != "map" {
		t.Fatalf("expected user defaults DailyGoalMinutes=15 and PreferredRoadmapView='map', got %d and %q", res.User.DailyGoalMinutes, res.User.PreferredRoadmapView)
	}

	savedUser, err := userRepo.GetByEmail(ctx, "graceful@example.com")
	if err != nil || savedUser == nil {
		t.Fatal("expected user to remain persisted in repository")
	}
	if len(sessionRepo.Sessions) != 0 {
		t.Fatalf("expected 0 stored sessions in session repository, got: %d", len(sessionRepo.Sessions))
	}
}
