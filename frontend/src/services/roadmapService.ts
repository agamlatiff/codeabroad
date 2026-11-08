import { api, unwrapApiResponse, type RequestOptions } from './api'
import type { ApiResponse } from '../types/api'
import type { Roadmap } from '../types/roadmap'

/**
 * Service managing learning curriculum and Tokyo tech roadmap queries.
 * Directly corresponds to backend Roadmap Service (`/api/v1/roadmaps/*`).
 */
export const roadmapService = {
  /**
   * Fetches the active personalized roadmap based on the user's selected track.
   */
  async getActiveRoadmap(options?: RequestOptions): Promise<Roadmap> {
    const response = await api.get<ApiResponse<Roadmap>>('/roadmaps/active', {
      signal: options?.signal,
    })
    return unwrapApiResponse(response, 'Gagal memuat kurikulum aktif.')
  },

  /**
   * Fetches a specific career track roadmap (e.g. 'golang', 'react', 'fullstack').
   */
  async getTrackRoadmap(trackSlug: string, options?: RequestOptions): Promise<Roadmap> {
    const sanitizedSlug = encodeURIComponent(trackSlug.trim())
    const response = await api.get<ApiResponse<Roadmap>>(`/roadmaps/${sanitizedSlug}`, {
      signal: options?.signal,
    })
    return unwrapApiResponse(response, `Gagal memuat kurikulum untuk track ${trackSlug}.`)
  },
}
