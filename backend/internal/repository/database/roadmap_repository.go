package database

import (
	"codeabroad/backend/internal/domain"
	"codeabroad/backend/internal/infrastructure/postgres"
	"context"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5"
)

// RoadmapRepository implements domain.RoadmapRepository using PostgreSQL
type RoadmapRepository struct {
	db *postgres.PostgresDB
}

// NewRoadmapRepository creates a new PostgreSQL roadmap repository
func NewRoadmapRepository(db *postgres.PostgresDB) domain.RoadmapRepository {
	return &RoadmapRepository{db: db}
}

// GetByCareerPathID finds an active roadmap for a given career path UUID
func (r *RoadmapRepository) GetByCareerPathID(ctx context.Context, careerPathID string) (*domain.Roadmap, error) {
	query := `
		SELECT id, career_path_id, title, description, is_active, created_at, updated_at
		FROM roadmaps
		WHERE career_path_id = $1 AND is_active = TRUE
		LIMIT 1
	`
	var rm domain.Roadmap
	err := r.db.Pool.QueryRow(ctx, query, careerPathID).Scan(
		&rm.ID,
		&rm.CareerPathID,
		&rm.Title,
		&rm.Description,
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
	return &rm, nil
}

// GetByCareerPathSlug finds an active roadmap by career path slug (e.g. "backend", "devops", "frontend")
func (r *RoadmapRepository) GetByCareerPathSlug(ctx context.Context, slug string) (*domain.Roadmap, error) {
	query := `
		SELECT r.id, r.career_path_id, r.title, r.description, r.is_active, r.created_at, r.updated_at
		FROM roadmaps r
		JOIN career_paths cp ON r.career_path_id = cp.id
		WHERE cp.slug = $1 AND r.is_active = TRUE
		LIMIT 1
	`
	var rm domain.Roadmap
	err := r.db.Pool.QueryRow(ctx, query, slug).Scan(
		&rm.ID,
		&rm.CareerPathID,
		&rm.Title,
		&rm.Description,
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
	return &rm, nil
}

// GetFullSyllabus retrieves the complete nested tree: Roadmap ➔ Stations ➔ Chapters ➔ Quests with user progress
func (r *RoadmapRepository) GetFullSyllabus(ctx context.Context, roadmapID string, userID string) (*domain.Roadmap, error) {
	// 1. Fetch roadmap root
	rmQuery := `
		SELECT id, career_path_id, title, description, is_active, created_at, updated_at
		FROM roadmaps
		WHERE id = $1
	`
	var rm domain.Roadmap
	err := r.db.Pool.QueryRow(ctx, rmQuery, roadmapID).Scan(
		&rm.ID,
		&rm.CareerPathID,
		&rm.Title,
		&rm.Description,
		&rm.IsActive,
		&rm.CreatedAt,
		&rm.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, domain.ErrRoadmapNotFound
		}
		return nil, fmt.Errorf("failed to query roadmap root: %w", err)
	}

	// 2. Fetch stations
	stationQuery := `
		SELECT id, roadmap_id, station_number, title, chip_label, description, order_index, created_at, updated_at
		FROM stations
		WHERE roadmap_id = $1
		ORDER BY order_index ASC
	`
	sRows, err := r.db.Pool.Query(ctx, stationQuery, roadmapID)
	if err != nil {
		return nil, fmt.Errorf("failed to query stations: %w", err)
	}
	defer sRows.Close()

	var stations []domain.Station
	for sRows.Next() {
		var st domain.Station
		if err := sRows.Scan(
			&st.ID,
			&st.RoadmapID,
			&st.StationNumber,
			&st.Title,
			&st.ChipLabel,
			&st.Description,
			&st.OrderIndex,
			&st.CreatedAt,
			&st.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan station: %w", err)
		}
		stations = append(stations, st)
	}

	// 3. For each station, fetch chapters & quests with user progression
	for sIdx := range stations {
		stationID := stations[sIdx].ID
		chapQuery := `
			SELECT id, station_id, chapter_number, title, description, order_index, created_at, updated_at
			FROM chapters
			WHERE station_id = $1
			ORDER BY order_index ASC
		`
		cRows, err := r.db.Pool.Query(ctx, chapQuery, stationID)
		if err != nil {
			return nil, fmt.Errorf("failed to query chapters for station %s: %w", stationID, err)
		}

		var chapters []domain.Chapter
		var totalQuestsInStation int
		var completedQuestsInStation int

		for cRows.Next() {
			var ch domain.Chapter
			if err := cRows.Scan(
				&ch.ID,
				&ch.StationID,
				&ch.ChapterNumber,
				&ch.Title,
				&ch.Description,
				&ch.OrderIndex,
				&ch.CreatedAt,
				&ch.UpdatedAt,
			); err != nil {
				cRows.Close()
				return nil, fmt.Errorf("failed to scan chapter: %w", err)
			}

			// 4. Query quests for this chapter
			qQuery := `
				SELECT q.id, q.chapter_id, q.title, COALESCE(q.chip_label, 'QUEST'), q.type, q.difficulty,
				       q.xp_reward, q.estimated_minutes, q.order_index,
				       COALESCE(uq.status, 'available') as user_status
				FROM quests q
				LEFT JOIN user_quests uq ON q.id = uq.quest_id AND uq.user_id = $2
				WHERE q.chapter_id = $1 AND q.is_active = TRUE
				ORDER BY q.order_index ASC
			`
			qRows, err := r.db.Pool.Query(ctx, qQuery, ch.ID, userID)
			if err != nil {
				cRows.Close()
				return nil, fmt.Errorf("failed to query quests for chapter %s: %w", ch.ID, err)
			}

			var quests []domain.QuestSummary
			var chapterCompletedCount int
			for qRows.Next() {
				var qs domain.QuestSummary
				qs.StationNumber = stations[sIdx].StationNumber
				qs.ChapterNumber = ch.ChapterNumber
				if err := qRows.Scan(
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
				); err != nil {
					qRows.Close()
					cRows.Close()
					return nil, fmt.Errorf("failed to scan quest summary: %w", err)
				}
				quests = append(quests, qs)
				totalQuestsInStation++
				if qs.Status == "completed" {
					completedQuestsInStation++
					chapterCompletedCount++
				}
			}
			qRows.Close()

			ch.Quests = quests
			ch.IsCompleted = len(quests) > 0 && chapterCompletedCount == len(quests)
			ch.IsUnlocked = true // first chapter is unlocked
			chapters = append(chapters, ch)
		}
		cRows.Close()

		// Calculate station completion percentage
		if totalQuestsInStation > 0 {
			stations[sIdx].ProgressRate = float64(completedQuestsInStation) / float64(totalQuestsInStation) * 100.0
			stations[sIdx].IsCompleted = completedQuestsInStation == totalQuestsInStation
		} else {
			stations[sIdx].ProgressRate = 0.0
			stations[sIdx].IsCompleted = false
		}

		// Unlock Station 1 by default; subsequent stations unlock if prior station is >= 80% or index == 0
		if sIdx == 0 {
			stations[sIdx].IsUnlocked = true
		} else {
			stations[sIdx].IsUnlocked = stations[sIdx-1].ProgressRate >= 80.0 || stations[sIdx-1].IsCompleted
		}

		stations[sIdx].Chapters = chapters
	}

	rm.Stations = stations
	return &rm, nil
}
