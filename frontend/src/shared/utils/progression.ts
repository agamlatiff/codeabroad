export const XP_PER_LEVEL = 100

export interface XpLevelProgress {
  totalXp: number
  level: number
  xpInLevel: number
  xpForNextLevel: number
  xpRemaining: number
  progressPercent: number
}

/** Computes XP level progress matching backend's 100 XP per level rule. */
export function computeXpLevelProgress(totalXp: number, currentLevel?: number): XpLevelProgress {
  const safeXp = Math.max(0, Math.floor(totalXp || 0))
  const computedLevel = Math.floor(safeXp / XP_PER_LEVEL) + 1
  const level = typeof currentLevel === 'number' && currentLevel >= 1 ? currentLevel : computedLevel
  const xpInLevel = safeXp % XP_PER_LEVEL
  const xpRemaining = XP_PER_LEVEL - xpInLevel
  const progressPercent = Math.min(100, Math.round((xpInLevel / XP_PER_LEVEL) * 100))

  return {
    totalXp: safeXp,
    level,
    xpInLevel,
    xpForNextLevel: XP_PER_LEVEL,
    xpRemaining,
    progressPercent,
  }
}
