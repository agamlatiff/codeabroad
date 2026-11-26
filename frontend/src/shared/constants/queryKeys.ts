/**
 * Centralized TanStack Query key registry so cache invalidation stays consistent across features.
 */

export const PROFILE_QUERY_KEY = ['profile'] as const
export const ACTIVITY_LOGS_QUERY_KEY = ['activity-logs'] as const
export const DAILY_REWARDS_QUERY_KEY = ['daily-rewards'] as const
export const DAILY_QUESTS_QUERY_KEY = ['daily-quests'] as const
export const LANGUAGES_QUERY_KEY = ['languages'] as const
export const LANGUAGE_ENROLLMENTS_QUERY_KEY = ['language-enrollments'] as const
export const SRS_DUE_QUERY_KEY = ['srs-due'] as const
export const DAILY_VOCABULARIES_QUERY_KEY = ['daily-vocabularies'] as const
export const LEADERBOARD_QUERY_KEY = ['leaderboard'] as const

export const LOGOUT_MUTATION_KEY = ['auth', 'logout'] as const
export const SWITCH_LANGUAGE_MUTATION_KEY = ['languages', 'switch'] as const

export const getProfileQueryKey = (userId?: string | null) =>
  [...PROFILE_QUERY_KEY, userId ?? 'anonymous'] as const

export const getActivityLogsQueryKey = (userId?: string | null) =>
  [...ACTIVITY_LOGS_QUERY_KEY, userId ?? 'anonymous'] as const

export const getDailyRewardsQueryKey = (userId?: string | null) =>
  [...DAILY_REWARDS_QUERY_KEY, userId ?? 'anonymous'] as const

export const getDailyQuestsQueryKey = (userId?: string | null) =>
  [...DAILY_QUESTS_QUERY_KEY, userId ?? 'anonymous'] as const

export const getLanguageEnrollmentsQueryKey = (userId?: string | null) =>
  [...LANGUAGE_ENROLLMENTS_QUERY_KEY, userId ?? 'anonymous'] as const

export const getSrsDueQueryKey = (userId?: string | null, limit?: number) =>
  limit === undefined
    ? ([...SRS_DUE_QUERY_KEY, userId ?? 'anonymous'] as const)
    : ([...SRS_DUE_QUERY_KEY, userId ?? 'anonymous', limit] as const)

export const getDailyVocabulariesQueryKey = (
  userId?: string | null,
  langKey?: string | null
) => [...DAILY_VOCABULARIES_QUERY_KEY, userId ?? 'anonymous', langKey ?? 'active'] as const
