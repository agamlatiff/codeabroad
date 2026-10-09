import { api } from './api'
import type { ApiResponse } from '../types/auth'
import type { Roadmap } from '../types/roadmap'

export const roadmapService = {
  // Fetch active user roadmap based on their selected career track and progress
  async getActiveRoadmap(): Promise<Roadmap> {
    const response = await api.get<ApiResponse<Roadmap>>('/roadmaps/active')
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    throw new Error(response.data.error || 'Failed to fetch active roadmap')
  },

  // Fetch specific career track roadmap (e.g. 'golang', 'devops_aws', 'react')
  async getTrackRoadmap(trackSlug: string): Promise<Roadmap> {
    const response = await api.get<ApiResponse<Roadmap>>(`/roadmaps/${trackSlug}`)
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    throw new Error(response.data.error || `Failed to fetch roadmap for track ${trackSlug}`)
  },
}
