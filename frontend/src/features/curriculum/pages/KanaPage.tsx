import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft,
  Check,
  CheckCircle,
  Lightbulb,
  Play,
  SpeakerHigh,
  Sparkle,
} from '@phosphor-icons/react'
import { AppLeftSidebar } from '@/shared/components/layout/left-sidebar/AppLeftSidebar'
import { AppTopBar } from '@/shared/components/layout/top-bar/AppTopBar'
import { PageHeroHeader } from '@/shared/components/ui/PageHeroHeader'
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
import { audioService } from '@/shared/services/audioService'
import { triggerHaptic } from '@/shared/utils/haptics'

const SLOW_SPEECH_RATE = 0.58

const VOWEL_COLUMNS = ['a', 'i', 'u', 'e', 'o'] as const

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

const VALID_KANA_SCRIPTS: ReadonlySet<KanaScriptType> = new Set(['hiragana', 'katakana'])

/**
 * Interactive Japanese Alphabet Workshop (/kana/:script):
 * - 46 Hiragana + 46 Katakana Gojuon matrix synced with PostgreSQL mastery.
 * - Keeps active script, selected character (?char=), and drill row (?drill=) synchronized in the URL.
 */
export const KanaPage = () => {
  const { data: userData } = useUser()
  const userIdKey = userData.user?.id ?? 'anonymous'
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { script: routeScript } = useParams<{ script?: string }>()
  const [searchParams, setSearchParams] = useSearchParams()

  const normalizedRouteScript = routeScript?.trim().toLowerCase() ?? ''
  const hasValidRouteScript = VALID_KANA_SCRIPTS.has(normalizedRouteScript as KanaScriptType)
  const legacyQueryScript = searchParams.get('script')?.trim().toLowerCase()
  const activeScript: KanaScriptType =
    normalizedRouteScript === 'katakana' ||
    (!hasValidRouteScript && legacyQueryScript === 'katakana')
      ? 'katakana'
      : 'hiragana'

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
  const masteredCount = kanaQuery.data?.mastered_count ?? 0
  const totalCount = kanaQuery.data?.total ?? 46
  const masteryPercent = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0

  const urlCharParam = searchParams.get('char')?.trim() ?? ''
  const urlDrillParam = searchParams.get('drill')?.trim() ?? ''

  // Canonicalize /kana and legacy /kana?script=... into /kana/:script?char=...
  useEffect(() => {
    if (!hasValidRouteScript) {
      const nextParams = new URLSearchParams(searchParams)
      nextParams.delete('script')
      if (!nextParams.get('char') && !nextParams.get('drill')) {
        nextParams.set('char', 'a')
      }
      const qs = nextParams.toString()
      navigate(`/kana/${activeScript}${qs ? `?${qs}` : ''}`, { replace: true })
      return
    }
    if (characters.length > 0 && !urlCharParam && !urlDrillParam) {
      setSearchParams({ char: characters[0].romaji }, { replace: true })
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
        return {
          rowOrder,
          rowKey: sortedItems[0]?.row_group ?? String(rowOrder),
          label: ROW_LABELS[rowOrder] ?? `Baris ${rowOrder}`,
          items: sortedItems,
          slots: [1, 2, 3, 4, 5].map((col) => colMap.get(col) ?? null),
        }
      })
  }, [characters])

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
    navigate(`/kana/${nextScript}?char=a`, { replace: true })
  }

  const handleSelectCell = (item: KanaCharacterItem) => {
    triggerHaptic('tap')
    setSearchParams({ char: item.romaji }, { replace: true })
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

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans flex selection:bg-emerald-600/20">
      <AppLeftSidebar />

      <main className="flex-1 min-w-0 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 pb-24 md:pb-12 space-y-5">
        <AppTopBar
          breadcrumbs={[
            { label: 'Beranda', to: '/curriculum' },
            { label: 'Aksara Jepang' },
            { label: activeScript === 'hiragana' ? 'Hiragana' : 'Katakana' },
          ]}
        />

        <PageHeroHeader
          theme="emerald"
          icon={
            <span className="font-brand font-black text-2xl leading-none">
              {activeScript === 'hiragana' ? 'あ' : 'ア'}
            </span>
          }
          badges={
            <>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100/90 border border-emerald-200 text-emerald-700 text-[10px] font-brand font-black uppercase tracking-wider">
                <Sparkle weight="fill" className="w-3 h-3" />
                Fondasi Nol • Gojūon
              </span>
              <Link
                to="/curriculum"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-emerald-700 transition-colors"
              >
                <ArrowLeft weight="bold" className="w-3 h-3" />
                Kembali ke Peta Belajar
              </Link>
            </>
          }
          title="Belajar Huruf Hiragana & Katakana"
          description="Kenali bunyi, trik ingat visual, latihan coretan menulis, dan kuis cepat 5 huruf per baris sebelum lanjut ke pelajaran kalimat."
          rightSlot={
            <div className="bg-white/95 border border-emerald-200/90 rounded-2xl px-4 py-2.5 min-w-[165px] space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between gap-2 text-xs font-brand font-black text-emerald-800 tabular-nums">
                <span>Dikuasai</span>
                <span>
                  {masteredCount}/{totalCount}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-emerald-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${masteryPercent}%` }}
                />
              </div>
            </div>
          }
        />

        {/* Script Switcher + Learning Tip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="inline-flex p-1 bg-white border-2 border-slate-200 rounded-2xl shadow-2xs self-start">
            <button
              type="button"
              onClick={() => handleSelectScript('hiragana')}
              className={`px-4 py-2 rounded-xl font-brand font-black text-xs transition-all cursor-pointer ${
                activeScript === 'hiragana'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              あ Hiragana (46 Huruf)
            </button>
            <button
              type="button"
              onClick={() => handleSelectScript('katakana')}
              className={`px-4 py-2 rounded-xl font-brand font-black text-xs transition-all cursor-pointer ${
                activeScript === 'katakana'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ア Katakana (46 Huruf)
            </button>
          </div>

          <p className="text-xs font-medium text-slate-500">
            Klik huruf apa saja untuk mendengar suaranya, atau tekan{' '}
            <span className="font-bold text-slate-700">Latih Baris</span> untuk kuis mini 5 huruf.
          </p>
        </div>

        {/* 2-Column Workspace: Left Gojuon Table + Right Study / Tracing / Drill */}
        {kanaQuery.isLoading ? (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-7 h-96 rounded-3xl bg-white border-2 border-slate-200 animate-pulse" />
            <div className="xl:col-span-5 h-96 rounded-3xl bg-white border-2 border-slate-200 animate-pulse" />
          </div>
        ) : kanaQuery.isError ? (
          <div className="rounded-3xl bg-rose-50 border-2 border-rose-200 p-6 text-center space-y-2">
            <p className="font-brand font-black text-sm text-rose-800">
              Gagal memuat tabel aksara Gojūon
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
            {/* LEFT: Interactive 5-Column Gojuon Matrix */}
            <div className="xl:col-span-7 bg-white rounded-3xl border-2 border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-3">
              {/* Vowel Column Header */}
              <div className="grid grid-cols-[1fr_auto] items-center gap-2 pb-1 border-b border-slate-100">
                <div className="grid grid-cols-5 gap-2 text-center">
                  {VOWEL_COLUMNS.map((v) => (
                    <span
                      key={v}
                      className="text-[10px] font-brand font-black uppercase tracking-widest text-slate-400"
                    >
                      {v}
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
                              className={`relative h-[60px] rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer select-none ${
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
                                className={`text-[10px] font-brand font-bold mt-1 ${
                                  isSelected ? 'text-blue-100' : 'text-slate-500'
                                }`}
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
                      { char: selectedChar?.romaji ?? characters[0]?.romaji ?? 'a' },
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
                          {selectedChar.script === 'hiragana' ? 'Hiragana' : 'Katakana'} • Bunyi
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-brand font-black text-slate-900 uppercase">
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
