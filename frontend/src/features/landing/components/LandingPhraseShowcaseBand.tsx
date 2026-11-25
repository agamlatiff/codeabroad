import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useInView } from 'motion/react'
import { ArrowRight, GlobeHemisphereWest, SpeakerHigh } from '@phosphor-icons/react'
import { AudioWaveformBars } from '@/features/landing/components/LandingIllustrations'
import {
  LandingStickerIcon,
  type StickerArtKind,
} from '@/features/landing/components/LandingStickerArt'
import { LanguageFlagIllustration } from '@/features/onboarding/components/illustrations/FlagIllustrations'
import { audioService } from '@/shared/services/audioService'
import { triggerHaptic } from '@/shared/utils/haptics'

type TrackFlagCode = 'en-gb' | 'en-us' | 'de' | 'fr' | 'zh' | 'ja'

interface TrackMeta {
  label: string
  speechLocale: string
  examPillClass: string
}

const TRACK_META: Record<TrackFlagCode, TrackMeta> = {
  'en-gb': {
    label: 'Inggris UK',
    speechLocale: 'en-GB',
    examPillClass: 'bg-blue-50 border-blue-200/80 text-[#1D4ED8]',
  },
  'en-us': {
    label: 'Inggris US',
    speechLocale: 'en-US',
    examPillClass: 'bg-sky-50 border-sky-200/80 text-[#0369A1]',
  },
  de: {
    label: 'Jerman',
    speechLocale: 'de-DE',
    examPillClass: 'bg-amber-50 border-amber-200/80 text-[#B45309]',
  },
  fr: {
    label: 'Prancis',
    speechLocale: 'fr-FR',
    examPillClass: 'bg-indigo-50 border-indigo-200/80 text-[#4338CA]',
  },
  zh: {
    label: 'Mandarin',
    speechLocale: 'zh-CN',
    examPillClass: 'bg-orange-50 border-orange-200/80 text-[#C2410C]',
  },
  ja: {
    label: 'Jepang',
    speechLocale: 'ja-JP',
    examPillClass: 'bg-rose-50 border-rose-200/80 text-[#BE123C]',
  },
}

interface ScenarioCardItem {
  kind: 'scenario'
  id: string
  flagCode: TrackFlagCode
  examPill: string
  stickerKind: StickerArtKind
  title: string
  situationNote: string
  keyPhrase: string
  translation: string
}

interface CertificationStage {
  label: string
  state: 'unlocked' | 'target' | 'upcoming'
}

interface CertificationMilestoneItem {
  kind: 'certification'
  id: string
  flagCode: TrackFlagCode
  targetBadge: string
  headline: string
  summary: string
  stageFooter: string
  stages: readonly [
    CertificationStage,
    CertificationStage,
    CertificationStage,
    CertificationStage,
  ]
  accent: 'blue' | 'amber' | 'rose' | 'emerald'
}

type ShowcaseMarqueeItem = ScenarioCardItem | CertificationMilestoneItem

const CERT_ACCENT_STYLES: Record<
  CertificationMilestoneItem['accent'],
  {
    card: string
    badge: string
    unlockedBar: string
    targetBar: string
    targetText: string
  }
> = {
  blue: {
    card: 'bg-gradient-to-br from-[#EFF6FF] via-white to-[#DBEAFE]/55 border-[#BFDBFE]',
    badge: 'bg-white border-[#BFDBFE] text-[#1D4ED8]',
    unlockedBar: 'bg-[#2563EB]',
    targetBar: 'bg-[#93C5FD]/65 border border-[#3B82F6]',
    targetText: 'text-[#1D4ED8]',
  },
  amber: {
    card: 'bg-gradient-to-br from-[#FFFBEB] via-white to-[#FEF3C7]/60 border-[#FDE68A]',
    badge: 'bg-white border-[#FDE68A] text-[#B45309]',
    unlockedBar: 'bg-[#D97706]',
    targetBar: 'bg-[#FDE68A]/75 border border-[#D97706]',
    targetText: 'text-[#B45309]',
  },
  rose: {
    card: 'bg-gradient-to-br from-[#FFF1F2] via-white to-[#FFE4E6]/60 border-[#FECDD3]',
    badge: 'bg-white border-[#FECDD3] text-[#BE123C]',
    unlockedBar: 'bg-[#E11D48]',
    targetBar: 'bg-[#FECDD3]/80 border border-[#E11D48]',
    targetText: 'text-[#BE123C]',
  },
  emerald: {
    card: 'bg-gradient-to-br from-[#ECFDF5] via-white to-[#D1FAE5]/55 border-[#A7F3D0]',
    badge: 'bg-white border-[#A7F3D0] text-[#047857]',
    unlockedBar: 'bg-[#059669]',
    targetBar: 'bg-[#A7F3D0]/80 border border-[#059669]',
    targetText: 'text-[#047857]',
  },
}

const ROW_1_ITEMS: ReadonlyArray<ShowcaseMarqueeItem> = [
  {
    kind: 'scenario',
    id: 'scenario-de-berlin',
    flagCode: 'de',
    examPill: 'Goethe B1',
    stickerKind: 'briefcase',
    title: 'Wawancara Kerja di Berlin',
    situationNote: 'Menjelaskan pengalaman proyek secara ringkas di sesi rekrutmen teknik.',
    keyPhrase: 'Ich bringe drei Jahre Projekterfahrung mit.',
    translation: 'Saya memiliki pengalaman proyek tiga tahun.',
  },
  {
    kind: 'scenario',
    id: 'scenario-en-gb-london',
    flagCode: 'en-gb',
    examPill: 'IELTS 7.0',
    stickerKind: 'campus-cap',
    title: 'Diskusi Seminar Kampus London',
    situationNote: 'Meminta klarifikasi metode penelitian dengan sopan di kelas pascasarjana.',
    keyPhrase: 'Could you clarify the methodology behind this study?',
    translation: 'Bisakah Anda jelaskan metodologi riset ini?',
  },
  {
    kind: 'certification',
    id: 'cert-goethe',
    flagCode: 'de',
    targetBadge: 'Goethe A1 -> B2',
    headline: 'Jalur Kuliah & Karier Jerman',
    summary:
      'Susun fondasi tata bahasa, dialog formal kantor, dan kesiapan dokumen untuk Studienkolleg hingga Ausbildung.',
    stageFooter: 'TARGET B2',
    stages: [
      { label: 'A1', state: 'unlocked' },
      { label: 'A2', state: 'unlocked' },
      { label: 'B1', state: 'target' },
      { label: 'B2', state: 'upcoming' },
    ],
    accent: 'amber',
  },
  {
    kind: 'scenario',
    id: 'scenario-ja-tokyo',
    flagCode: 'ja',
    examPill: 'JLPT N5',
    stickerKind: 'train-ticket',
    title: 'Transit Shinkansen di Tokyo',
    situationNote: 'Memastikan jalur peron kereta cepat antarkota sebelum gerbang tutup.',
    keyPhrase: '東京駅行きのホームは何番線ですか？',
    translation: 'Peron menuju Stasiun Tokyo jalur nomor berapa?',
  },
  {
    kind: 'scenario',
    id: 'scenario-en-us-lab',
    flagCode: 'en-us',
    examPill: 'TOEFL iBT',
    stickerKind: 'book',
    title: 'Orientasi Riset Kampus US',
    situationNote: 'Menyelaraskan jadwal presentasi mingguan bersama tim laboratorium.',
    keyPhrase: "Let's coordinate our lab presentation this Friday.",
    translation: 'Mari selaraskan presentasi lab kita Jumat ini.',
  },
  {
    kind: 'certification',
    id: 'cert-jlpt',
    flagCode: 'ja',
    targetBadge: 'JLPT N5 -> N2',
    headline: 'Standar Kerja & Kampus Jepang',
    summary:
      'Bertahap dari Hiragana dan sapaan sopan hingga keigo kerja serta bacaan teknis jalur Tokutei Ginou dan S1/S2.',
    stageFooter: 'TARGET N2',
    stages: [
      { label: 'N5', state: 'unlocked' },
      { label: 'N4', state: 'unlocked' },
      { label: 'N3', state: 'target' },
      { label: 'N2', state: 'upcoming' },
    ],
    accent: 'rose',
  },
  {
    kind: 'scenario',
    id: 'scenario-fr-paris',
    flagCode: 'fr',
    examPill: 'DELF A1',
    stickerKind: 'cafe-cup',
    title: 'Pesan Kopi & Roti di Paris',
    situationNote: 'Membuka pesanan kafe dengan sapaan sopan standar etika harian Prancis.',
    keyPhrase: "Bonjour, je voudrais un café crème, s'il vous plaît.",
    translation: 'Halo, saya pesan satu café crème, tolong.',
  },
  {
    kind: 'scenario',
    id: 'scenario-zh-shanghai',
    flagCode: 'zh',
    examPill: 'HSK 3',
    stickerKind: 'briefcase',
    title: 'Rapat Supplier di Shanghai',
    situationNote: 'Mengonfirmasi tenggat pengiriman komponen bersama mitra manufaktur.',
    keyPhrase: '我们希望下周确认发货时间表。',
    translation: 'Kami berharap jadwal pengiriman dikonfirmasi minggu depan.',
  },
  {
    kind: 'certification',
    id: 'cert-ielts-toefl',
    flagCode: 'en-gb',
    targetBadge: 'IELTS & TOEFL',
    headline: 'Target Skor Beasiswa Global',
    summary:
      'Latih struktur argumen akademik, diskusi seminar, dan kosakata presentasi untuk kampus UK serta Amerika.',
    stageFooter: 'TARGET 7.5+',
    stages: [
      { label: 'B1', state: 'unlocked' },
      { label: '6.0', state: 'unlocked' },
      { label: '7.0', state: 'target' },
      { label: '7.5+', state: 'upcoming' },
    ],
    accent: 'blue',
  },
]

const ROW_2_ITEMS: ReadonlyArray<ShowcaseMarqueeItem> = [
  {
    kind: 'scenario',
    id: 'scenario-en-gb-review',
    flagCode: 'en-gb',
    examPill: 'IELTS 7.5',
    stickerKind: 'speech',
    title: 'Presentasi Proyek Lintas Negara',
    situationNote: 'Merangkum poin utama evaluasi kuartalan di hadapan tim multinasional.',
    keyPhrase: 'Here are the key takeaways from our quarterly review.',
    translation: 'Berikut poin utama dari tinjauan kuartal kami.',
  },
  {
    kind: 'scenario',
    id: 'scenario-de-wohnung',
    flagCode: 'de',
    examPill: 'Goethe A2',
    stickerKind: 'speech',
    title: 'Sewa Apartemen & Lapor Diri',
    situationNote: 'Menanyakan jadwal survei unit tempat tinggal sebelum proses pendaftaran.',
    keyPhrase: 'Wann kann ich die Wohnung besichtigen?',
    translation: 'Kapan saya bisa meninjau apartemennya?',
  },
  {
    kind: 'certification',
    id: 'cert-delf',
    flagCode: 'fr',
    targetBadge: 'DELF A1 -> B2',
    headline: 'Jalur Studi & Etika Prancis',
    summary:
      'Latih pelafalan presisi, tata krama wawancara Campus France, hingga penulisan opini terstruktur.',
    stageFooter: 'TARGET B2',
    stages: [
      { label: 'A1', state: 'unlocked' },
      { label: 'A2', state: 'unlocked' },
      { label: 'B1', state: 'target' },
      { label: 'B2', state: 'upcoming' },
    ],
    accent: 'blue',
  },
  {
    kind: 'scenario',
    id: 'scenario-ja-clinic',
    flagCode: 'ja',
    examPill: 'JLPT N4',
    stickerKind: 'clock',
    title: 'Reservasi Klinik Kampus Kyoto',
    situationNote: 'Membuat janji pemeriksaan kesehatan mahasiswa di meja resepsionis.',
    keyPhrase: '午後の診察を予約したいのですが。',
    translation: 'Saya ingin membuat janji pemeriksaan siang ini.',
  },
  {
    kind: 'scenario',
    id: 'scenario-fr-scholarship',
    flagCode: 'fr',
    examPill: 'DELF B1',
    stickerKind: 'campus-cap',
    title: 'Pendaftaran Beasiswa & Wawancara',
    situationNote: 'Menyampaikan fokus bidang studi berkelanjutan di hadapan panel seleksi.',
    keyPhrase: "Mon objectif est d'étudier l'ingénierie durable.",
    translation: 'Tujuan saya adalah mempelajari teknik berkelanjutan.',
  },
  {
    kind: 'certification',
    id: 'cert-hsk',
    flagCode: 'zh',
    targetBadge: 'HSK 1 -> 4',
    headline: 'Kesiapan Bisnis & Riset Mandarin',
    summary:
      'Kuasai empat nada secara konsisten, ratusan Hanzi inti, dan komunikasi lintas tim industri teknologi.',
    stageFooter: 'TARGET HSK 4',
    stages: [
      { label: 'HSK1', state: 'unlocked' },
      { label: 'HSK2', state: 'unlocked' },
      { label: 'HSK3', state: 'target' },
      { label: 'HSK4', state: 'upcoming' },
    ],
    accent: 'emerald',
  },
  {
    kind: 'scenario',
    id: 'scenario-zh-design',
    flagCode: 'zh',
    examPill: 'HSK 4',
    stickerKind: 'speech',
    title: 'Diskusi Proyek Tim Jakarta-Beijing',
    situationNote: 'Meminta pembaruan berkas desain saat rapat sinkronisasi produk.',
    keyPhrase: '请把最新的设计文件发给我。',
    translation: 'Tolong kirimkan berkas desain terbarunya kepada saya.',
  },
  {
    kind: 'scenario',
    id: 'scenario-en-us-workshop',
    flagCode: 'en-us',
    examPill: 'TOEFL 100',
    stickerKind: 'lightbulb',
    title: 'Diskusi Kelompok Workshop US',
    situationNote: 'Memecah spesifikasi tugas teknis menjadi langkah kerja yang terukur.',
    keyPhrase: "Let's break down the requirements step by step.",
    translation: 'Mari kita uraikan kebutuhannya langkah demi langkah.',
  },
  {
    kind: 'certification',
    id: 'cert-toefl',
    flagCode: 'en-us',
    targetBadge: 'TOEFL iBT 80 -> 105',
    headline: 'Kesiapan Riset & Kampus US',
    summary:
      'Perkuat kelancaran speaking, pemahaman kuliah cepat, dan kolaborasi workshop akademik berbahasa Inggris US.',
    stageFooter: 'TARGET 105',
    stages: [
      { label: '70+', state: 'unlocked' },
      { label: '85', state: 'unlocked' },
      { label: '95', state: 'target' },
      { label: '105', state: 'upcoming' },
    ],
    accent: 'amber',
  },
]

export const LandingPhraseShowcaseBand = () => {
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null)
  const bandRef = useRef<HTMLElement>(null)
  const speechRequestIdRef = useRef(0)
  const isBandInView = useInView(bandRef, { amount: 0.05 })

  useEffect(() => {
    return () => {
      speechRequestIdRef.current += 1
      audioService.stopSpeech()
    }
  }, [])

  const handleSpeak = (scenarioId: string, text: string, speechLocale: string) => {
    triggerHaptic('tap')

    if (activeScenarioId === scenarioId) {
      speechRequestIdRef.current += 1
      audioService.stopSpeech()
      setActiveScenarioId(null)
      return
    }

    const requestId = ++speechRequestIdRef.current
    setActiveScenarioId(scenarioId)
    audioService.speakLanguage(
      text,
      speechLocale,
      () => {
        if (speechRequestIdRef.current === requestId) {
          setActiveScenarioId(null)
        }
      },
      () => {
        if (speechRequestIdRef.current === requestId) {
          setActiveScenarioId(null)
        }
      }
    )
  }

  const renderMarqueeCard = (
    item: ShowcaseMarqueeItem,
    copyIndex: number,
    itemIndex: number
  ) => {
    const isDuplicate = copyIndex === 1
    const cardKey = `${item.id}-${copyIndex}-${itemIndex}`
    const track = TRACK_META[item.flagCode]

    if (item.kind === 'certification') {
      const accentStyle = CERT_ACCENT_STYLES[item.accent]
      return (
        <article
          key={cardKey}
          aria-hidden={isDuplicate || undefined}
          className={`w-[265px] sm:w-[310px] rounded-[28px] border-2 ${accentStyle.card} shadow-[0_6px_0_0_rgba(45,64,150,0.06)] p-5 flex flex-col justify-between gap-3.5 shrink-0 transition-transform hover:-translate-y-1 [contain:layout_style_paint]`}
        >
          <div className="flex items-start justify-between gap-2.5">
            <div className="flex flex-col items-start gap-1.5 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-3.5 rounded-[3px] overflow-hidden bg-white border border-slate-200/80 shrink-0 flex items-center justify-center">
                  <LanguageFlagIllustration
                    code={item.flagCode}
                    compact
                    className="w-5 h-3.5 rounded-[3px] object-contain"
                  />
                </span>
                <span className="text-[11px] font-brand font-bold text-[#475569]">
                  {track.label}
                </span>
              </div>

              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[11px] font-mono font-bold tracking-tight ${accentStyle.badge}`}
              >
                {item.targetBadge}
              </span>
            </div>

            <LandingStickerIcon
              kind="certificate"
              size={44}
              shadow={false}
              className="shrink-0 -mt-1"
            />
          </div>

          <div className="space-y-1">
            <h3 className="text-base sm:text-[17px] font-brand font-black text-[#1E293B] leading-snug">
              {item.headline}
            </h3>
            <p className="text-xs text-[#475569] leading-relaxed">{item.summary}</p>
          </div>

          <div
            className="rounded-2xl bg-white/95 border border-slate-200/80 px-3 py-2.5"
            aria-label={`Tahapan sertifikasi ${item.targetBadge}: ${item.stages.map((s) => s.label).join(' -> ')}`}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#64748B]">
                Tahap Jalur
              </span>
              <span className={`text-[10px] font-mono font-bold ${accentStyle.targetText}`}>
                {item.stageFooter}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {item.stages.map((stage) => {
                const barClass =
                  stage.state === 'unlocked'
                    ? accentStyle.unlockedBar
                    : stage.state === 'target'
                      ? accentStyle.targetBar
                      : 'bg-slate-200/80'

                const labelClass =
                  stage.state === 'unlocked'
                    ? 'text-[#1E293B]'
                    : stage.state === 'target'
                      ? accentStyle.targetText
                      : 'text-[#64748B]'

                return (
                  <div key={stage.label} className="flex flex-col items-center gap-1">
                    <span className={`w-full h-2 rounded-full ${barClass}`} aria-hidden="true" />
                    <span className={`text-[10px] font-mono font-bold leading-none ${labelClass}`}>
                      {stage.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </article>
      )
    }

    const isPlaying = activeScenarioId === item.id

    return (
      <article
        key={cardKey}
        aria-hidden={isDuplicate || undefined}
        onClick={() => handleSpeak(item.id, item.keyPhrase, track.speechLocale)}
        className={`w-[280px] sm:w-[350px] rounded-[28px] bg-white border-2 p-5 flex flex-col justify-between gap-3.5 shrink-0 transition-all hover:-translate-y-1 cursor-pointer [contain:layout_style_paint] ${
          isPlaying
            ? 'border-[#2563EB] shadow-[0_6px_0_0_rgba(37,99,235,0.18)]'
            : 'border-[#E2E8F0] shadow-[0_6px_0_0_rgba(45,64,150,0.06)] hover:border-blue-300'
        }`}
      >
        {/* Top Row: Flag + Track + Official Exam Pill + Custom Sticker */}
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-center gap-2 min-w-0 flex-wrap pt-0.5">
            <span className="w-7 h-[18px] rounded-[5px] overflow-hidden bg-white border border-slate-200/80 shrink-0 flex items-center justify-center">
              <LanguageFlagIllustration
                code={item.flagCode}
                compact
                className="w-7 h-[18px] rounded-[4px] object-contain"
              />
            </span>
            <span className="text-xs font-brand font-black text-[#1E293B] shrink-0">
              {track.label}
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-mono font-bold tracking-tight shrink-0 ${track.examPillClass}`}
            >
              {item.examPill}
            </span>
          </div>

          <LandingStickerIcon
            kind={item.stickerKind}
            size={42}
            shadow={false}
            className="shrink-0 -mt-1"
          />
        </div>

        {/* Middle: Scenario Title + Concise Situational Note */}
        <div className="space-y-1">
          <h3 className="text-base sm:text-[17px] font-brand font-black text-[#1E293B] leading-snug">
            {item.title}
          </h3>
          <p className="text-xs text-[#64748B] leading-relaxed">{item.situationNote}</p>
        </div>

        {/* Bottom: Interactive Spoken Key-Phrase Bar */}
        <div
          className={`rounded-2xl border px-3.5 py-2.5 flex items-center justify-between gap-2.5 transition-colors ${
            isPlaying
              ? 'bg-[#EFF6FF] border-blue-200'
              : 'bg-[#F8FAFC] border-slate-200/80'
          }`}
        >
          <div className="min-w-0 flex-1">
            <p className="font-brand font-bold text-[13px] sm:text-sm text-[#1E293B] leading-snug">
              {item.keyPhrase}
            </p>
            <p className="text-[11px] text-[#64748B] leading-snug mt-0.5">{item.translation}</p>
          </div>

          <button
            type="button"
            tabIndex={isDuplicate ? -1 : 0}
            aria-pressed={isPlaying}
            aria-label={
              isPlaying
                ? `Hentikan pengucapan ${item.keyPhrase} (${track.label})`
                : `Putar pengucapan ${item.keyPhrase} (${track.label})`
            }
            onClick={(event) => {
              event.stopPropagation()
              handleSpeak(item.id, item.keyPhrase, track.speechLocale)
            }}
            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 ${
              isPlaying
                ? 'bg-white text-[#2563EB] border border-blue-200 shadow-xs'
                : 'bg-white hover:bg-[#EFF6FF] text-slate-600 hover:text-[#2563EB] border border-slate-200/80'
            }`}
          >
            {isPlaying ? (
              <AudioWaveformBars isPlaying />
            ) : (
              <SpeakerHigh weight="fill" className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </article>
    )
  }

  return (
    <section
      ref={bandRef}
      className="landing-cv-section relative bg-white overflow-hidden"
      aria-label="Etalase skenario dunia nyata dan target sertifikasi enam bahasa"
    >
      {/* Top Curved SVG Seam */}
      <svg
        viewBox="0 0 1440 72"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="block w-full h-9 sm:h-16 text-[#F4F7FF] fill-current -mb-px"
      >
        <path d="M0,72 C360,0 1080,0 1440,72 L1440,72 L0,72 Z" />
      </svg>

      {/* Main Band */}
      <div className="bg-[#F4F7FF] py-10 sm:py-16 space-y-10">
        <div className="px-4 sm:px-6 text-center max-w-2xl mx-auto space-y-3">
          <GlobeHemisphereWest
            weight="fill"
            className="w-9 h-9 mx-auto text-[#93C5FD]"
            aria-hidden="true"
          />
          <h2 className="text-3xl sm:text-[46px] font-brand font-black text-[#1E293B] leading-[1.12] tracking-tight">
            Siap hadapi situasi nyata & target sertifikasi
          </h2>
          <p className="text-sm sm:text-base text-[#475569]">
            Dari wawancara kerja di Berlin, diskusi kampus di London, hingga transit stasiun di
            Tokyo — ketuk skenario mana saja untuk dengar kalimat kuncinya.
          </p>
        </div>

        {/* Dual-Row Counter-Scrolling Marquee */}
        <div
          className={`max-w-[1920px] mx-auto relative overflow-hidden space-y-5 landing-marquee-track py-2 ${
            isBandInView ? '' : 'landing-marquee-paused'
          }`.trim()}
        >
          <div
            aria-hidden="true"
            className="hidden sm:block pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#F4F7FF] to-transparent z-10"
          />
          <div
            aria-hidden="true"
            className="hidden sm:block pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#F4F7FF] to-transparent z-10"
          />

          {/* Row 1: Forward */}
          <div className="flex w-max items-stretch gap-4 sm:gap-5 animate-landing-marquee-forward">
            {[0, 1].map((copyIndex) =>
              ROW_1_ITEMS.map((item, itemIndex) => renderMarqueeCard(item, copyIndex, itemIndex))
            )}
          </div>

          {/* Row 2: Reverse */}
          <div className="flex w-max items-stretch gap-4 sm:gap-5 animate-landing-marquee-reverse">
            {[0, 1].map((copyIndex) =>
              ROW_2_ITEMS.map((item, itemIndex) => renderMarqueeCard(item, copyIndex, itemIndex))
            )}
          </div>
        </div>

        {/* Centered Pill CTA */}
        <div className="text-center pt-2 px-4">
          <Link
            to="/curriculum"
            className="inline-flex items-center gap-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-7 py-3.5 text-sm sm:text-base font-brand font-black shadow-[0_4px_0_0_#1D4ED8] active:translate-y-0.5 active:shadow-none transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]/40 focus-visible:ring-offset-2"
          >
            <span>Lihat Semua Jalur & Target Bahasa</span>
            <ArrowRight weight="bold" className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Bottom Curved SVG Seam */}
      <svg
        viewBox="0 0 1440 72"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="block w-full h-9 sm:h-16 bg-white text-[#F4F7FF] fill-current -mt-px"
      >
        <path d="M0,0 C360,72 1080,72 1440,0 L1440,0 L0,0 Z" />
      </svg>
    </section>
  )
}
