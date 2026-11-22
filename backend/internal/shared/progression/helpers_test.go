package progression

import (
	"testing"
	"time"
)

func TestEvaluateDailyStreakWithFreeze(t *testing.T) {
	now := time.Date(2026, 11, 22, 10, 0, 0, 0, WIBLocation)
	sameDayEarly := time.Date(2026, 11, 22, 1, 0, 0, 0, WIBLocation)
	yesterday := time.Date(2026, 11, 21, 22, 0, 0, 0, WIBLocation)
	missedOneDay := time.Date(2026, 11, 20, 15, 0, 0, 0, WIBLocation)
	missedTwoDays := time.Date(2026, 11, 19, 12, 0, 0, 0, WIBLocation)

	cases := []struct {
		name             string
		lastActiveAt     *time.Time
		currentStreak    int
		availableFreezes int
		wantStreak       int
		wantChanged      bool
		wantFreezesUsed  int
	}{
		{
			name:             "same day preserves existing streak",
			lastActiveAt:     &sameDayEarly,
			currentStreak:    4,
			availableFreezes: 2,
			wantStreak:       4,
			wantChanged:      false,
			wantFreezesUsed:  0,
		},
		{
			name:             "consecutive day increments streak without consuming freeze",
			lastActiveAt:     &yesterday,
			currentStreak:    4,
			availableFreezes: 2,
			wantStreak:       5,
			wantChanged:      true,
			wantFreezesUsed:  0,
		},
		{
			name:             "missed 1 day with 1 freeze preserves and increments streak",
			lastActiveAt:     &missedOneDay,
			currentStreak:    5,
			availableFreezes: 1,
			wantStreak:       6,
			wantChanged:      true,
			wantFreezesUsed:  1,
		},
		{
			name:             "missed 1 day without freeze resets streak to 1",
			lastActiveAt:     &missedOneDay,
			currentStreak:    5,
			availableFreezes: 0,
			wantStreak:       1,
			wantChanged:      true,
			wantFreezesUsed:  0,
		},
		{
			name:             "missed 2 days with only 1 freeze resets streak and consumes 0 freezes",
			lastActiveAt:     &missedTwoDays,
			currentStreak:    5,
			availableFreezes: 1,
			wantStreak:       1,
			wantChanged:      true,
			wantFreezesUsed:  0,
		},
		{
			name:             "missed 2 days with 2 freezes preserves and consumes 2 freezes",
			lastActiveAt:     &missedTwoDays,
			currentStreak:    5,
			availableFreezes: 2,
			wantStreak:       6,
			wantChanged:      true,
			wantFreezesUsed:  2,
		},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			gotStreak, gotChanged, gotUsed := EvaluateDailyStreakWithFreeze(
				tc.lastActiveAt, tc.currentStreak, tc.availableFreezes, now,
			)
			if gotStreak != tc.wantStreak || gotChanged != tc.wantChanged || gotUsed != tc.wantFreezesUsed {
				t.Fatalf(
					"got (%d, %v, %d), want (%d, %v, %d)",
					gotStreak, gotChanged, gotUsed,
					tc.wantStreak, tc.wantChanged, tc.wantFreezesUsed,
				)
			}
		})
	}
}
