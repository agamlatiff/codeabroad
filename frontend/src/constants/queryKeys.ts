/**
 * Shared TanStack Query keys.
 * Single source of truth so hooks never import query keys from other hooks.
 */
export const PROFILE_QUERY_KEY = ['profile'] as const
export const CAREER_PATHS_QUERY_KEY = ['career-paths'] as const
export const ACTIVITY_LOGS_QUERY_KEY = ['activity-logs'] as const
export const DAILY_REWARDS_QUERY_KEY = ['daily-rewards'] as const
