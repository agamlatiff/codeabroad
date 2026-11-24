import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowsClockwise, SpeakerHigh, Swap } from '@phosphor-icons/react'
import {
  CharacterTrioSquad,
  CoralBuddyCharacter,
  SkyFluffyCharacter,
  type CharacterMood,
} from '@/features/landing/components/LandingCharacterCast'
import { FloatingStickerCard } from '@/features/landing/components/LandingStickerArt'
import { LanguageFlagIllustration } from '@/features/onboarding/components/illustrations/FlagIllustrations'
import { QuestChestIllustration } from '@/features/gamification/components/QuestChestIllustration'
import { audioService } from '@/shared/services/audioService'
import { triggerHaptic } from '@/shared/utils/haptics'

/**
 * ClassDojo-inspired crisp white tactile studio framing that lifts illustration
 * cards cleanly above organic pastel blobs.
 */
export const StudioCardFrame = ({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) => {
  return (
    <div
      className={`bg-white border-2 border-[#E2E8F0] rounded-[24px] shadow-[0_6px_0_0_rgba(45,64,150,0.06)] ${className}`.trim()}
    >
      {children}
    </div>
  )
}

/**
 * Animated vertical soundwave bars that pulse smoothly while speech audio plays.
 */
export const AudioWaveformBars = ({ isPlaying }: { isPlaying: boolean }) => {
  const shouldReduceMotion = useReducedMotion()
  const barHeights = [8, 15, 11, 16]

  return (
    <span className="inline-flex items-end gap-[3px] h-4" aria-hidden="true">
      {barHeights.map((peakHeight, idx) => (
        <motion.span
          key={idx}
          className={`w-[3px] rounded-full ${isPlaying ? 'bg-blue-600' : 'bg-slate-300'}`}
          initial={{ height: 5 }}
          animate={
            isPlaying
              ? shouldReduceMotion
                ? { height: Math.max(7, peakHeight - 2) }
                : {
                    height: [5, peakHeight, 7, Math.max(6, peakHeight - 3), 5],
                  }
              : { height: 5 + (idx % 2) * 3 }
          }
          transition={
            isPlaying && !shouldReduceMotion
              ? {
                  duration: 0.72,
                  repeat: Infinity,
                  repeatType: 'loop',
                  ease: 'easeInOut',
                  delay: idx * 0.1,
                }
              : { duration: 0.2 }
          }
        />
      ))}
    </span>
  )
}

/* ============================================================================
 * STAGE 1: CurriculumPathIllustration (Trio + 5 Orbiting Sticker Cards)
 * ============================================================================ */

type CurriculumOrbitId = 'intro' | 'greetings' | 'target' | 'audio' | 'chest'

interface CurriculumOrbitNode {
  id: CurriculumOrbitId
  mood: CharacterMood
  badgeText: string
  flagCode: 'en-gb' | 'de' | 'fr' | 'ja'
  previewTitle: string
  previewNote: string
}

const CURRICULUM_ORBIT_NODES: ReadonlyArray<CurriculumOrbitNode> = [
  {
    id: 'intro',
    mood: 'happy',
    badgeText: 'U1',
    flagCode: 'en-gb',
    previewTitle: 'Kartu Pengantar · Inggris UK & Jerman',
    previewNote: 'Ringkasan kosakata inti sebelum masuk latihan soal.',
  },
  {
    id: 'greetings',
    mood: 'happy',
    badgeText: '+20',
    flagCode: 'de',
    previewTitle: 'Sapaan Harian · Guten Morgen!',
    previewNote: 'Latih salam sopan di kelas, kampus, dan tempat kerja.',
  },
  {
    id: 'target',
    mood: 'excited',
    badgeText: '+1',
    flagCode: 'fr',
    previewTitle: 'Unit 1 Aktif · Bonjour & Dasar',
    previewNote: 'Coba pelajaran pertama di semua bahasa tanpa login.',
  },
  {
    id: 'audio',
    mood: 'listening',
    badgeText: 'EN',
    flagCode: 'en-gb',
    previewTitle: 'Latihan Dengar · Audio Native',
    previewNote: 'Dengarkan pengucapan asli lalu pilih respons paling tepat.',
  },
  {
    id: 'chest',
    mood: 'excited',
    badgeText: '15',
    flagCode: 'ja',
    previewTitle: 'Peti Hadiah Unit 1 · +15 Gems',
    previewNote: 'Selesaikan unit untuk buka bonus XP & peti hadiah.',
  },
]

/**
 * Open ClassDojo-style curriculum showcase: central trio squad flanked by
 * 5 orbiting interactive floating sticker cards and a live preview pill.
 */
export const CurriculumPathIllustration = () => {
  const [activeId, setActiveId] = useState<CurriculumOrbitId>('target')
  const [chestOpened, setChestOpened] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const speechRequestIdRef = useRef(0)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    return () => {
      speechRequestIdRef.current += 1
      audioService.stopSpeech()
    }
  }, [])

  const activeItem =
    CURRICULUM_ORBIT_NODES.find((item) => item.id === activeId) ?? CURRICULUM_ORBIT_NODES[2]

  const trioMood: CharacterMood = isSpeaking ? 'listening' : activeItem.mood
  const centerBadge =
    activeId === 'chest' && chestOpened ? '+15' : activeItem.badgeText

  const handleSelectNode = (nodeId: CurriculumOrbitId) => {
    triggerHaptic('tap')
    setActiveId(nodeId)

    if (nodeId === 'audio') {
      const requestId = ++speechRequestIdRef.current
      setIsSpeaking(true)
      audioService.speakLanguage(
        'Good morning! Ready to start Unit 1?',
        'en-GB',
        () => {
          if (speechRequestIdRef.current === requestId) {
            setIsSpeaking(false)
          }
        },
        () => {
          if (speechRequestIdRef.current === requestId) {
            setIsSpeaking(false)
          }
        }
      )
      return
    }

    if (isSpeaking) {
      speechRequestIdRef.current += 1
      audioService.stopSpeech()
      setIsSpeaking(false)
    }

    if (nodeId === 'chest') {
      setChestOpened((prev) => !prev)
    }
  }

  return (
    <div className="relative w-full pt-10 pb-4 sm:pt-12 sm:pb-5 min-h-[360px] sm:min-h-[450px] flex flex-col items-center justify-center gap-5 select-none">
      {/* Centerpiece Character Squad */}
      <div className="relative z-10 flex flex-col items-center sm:my-10">
        <CharacterTrioSquad activeMood={trioMood} centerBadge={centerBadge} />
      </div>

      {/* 5 Orbiting Floating Tilted Sticker Cards (grid on mobile, orbiting on sm+) */}
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-9 pt-6 w-full max-w-[380px] sm:pt-0 sm:contents">
        <div className="sm:absolute sm:top-12 sm:left-1 md:left-3 z-20">
          <FloatingStickerCard
            kind="book"
            label="Kartu Pengantar"
            sublabel="Dasar EN & DE"
            active={activeId === 'intro'}
            onClick={() => handleSelectNode('intro')}
            className="-rotate-6"
            ariaLabel="Kartu Pengantar: Dasar Inggris UK dan Jerman"
          />
        </div>

        <div className="sm:absolute sm:top-3 sm:left-[56%] sm:-translate-x-1/2 z-20">
          <FloatingStickerCard
            kind="check-medal"
            label="Sapaan Harian"
            sublabel="+20 XP"
            active={activeId === 'greetings'}
            onClick={() => handleSelectNode('greetings')}
            className="rotate-3"
            ariaLabel="Sapaan Harian: tambah 20 XP"
          />
        </div>

        <div className="sm:absolute sm:top-[34%] sm:right-0 md:right-2 z-20">
          <FloatingStickerCard
            kind="star-target"
            label="Unit 1 Aktif"
            sublabel="Mulai Gratis"
            active={activeId === 'target'}
            onClick={() => handleSelectNode('target')}
            className="rotate-6"
            ariaLabel="Unit 1 Aktif: Mulai gratis tanpa login"
          />
        </div>

        <div className="sm:absolute sm:bottom-[74px] sm:left-1 md:left-4 z-20">
          <FloatingStickerCard
            kind="headphones"
            label="Latihan Dengar"
            sublabel={isSpeaking ? 'Memutar...' : 'Audio Native'}
            active={activeId === 'audio'}
            onClick={() => handleSelectNode('audio')}
            className="-rotate-3"
            ariaLabel="Latihan Dengar: Putar contoh audio native Inggris"
          />
        </div>

        <div className="sm:absolute sm:bottom-[74px] sm:right-1 md:right-4 z-20">
          <FloatingStickerCard
            customIcon={
              <QuestChestIllustration
                tier={3}
                state={chestOpened ? 'claimed' : 'ready'}
                size={48}
              />
            }
            label="Peti Hadiah"
            sublabel={chestOpened ? '+15 Gems!' : 'Klik Buka'}
            active={activeId === 'chest'}
            onClick={() => handleSelectNode('chest')}
            className="rotate-6"
            ariaLabel="Peti Hadiah Unit 1: klik untuk membuka peti hadiah"
          />
        </div>
      </div>

      {/* Floating Compact Interactive Preview Pill Below Trio */}
      <div className="relative z-20 w-full max-w-[300px] sm:max-w-[330px] sm:mt-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeItem.id}-${chestOpened ? 'open' : 'closed'}`}
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            className="rounded-2xl bg-white/95 border-2 border-blue-100 shadow-[0_4px_12px_rgba(37,99,235,0.1)] px-4 py-2 flex items-center gap-3"
          >
            <div className="w-8 h-5.5 rounded-md overflow-hidden border border-slate-200 shrink-0">
              <LanguageFlagIllustration
                code={activeItem.flagCode}
                compact
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-brand font-black text-xs sm:text-[13px] text-[#1E293B] leading-tight truncate">
                {activeId === 'chest' && chestOpened
                  ? 'Peti Terbuka! +15 Gems Tersimpan'
                  : activeItem.previewTitle}
              </p>
              <p className="text-[11px] text-[#475569] leading-snug truncate mt-0.5">
                {activeId === 'chest' && chestOpened
                  ? 'Bonus tersimpan ke akun belajarmu setelah latihan.'
                  : activeItem.previewNote}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ============================================================================
 * STAGE 2: ScriptStrokeIllustration (Multi-Language Aksara & Pelafalan)
 * ============================================================================ */

type ScriptPackId = 'ja' | 'zh' | 'fr' | 'de'

interface ScriptPack {
  id: ScriptPackId
  flagCode: 'ja' | 'zh' | 'fr' | 'de'
  shortLabel: string
  glyph: string
  title: string
  strokeLabel: string
  sampleWord: string
  speechText: string
  speechLocale: string
  note: string
  accentColor: string
  tileThemeClass: string
  idleTiltClass: string
  strokes: ReadonlyArray<string>
}

const SCRIPT_PACKS: ReadonlyArray<ScriptPack> = [
  {
    id: 'ja',
    flagCode: 'ja',
    shortLabel: 'Jepang',
    glyph: 'あ',
    title: "Hiragana 'a'",
    strokeLabel: '3 goresan',
    sampleWord: "Hiragana 'a'",
    speechText: 'あ',
    speechLocale: 'ja-JP',
    note: "Hiragana 'a' — urutan 3 goresan",
    accentColor: '#F34E47',
    tileThemeClass: 'bg-[#FFF1F2] border-[#FECDD3] text-[#BE123C]',
    idleTiltClass: '-rotate-2',
    strokes: [
      'M 28 36 H 90',
      'M 56 22 C 54 48, 52 74, 56 96',
      'M 78 48 C 72 72, 54 90, 34 86 C 24 84, 24 68, 40 60 C 58 51, 86 58, 86 78 C 86 91, 74 98, 60 99',
    ],
  },
  {
    id: 'zh',
    flagCode: 'zh',
    shortLabel: 'Mandarin',
    glyph: '木',
    title: "Hanzi 'mù'",
    strokeLabel: '4 goresan',
    sampleWord: '木头 · mùtou',
    speechText: '木头',
    speechLocale: 'zh-CN',
    note: "Hanzi 'mu' (pohon) — 4 goresan + nada ke-4",
    accentColor: '#D97706',
    tileThemeClass: 'bg-[#FFFBEB] border-[#FDE68A] text-[#B45309]',
    idleTiltClass: 'rotate-2',
    strokes: [
      'M 26 42 H 94',
      'M 60 18 V 100',
      'M 60 44 C 48 64, 34 80, 22 90',
      'M 60 44 C 72 64, 86 80, 98 90',
    ],
  },
  {
    id: 'fr',
    flagCode: 'fr',
    shortLabel: 'Prancis',
    glyph: 'ç',
    title: "C-cédille 'ç'",
    strokeLabel: '2 goresan',
    sampleWord: 'Français',
    speechText: 'Français',
    speechLocale: 'fr-FR',
    note: "C-cédille (Français) — bunyi 's' lembut",
    accentColor: '#2563EB',
    tileThemeClass: 'bg-[#EFF6FF] border-[#BFDBFE] text-[#1D4ED8]',
    idleTiltClass: '-rotate-1',
    strokes: [
      'M 82 42 C 80 30, 38 28, 36 58 C 34 88, 78 88, 82 72',
      'M 60 80 L 56 92 C 64 94, 68 98, 60 102',
    ],
  },
  {
    id: 'de',
    flagCode: 'de',
    shortLabel: 'Jerman',
    glyph: 'ß',
    title: "Eszett 'ß'",
    strokeLabel: '2 goresan',
    sampleWord: 'Straße',
    speechText: 'Straße',
    speechLocale: 'de-DE',
    note: "Eszett 'Straße' — bunyi 'ss' panjang",
    accentColor: '#059669',
    tileThemeClass: 'bg-[#ECFDF5] border-[#A7F3D0] text-[#047857]',
    idleTiltClass: 'rotate-2',
    strokes: [
      'M 40 96 V 32',
      'M 40 32 C 40 16, 76 16, 74 36 C 72 48, 54 52, 54 52 C 78 54, 82 76, 66 86 C 58 91, 48 88, 46 84',
    ],
  },
]

/**
 * Open ClassDojo-style multi-language script & pronunciation collage:
 * 4 tilted squircle language tiles, Coral buddy cheering beside an animated
 * stroke-order writing pad, and floating sticker playback controls.
 */
export const ScriptStrokeIllustration = () => {
  const [scriptId, setScriptId] = useState<ScriptPackId>('ja')
  const [replayCount, setReplayCount] = useState(0)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const speechRequestIdRef = useRef(0)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    return () => {
      speechRequestIdRef.current += 1
      audioService.stopSpeech()
    }
  }, [])

  const activeScript =
    SCRIPT_PACKS.find((pack) => pack.id === scriptId) ?? SCRIPT_PACKS[0]

  const handleSelectScript = (nextId: ScriptPackId) => {
    if (nextId === scriptId) return
    triggerHaptic('tap')
    speechRequestIdRef.current += 1
    audioService.stopSpeech()
    setIsSpeaking(false)
    setScriptId(nextId)
    setReplayCount((prev) => prev + 1)
  }

  const handleReplay = () => {
    triggerHaptic('tap')
    setReplayCount((prev) => prev + 1)
  }

  const handleSpeak = () => {
    triggerHaptic('tap')
    const requestId = ++speechRequestIdRef.current
    setIsSpeaking(true)
    audioService.speakLanguage(
      activeScript.speechText,
      activeScript.speechLocale,
      () => {
        if (speechRequestIdRef.current === requestId) {
          setIsSpeaking(false)
        }
      },
      () => {
        if (speechRequestIdRef.current === requestId) {
          setIsSpeaking(false)
        }
      }
    )
  }

  const strokeSlot = 0.72 / activeScript.strokes.length

  return (
    <div className="relative w-full py-3 sm:py-5 min-h-[340px] sm:min-h-[400px] flex flex-col items-center justify-center gap-4 sm:gap-5 select-none">
      {/* 4 Colorful Tilted Squircle Script Selector Tiles */}
      <div
        role="group"
        aria-label="Pilih aksara dan tanda baca bahasa"
        className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 w-full max-w-[460px] z-20"
      >
        {SCRIPT_PACKS.map((pack) => {
          const isSelected = pack.id === activeScript.id
          return (
            <motion.button
              key={pack.id}
              type="button"
              onClick={() => handleSelectScript(pack.id)}
              aria-pressed={isSelected}
              aria-label={`Pilih ${pack.shortLabel}: ${pack.title}`}
              whileHover={shouldReduceMotion ? undefined : { y: -3 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 320, damping: 20 }}
              className={`rounded-2xl border-2 px-3 py-2.5 flex items-center gap-2.5 text-left transition-shadow cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                isSelected
                  ? 'bg-white border-[#2563EB] shadow-[0_6px_0_0_rgba(37,99,235,0.16)] ring-2 ring-blue-100'
                  : `${pack.tileThemeClass} shadow-[0_4px_0_0_rgba(15,23,42,0.08)] opacity-90 hover:opacity-100 ${
                      shouldReduceMotion ? '' : pack.idleTiltClass
                    }`
              }`}
            >
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div className="w-6 h-4 rounded overflow-hidden border border-slate-200/90">
                  <LanguageFlagIllustration
                    code={pack.flagCode}
                    compact
                    className="w-full h-full object-contain"
                  />
                </div>
                <span
                  className="font-brand font-black text-2xl leading-none"
                  style={{ color: pack.accentColor }}
                >
                  {pack.glyph}
                </span>
              </div>
              <div className="min-w-0">
                <span className="block font-brand font-black text-xs text-[#1E293B] truncate">
                  {pack.shortLabel}
                </span>
                <span className="block text-[10px] font-mono font-semibold text-[#64748B] truncate mt-0.5">
                  {pack.strokeLabel}
                </span>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Main Open Stage: Coral Character + Animated Writing Pad */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-7 w-full">
        <CoralBuddyCharacter
          mood={isSpeaking ? 'listening' : 'happy'}
          size={136}
          badgeText={activeScript.id.toUpperCase()}
          className="shrink-0"
        />

        <div className="flex flex-col items-center gap-3">
          {/* Tactile Writing Pad */}
          <div className="relative w-40 h-40 rounded-[26px] bg-white border-2 border-[#E2E8F0] shadow-[0_10px_24px_rgba(15,23,42,0.08),0_5px_0_0_#CBD5E1] flex items-center justify-center overflow-hidden">
            {/* Practice Grid Crosshair */}
            <div
              aria-hidden="true"
              className="absolute inset-0 border-r border-dashed border-slate-200/90 w-1/2 pointer-events-none"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 border-b border-dashed border-slate-200/90 h-1/2 pointer-events-none"
            />

            <span className="absolute top-2.5 right-2.5 rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-mono font-bold text-[#475569] z-20">
              1-{activeScript.strokes.length}
            </span>

            <svg
              key={`${activeScript.id}-${replayCount}`}
              viewBox="0 0 120 120"
              className="w-28 h-28 relative z-10"
              fill="none"
              role="img"
              aria-label={`Urutan goresan ${activeScript.title} bahasa ${activeScript.shortLabel}`}
            >
              {/* Ghost Character Outline */}
              <path
                d={activeScript.strokes.join(' ')}
                stroke="#E2E8F0"
                strokeWidth="7.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Animated Sequential Stroke Paths */}
              {activeScript.strokes.map((pathD, index) => {
                const drawStart = index * strokeSlot
                const drawEnd = (index + 1) * strokeSlot
                const isFirstStroke = index === 0

                return (
                  <motion.path
                    key={`${activeScript.id}-${index}`}
                    d={pathD}
                    stroke={activeScript.accentColor}
                    strokeWidth="7.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={
                      shouldReduceMotion
                        ? { pathLength: 1, opacity: 1 }
                        : { pathLength: 0, opacity: isFirstStroke ? 0.35 : 0.25 }
                    }
                    animate={
                      shouldReduceMotion
                        ? { pathLength: 1, opacity: 1 }
                        : isFirstStroke
                          ? {
                              pathLength: [0, 1, 1, 0],
                              opacity: [0.35, 1, 1, 0.25],
                            }
                          : {
                              pathLength: [0, 0, 1, 1, 0],
                              opacity: [0.25, 0.25, 1, 1, 0.25],
                            }
                    }
                    transition={
                      shouldReduceMotion
                        ? undefined
                        : {
                            duration: 3.8,
                            times: isFirstStroke
                              ? [0, drawEnd, 0.88, 1]
                              : [0, drawStart, drawEnd, 0.88, 1],
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }
                    }
                  />
                )
              })}
            </svg>
          </div>

          {/* Short Guide Pill Below Pad */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScript.id}
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="rounded-full bg-white/95 border border-slate-200 px-3.5 py-1.5 shadow-[0_3px_10px_rgba(15,23,42,0.06)] max-w-[290px] text-center"
            >
              <p className="text-[11px] font-brand font-bold text-[#1E293B]">
                {activeScript.note}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 2 Floating Tilted Sticker Action Buttons */}
      <div className="relative z-20 flex flex-wrap items-center justify-center gap-x-4 gap-y-9 pt-6">
        <FloatingStickerCard
          kind="brush"
          label="Ulangi"
          sublabel={activeScript.strokeLabel}
          onClick={handleReplay}
          className="-rotate-3"
          ariaLabel={`Ulangi animasi goresan ${activeScript.title}`}
        />
        <FloatingStickerCard
          kind="headphones"
          label="Dengar Audio"
          sublabel={activeScript.sampleWord}
          active={isSpeaking}
          onClick={handleSpeak}
          className="rotate-3"
          ariaLabel={`Dengar pelafalan ${activeScript.shortLabel}: ${activeScript.sampleWord}`}
        />
      </div>
    </div>
  )
}

/* ============================================================================
 * STAGE 3: FlashcardStackIllustration (5-Language 3D Flip Deck + Sky)
 * ============================================================================ */

interface StageFlashcard {
  id: string
  flagCode: 'en-us' | 'de' | 'fr' | 'zh' | 'ja'
  langLabel: string
  speechLocale: string
  phrase: string
  phonetic: string
  meaning: string
  example: string
  exampleTranslation: string
}

const FLASHCARDS: ReadonlyArray<StageFlashcard> = [
  {
    id: 'card-en-us',
    flagCode: 'en-us',
    langLabel: 'Inggris US',
    speechLocale: 'en-US',
    phrase: 'Take for granted',
    phonetic: '/teɪk fɔːr ˈɡræntɪd/',
    meaning: 'Menganggap remeh / biasa saja',
    example: "Don't take your health for granted.",
    exampleTranslation: 'Jangan menganggap remeh kesehatanmu.',
  },
  {
    id: 'card-de',
    flagCode: 'de',
    langLabel: 'Jerman',
    speechLocale: 'de-DE',
    phrase: 'Entschuldigung',
    phonetic: '/ɛntˈʃʊldɪɡʊŋ/',
    meaning: 'Permisi / Mohon maaf',
    example: 'Entschuldigung, wo ist der Bahnhof?',
    exampleTranslation: 'Permisi, di mana letak stasiun kereta?',
  },
  {
    id: 'card-fr',
    flagCode: 'fr',
    langLabel: 'Prancis',
    speechLocale: 'fr-FR',
    phrase: 'Enchanté',
    phonetic: '/ɑ̃.ʃɑ̃.te/',
    meaning: 'Senang bertemu denganmu',
    example: "Enchanté, je m'appelle Budi.",
    exampleTranslation: 'Senang bertemu, nama saya Budi.',
  },
  {
    id: 'card-zh',
    flagCode: 'zh',
    langLabel: 'Mandarin',
    speechLocale: 'zh-CN',
    phrase: '谢谢',
    phonetic: 'Xièxie · terima kasih',
    meaning: 'Terima kasih banyak',
    example: '谢谢你的帮助！',
    exampleTranslation: 'Terima kasih atas bantuanmu!',
  },
  {
    id: 'card-ja',
    flagCode: 'ja',
    langLabel: 'Jepang',
    speechLocale: 'ja-JP',
    phrase: 'お願いします',
    phonetic: 'Onegaishimasu',
    meaning: 'Tolong / Mohon bantuannya',
    example: 'これを一つお願いします。',
    exampleTranslation: 'Tolong yang ini satu ya.',
  },
]

const RATING_PILLS: ReadonlyArray<{
  id: string
  label: string
  className: string
}> = [
  {
    id: 'again',
    label: 'Ulangi',
    className:
      'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200',
  },
  {
    id: 'good',
    label: 'Lumayan',
    className:
      'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200',
  },
  {
    id: 'easy',
    label: 'Hafal',
    className:
      'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200',
  },
]

/**
 * Open ClassDojo-style flashcard stage: Sky fluffy companion beside a tactile
 * 5-language 3D-flipping stacked card deck and 3 floating tilted stickers.
 */
export const FlashcardStackIllustration = () => {
  const [cardIdx, setCardIdx] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const speechRequestIdRef = useRef(0)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    return () => {
      speechRequestIdRef.current += 1
      audioService.stopSpeech()
    }
  }, [])

  const currentCard = FLASHCARDS[cardIdx] ?? FLASHCARDS[0]

  const handleToggleFlip = () => {
    triggerHaptic('tap')
    setIsFlipped((prev) => !prev)
  }

  const handleNextCard = () => {
    triggerHaptic('tap')
    speechRequestIdRef.current += 1
    audioService.stopSpeech()
    setIsSpeaking(false)
    setIsFlipped(false)
    setCardIdx((prev) => (prev + 1) % FLASHCARDS.length)
  }

  const handleRateCard = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    handleNextCard()
  }

  const handleCardKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleToggleFlip()
    }
  }

  const handleSpeakPhrase = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    triggerHaptic('tap')
    const requestId = ++speechRequestIdRef.current
    setIsSpeaking(true)
    audioService.speakLanguage(
      currentCard.phrase,
      currentCard.speechLocale,
      () => {
        if (speechRequestIdRef.current === requestId) {
          setIsSpeaking(false)
        }
      },
      () => {
        if (speechRequestIdRef.current === requestId) {
          setIsSpeaking(false)
        }
      }
    )
  }

  return (
    <div className="relative w-full py-3 sm:py-5 min-h-[350px] sm:min-h-[410px] flex flex-col items-center justify-center gap-5 select-none">
      {/* Main Open Row: Sky Companion + Stacked 3D-Flipping Deck */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-6 w-full">
        <SkyFluffyCharacter
          mood={isFlipped ? 'excited' : isSpeaking ? 'listening' : 'happy'}
          size={132}
          badgeText={`${cardIdx + 1}/${FLASHCARDS.length}`}
          className="shrink-0"
        />

        {/* Stacked Vibrant Clay Deck */}
        <div className="group relative w-full max-w-[300px] sm:max-w-[315px] min-h-[214px] flex items-center justify-center">
          {/* Back Royal-Blue Clay Card */}
          <div
            aria-hidden="true"
            className={`absolute inset-x-3 top-2 bottom-1 rounded-[24px] bg-[#2563EB] border-2 border-[#1D4ED8] shadow-[0_5px_0_0_#1E40AF] -rotate-3 translate-y-2 transition-transform duration-300 ${
              shouldReduceMotion ? '' : 'group-hover:-rotate-6 group-hover:-translate-x-2'
            }`}
          />

          {/* Middle Emerald-Mint Clay Card */}
          <div
            aria-hidden="true"
            className={`absolute inset-x-1.5 top-2 bottom-1 rounded-[24px] bg-[#10B981] border-2 border-[#059669] shadow-[0_5px_0_0_#047857] rotate-2 translate-y-1 transition-transform duration-300 ${
              shouldReduceMotion ? '' : 'group-hover:rotate-5 group-hover:translate-x-2'
            }`}
          />

          {/* Interactive 3D Perspective Container */}
          <div className="relative z-10 w-full" style={{ perspective: 1000 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCard.id}
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, y: -10, scale: 0.97 }}
                transition={{ duration: 0.18 }}
              >
                <motion.div
                  role="button"
                  tabIndex={0}
                  onClick={handleToggleFlip}
                  onKeyDown={handleCardKeyDown}
                  aria-pressed={isFlipped}
                  aria-label={
                    isFlipped
                      ? `Arti kartu ${currentCard.langLabel}. Tekan untuk melihat kosakata di sisi depan.`
                      : `Kartu kosakata ${currentCard.langLabel}: ${currentCard.phrase}. Tekan untuk membalik kartu.`
                  }
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 260, damping: 24 }
                  }
                  style={{ transformStyle: 'preserve-3d' }}
                  className="relative w-full h-[212px] cursor-pointer rounded-[24px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#2563EB]"
                >
                  {/* Front Face */}
                  <div
                    aria-hidden={isFlipped}
                    style={{ backfaceVisibility: 'hidden' }}
                    className={`absolute inset-0 bg-white border-2 border-[#E2E8F0] shadow-[0_8px_0_0_rgba(45,64,150,0.08)] rounded-[24px] p-4 sm:p-5 flex flex-col justify-between ${
                      isFlipped ? 'pointer-events-none' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="inline-flex items-center gap-2 min-w-0">
                        <div className="w-7 h-5 rounded overflow-hidden border border-slate-200 shrink-0">
                          <LanguageFlagIllustration
                            code={currentCard.flagCode}
                            compact
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="text-[11px] font-brand font-black text-[#1E293B] truncate">
                          {currentCard.langLabel}
                        </span>
                      </div>

                      <button
                        type="button"
                        tabIndex={isFlipped ? -1 : 0}
                        onClick={handleSpeakPhrase}
                        aria-label={`Dengarkan pelafalan ${currentCard.langLabel}: ${currentCard.phrase}`}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-brand font-black transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${
                          isSpeaking
                            ? 'bg-blue-50 border-blue-300 text-[#2563EB]'
                            : 'bg-slate-50 hover:bg-blue-50 border-slate-200 hover:border-blue-300 text-[#1E293B]'
                        }`}
                      >
                        <SpeakerHigh weight="fill" className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                        <AudioWaveformBars isPlaying={isSpeaking} />
                      </button>
                    </div>

                    <div className="text-center space-y-1 my-auto py-1">
                      <p className="font-brand font-black text-xl sm:text-[22px] text-[#1E293B] leading-tight">
                        {currentCard.phrase}
                      </p>
                      <p className="text-xs font-mono font-semibold text-[#2563EB]">
                        {currentCard.phonetic}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-brand font-bold text-[#64748B] pt-2 border-t border-slate-100">
                      <span>Kartu {cardIdx + 1}/{FLASHCARDS.length}</span>
                      <span className="inline-flex items-center gap-1 text-[#2563EB]">
                        <Swap weight="bold" className="w-3.5 h-3.5 shrink-0" />
                        <span>Klik balik arti</span>
                      </span>
                    </div>
                  </div>

                  {/* Back Face */}
                  <div
                    aria-hidden={!isFlipped}
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                    className={`absolute inset-0 bg-[#F8FAFF] border-2 border-blue-300 shadow-[0_8px_0_0_#BFDBFE] rounded-[24px] p-4 sm:p-5 flex flex-col justify-between ${
                      !isFlipped ? 'pointer-events-none' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-brand font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white text-[#2563EB] border border-blue-200">
                        Arti &amp; Contoh
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-brand font-bold text-[#2563EB]">
                        <ArrowsClockwise weight="bold" className="w-3.5 h-3.5 shrink-0" />
                        <span>Sisi depan</span>
                      </span>
                    </div>

                    <div className="space-y-1 text-left my-auto py-1">
                      <p className="font-brand font-black text-base text-[#1E293B] leading-snug">
                        {currentCard.meaning}
                      </p>
                      <p className="text-xs font-bold text-[#2563EB] leading-snug">
                        &ldquo;{currentCard.example}&rdquo;
                      </p>
                      <p className="text-[11px] text-[#475569] leading-snug">
                        {currentCard.exampleTranslation}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-blue-200/70">
                      {RATING_PILLS.map((pill) => (
                        <button
                          key={pill.id}
                          type="button"
                          tabIndex={!isFlipped ? -1 : 0}
                          onClick={handleRateCard}
                          className={`flex-1 py-1 px-2 rounded-xl border text-[11px] font-brand font-black transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] ${pill.className}`}
                        >
                          {pill.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 3 Floating Tilted Sticker Assets Around the Deck */}
      <div className="relative z-20 flex flex-wrap items-center justify-center gap-x-3.5 gap-y-9 pt-6">
        <FloatingStickerCard
          kind="clock"
          label="Jadwal SRS"
          sublabel="Ulas Otomatis"
          className="-rotate-6"
          ariaLabel="Jadwal SRS: ulas kosakata otomatis sesuai daya ingat"
        />
        <FloatingStickerCard
          kind="lightbulb"
          label="Contoh Nyata"
          sublabel="Klik Balik"
          onClick={handleToggleFlip}
          active={isFlipped}
          className="rotate-6"
          ariaLabel="Contoh Nyata: klik untuk membalik kartu kosakata"
        />
        <FloatingStickerCard
          kind="sparkle-cards"
          label="Multi-Bahasa"
          sublabel="Ganti Kartu"
          onClick={handleNextCard}
          className="-rotate-3"
          ariaLabel="Multi-Bahasa: ganti ke kartu bahasa berikutnya"
        />
      </div>
    </div>
  )
}
