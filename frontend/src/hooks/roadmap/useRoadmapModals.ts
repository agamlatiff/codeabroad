import { useState, useCallback } from 'react'
import { triggerHaptic } from '../../utils/haptics'
import { audioEngine } from '../../utils/audio'
import {
  COMPREHENSIVE_GUIDEBOOK_DATA,
  type SequentialCurriculumUnit,
} from '../../data/curriculumData'
import type { GuidebookContent } from '../../components/game/UnitGuidebookModal'

export const useRoadmapModals = () => {
  const [isCourseSwitcherOpen, setIsCourseSwitcherOpen] = useState(false)
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false)
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)
  const [guidebookModalUnit, setGuidebookModalUnit] = useState<GuidebookContent | null>(null)
  const [collapsedUnitIds, setCollapsedUnitIds] = useState<Set<string>>(new Set())
  const [lockedNotification, setLockedNotification] = useState<string | null>(null)

  const toggleUnitCollapse = useCallback((unitId: string) => {
    triggerHaptic('tap')
    setCollapsedUnitIds((prev) => {
      const next = new Set(prev)
      if (next.has(unitId)) {
        next.delete(unitId)
      } else {
        next.add(unitId)
      }
      return next
    })
  }, [])

  const handleOpenGuidebook = useCallback((unit: SequentialCurriculumUnit) => {
    triggerHaptic('tap')
    audioEngine.playPop()

    const fallbackGuidebook: GuidebookContent = {
      unitNumber: unit.unitNumber,
      unitTag: unit.tag,
      title: unit.title,
      summary: unit.description,
      codeSnippetTitle: `Contoh Sintaks & Best Practice: Unit 0${unit.unitNumber}`,
      codeSnippet: `// Contoh implementasi untuk ${unit.title}\n// CodeAbroad Tokyo Curriculum - Unit 0${unit.unitNumber}`,
      codeExplanation:
        'Pahami pola penulisan kode di atas dan pastikan Anda menguji kode secara menyeluruh sebelum mengirim Pull Request.',
      nihongoTerms: [
        { term: '設計書 (Sekkeisho)', reading: 'せっけいしょ', meaning: 'Dokumen Spesifikasi Desain' },
        { term: '開発 (Kaihatsu)', reading: 'かいはつ', meaning: 'Software Development' },
        { term: 'テスト (Tesuto)', reading: 'てすと', meaning: 'Unit Testing & Quality Assurance' },
      ],
      tokyoIndustryTip:
        'Di industri rekrutmen Tokyo, pemahaman konseptual yang kokoh dinilai sama tingginya dengan kecepatan mengetik kode.',
      firstPartRoute: unit.parts[0]?.route,
    }

    setGuidebookModalUnit(COMPREHENSIVE_GUIDEBOOK_DATA[unit.id] || fallbackGuidebook)
  }, [])

  const closeGuidebook = useCallback(() => {
    setGuidebookModalUnit(null)
  }, [])

  const handleLockedNodeClick = useCallback((partTitle: string) => {
    triggerHaptic('tap')
    audioEngine.playPop()
    setLockedNotification(`Selesaikan modul sebelumnya untuk membuka: "${partTitle}" 🔒`)
    setTimeout(() => {
      setLockedNotification((curr) => (curr?.includes(partTitle) ? null : curr))
    }, 3200)
  }, [])

  return {
    isCourseSwitcherOpen,
    setIsCourseSwitcherOpen,
    isLeaderboardOpen,
    setIsLeaderboardOpen,
    isMobileDrawerOpen,
    setIsMobileDrawerOpen,
    guidebookModalUnit,
    setGuidebookModalUnit,
    handleOpenGuidebook,
    closeGuidebook,
    collapsedUnitIds,
    toggleUnitCollapse,
    lockedNotification,
    handleLockedNodeClick,
  }
}

