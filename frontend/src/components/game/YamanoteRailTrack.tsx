import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Award, Gift, Lock, Sparkles } from 'lucide-react'
import { Button3D } from '../ui/Button3D'
import { BadgePill } from '../ui/BadgePill'
import { triggerHaptic } from '../../utils/haptics'

export interface YamanoteRailTrackProps {
  className?: string
  currentStation?: number
  onNavigateToRoadmap?: () => void
}

export const YamanoteRailTrack = ({
  className = '',
  currentStation = 3,
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

  return (
    <div className={`bg-white rounded-3xl border-2 border-[#E2E8F0] p-5 sm:p-6 space-y-6 shadow-sm overflow-hidden relative ${className}`}>
      {/* ── TOP HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-[#2563EB] flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-extrabold text-base text-[#0F172A] tracking-tight">
                Peta Petualangan Kereta Tokyo (Yamanote Line)
              </h3>
              <BadgePill variant="blue" size="sm">
                Stasiun {currentStation} dari 5 Aktif 🚀
              </BadgePill>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Selesaikan modul untuk menggerakkan Shinkansen karirmu menuju Tokyo Central Station.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoToCourses}
          className="text-xs font-black text-[#2563EB] hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
        >
          <span>Buka Peta Lengkap</span>
          <span>➔</span>
        </button>
      </div>

      {/* ── VISUAL RAILWAY TRACK WITH SLEEPERS & MINI TRAIN ── */}
      <div className="hidden md:block relative py-4 px-8 select-none">
        {/* Railway ties / wooden sleepers effect */}
        <div className="absolute top-1/2 -translate-y-1/2 left-10 right-10 h-3 flex justify-between items-center opacity-40 pointer-events-none">
          {Array.from({ length: 28 }).map((_, i) => (
            <div key={i} className="w-1 h-3.5 bg-slate-300 rounded-xs" />
          ))}
        </div>

        {/* Connected Railway Rails */}
        <div className="relative flex items-center">
          {/* Section 1: Akihabara -> Shinjuku (Completed: Green-Blue Rail) */}
          <div className="relative flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-[#10B981] ring-4 ring-emerald-100 flex items-center justify-center shadow-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
          </div>
          <div className="flex-1 h-1.5 bg-gradient-to-r from-[#10B981] to-[#F59E0B]" />

          {/* Section 2: Shinjuku -> Shibuya (Reward Pending: Amber Rail) */}
          <div className="relative flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-[#F59E0B] ring-4 ring-amber-100 flex items-center justify-center shadow-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
          </div>
          <div className="flex-1 h-1.5 bg-gradient-to-r from-[#F59E0B] to-[#2563EB]" />

          {/* Section 3: Shibuya (ACTIVE WITH SHINKANSEN TRAIN) */}
          <div className="relative flex items-center justify-center">
            {/* Pulsing Active Station Node */}
            <div className="w-5 h-5 rounded-full bg-[#2563EB] ring-8 ring-blue-100 flex items-center justify-center shadow-md animate-pulse">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>

            {/* Mini Shinkansen Train Indicator on active station */}
            <div className="absolute -top-7.5 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
              <span className="bg-[#2563EB] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 whitespace-nowrap">
                <span>🚅</span>
                <span>Kamu di Sini</span>
              </span>
              <div className="w-2 h-2 bg-[#2563EB] rotate-45 -mt-1" />
            </div>
          </div>
          <div className="flex-1 h-1.5 bg-dashed bg-slate-300" />

          {/* Section 4: Tokyo Station (Locked: Slate Rail) */}
          <div className="relative flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-slate-300 ring-4 ring-slate-100 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* ── 4 INTERACTIVE TOKYO STATION CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Stasiun Akihabara (Unit 1 - Dasar Go) */}
        <div className="rounded-2xl p-4 bg-[#F8FAFC] border-2 border-slate-200/90 flex flex-col items-center text-center justify-between gap-3 transition-transform hover:-translate-y-0.5">
          <div className="w-full flex items-center justify-between text-[11px] font-mono font-bold text-slate-500">
            <span>STASIUN 01</span>
            <span className="text-emerald-600 font-black">秋葉原</span>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-2xs">
            <Award className="w-6 h-6 stroke-[2.5]" />
          </div>

          <div className="space-y-1">
            <h4 className="font-extrabold text-xs sm:text-sm text-[#0F172A]">
              Akihabara • Dasar Go
            </h4>
            <p className="text-[10px] text-slate-500 font-medium">
              Sintaks Pointer & Strict Typing
            </p>
          </div>

          <span className="w-full bg-[#DCFCE7] text-[#059669] text-[10px] font-black py-1 rounded-xl flex items-center justify-center gap-1">
            <span>✓ LULUS (+200 XP)</span>
          </span>
        </div>

        {/* 2. Stasiun Shinjuku (Unit 2 - Klaim Reward) */}
        <div className="rounded-2xl p-4 bg-[#FFFBEB] border-2 border-amber-300 flex flex-col items-center text-center justify-between gap-3 shadow-xs transition-transform hover:-translate-y-0.5 relative overflow-hidden">
          <div className="w-full flex items-center justify-between text-[11px] font-mono font-bold text-amber-800">
            <span>STASIUN 02</span>
            <span className="font-black">新宿</span>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-600 shadow-2xs animate-bounce">
            <Gift className="w-6 h-6 stroke-[2.5]" />
          </div>

          <div className="space-y-1">
            <h4 className="font-extrabold text-xs sm:text-sm text-amber-950">
              Shinjuku • Peti Hadiah
            </h4>
            <p className="text-[10px] text-amber-800 font-medium">
              Bonus Reward Concurrency
            </p>
          </div>

          <Button3D
            variant="amber"
            size="sm"
            fullWidth
            disabled={claimedReward}
            onClick={handleClaim}
            className="text-[10px] py-1.5"
          >
            {claimedReward ? 'SUDAH DIKLAIM ✓' : 'KLAIM +300 XP ⚡'}
          </Button3D>
        </div>

        {/* 3. Stasiun Shibuya (Unit 3/4 - ACTIVE STATION) */}
        <div className="rounded-2xl p-4 bg-[#EFF6FF] border-2 border-[#2563EB] flex flex-col items-center text-center justify-between gap-3 shadow-md shadow-blue-500/10 ring-4 ring-blue-500/10 transition-transform hover:-translate-y-0.5 relative">
          <div className="w-full flex items-center justify-between text-[11px] font-mono font-bold text-[#1D4ED8]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-ping" />
              <span>STASIUN 03</span>
            </span>
            <span className="font-black">渋谷</span>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-blue-100 border border-blue-300 flex items-center justify-center text-[#2563EB] shadow-2xs">
            <Sparkles className="w-6 h-6 fill-blue-500 text-blue-600" />
          </div>

          <div className="space-y-1 w-full">
            <h4 className="font-extrabold text-xs sm:text-sm text-[#0F172A]">
              Shibuya • REST API Gin
            </h4>
            <div className="w-full h-1.5 bg-blue-200 rounded-full overflow-hidden my-1">
              <div className="w-[85%] h-full bg-[#2563EB] rounded-full" />
            </div>
            <p className="text-[10px] text-[#047857] font-black">
              350/400 XP (Sisa 50 XP)
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/learn/station-3-jwt-middleware')}
            className="w-full bg-[#2563EB] hover:bg-blue-700 active:translate-y-0.5 text-white text-[10px] font-black py-1.5 rounded-xl shadow-[0_2px_0_0_#1D4ED8] transition-all cursor-pointer"
          >
            LANJUTKAN DI SINI ▶
          </button>
        </div>

        {/* 4. Stasiun Tokyo Central (Unit 5 - Locked Tokyo Station) */}
        <div className="rounded-2xl p-4 bg-[#F8FAFC] border-2 border-slate-200/70 flex flex-col items-center text-center justify-between gap-3 opacity-70">
          <div className="w-full flex items-center justify-between text-[11px] font-mono font-bold text-slate-400">
            <span>STASIUN 04</span>
            <span>東京駅</span>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
            <Lock className="w-6 h-6 stroke-[2]" />
          </div>

          <div className="space-y-1">
            <h4 className="font-extrabold text-xs sm:text-sm text-slate-600">
              Tokyo Central • Gate 🗼
            </h4>
            <p className="text-[10px] text-slate-400 font-medium">
              Sponsor Visa & Karier Tokyo
            </p>
          </div>

          <span className="w-full bg-slate-100 text-slate-500 text-[10px] font-black py-1 rounded-xl">
            🔒 TERKUNCI
          </span>
        </div>
      </div>
    </div>
  )
}
