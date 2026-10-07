package usecase_test

import (
	"context"
	"errors"
	"testing"
	"time"

	"codeabroad/backend/internal/domain"
	"codeabroad/backend/internal/usecase"
)

// mockCountryRepository implements domain.CountryRepository for testing
type mockCountryRepository struct {
	countries map[string]*domain.Country
	err       error
}

func newMockCountryRepository() *mockCountryRepository {
	return &mockCountryRepository{
		countries: make(map[string]*domain.Country),
	}
}

func (m *mockCountryRepository) GetAll(ctx context.Context) ([]domain.Country, error) {
	if m.err != nil {
		return nil, m.err
	}
	var list []domain.Country
	for _, c := range m.countries {
		list = append(list, *c)
	}
	return list, nil
}

func (m *mockCountryRepository) GetByID(ctx context.Context, id string) (*domain.Country, error) {
	if m.err != nil {
		return nil, m.err
	}
	c, ok := m.countries[id]
	if !ok {
		return nil, domain.ErrCountryNotFound
	}
	return c, nil
}

// mockCareerPathRepository implements domain.CareerPathRepository for testing
type mockCareerPathRepository struct {
	paths map[string]*domain.CareerPath
	err   error
}

func newMockCareerPathRepository() *mockCareerPathRepository {
	return &mockCareerPathRepository{
		paths: make(map[string]*domain.CareerPath),
	}
}

func (m *mockCareerPathRepository) GetAll(ctx context.Context) ([]domain.CareerPath, error) {
	if m.err != nil {
		return nil, m.err
	}
	var list []domain.CareerPath
	for _, p := range m.paths {
		list = append(list, *p)
	}
	return list, nil
}

func (m *mockCareerPathRepository) GetByID(ctx context.Context, id string) (*domain.CareerPath, error) {
	if m.err != nil {
		return nil, m.err
	}
	p, ok := m.paths[id]
	if !ok {
		return nil, domain.ErrCareerPathNotFound
	}
	return p, nil
}

// onboardingMockUserRepo provides state tracking for onboarding updates
type onboardingMockUserRepo struct {
	users                 map[string]*domain.User
	updatedUserID         string
	updatedCountryID      string
	updatedCareerPathID   string
	updatedPrimaryStack   string
	updatedLevel          string
	updatedTargetTimeline string
	updatedLanguageLevel  string
	updatedBonusXP        int
	getByIDError          error
	updateError           error
}

func newOnboardingMockUserRepo() *onboardingMockUserRepo {
	return &onboardingMockUserRepo{
		users: make(map[string]*domain.User),
	}
}

func (m *onboardingMockUserRepo) Create(ctx context.Context, user *domain.User) error {
	m.users[user.ID] = user
	return nil
}

func (m *onboardingMockUserRepo) GetByEmail(ctx context.Context, email string) (*domain.User, error) {
	return nil, nil
}

func (m *onboardingMockUserRepo) GetByUsername(ctx context.Context, username string) (*domain.User, error) {
	return nil, nil
}

func (m *onboardingMockUserRepo) GetByID(ctx context.Context, id string) (*domain.User, error) {
	if m.getByIDError != nil {
		return nil, m.getByIDError
	}
	u, ok := m.users[id]
	if !ok {
		return nil, nil
	}
	return u, nil
}

func (m *onboardingMockUserRepo) UpdateOnboarding(ctx context.Context, userID string, countryID string, careerPathID string, primaryStack string, level string, targetTimeline string, languageLevel string, bonusXP int) error {
	if m.updateError != nil {
		return m.updateError
	}
	m.updatedUserID = userID
	m.updatedCountryID = countryID
	m.updatedCareerPathID = careerPathID
	m.updatedPrimaryStack = primaryStack
	m.updatedLevel = level
	m.updatedTargetTimeline = targetTimeline
	m.updatedLanguageLevel = languageLevel
	m.updatedBonusXP = bonusXP

	if u, ok := m.users[userID]; ok {
		u.CountryID = &countryID
		u.CareerPathID = &careerPathID
		u.PrimaryStack = &primaryStack
		u.Level = level
		u.TargetTimeline = &targetTimeline
		u.LanguageLevel = &languageLevel
		u.XP += bonusXP
		u.IsOnboarded = true
	}
	return nil
}

func (m *onboardingMockUserRepo) GetProfileWithDetails(ctx context.Context, userID string) (*domain.OnboardingProfileResponse, error) {
	u, ok := m.users[userID]
	if !ok {
		return nil, domain.ErrUserNotFound
	}
	return &domain.OnboardingProfileResponse{
		ID:           u.ID,
		Name:         u.Name,
		Username:     u.Username,
		Email:        u.Email,
		Level:        u.Level,
		XP:           u.XP,
		CurrentLevel: u.CurrentLevel,
		Streak:       1,
		IsOnboarded:    u.IsOnboarded,
		PrimaryStack:   u.PrimaryStack,
		TargetTimeline: u.TargetTimeline,
		LanguageLevel:  u.LanguageLevel,
		Country: &domain.CountrySummary{
			ID:        *u.CountryID,
			Code:      "JP",
			Name:      "Japan",
			FlagEmoji: "🇯🇵",
		},
		CareerPath: &domain.CareerPathSummary{
			ID:    *u.CareerPathID,
			Slug:  "backend",
			Label: "Backend Engineer",
		},
		CreatedAt: u.CreatedAt,
	}, nil
}

func TestOnboardingUsecase_GetCountries(t *testing.T) {
	countryRepo := newMockCountryRepository()
	careerPathRepo := newMockCareerPathRepository()
	userRepo := newOnboardingMockUserRepo()

	countryRepo.countries["c1"] = &domain.Country{
		ID:        "c1",
		Code:      "JP",
		Name:      "Japan",
		FlagEmoji: "🇯🇵",
		IsActive:  true,
	}

	uc := usecase.NewOnboardingUsecase(countryRepo, careerPathRepo, userRepo)

	t.Run("successfully retrieves all countries", func(t *testing.T) {
		countries, err := uc.GetCountries(context.Background())
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if len(countries) != 1 {
			t.Errorf("expected 1 country, got %d", len(countries))
		}
		if countries[0].Code != "JP" {
			t.Errorf("expected JP, got %s", countries[0].Code)
		}
	})

	t.Run("returns error when repository fails", func(t *testing.T) {
		countryRepo.err = errors.New("database connection failed")
		defer func() { countryRepo.err = nil }()

		_, err := uc.GetCountries(context.Background())
		if err == nil {
			t.Fatal("expected error, got nil")
		}
	})
}

func TestOnboardingUsecase_GetCareerPaths(t *testing.T) {
	countryRepo := newMockCountryRepository()
	careerPathRepo := newMockCareerPathRepository()
	userRepo := newOnboardingMockUserRepo()

	careerPathRepo.paths["p1"] = &domain.CareerPath{
		ID:    "p1",
		Slug:  "backend",
		Label: "Backend Engineer",
		Stacks: []domain.TechStack{
			{Slug: "golang", Label: "Go", IsActive: true},
			{Slug: "java", Label: "Java", IsActive: false},
		},
	}

	uc := usecase.NewOnboardingUsecase(countryRepo, careerPathRepo, userRepo)

	t.Run("successfully retrieves all career paths", func(t *testing.T) {
		paths, err := uc.GetCareerPaths(context.Background())
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if len(paths) != 1 {
			t.Errorf("expected 1 path, got %d", len(paths))
		}
		if len(paths[0].Stacks) != 2 {
			t.Errorf("expected 2 stacks, got %d", len(paths[0].Stacks))
		}
	})

	t.Run("returns error when repository fails", func(t *testing.T) {
		careerPathRepo.err = errors.New("database connection failed")
		defer func() { careerPathRepo.err = nil }()

		_, err := uc.GetCareerPaths(context.Background())
		if err == nil {
			t.Fatal("expected error, got nil")
		}
	})
}

func TestOnboardingUsecase_CompleteOnboarding(t *testing.T) {
	countryRepo := newMockCountryRepository()
	careerPathRepo := newMockCareerPathRepository()
	userRepo := newOnboardingMockUserRepo()

	// Seed test data
	countryRepo.countries["c-jp"] = &domain.Country{
		ID:        "c-jp",
		Code:      "JP",
		Name:      "Japan",
		FlagEmoji: "🇯🇵",
		IsActive:  true,
	}
	countryRepo.countries["c-de"] = &domain.Country{
		ID:        "c-de",
		Code:      "DE",
		Name:      "Germany",
		FlagEmoji: "🇩🇪",
		IsActive:  false, // Coming Soon
	}

	careerPathRepo.paths["cp-backend"] = &domain.CareerPath{
		ID:    "cp-backend",
		Slug:  "backend",
		Label: "Backend Engineer",
		Stacks: []domain.TechStack{
			{Slug: "golang", Label: "Go", IsActive: true},
			{Slug: "java", Label: "Java", IsActive: false}, // Coming Soon
		},
	}

	userRepo.users["user-1"] = &domain.User{
		ID:           "user-1",
		Name:         "Budi Pratama",
		Username:     "budipratama",
		Email:        "budi@example.com",
		Level:        "beginner",
		XP:           0,
		CurrentLevel: 1,
		Streak:       0,
		IsOnboarded:  false,
		CreatedAt:    time.Now(),
	}

	uc := usecase.NewOnboardingUsecase(countryRepo, careerPathRepo, userRepo)

	t.Run("happy path - completes onboarding and awards +50 bonus XP", func(t *testing.T) {
		req := &domain.OnboardingRequest{
			CountryID:      "c-jp",
			CareerPathID:   "cp-backend",
			PrimaryStack:   "golang",
			Level:          "beginner",
			TargetTimeline: "1_year",
			LanguageLevel:  "basic",
		}

		res, err := uc.CompleteOnboarding(context.Background(), "user-1", req)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}

		if res == nil {
			t.Fatal("expected response, got nil")
		}
		if !res.IsOnboarded {
			t.Errorf("expected IsOnboarded = true, got %v", res.IsOnboarded)
		}
		if res.XP != 50 {
			t.Errorf("expected XP = 50, got %d", res.XP)
		}
		if res.PrimaryStack == nil || *res.PrimaryStack != "golang" {
			t.Errorf("expected PrimaryStack = golang, got %v", res.PrimaryStack)
		}
		if res.Country == nil || res.Country.Code != "JP" {
			t.Errorf("expected Country code = JP, got %v", res.Country)
		}
		if res.CareerPath == nil || res.CareerPath.Slug != "backend" {
			t.Errorf("expected CareerPath slug = backend, got %v", res.CareerPath)
		}
		if userRepo.updatedBonusXP != usecase.OnboardingBonusXP {
			t.Errorf("expected awarded bonus XP = %d, got %d", usecase.OnboardingBonusXP, userRepo.updatedBonusXP)
		}
	})

	t.Run("happy path - completes onboarding with fluent language level and 6_months sprint", func(t *testing.T) {
		userRepo.users["user-fluent"] = &domain.User{
			ID:          "user-fluent",
			IsOnboarded: false,
		}
		req := &domain.OnboardingRequest{
			CountryID:      "c-jp",
			CareerPathID:   "cp-backend",
			PrimaryStack:   "golang",
			Level:          "intermediate",
			TargetTimeline: "6_months",
			LanguageLevel:  "fluent",
		}

		res, err := uc.CompleteOnboarding(context.Background(), "user-fluent", req)
		if err != nil {
			t.Fatalf("unexpected error: %v", err)
		}
		if res.LanguageLevel == nil || *res.LanguageLevel != "fluent" {
			t.Errorf("expected LanguageLevel = fluent, got %v", res.LanguageLevel)
		}
		if res.TargetTimeline == nil || *res.TargetTimeline != "6_months" {
			t.Errorf("expected TargetTimeline = 6_months, got %v", res.TargetTimeline)
		}
	})

	t.Run("fails when user is not found", func(t *testing.T) {
		req := &domain.OnboardingRequest{
			CountryID:    "c-jp",
			CareerPathID: "cp-backend",
			PrimaryStack: "golang",
			Level:        "beginner",
		}

		_, err := uc.CompleteOnboarding(context.Background(), "non-existent-user", req)
		if !errors.Is(err, domain.ErrUserNotFound) {
			t.Errorf("expected ErrUserNotFound, got %v", err)
		}
	})

	t.Run("fails when user has already completed onboarding", func(t *testing.T) {
		userRepo.users["user-already-onboarded"] = &domain.User{
			ID:          "user-already-onboarded",
			IsOnboarded: true,
		}

		req := &domain.OnboardingRequest{
			CountryID:    "c-jp",
			CareerPathID: "cp-backend",
			PrimaryStack: "golang",
			Level:        "beginner",
		}

		_, err := uc.CompleteOnboarding(context.Background(), "user-already-onboarded", req)
		if !errors.Is(err, domain.ErrAlreadyOnboarded) {
			t.Errorf("expected ErrAlreadyOnboarded, got %v", err)
		}
	})

	t.Run("fails when selected country is not found", func(t *testing.T) {
		userRepo.users["user-2"] = &domain.User{ID: "user-2", IsOnboarded: false}
		req := &domain.OnboardingRequest{
			CountryID:    "non-existent-country",
			CareerPathID: "cp-backend",
			PrimaryStack: "golang",
			Level:        "beginner",
		}

		_, err := uc.CompleteOnboarding(context.Background(), "user-2", req)
		if !errors.Is(err, domain.ErrCountryNotFound) {
			t.Errorf("expected ErrCountryNotFound, got %v", err)
		}
	})

	t.Run("fails when selected country is coming soon / not active", func(t *testing.T) {
		userRepo.users["user-3"] = &domain.User{ID: "user-3", IsOnboarded: false}
		req := &domain.OnboardingRequest{
			CountryID:    "c-de", // Inactive
			CareerPathID: "cp-backend",
			PrimaryStack: "golang",
			Level:        "beginner",
		}

		_, err := uc.CompleteOnboarding(context.Background(), "user-3", req)
		if !errors.Is(err, domain.ErrCountryNotActive) {
			t.Errorf("expected ErrCountryNotActive, got %v", err)
		}
	})

	t.Run("fails when career path is not found", func(t *testing.T) {
		userRepo.users["user-4"] = &domain.User{ID: "user-4", IsOnboarded: false}
		req := &domain.OnboardingRequest{
			CountryID:    "c-jp",
			CareerPathID: "non-existent-cp",
			PrimaryStack: "golang",
			Level:        "beginner",
		}

		_, err := uc.CompleteOnboarding(context.Background(), "user-4", req)
		if !errors.Is(err, domain.ErrCareerPathNotFound) {
			t.Errorf("expected ErrCareerPathNotFound, got %v", err)
		}
	})

	t.Run("fails when stack does not exist in career path", func(t *testing.T) {
		userRepo.users["user-5"] = &domain.User{ID: "user-5", IsOnboarded: false}
		req := &domain.OnboardingRequest{
			CountryID:    "c-jp",
			CareerPathID: "cp-backend",
			PrimaryStack: "python", // Not in backend path
			Level:        "beginner",
		}

		_, err := uc.CompleteOnboarding(context.Background(), "user-5", req)
		if !errors.Is(err, domain.ErrInvalidStack) {
			t.Errorf("expected ErrInvalidStack, got %v", err)
		}
	})

	t.Run("fails when stack is coming soon / not active", func(t *testing.T) {
		userRepo.users["user-6"] = &domain.User{ID: "user-6", IsOnboarded: false}
		req := &domain.OnboardingRequest{
			CountryID:    "c-jp",
			CareerPathID: "cp-backend",
			PrimaryStack: "java", // Inactive
			Level:        "beginner",
		}

		_, err := uc.CompleteOnboarding(context.Background(), "user-6", req)
		if !errors.Is(err, domain.ErrStackNotActive) {
			t.Errorf("expected ErrStackNotActive, got %v", err)
		}
	})
}
