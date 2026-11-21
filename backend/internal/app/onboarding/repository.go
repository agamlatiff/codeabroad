package onboarding

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"merantalk/backend/infrastructure/postgres"
	"merantalk/backend/internal/app/gamification"
	"merantalk/backend/internal/app/language"
	"merantalk/backend/internal/app/user"
	"merantalk/backend/internal/shared/apperror"
	"merantalk/backend/internal/shared/progression"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
)

// CompleteOnboardingTxParams encapsulates validated parameters for the atomic onboarding transaction.
type CompleteOnboardingTxParams struct {
	UserID                string
	Language              *language.Language
	AssignedLevel         *language.ProficiencyLevel
	DailyGoalMinutes      int
	InitialPlacementType  string
	PlacementScorePercent *int
}

// PostgresStore executes transactional onboarding persistence across normalized pillars and curriculum progress.
type PostgresStore struct {
	db *postgres.PostgresDB
}

// NewPostgresStore creates a transactional Store backed by PostgreSQL.
func NewPostgresStore(db *postgres.PostgresDB) Store {
	return &PostgresStore{db: db}
}

var _ Store = (*PostgresStore)(nil)

func (s *PostgresStore) CompleteOnboardingTx(ctx context.Context, params *CompleteOnboardingTxParams) (*OnboardingResultResponse, error) {
	if params == nil || params.Language == nil || params.AssignedLevel == nil {
		return nil, apperror.ErrBadRequest
	}
	if err := apperror.ValidateUserUUID(params.UserID); err != nil {
		return nil, err
	}

	tx, err := s.db.Pool.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to begin onboarding transaction: %w", err)
	}
	defer progression.RollbackTx(ctx, tx, "onboarding.CompleteOnboardingTx")

	var usr user.User
	lockQuery := `
		SELECT u.id, u.email, u.created_at, u.updated_at,
		       up.name, up.username, up.bio, up.avatar_url, up.daily_goal_minutes,
		       up.is_onboarded, up.has_seen_roadmap_tour,
		       ug.xp, ug.current_level, ug.streak, ug.gems, ug.last_active_at
		FROM users u
		JOIN user_profiles up ON up.user_id = u.id
		JOIN user_gamification ug ON ug.user_id = u.id
		WHERE u.id = $1::uuid
		FOR UPDATE OF up, ug
	`
	err = tx.QueryRow(ctx, lockQuery, params.UserID).Scan(
		&usr.ID, &usr.Email, &usr.CreatedAt, &usr.UpdatedAt,
		&usr.Name, &usr.Username, &usr.Bio, &usr.AvatarURL, &usr.DailyGoalMinutes,
		&usr.IsOnboarded, &usr.HasSeenRoadmapTour,
		&usr.XP, &usr.CurrentLevel, &usr.Streak, &usr.Gems, &usr.LastActiveAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, user.ErrUserNotFound
		}
		return nil, fmt.Errorf("failed to lock user for onboarding: %w", err)
	}
	if usr.IsOnboarded {
		return nil, ErrAlreadyOnboarded
	}

	if _, err := tx.Exec(ctx, `UPDATE user_language_enrollments SET is_active = false WHERE user_id = $1::uuid`, params.UserID); err != nil {
		return nil, fmt.Errorf("failed to deactivate prior enrollments: %w", err)
	}

	var enrollment language.UserLanguageEnrollment
	enrollment = language.UserLanguageEnrollment{
		UserID:                params.UserID,
		LanguageID:            params.Language.ID,
		CurrentLevelID:        &params.AssignedLevel.ID,
		InitialPlacementType:  params.InitialPlacementType,
		PlacementScorePercent: params.PlacementScorePercent,
		IsActive:              true,
		Language:              params.Language,
		CurrentLevel:          params.AssignedLevel,
	}
	enrollQuery := `
		INSERT INTO user_language_enrollments (
			user_id, language_id, current_level_id, initial_placement_type, placement_score_percent, is_active, enrolled_at
		) VALUES ($1::uuid, $2::uuid, $3::uuid, $4, $5, true, NOW())
		RETURNING id, enrolled_at
	`
	err = tx.QueryRow(
		ctx, enrollQuery,
		params.UserID, params.Language.ID, params.AssignedLevel.ID,
		params.InitialPlacementType, params.PlacementScorePercent,
	).Scan(&enrollment.ID, &enrollment.EnrolledAt)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" {
			return nil, language.ErrAlreadyEnrolled
		}
		return nil, fmt.Errorf("failed to insert language enrollment: %w", err)
	}

	if params.AssignedLevel.OrderIndex > 1 {
		skipQuery := `
			INSERT INTO user_lesson_progress (user_id, lesson_id, is_completed, score, is_skipped, completed_at)
			SELECT $1::uuid, l.id, true, 100, true, NOW()
			FROM lessons l
			JOIN units u ON l.unit_id = u.id
			JOIN proficiency_levels pl ON u.level_id = pl.id
			WHERE pl.language_id = $2::uuid AND pl.order_index < $3 AND u.unit_type = 'curriculum'
			ON CONFLICT (user_id, lesson_id)
			DO UPDATE SET
				is_completed = true,
				is_skipped = true,
				score = GREATEST(user_lesson_progress.score, 100),
				completed_at = NOW()
		`
		if _, err := tx.Exec(ctx, skipQuery, params.UserID, params.Language.ID, params.AssignedLevel.OrderIndex); err != nil {
			return nil, fmt.Errorf("failed to skip preceding curriculum lessons: %w", err)
		}
	}

	if _, err := tx.Exec(ctx, `
		UPDATE user_profiles
		SET is_onboarded = true,
		    daily_goal_minutes = COALESCE(NULLIF($2, 0), daily_goal_minutes),
		    updated_at = NOW()
		WHERE user_id = $1::uuid
	`, params.UserID, params.DailyGoalMinutes); err != nil {
		return nil, fmt.Errorf("failed to update user onboarded profile: %w", err)
	}

	const welcomeBonusXP = 50
	newXP := usr.XP + welcomeBonusXP
	newStreak := usr.Streak
	if newStreak < 1 {
		newStreak = 1
	}

	metaJSON, err := json.Marshal(map[string]any{
		"language_id":    params.Language.ID,
		"assigned_level": params.AssignedLevel.Code,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to marshal onboarding metadata: %w", err)
	}
	if _, err := tx.Exec(ctx, `
		INSERT INTO user_activity_logs (user_id, activity_type, xp_earned, metadata, created_at)
		VALUES ($1::uuid, 'onboarding_completed', $2, $3, NOW())
	`, params.UserID, welcomeBonusXP, metaJSON); err != nil {
		return nil, fmt.Errorf("failed to log onboarding activity: %w", err)
	}

	var awardedBadges []gamification.BadgeDefinition
	var badgeDef gamification.BadgeDefinition
	badgeDefErr := tx.QueryRow(ctx, `
		SELECT id, title, description, category, icon, xp_reward, created_at
		FROM badge_definitions
		WHERE id = 'akihabara_novice'
	`).Scan(&badgeDef.ID, &badgeDef.Title, &badgeDef.Description, &badgeDef.Category, &badgeDef.Icon, &badgeDef.XPReward, &badgeDef.CreatedAt)
	if badgeDefErr == nil {
		var badgeID string
		badgeInsErr := tx.QueryRow(ctx, `
			INSERT INTO user_badges (user_id, badge_key, awarded_at)
			VALUES ($1::uuid, 'akihabara_novice', NOW())
			ON CONFLICT (user_id, badge_key) DO NOTHING
			RETURNING id
		`, params.UserID).Scan(&badgeID)
		if badgeInsErr == nil {
			badgeDef.XPBonus = badgeDef.XPReward
			awardedBadges = append(awardedBadges, badgeDef)
			if badgeDef.XPReward > 0 {
				newXP += badgeDef.XPReward
			}
		} else if !errors.Is(badgeInsErr, pgx.ErrNoRows) {
			return nil, fmt.Errorf("failed to award onboarding badge: %w", badgeInsErr)
		}
	} else if !errors.Is(badgeDefErr, pgx.ErrNoRows) {
		return nil, fmt.Errorf("failed to query onboarding badge definition: %w", badgeDefErr)
	}

	newLevel := progression.CalculateLevel(newXP)
	var lastActive time.Time
	if err := tx.QueryRow(ctx, `
		UPDATE user_gamification
		SET xp = $2,
		    current_level = $3,
		    streak = $4,
		    last_active_at = NOW(),
		    updated_at = NOW()
		WHERE user_id = $1::uuid
		RETURNING last_active_at
	`, params.UserID, newXP, newLevel, newStreak).Scan(&lastActive); err != nil {
		return nil, fmt.Errorf("failed to update onboarding gamification stats: %w", err)
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("failed to commit onboarding transaction: %w", err)
	}

	return &OnboardingResultResponse{
		User: usr.UserAccount,
		Profile: user.UserProfile{
			Name:               usr.Name,
			Username:           usr.Username,
			Bio:                usr.Bio,
			AvatarURL:          usr.AvatarURL,
			DailyGoalMinutes:   params.DailyGoalMinutes,
			IsOnboarded:        true,
			HasSeenRoadmapTour: usr.HasSeenRoadmapTour,
		},
		Enrollment:        enrollment,
		AssignedLevel:     *params.AssignedLevel,
		PlacementScore:    params.PlacementScorePercent,
		GamificationStats: user.UserGamificationStats{XP: newXP, CurrentLevel: newLevel, Streak: newStreak, Gems: usr.Gems, LastActiveAt: &lastActive},
		AwardedBadges:     awardedBadges,
	}, nil
}
