/**
 * Standard API envelope types matching backend Go responses (response.go).
 */

export interface ApiSuccessResponse<T> {
  success: true
  message?: string
  data: T
  error?: never
  code?: never
  details?: never
}

export interface ApiErrorResponse {
  success: false
  error: string
  code: string
  details?: Record<string, unknown>
  data?: never
  message?: never
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

