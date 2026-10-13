import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Check,
  LockSimple,
  Gift,
  Code,
  Sparkle,
} from '@phosphor-icons/react'
import doodleCoding from '../../assets/kodi/doodle-coding.png'
import doodleThinking from '../../assets/kodi/doodle-thinking.png'
import { SpeechBubble } from '../ui/SpeechBubble'
import { triggerHaptic } from '../../utils/haptics'
import type { Station } from '../../types/roadmap'

export interface YamanotePathMapProps {
  className?: string
  currentStation?: number
  stations?: Station[]
  isLoading?: boolean
}

interface PathNode {
  id: string
  number: number
  title: string
  subtitle: string
  status: 'completed' | 'active' | 'locked' | 'milestone'
  route: string
  xpReward: number
}

export const YamanotePathMap = ({
  className = '',
  currentStation = 2,
  stations,
  isLoading = false,
}: YamanotePathMapProps) => {
  const navigate = useNavigate()
  const [selectedNodeNotice, setSelectedNodeNotice] = useState<string | null>(null)

  // Map stations to Duolingo path nodes (100% Bahasa Indonesia)
  const pathNodes: PathNode[] = [
    {
      id: stations?.[0]?.id || 'station-1',
      number: 1,
      title: stations?.[0]?.title || 'Stasiun Akihabara: Dasar Go',
      subtitle: 'Sintaks Pointer, Struct & Strict Typing',
      status: 'completed',
      route: '/courses',
      xpReward: 200,
    },
    {
      id: stations?.[1]?.id || 'station-2',
      number: 2,
      title: stations?.[1]?.title || 'Stasiun Shinjuku: Gin REST API',
      subtitle: 'Routing Engine & JWT Middleware Auth',
      status: 'active',
      route: '/learn/station-3-jwt-middleware',
      xpReward: 350,
    },
    {
      id: stations?.[2]?.id || 'station-3',
      number: 3,
      title: stations?.[2]?.title || 'Stasiun Shibuya: Concurrency',
      subtitle: 'Goroutine, Channels & Worker Pool',
      status: 'locked',
      route: '/courses',
      xpReward: 400,
    },
    {
      id: 'milestone-tokyo',
      number: 4,
      title: 'Stasiun Tokyo Central: Portofolio Akhir',
      subtitle: 'Microservice Siap Produksi untuk Tokyo Tech',
      status: 'milestone',
      route: '/courses',
      xpReward: 500,
    },
  ]

  const handleNodeClick = (node: PathNode) => {
    triggerHaptic('tap')
    if (node.status === 'active') {
      navigate(node.route)
    } else if (node.status === 'completed') {
      setSelectedNodeNotice(`Modul "${node.title}" sudah selesai. Kamu bisa mengulangnya kapan saja.`)
      setTimeout(() => setSelectedNodeNotice(null), 3500)
    } else {
      setSelectedNodeNotice(`Selesaikan "${pathNodes[1].title}" terlebih dahulu untuk membuka modul ini ya!`)
      setTimeout(() => setSelectedNodeNotice(null), 3500)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl border-2 border-slate-200/80 p-8 space-y-8 animate-pulse">
        <div className="h-6 w-48 bg-slate-200 rounded-full mx-auto" />
        <div className="flex flex-col items-center gap-12 py-10">
          <div className="w-18 h-18 rounded-full bg-slate-200" />
          <div className="w-20 h-20 rounded-full bg-slate-200" />
          <div className="w-18 h-18 rounded-full bg-slate-200" />
        </div>
      </div>
    )
  }

  return (
    <div
      className={`bg-white rounded-3xl border-2 border-slate-200/80 p-6 sm:p-8 shadow-sm relative overflow-hidden space-y-6 ${className}`}
    >
      {/* ── PATH HEADER (100% BAHASA INDONESIA) ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base sm:text-lg font-brand font-black text-slate-900 tracking-tight">
            Peta Petualangan: Jalur Yamanote
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Selesaikan modul koding berjenjang untuk melangkah dari stasiun ke stasiun.
          </p>
        </div>

        <span className="self-start sm:self-auto bg-blue-50 text-blue-700 border border-blue-200 text-xs font-brand font-bold px-3 py-1 rounded-full">
          Stasiun {currentStation} dari {pathNodes.length} Aktif
        </span>
      </div>

      {/* ── NOTICE TOAST BAR DARI KODI (JIKA KLIK LOCKED/COMPLETED) ── */}
      {selectedNodeNotice && (
        <div className="bg-amber-50 border-2 border-amber-200 text-amber-900 p-3.5 rounded-2xl text-xs font-medium flex items-center justify-between gap-3 transition-all animate-pop shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={doodleThinking}
              alt="Kodi Berpikir"
              className="w-10 h-10 object-contain shrink-0"
            />
            <span className="font-semibold">{selectedNodeNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setSelectedNodeNotice(null)}
            className="text-amber-700 hover:text-amber-900 font-bold shrink-0 text-sm cursor-pointer p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── ORGANIC S-CURVE THE PATH CONTAINER ── */}
      <div className="relative py-4 w-full max-w-lg mx-auto min-h-[580px] select-none">
        {/* ── 1. DYNAMIC SVG CURVED S-TRACK (BUKAN BATANG LURUS) ── */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 400 580"
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Base Solid Track Line */}
          <path
            d="M 150 50 C 150 110, 270 110, 270 190 C 270 280, 130 270, 130 360 C 130 440, 200 440, 200 500"
            stroke="#E2E8F0"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Metro Railway Sleeper Dashed Line */}
          <path
            d="M 150 50 C 150 110, 270 110, 270 190 C 270 280, 130 270, 130 360 C 130 440, 200 440, 200 500"
            stroke="#94A3B8"
            strokeWidth="4"
            strokeDasharray="10 12"
            strokeLinecap="round"
            opacity="0.55"
          />
        </svg>

        {/* ── 2. ATMOSPHERIC WORLD PROPS (SUBTLE TOKYO DECORATIONS) ── */}
        {/* Mini Sakura Tree on Top-Right Curve */}
        <div className="absolute right-8 top-16 hidden sm:flex flex-col items-center opacity-75 pointer-events-none animate-float">
          <span className="text-2xl select-none">🌸</span>
          <span className="text-[9px] font-brand font-bold text-slate-400 bg-white/80 px-1.5 py-0.5 rounded-full border border-slate-100 shadow-2xs mt-0.5">
            Taman Ueno
          </span>
        </div>

        {/* Mini Metro Pole on Left Curve */}
        <div className="absolute left-4 top-[320px] hidden sm:flex items-center gap-1 opacity-70 pointer-events-none">
          <div className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-brand font-black text-[9px] flex items-center justify-center shadow-2xs">
            JY
          </div>
          <span className="text-[9px] font-bold text-slate-400 font-mono">
            Rel Yamanote
          </span>
        </div>

        {/* ── 3. INTERACTIVE STEPPING-STONE NODES ── */}
        <div className="relative z-10 w-full h-[580px]">
          {/* ════ STASIUN 1: AKIHABARA (COMPLETED - KIRI) ════ */}
          <div className="absolute left-[20%] sm:left-[24%] top-4 -translate-x-1/2 flex flex-col items-center text-center">
            <button
              type="button"
              onClick={() => handleNodeClick(pathNodes[0])}
              className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 active:translate-y-1 text-white shadow-[0_5px_0_0_#047857] active:shadow-none flex items-center justify-center transition-all cursor-pointer group"
              title={pathNodes[0].title}
            >
              <Check weight="bold" className="w-7 h-7 stroke-[3] transition-transform group-hover:scale-110" />
            </button>
            <div className="mt-2 max-w-[160px]">
              <h5 className="font-brand font-bold text-xs text-slate-900 leading-snug">
                {pathNodes[0].title}
              </h5>
              <span className="text-[10px] font-bold text-emerald-600">
                Selesai (+{pathNodes[0].xpReward} XP)
              </span>
            </div>
          </div>

          {/* ════ STASIUN 2: SHINJUKU (ACTIVE FOCAL POINT - KANAN DENGAN KODI) ════ */}
          <div className="absolute right-[8%] sm:right-[15%] top-38 flex flex-col items-center text-center">
            {/* Kodi Grounded Living Companion (Berdiri di Sebelah Kiri Node) */}
            <div className="absolute -left-36 sm:-left-44 -top-8 hidden md:flex flex-col items-center select-none z-20">
              {/* Comic Speech Bubble di Atas Kepala Kodi */}
              <div className="mb-1">
                <SpeechBubble direction="bottom" variant="light" className="text-[11px] font-bold text-slate-800 border-2 border-blue-200 py-1.5 px-3 whitespace-nowrap shadow-xs">
                  Ayo 1 materi lagi! 💻
                </SpeechBubble>
              </div>

              {/* Kodi Avatar dengan Grounded Shadow Base */}
              <div className="relative flex flex-col items-center">
                <img
                  src={doodleCoding}
                  alt="Kodi Ngoding"
                  className="w-18 h-18 object-contain drop-shadow-sm transition-transform hover:-translate-y-1"
                />
                {/* Pijakan Kaki (Grounded Shadow Base) */}
                <div className="w-16 h-4 bg-slate-200/70 rounded-[50%] blur-2xs -mt-1" />
              </div>
            </div>

            {/* Active Node with Circular SVG Progress Ring */}
            <div className="relative">
              {/* Outer Circular SVG Progress Ring (60% Progress) */}
              <svg className="w-24 h-24 absolute -top-2 -left-2 -rotate-90 pointer-events-none">
                <circle
                  cx="48"
                  cy="48"
                  r="42"
                  stroke="#E2E8F0"
                  strokeWidth="5"
                  fill="none"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="42"
                  stroke="#3B82F6"
                  strokeWidth="5"
                  strokeDasharray="264"
                  strokeDashoffset="95"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>

              {/* 3D Push-Down Active Button */}
              <button
                type="button"
                onClick={() => handleNodeClick(pathNodes[1])}
                className="w-20 h-20 rounded-full bg-blue-600 hover:bg-blue-500 active:translate-y-1 text-white shadow-[0_5px_0_0_#1D4ED8] active:shadow-none flex items-center justify-center transition-all cursor-pointer ring-4 ring-blue-100 group relative z-10"
                title={pathNodes[1].title}
              >
                <Code weight="bold" className="w-8 h-8 transition-transform group-hover:scale-110" />
              </button>
            </div>

            {/* Active Station Label Card */}
            <div className="mt-2.5 text-center bg-white border-2 border-blue-200/90 rounded-2xl px-3.5 py-1.5 shadow-xs max-w-[200px]">
              <span className="text-[10px] font-brand font-black uppercase text-blue-600 tracking-wider flex items-center justify-center gap-1">
                <Sparkle weight="fill" className="w-3 h-3 text-blue-500" />
                <span>Sedang Berjalan</span>
              </span>
              <h4 className="font-brand font-black text-xs text-slate-900 leading-snug mt-0.5">
                {pathNodes[1].title}
              </h4>
              <p className="text-[10px] text-slate-500 font-medium">
                {pathNodes[1].subtitle}
              </p>
            </div>
          </div>

          {/* ════ STASIUN 3: SHIBUYA (LOCKED - KIRI) ════ */}
          <div className="absolute left-[18%] sm:left-[22%] top-74 -translate-x-1/2 flex flex-col items-center text-center opacity-75">
            <button
              type="button"
              onClick={() => handleNodeClick(pathNodes[2])}
              className="w-16 h-16 rounded-full bg-slate-100 hover:bg-slate-200 active:translate-y-1 text-slate-400 border-2 border-slate-200 shadow-[0_4px_0_0_#CBD5E1] active:shadow-none flex items-center justify-center transition-all cursor-pointer group"
              title={`${pathNodes[2].title} - Terkunci`}
            >
              <LockSimple weight="bold" className="w-6 h-6 transition-transform group-hover:scale-105" />
            </button>
            <div className="mt-2 max-w-[160px]">
              <h5 className="font-brand font-bold text-xs text-slate-600">
                {pathNodes[2].title}
              </h5>
              <span className="text-[10px] font-medium text-slate-400">
                Terkunci
              </span>
            </div>
          </div>

          {/* ════ STASIUN 4: TOKYO CENTRAL (MILESTONE PODIUM 3D - TENGAH) ════ */}
          <div className="absolute left-1/2 bottom-2 -translate-x-1/2 flex flex-col items-center text-center">
            {/* 3D Milestone Podium Base */}
            <div className="p-3 bg-amber-50/80 border-2 border-amber-200 rounded-3xl shadow-[0_4px_0_0_#FDE68A] flex flex-col items-center">
              <button
                type="button"
                onClick={() => handleNodeClick(pathNodes[3])}
                className="w-18 h-18 rounded-2xl bg-amber-400 hover:bg-amber-300 active:translate-y-1 text-amber-950 shadow-[0_5px_0_0_#B45309] active:shadow-none flex items-center justify-center transition-all cursor-pointer group"
                title={pathNodes[3].title}
              >
                <Gift weight="fill" className="w-8 h-8 transition-transform group-hover:scale-110" />
              </button>

              <div className="mt-2 max-w-[210px]">
                <h5 className="font-brand font-black text-xs text-slate-900 leading-snug">
                  {pathNodes[3].title}
                </h5>
                <span className="text-[10px] font-brand font-black text-amber-600">
                  Podium Hadiah (+{pathNodes[3].xpReward} XP)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
