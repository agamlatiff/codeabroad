package database

import (
	"codeabroad/backend/internal/domain"
	"codeabroad/backend/internal/infrastructure/postgres"
	"context"
	"encoding/json"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5"
)

// QuestRepository implements domain.QuestRepository using PostgreSQL
type QuestRepository struct {
	db *postgres.PostgresDB
}

// NewQuestRepository creates a new PostgreSQL quest repository
func NewQuestRepository(db *postgres.PostgresDB) domain.QuestRepository {
	return &QuestRepository{db: db}
}

// GetByID retrieves a quest by its ID, merging user submission state if available
func (r *QuestRepository) GetByID(ctx context.Context, id string, userID string) (*domain.Quest, error) {
	query := `
		SELECT q.id, q.title, q.description, q.type, q.career_path_id, q.country_id,
		       q.difficulty, q.xp_reward, q.estimated_minutes, q.resource_url,
		       q.order_index, q.is_active, q.chapter_id, COALESCE(q.chip_label, 'QUEST'),
		       q.story_context, q.nihongo_notes, q.acceptance_criteria, q.starter_code, q.test_suite,
		       q.created_at, q.updated_at,
		       COALESCE(uq.status, 'available') as user_status,
		       COALESCE(uq.tests_passed, 0) as tests_passed,
		       COALESCE(uq.total_tests, 0) as total_tests,
		       uq.code_submission
		FROM quests q
		LEFT JOIN user_quests uq ON q.id = uq.quest_id AND uq.user_id = $2
		WHERE q.id = $1
		LIMIT 1
	`

	var q domain.Quest
	var rawNotes, rawCriteria, rawStarter, rawTests []byte

	err := r.db.Pool.QueryRow(ctx, query, id, userID).Scan(
		&q.ID,
		&q.Title,
		&q.Description,
		&q.Type,
		&q.CareerPathID,
		&q.CountryID,
		&q.Difficulty,
		&q.XPReward,
		&q.EstimatedMinutes,
		&q.ResourceURL,
		&q.OrderIndex,
		&q.IsActive,
		&q.ChapterID,
		&q.ChipLabel,
		&q.StoryContext,
		&rawNotes,
		&rawCriteria,
		&rawStarter,
		&rawTests,
		&q.CreatedAt,
		&q.UpdatedAt,
		&q.UserStatus,
		&q.UserTestsPassed,
		&q.UserTotalTests,
		&q.UserCodeSubmission,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrQuestNotFound
		}
		return nil, fmt.Errorf("failed to get quest by id: %w", err)
	}

	// Unmarshal JSONB fields safely
	if len(rawNotes) > 0 {
		var n domain.NihongoNote
		if err := json.Unmarshal(rawNotes, &n); err == nil {
			q.NihongoNotes = &n
		}
	}
	if len(rawCriteria) > 0 {
		_ = json.Unmarshal(rawCriteria, &q.AcceptanceCriteria)
	}
	if len(rawStarter) > 0 {
		var s domain.StarterCode
		if err := json.Unmarshal(rawStarter, &s); err == nil {
			q.StarterCode = &s
		}
	}
	if len(rawTests) > 0 {
		var t domain.TestSuite
		if err := json.Unmarshal(rawTests, &t); err == nil {
			q.TestSuite = &t
		}
	}

	return &q, nil
}

// GetByChapterID retrieves all active quests in a specific chapter
func (r *QuestRepository) GetByChapterID(ctx context.Context, chapterID string, userID string) ([]domain.Quest, error) {
	query := `
		SELECT q.id, q.title, q.description, q.type, q.career_path_id, q.country_id,
		       q.difficulty, q.xp_reward, q.estimated_minutes, q.resource_url,
		       q.order_index, q.is_active, q.chapter_id, COALESCE(q.chip_label, 'QUEST'),
		       q.story_context, q.created_at, q.updated_at,
		       COALESCE(uq.status, 'available') as user_status,
		       COALESCE(uq.tests_passed, 0) as tests_passed,
		       COALESCE(uq.total_tests, 0) as total_tests
		FROM quests q
		LEFT JOIN user_quests uq ON q.id = uq.quest_id AND uq.user_id = $2
		WHERE q.chapter_id = $1 AND q.is_active = TRUE
		ORDER BY q.order_index ASC
	`
	rows, err := r.db.Pool.Query(ctx, query, chapterID, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to query quests by chapter: %w", err)
	}
	defer rows.Close()

	var quests []domain.Quest
	for rows.Next() {
		var q domain.Quest
		if err := rows.Scan(
			&q.ID,
			&q.Title,
			&q.Description,
			&q.Type,
			&q.CareerPathID,
			&q.CountryID,
			&q.Difficulty,
			&q.XPReward,
			&q.EstimatedMinutes,
			&q.ResourceURL,
			&q.OrderIndex,
			&q.IsActive,
			&q.ChapterID,
			&q.ChipLabel,
			&q.StoryContext,
			&q.CreatedAt,
			&q.UpdatedAt,
			&q.UserStatus,
			&q.UserTestsPassed,
			&q.UserTotalTests,
		); err != nil {
			return nil, fmt.Errorf("failed to scan quest: %w", err)
		}
		quests = append(quests, q)
	}
	return quests, nil
}

// GetDailyQuests retrieves the active rotating daily quests pool (3 quests)
func (r *QuestRepository) GetDailyQuests(ctx context.Context, userID string) ([]domain.Quest, error) {
	query := `
		SELECT q.id, q.title, q.description, q.type, q.difficulty,
		       q.xp_reward, q.estimated_minutes, q.order_index, q.is_active,
		       COALESCE(q.chip_label, 'DAILY'), q.created_at, q.updated_at,
		       COALESCE(uq.status, 'available') as user_status
		FROM quests q
		LEFT JOIN user_quests uq ON q.id = uq.quest_id AND uq.user_id = $1
		WHERE q.type = 'daily' AND q.is_active = TRUE
		ORDER BY q.order_index ASC
		LIMIT 3
	`
	rows, err := r.db.Pool.Query(ctx, query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to query daily quests: %w", err)
	}
	defer rows.Close()

	var quests []domain.Quest
	for rows.Next() {
		var q domain.Quest
		if err := rows.Scan(
			&q.ID,
			&q.Title,
			&q.Description,
			&q.Type,
			&q.Difficulty,
			&q.XPReward,
			&q.EstimatedMinutes,
			&q.OrderIndex,
			&q.IsActive,
			&q.ChipLabel,
			&q.CreatedAt,
			&q.UpdatedAt,
			&q.UserStatus,
		); err != nil {
			return nil, fmt.Errorf("failed to scan daily quest: %w", err)
		}
		quests = append(quests, q)
	}
	return quests, nil
}

// ListQuests retrieves quests by filter criteria
func (r *QuestRepository) ListQuests(ctx context.Context, filter domain.QuestFilter, userID string) ([]domain.Quest, error) {
	query := `
		SELECT q.id, q.title, q.description, q.type, q.difficulty,
		       q.xp_reward, q.estimated_minutes, q.order_index, q.is_active,
		       COALESCE(q.chip_label, 'QUEST'), q.created_at, q.updated_at,
		       COALESCE(uq.status, 'available') as user_status
		FROM quests q
		LEFT JOIN user_quests uq ON q.id = uq.quest_id AND uq.user_id = $1
		WHERE q.is_active = TRUE
	`
	args := []any{userID}
	argIdx := 2

	if filter.Type != nil && *filter.Type != "" && *filter.Type != "all" {
		query += fmt.Sprintf(" AND q.type = $%d", argIdx)
		args = append(args, *filter.Type)
		argIdx++
	}
	if filter.CareerPathID != nil && *filter.CareerPathID != "" {
		query += fmt.Sprintf(" AND (q.career_path_id = $%d OR q.career_path_id IS NULL)", argIdx)
		args = append(args, *filter.CareerPathID)
		argIdx++
	}

	query += " ORDER BY q.order_index ASC"

	rows, err := r.db.Pool.Query(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to list quests: %w", err)
	}
	defer rows.Close()

	var quests []domain.Quest
	for rows.Next() {
		var q domain.Quest
		if err := rows.Scan(
			&q.ID,
			&q.Title,
			&q.Description,
			&q.Type,
			&q.Difficulty,
			&q.XPReward,
			&q.EstimatedMinutes,
			&q.OrderIndex,
			&q.IsActive,
			&q.ChipLabel,
			&q.CreatedAt,
			&q.UpdatedAt,
			&q.UserStatus,
		); err != nil {
			return nil, fmt.Errorf("failed to scan filtered quest: %w", err)
		}
		quests = append(quests, q)
	}
	return quests, nil
}

// GetNextSequentialQuest finds the next quest in the learning track
func (r *QuestRepository) GetNextSequentialQuest(ctx context.Context, currentQuestID string, userID string) (*domain.QuestSummary, error) {
	query := `
		WITH current_q AS (
			SELECT chapter_id, order_index FROM quests WHERE id = $1
		)
		SELECT q.id, q.chapter_id, q.title, COALESCE(q.chip_label, 'QUEST'), q.type,
		       q.difficulty, q.xp_reward, q.estimated_minutes, q.order_index,
		       COALESCE(uq.status, 'available') as status
		FROM quests q
		CROSS JOIN current_q cq
		LEFT JOIN user_quests uq ON q.id = uq.quest_id AND uq.user_id = $2
		WHERE q.chapter_id = cq.chapter_id AND q.order_index > cq.order_index AND q.is_active = TRUE
		ORDER BY q.order_index ASC
		LIMIT 1
	`
	var qs domain.QuestSummary
	err := r.db.Pool.QueryRow(ctx, query, currentQuestID, userID).Scan(
		&qs.ID,
		&qs.ChapterID,
		&qs.Title,
		&qs.ChipLabel,
		&qs.Type,
		&qs.Difficulty,
		&qs.XPReward,
		&qs.EstimatedMinutes,
		&qs.OrderIndex,
		&qs.Status,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil // No next quest in this chapter
		}
		return nil, fmt.Errorf("failed to find next sequential quest: %w", err)
	}
	return &qs, nil
}
