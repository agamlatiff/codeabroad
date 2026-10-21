import { useState, useMemo } from 'react'
import {
  BookOpen,
  Code,
  Translate,
  Lightbulb,
  X,
  Play,
  Copy,
  Check,
  SpeakerSimpleHigh,
  CheckCircle,
  XCircle,
  Sparkle,
} from '@phosphor-icons/react'
import { triggerHaptic } from '../../utils/haptics'
import { soundEngine } from '../../utils/audio'
import { useAuthStore } from '../../store/authStore'
import doodleCoding from '../../assets/kodi/doodle-coding.png'

export interface GuidebookQuiz {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface GuidebookContent {
  unitNumber: number
  unitTag: string
  title: string
  summary: string
  codeSnippetTitle: string
  codeSnippet: string
  codeExplanation: string
  nihongoTerms: { term: string; reading: string; meaning: string }[]
  tokyoIndustryTip: string
  firstPartRoute?: string
  conceptQuiz?: GuidebookQuiz
}

export interface UnitGuidebookModalProps {
  isOpen: boolean
  onClose: () => void
  content?: GuidebookContent | null
  onStartUnit?: () => void
}

export const UnitGuidebookModal = ({
  isOpen,
  onClose,
  content,
  onStartUnit,
}: UnitGuidebookModalProps) => {
  const { user, updateUser } = useAuthStore()
  const [copiedCode, setCopiedCode] = useState(false)
  const [speakingTerm, setSpeakingTerm] = useState<string | null>(null)

  // Quiz state
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [quizBonusAwarded, setQuizBonusAwarded] = useState(() => {
    try {
      return content?.unitNumber
        ? localStorage.getItem(`codeabroad_guidebook_quiz_unit_${content.unitNumber}`) === 'true'
        : false
    } catch {
      return false
    }
  })

  // Synchronize quiz status when active guidebook content changes
  const [prevUnitNumber, setPrevUnitNumber] = useState<number | undefined>(content?.unitNumber)
  if (content?.unitNumber !== prevUnitNumber) {
    setPrevUnitNumber(content?.unitNumber)
    let isAwarded: boolean
    try {
      isAwarded = content?.unitNumber
        ? localStorage.getItem(`codeabroad_guidebook_quiz_unit_${content.unitNumber}`) === 'true'
        : false
    } catch {
      isAwarded = false
    }
    setQuizBonusAwarded(isAwarded)
    setSelectedOption(null)
    setIsAnswered(false)
  }

  // Derive smart concept quiz for the unit
  const activeQuiz: GuidebookQuiz = useMemo(() => {
    if (content?.conceptQuiz) return content.conceptQuiz

    const tag = (content?.unitTag || '').toLowerCase()
    const title = (content?.title || '').toLowerCase()

    if (tag.includes('pointer') || title.includes('pointer') || tag.includes('memori')) {
      return {
        question: 'Kapan sebaiknya Anda menggunakan pointer receiver (*Struct) pada method Go di industri Tokyo?',
        options: [
          'Agar seluruh data struct selalu di-copy ke CPU stack frame baru.',
          'Untuk memodifikasi nilai memori asli tanpa overhead duplikasi payload.',
          'Hanya saat method tidak membutuhkan parameter input apa pun.',
        ],
        correctIndex: 1,
        explanation:
          'Tepat! Pointer receiver (& dan *) mencegah alokasi memori berlebih saat memanggil method pada struct berukuran besar.',
      }
    }

    if (tag.includes('api') || title.includes('gin') || tag.includes('router')) {
      return {
        question: 'Apa peran pemanggilan c.AbortWithStatusJSON() pada Gin middleware di Tokyo?',
        options: [
          'Menghentikan alur pipeline handler seketika saat autentikasi token gagal.',
          'Merestart web server secara otomatis untuk membersihkan memori.',
          'Menghapus seluruh cookie browser pengguna.',
        ],
        correctIndex: 0,
        explanation:
          'Benar! c.AbortWithStatusJSON() mencegah request tidak sah dieksekusi oleh handler controller berikutnya.',
      }
    }

    if (tag.includes('concurrency') || title.includes('goroutine') || tag.includes('channel')) {
      return {
        question: 'Pola apa yang paling efektif untuk membatasi jumlah goroutine simultan agar tidak terjadi memory leak?',
        options: [
          'Menggunakan infinite loop tanpa channel.',
          'Worker Pool Pattern dengan Buffered Channels.',
          'Menonaktifkan garbage collection pada CPU.',
        ],
        correctIndex: 1,
        explanation:
          'Tepat! Worker pool pattern membatasi jumlah worker goroutine aktif sehingga aman dari resource exhaustion.',
      }
    }

    if (tag.includes('typescript') || tag.includes('react') || title.includes('react')) {
      return {
        question: 'Apa manfaat utama menggunakan discriminated unions pada props komponen React?',
        options: [
          'Mempercepat proses kompilasi CSS Tailwind.',
          'Memastikan type safety ketat tanpa celah bug runtime saat fase kompilasi.',
          'Menggantikan kebutuhan state management global.',
        ],
        correctIndex: 1,
        explanation:
          'Benar! Discriminated union membuat TypeScript memeriksa seluruh varian kondisi props secara komprehensif.',
      }
    }

    if (tag.includes('devops') || tag.includes('linux') || tag.includes('docker')) {
      return {
        question: 'Mengapa Docker Multi-Stage Build sangat dianjurkan untuk deployment produksi?',
        options: [
          'Memperkecil ukuran container image drastis dan mengisolasi tools compiler dari image produksi.',
          'Membuat container berjalan tanpa koneksi internet sama sekali.',
          'Menghapus kebutuhan izin akses file POSIX.',
        ],
        correctIndex: 0,
        explanation:
          'Tepat! Multi-stage build menghasilkan container image minimalis (scratch) yang lebih cepat di-deploy dan aman.',
      }
    }

    // Default Japanese / Business Etiquette Quiz
    return {
      question: 'Kapan salam "お疲れ様です (Otsukaresama desu)" paling tepat diucapkan di kantor Tokyo?',
      options: [
        'Hanya saat pertama kali menyapa klien baru di luar kantor.',
        'Sebagai sapaan apresiasi kerja keras rekan kerja sepanjang hari dan saat berpamitan pulang.',
        'Hanya saat melaporkan bug server yang sedang darurat.',
      ],
      correctIndex: 1,
      explanation:
        'Benar! Otsukaresama desu adalah pilar komunikasi esensial di lingkungan engineering Jepang untuk membangun rasa saling menghargai.',
    }
  }, [content])

  if (!isOpen || !content) return null

  const handleCopyCode = () => {
    triggerHaptic('tap')
    navigator.clipboard.writeText(content.codeSnippet)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const handleSpeakJapanese = (text: string) => {
    triggerHaptic('tap')
    setSpeakingTerm(text)
    soundEngine.speakJapanese(
      text,
      () => setSpeakingTerm(null),
      () => setSpeakingTerm(null)
    )
  }

  const handleSelectQuizOption = (idx: number) => {
    if (isAnswered) return
    triggerHaptic('tap')
    setSelectedOption(idx)
    setIsAnswered(true)

    if (idx === activeQuiz.correctIndex) {
      triggerHaptic('success')
      soundEngine.playSuccess()

      if (!quizBonusAwarded) {
        setQuizBonusAwarded(true)
        const bonusXp = 10
        try {
          if (content?.unitNumber) {
            localStorage.setItem(`codeabroad_guidebook_quiz_unit_${content.unitNumber}`, 'true')
          }
        } catch {
          /* ignore storage error */
        }
        window.dispatchEvent(new CustomEvent('codeabroad_xp_gained', { detail: { amount: bonusXp } }))
        if (user) {
          updateUser({ xp: (user.xp || 0) + bonusXp })
        }
      }
    } else {
      triggerHaptic('error')
    }
  }

  const handleStart = () => {
    triggerHaptic('success')
    soundEngine.playSuccess()
    onClose()
    onStartUnit?.()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      {/* Click outside to close backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Modal Card */}
      <div className="relative w-full max-w-2xl bg-white border-2 border-slate-200/90 rounded-3xl shadow-2xl z-10 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* ── 1. MODAL HEADER ── */}
        <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200/80 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 border border-blue-200 text-[10px] font-brand font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <BookOpen weight="fill" className="w-3.5 h-3.5 text-blue-600" />
                <span>Buku Panduan Unit 0{content.unitNumber}</span>
              </span>
              <span className="bg-slate-200 text-slate-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md">
                {content.unitTag}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-brand font-black text-slate-900 tracking-tight">
              {content.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-2xl border-2 border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer shrink-0"
            aria-label="Tutup"
          >
            <X weight="bold" className="w-4 h-4" />
          </button>
        </div>

        {/* ── 2. MODAL BODY (SCROLLABLE) ── */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
          {/* Concept Summary */}
          <div className="space-y-2">
            <h3 className="font-brand font-black text-xs sm:text-sm text-slate-900 flex items-center gap-2">
              <Lightbulb weight="fill" className="w-4 h-4 text-amber-500" />
              <span>Konsep Inti Unit Ini</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium bg-slate-50 border border-slate-200/80 p-4 rounded-2xl">
              {content.summary}
            </p>
          </div>

          {/* Code Snippet Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-brand font-black text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                <Code weight="bold" className="w-4 h-4 text-blue-600" />
                <span>{content.codeSnippetTitle}</span>
              </h3>
              <button
                type="button"
                onClick={handleCopyCode}
                className="text-[11px] font-brand font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
              >
                {copiedCode ? (
                  <>
                    <Check weight="bold" className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy weight="bold" className="w-3.5 h-3.5" />
                    <span>Salin Kode</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-xs overflow-x-auto border-2 border-slate-800 shadow-inner">
              <pre className="leading-relaxed">{content.codeSnippet}</pre>
            </div>
            <p className="text-[11px] text-slate-500 font-medium px-1">
              {content.codeExplanation}
            </p>
          </div>

          {/* Technical Nihongo Highlights with Web Speech TTS */}
          {content.nihongoTerms && content.nihongoTerms.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="font-brand font-black text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                  <Translate weight="bold" className="w-4 h-4 text-rose-500" />
                  <span>Kosakata Bahasa Jepang Kantor (Tech Nihongo)</span>
                </h3>
                <span className="text-[10px] text-slate-400 font-bold hidden sm:inline">
                  Klik 🔊 untuk dengar pelafalan asli
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {content.nihongoTerms.map((term, idx) => {
                  const isSpeaking = speakingTerm === term.term
                  return (
                    <div
                      key={idx}
                      className="p-3 bg-rose-50/50 border border-rose-200/80 rounded-2xl flex items-start justify-between gap-3 shadow-2xs hover:border-rose-300 transition-all"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-brand font-black text-sm text-rose-950">
                            {term.term}
                          </span>
                          <span className="text-[10px] font-mono text-rose-700 font-bold">
                            {term.reading}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 font-medium truncate">
                          {term.meaning}
                        </p>
                      </div>

                      {/* Web Speech TTS Audio Button */}
                      <button
                        type="button"
                        onClick={() => handleSpeakJapanese(term.term)}
                        title={`Dengarkan pelafalan ${term.term}`}
                        className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                          isSpeaking
                            ? 'bg-rose-600 text-white border-rose-700 shadow-sm ring-2 ring-rose-400 animate-pulse'
                            : 'bg-white hover:bg-rose-100 text-rose-600 border-rose-200 shadow-2xs'
                        }`}
                      >
                        <SpeakerSimpleHigh weight={isSpeaking ? 'fill' : 'bold'} className="w-4 h-4" />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── 3. CONCEPT CHECK FLASHCARD QUIZ (Subtask 41.2) ── */}
          <div className="p-4 sm:p-5 bg-gradient-to-br from-indigo-50/70 via-white to-blue-50/50 border-2 border-indigo-200/80 rounded-2xl space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkle weight="fill" className="w-4 h-4 text-indigo-600" />
                <h4 className="font-brand font-black text-xs sm:text-sm text-[#0F172A]">
                  Mini-Kuis Pemahaman Cepat (Bonus +10 XP)
                </h4>
              </div>
              {quizBonusAwarded && (
                <span className="bg-emerald-100 text-emerald-800 font-brand font-black text-[10px] px-2 py-0.5 rounded-full border border-emerald-200">
                  +10 XP DITERIMA ✓
                </span>
              )}
            </div>

            <p className="text-xs font-bold text-slate-800 leading-relaxed">
              {activeQuiz.question}
            </p>

            {/* Options List */}
            <div className="space-y-2">
              {activeQuiz.options.map((option, idx) => {
                const isSelected = selectedOption === idx
                const isCorrect = idx === activeQuiz.correctIndex

                let btnStyles = 'bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50'
                if (isAnswered) {
                  if (isCorrect) {
                    btnStyles = 'bg-emerald-50 border-2 border-emerald-400 text-emerald-900 ring-2 ring-emerald-500/10'
                  } else if (isSelected && !isCorrect) {
                    btnStyles = 'bg-rose-50 border-2 border-rose-300 text-rose-900'
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectQuizOption(idx)}
                    disabled={isAnswered}
                    className={`w-full text-left p-3 rounded-xl text-xs font-semibold flex items-center justify-between gap-3 transition-all cursor-pointer ${btnStyles}`}
                  >
                    <span>{option}</span>
                    {isAnswered && (
                      <span className="shrink-0">
                        {isCorrect ? (
                          <CheckCircle weight="fill" className="w-4 h-4 text-emerald-600" />
                        ) : isSelected ? (
                          <XCircle weight="fill" className="w-4 h-4 text-rose-600" />
                        ) : null}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Explanation Banner */}
            {isAnswered && (
              <div
                className={`p-3 rounded-xl text-xs font-medium leading-relaxed border ${
                  selectedOption === activeQuiz.correctIndex
                    ? 'bg-emerald-100/60 border-emerald-300 text-emerald-950'
                    : 'bg-rose-100/60 border-rose-300 text-rose-950'
                }`}
              >
                <span className="font-black mr-1">
                  {selectedOption === activeQuiz.correctIndex ? '🎉 Luar Biasa!' : '✕ Penjelasan:'}
                </span>
                {activeQuiz.explanation}
              </div>
            )}
          </div>

          {/* Kodi Tokyo Relocation Tip Banner */}
          <div className="p-4 bg-blue-50/70 border-2 border-blue-200/90 rounded-2xl flex items-center gap-3.5 shadow-2xs">
            <img
              src={doodleCoding}
              alt="Kodi Tip"
              className="w-12 h-12 object-contain shrink-0"
            />
            <div className="space-y-0.5">
              <h4 className="font-brand font-black text-xs text-slate-900">
                Kodi Standard Tip (Industri Tokyo):
              </h4>
              <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                {content.tokyoIndustryTip}
              </p>
            </div>
          </div>
        </div>

        {/* ── 3. MODAL FOOTER ── */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Siap mempraktikkan konsep ini di workspace koding?
          </span>

          <div className="flex items-center gap-2.5 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white hover:bg-slate-100 text-xs font-brand font-bold text-slate-700 cursor-pointer shadow-2xs transition-all"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handleStart}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-brand font-black flex items-center gap-1.5 shadow-[0_3px_0_0_#1D4ED8] cursor-pointer active:translate-y-0.5 transition-all"
            >
              <Play weight="fill" className="w-3.5 h-3.5" />
              <span>MULAI KODING SEKARANG (+50 XP) ▶</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
