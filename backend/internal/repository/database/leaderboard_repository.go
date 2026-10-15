package database

import (
	"codeabroad/backend/internal/domain"
	"codeabroad/backend/internal/infrastructure/postgres"
	"context"
	"sort"
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

// GetWeeklyLeaderboard computes the standings for the specified division
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

	// 1. Fetch current user from database if authenticated
	var currentCandidate *domain.LeaderboardEntry
	if userID != "" {
		var u domain.User
		var weeklyXP int
		err := r.db.Pool.QueryRow(ctx, `
			SELECT u.id, u.name, u.username, u.avatar_url, u.xp, u.current_level, u.streak,
			       COALESCE((SELECT SUM(xp_earned) FROM user_activity_logs WHERE user_id = u.id AND created_at >= NOW() - INTERVAL '7 days'), u.xp) as week_xp
			FROM users u
			WHERE u.id = $1
		`, userID).Scan(
			&u.ID, &u.Name, &u.Username, &u.AvatarURL, &u.XP, &u.CurrentLevel, &u.Streak, &weeklyXP,
		)
		if err == nil {
			if weeklyXP == 0 && u.XP > 0 {
				weeklyXP = u.XP
			}
			currentCandidate = &domain.LeaderboardEntry{
				UserID:        u.ID,
				Username:      u.Username,
				Name:          u.Name,
				AvatarURL:     u.AvatarURL,
				WeeklyXP:      weeklyXP,
				Streak:        u.Streak,
				CurrentLevel:  u.CurrentLevel,
				Division:      division,
				IsCurrentUser: true,
			}
		}
	}

	// 2. Fetch other active users from database (if available)
	var dbEntries []domain.LeaderboardEntry
	rows, err := r.db.Pool.Query(ctx, `
		SELECT u.id, u.name, u.username, u.avatar_url, u.xp, u.current_level, u.streak,
		       COALESCE((SELECT SUM(xp_earned) FROM user_activity_logs WHERE user_id = u.id AND created_at >= NOW() - INTERVAL '7 days'), u.xp) as week_xp
		FROM users u
		WHERE ($1 = '' OR u.id != $1)
		ORDER BY week_xp DESC
		LIMIT 10
	`, userID)
	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var e domain.LeaderboardEntry
			if err := rows.Scan(&e.UserID, &e.Name, &e.Username, &e.AvatarURL, &e.WeeklyXP, &e.CurrentLevel, &e.Streak, &e.WeeklyXP); err == nil {
				e.Division = division
				e.IsCurrentUser = false
				dbEntries = append(dbEntries, e)
			}
		}
	}

	// 3. Duolingo League Division Peer Cohort (Tokyo Tech Aspirants & Engineers)
	peers := getDivisionPeers(division)
	allEntries := append(dbEntries, peers...)

	// Include current user in the cohort
	if currentCandidate != nil {
		allEntries = append(allEntries, *currentCandidate)
	} else {
		// Mock guest user if not logged in
		guestEntry := domain.LeaderboardEntry{
			UserID:        "guest-user",
			Username:      "you",
			Name:          "Anda (Kandidat)",
			WeeklyXP:      getDivisionDefaultXP(division),
			Streak:        3,
			CurrentLevel:  2,
			Division:      division,
			IsCurrentUser: true,
		}
		allEntries = append(allEntries, guestEntry)
	}

	// 4. Sort descending by WeeklyXP
	sort.Slice(allEntries, func(i, j int) bool {
		if allEntries[i].WeeklyXP == allEntries[j].WeeklyXP {
			return allEntries[i].Streak > allEntries[j].Streak
		}
		return allEntries[i].WeeklyXP > allEntries[j].WeeklyXP
	})

	// 5. Assign Rank and Promotion / Demotion Zones
	var userRankItem *domain.LeaderboardEntry
	for i := range allEntries {
		rank := i + 1
		allEntries[i].Rank = rank

		if rank <= 3 {
			allEntries[i].Zone = "promotion"
		} else if rank > 10 {
			allEntries[i].Zone = "demotion"
		} else {
			allEntries[i].Zone = "safe"
		}

		if allEntries[i].IsCurrentUser {
			userRankItem = &allEntries[i]
		}
	}

	// Limit to top 15 entries for crisp UI
	if len(allEntries) > 15 {
		allEntries = allEntries[:15]
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

func getDivisionDefaultXP(division domain.TokyoDivision) int {
	switch division {
	case domain.DivisionShinjuku:
		return 160
	case domain.DivisionShibuya:
		return 520
	case domain.DivisionAkihabara:
		return 940
	case domain.DivisionRoppongi:
		return 1850
	default:
		return 200
	}
}

func getDivisionPeers(division domain.TokyoDivision) []domain.LeaderboardEntry {
	switch division {
	case domain.DivisionShinjuku:
		return []domain.LeaderboardEntry{
			{UserID: "p1", Username: "kenji_dev", Name: "Kenji Sato", WeeklyXP: 310, Streak: 6, CurrentLevel: 3, Division: division},
			{UserID: "p2", Username: "maya_putri", Name: "Maya Putri", WeeklyXP: 280, Streak: 5, CurrentLevel: 2, Division: division},
			{UserID: "p3", Username: "haruto_k", Name: "Haruto Kato", WeeklyXP: 240, Streak: 4, CurrentLevel: 2, Division: division},
			{UserID: "p4", Username: "daiki_tech", Name: "Daiki Tanaka", WeeklyXP: 190, Streak: 3, CurrentLevel: 2, Division: division},
			{UserID: "p5", Username: "budi_tokyo", Name: "Budi Santoso", WeeklyXP: 150, Streak: 3, CurrentLevel: 2, Division: division},
			{UserID: "p6", Username: "yuki_cloud", Name: "Yuki Suzuki", WeeklyXP: 120, Streak: 2, CurrentLevel: 1, Division: division},
			{UserID: "p7", Username: "tariq_id", Name: "Tariq Ramadhan", WeeklyXP: 95, Streak: 2, CurrentLevel: 1, Division: division},
			{UserID: "p8", Username: "aoi_m", Name: "Aoi Mori", WeeklyXP: 80, Streak: 1, CurrentLevel: 1, Division: division},
			{UserID: "p9", Username: "ren_code", Name: "Ren Takahashi", WeeklyXP: 60, Streak: 1, CurrentLevel: 1, Division: division},
			{UserID: "p10", Username: "nadia_fe", Name: "Nadia Kusuma", WeeklyXP: 45, Streak: 1, CurrentLevel: 1, Division: division},
		}
	case domain.DivisionShibuya:
		return []domain.LeaderboardEntry{
			{UserID: "p11", Username: "sakura_go", Name: "Sakura Ito", WeeklyXP: 780, Streak: 14, CurrentLevel: 5, Division: division},
			{UserID: "p12", Username: "agus_backend", Name: "Agus Prasetyo", WeeklyXP: 720, Streak: 11, CurrentLevel: 5, Division: division},
			{UserID: "p13", Username: "kenta_shibuya", Name: "Kenta Yamamoto", WeeklyXP: 650, Streak: 9, CurrentLevel: 4, Division: division},
			{UserID: "p14", Username: "diana_ts", Name: "Diana Wijaya", WeeklyXP: 590, Streak: 8, CurrentLevel: 4, Division: division},
			{UserID: "p15", Username: "souta_dev", Name: "Souta Hayashi", WeeklyXP: 480, Streak: 7, CurrentLevel: 4, Division: division},
			{UserID: "p16", Username: "fajar_cloud", Name: "Fajar Nugraha", WeeklyXP: 420, Streak: 6, CurrentLevel: 3, Division: division},
			{UserID: "p17", Username: "mio_infra", Name: "Mio Kobayashi", WeeklyXP: 380, Streak: 5, CurrentLevel: 3, Division: division},
			{UserID: "p18", Username: "hendra_go", Name: "Hendra Gunawan", WeeklyXP: 340, Streak: 4, CurrentLevel: 3, Division: division},
		}
	case domain.DivisionAkihabara:
		return []domain.LeaderboardEntry{
			{UserID: "p21", Username: "ryo_akiba", Name: "Ryo Yoshida", WeeklyXP: 1480, Streak: 28, CurrentLevel: 8, Division: division},
			{UserID: "p22", Username: "kevin_arch", Name: "Kevin Pratama", WeeklyXP: 1390, Streak: 22, CurrentLevel: 8, Division: division},
			{UserID: "p23", Username: "hinata_systems", Name: "Hinata Sasaki", WeeklyXP: 1250, Streak: 19, CurrentLevel: 7, Division: division},
			{UserID: "p24", Username: "rizky_devops", Name: "Rizky Siregar", WeeklyXP: 1100, Streak: 16, CurrentLevel: 7, Division: division},
			{UserID: "p25", Username: "taichi_k", Name: "Taichi Kondo", WeeklyXP: 980, Streak: 14, CurrentLevel: 6, Division: division},
			{UserID: "p26", Username: "ayu_gin", Name: "Ayu Lestari", WeeklyXP: 870, Streak: 12, CurrentLevel: 6, Division: division},
		}
	case domain.DivisionRoppongi:
		return []domain.LeaderboardEntry{
			{UserID: "p31", Username: "takashi_roppongi", Name: "Takashi Nakamura", WeeklyXP: 3450, Streak: 65, CurrentLevel: 12, Division: division},
			{UserID: "p32", Username: "satria_tokyo_lead", Name: "Satria Dewa", WeeklyXP: 2980, Streak: 52, CurrentLevel: 11, Division: division},
			{UserID: "p33", Username: "kazuki_mercari", Name: "Kazuki Inoue", WeeklyXP: 2600, Streak: 48, CurrentLevel: 10, Division: division},
			{UserID: "p34", Username: "claudia_rakuten", Name: "Claudia Salim", WeeklyXP: 2200, Streak: 35, CurrentLevel: 10, Division: division},
			{UserID: "p35", Username: "shin_line", Name: "Shinichi Ono", WeeklyXP: 1900, Streak: 30, CurrentLevel: 9, Division: division},
		}
	default:
		return nil
	}
}
