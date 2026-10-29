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

const userSelectColumns = `
	u.id, 
	COALESCE(up.name, ''), 
	COALESCE(up.username, ''), 
	u.email, 
	u.password_hash, 
	up.bio, 
	up.career_path_id, 
	up.country_id, 
	up.tech_stack_id, 
	COALESCE(up.is_onboarded, FALSE),
	COALESCE(ug.xp, 0), 
	COALESCE(ug.current_level, 1), 
	COALESCE(ug.streak, 0), 
	COALESCE(ug.gems, 0), 
	ug.last_active_at,
	u.created_at, 
	u.updated_at
`

const userFromClause = `
	FROM users u
	LEFT JOIN user_profiles up ON u.id = up.user_id
	LEFT JOIN user_gamification ug ON u.id = ug.user_id
`

func scanUser(row pgx.Row, user *domain.User) error {
	var careerPathIDVal, countryIDVal, techStackIDVal *string
	err := row.Scan(
		&user.ID,
		&user.Name,
		&user.Username,
		&user.Email,
		&user.PasswordHash,
		&user.Bio,
		&careerPathIDVal,
		&countryIDVal,
		&techStackIDVal,
		&user.IsOnboarded,
		&user.XP,
		&user.CurrentLevel,
		&user.Streak,
		&user.Gems,
		&user.LastActiveAt,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		return err
	}
	user.CareerPathID = careerPathIDVal
	user.CountryID = countryIDVal
	user.TechStackID = techStackIDVal
	return nil
}

// Create inserts a new user across the 3-pillar normalized schema (users, user_profiles, user_gamification)
func (r *UserRepository) Create(ctx context.Context, user *domain.User) error {
	tx, err := r.db.Pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin user creation transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	// Pillar 1: Insert into users (auth core)
	userQuery := `
		INSERT INTO users (email, password_hash)
		VALUES ($1, $2)
		RETURNING id, created_at, updated_at
	`
	err = tx.QueryRow(ctx, userQuery, user.Email, user.PasswordHash).Scan(&user.ID, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		return fmt.Errorf("failed to insert auth user: %w", err)
	}

	// Pillar 2: Insert into user_profiles (profile metadata)
	profileQuery := `
		INSERT INTO user_profiles (user_id, name, username, is_onboarded)
		VALUES ($1, $2, $3, $4)
	`
	_, err = tx.Exec(ctx, profileQuery, user.ID, user.Name, user.Username, user.IsOnboarded)
	if err != nil {
		return fmt.Errorf("failed to insert user profile: %w", err)
	}

	// Pillar 3: Insert into user_gamification (game stats)
	gamificationQuery := `
		INSERT INTO user_gamification (user_id, xp, current_level, streak, gems)
		VALUES ($1, $2, $3, $4, $5)
	`
	_, err = tx.Exec(ctx, gamificationQuery, user.ID, user.XP, user.CurrentLevel, user.Streak, user.Gems)
	if err != nil {
		return fmt.Errorf("failed to insert user gamification: %w", err)
	}

	if err := tx.Commit(ctx); err != nil {
		return fmt.Errorf("failed to commit user creation transaction: %w", err)
	}
	return nil
}

// GetByEmail retrieves a user by their unique email address across all 3 pillars
func (r *UserRepository) GetByEmail(ctx context.Context, email string) (*domain.User, error) {
	query := `SELECT ` + userSelectColumns + userFromClause + ` WHERE u.email = $1`
	var user domain.User
	err := scanUser(r.db.Pool.QueryRow(ctx, query, email), &user)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil // Return nil if user is not found
		}
		return nil, fmt.Errorf("failed to get user by email: %w", err)
	}
	return &user, nil
}

// GetByUsername retrieves a user by their unique username handle across all 3 pillars
func (r *UserRepository) GetByUsername(ctx context.Context, username string) (*domain.User, error) {
	query := `SELECT ` + userSelectColumns + userFromClause + ` WHERE up.username = $1`
	var user domain.User
	err := scanUser(r.db.Pool.QueryRow(ctx, query, username), &user)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get user by username: %w", err)
	}
	return &user, nil
}

// GetByID retrieves a user by their unique UUID across all 3 pillars
func (r *UserRepository) GetByID(ctx context.Context, id string) (*domain.User, error) {
	query := `SELECT ` + userSelectColumns + userFromClause + ` WHERE u.id = $1`
	var user domain.User
	err := scanUser(r.db.Pool.QueryRow(ctx, query, id), &user)
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
	tx, err := r.db.Pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin onboarding transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	profileQuery := `
		UPDATE user_profiles
		SET country_id = $1,
		    career_path_id = $2,
		    tech_stack_id = (SELECT id FROM tech_stacks WHERE slug = $3 LIMIT 1),
		    is_onboarded = TRUE,
		    updated_at = NOW()
		WHERE user_id = $4
	`
	tag, err := tx.Exec(ctx, profileQuery, countryID, careerPathID, primaryStack, userID)
	if err != nil {
		return fmt.Errorf("failed to update user profile onboarding: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return domain.ErrUserNotFound
	}

	gamificationQuery := `
		UPDATE user_gamification
		SET xp = xp + $1,
		    streak = CASE WHEN streak = 0 THEN 1 ELSE streak END,
		    last_active_at = NOW(),
		    updated_at = NOW()
		WHERE user_id = $2
	`
	if _, err := tx.Exec(ctx, gamificationQuery, bonusXP, userID); err != nil {
		return fmt.Errorf("failed to update user gamification onboarding: %w", err)
	}

	return tx.Commit(ctx)
}

// GetProfileWithDetails retrieves a user profile joined with Country and CareerPath details
func (r *UserRepository) GetProfileWithDetails(ctx context.Context, userID string) (*domain.OnboardingProfileResponse, error) {
	query := `
		SELECT 
			u.id, 
			COALESCE(up.name, ''), 
			COALESCE(up.username, ''), 
			u.email, 
			COALESCE(ug.xp, 0), 
			COALESCE(ug.current_level, 1), 
			COALESCE(ug.streak, 0), 
			COALESCE(ug.gems, 0), 
			COALESCE(up.is_onboarded, FALSE), 
			COALESCE(ts.slug, ''), 
			u.created_at,
			c.id, c.code, c.name, c.flag_emoji,
			cp.id, cp.slug, cp.label
		FROM users u
		LEFT JOIN user_profiles up ON u.id = up.user_id
		LEFT JOIN user_gamification ug ON u.id = ug.user_id
		LEFT JOIN tech_stacks ts ON up.tech_stack_id = ts.id
		LEFT JOIN countries c ON up.country_id = c.id
		LEFT JOIN career_paths cp ON up.career_path_id = cp.id
		WHERE u.id = $1
	`

	var profile domain.OnboardingProfileResponse
	var countryID, countryCode, countryName, countryFlag *string
	var cpID, cpSlug, cpLabel *string
	var primaryStackSlug string

	err := r.db.Pool.QueryRow(ctx, query, userID).Scan(
		&profile.ID,
		&profile.Name,
		&profile.Username,
		&profile.Email,
		&profile.XP,
		&profile.CurrentLevel,
		&profile.Streak,
		&profile.Gems,
		&profile.IsOnboarded,
		&primaryStackSlug,
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

	if primaryStackSlug != "" {
		profile.PrimaryStack = &primaryStackSlug
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
		UPDATE user_gamification
		SET xp = $2, current_level = $3, streak = $4, last_active_at = $5, updated_at = NOW()
		WHERE user_id = $1
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
		UPDATE user_profiles
		SET name = COALESCE($2, name),
		    career_path_id = COALESCE($3, career_path_id),
		    bio = COALESCE($4, bio),
		    updated_at = NOW()
		WHERE user_id = $1
	`
	_, err := r.db.Pool.Exec(ctx, query, userID, req.Name, req.CareerPathID, req.Bio)
	if err != nil {
		return nil, fmt.Errorf("failed to update user profile: %w", err)
	}
	return r.GetByID(ctx, userID)
}

// AddGems increments or decrements a user's gems balance and returns the new total
func (r *UserRepository) AddGems(ctx context.Context, userID string, gems int) (int, error) {
	query := `
		UPDATE user_gamification
		SET gems = GREATEST(0, gems + $2), updated_at = NOW()
		WHERE user_id = $1
		RETURNING gems
	`
	var newTotal int
	err := r.db.Pool.QueryRow(ctx, query, userID, gems).Scan(&newTotal)
	if err != nil {
		return 0, fmt.Errorf("failed to update user gems: %w", err)
	}
	return newTotal, nil
}
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
	_, _ = r.db.Pool.Exec(ctx, `UPDATE user_gamification SET last_active_at = $2, updated_at = NOW() WHERE user_id = $1`, userID, now)
	return nil
}

// GetWeeklyActivityLogs returns the 7 days of the current week (Senin to Minggu) with active status and full active dates
func (r *UserRepository) GetWeeklyActivityLogs(ctx context.Context, userID string) (*domain.UserActivitySummary, error) {
	user, err := r.GetByID(ctx, userID)
	if err != nil {
		return nil, err
	}

	now := time.Now()
	todayStr := now.Format("2006-01-02")
	yesterdayStr := now.AddDate(0, 0, -1).Format("2006-01-02")

	// 1. Ensure today's login/presence is tracked
	var alreadyActiveToday bool
	_ = r.db.Pool.QueryRow(ctx, `
		SELECT EXISTS (
			SELECT 1 FROM user_activity_logs
			WHERE user_id = $1 AND TO_CHAR(created_at, 'YYYY-MM-DD') = $2
		)
	`, userID, todayStr).Scan(&alreadyActiveToday)

	if !alreadyActiveToday {
		_ = r.LogActivity(ctx, userID, "daily_login", 0, map[string]interface{}{"date": todayStr})

		newStreak := user.Streak
		if user.LastActiveAt == nil {
			newStreak = 1
		} else {
			lastDate := user.LastActiveAt.Format("2006-01-02")
			if lastDate == yesterdayStr {
				newStreak = user.Streak + 1
			} else if lastDate != todayStr {
				newStreak = 1
			} else if user.Streak == 0 {
				newStreak = 1
			}
		}

		if newStreak != user.Streak {
			user.Streak = newStreak
			_ = r.UpdateGamification(ctx, userID, user.XP, user.CurrentLevel, newStreak, &now)
		}
	}

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

		if isToday {
			isActive = true // Today is active since presence was confirmed
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

	// 2. Fetch full historical active dates for monthly streak calendar modal (last 90 days)
	calendarStart := startOfToday.AddDate(0, -3, 0)
	allActiveDatesSet := make(map[string]bool)

	histQuery := `
		SELECT DISTINCT TO_CHAR(created_at, 'YYYY-MM-DD') AS act_date
		FROM user_activity_logs
		WHERE user_id = $1 AND created_at >= $2
	`
	hRows, hErr := r.db.Pool.Query(ctx, histQuery, userID, calendarStart)
	if hErr == nil {
		defer hRows.Close()
		for hRows.Next() {
			var dt string
			if scanErr := hRows.Scan(&dt); scanErr == nil {
				allActiveDatesSet[dt] = true
			}
		}
	}

	// Also check user_quests completions for historical active dates
	questHistQuery := `
		SELECT DISTINCT TO_CHAR(completed_at, 'YYYY-MM-DD') AS act_date
		FROM user_quests
		WHERE user_id = $1 AND completed_at >= $2 AND status = 'completed'
	`
	qhRows, qhErr := r.db.Pool.Query(ctx, questHistQuery, userID, calendarStart)
	if qhErr == nil {
		defer qhRows.Close()
		for qhRows.Next() {
			var dt string
			if scanErr := qhRows.Scan(&dt); scanErr == nil {
				allActiveDatesSet[dt] = true
			}
		}
	}

	// Ensure all consecutive days within the active streak window ending today are included
	if user.Streak > 0 {
		for s := 0; s < user.Streak; s++ {
			streakDate := startOfToday.AddDate(0, 0, -s).Format("2006-01-02")
			allActiveDatesSet[streakDate] = true
		}
	} else {
		allActiveDatesSet[todayStr] = true
	}

	activeDatesList := make([]string, 0, len(allActiveDatesSet))
	for dt := range allActiveDatesSet {
		activeDatesList = append(activeDatesList, dt)
	}

	return &domain.UserActivitySummary{
		CurrentStreak:   user.Streak,
		TotalActiveDays: totalActiveDays,
		LastActiveAt:    user.LastActiveAt,
		WeeklyLogs:      weeklyLogs,
		ActiveDates:     activeDatesList,
	}, nil
}


// ClaimDailyReward records a daily reward claim, increments user XP, and records activity
func (r *UserRepository) ClaimDailyReward(ctx context.Context, userID string, rewardType string, xpAwarded int) (*domain.DailyRewardClaimResponse, error) {
	activityType := "daily_" + rewardType + "_claim"
	today := time.Now().UTC().Format("2006-01-02")

	// 1. Check if already claimed today
	checkQuery := `
		SELECT EXISTS (
			SELECT 1 FROM user_activity_logs
			WHERE user_id = $1
			  AND activity_type = $2
			  AND created_at >= CURRENT_DATE
		)
	`
	var alreadyClaimed bool
	err := r.db.Pool.QueryRow(ctx, checkQuery, userID, activityType).Scan(&alreadyClaimed)
	if err == nil && alreadyClaimed {
		return nil, domain.ErrDailyRewardAlreadyClaimed
	}

	// 2. Update user XP and level atomically in user_gamification
	updateQuery := `
		UPDATE user_gamification
		SET xp = xp + $2,
		    current_level = ((xp + $2) / 100) + 1,
		    last_active_at = NOW(),
		    updated_at = NOW()
		WHERE user_id = $1
		RETURNING xp, current_level, streak
	`
	var currentXP, currentLevel, streak int
	err = r.db.Pool.QueryRow(ctx, updateQuery, userID, xpAwarded).Scan(&currentXP, &currentLevel, &streak)
	if err != nil {
		return nil, fmt.Errorf("failed to update user xp for daily reward: %w", err)
	}

	// 3. Log activity
	meta := map[string]interface{}{
		"reward_type": rewardType,
		"date":        today,
	}
	_ = r.LogActivity(ctx, userID, activityType, xpAwarded, meta)

	return &domain.DailyRewardClaimResponse{
		RewardType:   rewardType,
		XPAwarded:    xpAwarded,
		CurrentXP:    currentXP,
		CurrentLevel: currentLevel,
		Streak:       streak,
		ClaimedAt:    time.Now().UTC().Format(time.RFC3339),
	}, nil
}

// GetDailyRewardsStatus checks whether daily vocab and golden chest rewards have been claimed today
func (r *UserRepository) GetDailyRewardsStatus(ctx context.Context, userID string) (*domain.DailyRewardsStatusResponse, error) {
	today := time.Now().UTC().Format("2006-01-02")
	query := `
		SELECT 
			EXISTS (
				SELECT 1 FROM user_activity_logs 
				WHERE user_id = $1 AND activity_type = 'daily_vocab_quest_claim' AND created_at >= CURRENT_DATE
			) as vocab_claimed,
			EXISTS (
				SELECT 1 FROM user_activity_logs 
				WHERE user_id = $1 AND activity_type = 'daily_golden_chest_claim' AND created_at >= CURRENT_DATE
			) as chest_claimed
	`
	var vocabClaimed, chestClaimed bool
	err := r.db.Pool.QueryRow(ctx, query, userID).Scan(&vocabClaimed, &chestClaimed)
	if err != nil {
		// Default to false on fallback
		return &domain.DailyRewardsStatusResponse{
			Date:               today,
			VocabQuestClaimed:  false,
			GoldenChestClaimed: false,
		}, nil
	}

	return &domain.DailyRewardsStatusResponse{
		Date:               today,
		VocabQuestClaimed:  vocabClaimed,
		GoldenChestClaimed: chestClaimed,
	}, nil
}
