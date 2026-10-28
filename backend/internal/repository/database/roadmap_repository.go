package database

import (
	"codeabroad/backend/internal/domain"
	"codeabroad/backend/internal/infrastructure/postgres"
	"context"
	"errors"
	"fmt"

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

// GetByCareerPathID finds an active curriculum track for a given career path UUID
func (r *RoadmapRepository) GetByCareerPathID(ctx context.Context, careerPathID string) (*domain.RoadmapResponse, error) {
	query := `
		SELECT ts.id, ts.career_path_id, ts.slug, ts.label, ts.badge, ts.is_active, ts.created_at, ts.updated_at
		FROM tech_stacks ts
		WHERE ts.career_path_id = $1 AND ts.is_active = TRUE
		ORDER BY ts.created_at ASC
		LIMIT 1
	`
	var rm domain.RoadmapResponse
	var careerPathIDVal string
	var badge *string

	err := r.db.Pool.QueryRow(ctx, query, careerPathID).Scan(
		&rm.ID,
		&careerPathIDVal,
		&rm.Slug,
		&rm.Title,
		&badge,
		&rm.IsActive,
		&rm.CreatedAt,
		&rm.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrRoadmapNotFound
		}
		return nil, fmt.Errorf("failed to get roadmap by career path id: %w", err)
	}

	rm.CareerPathID = &careerPathIDVal
	rm.Description = badge
	return &rm, nil
}

// GetByCareerPathSlug finds an active track by tech stack slug or career path slug
func (r *RoadmapRepository) GetByCareerPathSlug(ctx context.Context, slug string) (*domain.RoadmapResponse, error) {
	query := `
		SELECT ts.id, ts.career_path_id, ts.slug, ts.label, ts.badge, ts.is_active, ts.created_at, ts.updated_at
		FROM tech_stacks ts
		LEFT JOIN career_paths cp ON ts.career_path_id = cp.id
		WHERE (
			ts.slug = $1 
			OR cp.slug = $1
			OR ts.slug = CASE 
				WHEN $1 IN ('golang', 'go', 'backend_go', 'backend') THEN 'golang'
				WHEN $1 IN ('frontend', 'web', 'web_fundamental') THEN 'web_fundamental'
				WHEN $1 IN ('cs', 'cs_fundamental', 'computer_science') THEN 'cs_fundamental'
				WHEN $1 IN ('react', 'nextjs', 'react_next') THEN 'react_next'
				WHEN $1 IN ('docker', 'k8s', 'devops', 'docker_k8s') THEN 'docker_k8s'
				ELSE $1 
			END
		) AND ts.is_active = TRUE
		ORDER BY (CASE WHEN ts.slug = $1 THEN 0 ELSE 1 END) ASC, ts.created_at ASC
		LIMIT 1
	`
	var rm domain.RoadmapResponse
	var careerPathIDVal string
	var badge *string

	err := r.db.Pool.QueryRow(ctx, query, slug).Scan(
		&rm.ID,
		&careerPathIDVal,
		&rm.Slug,
		&rm.Title,
		&badge,
		&rm.IsActive,
		&rm.CreatedAt,
		&rm.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrRoadmapNotFound
		}
		return nil, fmt.Errorf("failed to get roadmap by slug: %w", err)
	}

	rm.CareerPathID = &careerPathIDVal
	rm.Description = badge
	return &rm, nil
}

// GetFullSyllabus retrieves the complete nested tree: TechStack -> Modules -> Chapters -> Quests with user progress
func (r *RoadmapRepository) GetFullSyllabus(ctx context.Context, roadmapID string, userID string) (*domain.RoadmapResponse, error) {
	// 1. Fetch tech stack root
	tsQuery := `
		SELECT ts.id, ts.career_path_id, ts.slug, ts.label, ts.badge, ts.is_active, ts.created_at, ts.updated_at
		FROM tech_stacks ts
		WHERE ts.id::text = $1 OR ts.slug = $1
		LIMIT 1
	`
	var rm domain.RoadmapResponse
	var careerPathIDVal string
	var badge *string

	err := r.db.Pool.QueryRow(ctx, tsQuery, roadmapID).Scan(
		&rm.ID,
		&careerPathIDVal,
		&rm.Slug,
		&rm.Title,
		&badge,
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

	rm.CareerPathID = &careerPathIDVal
	rm.Description = badge

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

	// 3. For each module, fetch chapters & quests with user progression
	var moduleResponses []domain.ModuleResponse
	for mIdx, mEntity := range moduleEntities {
		moduleID := mEntity.ID
		chapQuery := `
			SELECT id, module_id, chapter_number, title, description, created_at, updated_at
			FROM chapters
			WHERE module_id = $1
			ORDER BY chapter_number ASC
		`
		cRows, err := r.db.Pool.Query(ctx, chapQuery, moduleID)
		if err != nil {
			return nil, fmt.Errorf("failed to query chapters for module %s: %w", moduleID, err)
		}

		var chapterResponses []domain.ChapterResponse
		var totalQuestsInModule int
		var completedQuestsInModule int

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
				cRows.Close()
				return nil, fmt.Errorf("failed to scan chapter: %w", err)
			}

			// 4. Query quests for this chapter
			qQuery := `
				SELECT q.id, q.chapter_id, q.title, q.type, q.format, q.difficulty,
				       q.xp_reward, q.gems_reward, q.estimated_minutes, q.order_index,
				       COALESCE(uq.status, 'available') as user_status
				FROM quests q
				LEFT JOIN user_quests uq ON q.id = uq.quest_id AND uq.user_id = $2
				WHERE q.chapter_id = $1
				ORDER BY q.order_index ASC
			`
			qRows, err := r.db.Pool.Query(ctx, qQuery, ch.ID, userID)
			if err != nil {
				cRows.Close()
				return nil, fmt.Errorf("failed to query quests for chapter %s: %w", ch.ID, err)
			}

			var quests []domain.QuestSummaryResponse
			var chapterCompletedCount int
			for qRows.Next() {
				var qs domain.QuestSummaryResponse
				qs.ModuleNumber = mEntity.ModuleNumber
				qs.ChapterNumber = ch.ChapterNumber
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
					qRows.Close()
					cRows.Close()
					return nil, fmt.Errorf("failed to scan quest summary: %w", err)
				}
				qs.ChipLabel = fmt.Sprintf("QUEST %02d", qs.OrderIndex)
				quests = append(quests, qs)
				totalQuestsInModule++
				if qs.Status == "completed" {
					completedQuestsInModule++
					chapterCompletedCount++
				}
			}
			qRows.Close()

			chapterResp := domain.ChapterResponse{
				ID:            ch.ID,
				ModuleID:      ch.ModuleID,
				ChapterNumber: ch.ChapterNumber,
				Title:         ch.Title,
				Description:   ch.Description,
				IsUnlocked:    true, // First chapter is unlocked
				IsCompleted:   len(quests) > 0 && chapterCompletedCount == len(quests),
				Quests:        quests,
				CreatedAt:     ch.CreatedAt,
				UpdatedAt:     ch.UpdatedAt,
			}
			chapterResponses = append(chapterResponses, chapterResp)
		}
		cRows.Close()

		modResp := domain.ModuleResponse{
			ID:           mEntity.ID,
			TechStackID:  mEntity.TechStackID,
			ModuleNumber: mEntity.ModuleNumber,
			Title:        mEntity.Title,
			Description:  mEntity.Description,
			Chapters:     chapterResponses,
			CreatedAt:    mEntity.CreatedAt,
			UpdatedAt:    mEntity.UpdatedAt,
		}

		// Calculate module completion percentage
		if totalQuestsInModule > 0 {
			modResp.ProgressRate = float64(completedQuestsInModule) / float64(totalQuestsInModule) * 100.0
			modResp.IsCompleted = completedQuestsInModule == totalQuestsInModule
		} else {
			modResp.ProgressRate = 0.0
			modResp.IsCompleted = false
		}

		// Unlock Module 1 by default; subsequent modules unlock if prior module is >= 80% or index == 0
		if mIdx == 0 {
			modResp.IsUnlocked = true
		} else {
			modResp.IsUnlocked = moduleResponses[mIdx-1].ProgressRate >= 80.0 || moduleResponses[mIdx-1].IsCompleted
		}

		moduleResponses = append(moduleResponses, modResp)
	}

	rm.Modules = moduleResponses
	return &rm, nil
}
