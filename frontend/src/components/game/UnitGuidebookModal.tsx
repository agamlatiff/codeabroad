import {
  BookOpen,
  Code,
  Translate,
  Lightbulb,
  X,
  Play,
  Copy,
  Check,
} from '@phosphor-icons/react'
import { useState } from 'react'
import { triggerHaptic } from '../../utils/haptics'
import { soundEngine } from '../../utils/audio'
import doodleCoding from '../../assets/kodi/doodle-coding.png'

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
  const [copiedCode, setCopiedCode] = useState(false)

  if (!isOpen || !content) return null

  const handleCopyCode = () => {
    triggerHaptic('tap')
    navigator.clipboard.writeText(content.codeSnippet)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
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

          {/* Technical Nihongo Highlights */}
          {content.nihongoTerms && content.nihongoTerms.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-brand font-black text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                <Translate weight="bold" className="w-4 h-4 text-rose-500" />
                <span>Kosakata Bahasa Jepang Kantor (Tech Nihongo)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {content.nihongoTerms.map((term, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-rose-50/50 border border-rose-200/80 rounded-xl space-y-0.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-brand font-black text-xs text-rose-950">
                        {term.term}
                      </span>
                      <span className="text-[10px] font-mono text-rose-700 font-bold">
                        {term.reading}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium">{term.meaning}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Kodi Tokyo Relocation Tip Banner */}
          <div className="p-4 bg-blue-50/70 border-2 border-blue-200/90 rounded-2xl flex items-center gap-3.5">
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
            Siap mempraktikkan konsep ini?
          </span>

          <div className="flex items-center gap-2.5 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-xs font-brand font-bold text-slate-700 cursor-pointer"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handleStart}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-brand font-black flex items-center gap-1.5 shadow-[0_2px_0_0_#1D4ED8] cursor-pointer active:translate-y-0.5"
            >
              <Play weight="fill" className="w-3.5 h-3.5" />
              <span>Mulai Sesi Unit Ini ▶</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
