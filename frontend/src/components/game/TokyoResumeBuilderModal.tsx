import { useState, useMemo } from 'react'
import {
  Printer,
  Translate,
  X,
  FileText,
  Sparkle,
} from '@phosphor-icons/react'
import { useAuthStore } from '../../store/authStore'
import { triggerHaptic } from '../../utils/haptics'
import doodleProud from '../../assets/kodi/doodle-proud.png'

export interface TokyoResumeBuilderModalProps {
  isOpen: boolean
  onClose: () => void
  userTrack?: string
}

export type DocumentType = 'rirekisho' | 'keirekisho'
export type DocumentLanguage = 'ja' | 'id'

export const TokyoResumeBuilderModal = ({
  isOpen,
  onClose,
  userTrack = 'golang',
}: TokyoResumeBuilderModalProps) => {
  const { user } = useAuthStore()

  const [docType, setDocType] = useState<DocumentType>('rirekisho')
  const [docLang, setDocLang] = useState<DocumentLanguage>('ja')

  // Candidate Data
  const candidateName = user?.name || user?.username || 'Reza Pratama'
  const candidateEmail = user?.email || 'reza.tokyo@codeabroad.io'
  const candidatePhone = '+62 812-3456-7890 / +81 80-1234-5678'
  const trackLabel = userTrack === 'golang' ? 'Go Backend Engineer' : userTrack === 'frontend' ? 'Frontend Engineer (React/TS)' : 'Cloud & DevOps Engineer'

  const formattedDateJa = useMemo(() => {
    const now = new Date()
    return `${now.getFullYear()}年 ${now.getMonth() + 1}月 ${now.getDate()}日 現在`
  }, [])

  const formattedDateId = useMemo(() => {
    const now = new Date()
    return `${now.getDate()} ${now.toLocaleDateString('id-ID', { month: 'long' })} ${now.getFullYear()}`
  }, [])

  if (!isOpen) return null

  const handlePrint = () => {
    triggerHaptic('tap')
    window.print()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static"
    >
      {/* Click outside to close (hidden on print) */}
      <div className="fixed inset-0 print:hidden" onClick={onClose} />

      {/* Main Container */}
      <div className="relative w-full max-w-4xl bg-white border-2 border-slate-200 rounded-3xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:border-none print:shadow-none print:rounded-none">
        {/* ── MODAL TOP CONTROLS (Hidden during print) ── */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <FileText weight="bold" className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-brand font-black text-sm sm:text-base text-slate-900 leading-tight">
                Generator Resume Tokyo Standard (JIS 履歴書・職務経歴書)
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Format resmi rekrutmen perusahaan teknologi di Jepang siap cetak A4.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Document Type Switcher */}
            <div className="flex items-center bg-slate-200/80 p-0.5 rounded-xl text-xs font-brand font-black">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('tap')
                  setDocType('rirekisho')
                }}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  docType === 'rirekisho'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                履歴書 (Rirekisho)
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('tap')
                  setDocType('keirekisho')
                }}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  docType === 'keirekisho'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                職務経歴書 (Keirekisho)
              </button>
            </div>

            {/* Language Toggle */}
            <button
              type="button"
              onClick={() => {
                triggerHaptic('tap')
                setDocLang(docLang === 'ja' ? 'id' : 'ja')
              }}
              className="px-2.5 py-1.5 rounded-xl border border-slate-300 hover:border-slate-400 text-xs font-brand font-bold text-slate-700 flex items-center gap-1.5 bg-white cursor-pointer active:translate-y-0.5"
            >
              <Translate weight="bold" className="w-4 h-4 text-blue-600" />
              <span>{docLang === 'ja' ? '日本語' : 'Bahasa ID'}</span>
            </button>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-brand font-black flex items-center gap-1.5 shadow-[0_2px_0_0_#1D4ED8] cursor-pointer active:translate-y-0.5"
            >
              <Printer weight="bold" className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl border border-slate-300 hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <X weight="bold" className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── DOCUMENT PREVIEW CANVAS (A4 Ratio Sheet) ── */}
        <div className="p-4 sm:p-8 overflow-y-auto bg-slate-100/70 print:bg-white print:p-0">
          <div className="max-w-[210mm] mx-auto bg-white border border-slate-400 p-6 sm:p-10 shadow-lg text-slate-900 font-sans print:border-none print:shadow-none print:p-0">
            {/* ══════ DOCUMENT 1: RIREKISHO (履歴書 JIS) ══════ */}
            {docType === 'rirekisho' && (
              <div className="space-y-5 text-xs">
                {/* Header Title & Date */}
                <div className="flex items-end justify-between border-b-2 border-slate-900 pb-2">
                  <h1 className="text-2xl sm:text-3xl font-serif font-black tracking-widest">
                    {docLang === 'ja' ? '履 歴 書' : 'RIREKISHO (RESUME JIS)'}
                  </h1>
                  <span className="text-[11px] font-mono text-slate-600">
                    {docLang === 'ja' ? formattedDateJa : formattedDateId}
                  </span>
                </div>

                {/* Personal Profile Info Box */}
                <div className="grid grid-cols-4 border-2 border-slate-900">
                  <div className="col-span-3 border-r-2 border-slate-900">
                    {/* Furigana */}
                    <div className="px-3 py-1 border-b border-slate-300 text-[10px] text-slate-500">
                      {docLang === 'ja' ? 'ふりがな: レザ プラタマ' : 'Nama Lengkap / Romanized Name'}
                    </div>
                    {/* Full Name */}
                    <div className="px-3 py-2 border-b-2 border-slate-900 flex items-baseline justify-between">
                      <span className="text-lg font-brand font-black">{candidateName}</span>
                      <span className="text-[11px] text-slate-600">
                        {docLang === 'ja' ? '1998年 5月 12日生 (満27歳) 男' : '12 Mei 1998 (27 Tahun) Pria'}
                      </span>
                    </div>

                    {/* Address & Contact */}
                    <div className="px-3 py-1.5 border-b border-slate-300">
                      <span className="text-[10px] text-slate-500 block">
                        {docLang === 'ja' ? '現住所 (Address)' : 'Alamat Saat Ini'}:
                      </span>
                      <span className="font-medium">
                        {docLang === 'ja'
                          ? '〒150-0043 東京都渋谷区道玄坂 1-2-3 (日本渡航準備中・インドネシア在住)'
                          : 'Jakarta / Bandung, Indonesia (Siap Relokasi ke Tokyo, Sponsor Visa)'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2">
                      <div className="px-3 py-1.5 border-r border-slate-300">
                        <span className="text-[10px] text-slate-500 block">電話 (Telp):</span>
                        <span className="font-mono">{candidatePhone}</span>
                      </div>
                      <div className="px-3 py-1.5">
                        <span className="text-[10px] text-slate-500 block">E-mail:</span>
                        <span className="font-mono">{candidateEmail}</span>
                      </div>
                    </div>
                  </div>

                  {/* Photo Box */}
                  <div className="col-span-1 flex flex-col items-center justify-center p-2 text-center bg-slate-50 select-none">
                    <img
                      src={doodleProud}
                      alt="Candidate Avatar"
                      className="w-16 h-16 object-contain"
                    />
                    <span className="text-[9px] text-slate-400 mt-1 block">
                      写真貼付位置
                      <br />
                      (30mm × 40mm)
                    </span>
                  </div>
                </div>

                {/* Education & Employment History (学歴・職歴) */}
                <div className="border-2 border-slate-900">
                  <div className="grid grid-cols-12 bg-slate-100 border-b-2 border-slate-900 text-center font-bold py-1 text-[11px]">
                    <span className="col-span-2 border-r border-slate-300">
                      {docLang === 'ja' ? '年' : 'Tahun'}
                    </span>
                    <span className="col-span-1 border-r border-slate-300">
                      {docLang === 'ja' ? '月' : 'Bulan'}
                    </span>
                    <span className="col-span-9">
                      {docLang === 'ja' ? '学 歴 ・ 職 歴' : 'Riwayat Pendidikan & Pekerjaan'}
                    </span>
                  </div>

                  {/* Rows */}
                  {[
                    { y: '2016', m: '08', text: docLang === 'ja' ? 'インドネシア国立大学 工学部 情報工学科 入学' : 'Masuk S1 Teknik Informatika (Bachelor of Computer Science)' },
                    { y: '2020', m: '09', text: docLang === 'ja' ? 'インドネシア国立大学 工学部 情報工学科 卒業 (GPA: 3.75)' : 'Lulus S1 Teknik Informatika (GPA: 3.75)' },
                    { y: '', m: '', text: docLang === 'ja' ? '【職歴】' : '【Riwayat Pekerjaan】' },
                    { y: '2020', m: '10', text: docLang === 'ja' ? 'PT FinTech Solutions 入社 (バックエンドエンジニアとしてGo/PostgreSQL開発に従事)' : 'PT FinTech Solutions - Junior Backend Engineer (Go & PostgreSQL)' },
                    { y: '2023', m: '04', text: docLang === 'ja' ? 'PT Cloud Scale Asia 入社 (シニアエンジニアとしてマイクロサービス構築)' : 'PT Cloud Scale Asia - Senior Software Engineer (Microservices & Docker)' },
                    { y: '2025', m: '11', text: docLang === 'ja' ? 'CodeAbroad Tokyo Chapter エンジニア特待生プログラム修了' : 'Lulus Program Akselerasi Rekrutmen Tokyo CodeAbroad (Go Track)' },
                    { y: '', m: '', text: docLang === 'ja' ? '一　上 (以上)' : '--- SELESAI ---' },
                  ].map((row, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 border-b border-slate-200 py-1.5 px-1 items-center text-[11px]"
                    >
                      <span className="col-span-2 text-center font-mono border-r border-slate-200">
                        {row.y}
                      </span>
                      <span className="col-span-1 text-center font-mono border-r border-slate-200">
                        {row.m}
                      </span>
                      <span className="col-span-9 px-3 font-medium">{row.text}</span>
                    </div>
                  ))}
                </div>

                {/* Licenses & Certifications (免許・資格) */}
                <div className="border-2 border-slate-900">
                  <div className="grid grid-cols-12 bg-slate-100 border-b-2 border-slate-900 text-center font-bold py-1 text-[11px]">
                    <span className="col-span-2 border-r border-slate-300">
                      {docLang === 'ja' ? '年' : 'Tahun'}
                    </span>
                    <span className="col-span-1 border-r border-slate-300">
                      {docLang === 'ja' ? '月' : 'Bulan'}
                    </span>
                    <span className="col-span-9">
                      {docLang === 'ja' ? '免 許 ・ 資 格' : 'Sertifikasi & Lisensi'}
                    </span>
                  </div>

                  {[
                    { y: '2024', m: '12', text: docLang === 'ja' ? '日本語能力試験 (JLPT) N3 認定' : 'Japanese Language Proficiency Test (JLPT) N3' },
                    { y: '2025', m: '08', text: docLang === 'ja' ? 'AWS Certified Solutions Architect – Associate (SAA)' : 'AWS Certified Solutions Architect – Associate' },
                    { y: '2026', m: '02', text: docLang === 'ja' ? 'CodeAbroad Tokyo Certified Backend Engineer (Certificate ID: CA-TYO-2026)' : 'CodeAbroad Tokyo Verified Backend Engineer' },
                  ].map((row, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 border-b border-slate-200 py-1.5 px-1 items-center text-[11px]"
                    >
                      <span className="col-span-2 text-center font-mono border-r border-slate-200">
                        {row.y}
                      </span>
                      <span className="col-span-1 text-center font-mono border-r border-slate-200">
                        {row.m}
                      </span>
                      <span className="col-span-9 px-3 font-medium">{row.text}</span>
                    </div>
                  ))}
                </div>

                {/* Motivation & Self PR (志望動機・自己PR) */}
                <div className="border-2 border-slate-900 p-3 space-y-1.5">
                  <span className="font-bold text-[11px] block text-slate-800">
                    {docLang === 'ja' ? '志望動機・特技・アピールポイント (Alasan Melamar & Keunggulan):' : 'Alasan Melamar & Nilai Tambah:'}
                  </span>
                  <p className="text-[11px] leading-relaxed text-slate-700">
                    {docLang === 'ja'
                      ? '私はバックエンドエンジニアとして、Go言語とGinを用いた高負荷マイクロサービス開発に従事してまいりました。日本企業の高品質なものづくり精神と最先端のテック文化に強く惹かれ、チームに貢献しながらグローバルに挑戦したいと考えております。日本語での朝会（スタンドアップ）やGitHubでのコードレビューも円滑に行えます。'
                      : 'Memiliki pengalaman 4+ tahun dalam merancang REST API skalabilitas tinggi menggunakan Go 1.24, Gin, dan PostgreSQL. Terbiasa dengan arsitektur Clean Architecture, Docker, dan CI/CD. Siap berkomunikasi dalam bahasa Jepang kerja (Asakai & code review) dan berdedikasi penuh untuk relokasi kerja ke Tokyo.'}
                  </p>
                </div>

                {/* Personal Wishes (本人希望記入欄) */}
                <div className="border-2 border-slate-900 p-2.5 flex items-center justify-between">
                  <span className="font-bold text-[11px] text-slate-700">
                    {docLang === 'ja' ? '本人希望記入欄:' : 'Harapan Khusus:'}
                  </span>
                  <span className="text-[11px] font-medium text-slate-600">
                    {docLang === 'ja' ? '給与・勤務時間・勤務地等は、貴社の規定に従います。' : 'Menyesuaikan dengan ketentuan dan regulasi resmi perusahaan.'}
                  </span>
                </div>
              </div>
            )}

            {/* ══════ DOCUMENT 2: SHOKUMU KEIREKISHO (職務経歴書) ══════ */}
            {docType === 'keirekisho' && (
              <div className="space-y-6 text-xs">
                {/* Header */}
                <div className="text-center border-b-2 border-slate-900 pb-3">
                  <h1 className="text-2xl font-serif font-black tracking-widest">
                    {docLang === 'ja' ? '職 務 経 歴 書' : 'SHOKUMU KEIREKISHO (WORK HISTORY)'}
                  </h1>
                  <div className="flex justify-between items-center text-[11px] text-slate-600 pt-2 font-mono">
                    <span>Target Role: {trackLabel}</span>
                    <span>{docLang === 'ja' ? formattedDateJa : formattedDateId}</span>
                  </div>
                  <div className="text-right text-[11px] font-brand font-black pt-0.5">
                    氏名: {candidateName}
                  </div>
                </div>

                {/* Summary (職務要約) */}
                <div className="space-y-1.5">
                  <h2 className="text-xs font-brand font-black bg-slate-900 text-white px-2.5 py-1">
                    {docLang === 'ja' ? '1. 職 務 要 約 (Executive Summary)' : '1. Ringkasan Pengalaman'}
                  </h2>
                  <p className="text-[11px] leading-relaxed text-slate-700 px-1">
                    {docLang === 'ja'
                      ? '大学卒業後、4年以上にわたりソフトウェアエンジニアとしてWebサービスおよび分散バックエンドシステムの設計・開発に従事。Go言語を用いたClean Architectureに基づくAPI開発、PostgreSQLのパフォーマンスチューニング、Docker/Kubernetesによるコンテナ化を得意としております。また、CodeAbroadを通じて東京のIT現場で求められる開発作法と技術日本語を習得しております。'
                      : 'Software Engineer dengan 4+ tahun pengalaman dalam arsitektur sistem backend terdistribusi. Mahir dalam Go, PostgreSQL connection pooling, Gin REST API, Docker, dan pengujian unit otomatis. Memahami alur kerja tim engineering Tokyo dan siap beradaptasi dengan cepat.'}
                  </p>
                </div>

                {/* Technical Skill Matrix (活かせる経験・知識・技術) */}
                <div className="space-y-2">
                  <h2 className="text-xs font-brand font-black bg-slate-900 text-white px-2.5 py-1">
                    {docLang === 'ja' ? '2. 活かせるスキル・技術スタック (Technical Matrix)' : '2. Matriks Keahlian Teknis'}
                  </h2>
                  <table className="w-full border-collapse border border-slate-300 text-[11px]">
                    <tbody>
                      <tr className="border-b border-slate-300">
                        <td className="w-1/3 bg-slate-100 p-2 font-bold border-r border-slate-300">
                          Languages / Bahasa
                        </td>
                        <td className="p-2 font-mono">Go (Golang 1.24), TypeScript, SQL, Japanese (N3/Tech)</td>
                      </tr>
                      <tr className="border-b border-slate-300">
                        <td className="bg-slate-100 p-2 font-bold border-r border-slate-300">
                          Frameworks & Libraries
                        </td>
                        <td className="p-2 font-mono">Gin Gonic, React 19, Vite, Tailwind CSS v4, Pgxpool, JWT</td>
                      </tr>
                      <tr className="border-b border-slate-300">
                        <td className="bg-slate-100 p-2 font-bold border-r border-slate-300">
                          Infrastructure & Cloud
                        </td>
                        <td className="p-2 font-mono">Docker, Kubernetes, AWS (EC2, S3, RDS), Redis, Git/GitHub Actions</td>
                      </tr>
                      <tr>
                        <td className="bg-slate-100 p-2 font-bold border-r border-slate-300">
                          Architecture & Standards
                        </td>
                        <td className="p-2">Clean Architecture, Microservices, RESTful API Design, Unit Testing (100% Coverage)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Detailed Project History (職務経歴詳細) */}
                <div className="space-y-3">
                  <h2 className="text-xs font-brand font-black bg-slate-900 text-white px-2.5 py-1">
                    {docLang === 'ja' ? '3. 職務経歴詳細 (Project Showcases)' : '3. Riwayat Proyek Teknis'}
                  </h2>

                  {/* Project 1 */}
                  <div className="border border-slate-300 p-3 rounded-lg space-y-1.5">
                    <div className="flex justify-between items-baseline border-b pb-1">
                      <span className="font-bold text-slate-900 text-xs">
                        【Project 1】 High-Throughput REST API Engine (Tokyo FinTech Standard)
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">2024.06 - 2025.02</span>
                    </div>
                    <div className="text-[11px] text-slate-700 space-y-1">
                      <p>
                        <strong>役割・規模:</strong> Lead Backend Engineer / チーム4名
                      </p>
                      <p>
                        <strong>使用技術:</strong> Go 1.24, Gin Gonic, PostgreSQL, Redis, Docker, GitHub Actions
                      </p>
                      <p>
                        <strong>概要・実績:</strong>{' '}
                        Clean Architectureを採用し、15,000 req/secのトラフィックに対応するキャッシュレイヤーとConnection Poolingを実装。ユニットテストカバレッジ95%以上を達成し、本番ダウンタイムゼロを実現。
                      </p>
                    </div>
                  </div>

                  {/* Project 2 */}
                  <div className="border border-slate-300 p-3 rounded-lg space-y-1.5">
                    <div className="flex justify-between items-baseline border-b pb-1">
                      <span className="font-bold text-slate-900 text-xs">
                        【Project 2】 Concurrent Task Processor & Worker Pool
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">2023.08 - 2024.04</span>
                    </div>
                    <div className="text-[11px] text-slate-700 space-y-1">
                      <p>
                        <strong>役割・規模:</strong> Systems Engineer / チーム3名
                      </p>
                      <p>
                        <strong>使用技術:</strong> Go Concurrency, Buffered Channels, Mutex Sync, Context Timeout
                      </p>
                      <p>
                        <strong>概要・実績:</strong>{' '}
                        Goroutineリークを防ぐバックプレッシャーリミッター付き非同期バッチ処理ワーカープールを構築。バッチ処理時間を従来の65%削減。
                      </p>
                    </div>
                  </div>
                </div>

                {/* Self PR (自己PR) */}
                <div className="space-y-1.5">
                  <h2 className="text-xs font-brand font-black bg-slate-900 text-white px-2.5 py-1">
                    {docLang === 'ja' ? '4. 自 己 Ｐ Ｒ (Self Promotion)' : '4. Nilai Tambah Diri'}
                  </h2>
                  <p className="text-[11px] leading-relaxed text-slate-700 px-1">
                    {docLang === 'ja'
                      ? '私の強みは「技術習得のスピード」と「異文化適応力」です。英語での技術ドキュメント読解はもちろん、日本語でのエンジニアリングコミュニケーションを日々鍛えており、日本のエンジニアチームと協力して高品質なサービスを作り上げる強い意欲を持っています。即戦力として貴社の事業成長に貢献いたします。'
                      : 'Keunggulan utama saya adalah kecepatan adaptasi teknologi baru dan komunikasi lintas budaya. Terbiasa dengan review kode berstandar ketat dan siap memberikan kontribusi maksimal bagi pertumbuhan ekosistem produk teknologi di Tokyo.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── FOOTER HINT (Hidden during print) ── */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500 font-medium print:hidden flex items-center justify-center gap-2">
          <Sparkle weight="fill" className="w-3.5 h-3.5 text-amber-500" />
          <span>
            Tip: Gunakan opsi cetak <strong>"Save as PDF"</strong> dengan ukuran kertas <strong>A4</strong> dan margin minimum untuk hasil cetak profesional.
          </span>
        </div>
      </div>
    </div>
  )
}
