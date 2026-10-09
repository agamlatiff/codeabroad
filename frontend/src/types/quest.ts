export interface NihongoNote {
  term: string
  reading: string
  meaning: string
  example?: string
}

export interface AcceptanceCriterion {
  id: string
  description: string
  passed: boolean
}

export interface StarterCode {
  filename: string
  language: string
  content: string
}

export interface TestCase {
  name: string
  expected: string
}

export interface TestSuite {
  runner: string
  test_cases?: TestCase[]
}

export interface QuestSummary {
  id: string
  chapter_id?: string
  station_number?: number
  chapter_number?: number
  title: string
  chip_label: string
  type: 'main' | 'side' | 'daily'
  difficulty: 'Mudah' | 'Menengah' | 'Sulit' | string
  xp_reward: number
  estimated_minutes: number
  order_index: number
  status: 'locked' | 'available' | 'completed'
}

export interface Quest {
  id: string
  title: string
  description?: string
  type: 'main' | 'side' | 'daily'
  career_path_id?: string
  country_id?: string
  difficulty: 'Mudah' | 'Menengah' | 'Sulit' | string
  xp_reward: number
  estimated_minutes: number
  resource_url?: string
  order_index: number
  prerequisites?: string[]
  is_active: boolean
  chapter_id?: string
  chip_label: string
  story_context?: string
  nihongo_notes?: NihongoNote
  acceptance_criteria?: AcceptanceCriterion[]
  starter_code?: StarterCode
  test_suite?: TestSuite
  user_status: 'locked' | 'available' | 'completed'
  user_tests_passed: number
  user_total_tests: number
  user_code_submission?: string
  created_at: string
  updated_at: string
}

export interface RunTestsRequest {
  code: string
  filename?: string
}

export interface RunTestsResponse {
  success: boolean
  tests_passed: number
  total_tests: number
  output: string
  duration_ms: number
  criteria_results: AcceptanceCriterion[]
}

export interface SubmitQuestRequest {
  code: string
}

export interface SubmitQuestResponse {
  quest_id: string
  xp_awarded: number
  gems_awarded: number
  current_xp: number
  current_level: number
  streak: number
  streak_extended: boolean
  readiness_increase: number
  current_readiness_score: number
  unlocked_vocab?: NihongoNote
  next_quest?: QuestSummary
}

export interface QuestFilter {
  career_path_id?: string
  chapter_id?: string
  type?: string
  status?: string
}
