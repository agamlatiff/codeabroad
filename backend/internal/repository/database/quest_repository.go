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

// QuestRepository implements domain.QuestRepository using PostgreSQL v2.2 schema
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
		SELECT q.id, q.chapter_id, q.title, q.description, q.type, q.format,
		       q.difficulty, q.xp_reward, q.gems_reward, q.estimated_minutes,
		       q.order_index, q.starter_code, q.test_suite, q.solution_code,
		       q.quiz_data, q.hints, q.created_at, q.updated_at,
		       COALESCE(uq.status, 'available') as user_status,
		       COALESCE(uq.tests_passed, 0) as tests_passed,
		       COALESCE(uq.total_tests, 0) as total_tests,
		       uq.code_submission
		FROM quests q
		LEFT JOIN user_quests uq ON q.id = uq.quest_id AND uq.user_id = $2
		WHERE q.id::text = $1
		LIMIT 1
	`

	var q domain.Quest
	var rawQuiz, rawHints []byte

	err := r.db.Pool.QueryRow(ctx, query, id, userID).Scan(
		&q.ID,
		&q.ChapterID,
		&q.Title,
		&q.Description,
		&q.Type,
		&q.Format,
		&q.Difficulty,
		&q.XPReward,
		&q.GemsReward,
		&q.EstimatedMinutes,
		&q.OrderIndex,
		&q.StarterCode,
		&q.TestSuite,
		&q.SolutionCode,
		&rawQuiz,
		&rawHints,
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

	q.IsActive = true
	q.ChipLabel = fmt.Sprintf("QUEST %02d", q.OrderIndex)

	if len(rawQuiz) > 0 {
		var qData any
		if err := json.Unmarshal(rawQuiz, &qData); err == nil {
			q.QuizData = qData
		}
	}
	if len(rawHints) > 0 {
		var hData any
		if err := json.Unmarshal(rawHints, &hData); err == nil {
			q.Hints = hData
		}
	}

	return &q, nil
}

// GetByChapterID retrieves all quests in a specific chapter
func (r *QuestRepository) GetByChapterID(ctx context.Context, chapterID string, userID string) ([]domain.Quest, error) {
	query := `
		SELECT q.id, q.chapter_id, q.title, q.description, q.type, q.format,
		       q.difficulty, q.xp_reward, q.gems_reward, q.estimated_minutes,
		       q.order_index, q.starter_code, q.test_suite, q.solution_code,
		       q.quiz_data, q.hints, q.created_at, q.updated_at,
		       COALESCE(uq.status, 'available') as user_status,
		       COALESCE(uq.tests_passed, 0) as tests_passed,
		       COALESCE(uq.total_tests, 0) as total_tests,
		       uq.code_submission
		FROM quests q
		LEFT JOIN user_quests uq ON q.id = uq.quest_id AND uq.user_id = $2
		WHERE q.chapter_id = $1
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
		var rawQuiz, rawHints []byte
		if err := rows.Scan(
			&q.ID,
			&q.ChapterID,
			&q.Title,
			&q.Description,
			&q.Type,
			&q.Format,
			&q.Difficulty,
			&q.XPReward,
			&q.GemsReward,
			&q.EstimatedMinutes,
			&q.OrderIndex,
			&q.StarterCode,
			&q.TestSuite,
			&q.SolutionCode,
			&rawQuiz,
			&rawHints,
			&q.CreatedAt,
			&q.UpdatedAt,
			&q.UserStatus,
			&q.UserTestsPassed,
			&q.UserTotalTests,
			&q.UserCodeSubmission,
		); err != nil {
			return nil, fmt.Errorf("failed to scan quest: %w", err)
		}
		q.IsActive = true
		q.ChipLabel = fmt.Sprintf("QUEST %02d", q.OrderIndex)
		if len(rawQuiz) > 0 {
			var qData any
			if err := json.Unmarshal(rawQuiz, &qData); err == nil {
				q.QuizData = qData
			}
		}
		if len(rawHints) > 0 {
			var hData any
			if err := json.Unmarshal(rawHints, &hData); err == nil {
				q.Hints = hData
			}
		}
		quests = append(quests, q)
	}
	return quests, nil
}

// GetDailyQuests retrieves the active rotating daily quests pool (3 quests)
func (r *QuestRepository) GetDailyQuests(ctx context.Context, userID string) ([]domain.Quest, error) {
	query := `
		SELECT q.id, q.chapter_id, q.title, q.description, q.type, q.format,
		       q.difficulty, q.xp_reward, q.gems_reward, q.estimated_minutes,
		       q.order_index, q.starter_code, q.test_suite, q.solution_code,
		       q.quiz_data, q.hints, q.created_at, q.updated_at,
		       COALESCE(uq.status, 'available') as user_status
		FROM quests q
		LEFT JOIN user_quests uq ON q.id = uq.quest_id AND uq.user_id = $1
		WHERE q.type = 'daily'
		ORDER BY ((q.order_index + EXTRACT(DOY FROM CURRENT_DATE)::INT) % 10) ASC
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
		var rawQuiz, rawHints []byte
		if err := rows.Scan(
			&q.ID,
			&q.ChapterID,
			&q.Title,
			&q.Description,
			&q.Type,
			&q.Format,
			&q.Difficulty,
			&q.XPReward,
			&q.GemsReward,
			&q.EstimatedMinutes,
			&q.OrderIndex,
			&q.StarterCode,
			&q.TestSuite,
			&q.SolutionCode,
			&rawQuiz,
			&rawHints,
			&q.CreatedAt,
			&q.UpdatedAt,
			&q.UserStatus,
		); err != nil {
			return nil, fmt.Errorf("failed to scan daily quest: %w", err)
		}
		q.IsActive = true
		q.ChipLabel = "DAILY"
		if len(rawQuiz) > 0 {
			_ = json.Unmarshal(rawQuiz, &q.QuizData)
		}
		if len(rawHints) > 0 {
			_ = json.Unmarshal(rawHints, &q.Hints)
		}
		quests = append(quests, q)
	}

	// Fallback: If no explicit 'daily' quests exist, pick 3 easy quests from the library
	if len(quests) == 0 {
		fallbackQuery := `
			SELECT q.id, q.chapter_id, q.title, q.description, q.type, q.format,
			       q.difficulty, q.xp_reward, q.gems_reward, q.estimated_minutes,
			       q.order_index, q.starter_code, q.test_suite, q.solution_code,
			       q.quiz_data, q.hints, q.created_at, q.updated_at,
			       COALESCE(uq.status, 'available') as user_status
			FROM quests q
			LEFT JOIN user_quests uq ON q.id = uq.quest_id AND uq.user_id = $1
			WHERE q.difficulty = 'easy'
			ORDER BY q.created_at ASC
			LIMIT 3
		`
		fRows, err := r.db.Pool.Query(ctx, fallbackQuery, userID)
		if err == nil {
			defer fRows.Close()
			for fRows.Next() {
				var q domain.Quest
				var rawQuiz, rawHints []byte
				if err := fRows.Scan(
					&q.ID,
					&q.ChapterID,
					&q.Title,
					&q.Description,
					&q.Type,
					&q.Format,
					&q.Difficulty,
					&q.XPReward,
					&q.GemsReward,
					&q.EstimatedMinutes,
					&q.OrderIndex,
					&q.StarterCode,
					&q.TestSuite,
					&q.SolutionCode,
					&rawQuiz,
					&rawHints,
					&q.CreatedAt,
					&q.UpdatedAt,
					&q.UserStatus,
				); err == nil {
					q.IsActive = true
					q.ChipLabel = "DAILY"
					quests = append(quests, q)
				}
			}
		}
	}

	return quests, nil
}

// ListQuests retrieves quests by filter criteria
func (r *QuestRepository) ListQuests(ctx context.Context, filter domain.QuestFilter, userID string) ([]domain.Quest, error) {
	query := `
		SELECT q.id, q.chapter_id, q.title, q.description, q.type, q.format,
		       q.difficulty, q.xp_reward, q.gems_reward, q.estimated_minutes,
		       q.order_index, q.starter_code, q.test_suite, q.solution_code,
		       q.quiz_data, q.hints, q.created_at, q.updated_at,
		       COALESCE(uq.status, 'available') as user_status
		FROM quests q
		LEFT JOIN user_quests uq ON q.id = uq.quest_id AND uq.user_id = $1
		LEFT JOIN chapters c ON q.chapter_id = c.id
		LEFT JOIN modules m ON c.module_id = m.id
		LEFT JOIN tech_stacks ts ON m.tech_stack_id = ts.id
		WHERE 1=1
	`
	args := []any{userID}
	argIdx := 2

	if filter.ChapterID != nil && *filter.ChapterID != "" {
		query += fmt.Sprintf(" AND q.chapter_id = $%d", argIdx)
		args = append(args, *filter.ChapterID)
		argIdx++
	}
	if filter.Type != nil && *filter.Type != "" && *filter.Type != "all" {
		query += fmt.Sprintf(" AND q.type = $%d", argIdx)
		args = append(args, *filter.Type)
		argIdx++
	}
	if filter.CareerPathID != nil && *filter.CareerPathID != "" {
		query += fmt.Sprintf(" AND (ts.career_path_id = $%d OR ts.id = $%d)", argIdx, argIdx)
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
		var rawQuiz, rawHints []byte
		if err := rows.Scan(
			&q.ID,
			&q.ChapterID,
			&q.Title,
			&q.Description,
			&q.Type,
			&q.Format,
			&q.Difficulty,
			&q.XPReward,
			&q.GemsReward,
			&q.EstimatedMinutes,
			&q.OrderIndex,
			&q.StarterCode,
			&q.TestSuite,
			&q.SolutionCode,
			&rawQuiz,
			&rawHints,
			&q.CreatedAt,
			&q.UpdatedAt,
			&q.UserStatus,
		); err != nil {
			return nil, fmt.Errorf("failed to scan filtered quest: %w", err)
		}
		q.IsActive = true
		q.ChipLabel = fmt.Sprintf("QUEST %02d", q.OrderIndex)
		quests = append(quests, q)
	}
	return quests, nil
}

// GetNextSequentialQuest finds the next quest in the learning track
func (r *QuestRepository) GetNextSequentialQuest(ctx context.Context, currentQuestID string, userID string) (*domain.QuestSummaryResponse, error) {
	query := `
		WITH current_q AS (
			SELECT chapter_id, order_index FROM quests WHERE id = $1
		)
		SELECT q.id, q.chapter_id, q.title, q.type, q.format,
		       q.difficulty, q.xp_reward, q.gems_reward, q.estimated_minutes, q.order_index,
		       COALESCE(uq.status, 'available') as status
		FROM quests q
		CROSS JOIN current_q cq
		LEFT JOIN user_quests uq ON q.id = uq.quest_id AND uq.user_id = $2
		WHERE q.chapter_id = cq.chapter_id AND q.order_index > cq.order_index
		ORDER BY q.order_index ASC
		LIMIT 1
	`
	var qs domain.QuestSummaryResponse
	err := r.db.Pool.QueryRow(ctx, query, currentQuestID, userID).Scan(
		&qs.ID,
		&qs.ChapterID,
		&qs.Title,
		&qs.Type,
		&qs.Format,
		&qs.Difficulty,
		&qs.XPReward,
		&qs.GemsReward,
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
	qs.ChipLabel = fmt.Sprintf("QUEST %02d", qs.OrderIndex)
	return &qs, nil
}
