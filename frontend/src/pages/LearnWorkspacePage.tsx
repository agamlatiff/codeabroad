import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLearnWorkspace } from '../hooks'
import { QuestCompleteModal } from '../components/workspace/QuestCompleteModal'
import {
  RotateCcw,
} from 'lucide-react'

export const LearnWorkspacePage = () => {
  const navigate = useNavigate()
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
  const [activeFile, setActiveFile] = useState<'handler.go' | 'handler_test.go' | 'main.go'>('handler.go')
  const [showHint, setShowHint] = useState(false)

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
            onClick={() => navigate('/courses')}
            className="bg-[#F1F5F9] hover:bg-slate-200 active:translate-y-0.5 text-[#0F172A] font-bold text-xs px-3 py-1.5 rounded-xl transition-all cursor-pointer"
          >
            ← Silabus
          </button>
          <span className="bg-[#EFF6FF] text-[#2563EB] font-black text-xs px-2 py-0.5 rounded">
            {quest?.chip_label || 'GIN // 04'}
          </span>
          <h1 className="text-xs sm:text-sm font-black text-[#0F172A] truncate max-w-xs sm:max-w-md">
            Station 3 • Bab 2: REST Handler & Auth Middleware
          </h1>
        </div>

        {/* Center: Progress Bar */}
        <div className="hidden md:flex items-center gap-3">
          <span className="text-xs text-[#64748B] font-medium font-mono">
            Step 2/4 (50%)
          </span>
          <div className="w-40 h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
            <div className="w-[50%] h-full bg-[#2563EB] rounded-full" />
          </div>
        </div>

        {/* Right: Gamification Badges & Hints Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="bg-[#FFFBEB] text-[#D97706] font-black text-xs px-2.5 py-1 rounded-xl">
            🔥 5 HARI
          </span>
          <span className="bg-[#EFF6FF] text-[#2563EB] font-black text-xs px-2.5 py-1 rounded-xl">
            ⚡ +50 XP
          </span>
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-[#0F172A] font-bold text-xs px-3 py-1 rounded-xl cursor-pointer"
          >
            💡 Petunjuk (3)
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
              Misi: Validasi Bearer Token JWT Middleware
            </h2>
            <p className="text-xs text-[#64748B] font-medium">
              Karier Tokyo Target: Startup FinTech Shibuya • Backend Specialist (Go Gin)
            </p>
          </div>

          {/* Real-World Context Card */}
          <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-4 space-y-1.5">
            <h3 className="font-black text-xs text-[#2563EB]">
              KONTEKS REAL-WORLD TOKYO 🗼
            </h3>
            <p className="text-xs text-[#334155] leading-relaxed">
              Di sebagian besar microservices di Jepang, setiap request antar-service maupun client mobile wajib diverifikasi melalui HTTP Middleware sebelum mencapai endpoint controller utama. Tugasmu adalah melengkapi fungsi AuthMiddleware() di file handler.go.
            </p>
          </div>

          {/* Nihongo Notes Card */}
          <div className="bg-[#F0F9FF] border border-sky-200 rounded-xl p-3 flex items-start gap-3">
            <span className="bg-[#0284C7] text-white font-black text-[10px] px-2 py-0.5 rounded shrink-0">
              JLPT N3
            </span>
            <div className="space-y-0.5 text-xs">
              <p className="font-bold text-[#0369A1]">
                認可 (Nin-ka) = Authorization | 認証 (Nin-shō) = Authentication
              </p>
              <p className="text-[11px] text-[#0284C7] leading-relaxed">
                Istilah kunci dalam code review & dokumentasi Jira tim tech Jepang.
              </p>
            </div>
          </div>

          {/* Acceptance Criteria Box */}
          <div className="bg-white border-2 border-slate-100 rounded-xl p-4 space-y-2.5">
            <h3 className="font-black text-xs text-[#0F172A]">
              KRITERIA PENERIMAAN (ACCEPTANCE CRITERIA)
            </h3>

            <div className="space-y-2 text-xs">
              {/* Criterion 1 */}
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-md bg-[#EFF6FF] text-[#2563EB] font-black text-xs flex items-center justify-center shrink-0">
                  ✓
                </span>
                <span className="text-[#0F172A] font-medium">
                  Ambil header &apos;Authorization&apos; dari c.GetHeader()
                </span>
              </div>

              {/* Criterion 2 (Changes based on test failure) */}
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-5 h-5 rounded-md font-black text-xs flex items-center justify-center shrink-0 ${
                    isFailed
                      ? 'bg-[#DC2626] text-white'
                      : isPassed
                      ? 'bg-[#EFF6FF] text-[#2563EB]'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isFailed ? '✕' : isPassed ? '✓' : '○'}
                </span>
                <span
                  className={`font-medium ${
                    isFailed ? 'text-[#DC2626] font-bold' : isPassed ? 'text-[#0F172A]' : 'text-[#64748B]'
                  }`}
                >
                  {isFailed
                    ? 'Periksa apakah format diawali prefix \'Bearer \' (GAGAL)'
                    : 'Periksa apakah format diawali prefix \'Bearer \''}
                </span>
              </div>

              {/* Criterion 3 */}
              <div className="flex items-center gap-2.5">
                <span className={`w-5 h-5 rounded-md font-black text-xs flex items-center justify-center shrink-0 ${isPassed ? 'bg-[#EFF6FF] text-[#2563EB]' : 'bg-slate-100 text-slate-400'}`}>
                  {isPassed ? '✓' : '○'}
                </span>
                <span className="text-[#64748B] font-medium">
                  Jika invalid, abort dengan c.AbortWithStatusJSON(401, ...)
                </span>
              </div>

              {/* Criterion 4 */}
              <div className="flex items-center gap-2.5">
                <span className={`w-5 h-5 rounded-md font-black text-xs flex items-center justify-center shrink-0 ${isPassed ? 'bg-[#EFF6FF] text-[#2563EB]' : 'bg-slate-100 text-slate-400'}`}>
                  {isPassed ? '✓' : '○'}
                </span>
                <span className="text-[#64748B] font-medium">
                  Jika valid, simpan claims ke c.Set() dan panggil c.Next()
                </span>
              </div>
            </div>
          </div>

          {/* Screen 10B Failure Hint Box */}
          {(isFailed || showHint) && (
            <div className="bg-[#FFFBEB] border-2 border-amber-300 rounded-xl p-4 space-y-2 shadow-xs">
              <div className="flex items-center gap-1.5 font-black text-xs text-[#D97706]">
                <span>💡</span>
                <span>PETUNJUK KODING DARI KODI</span>
              </div>
              <p className="text-xs text-[#92400E] leading-relaxed">
                Fungsi test mengharapkan status HTTP 401 saat token tidak diawali dengan &apos;Bearer &apos;. Pastikan kamu menggunakan package strings.HasPrefix(authHeader, &quot;Bearer &quot;) untuk memeriksa token sebelum diproses lebih lanjut.
              </p>
            </div>
          )}
        </aside>

        {/* ══════ RIGHT CODE & TERMINAL STAGE (960px width) ══════ */}
        <section className="flex-1 flex flex-col bg-[#0F172A] min-w-0 overflow-hidden">
          {/* 1. Editor Tabs Bar */}
          <div className="h-11 bg-[#1E293B] px-4 flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-1">
              {/* handler.go */}
              <button
                type="button"
                onClick={() => setActiveFile('handler.go')}
                className={`px-3.5 py-2 font-mono text-xs rounded-t-lg flex items-center gap-2 transition-all ${
                  activeFile === 'handler.go'
                    ? 'bg-[#0F172A] text-[#F8FAFC] font-bold'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                <span>handler.go</span>
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isFailed ? 'bg-[#EF4444]' : isPassed ? 'bg-[#10B981]' : 'bg-[#38BDF8]'
                  }`}
                />
              </button>

              {/* handler_test.go */}
              <button
                type="button"
                onClick={() => setActiveFile('handler_test.go')}
                className={`px-3 py-2 font-mono text-xs rounded-t-lg transition-all ${
                  activeFile === 'handler_test.go'
                    ? 'bg-[#0F172A] text-[#F8FAFC] font-bold'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                handler_test.go
              </button>

              {/* main.go */}
              <button
                type="button"
                onClick={() => setActiveFile('main.go')}
                className={`px-3 py-2 font-mono text-xs rounded-t-lg transition-all ${
                  activeFile === 'main.go'
                    ? 'bg-[#0F172A] text-[#F8FAFC] font-bold'
                    : 'text-[#64748B] hover:text-white'
                }`}
              >
                main.go
              </button>
            </div>

            <button
              type="button"
              onClick={resetUserCode}
              title="Reset Kode ke Template Asli"
              className="text-[#94A3B8] hover:text-white text-xs flex items-center gap-1.5 font-mono cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
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
                  TERMINAL // GO TEST RUNNER
                </span>
              </div>

              {isPassed ? (
                <span className="bg-[#064E3B] text-[#34D399] font-mono font-bold text-[10px] px-2.5 py-0.5 rounded">
                  ● 2/2 TESTS PASSING
                </span>
              ) : isFailed ? (
                <span className="bg-[#7F1D1D] text-[#FCA5A5] font-mono font-bold text-[10px] px-2.5 py-0.5 rounded">
                  ✕ 1/2 TESTS FAILED
                </span>
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
                  $ go test -v ./internal/middleware/... [Sedang menguji...]
                </p>
              ) : testResult?.output ? (
                <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed">
                  {testResult.output}
                </pre>
              ) : (
                <div className="space-y-1 text-[#64748B]">
                  <p>$ go test -v ./internal/middleware/...</p>
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
              <span className="w-7 h-7 rounded-xl bg-[#EF4444] text-white flex items-center justify-center font-black text-xs shrink-0">
                ✕
              </span>
              <div className="space-y-0.5">
                <p className="font-black text-xs sm:text-sm text-[#991B1B]">
                  Ups, pengujian belum lolos! Ada 1 kriteria yang belum terpenuhi.
                </p>
                <p className="text-[11px] text-[#B91C1C]">
                  Periksa terminal error di atas atau buka petunjuk untuk panduan.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-600 text-xs font-bold">
              <span>Lengkapi fungsi AuthMiddleware() untuk menguji kesiapan microservice Tokyo.</span>
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
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-[#2563EB] hover:bg-blue-700 active:translate-y-0.5 text-white font-black text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-[0_4px_0_0_#1D4ED8] transition-all cursor-pointer"
              >
                {isSubmitting ? 'Mengirim...' : 'PERIKSA & SELESAIKAN MISI ✓'}
              </button>
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
              <button
                type="button"
                onClick={handleRunTests}
                disabled={isRunningTests}
                className="bg-[#2563EB] hover:bg-blue-700 active:translate-y-0.5 text-white font-black text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-[0_4px_0_0_#1D4ED8] transition-all cursor-pointer"
              >
                {isRunningTests ? 'Menguji...' : '▶ JALANKAN TES (Ctrl+Enter)'}
              </button>
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
