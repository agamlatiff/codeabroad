package database

import (
	"codeabroad/backend/internal/domain"
	"codeabroad/backend/internal/infrastructure/postgres"
	"context"
	"errors"
	"fmt"
	"strings"

	"github.com/jackc/pgx/v5"
)

// RoadmapRepository implements domain.RoadmapRepository using PostgreSQL v2.2 normalized schema
type RoadmapRepository struct {
	db *postgres.PostgresDB
}

// NewRoadmapRepository creates a new PostgreSQL roadmap repository
func NewRoadmapRepository(db *postgres.PostgresDB) domain.RoadmapRepository {
	return &RoadmapRepository{db: db}
}

// GetByTechStackID finds an active curriculum track directly by tech stack UUID
func (r *RoadmapRepository) GetByTechStackID(ctx context.Context, techStackID string) (*domain.RoadmapResponse, error) {
	query := `
		SELECT ts.id, ts.career_path_id, ts.slug, ts.label, ts.badge, ts.is_active, ts.created_at, ts.updated_at
		FROM tech_stacks ts
		WHERE ts.id = $1 AND ts.is_active = TRUE
	`
	var rm domain.RoadmapResponse

	err := r.db.Pool.QueryRow(ctx, query, techStackID).Scan(
		&rm.ID,
		&rm.CareerPathID,
		&rm.Slug,
		&rm.Title,
		&rm.Badge,
		&rm.IsActive,
		&rm.CreatedAt,
		&rm.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrRoadmapNotFound
		}
		return nil, fmt.Errorf("failed to get roadmap by tech stack id: %w", err)
	}
	return &rm, nil
}

// GetByCareerPathSlug finds an active track by tech stack slug or career path slug using indexed lookups
func (r *RoadmapRepository) GetByCareerPathSlug(ctx context.Context, slug string) (*domain.RoadmapResponse, error) {
	// 1. Direct indexed lookup on tech_stacks table (no joins, no ORs)
	query := `
		SELECT ts.id, ts.career_path_id, ts.slug, ts.label, ts.badge, ts.is_active, ts.created_at, ts.updated_at
		FROM tech_stacks ts
		WHERE ts.slug = $1 AND ts.is_active = TRUE
		LIMIT 1
	`
	var rm domain.RoadmapResponse

	err := r.db.Pool.QueryRow(ctx, query, slug).Scan(
		&rm.ID,
		&rm.CareerPathID,
		&rm.Slug,
		&rm.Title,
		&rm.Badge,
		&rm.IsActive,
		&rm.CreatedAt,
		&rm.UpdatedAt,
	)
	if err == nil {
		return &rm, nil
	}
	if !errors.Is(err, pgx.ErrNoRows) {
		return nil, fmt.Errorf("failed to get roadmap by tech stack slug: %w", err)
	}

	// 2. Fallback: If input matches a parent career path category, select its primary active tech stack
	fallbackQuery := `
		SELECT ts.id, ts.career_path_id, ts.slug, ts.label, ts.badge, ts.is_active, ts.created_at, ts.updated_at
		FROM tech_stacks ts
		JOIN career_paths cp ON ts.career_path_id = cp.id
		WHERE cp.slug = $1 AND ts.is_active = TRUE
		ORDER BY ts.created_at ASC
		LIMIT 1
	`
	err = r.db.Pool.QueryRow(ctx, fallbackQuery, strings.ToLower(strings.TrimSpace(slug))).Scan(
		&rm.ID,
		&rm.CareerPathID,
		&rm.Slug,
		&rm.Title,
		&rm.Badge,
		&rm.IsActive,
		&rm.CreatedAt,
		&rm.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrRoadmapNotFound
		}
		return nil, fmt.Errorf("failed to get roadmap by career path slug: %w", err)
	}

	return &rm, nil
}

// GetFullSyllabus retrieves the complete nested tree: TechStack -> Modules -> Chapters -> Quests with user progress
func (r *RoadmapRepository) GetFullSyllabus(ctx context.Context, roadmapID string, userID string) (*domain.RoadmapResponse, error) {
	// 1. Fetch tech stack root
	tsQuery := `
		SELECT ts.id, ts.career_path_id, ts.slug, ts.label, ts.badge, ts.is_active, ts.created_at, ts.updated_at
		FROM tech_stacks ts
		WHERE ts.id = $1
		LIMIT 1
	`
	var rm domain.RoadmapResponse

	err := r.db.Pool.QueryRow(ctx, tsQuery, roadmapID).Scan(
		&rm.ID,
		&rm.CareerPathID,
		&rm.Slug,
		&rm.Title,
		&rm.Badge,
		&rm.IsActive,
		&rm.CreatedAt,
		&rm.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrRoadmapNotFound
		}
		return nil, fmt.Errorf("failed to query tech stack root: %w", err)
	}

	// 2. Fetch modules for this tech stack
	moduleQuery := `
		SELECT id, tech_stack_id, module_number, title, description, created_at, updated_at
		FROM modules
		WHERE tech_stack_id = $1
		ORDER BY module_number ASC
	`
	mRows, err := r.db.Pool.Query(ctx, moduleQuery, rm.ID)
	if err != nil {
		return nil, fmt.Errorf("failed to query modules: %w", err)
	}
	defer mRows.Close()

	var moduleEntities []domain.Module
	for mRows.Next() {
		var m domain.Module
		if err := mRows.Scan(
			&m.ID,
			&m.TechStackID,
			&m.ModuleNumber,
			&m.Title,
			&m.Description,
			&m.CreatedAt,
			&m.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan module: %w", err)
		}
		moduleEntities = append(moduleEntities, m)
	}
	mRows.Close()

	if len(moduleEntities) == 0 {
		rm.Modules = []domain.ModuleResponse{}
		return &rm, nil
	}

	// Collect module IDs and mapping for O(1) lookup
	moduleIDs := make([]string, len(moduleEntities))
	moduleNumberByID := make(map[string]int, len(moduleEntities))
	for i, m := range moduleEntities {
		moduleIDs[i] = m.ID
		moduleNumberByID[m.ID] = m.ModuleNumber
	}

	// 3. Batch fetch ALL chapters across all modules in 1 query
	chapQuery := `
		SELECT id, module_id, chapter_number, title, description, created_at, updated_at
		FROM chapters
		WHERE module_id = ANY($1)
		ORDER BY chapter_number ASC
	`
	cRows, err := r.db.Pool.Query(ctx, chapQuery, moduleIDs)
	if err != nil {
		return nil, fmt.Errorf("failed to batch query chapters: %w", err)
	}
	defer cRows.Close()

	var allChapters []domain.Chapter
	var chapterIDs []string
	chapterNumberByID := make(map[string]int)
	chapterModuleIDByID := make(map[string]string)

	for cRows.Next() {
		var ch domain.Chapter
		if err := cRows.Scan(
			&ch.ID,
			&ch.ModuleID,
			&ch.ChapterNumber,
			&ch.Title,
			&ch.Description,
			&ch.CreatedAt,
			&ch.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan batch chapter: %w", err)
		}
		allChapters = append(allChapters, ch)
		chapterIDs = append(chapterIDs, ch.ID)
		chapterNumberByID[ch.ID] = ch.ChapterNumber
		chapterModuleIDByID[ch.ID] = ch.ModuleID
	}
	cRows.Close()

	// 4. Batch fetch ALL quests across all chapters in 1 query
	questsByChapter := make(map[string][]domain.QuestSummaryResponse)
	if len(chapterIDs) > 0 {
		qQuery := `
			SELECT q.id, q.chapter_id, q.title, q.type, q.format, q.difficulty,
			       q.xp_reward, q.gems_reward, q.estimated_minutes, q.order_index,
			       COALESCE(uq.status, 'available') as user_status
			FROM quests q
			LEFT JOIN user_quests uq ON q.id = uq.quest_id AND uq.user_id = $2
			WHERE q.chapter_id = ANY($1)
			ORDER BY q.order_index ASC
		`
		qRows, err := r.db.Pool.Query(ctx, qQuery, chapterIDs, userID)
		if err != nil {
			return nil, fmt.Errorf("failed to batch query quests: %w", err)
		}
		defer qRows.Close()

		for qRows.Next() {
			var qs domain.QuestSummaryResponse
			if err := qRows.Scan(
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
			); err != nil {
				return nil, fmt.Errorf("failed to scan batch quest: %w", err)
			}

			var chapID string
			if qs.ChapterID != nil {
				chapID = *qs.ChapterID
			}

			if modID, ok := chapterModuleIDByID[chapID]; ok {
				qs.ModuleNumber = moduleNumberByID[modID]
			}
			qs.ChapterNumber = chapterNumberByID[chapID]
			qs.ChipLabel = fmt.Sprintf("QUEST %02d", qs.OrderIndex)

			if chapID != "" {
				questsByChapter[chapID] = append(questsByChapter[chapID], qs)
			}
		}
		qRows.Close()
	}

	// 5. In-Memory Stitching: Group chapters by module and assign their respective quests
	chaptersByModule := make(map[string][]domain.ChapterResponse)
	for _, ch := range allChapters {
		quests := questsByChapter[ch.ID]
		if quests == nil {
			quests = []domain.QuestSummaryResponse{}
		}

		chapterResp := domain.ChapterResponse{
			ID:            ch.ID,
			ModuleID:      ch.ModuleID,
			ChapterNumber: ch.ChapterNumber,
			Title:         ch.Title,
			Description:   ch.Description,
			Quests:        quests,
			CreatedAt:     ch.CreatedAt,
			UpdatedAt:     ch.UpdatedAt,
		}
		chaptersByModule[ch.ModuleID] = append(chaptersByModule[ch.ModuleID], chapterResp)
	}

	// 6. Build final Module responses
	var moduleResponses []domain.ModuleResponse
	for _, mEntity := range moduleEntities {
		chaps := chaptersByModule[mEntity.ID]
		if chaps == nil {
			chaps = []domain.ChapterResponse{}
		}

		modResp := domain.ModuleResponse{
			ID:           mEntity.ID,
			TechStackID:  mEntity.TechStackID,
			ModuleNumber: mEntity.ModuleNumber,
			Title:        mEntity.Title,
			Description:  mEntity.Description,
			Chapters:     chaps,
			CreatedAt:    mEntity.CreatedAt,
			UpdatedAt:    mEntity.UpdatedAt,
		}
		moduleResponses = append(moduleResponses, modResp)
	}

	rm.Modules = moduleResponses
	return &rm, nil
}
