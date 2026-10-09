package database

import (
	"codeabroad/backend/internal/domain"
	"codeabroad/backend/internal/infrastructure/postgres"
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
)

// UserQuestRepository implements domain.UserQuestRepository using PostgreSQL
type UserQuestRepository struct {
	db *postgres.PostgresDB
}

// NewUserQuestRepository creates a new PostgreSQL user quest repository
func NewUserQuestRepository(db *postgres.PostgresDB) domain.UserQuestRepository {
	return &UserQuestRepository{db: db}
}

// GetByUserAndQuest retrieves a user's progress record on a specific quest
func (r *UserQuestRepository) GetByUserAndQuest(ctx context.Context, userID, questID string) (*domain.UserQuest, error) {
	query := `
		SELECT id, user_id, quest_id, status, code_submission, tests_passed, total_tests, completed_at, created_at, updated_at
		FROM user_quests
		WHERE user_id = $1 AND quest_id = $2
		LIMIT 1
	`
	var uq domain.UserQuest
	err := r.db.Pool.QueryRow(ctx, query, userID, questID).Scan(
		&uq.ID,
		&uq.UserID,
		&uq.QuestID,
		&uq.Status,
		&uq.CodeSubmission,
		&uq.TestsPassed,
		&uq.TotalTests,
		&uq.CompletedAt,
		&uq.CreatedAt,
		&uq.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil // No progress record yet
		}
		return nil, fmt.Errorf("failed to get user quest: %w", err)
	}
	return &uq, nil
}

// UpsertUserQuest inserts or updates a draft code submission
func (r *UserQuestRepository) UpsertUserQuest(ctx context.Context, uq *domain.UserQuest) error {
	query := `
		INSERT INTO user_quests (user_id, quest_id, status, code_submission, tests_passed, total_tests, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, NOW())
		ON CONFLICT (user_id, quest_id)
		DO UPDATE SET
			code_submission = EXCLUDED.code_submission,
			tests_passed = EXCLUDED.tests_passed,
			total_tests = EXCLUDED.total_tests,
			updated_at = NOW()
	`
	_, err := r.db.Pool.Exec(ctx, query,
		uq.UserID,
		uq.QuestID,
		uq.Status,
		uq.CodeSubmission,
		uq.TestsPassed,
		uq.TotalTests,
	)
	if err != nil {
		return fmt.Errorf("failed to upsert user quest: %w", err)
	}
	return nil
}

// MarkCompleted marks a quest as completed and timestamps the event
func (r *UserQuestRepository) MarkCompleted(ctx context.Context, userID, questID, code string, passed, total int) error {
	now := time.Now()
	query := `
		INSERT INTO user_quests (user_id, quest_id, status, code_submission, tests_passed, total_tests, completed_at, updated_at)
		VALUES ($1, $2, 'completed', $3, $4, $5, $6, $6)
		ON CONFLICT (user_id, quest_id)
		DO UPDATE SET
			status = 'completed',
			code_submission = EXCLUDED.code_submission,
			tests_passed = EXCLUDED.tests_passed,
			total_tests = EXCLUDED.total_tests,
			completed_at = COALESCE(user_quests.completed_at, EXCLUDED.completed_at),
			updated_at = NOW()
	`
	_, err := r.db.Pool.Exec(ctx, query, userID, questID, code, passed, total, now)
	if err != nil {
		return fmt.Errorf("failed to mark quest as completed: %w", err)
	}
	return nil
}

// CountCompletedByCareerPath counts how many quests a user has completed within a track
func (r *UserQuestRepository) CountCompletedByCareerPath(ctx context.Context, userID, careerPathID string) (int, error) {
	query := `
		SELECT COUNT(DISTINCT uq.quest_id)
		FROM user_quests uq
		JOIN quests q ON uq.quest_id = q.id
		WHERE uq.user_id = $1 AND uq.status = 'completed' AND q.career_path_id = $2
	`
	var count int
	err := r.db.Pool.QueryRow(ctx, query, userID, careerPathID).Scan(&count)
	if err != nil {
		return 0, fmt.Errorf("failed to count completed quests: %w", err)
	}
	return count, nil
}

// CountTotalByCareerPath counts total active quests available in a track
func (r *UserQuestRepository) CountTotalByCareerPath(ctx context.Context, careerPathID string) (int, error) {
	query := `
		SELECT COUNT(id)
		FROM quests
		WHERE career_path_id = $1 AND is_active = TRUE
	`
	var count int
	err := r.db.Pool.QueryRow(ctx, query, careerPathID).Scan(&count)
	if err != nil {
		return 0, fmt.Errorf("failed to count total quests: %w", err)
	}
	return count, nil
}
