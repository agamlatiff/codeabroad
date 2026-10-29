package roadmap

import (
	"codeabroad/backend/internal/domain"
)

// Helper encapsulates roadmap calculation and gating progression rules
type Helper struct{}

// NewHelper creates a new roadmap helper instance
func NewHelper() *Helper {
	return &Helper{}
}

// ApplyProgressionRules calculates quest/chapter/module completion and applies Duolingo progression rules
func (h *Helper) ApplyProgressionRules(rm *domain.RoadmapResponse) {
	if rm == nil || len(rm.Modules) == 0 {
		return
	}

	for mIdx := range rm.Modules {
		mod := &rm.Modules[mIdx]
		h.calculateModuleProgress(mod)

		// Duolingo gating rule: Module 1 is unlocked by default;
		// subsequent modules unlock if previous module progress >= 80% or is completed.
		if mIdx == 0 {
			mod.IsUnlocked = true
		} else {
			prevMod := rm.Modules[mIdx-1]
			mod.IsUnlocked = prevMod.ProgressRate >= 80.0 || prevMod.IsCompleted
		}
	}
}

// calculateModuleProgress evaluates all chapters and calculates module progress percentage
func (h *Helper) calculateModuleProgress(mod *domain.ModuleResponse) {
	var totalQuests int
	var completedQuests int

	for cIdx := range mod.Chapters {
		chap := &mod.Chapters[cIdx]
		h.evaluateChapterCompletion(chap)

		totalQuests += len(chap.Quests)
		for _, q := range chap.Quests {
			if q.Status == "completed" {
				completedQuests++
			}
		}
	}

	if totalQuests > 0 {
		mod.ProgressRate = float64(completedQuests) / float64(totalQuests) * 100.0
		mod.IsCompleted = completedQuests == totalQuests
	} else {
		mod.ProgressRate = 0.0
		mod.IsCompleted = false
	}
}

// evaluateChapterCompletion calculates completion status for a chapter
func (h *Helper) evaluateChapterCompletion(chap *domain.ChapterResponse) {
	var completedCount int
	for _, q := range chap.Quests {
		if q.Status == "completed" {
			completedCount++
		}
	}
	chap.IsCompleted = len(chap.Quests) > 0 && completedCount == len(chap.Quests)
	chap.IsUnlocked = true // Chapters within an unlocked module are accessible
}
