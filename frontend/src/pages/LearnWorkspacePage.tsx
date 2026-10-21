import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLearnWorkspace } from '../hooks'
import { useAuthStore } from '../store/authStore'
import { QuestCompleteModal } from '../components/workspace/QuestCompleteModal'
import { Button3D } from '../components/ui/Button3D'
import { ArrowCounterClockwise } from '@phosphor-icons/react'

export const LearnWorkspacePage = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const {
    quest,
    userCode,
    setUserCode,
    resetUserCode,
    isRunningTests,
    testResult,
    isSubmitting,
    submitResult,
    dismissModal,
    isLoading,
    handleRunTests,
    handleSubmit,
  } = useLearnWorkspace()

  const [activeTab, setActiveTab] = useState<'briefing' | 'nihongo' | 'discuss'>('briefing')
  const primaryFilename = quest?.starter_code?.filename || 'main.go'
  const [activeFile, setActiveFile] = useState<string>(primaryFilename)
  const [prevFilename, setPrevFilename] = useState(quest?.starter_code?.filename)
  if (quest?.starter_code?.filename && quest.starter_code.filename !== prevFilename) {
    setPrevFilename(quest.starter_code.filename)
    setActiveFile(quest.starter_code.filename)
  }
  const [showHint, setShowHint] = useState(false)

  const criteriaList = quest?.acceptance_criteria || []
  const criteriaCount = criteriaList.length > 0 ? criteriaList.length : 1
  const passedCriteriaCount = testResult?.criteria_results
    ? testResult.criteria_results.filter((c) => c.passed).length
    : testResult?.success
    ? criteriaCount
    : 0
  const progressPercent = Math.round((passedCriteriaCount / criteriaCount) * 100)

  // Derive testing states
  const isPassed = testResult?.success === true
  const isFailed = testResult !== null && testResult.success === false

  // Handle Ctrl+Enter shortcut to run tests
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        if (!isRunningTests) {
          handleRunTests()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isRunningTests, handleRunTests])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 space-y-3 font-sans">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-600 font-mono">Memuat Workspace Tokyo...</p>
      </div>
    )
  }

  const lineCount = Math.max(20, userCode.split('\n').length)
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1)

  return (
    <div className="h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-500/20 overflow-hidden">
      {/* ── 1. TOP WORKSPACE NAV (SCREEN 10 / 10B SSOT) ── */}
      <header className="h-16 shrink-0 bg-white border-b-2 border-[#E2E8F0] px-4 sm:px-6 flex items-center justify-between gap-4 z-20">
        {/* Left: Back & Breadcrumb Station Info */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="bg-[#F1F5F9] hover:bg-slate-200 active:translate-y-0.5 text-[#0F172A] font-bold text-xs px-3 py-1.5 rounded-xl transition-all cursor-pointer"
          >
            ← Dashboard
          </button>
          <span className="bg-[#EFF6FF] text-[#2563EB] font-black text-xs px-2 py-0.5 rounded">
            {quest?.chip_label || 'MODUL'}
          </span>
          <h1 className="text-xs sm:text-sm font-black text-[#0F172A] truncate max-w-xs sm:max-w-md">
            {quest?.title || 'Modul Pembelajaran Koding'}
          </h1>
        </div>

        {/* Center: Progress Bar */}
        <div className="hidden md:flex items-center gap-3">
          <span className="text-xs text-[#64748B] font-medium font-mono">
            Kriteria {passedCriteriaCount}/{criteriaCount} ({progressPercent}%)
          </span>
          <div className="w-40 h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2563EB] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Right: Gamification Badges & Hints Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="bg-[#FFFBEB] text-[#D97706] font-black text-xs px-2.5 py-1 rounded-xl">
            🔥 {user?.streak || 1} HARI
          </span>
          <span className="bg-[#EFF6FF] text-[#2563EB] font-black text-xs px-2.5 py-1 rounded-xl">
            ⚡ +{quest?.xp_reward || 50} XP
          </span>
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-[#0F172A] font-bold text-xs px-3 py-1 rounded-xl cursor-pointer"
          >
            💡 Petunjuk
          </button>
        </div>
      </header>

      {/* ── 2. WORKSPACE MAIN STAGE (INSTRUCTIONS LEFT + CODE/TERMINAL RIGHT) ── */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        {/* ══════ LEFT INSTRUCTIONS PANEL (480px width) ══════ */}
        <aside className="w-full lg:w-[480px] shrink-0 bg-white border-b-2 lg:border-b-0 lg:border-r-2 border-[#E2E8F0] p-5 sm:p-6 space-y-4 overflow-y-auto">
          {/* Tabs Row */}
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <button
              type="button"
              onClick={() => setActiveTab('briefing')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'briefing'
                  ? 'bg-[#EFF6FF] text-[#2563EB]'
                  : 'bg-[#F8FAFC] text-[#64748B] hover:bg-slate-100'
              }`}
            >
              📖 Instruksi Misi
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('nihongo')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'nihongo'
                  ? 'bg-[#EFF6FF] text-[#2563EB]'
                  : 'bg-[#F8FAFC] text-[#64748B] hover:bg-slate-100'
              }`}
            >
              🇯🇵 Nihongo Notes
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('discuss')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'discuss'
                  ? 'bg-[#EFF6FF] text-[#2563EB]'
                  : 'bg-[#F8FAFC] text-[#64748B] hover:bg-slate-100'
              }`}
            >
              💬 Diskusi (14)
            </button>
          </div>

          {/* Mission Title & Career Context */}
          <div className="space-y-1">
            <h2 className="font-black text-base text-[#0F172A]">
              Misi: {quest?.title || 'Selesaikan Tantangan Koding'}
            </h2>
            <p className="text-xs text-[#64748B] font-medium">
              Tingkat: <span className="font-bold text-[#2563EB]">{quest?.difficulty || 'Pemula'}</span> • Target: Standar Industri Tokyo
            </p>
          </div>

          {/* Real-World Context Card */}
          <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-4 space-y-1.5">
            <h3 className="font-black text-xs text-[#2563EB]">
              KONTEKS REAL-WORLD TOKYO 🗼
            </h3>
            <p className="text-xs text-[#334155] leading-relaxed">
              {quest?.story_context || quest?.description || 'Tuntaskan instruksi koding di editor sebelah kanan dan pastikan semua kriteria penerimaan terpenuhi melalui unit test runner.'}
            </p>
          </div>

          {/* Nihongo Notes Card */}
          {quest?.nihongo_notes && (
            <div className="bg-[#F0F9FF] border border-sky-200 rounded-xl p-3 flex items-start gap-3">
              <span className="bg-[#0284C7] text-white font-black text-[10px] px-2 py-0.5 rounded shrink-0">
                JLPT N3
              </span>
              <div className="space-y-0.5 text-xs">
                <p className="font-bold text-[#0369A1]">
                  {quest.nihongo_notes.term} {quest.nihongo_notes.reading ? `(${quest.nihongo_notes.reading})` : ''} = {quest.nihongo_notes.meaning}
                </p>
                {quest.nihongo_notes.example && (
                  <p className="text-[11px] text-[#0284C7] leading-relaxed">
                    {quest.nihongo_notes.example}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Acceptance Criteria Box */}
          <div className="bg-white border-2 border-slate-100 rounded-xl p-4 space-y-2.5">
            <h3 className="font-black text-xs text-[#0F172A]">
              KRITERIA PENERIMAAN (ACCEPTANCE CRITERIA)
            </h3>

            <div className="space-y-2 text-xs">
              {criteriaList.length > 0 ? (
                criteriaList.map((criterion, idx) => {
                  const resultCriterion = testResult?.criteria_results?.find(
                    (c) => c.id === criterion.id || c.description === criterion.description
                  )
                  const passed = resultCriterion ? resultCriterion.passed : (isPassed ? true : criterion.passed)
                  const failed = isFailed && resultCriterion && !resultCriterion.passed

                  return (
                    <div key={criterion.id || idx} className="flex items-center gap-2.5">
                      <span
                        className={`w-5 h-5 rounded-md font-black text-xs flex items-center justify-center shrink-0 ${
                          failed
                            ? 'bg-[#DC2626] text-white'
                            : passed
                            ? 'bg-[#EFF6FF] text-[#2563EB]'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {failed ? '✕' : passed ? '✓' : '○'}
                      </span>
                      <span
                        className={`font-medium ${
                          failed ? 'text-[#DC2626] font-bold' : passed ? 'text-[#0F172A]' : 'text-[#64748B]'
                        }`}
                      >
                        {criterion.description}
                        {failed && ' (GAGAL)'}
                      </span>
                    </div>
                  )
                })
              ) : (
                <div className="flex items-center gap-2 text-slate-500 italic">
                  <span>○</span>
                  <span>Selesaikan implementasi sesuai spesifikasi unit test.</span>
                </div>
              )}
            </div>
          </div>

          {/* Failure / Hint Box */}
          {(isFailed || showHint) && (
            <div className="bg-[#FFFBEB] border-2 border-amber-300 rounded-xl p-4 space-y-2 shadow-xs">
              <div className="flex items-center gap-1.5 font-black text-xs text-[#D97706]">
                <span>💡</span>
                <span>PETUNJUK KODING DARI KODI</span>
              </div>
              <p className="text-xs text-[#92400E] leading-relaxed">
                {testResult?.output?.includes('FAIL')
                  ? 'Periksa baris kode yang menyebabkan unit test gagal pada terminal konsol di sebelah kanan. Pastikan fungsi, variabel, dan tipe data telah sesuai ekspektasi.'
                  : 'Pastikan penulisan sintaks Go tepat, tipe data sesuai, dan periksa fungsi pembantu yang diminta oleh test runner.'}
              </p>
            </div>
          )}
        </aside>

        {/* ══════ RIGHT CODE & TERMINAL STAGE (960px width) ══════ */}
        <section className="flex-1 flex flex-col bg-[#0F172A] min-w-0 overflow-hidden">
          {/* 1. Editor Tabs Bar */}
          <div className="h-11 bg-[#1E293B] px-4 flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveFile(primaryFilename)}
                className={`px-3.5 py-2 font-mono text-xs rounded-t-lg flex items-center gap-2 transition-all ${
                  activeFile === primaryFilename
                    ? 'bg-[#0F172A] text-[#F8FAFC] font-bold'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                <span>{primaryFilename}</span>
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isFailed ? 'bg-[#EF4444]' : isPassed ? 'bg-[#10B981]' : 'bg-[#38BDF8]'
                  }`}
                />
              </button>
            </div>

            <button
              type="button"
              onClick={resetUserCode}
              title="Reset Kode ke Template Asli"
              className="text-[#94A3B8] hover:text-white text-xs flex items-center gap-1.5 font-mono cursor-pointer"
            >
              <ArrowCounterClockwise className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* 2. Code Editor Body with Line Numbers */}
          <div className="flex-1 flex p-4 font-mono text-xs overflow-auto bg-[#0F172A] min-h-[280px]">
            {/* Line numbers column */}
            <div className="select-none pr-4 text-right text-[#475569] font-mono text-xs leading-6 space-y-0 shrink-0">
              {lineNumbers.map((num) => (
                <div key={num}>{num}</div>
              ))}
            </div>

            {/* Editable code area */}
            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              spellCheck={false}
              className="flex-1 bg-transparent text-[#F8FAFC] font-mono text-xs leading-6 resize-none focus:outline-none border-none p-0 selection:bg-blue-600/40"
              placeholder="// Tulis kode Go kamu di sini..."
            />
          </div>

          {/* 3. Terminal & Test Runner Console */}
          <div className="h-64 sm:h-72 bg-[#020617] border-t-2 border-[#1E293B] flex flex-col shrink-0">
            {/* Terminal Header */}
            <div className="h-9 bg-[#0B1120] px-4 flex items-center justify-between border-b border-slate-900 shrink-0">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                </div>
                <span className="text-[#94A3B8] font-mono text-[11px] font-bold tracking-wider pl-2">
                  TERMINAL // GO TEST RUNNER {testResult?.duration_ms ? `[${testResult.duration_ms}ms]` : ''}
                </span>
              </div>

              {testResult ? (
                isPassed ? (
                  <span className="bg-[#064E3B] text-[#34D399] font-mono font-bold text-[10px] px-2.5 py-0.5 rounded">
                    ● {testResult.tests_passed}/{testResult.total_tests} TESTS PASSING
                  </span>
                ) : (
                  <span className="bg-[#7F1D1D] text-[#FCA5A5] font-mono font-bold text-[10px] px-2.5 py-0.5 rounded">
                    ✕ {testResult.total_tests - testResult.tests_passed}/{testResult.total_tests} TESTS FAILED
                  </span>
                )
              ) : (
                <span className="text-slate-500 font-mono text-[10px]">
                  IDLE // READY TO RUN
                </span>
              )}
            </div>

            {/* Terminal Log Output */}
            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-1 text-slate-300">
              {isRunningTests ? (
                <p className="text-[#38BDF8] animate-pulse">
                  $ go test -v ./... [Sedang mengeksekusi test runner...]
                </p>
              ) : testResult?.output ? (
                <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed">
                  {testResult.output}
                </pre>
              ) : (
                <div className="space-y-1 text-[#64748B]">
                  <p>$ go test -v ./...</p>
                  <p>Tekan tombol &quot;JALANKAN TES&quot; atau Ctrl+Enter untuk mengeksekusi test runner.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* ── 3. BOTTOM TACTILE ACTION BAR (SCREEN 10 PASS VS SCREEN 10B FAIL) ── */}
      <footer
        className={`h-20 shrink-0 border-t-2 px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 z-30 transition-all ${
          isFailed
            ? 'bg-[#FEF2F2] border-rose-300'
            : isPassed
            ? 'bg-white border-[#E2E8F0]'
            : 'bg-white border-[#E2E8F0]'
        }`}
      >
        {/* Left Status Text */}
        <div className="flex items-center gap-3">
          {isPassed ? (
            <div className="flex items-center gap-2 text-[#0F172A] font-black text-xs sm:text-sm">
              <span className="w-3 h-3 rounded-full bg-[#10B981] shrink-0" />
              <span>Semua pengujian unit test telah lolos! Siap untuk submit misi.</span>
            </div>
          ) : isFailed ? (
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                ✕
              </span>
              <div className="space-y-0.5">
                <p className="font-black text-xs sm:text-sm text-rose-900 flex items-center gap-1.5">
                  <span>Pengujian belum lolos! Ada kriteria yang belum terpenuhi.</span>
                  <span>🎌</span>
                </p>
                <p className="text-[11px] text-rose-700">
                  Kodi: <em>&quot;Ganbatte! Periksa pesan error di terminal konsol dan coba sesuaikan kodenya.&quot;</em>
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-600 text-xs font-bold">
              <span>Lengkapi fungsi di {primaryFilename} untuk menyelesaikan misi koding ini.</span>
            </div>
          )}
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          {isFailed ? (
            <>
              <button
                type="button"
                onClick={() => setShowHint(true)}
                className="bg-[#FFFBEB] hover:bg-amber-100 text-[#D97706] border border-amber-300 font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                💡 Buka Petunjuk (-1)
              </button>
              <button
                type="button"
                onClick={handleRunTests}
                disabled={isRunningTests}
                className="bg-white hover:bg-slate-50 border border-slate-300 text-[#0F172A] font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                ▶ Jalankan Ulang (Ctrl+Enter)
              </button>
              <button
                type="button"
                disabled
                className="bg-[#E2E8F0] text-[#94A3B8] font-black text-xs sm:text-sm px-5 py-3 rounded-2xl cursor-not-allowed"
              >
                SELESAIKAN MISI (BELUM LOLOS)
              </button>
            </>
          ) : isPassed ? (
            <>
              <button
                type="button"
                onClick={resetUserCode}
                className="bg-[#F1F5F9] hover:bg-slate-200 text-[#64748B] font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                ↺ Reset
              </button>
              <button
                type="button"
                onClick={handleRunTests}
                disabled={isRunningTests}
                className="bg-[#F0F9FF] hover:bg-sky-100 text-[#0284C7] font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                ▶ Jalankan Tes (Ctrl+Enter)
              </button>
              <Button3D
                variant="blue"
                size="md"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="text-xs px-6 py-3"
              >
                {isSubmitting ? 'Mengirim...' : 'PERIKSA & SELESAIKAN MISI ✓'}
              </Button3D>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={resetUserCode}
                className="bg-[#F1F5F9] hover:bg-slate-200 text-[#64748B] font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                ↺ Reset
              </button>
              <Button3D
                variant="blue"
                size="md"
                onClick={handleRunTests}
                disabled={isRunningTests}
                className="text-xs px-6 py-3"
              >
                {isRunningTests ? 'Menguji...' : '▶ JALANKAN TES (Ctrl+Enter)'}
              </Button3D>
            </>
          )}
        </div>
      </footer>

      {/* ── 4. CELEBRATION MODAL (SCREEN 11) ── */}
      <QuestCompleteModal
        isOpen={!!submitResult}
        quest={quest}
        submitResult={submitResult}
        onClose={dismissModal}
      />
    </div>
  )
}
