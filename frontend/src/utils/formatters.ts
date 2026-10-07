import type { TargetTimeline, LanguageLevel } from '../types/onboarding'

interface FormatTechStackOptions {
  withEmoji?: boolean
}

/**
 * Unified formatter for technology stack slugs into human-readable titles.
 * Supports both clean label mode (for boarding pass) and emoji-accented mode (for dashboard).
 */
export const formatTechStack = (
  slug?: string | null,
  options: FormatTechStackOptions = {}
): string => {
  const { withEmoji = false } = options

  switch (slug) {
    case 'golang':
      return withEmoji ? '🐹 Go (Gin Framework)' : 'Go (Gin Framework)'
    case 'java':
      return withEmoji ? '☕ Java (Spring Boot)' : 'Java (Spring Boot)'
    case 'node':
    case 'nodejs':
      return withEmoji ? '🟩 Node.js (Express)' : 'Node.js (Express)'
    case 'react':
    case 'react-ts':
      return withEmoji ? '⚛️ React' : 'React'
    case 'vue':
      return withEmoji ? '🟢 Vue.js' : 'Vue.js'
    case 'svelte':
      return withEmoji ? '🧡 Svelte' : 'Svelte'
    case 'react_golang':
    case 'react-golang':
      return withEmoji ? '⚛️🐹 React + Go + AWS' : 'React + Go (Gin) + AWS'
    case 'react_node':
      return withEmoji ? '⚛️🟩 React + Node + AWS' : 'React + Node (Express) + AWS'
    case 'devops_aws':
    case 'devops_cloud':
    case 'docker-k8s-aws':
      return withEmoji ? '☁️ AWS Cloud Native' : 'AWS Cloud Native'
    case 'devops_gcp':
      return withEmoji ? '☁️ GCP Cloud Native' : 'GCP Cloud Native'
    case 'devops_terraform':
      return withEmoji ? '🟣 Terraform & GitOps' : 'Terraform & GitOps'
    default:
      if (!slug) return withEmoji ? '🐹 Go (Gin Framework)' : 'Go (Gin Framework)'
      const cleaned = slug.replace(/_/g, ' ')
      return withEmoji ? cleaned.toUpperCase() : cleaned
  }
}

/**
 * Formats user coding experience level for dashboard metrics with emoji badge.
 */
export const formatExperienceLevel = (level?: string | null): string => {
  if (level === 'intermediate') {
    return '🚀 Berpengalaman (2+ thn)'
  }
  return '🌱 Pemula (< 1-2 thn)'
}

/**
 * Formats user coding experience level for ticket summary and profiles.
 */
export const formatExperienceLevelText = (level?: string | null): string => {
  if (level === 'intermediate') {
    return 'Sudah Berpengalaman'
  }
  return 'Mulai dari Dasar'
}

/**
 * Formats target timeline value into readable label.
 */
export const formatTimeline = (timeline?: TargetTimeline | string | null): string => {
  switch (timeline) {
    case '6_months':
      return '6 Bulan (Sprint)'
    case '1_year':
      return '1 Tahun (Ideal)'
    default:
      return 'Eksplorasi Mandiri'
  }
}

/**
 * Formats Japanese/target language level into official credential description.
 */
export const formatLanguageLevel = (level?: LanguageLevel | string | null): string => {
  switch (level) {
    case 'none':
      return 'Belum Ada (Nol)'
    case 'basic':
      return 'Dasar (N5/N4)'
    case 'conversational':
      return 'Percakapan (N3)'
    case 'fluent':
      return 'Mahir & Bisnis (N2/N1)'
    default:
      return 'Dasar (N5/N4)'
  }
}

/**
 * Cleans and formats tech stack badge tags with safe fallback.
 */
export const formatStackBadge = (badge?: string, isActive?: boolean): string => {
  if (!badge) return isActive ? 'Tersedia' : 'Coming Soon'
  const cleaned = badge
    .replace(/\s*\(Rakuten\)/gi, '')
    .replace(/^[\?\s\uFFFD]+/, '')
    .trim()
  return cleaned || (isActive ? 'Tersedia' : 'Coming Soon')
}
