import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Award, Gift, Lock, Sparkles, CheckCircle2 } from 'lucide-react'
import { triggerHaptic } from '../../utils/haptics'
import type { Station } from '../../types/roadmap'

export interface YamanoteRailTrackProps {
  className?: string
  currentStation?: number
  stations?: Station[]
  onNavigateToRoadmap?: () => void
}

export const YamanoteRailTrack = ({
  className = '',
  currentStation = 3,
  stations,
  onNavigateToRoadmap,
}: YamanoteRailTrackProps) => {
  const navigate = useNavigate()
  const [claimedReward, setClaimedReward] = useState(false)

  const handleClaim = () => {
    triggerHaptic('success')
    setClaimedReward(true)
  }

  const handleGoToCourses = () => {
    if (onNavigateToRoadmap) {
      onNavigateToRoadmap()
    } else {
      navigate('/courses')
    }
  }

  // Derive station metadata or fallback to Tokyo Yamanote Line SSOT
  const displayStations = [
    {
      id: stations?.[0]?.id || '1',
      number: 1,
      name: stations?.[0]?.title || 'Akihabara • Dasar Go',
      kanji: '秋葉原',
      desc: stations?.[0]?.description || 'Sintaks Pointer & Strict Typing',
      status: 'completed',
      xp: '+200 XP',
      route: '/courses',
    },
    {
      id: stations?.[1]?.id || '2',
      number: 2,
      name: stations?.[1]?.title || 'Shinjuku • Peti Hadiah',
      kanji: '新宿',
      desc: stations?.[1]?.description || 'Bonus Concurrency & Goroutine Engine',
      status: 'reward',
      xp: '+300 XP',
      route: '/courses',
    },
    {
      id: stations?.[2]?.id || '3',
      number: 3,
      name: stations?.[2]?.title || 'Shibuya • REST API Gin',
      kanji: '渋谷',
      desc: stations?.[2]?.description || 'Routing Engine & JWT Middleware Auth',
      status: 'active',
      xp: '350/400 XP',
      route: '/learn/station-3-jwt-middleware',
    },
    {
      id: stations?.[3]?.id || '4',
      number: 4,
      name: stations?.[3]?.title || 'Tokyo Central • Gate 🗼',
      kanji: '東京駅',
      desc: stations?.[3]?.description || 'Sponsor Visa & Karier Tokyo',
      status: 'locked',
      xp: 'Final Gate',
      route: '/courses',
    },
  ]

  return (
    <div
      className={`bg-[#101827] rounded-3xl border border-[#27364D] p-5 sm:p-6 space-y-6 shadow-xl relative overflow-hidden ${className}`}
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-72 h-40 bg-blue-600/5 blur-3xl pointer-events-none -z-0" />

      {/* ── TOP HEADER: JOURNEY STATUS & MAP LINK ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-9 h-9 rounded-xl bg-[#172236] border border-[#27364D] text-[#38BDF8] flex items-center justify-center shrink-0 shadow-inner">
            <MapPin className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="font-extrabold text-base text-[#F1F5F9] tracking-tight">
                Peta Petualangan Kereta Tokyo (Yamanote Line)
              </h3>
              <span className="bg-[#172236] text-[#38BDF8] border border-[#27364D] text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                Stasiun {currentStation} dari 4 Aktif 🚀
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] font-medium">
              Selesaikan modul koding untuk menggerakkan Shinkansen kariermu menuju Tokyo Central Station.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoToCourses}
          className="text-xs font-bold text-[#38BDF8] hover:text-sky-300 hover:underline flex items-center gap-1.5 cursor-pointer self-start sm:self-auto py-1 transition-colors"
        >
          <span>Buka Peta Lengkap</span>
          <span>➔</span>
        </button>
      </div>

      {/* ── VISUAL CONNECTED RAILWAY TRACK WITH SLEEPERS & BULLET TRAIN INDICATOR (DESKTOP) ── */}
      <div className="hidden md:block relative py-6 px-10 select-none">
        {/* Railway wooden sleeper ties */}
        <div className="absolute top-1/2 -translate-y-1/2 left-12 right-12 h-3 flex justify-between items-center opacity-30 pointer-events-none">
          {Array.from({ length: 32 }).map((_, i) => (
            <div key={i} className="w-1 h-3.5 bg-[#27364D] rounded-xs" />
          ))}
        </div>

        {/* Connected Railway Rails */}
        <div className="relative flex items-center">
          {/* Node 1: Akihabara (Completed Emerald) */}
          <div className="relative flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-[#10B981] ring-4 ring-emerald-950/60 flex items-center justify-center shadow-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
          </div>
          <div className="flex-1 h-1.5 bg-gradient-to-r from-[#10B981] to-[#F5B942]" />

          {/* Node 2: Shinjuku (Reward Amber) */}
          <div className="relative flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-[#F5B942] ring-4 ring-amber-950/60 flex items-center justify-center shadow-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
          </div>
          <div className="flex-1 h-1.5 bg-gradient-to-r from-[#F5B942] to-[#3B82F6]" />

          {/* Node 3: Shibuya (ACTIVE WITH SHINKANSEN TRAIN MARKER) */}
          <div className="relative flex items-center justify-center">
            {/* Glowing active node ring */}
            <div className="w-5 h-5 rounded-full bg-[#3B82F6] ring-8 ring-blue-500/20 flex items-center justify-center shadow-lg animate-pulse">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>

            {/* Shinkansen Night Express Indicator on active station */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
              <span className="bg-[#172236] border border-[#3B82F6] text-[#38BDF8] text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 whitespace-nowrap">
                <span>🚅</span>
                <span>Kamu di Sini</span>
              </span>
              <div className="w-2 h-2 bg-[#172236] border-r border-b border-[#3B82F6] rotate-45 -mt-1" />
            </div>
          </div>
          <div className="flex-1 h-1.5 border-t border-dashed border-[#27364D]" />

          {/* Node 4: Tokyo Station (Locked Slate) */}
          <div className="relative flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-[#27364D] ring-4 ring-slate-900 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#64748B]" />
            </div>
          </div>
        </div>
      </div>

      {/* ── 4 ATMOSPHERIC TOKYO STATION TILES ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Stasiun Akihabara (Completed) */}
        <div className="rounded-2xl p-4 bg-[#172236]/70 border border-[#27364D] hover:border-emerald-500/40 flex flex-col items-center text-center justify-between gap-3 transition-all">
          <div className="w-full flex items-center justify-between text-[11px] font-mono font-bold text-[#94A3B8]">
            <span>STN // 01</span>
            <span className="text-[#10B981] font-black">{displayStations[0].kanji}</span>
          </div>

          <div className="w-11 h-11 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-[#10B981] shadow-inner">
            <Award className="w-5 h-5 stroke-[2.2]" />
          </div>

          <div className="space-y-1">
            <h4 className="font-extrabold text-xs sm:text-sm text-[#F1F5F9]">
              {displayStations[0].name}
            </h4>
            <p className="text-[11px] text-[#94A3B8] font-medium leading-snug">
              {displayStations[0].desc}
            </p>
          </div>

          <span className="w-full bg-emerald-950/40 border border-emerald-500/30 text-[#10B981] text-[10px] font-mono font-bold py-1.5 rounded-xl flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>LULUS (+200 XP)</span>
          </span>
        </div>

        {/* 2. Stasiun Shinjuku (Reward Chest) */}
        <div className="rounded-2xl p-4 bg-[#172236]/90 border border-amber-500/40 hover:border-amber-400 flex flex-col items-center text-center justify-between gap-3 shadow-sm transition-all relative overflow-hidden">
          <div className="w-full flex items-center justify-between text-[11px] font-mono font-bold text-amber-400">
            <span>STN // 02</span>
            <span className="font-black">{displayStations[1].kanji}</span>
          </div>

          <div className="w-11 h-11 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-center text-[#F5B942] shadow-inner animate-bounce">
            <Gift className="w-5 h-5 stroke-[2.2]" />
          </div>

          <div className="space-y-1">
            <h4 className="font-extrabold text-xs sm:text-sm text-[#F1F5F9]">
              {displayStations[1].name}
            </h4>
            <p className="text-[11px] text-[#94A3B8] font-medium leading-snug">
              {displayStations[1].desc}
            </p>
          </div>

          <button
            type="button"
            disabled={claimedReward}
            onClick={handleClaim}
            className={`w-full text-[10px] font-mono font-bold py-2 rounded-xl transition-all cursor-pointer ${
              claimedReward
                ? 'bg-[#172236] text-[#94A3B8] border border-[#27364D] cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-[0_2px_10px_rgba(245,185,66,0.3)]'
            }`}
          >
            {claimedReward ? 'SUDAH DIKLAIM ✓' : 'KLAIM +300 XP ⚡'}
          </button>
        </div>

        {/* 3. Stasiun Shibuya (ACTIVE EXPEDITION STATION) */}
        <div className="rounded-2xl p-4 bg-[#172236] border border-[#3B82F6] flex flex-col items-center text-center justify-between gap-3 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/30 transition-all relative">
          <div className="w-full flex items-center justify-between text-[11px] font-mono font-bold text-[#38BDF8]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-ping" />
              <span>STN // 03 • AKTIF</span>
            </span>
            <span className="font-black">{displayStations[2].kanji}</span>
          </div>

          <div className="w-11 h-11 rounded-2xl bg-blue-950/60 border border-blue-500/40 flex items-center justify-center text-[#38BDF8] shadow-inner">
            <Sparkles className="w-5 h-5 fill-cyan-400 text-cyan-300" />
          </div>

          <div className="space-y-1.5 w-full">
            <h4 className="font-extrabold text-xs sm:text-sm text-[#F1F5F9]">
              {displayStations[2].name}
            </h4>
            {/* Sleek Progress Bar */}
            <div className="w-full h-1.5 bg-[#080D18] rounded-full overflow-hidden border border-[#27364D]">
              <div className="w-[85%] h-full bg-[#38BDF8] rounded-full" />
            </div>
            <p className="text-[10px] text-[#38BDF8] font-mono font-bold">
              {displayStations[2].xp} (Sisa 50 XP)
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(displayStations[2].route)}
            className="w-full bg-[#3B82F6] hover:bg-blue-500 active:translate-y-0.5 text-white text-[10px] font-mono font-bold py-2 rounded-xl transition-all cursor-pointer shadow-md glow-primary"
          >
            LANJUTKAN DI SINI ▶
          </button>
        </div>

        {/* 4. Stasiun Tokyo Central (LOCKED FUTURE GATEWAY) */}
        <div className="rounded-2xl p-4 bg-[#101827] border border-[#27364D]/60 flex flex-col items-center text-center justify-between gap-3 opacity-60">
          <div className="w-full flex items-center justify-between text-[11px] font-mono font-bold text-[#64748B]">
            <span>STN // 04</span>
            <span>{displayStations[3].kanji}</span>
          </div>

          <div className="w-11 h-11 rounded-2xl bg-[#172236] border border-[#27364D] flex items-center justify-center text-[#64748B]">
            <Lock className="w-5 h-5 stroke-[1.8]" />
          </div>

          <div className="space-y-1">
            <h4 className="font-extrabold text-xs sm:text-sm text-[#94A3B8]">
              {displayStations[3].name}
            </h4>
            <p className="text-[11px] text-[#64748B] font-medium leading-snug">
              {displayStations[3].desc}
            </p>
          </div>

          <span className="w-full bg-[#172236] text-[#64748B] border border-[#27364D] text-[10px] font-mono font-bold py-1.5 rounded-xl">
            🔒 TERKUNCI
          </span>
        </div>
      </div>
    </div>
  )
}
