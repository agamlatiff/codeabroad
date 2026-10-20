package database

import (
	"codeabroad/backend/internal/domain"
	"codeabroad/backend/internal/infrastructure/postgres"
	"context"
	"time"
)

// LeaderboardRepository implements domain.LeaderboardRepository using PostgreSQL
type LeaderboardRepository struct {
	db *postgres.PostgresDB
}

// NewLeaderboardRepository creates a new PostgreSQL leaderboard repository instance
func NewLeaderboardRepository(db *postgres.PostgresDB) domain.LeaderboardRepository {
	return &LeaderboardRepository{db: db}
}

// GetWeeklyLeaderboard computes real standings from PostgreSQL for the specified division
func (r *LeaderboardRepository) GetWeeklyLeaderboard(ctx context.Context, userID string, division domain.TokyoDivision) (*domain.WeeklyLeaderboardResponse, error) {
	now := time.Now()
	_, seasonWeek := now.ISOWeek()

	// Calculate days remaining until Sunday midnight reset
	daysUntilSunday := int(time.Sunday - now.Weekday())
	if daysUntilSunday <= 0 {
		daysUntilSunday += 7
	}

	divisionName := "Divisi Shinjuku"
	divisionTier := "Bronze League"
	switch division {
	case domain.DivisionShibuya:
		divisionName = "Divisi Shibuya"
		divisionTier = "Silver League"
	case domain.DivisionAkihabara:
		divisionName = "Divisi Akihabara"
		divisionTier = "Gold League"
	case domain.DivisionRoppongi:
		divisionName = "Divisi Roppongi"
		divisionTier = "Diamond Master"
	}

	// Query 100% real active users belonging to the requested division tier from PostgreSQL
	query := `
		SELECT u.id, u.name, u.username, u.avatar_url, u.xp, u.current_level, u.streak,
		       COALESCE((
		           SELECT SUM(xp_earned) 
		           FROM user_activity_logs 
		           WHERE user_id = u.id AND created_at >= NOW() - INTERVAL '7 days'
		       ), u.xp) as week_xp
		FROM users u
		WHERE 
		  CASE 
		    WHEN $1 = 'roppongi'  THEN u.xp >= 1500
		    WHEN $1 = 'akihabara' THEN u.xp >= 800 AND u.xp < 1500
		    WHEN $1 = 'shibuya'   THEN u.xp >= 300 AND u.xp < 800
		    ELSE u.xp < 300
		  END
		ORDER BY week_xp DESC, u.streak DESC, u.xp DESC
		LIMIT 50
	`

	rows, err := r.db.Pool.Query(ctx, query, string(division))
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	allEntries := make([]domain.LeaderboardEntry, 0)
	var userRankItem *domain.LeaderboardEntry

	rank := 1
	for rows.Next() {
		var e domain.LeaderboardEntry
		var totalXP int
		if err := rows.Scan(
			&e.UserID,
			&e.Name,
			&e.Username,
			&e.AvatarURL,
			&totalXP,
			&e.CurrentLevel,
			&e.Streak,
			&e.WeeklyXP,
		); err != nil {
			continue
		}

		e.Rank = rank
		e.Division = division
		e.IsCurrentUser = (userID != "" && e.UserID == userID)

		if rank <= 3 {
			e.Zone = "promotion"
		} else if rank > 10 {
			e.Zone = "demotion"
		} else {
			e.Zone = "safe"
		}

		if e.IsCurrentUser {
			copied := e
			userRankItem = &copied
		}

		allEntries = append(allEntries, e)
		rank++
	}

	// If current user is authenticated but not in the requested division, fetch their current division status
	if userID != "" && userRankItem == nil {
		var u domain.User
		var weeklyXP int
		err := r.db.Pool.QueryRow(ctx, `
			SELECT u.id, u.name, u.username, u.avatar_url, u.xp, u.current_level, u.streak,
			       COALESCE((
			           SELECT SUM(xp_earned) 
			           FROM user_activity_logs 
			           WHERE user_id = u.id AND created_at >= NOW() - INTERVAL '7 days'
			       ), u.xp) as week_xp
			FROM users u
			WHERE u.id = $1
		`, userID).Scan(
			&u.ID, &u.Name, &u.Username, &u.AvatarURL, &u.XP, &u.CurrentLevel, &u.Streak, &weeklyXP,
		)
		if err == nil {
			var userDiv domain.TokyoDivision
			if u.XP >= 1500 {
				userDiv = domain.DivisionRoppongi
			} else if u.XP >= 800 {
				userDiv = domain.DivisionAkihabara
			} else if u.XP >= 300 {
				userDiv = domain.DivisionShibuya
			} else {
				userDiv = domain.DivisionShinjuku
			}

			// If the user's division matches the requested division, assign their rank
			if userDiv == division {
				userRankItem = &domain.LeaderboardEntry{
					Rank:          len(allEntries) + 1,
					UserID:        u.ID,
					Username:      u.Username,
					Name:          u.Name,
					AvatarURL:     u.AvatarURL,
					WeeklyXP:      weeklyXP,
					Streak:        u.Streak,
					CurrentLevel:  u.CurrentLevel,
					Division:      division,
					IsCurrentUser: true,
					Zone:          "safe",
				}
			}
		}
	}

	return &domain.WeeklyLeaderboardResponse{
		Division:         division,
		DivisionName:     divisionName,
		DivisionTier:     divisionTier,
		SeasonWeek:       seasonWeek,
		DaysRemaining:    daysUntilSunday,
		UserRank:         userRankItem,
		Entries:          allEntries,
		TotalCompetitors: len(allEntries),
	}, nil
}
