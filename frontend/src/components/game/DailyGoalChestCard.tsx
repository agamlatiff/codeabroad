import { useState } from 'react'
import { Sparkle, Check, Trophy, Lightning } from '@phosphor-icons/react'
import { triggerHaptic } from '../../utils/haptics'
import { Button3D } from '../ui/Button3D'

export interface DailyGoalChestCardProps {
  currentXp?: number
  targetXp?: number
  className?: string
}

/**
 * 3D Isometric Gold Treasure Chest Vector
 * Rich Duolingo-grade 3D vector with wooden slats, golden brass bands, and specular sheen.
 */
const GoldChest3D = ({ isReady = false }: { isReady?: boolean }) => (
  <svg viewBox="0 0 56 56" className="w-14 h-14 shrink-0 drop-shadow-md select-none" fill="none">
    {/* Ambient Cast Shadow */}
    <ellipse cx="28" cy="50" rx="22" ry="4.5" fill="#0F172A" fillOpacity="0.12" />

    {/* Chest Body Base (Wood Slab) */}
    <rect x="7" y="24" width="42" height="23" rx="5" fill="#92400E" />
    <rect x="7" y="23" width="42" height="22" rx="5" fill="#B45309" />
    <rect x="8" y="25" width="40" height="19" rx="4" fill="#D97706" />

    {/* Wood Texture Planks */}
    <line x1="8" y1="31" x2="48" y2="31" stroke="#92400E" strokeWidth="1.5" strokeOpacity="0.4" />
    <line x1="8" y1="38" x2="48" y2="38" stroke="#92400E" strokeWidth="1.5" strokeOpacity="0.4" />

    {/* Base Bottom 3D Bevel Rim */}
    <path
      d="M7 41C7 43.8 9.2 46 12 46H44C46.8 46 49 43.8 49 41V44C49 46.8 46.8 49 44 49H12C9.2 49 7 46.8 7 44V41Z"
      fill="#78350F"
    />

    {/* Brass Reinforcement Straps (Vertical) */}
    <rect x="14" y="23" width="5" height="23" fill="#78350F" />
    <rect x="14.5" y="23" width="4" height="22" fill="#F59E0B" />
    <rect x="15" y="23" width="2" height="22" fill="#FEF08A" />

    <rect x="37" y="23" width="5" height="23" fill="#78350F" />
    <rect x="37.5" y="23" width="4" height="22" fill="#F59E0B" />
    <rect x="38" y="23" width="2" height="22" fill="#FEF08A" />

    {/* Brass Rivet Studs */}
    <circle cx="16.5" cy="27" r="1.2" fill="#78350F" />
    <circle cx="16.5" cy="42" r="1.2" fill="#78350F" />
    <circle cx="39.5" cy="27" r="1.2" fill="#78350F" />
    <circle cx="39.5" cy="42" r="1.2" fill="#78350F" />

    {/* Chest Domed Lid (3D Curved Top) */}
    <path
      d="M5 21C5 10.5 12 6 28 6C44 6 51 10.5 51 21C51 23.5 49 25 45 25H11C7 25 5 23.5 5 21Z"
      fill="#78350F"
    />
    <path
      d="M5 19C5 9 12 5 28 5C44 5 51 9 51 19C51 21.5 49 23.5 45 23.5H11C7 23.5 5 21.5 5 19Z"
      fill="#F59E0B"
    />
    <path
      d="M6.5 18C7.5 9.5 14 6.5 28 6.5C42 6.5 48.5 9.5 49.5 18C49 20 46.5 21.5 43 21.5H13C9.5 21.5 7 20 6.5 18Z"
      fill="#FBBF24"
    />

    {/* Lid Specular Highlight Arc */}
    <path
      d="M11 13C16 8.5 22 7.5 28 7.5C34 7.5 40 8.5 45 13"
      stroke="#FEF9C3"
      strokeWidth="2.5"
      strokeLinecap="round"
    />

    {/* Golden Straps on Curved Lid */}
    <path d="M14 7C14 7 14 18 14 23.5H18.5C18.5 18 18.5 7 18.5 7H14Z" fill="#F59E0B" />
    <path d="M15 7C15 7 15 18 15 23.5H17.5C17.5 18 17.5 7 17.5 7H15Z" fill="#FEF08A" />

    <path d="M37.5 7C37.5 7 37.5 18 37.5 23.5H42C42 18 42 7 42 7H37.5Z" fill="#F59E0B" />
    <path d="M38.5 7C38.5 7 38.5 18 38.5 23.5H41C41 18 41 7 41 7H38.5Z" fill="#FEF08A" />

    {/* Golden Lock Escutcheon Plate & Clasp */}
    <rect x="23" y="19" width="10" height="12" rx="3" fill="#78350F" />
    <rect x="24" y="20" width="8" height="10" rx="2" fill="#FDE047" />
    <circle cx="28" cy="24" r="1.8" fill="#78350F" />
    <path d="M27.2 24.5L26.5 27.5H29.5L28.8 24.5H27.2Z" fill="#78350F" />

    {/* Sparkle Glints (Dynamic or Always Present for Magic) */}
    <path
      d="M44 8L45.5 12.5L50 14L45.5 15.5L44 20L42.5 15.5L38 14L42.5 12.5L44 8Z"
      fill="#FDE047"
      className="animate-pulse"
    />
    <path
      d="M10 10L11.2 12.8L14 14L11.2 15.2L10 18L8.8 15.2L6 14L8.8 12.8L10 10Z"
      fill="#FFFBEB"
      className={isReady ? 'animate-ping' : ''}
    />
  </svg>
)

/**
 * DailyGoalChestCard — Peti Hadiah & Target 50 XP Harian
 * Desain 3D Gamifikasi ala Duolingo dengan Peti Emas Taktil.
 */
export const DailyGoalChestCard = ({
  currentXp = 35,
  targetXp = 50,
  className = '',
}: DailyGoalChestCardProps) => {
  const [claimed, setClaimed] = useState(false)
  const isGoalReached = currentXp >= targetXp || claimed
  const progressPercent = Math.min(100, Math.round((currentXp / targetXp) * 100))

  const handleClaimChest = () => {
    triggerHaptic('success')
    setClaimed(true)
  }

  return (
    <div
      className={`bg-white border-2 border-slate-200/80 rounded-2xl p-3.5 space-y-2.5 shadow-2xs relative select-none ${className}`}
    >
      {/* ── CARD HEADER ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 shadow-[0_2px_0_0_#B45309] text-amber-950 flex items-center justify-center shrink-0">
            <Trophy weight="fill" className="w-4 h-4 text-amber-950" />
          </div>
          <div>
            <h4 className="font-brand font-black text-xs text-slate-900 leading-none">
              Target Harian
            </h4>
            <span className="text-[9px] text-slate-400 font-medium">
              Buka Peti Emas 50 XP
            </span>
          </div>
        </div>

        <span className="bg-gradient-to-b from-amber-50 to-amber-100 text-amber-800 border border-amber-300/80 text-[9px] font-brand font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
          <Sparkle weight="fill" className="w-2.5 h-2.5 text-amber-500" />
          <span>PETI EMAS</span>
        </span>
      </div>

      {/* ── 3D GOLD CHEST & PROGRESS BAR ── */}
      <div className="flex items-center gap-3 p-2.5 bg-gradient-to-r from-amber-50/80 via-yellow-50/30 to-slate-50/60 border border-amber-200/90 rounded-xl shadow-2xs">
        {/* 3D Gold Chest Visual */}
        <div className="relative shrink-0 flex items-center justify-center transition-transform hover:scale-105 cursor-pointer">
          <GoldChest3D isReady={isGoalReached && !claimed} />
          {isGoalReached && !claimed && (
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 border-2 border-white shadow-xs" />
            </span>
          )}
        </div>

        {/* Progress Metrics & Guidance */}
        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex items-center justify-between text-xs">
            <span className="font-brand font-black text-slate-800 text-[10px] flex items-center gap-1 truncate">
              <Lightning weight="fill" className="w-2.5 h-2.5 text-amber-500 shrink-0" />
              <span>{claimed ? 'Peti Dibuka! +20 💎' : `${currentXp} / ${targetXp} XP`}</span>
            </span>
            <span className="font-brand font-black text-amber-600 text-[11px] shrink-0">
              {progressPercent}%
            </span>
          </div>

          {/* 3D Tactile Progress Track with Gloss Sheen */}
          <div className="w-full h-2.5 bg-slate-100 rounded-full border border-slate-200/90 p-0.5 shadow-inner overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 rounded-full transition-all duration-500 shadow-[0_1px_0_0_#D97706] relative"
              style={{ width: `${progressPercent}%` }}
            >
              {/* Gloss Highlight Overlay */}
              <div className="absolute inset-x-0 top-0 h-[45%] bg-white/35 rounded-full" />
            </div>
          </div>

          <p className="text-[9px] text-slate-500 font-medium truncate">
            {claimed
              ? 'Bonus +20 Permata 💎 telah diklaim!'
              : isGoalReached
              ? 'Target tercapai! Siap dibuka.'
              : `${targetXp - currentXp} XP lagi untuk membuka peti.`}
          </p>
        </div>
      </div>

      {/* ── ACTION BUTTON OR REWARD PREVIEW ── */}
      {isGoalReached && !claimed ? (
        <Button3D
          variant="amber"
          size="sm"
          fullWidth
          onClick={handleClaimChest}
          className="text-[11px] py-1.5 shadow-[0_2.5px_0_0_#B45309]"
        >
          BUKA PETI HADIAH (+20 💎)
        </Button3D>
      ) : claimed ? (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 font-brand font-black text-[10px] py-1.5 px-2.5 rounded-lg flex items-center justify-center gap-1 shadow-2xs">
          <Check weight="bold" className="w-3.5 h-3.5 text-emerald-600 stroke-[2]" />
          <span>Hadiah Berhasil Diklaim (+20 💎)</span>
        </div>
      ) : (
        <div className="flex items-center justify-between text-[9px] bg-slate-50 border border-slate-200/70 rounded-lg px-2.5 py-1 text-slate-500 font-medium shadow-2xs">
          <span className="flex items-center gap-1 font-bold text-slate-700">
            <span>🎁 Hadiah:</span>
            <span className="text-amber-700 font-black">+20 💎 Permata</span>
          </span>
          <span className="text-slate-400 font-bold">{targetXp - currentXp} XP lagi</span>
        </div>
      )}
    </div>
  )
}

