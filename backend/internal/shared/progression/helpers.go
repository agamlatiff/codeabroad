package progression

import (
	"context"
	"errors"
	"log"
	"time"

	"github.com/jackc/pgx/v5"
)

// WIBLocation represents Asia/Jakarta (UTC+7), the canonical daily/weekly boundary timezone.
var WIBLocation = time.FixedZone("WIB", 7*60*60)

// TodayWIBDateKey formats the given instant's calendar date in WIB (YYYY-MM-DD).
func TodayWIBDateKey(now time.Time) string {
	return now.In(WIBLocation).Format("2006-01-02")
}

// WIBDayBounds returns the UTC-equivalent [startOfDay, startOfNextDay) bounds for the WIB day of now.
func WIBDayBounds(now time.Time) (time.Time, time.Time) {
	wibNow := now.In(WIBLocation)
	start := time.Date(wibNow.Year(), wibNow.Month(), wibNow.Day(), 0, 0, 0, 0, WIBLocation)
	return start, start.AddDate(0, 0, 1)
}

// WIBWeekStart returns Monday 00:00:00 WIB for the ISO week containing now.
func WIBWeekStart(now time.Time) time.Time {
	wibNow := now.In(WIBLocation)
	weekday := int(wibNow.Weekday())
	// Sunday = 0 -> offset 6 days; Monday = 1 -> offset 0 days, etc.
	daysSinceMonday := (weekday + 6) % 7
	start := time.Date(wibNow.Year(), wibNow.Month(), wibNow.Day(), 0, 0, 0, 0, WIBLocation)
	return start.AddDate(0, 0, -daysSinceMonday)
}

// CalculateLevel maps cumulative XP to gamified level (100 XP per level, minimum 1).
func CalculateLevel(xp int) int {
	if xp < 0 {
		xp = 0
	}
	lvl := (xp / 100) + 1
	if lvl < 1 {
		return 1
	}
	return lvl
}

// EvaluateDailyStreak computes the next streak state given the previous active timestamp in WIB.
func EvaluateDailyStreak(lastActiveAt *time.Time, currentStreak int, now time.Time) (newStreak int, changed bool) {
	newStreak, changed, _ = EvaluateDailyStreakWithFreeze(lastActiveAt, currentStreak, 0, now)
	return newStreak, changed
}

// EvaluateDailyStreakWithFreeze computes the next streak state in WIB and consumes streak-freeze items
// when available to bridge missed days without breaking a positive streak.
func EvaluateDailyStreakWithFreeze(
	lastActiveAt *time.Time,
	currentStreak int,
	availableFreezes int,
	now time.Time,
) (newStreak int, changed bool, freezesUsed int) {
	if lastActiveAt == nil {
		if currentStreak < 1 {
			return 1, true, 0
		}
		return currentStreak, false, 0
	}

	wibNow := now.In(WIBLocation)
	wibLast := lastActiveAt.In(WIBLocation)

	// Normalize both WIB calendar dates to UTC midnight so day differences are exact integer 24h multiples.
	todayDate := time.Date(wibNow.Year(), wibNow.Month(), wibNow.Day(), 0, 0, 0, 0, time.UTC)
	lastDate := time.Date(wibLast.Year(), wibLast.Month(), wibLast.Day(), 0, 0, 0, 0, time.UTC)
	daysGap := int(todayDate.Sub(lastDate) / (24 * time.Hour))

	if daysGap <= 0 {
		if currentStreak < 1 {
			return 1, true, 0
		}
		return currentStreak, false, 0
	}

	if daysGap == 1 {
		if currentStreak < 0 {
			return 1, true, 0
		}
		return currentStreak + 1, true, 0
	}

	missedDays := daysGap - 1
	if currentStreak > 0 && availableFreezes >= missedDays {
		return currentStreak + 1, true, missedDays
	}

	return 1, currentStreak != 1, 0
}

// RollbackTx safely rolls back a transaction and logs unexpected rollback errors (ignoring ErrTxClosed).
func RollbackTx(ctx context.Context, tx pgx.Tx, label string) {
	if tx == nil {
		return
	}
	if err := tx.Rollback(ctx); err != nil && !errors.Is(err, pgx.ErrTxClosed) {
		log.Printf("%s: failed to rollback tx: %v", label, err)
	}
}
