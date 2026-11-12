package user

import (
	"codeabroad/backend/internal/domain"
	"fmt"
	"time"
)

// Helper encapsulates user profile validation, level progression, streak evaluation, and 7-day calendar assembly (DDD)
type Helper struct{}

// NewHelper creates a new User Helper instance
func NewHelper() *Helper {
	return &Helper{}
}

// ValidateRoadmapView ensures preferred_roadmap_view is either "map" or "syllabus"
func (h *Helper) ValidateRoadmapView(view *string) error {
	if view == nil {
		return nil
	}
	v := *view
	if v != "map" && v != "syllabus" {
		return domain.NewBadRequestError(
			"INVALID_ROADMAP_VIEW",
			"preferred_roadmap_view harus bernilai 'map' atau 'syllabus'",
			nil,
		)
	}
	return nil
}

// ResolveDailyRewardXP validates the daily reward type and returns the XP amount to award
func (h *Helper) ResolveDailyRewardXP(rewardType string) (int, error) {
	switch rewardType {
	case "lesson_milestone":
		return 30, nil
	case "golden_chest":
		return 50, nil
	default:
		return 0, fmt.Errorf("%w: tipe hadiah tidak valid", domain.ErrBadRequest)
	}
}

// CalculateLevel computes the user level from total XP according to CodeAbroad progression rules (100 XP per level)
func CalculateLevel(xp int) int {
	if xp < 0 {
		return 1
	}
	return (xp / 100) + 1
}

// CalculateLevel computes the user level from total XP on Helper receiver
func (h *Helper) CalculateLevel(xp int) int {
	return CalculateLevel(xp)
}

// EvaluateDailyStreak calculates the updated daily streak based on the last active timestamp
func (h *Helper) EvaluateDailyStreak(currentStreak int, lastActiveAt *time.Time, now time.Time) (newStreak int, changed bool) {
	todayStr := now.Format("2006-01-02")
	yesterdayStr := now.AddDate(0, 0, -1).Format("2006-01-02")

	newStreak = currentStreak
	if lastActiveAt == nil {
		newStreak = 1
	} else {
		lastDate := lastActiveAt.Format("2006-01-02")
		if lastDate == yesterdayStr {
			newStreak = currentStreak + 1
		} else if lastDate != todayStr {
			newStreak = 1
		} else if currentStreak == 0 {
			newStreak = 1
		}
	}

	return newStreak, newStreak != currentStreak
}

// ResolveCalendarWindow calculates UTC day boundaries and the 90-day lookback start date
func (h *Helper) ResolveCalendarWindow(now time.Time) (startOfToday time.Time, startOfTomorrow time.Time, calendarStart time.Time) {
	startOfToday = time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.UTC)
	startOfTomorrow = startOfToday.AddDate(0, 0, 1)

	weekday := int(now.Weekday())
	mondayOffset := (weekday + 6) % 7
	monday := startOfToday.AddDate(0, 0, -mondayOffset)

	calendarStart = startOfToday.AddDate(0, -3, 0)
	if monday.Before(calendarStart) {
		calendarStart = monday
	}
	return startOfToday, startOfTomorrow, calendarStart
}

// BuildWeeklyActivitySummary constructs the 7-day (Mon-Sun) consistency view and 90-day active calendar
func (h *Helper) BuildWeeklyActivitySummary(
	streak int,
	lastActiveAt *time.Time,
	dailyStats map[string]domain.DailyActivityStat,
	now time.Time,
) *domain.UserActivitySummaryResponse {
	todayStr := now.Format("2006-01-02")
	startOfToday := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.UTC)
	weekday := int(now.Weekday())
	mondayOffset := (weekday + 6) % 7
	monday := startOfToday.AddDate(0, 0, -mondayOffset)

	dayLabels := [7]string{"Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"}
	weeklyLogs := make([]domain.UserActivityLogItem, 7)
	totalActiveDays := 0

	allActiveDatesSet := make(map[string]bool, len(dailyStats)+streak+1)
	for dt := range dailyStats {
		allActiveDatesSet[dt] = true
	}

	for i := 0; i < 7; i++ {
		dayDate := monday.AddDate(0, 0, i)
		dateStr := dayDate.Format("2006-01-02")
		isToday := (i == mondayOffset)

		stat, hasLog := dailyStats[dateStr]
		isActive := hasLog

		if !isActive && streak > 0 {
			daysDiffFromToday := mondayOffset - i
			if daysDiffFromToday >= 0 && daysDiffFromToday < streak {
				isActive = true
			}
		}
		if isToday {
			isActive = true
		}
		if isActive {
			totalActiveDays++
		}

		weeklyLogs[i] = domain.UserActivityLogItem{
			Date:        dateStr,
			DayIndex:    i,
			DayLabel:    dayLabels[i],
			IsActive:    isActive,
			IsToday:     isToday,
			XPEarned:    stat.XPEarned,
			LessonsCount: stat.LessonsCount,
		}
	}

	if streak > 0 {
		for s := 0; s < streak; s++ {
			streakDate := startOfToday.AddDate(0, 0, -s).Format("2006-01-02")
			allActiveDatesSet[streakDate] = true
		}
	} else {
		allActiveDatesSet[todayStr] = true
	}

	activeDatesList := make([]string, 0, len(allActiveDatesSet))
	for dt := range allActiveDatesSet {
		activeDatesList = append(activeDatesList, dt)
	}

	return &domain.UserActivitySummaryResponse{
		CurrentStreak:   streak,
		TotalActiveDays: totalActiveDays,
		LastActiveAt:    lastActiveAt,
		WeeklyLogs:      weeklyLogs,
		ActiveDates:     activeDatesList,
	}
}
