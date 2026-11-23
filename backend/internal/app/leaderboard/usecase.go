package leaderboard

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"strings"
	"time"

	infraRedis "merantalk/backend/infrastructure/redis"
	"merantalk/backend/internal/shared/apperror"
	"merantalk/backend/internal/shared/progression"
	"golang.org/x/sync/singleflight"
)

const leaderboardCacheTTL = 30 * time.Second

type cachedDivisionStandings struct {
	Entries          []LeaderboardEntry `json:"entries"`
	TotalCompetitors int                `json:"total_competitors"`
}

type usecase struct {
	leaderboardRepo Repository
	helper          *Helper
	rdb             *infraRedis.RedisClient
	sfGroup         singleflight.Group
}

// NewUsecase creates a new Leaderboard Usecase instance
func NewUsecase(leaderboardRepo Repository) Usecase {
	return NewUsecaseWithCache(leaderboardRepo, nil)
}

// NewUsecaseWithCache creates a Leaderboard Usecase with optional Redis short-TTL caching.
func NewUsecaseWithCache(leaderboardRepo Repository, rdb *infraRedis.RedisClient) Usecase {
	return &usecase{
		leaderboardRepo: leaderboardRepo,
		helper:          NewHelper(),
		rdb:             rdb,
	}
}

func (u *usecase) loadDivisionStandings(ctx context.Context, cfg DivisionConfig, seasonWeek int) ([]LeaderboardEntry, int, error) {
	cacheKey := fmt.Sprintf("leaderboard:weekly:v1:%s:%d", cfg.Division, seasonWeek)
	if u.rdb != nil && u.rdb.Client != nil {
		if raw, err := u.rdb.Client.Get(ctx, cacheKey).Bytes(); err == nil && len(raw) > 0 {
			var cached cachedDivisionStandings
			if jsonErr := json.Unmarshal(raw, &cached); jsonErr == nil {
				return cached.Entries, cached.TotalCompetitors, nil
			}
		}
	}

	val, err, _ := u.sfGroup.Do(cacheKey, func() (any, error) {
		var (
			entries          []LeaderboardEntry
			totalCompetitors int
			qErr             error
		)
		if metaReader, ok := u.leaderboardRepo.(DivisionMetaReader); ok {
			entries, totalCompetitors, qErr = metaReader.GetDivisionStandingsWithTotal(ctx, cfg.MinXP, cfg.MaxXP, 50)
		} else {
			entries, qErr = u.leaderboardRepo.GetDivisionStandings(ctx, cfg.MinXP, cfg.MaxXP, 50)
			totalCompetitors = len(entries)
		}
		if qErr != nil {
			return nil, qErr
		}
		if entries == nil {
			entries = []LeaderboardEntry{}
		}
		if totalCompetitors < len(entries) {
			totalCompetitors = len(entries)
		}

		res := cachedDivisionStandings{
			Entries:          entries,
			TotalCompetitors: totalCompetitors,
		}
		if u.rdb != nil && u.rdb.Client != nil {
			if payload, mErr := json.Marshal(res); mErr == nil {
				if setErr := u.rdb.Client.Set(ctx, cacheKey, payload, leaderboardCacheTTL).Err(); setErr != nil {
					log.Printf("leaderboard: failed to write cache key %s: %v", cacheKey, setErr)
				}
			}
		}
		return res, nil
	})
	if err != nil {
		return nil, 0, err
	}
	res := val.(cachedDivisionStandings)
	copied := make([]LeaderboardEntry, len(res.Entries))
	copy(copied, res.Entries)
	return copied, res.TotalCompetitors, nil
}

// GetWeeklyLeaderboard orchestrates the weekly division standings and user rank
func (u *usecase) GetWeeklyLeaderboard(
	ctx context.Context,
	userID string,
	requestedDivision LeagueDivision,
) (*WeeklyLeaderboardResponse, error) {
	wibNow := time.Now().UTC().In(progression.WIBLocation)
	_, seasonWeek := wibNow.ISOWeek()
	daysRemaining := u.helper.CalculateDaysUntilSundayReset(wibNow)

	var preloadedStanding *LeaderboardEntry
	if strings.TrimSpace(string(requestedDivision)) == "" && userID != "" {
		if standing, err := u.leaderboardRepo.GetUserStanding(ctx, userID); err == nil && standing != nil {
			preloadedStanding = standing
			divisionXP := standing.TotalXP
			if divisionXP == 0 && standing.WeeklyXP > 0 {
				divisionXP = standing.WeeklyXP
			}
			requestedDivision = u.helper.DetermineDivision(divisionXP)
		}
	}

	cfg := u.helper.GetDivisionConfig(requestedDivision)
	resolvedDivision := cfg.Division

	entries, totalCompetitors, err := u.loadDivisionStandings(ctx, cfg, seasonWeek)
	if err != nil {
		return nil, fmt.Errorf("failed to query division standings: %w", err)
	}

	var userRankItem *LeaderboardEntry
	var userDivision LeagueDivision
	for i := range entries {
		rank := i + 1
		entries[i].Rank = rank
		entries[i].Division = resolvedDivision
		entries[i].Zone = u.helper.CalculateZone(rank)
		entries[i].IsCurrentUser = (userID != "" && entries[i].UserID == userID)

		if entries[i].IsCurrentUser {
			copied := entries[i]
			userRankItem = &copied
			userDivision = resolvedDivision
		}
		// Avoid exposing internal user UUIDs on public unauthenticated responses or non-self rows.
		if !entries[i].IsCurrentUser {
			entries[i].UserID = ""
		}
	}

	// If current user is authenticated but not in top 50 of requested division, resolve their standing & actual division
	if userID != "" && userRankItem == nil {
		standing := preloadedStanding
		if standing == nil {
			if fetched, sErr := u.leaderboardRepo.GetUserStanding(ctx, userID); sErr == nil {
				standing = fetched
			}
		}
		if standing != nil {
			divisionXP := standing.TotalXP
			if divisionXP == 0 && standing.WeeklyXP > 0 {
				divisionXP = standing.WeeklyXP
			}
			userDiv := u.helper.DetermineDivision(divisionXP)
			userDivision = userDiv
			if userDiv == resolvedDivision {
				standingCopy := *standing
				if standingCopy.Rank <= 0 {
					standingCopy.Rank = len(entries) + 1
				}
				standingCopy.Division = resolvedDivision
				standingCopy.IsCurrentUser = true
				standingCopy.Zone = u.helper.CalculateZone(standingCopy.Rank)
				userRankItem = &standingCopy
			}
		}
	}

	var lastWeekReward *PendingWeeklyReward
	if userID != "" {
		if rewardReader, ok := u.leaderboardRepo.(WeeklyRewardRepository); ok {
			prevYear, prevWeek := u.helper.PreviousSeasonISOWeek(wibNow)
			if status, rErr := rewardReader.GetPreviousWeekRewardStatus(ctx, userID, prevYear, prevWeek); rErr != nil {
				log.Printf("leaderboard: failed to check last week reward for user %s: %v", userID, rErr)
			} else if status != nil {
				divCfg := u.helper.GetDivisionConfig(status.Division)
				status.Division = divCfg.Division
				status.DivisionName = divCfg.Name
				lastWeekReward = status
			}
		}
	}

	return &WeeklyLeaderboardResponse{
		Division:         resolvedDivision,
		DivisionName:     cfg.Name,
		DivisionTier:     cfg.Tier,
		UserDivision:     userDivision,
		SeasonWeek:       seasonWeek,
		DaysRemaining:    daysRemaining,
		UserRank:         userRankItem,
		LastWeekReward:   lastWeekReward,
		Entries:          entries,
		TotalCompetitors: totalCompetitors,
	}, nil
}

// ClaimWeeklyReward settles and credits the authenticated user's previous-week Top-3 podium Gems prize once per week.
func (u *usecase) ClaimWeeklyReward(ctx context.Context, userID string) (*ClaimWeeklyRewardResponse, error) {
	if strings.TrimSpace(userID) == "" {
		return nil, apperror.ErrUnauthorized
	}
	rewardRepo, ok := u.leaderboardRepo.(WeeklyRewardRepository)
	if !ok {
		return nil, ErrNoPendingWeeklyReward
	}
	wibNow := time.Now().UTC().In(progression.WIBLocation)
	prevYear, prevWeek := u.helper.PreviousSeasonISOWeek(wibNow)
	res, err := rewardRepo.ClaimPreviousWeekRewardTx(ctx, userID, prevYear, prevWeek)
	if err != nil {
		return nil, err
	}
	divCfg := u.helper.GetDivisionConfig(res.Reward.Division)
	res.Reward.Division = divCfg.Division
	res.Reward.DivisionName = divCfg.Name
	return res, nil
}

