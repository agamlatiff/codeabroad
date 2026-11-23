import type {
  Language,
  CareerTrackOption,
  UserLanguageEnrollment,
} from "@/features/curriculum/types/curriculum"
import { getLanguageCatalogMeta } from "@/shared/constants/languageCatalog"

/**
 * Maps active catalog languages into selectable preview options for unauthenticated guests.
 */
export const mapGuestLanguagesToTrackOptions = (
  catalogLanguages: Language[] = [],
  activeTrack = ''
): CareerTrackOption[] => {
  const activeLanguages = catalogLanguages.filter((lang) => lang.is_active)
  const normalizedTrack = activeTrack.trim().toLowerCase()

  return activeLanguages.map((lang, index) => {
    const meta = getLanguageCatalogMeta(lang.code, lang.name)
    const isSelected = normalizedTrack
      ? lang.id.toLowerCase() === normalizedTrack ||
        lang.code.toLowerCase() === normalizedTrack
      : index === 0

    return {
      id: lang.id,
      slug: lang.id,
      languageCode: lang.code,
      title: `Bahasa ${lang.name}`,
      shortTitle: meta.shortName,
      subtitle: `Mode Coba • ${meta.examShort}`,
      category: 'language',
      badgeLabel: 'Coba',
      badgeVariant: isSelected ? 'active' : 'available',
      isActive: isSelected,
      isEnrolled: true,
      group: 'career',
    }
  })
}

/**
 * Maps user language enrollments and catalog languages into selectable track options
 * for AppTopBar and the Language Switcher Modal.
 */
export const mapEnrollmentsToTrackOptions = (
  enrollments: UserLanguageEnrollment[],
  catalogLanguages: Language[] = []
): CareerTrackOption[] => {
  const enrolledByLangId = new Map<string, UserLanguageEnrollment>()
  for (const enrollment of enrollments) {
    enrolledByLangId.set(enrollment.language_id, enrollment)
  }

  const options: CareerTrackOption[] = []

  for (const enrollment of enrollments) {
    const lang = enrollment.language
    const langCode = lang?.code || 'lang'
    const langName = lang?.name || 'Bahasa Asing'
    const levelLabel = enrollment.current_level
      ? `${enrollment.current_level.code}${enrollment.current_level.official_exam_name ? ` (${enrollment.current_level.official_exam_name})` : ''}`
      : 'Level Dasar'

    options.push({
      id: enrollment.language_id,
      slug: enrollment.language_id,
      languageCode: langCode,
      title: `${langName} • ${enrollment.current_level?.code || 'Kurikulum'}`,
      shortTitle: `${langName} ${enrollment.current_level?.code || ''}`.trim(),
      subtitle: `Level aktif: ${levelLabel}`,
      category: 'language',
      badgeLabel: enrollment.is_active ? 'Aktif' : 'Terdaftar',
      badgeVariant: enrollment.is_active ? 'active' : 'available',
      isActive: enrollment.is_active,
      isEnrolled: true,
      group: 'career',
    })
  }

  // Append catalog languages not yet enrolled as preview items (only if active in DB)
  for (const lang of catalogLanguages) {
    if (enrolledByLangId.has(lang.id) || !lang.is_active) continue
    options.push({
      id: lang.id,
      slug: lang.id,
      languageCode: lang.code,
      title: lang.name,
      shortTitle: lang.name,
      subtitle: `Kurikulum Bahasa ${lang.name}`,
      category: 'language',
      badgeLabel: 'Belum Terdaftar',
      badgeVariant: 'available',
      isActive: false,
      isEnrolled: false,
      group: 'foundation',
    })
  }

  return options
}



