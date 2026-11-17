import type { QueryClient } from '@tanstack/react-query'
import {
  CURRICULUM_QUERY_KEY,
  GRAMMAR_POINTS_QUERY_KEY,
  LESSON_DETAIL_QUERY_KEY,
} from '@/features/curriculum/services/curriculumService'
import {
  EXAM_QUESTIONS_QUERY_KEY,
  EXAM_RESULT_QUERY_KEY,
} from '@/features/exercise/services/exerciseService'
import {
  ACTIVITY_LOGS_QUERY_KEY,
  DAILY_QUESTS_QUERY_KEY,
  DAILY_REWARDS_QUERY_KEY,
  DAILY_VOCABULARIES_QUERY_KEY,
  LANGUAGE_ENROLLMENTS_QUERY_KEY,
  PROFILE_QUERY_KEY,
  SRS_DUE_QUERY_KEY,
} from '@/shared/constants/queryKeys'

export interface InvalidateLearningCachesOptions {
  includeLessonDetail?: boolean
  includeSrs?: boolean
  includeVocab?: boolean
  includeCurriculum?: boolean
  includeExamRetry?: boolean
}

/**
 * Shared TanStack Query cache invalidation helper for exercise/exam/SRS completions.
 */
export const invalidateLearningSessionCaches = async (
  queryClient: QueryClient,
  options: InvalidateLearningCachesOptions = {}
): Promise<void> => {
  const tasks: Promise<unknown>[] = [
    queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY }),
    queryClient.invalidateQueries({ queryKey: ACTIVITY_LOGS_QUERY_KEY }),
    queryClient.invalidateQueries({ queryKey: DAILY_QUESTS_QUERY_KEY }),
    queryClient.invalidateQueries({ queryKey: DAILY_REWARDS_QUERY_KEY }),
  ]

  if (options.includeCurriculum) {
    tasks.push(
      queryClient.invalidateQueries({ queryKey: CURRICULUM_QUERY_KEY }),
      queryClient.invalidateQueries({ queryKey: LANGUAGE_ENROLLMENTS_QUERY_KEY }),
      queryClient.invalidateQueries({ queryKey: GRAMMAR_POINTS_QUERY_KEY })
    )
  }
  if (options.includeLessonDetail) {
    tasks.push(queryClient.invalidateQueries({ queryKey: LESSON_DETAIL_QUERY_KEY }))
  }
  if (options.includeSrs) {
    tasks.push(queryClient.invalidateQueries({ queryKey: SRS_DUE_QUERY_KEY }))
  }
  if (options.includeVocab) {
    tasks.push(queryClient.invalidateQueries({ queryKey: DAILY_VOCABULARIES_QUERY_KEY }))
  }
  if (options.includeExamRetry) {
    tasks.push(
      queryClient.invalidateQueries({ queryKey: EXAM_QUESTIONS_QUERY_KEY }),
      queryClient.invalidateQueries({ queryKey: EXAM_RESULT_QUERY_KEY })
    )
  }

  await Promise.all(tasks)
}
