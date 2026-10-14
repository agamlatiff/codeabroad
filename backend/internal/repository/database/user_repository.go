package database

import (
	"codeabroad/backend/internal/domain"
	"codeabroad/backend/internal/infrastructure/postgres"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
)

// UserRepository implements domain.UserRepository using PostgreSQL
type UserRepository struct {
	db *postgres.PostgresDB
}

// NewUserRepository creates a new PostgreSQL user repository instance
func NewUserRepository(db *postgres.PostgresDB) domain.UserRepository {
	return &UserRepository{db: db}
}

// Create inserts a new user record into the postgres
func (r *UserRepository) Create(ctx context.Context, user *domain.User) error {
	query := `
		INSERT INTO users (
			name, username, email, password_hash, level, xp, current_level, streak, is_onboarded
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9
		)
		RETURNING id, created_at, updated_at
	`
	err := r.db.Pool.QueryRow(
		ctx,
		query,
		user.Name,
		user.Username,
		user.Email,
		user.PasswordHash,
		user.Level,
		user.XP,
		user.CurrentLevel,
		user.Streak,
		user.IsOnboarded,
	).Scan(&user.ID, &user.CreatedAt, &user.UpdatedAt)

	if err != nil {
		return fmt.Errorf("failed to create user: %w", err)
	}
	return nil
}

// GetByEmail retrieves a user by their unique email address
func (r *UserRepository) GetByEmail(ctx context.Context, email string) (*domain.User, error) {
	query := `
		SELECT id, name, username, email, password_hash, avatar_url, bio, github_url, linkedin_url,
		       career_path_id, country_id, primary_stack, level, target_timeline, language_level, xp, current_level, streak, last_active_at, is_onboarded,
		       created_at, updated_at
		FROM users
		WHERE email = $1
	`

	var user domain.User
	err := r.db.Pool.QueryRow(ctx, query, email).Scan(
		&user.ID,
		&user.Name,
		&user.Username,
		&user.Email,
		&user.PasswordHash,
		&user.AvatarURL,
		&user.Bio,
		&user.GithubURL,
		&user.LinkedinURL,
		&user.CareerPathID,
		&user.CountryID,
		&user.PrimaryStack,
		&user.Level,
		&user.TargetTimeline,
		&user.LanguageLevel,
		&user.XP,
		&user.CurrentLevel,
		&user.Streak,
		&user.LastActiveAt,
		&user.IsOnboarded,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil // Return nil if user is not found
		}
		return nil, fmt.Errorf("failed to get user by email: %w", err)
	}

	return &user, nil
}

// GetByUsername retrieves a user by their unique username handle
func (r *UserRepository) GetByUsername(ctx context.Context, username string) (*domain.User, error) {
	query := `
		SELECT id, name, username, email, password_hash, avatar_url, bio, github_url, linkedin_url,
		       career_path_id, country_id, primary_stack, level, target_timeline, language_level, xp, current_level, streak, last_active_at, is_onboarded,
		       created_at, updated_at
		FROM users
		WHERE username = $1
	`

	var user domain.User

	err := r.db.Pool.QueryRow(ctx, query, username).Scan(
		&user.ID,
		&user.Name,
		&user.Username,
		&user.Email,
		&user.PasswordHash,
		&user.AvatarURL,
		&user.Bio,
		&user.GithubURL,
		&user.LinkedinURL,
		&user.CareerPathID,
		&user.CountryID,
		&user.PrimaryStack,
		&user.Level,
		&user.TargetTimeline,
		&user.LanguageLevel,
		&user.XP,
		&user.CurrentLevel,
		&user.Streak,
		&user.LastActiveAt,
		&user.IsOnboarded,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get user by username: %w", err)
	}
	return &user, nil
}

// GetByID retrieves a user by their unique UUID
func (r *UserRepository) GetByID(ctx context.Context, id string) (*domain.User, error) {
	query := `
		SELECT id, name, username, email, password_hash, avatar_url, bio, github_url, linkedin_url,
		       career_path_id, country_id, primary_stack, level, target_timeline, language_level, xp, current_level, streak, last_active_at, is_onboarded,
		       created_at, updated_at
		FROM users
		WHERE id = $1
	`

	var user domain.User
	err := r.db.Pool.QueryRow(ctx, query, id).Scan(
		&user.ID,
		&user.Name,
		&user.Username,
		&user.Email,
		&user.PasswordHash,
		&user.AvatarURL,
		&user.Bio,
		&user.GithubURL,
		&user.LinkedinURL,
		&user.CareerPathID,
		&user.CountryID,
		&user.PrimaryStack,
		&user.Level,
		&user.TargetTimeline,
		&user.LanguageLevel,
		&user.XP,
		&user.CurrentLevel,
		&user.Streak,
		&user.LastActiveAt,
		&user.IsOnboarded,
		&user.CreatedAt,
		&user.UpdatedAt,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get user by id: %w", err)
	}
	return &user, nil
}

// UpdateOnboarding sets the user's destination, career path, tech stack, timeline, language level, and awards starting XP
func (r *UserRepository) UpdateOnboarding(
	ctx context.Context,
	userID string,
	countryID string,
	careerPathID string,
	primaryStack string,
	level string,
	targetTimeline string,
	languageLevel string,
	bonusXP int,
) error {
	query := `
		UPDATE users
		SET country_id = $1,
		    career_path_id = $2,
		    primary_stack = $3,
		    level = $4,
		    target_timeline = $5,
		    language_level = $6,
		    xp = xp + $7,
		    streak = CASE WHEN streak = 0 THEN 1 ELSE streak END,
		    is_onboarded = TRUE,
		    last_active_at = CURRENT_TIMESTAMP,
		    updated_at = CURRENT_TIMESTAMP
		WHERE id = $8
	`
	tag, err := r.db.Pool.Exec(ctx, query, countryID, careerPathID, primaryStack, level, targetTimeline, languageLevel, bonusXP, userID)
	if err != nil {
		return fmt.Errorf("failed to update user onboarding: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return domain.ErrUserNotFound
	}
	return nil
}

// GetProfileWithDetails retrieves a user profile joined with Country and CareerPath details
func (r *UserRepository) GetProfileWithDetails(ctx context.Context, userID string) (*domain.OnboardingProfileResponse, error) {
	query := `
		SELECT 
			u.id, u.name, u.username, u.email, u.level, u.xp, u.current_level, u.streak, u.is_onboarded, u.primary_stack, u.target_timeline, u.language_level, u.created_at,
			c.id, c.code, c.name, c.flag_emoji,
			cp.id, cp.slug, cp.label
		FROM users u
		LEFT JOIN countries c ON u.country_id = c.id
		LEFT JOIN career_paths cp ON u.career_path_id = cp.id
		WHERE u.id = $1
	`

	var profile domain.OnboardingProfileResponse
	var countryID, countryCode, countryName, countryFlag *string
	var cpID, cpSlug, cpLabel *string

	err := r.db.Pool.QueryRow(ctx, query, userID).Scan(
		&profile.ID,
		&profile.Name,
		&profile.Username,
		&profile.Email,
		&profile.Level,
		&profile.XP,
		&profile.CurrentLevel,
		&profile.Streak,
		&profile.IsOnboarded,
		&profile.PrimaryStack,
		&profile.TargetTimeline,
		&profile.LanguageLevel,
		&profile.CreatedAt,
		&countryID,
		&countryCode,
		&countryName,
		&countryFlag,
		&cpID,
		&cpSlug,
		&cpLabel,
	)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrUserNotFound
		}
		return nil, fmt.Errorf("failed to get user profile with details: %w", err)
	}

	if countryID != nil && countryCode != nil && countryName != nil && countryFlag != nil {
		profile.Country = &domain.CountrySummary{
			ID:        *countryID,
			Code:      *countryCode,
			Name:      *countryName,
			FlagEmoji: *countryFlag,
		}
	}

	if cpID != nil && cpSlug != nil && cpLabel != nil {
		profile.CareerPath = &domain.CareerPathSummary{
			ID:    *cpID,
			Slug:  *cpSlug,
			Label: *cpLabel,
		}
	}

	return &profile, nil
}

// UpdateGamification updates a user's XP, level, streak counter, and last active timestamp
func (r *UserRepository) UpdateGamification(ctx context.Context, userID string, xp int, currentLevel int, streak int, lastActiveAt *time.Time) error {
	query := `
		UPDATE users
		SET xp = $2, current_level = $3, streak = $4, last_active_at = $5, updated_at = NOW()
		WHERE id = $1
	`
	_, err := r.db.Pool.Exec(ctx, query, userID, xp, currentLevel, streak, lastActiveAt)
	if err != nil {
		return fmt.Errorf("failed to update user gamification: %w", err)
	}
	return nil
}

// UpdateProfile updates user profile fields such as name, primary stack, career path, bio, and social links
func (r *UserRepository) UpdateProfile(ctx context.Context, userID string, req *domain.UpdateProfileRequest) (*domain.User, error) {
	query := `
		UPDATE users
		SET name = COALESCE($2, name),
		    primary_stack = COALESCE($3, primary_stack),
		    career_path_id = COALESCE($4, career_path_id),
		    bio = COALESCE($5, bio),
		    github_url = COALESCE($6, github_url),
		    linkedin_url = COALESCE($7, linkedin_url),
		    updated_at = NOW()
		WHERE id = $1
	`
	_, err := r.db.Pool.Exec(ctx, query, userID, req.Name, req.PrimaryStack, req.CareerPathID, req.Bio, req.GithubURL, req.LinkedinURL)
	if err != nil {
		return nil, fmt.Errorf("failed to update user profile: %w", err)
	}
	return r.GetByID(ctx, userID)
}

// LogActivity records an explicit learning activity and updates last_active_at
func (r *UserRepository) LogActivity(ctx context.Context, userID string, activityType string, xpEarned int, metadata map[string]interface{}) error {
	var metaJSON []byte
	if metadata != nil {
		metaJSON, _ = json.Marshal(metadata)
	}

	query := `
		INSERT INTO user_activity_logs (user_id, activity_type, xp_earned, metadata, created_at)
		VALUES ($1, $2, $3, $4, NOW())
	`
	_, _ = r.db.Pool.Exec(ctx, query, userID, activityType, xpEarned, metaJSON)

	now := time.Now()
	_, _ = r.db.Pool.Exec(ctx, `UPDATE users SET last_active_at = $2, updated_at = NOW() WHERE id = $1`, userID, now)
	return nil
}

// GetWeeklyActivityLogs returns the 7 days of the current week (Senin to Minggu) with active status
func (r *UserRepository) GetWeeklyActivityLogs(ctx context.Context, userID string) (*domain.UserActivitySummary, error) {
	user, err := r.GetByID(ctx, userID)
	if err != nil {
		return nil, err
	}

	now := time.Now()
	// In Go: Sunday=0, Monday=1, ..., Saturday=6
	weekday := int(now.Weekday())
	mondayOffset := (weekday + 6) % 7 // Monday becomes 0, Sunday becomes 6
	startOfToday := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	monday := startOfToday.AddDate(0, 0, -mondayOffset)

	// Fetch active dates from user_activity_logs in this week
	activeDates := make(map[string]struct {
		xp     int
		quests int
	})

	logQuery := `
		SELECT TO_CHAR(created_at, 'YYYY-MM-DD') AS act_date, COALESCE(SUM(xp_earned), 0), COUNT(*)
		FROM user_activity_logs
		WHERE user_id = $1 AND created_at >= $2
		GROUP BY TO_CHAR(created_at, 'YYYY-MM-DD')
	`
	rows, err := r.db.Pool.Query(ctx, logQuery, userID, monday)
	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var dateStr string
			var xp, count int
			if scanErr := rows.Scan(&dateStr, &xp, &count); scanErr == nil {
				activeDates[dateStr] = struct {
					xp     int
					quests int
				}{xp: xp, quests: count}
			}
		}
	}

	// Also check user_quests completions for robust backward-compatibility
	questQuery := `
		SELECT TO_CHAR(completed_at, 'YYYY-MM-DD') AS act_date, COUNT(*)
		FROM user_quests
		WHERE user_id = $1 AND completed_at >= $2 AND status = 'completed'
		GROUP BY TO_CHAR(completed_at, 'YYYY-MM-DD')
	`
	qRows, qErr := r.db.Pool.Query(ctx, questQuery, userID, monday)
	if qErr == nil {
		defer qRows.Close()
		for qRows.Next() {
			var dateStr string
			var count int
			if scanErr := qRows.Scan(&dateStr, &count); scanErr == nil {
				existing := activeDates[dateStr]
				existing.quests += count
				activeDates[dateStr] = existing
			}
		}
	}

	dayLabels := []string{"Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"}
	weeklyLogs := make([]domain.UserActivityLog, 7)
	totalActiveDays := 0

	for i := 0; i < 7; i++ {
		dayDate := monday.AddDate(0, 0, i)
		dateStr := dayDate.Format("2006-01-02")
		isToday := (i == mondayOffset)

		data, hasLog := activeDates[dateStr]
		isActive := hasLog

		// If user has active streak and recent days are within streak window
		if !isActive && user.Streak > 0 {
			daysDiffFromToday := mondayOffset - i
			if daysDiffFromToday >= 0 && daysDiffFromToday < user.Streak {
				isActive = true
			}
		}

		if isActive {
			totalActiveDays++
		}

		weeklyLogs[i] = domain.UserActivityLog{
			Date:        dateStr,
			DayIndex:    i,
			DayLabel:    dayLabels[i],
			IsActive:    isActive,
			IsToday:     isToday,
			XPEarned:    data.xp,
			QuestsCount: data.quests,
		}
	}

	return &domain.UserActivitySummary{
		CurrentStreak:   user.Streak,
		TotalActiveDays: totalActiveDays,
		LastActiveAt:    user.LastActiveAt,
		WeeklyLogs:      weeklyLogs,
	}, nil
}
