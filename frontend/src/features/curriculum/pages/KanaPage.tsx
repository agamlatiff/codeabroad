import { useEffect, useId, useMemo, useState, type ReactNode } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Check,
  CheckCircle,
  Lightbulb,
  Play,
  SpeakerHigh,
} from '@phosphor-icons/react'
import { AppLeftSidebar } from '@/shared/components/layout/left-sidebar/AppLeftSidebar'
import { AppTopBar } from '@/shared/components/layout/top-bar/AppTopBar'
import { useUser } from '@/features/user/hooks/useUser'
import {
  curriculumService,
  KANA_QUERY_KEY,
} from '@/features/curriculum/services/curriculumService'
import type {
  KanaCharacterItem,
  KanaPracticeItem,
  KanaScriptType,
} from '@/features/curriculum/types/curriculum'
import { KanaTracingPad } from '@/features/curriculum/components/kana/KanaTracingPad'
import { KanaRowDrillCard } from '@/features/curriculum/components/kana/KanaRowDrillCard'
import { KanaHeroIllustration } from '@/features/curriculum/components/KanaHeroIllustration'
import { KANJI_ROW_LABELS } from '@/features/curriculum/constants/kanjiCatalog'
import { audioService } from '@/shared/services/audioService'
import { triggerHaptic } from '@/shared/utils/haptics'

const SLOW_SPEECH_RATE = 0.58

const VOWEL_COLUMNS = ['a', 'i', 'u', 'e', 'o'] as const
const KANJI_COLUMNS = ['#1', '#2', '#3', '#4', '#5'] as const

const ROW_LABELS: Record<number, string> = {
  1: 'Vokal Dasar',
  2: 'Baris K (ka–ko)',
  3: 'Baris S (sa–so)',
  4: 'Baris T (ta–to)',
  5: 'Baris N (na–no)',
  6: 'Baris H (ha–ho)',
  7: 'Baris M (ma–mo)',
  8: 'Baris Y (ya–yo)',
  9: 'Baris R (ra–ro)',
  10: 'Baris W (wa / wo)',
  11: 'Konsonan Tunggal N',
}

const VALID_KANA_SCRIPTS: ReadonlySet<KanaScriptType> = new Set([
  'hiragana',
  'katakana',
  'kanji',
])

interface ScriptMenuMeta {
  script: KanaScriptType
  title: string
  glyph: string
  countLabel: string
  subtitle: string
  activeCardClass: string
  inactiveCardClass: string
  badgeActiveClass: string
  badgeInactiveClass: string
  watermarkClass: string
  heroTileClass: string
}

const SCRIPT_MENU_META: ReadonlyArray<ScriptMenuMeta> = [
  {
    script: 'hiragana',
    title: 'Hiragana',
    glyph: 'あ',
    countLabel: '46 Huruf',
    subtitle: 'Huruf dasar kata asli Jepang',
    activeCardClass:
      'bg-gradient-to-br from-emerald-50 via-white to-teal-50/80 border-emerald-500 shadow-[0_4px_0_0_#10B981] -translate-y-0.5',
    inactiveCardClass:
      'bg-white border-slate-200/90 hover:border-emerald-300 hover:bg-emerald-50/25 shadow-[0_3px_0_0_#E2E8F0] hover:-translate-y-0.5',
    badgeActiveClass: 'bg-emerald-600 text-white',
    badgeInactiveClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
    watermarkClass: 'text-emerald-600/12',
    heroTileClass: 'from-emerald-500 to-teal-600 shadow-[0_3px_0_0_#065F46]',
  },
  {
    script: 'katakana',
    title: 'Katakana',
    glyph: 'ア',
    countLabel: '46 Huruf',
    subtitle: 'Kata serapan & nama asing',
    activeCardClass:
      'bg-gradient-to-br from-sky-50 via-white to-blue-50/80 border-sky-500 shadow-[0_4px_0_0_#0284C7] -translate-y-0.5',
    inactiveCardClass:
      'bg-white border-slate-200/90 hover:border-sky-300 hover:bg-sky-50/25 shadow-[0_3px_0_0_#E2E8F0] hover:-translate-y-0.5',
    badgeActiveClass: 'bg-sky-600 text-white',
    badgeInactiveClass: 'bg-sky-50 text-sky-700 border border-sky-200/80',
    watermarkClass: 'text-sky-600/12',
    heroTileClass: 'from-sky-500 to-blue-600 shadow-[0_3px_0_0_#1D4ED8]',
  },
  {
    script: 'kanji',
    title: 'Kanji',
    glyph: '漢',
    countLabel: '50 Kanji N5',
    subtitle: 'Karakter inti JLPT N5 & arti',
    activeCardClass:
      'bg-gradient-to-br from-amber-50 via-white to-orange-50/80 border-amber-500 shadow-[0_4px_0_0_#D97706] -translate-y-0.5',
    inactiveCardClass:
      'bg-white border-slate-200/90 hover:border-amber-300 hover:bg-amber-50/25 shadow-[0_3px_0_0_#E2E8F0] hover:-translate-y-0.5',
    badgeActiveClass: 'bg-amber-600 text-white',
    badgeInactiveClass: 'bg-amber-50 text-amber-800 border border-amber-200/80',
    watermarkClass: 'text-amber-600/12',
    heroTileClass: 'from-amber-500 to-orange-600 shadow-[0_3px_0_0_#B45309]',
  },
]

function resolveScriptParam(raw?: string | null): KanaScriptType | null {
  const lower = (raw ?? '').trim().toLowerCase()
  return VALID_KANA_SCRIPTS.has(lower as KanaScriptType) ? (lower as KanaScriptType) : null
}

function getDefaultCharParam(script: KanaScriptType): string {
  return script === 'kanji' ? '一' : 'a'
}

function getCharQueryKey(item: KanaCharacterItem): string {
  return item.script === 'kanji' ? item.character : item.romaji
}

function renderScriptMenuEmblem(script: KanaScriptType, isActive: boolean): ReactNode {
  if (script === 'hiragana') {
    return (
      <svg viewBox="0 0 56 56" fill="none" className="w-13 h-13 shrink-0" aria-hidden="true">
        <rect
          x="3"
          y="4"
          width="50"
          height="48"
          rx="15"
          fill={isActive ? '#10B981' : '#ECFDF5'}
          stroke={isActive ? '#065F46' : '#A7F3D0'}
          strokeWidth="2.2"
        />
        <path
          d="M11 39C18 33 26 42 34 36C39 32 43 34 45 36"
          stroke={isActive ? '#A7F3D0' : '#34D399'}
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <circle cx="43" cy="14" r="3" fill={isActive ? '#FDE68A' : '#10B981'} opacity="0.85" />
        <text
          x="28"
          y="34"
          textAnchor="middle"
          fill={isActive ? '#FFFFFF' : '#065F46'}
          fontSize="24"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          あ
        </text>
      </svg>
    )
  }

  if (script === 'katakana') {
    return (
      <svg viewBox="0 0 56 56" fill="none" className="w-13 h-13 shrink-0" aria-hidden="true">
        <rect
          x="3"
          y="4"
          width="50"
          height="48"
          rx="15"
          fill={isActive ? '#0284C7' : '#F0F9FF'}
          stroke={isActive ? '#1E3A8A' : '#BAE6FD'}
          strokeWidth="2.2"
        />
        <path
          d="M11 16V11H16M40 11H45V16M11 40V45H16M45 40V45H40"
          stroke={isActive ? '#BAE6FD' : '#38BDF8'}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text
          x="28"
          y="35"
          textAnchor="middle"
          fill={isActive ? '#FFFFFF' : '#0369A1'}
          fontSize="24"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          ア
        </text>
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 56 56" fill="none" className="w-13 h-13 shrink-0" aria-hidden="true">
      <rect
        x="3"
        y="4"
        width="50"
        height="48"
        rx="15"
        fill={isActive ? '#D97706' : '#FFFBEB'}
        stroke={isActive ? '#92400E' : '#FDE68A'}
        strokeWidth="2.2"
      />
      {/* Traditional Genkouyoushi Grid Crosshair */}
      <path
        d="M28 9V47M9 28H47"
        stroke={isActive ? '#FDE68A' : '#F59E0B'}
        strokeOpacity={isActive ? '0.45' : '0.35'}
        strokeWidth="1.5"
        strokeDasharray="3 3"
      />
      {/* Mini Hanko Stamp Accent */}
      <rect
        x="38"
        y="36"
        width="9"
        height="9"
        rx="2"
        fill={isActive ? '#FFF1F2' : '#FFE4E6'}
        stroke="#E11D48"
        strokeWidth="1.3"
      />
      <text
        x="27"
        y="35"
        textAnchor="middle"
        fill={isActive ? '#FFFFFF' : '#92400E'}
        fontSize="23"
        fontWeight="900"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        漢
      </text>
    </svg>
  )
}

/**
 * Interactive Japanese Alphabet & Kanji Workshop (/kana/:script):
 * - 46 Hiragana + 46 Katakana Gojuon + 50 foundational JLPT N5 Kanji.
 * - Keeps active script, selected character (?char=), and drill row (?drill=) synchronized in the URL.
 */
export const KanaPage = () => {
  const { data: userData } = useUser()
  const userIdKey = userData.user?.id ?? 'anonymous'
  const heroPatternId = `kana-hero-seigaiha-${useId().replace(/:/g, '')}`
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { script: routeScript } = useParams<{ script?: string }>()
  const [searchParams, setSearchParams] = useSearchParams()

  const normalizedRouteScript = routeScript?.trim().toLowerCase() ?? ''
  const hasValidRouteScript = VALID_KANA_SCRIPTS.has(normalizedRouteScript as KanaScriptType)
  const legacyQueryScript = searchParams.get('script')
  const activeScript: KanaScriptType =
    resolveScriptParam(routeScript) ?? resolveScriptParam(legacyQueryScript) ?? 'hiragana'

  const activeScriptMeta =
    SCRIPT_MENU_META.find((item) => item.script === activeScript) ?? SCRIPT_MENU_META[0]

  const [playingSpeed, setPlayingSpeed] = useState<'normal' | 'slow' | 'word' | null>(null)

  const kanaQuery = useQuery({
    queryKey: [...KANA_QUERY_KEY, userIdKey, activeScript],
    queryFn: ({ signal }) => curriculumService.getKanaChart(activeScript, { signal }),
    staleTime: 1000 * 60 * 5,
  })

  const practiceMutation = useMutation({
    mutationFn: (results: KanaPracticeItem[]) => curriculumService.submitKanaPractice(results),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: KANA_QUERY_KEY })
    },
  })

  const characters: KanaCharacterItem[] = useMemo(
    () => kanaQuery.data?.characters ?? [],
    [kanaQuery.data?.characters]
  )

  const urlCharParam = searchParams.get('char')?.trim() ?? ''
  const urlDrillParam = searchParams.get('drill')?.trim() ?? ''

  // Canonicalize /kana and legacy /kana?script=... into /kana/:script?char=...
  useEffect(() => {
    if (!hasValidRouteScript) {
      const nextParams = new URLSearchParams(searchParams)
      nextParams.delete('script')
      if (!nextParams.get('char') && !nextParams.get('drill')) {
        nextParams.set('char', getDefaultCharParam(activeScript))
      }
      const qs = nextParams.toString()
      navigate(`/kana/${activeScript}${qs ? `?${qs}` : ''}`, { replace: true })
      return
    }
    if (characters.length > 0 && !urlCharParam && !urlDrillParam) {
      setSearchParams({ char: getCharQueryKey(characters[0]) }, { replace: true })
    }
  }, [
    activeScript,
    characters,
    hasValidRouteScript,
    navigate,
    searchParams,
    setSearchParams,
    urlCharParam,
    urlDrillParam,
  ])

  const selectedChar: KanaCharacterItem | null = useMemo(() => {
    if (characters.length === 0) return null
    if (urlCharParam) {
      const target = urlCharParam.toLowerCase()
      const found = characters.find(
        (c) => c.romaji.toLowerCase() === target || c.character === urlCharParam
      )
      if (found) return found
    }
    return characters[0]
  }, [characters, urlCharParam])

  const groupedRows = useMemo(() => {
    const byRow = new Map<number, KanaCharacterItem[]>()
    for (const item of characters) {
      const existing = byRow.get(item.row_order) ?? []
      existing.push(item)
      byRow.set(item.row_order, existing)
    }
    return Array.from(byRow.entries())
      .sort(([a], [b]) => a - b)
      .map(([rowOrder, items]) => {
        const sortedItems = [...items].sort((a, b) => a.col_order - b.col_order)
        const colMap = new Map<number, KanaCharacterItem>()
        for (const item of sortedItems) {
          colMap.set(item.col_order, item)
        }
        const label =
          activeScript === 'kanji'
            ? (KANJI_ROW_LABELS[rowOrder] ?? `Grup Kanji ${rowOrder}`)
            : (ROW_LABELS[rowOrder] ?? `Baris ${rowOrder}`)
        return {
          rowOrder,
          rowKey: sortedItems[0]?.row_group ?? String(rowOrder),
          label,
          items: sortedItems,
          slots: [1, 2, 3, 4, 5].map((col) => colMap.get(col) ?? null),
        }
      })
  }, [activeScript, characters])

  const activeDrillRow = useMemo(() => {
    if (!urlDrillParam) return null
    const lower = urlDrillParam.toLowerCase()
    return (
      groupedRows.find(
        (r) => r.rowKey.toLowerCase() === lower || String(r.rowOrder) === urlDrillParam
      ) ?? null
    )
  }, [groupedRows, urlDrillParam])

  const handleSelectScript = (nextScript: KanaScriptType) => {
    triggerHaptic('tap')
    const defaultChar = getDefaultCharParam(nextScript)
    navigate(`/kana/${nextScript}?char=${encodeURIComponent(defaultChar)}`, { replace: true })
  }

  const handleSelectCell = (item: KanaCharacterItem) => {
    triggerHaptic('tap')
    setSearchParams({ char: getCharQueryKey(item) }, { replace: true })
    setPlayingSpeed('normal')
    const clear = () => setPlayingSpeed((prev) => (prev === 'normal' ? null : prev))
    audioService.speakJapanese(item.character, clear, clear)
  }

  const handleSpeakText = (text: string, mode: 'normal' | 'slow' | 'word') => {
    triggerHaptic('tap')
    audioService.stopSpeech()
    setPlayingSpeed(mode)
    const clear = () => setPlayingSpeed((prev) => (prev === mode ? null : prev))
    if (mode === 'slow') {
      audioService.speakLanguage(text, 'ja-JP', clear, clear, SLOW_SPEECH_RATE)
    } else {
      audioService.speakJapanese(text, clear, clear)
    }
  }

  const handleStartRowDrill = (rowKey: string, firstChar?: KanaCharacterItem) => {
    triggerHaptic('tap')
    setSearchParams({ drill: rowKey }, { replace: true })
    if (firstChar) {
      audioService.speakJapanese(firstChar.character)
    }
  }

  const handleFinishDrill = async (results: KanaPracticeItem[]) => {
    await practiceMutation.mutateAsync(results)
  }

  const handleMarkSelectedPracticed = () => {
    if (!selectedChar) return
    triggerHaptic('success')
    void practiceMutation.mutate([{ character: selectedChar.character, is_correct: true }])
  }

  const columnHeaders = activeScript === 'kanji' ? KANJI_COLUMNS : VOWEL_COLUMNS
  const activeBreadcrumbLabel =
    activeScript === 'hiragana'
      ? 'Hiragana'
      : activeScript === 'katakana'
        ? 'Katakana'
        : 'Kanji'

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans flex selection:bg-emerald-600/20">
      <AppLeftSidebar />

      <main className="flex-1 min-w-0 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 pb-24 md:pb-12 space-y-5">
        <AppTopBar
          breadcrumbs={[
            { label: 'Beranda', to: '/curriculum' },
            { label: 'Aksara Jepang' },
            { label: activeBreadcrumbLabel },
          ]}
        />

        {/* Custom Editorial Aksara Hero Banner with 3-Script Calligraphy & Kodi Illustration */}
        <section className="relative rounded-3xl border-2 border-slate-200/90 bg-gradient-to-br from-emerald-50/75 via-white to-teal-50/45 shadow-[0_4px_0_0_#E2E8F0] overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-teal-500 to-sky-500" />

          {/* Subtle Japanese Seigaiha Background Pattern */}
          <svg
            className="absolute inset-0 w-full h-full text-emerald-700 opacity-[0.05] pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <pattern id={heroPatternId} width="48" height="24" patternUnits="userSpaceOnUse">
                <path
                  d="M0 24A12 12 0 0 1 24 24M24 24A12 12 0 0 1 48 24M12 12A12 12 0 0 1 36 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${heroPatternId})`} />
          </svg>

          <div className="relative z-10 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
            {/* Left Info */}
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-b ${activeScriptMeta.heroTileClass} text-white flex items-center justify-center shrink-0 transition-all`}
              >
                <span className="font-brand font-black text-2xl leading-none">
                  {activeScriptMeta.glyph}
                </span>
              </div>

              <div className="space-y-1 min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-brand font-black text-slate-900 tracking-tight leading-snug">
                  Belajar Huruf Hiragana, Katakana &amp; Kanji
                </h1>

                <p className="text-xs sm:text-sm text-slate-600 max-w-lg leading-relaxed font-medium">
                  Kenali bunyi, arti karakter, trik ingat visual, latihan coretan menulis, dan kuis cepat per baris sebelum lanjut ke pelajaran kalimat.
                </p>
              </div>
            </div>

            {/* Right: Custom 3-Script Calligraphy & Kodi Mascot Illustration */}
            <KanaHeroIllustration
              activeScript={activeScript}
              className="hidden md:flex shrink-0"
            />
          </div>
        </section>

        {/* Eye-Catching Illustrated 3-Script Menu (Hiragana / Katakana / Kanji) */}
        <section aria-label="Pilih jenis huruf Jepang" className="space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {SCRIPT_MENU_META.map((item) => {
              const isActive = activeScript === item.script
              return (
                <button
                  key={item.script}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => handleSelectScript(item.script)}
                  className={`group relative overflow-hidden rounded-2xl border-2 p-3.5 text-left transition-all cursor-pointer flex items-center gap-3.5 ${
                    isActive ? item.activeCardClass : item.inactiveCardClass
                  }`}
                >
                  {/* Decorative Slanted Calligraphic Glyph Watermark */}
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none select-none absolute -right-2 -bottom-4 text-6xl font-black leading-none rotate-12 transition-transform duration-300 group-hover:scale-110 ${item.watermarkClass}`}
                  >
                    {item.glyph}
                  </span>

                  {/* Custom Vector Emblem */}
                  <div className="relative z-10 transition-transform duration-200 group-hover:scale-105">
                    {renderScriptMenuEmblem(item.script, isActive)}
                  </div>

                  {/* Label + Count Pill + Short Description */}
                  <div className="relative z-10 min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-brand font-black text-sm sm:text-base text-slate-900 leading-tight">
                        {item.title}
                      </span>
                      <span
                        className={`text-[10px] font-brand font-black px-2 py-0.5 rounded-full whitespace-nowrap ${
                          isActive ? item.badgeActiveClass : item.badgeInactiveClass
                        }`}
                      >
                        {item.countLabel}
                      </span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-500 leading-snug truncate">
                      {item.subtitle}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          <p className="text-xs font-medium text-slate-500">
            Klik karakter apa saja untuk mendengar pelafalannya, atau tekan{' '}
            <span className="font-bold text-slate-700">Latih</span> untuk kuis mini per baris.
          </p>
        </section>

        {/* 2-Column Workspace: Left Matrix + Right Study / Tracing / Drill */}
        {kanaQuery.isLoading ? (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-7 h-96 rounded-3xl bg-white border-2 border-slate-200 animate-pulse" />
            <div className="xl:col-span-5 h-96 rounded-3xl bg-white border-2 border-slate-200 animate-pulse" />
          </div>
        ) : kanaQuery.isError ? (
          <div className="rounded-3xl bg-rose-50 border-2 border-rose-200 p-6 text-center space-y-2">
            <p className="font-brand font-black text-sm text-rose-800">
              Gagal memuat tabel aksara Jepang
            </p>
            <button
              type="button"
              onClick={() => void kanaQuery.refetch()}
              className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold cursor-pointer"
            >
              Coba Lagi
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* LEFT: Interactive 5-Column Matrix */}
            <div className="xl:col-span-7 bg-white rounded-3xl border-2 border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-3">
              {/* Column Header */}
              <div className="grid grid-cols-[1fr_auto] items-center gap-2 pb-1 border-b border-slate-100">
                <div className="grid grid-cols-5 gap-2 text-center">
                  {columnHeaders.map((col) => (
                    <span
                      key={col}
                      className="text-[10px] font-brand font-black uppercase tracking-widest text-slate-400"
                    >
                      {col}
                    </span>
                  ))}
                </div>
                <span className="w-[74px] text-center text-[10px] font-brand font-black uppercase tracking-wider text-slate-400">
                  Latih
                </span>
              </div>

              <div className="space-y-3">
                {groupedRows.map((row) => (
                  <div key={row.rowOrder} className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 px-0.5">
                      <span className="text-[11px] font-brand font-extrabold text-slate-500">
                        {row.label}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 tabular-nums">
                        {row.items.filter((i) => i.is_mastered).length}/{row.items.length} dikuasai
                      </span>
                    </div>

                    <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                      <div className="grid grid-cols-5 gap-2">
                        {row.slots.map((slot, slotIdx) => {
                          if (!slot) {
                            return (
                              <div
                                key={`empty-${row.rowOrder}-${slotIdx}`}
                                className="h-[60px] rounded-2xl bg-slate-50/70 border border-dashed border-slate-200/70"
                                aria-hidden="true"
                              />
                            )
                          }

                          const isSelected = selectedChar?.character === slot.character
                          return (
                            <button
                              key={slot.id}
                              type="button"
                              onClick={() => handleSelectCell(slot)}
                              className={`relative h-[60px] rounded-2xl border-2 flex flex-col items-center justify-center px-1 transition-all cursor-pointer select-none ${
                                isSelected
                                  ? 'bg-blue-600 border-blue-700 text-white shadow-[0_4px_0_0_#1D4ED8] -translate-y-0.5'
                                  : slot.is_mastered
                                    ? 'bg-emerald-50/70 border-emerald-300 text-slate-900 hover:border-emerald-500 shadow-[0_3px_0_0_rgba(16,185,129,0.18)]'
                                    : 'bg-white border-slate-200 text-slate-900 hover:border-blue-400 hover:bg-blue-50/40 shadow-[0_3px_0_0_rgba(15,23,42,0.06)]'
                              }`}
                            >
                              {slot.is_mastered && (
                                <span
                                  className={`absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center ${
                                    isSelected
                                      ? 'bg-white text-blue-600'
                                      : 'bg-emerald-500 text-white'
                                  }`}
                                  title="Sudah dikuasai"
                                >
                                  <Check weight="bold" className="w-2.5 h-2.5" />
                                </span>
                              )}
                              <span className="text-xl font-black leading-none">
                                {slot.character}
                              </span>
                              <span
                                className={`font-brand font-bold mt-1 max-w-full truncate ${
                                  activeScript === 'kanji' ? 'text-[9.5px]' : 'text-[10px]'
                                } ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}
                              >
                                {slot.romaji}
                              </span>
                            </button>
                          )
                        })}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleStartRowDrill(row.rowKey, row.items[0])}
                        className={`w-[74px] h-[60px] rounded-2xl border-2 flex flex-col items-center justify-center gap-0.5 text-[11px] font-brand font-black transition-all cursor-pointer ${
                          activeDrillRow?.rowOrder === row.rowOrder
                            ? 'bg-blue-600 border-blue-700 text-white shadow-[0_4px_0_0_#1D4ED8]'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700'
                        }`}
                      >
                        <Play weight="fill" className="w-3.5 h-3.5" />
                        <span>Latih</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Sticky Study & Tracing Panel OR Row Drill Mode */}
            <div className="xl:col-span-5 xl:sticky xl:top-6">
              {activeDrillRow ? (
                <KanaRowDrillCard
                  key={`${activeScript}-row-${activeDrillRow.rowOrder}`}
                  rowLabel={activeDrillRow.label}
                  rowChars={activeDrillRow.items}
                  allScriptChars={characters}
                  isSubmitting={practiceMutation.isPending}
                  onFinishDrill={handleFinishDrill}
                  onClose={() =>
                    setSearchParams(
                      {
                        char: selectedChar
                          ? getCharQueryKey(selectedChar)
                          : characters[0]
                            ? getCharQueryKey(characters[0])
                            : getDefaultCharParam(activeScript),
                      },
                      { replace: true }
                    )
                  }
                />
              ) : selectedChar ? (
                <div className="bg-white rounded-3xl border-2 border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-5">
                  {/* Top Selected Character Showcase */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-50 to-emerald-50 border-2 border-blue-200 flex items-center justify-center shrink-0">
                        <span className="text-5xl font-black text-slate-900 leading-none">
                          {selectedChar.character}
                        </span>
                      </div>
                      <div className="min-w-0 space-y-1">
                        <span className="text-[10px] font-brand font-black uppercase tracking-wider text-blue-600 block">
                          {selectedChar.script === 'hiragana'
                            ? 'Hiragana • Bunyi'
                            : selectedChar.script === 'katakana'
                              ? 'Katakana • Bunyi'
                              : 'Kanji JLPT N5 • Bacaan & Arti'}
                        </span>
                        <div className="flex items-center flex-wrap gap-2">
                          <span
                            className={`font-brand font-black text-slate-900 ${
                              selectedChar.script === 'kanji'
                                ? 'text-lg sm:text-xl leading-snug'
                                : 'text-2xl uppercase'
                            }`}
                          >
                            {selectedChar.romaji}
                          </span>
                          {selectedChar.is_mastered && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-brand font-black">
                              <CheckCircle weight="fill" className="w-3 h-3" />
                              Dikuasai
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-bold text-slate-400 tabular-nums">
                          Dilatih {selectedChar.practice_count}x • Skor penguasaan {selectedChar.mastery_score}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 2-Speed Pronunciation Controls */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleSpeakText(selectedChar.character, 'normal')}
                      className={`min-h-[44px] px-3 py-2 rounded-2xl border-2 font-brand font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        playingSpeed === 'normal'
                          ? 'bg-blue-600 border-blue-700 text-white'
                          : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                      }`}
                    >
                      <SpeakerHigh weight="fill" className="w-4 h-4" />
                      Putar Normal
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSpeakText(selectedChar.character, 'slow')}
                      className={`min-h-[44px] px-3 py-2 rounded-2xl border-2 font-brand font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        playingSpeed === 'slow'
                          ? 'bg-blue-600 border-blue-700 text-white'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50/40'
                      }`}
                    >
                      <SpeakerHigh weight="bold" className="w-4 h-4" />
                      0.6x Pelan
                    </button>
                  </div>

                  {/* Mnemonic Visual Tip */}
                  <div className="rounded-2xl bg-amber-50/80 border border-amber-200/90 p-3.5 flex items-start gap-2.5">
                    <Lightbulb weight="fill" className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-brand font-black uppercase tracking-wider text-amber-800 block">
                        Cara Cepat Mengingat
                      </span>
                      <p className="text-xs font-medium text-amber-950 leading-relaxed">
                        {selectedChar.mnemonic}
                      </p>
                    </div>
                  </div>

                  {/* Example Word */}
                  {selectedChar.example_word && (
                    <div className="rounded-2xl bg-slate-50 border border-slate-200/90 p-3.5 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <span className="text-[10px] font-brand font-black uppercase tracking-wider text-slate-400 block">
                          Contoh Kata
                        </span>
                        <p className="text-base font-black text-slate-900">
                          {selectedChar.example_word}{' '}
                          <span className="text-xs font-bold text-blue-600">
                            ({selectedChar.example_reading})
                          </span>
                        </p>
                        <p className="text-xs font-medium text-slate-600">
                          Artinya: {selectedChar.example_meaning}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSpeakText(selectedChar.example_word, 'word')}
                        aria-label="Putar contoh kata"
                        className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                          playingSpeed === 'word'
                            ? 'bg-blue-600 border-blue-700 text-white'
                            : 'bg-white border-slate-200 text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        <SpeakerHigh weight="fill" className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Interactive Tracing Canvas (keyed cleanly per character) */}
                  <KanaTracingPad
                    key={`${selectedChar.script}-${selectedChar.character}`}
                    character={selectedChar.character}
                    isMastered={selectedChar.is_mastered}
                    isSaving={practiceMutation.isPending}
                    onMarkPracticed={handleMarkSelectedPracticed}
                  />
                </div>
              ) : null}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
