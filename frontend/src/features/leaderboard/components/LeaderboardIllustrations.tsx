import type { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import { KodiCharacter } from '@/shared/components/ui/KodiCharacter'
import { Button3D } from '@/shared/components/ui/Button3D'
import { triggerHaptic } from '@/shared/utils/haptics'
import type { DivisionConfig, NextDivisionProgress } from '@/features/leaderboard/constants/divisions'
import type { LeagueDivision } from '@/features/leaderboard/types/leaderboard'

export const LeaderboardHeroScenery: FC<{ division: LeagueDivision }> = ({ division }) => {
  return (
    <svg
      viewBox="0 0 360 150"
      fill="none"
      aria-hidden="true"
      className="w-full h-full pointer-events-none select-none"
      preserveAspectRatio="xMaxYMax slice"
    >
      {division === 'bronze' && (
        <g opacity="0.62">
          <path d="M120 150C170 112 225 112 275 150H120Z" fill="#FDE68A" />
          <path d="M220 150C265 104 318 104 360 150H220Z" fill="#FDBA74" />
          {/* Warm Torii */}
          <rect x="262" y="72" width="8" height="78" rx="3" fill="#B45309" />
          <rect x="308" y="72" width="8" height="78" rx="3" fill="#B45309" />
          <path d="M244 68C272 60 306 60 334 68L330 76H248L244 68Z" fill="#92400E" />
          <rect x="252" y="84" width="74" height="7" rx="2" fill="#D97706" />
          {/* Lanterns */}
          <ellipse cx="222" cy="86" rx="10" ry="13" fill="#FB923C" />
          <circle cx="222" cy="86" r="5" fill="#FEF3C7" />
        </g>
      )}

      {division === 'silver' && (
        <g opacity="0.58">
          {/* Seigaiha subtle waves */}
          <circle cx="305" cy="145" r="55" stroke="#CBD5E1" strokeWidth="3" />
          <circle cx="305" cy="145" r="38" stroke="#A5B4FC" strokeWidth="3" />
          {/* City silhouettes */}
          <rect x="198" y="84" width="26" height="66" rx="4" fill="#CBD5E1" />
          <rect x="230" y="66" width="32" height="84" rx="4" fill="#94A3B8" />
          <rect x="270" y="54" width="24" height="96" rx="4" fill="#A5B4FC" />
          <path d="M312 150L322 44L332 150H312Z" fill="#818CF8" />
          <circle cx="322" cy="40" r="4" fill="#6366F1" />
        </g>
      )}

      {division === 'gold' && (
        <g opacity="0.65">
          {/* Golden Pagoda */}
          <rect x="268" y="72" width="44" height="78" rx="4" fill="#FDE047" />
          <path d="M248 76L290 58L332 76H248Z" fill="#D97706" />
          <path d="M256 54L290 38L324 54H256Z" fill="#F59E0B" />
          <path d="M266 35L290 22L314 35H266Z" fill="#B45309" />
          <rect x="288" y="12" width="4" height="12" rx="2" fill="#92400E" />
          {/* Floating blossoms */}
          <circle cx="215" cy="48" r="6" fill="#FBBF24" />
          <circle cx="235" cy="82" r="4" fill="#F59E0B" />
          <circle cx="338" cy="96" r="5" fill="#FDE047" />
        </g>
      )}

      {division === 'diamond' && (
        <g opacity="0.68">
          {/* Aurora glow */}
          <path
            d="M140 60C200 22 280 86 355 34"
            stroke="#A5F3FC"
            strokeWidth="12"
            strokeLinecap="round"
            opacity="0.55"
          />
          <path
            d="M165 82C225 46 290 98 355 58"
            stroke="#DDD6FE"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.6"
          />
          {/* Crystalline Mt. Fuji */}
          <path d="M185 150L265 56L345 150H185Z" fill="#67E8F9" />
          <path d="M240 85L265 56L290 85L278 92L265 84L252 92L240 85Z" fill="#FFFFFF" />
          <path d="M286 150L326 94L360 150H286Z" fill="#A5B4FC" />
          {/* Sparkles */}
          <path
            d="M214 34L217 41L224 44L217 47L214 54L211 47L204 44L211 41L214 34Z"
            fill="#FDE047"
            className="lb-sparkle-float"
          />
          <path
            d="M326 30L328 35L333 37L328 39L326 44L324 39L319 37L324 35L326 30Z"
            fill="#67E8F9"
            className="lb-sparkle-float"
          />
        </g>
      )}
    </svg>
  )
}

interface LeaderboardFewCompetitorsCardProps {
  divisionConfig: DivisionConfig
  competitorCount: number
  nextDivisionProgress?: NextDivisionProgress | null
}

export const LeaderboardFewCompetitorsCard: FC<LeaderboardFewCompetitorsCardProps> = ({
  divisionConfig,
  competitorCount,
  nextDivisionProgress,
}) => {
  const navigate = useNavigate()

  const headline =
    competitorCount === 1
      ? `Kamu Memimpin ${divisionConfig.name} Sendirian!`
      : `Baru ${competitorCount} Peserta di ${divisionConfig.name}`

  const detail =
    nextDivisionProgress && !nextDivisionProgress.isMaxDivision && nextDivisionProgress.nextDivisionName
      ? `Selesaikan pelajaran atau Flashcard hari ini untuk menambah ${nextDivisionProgress.remainingXP} XP lagi menuju ${nextDivisionProgress.nextDivisionName} sekaligus mengamankan bonus +100 Gems minggu ini.`
      : `Pertahankan posisi Top 3 sampai Minggu 23:59 WIB untuk mengamankan hadiah +100 Gems mingguan!`

  return (
    <div className="mt-3 rounded-2xl border-2 border-dashed border-blue-200/90 bg-gradient-to-r from-blue-50/70 via-white to-indigo-50/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="shrink-0">
          <KodiCharacter emotion="onFire" size={68} />
        </div>
        <div className="min-w-0 space-y-1">
          <h4 className="font-brand font-black text-xs sm:text-sm text-slate-900">
            {headline}
          </h4>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            {detail}
          </p>
        </div>
      </div>

      <Button3D
        type="button"
        variant="blue"
        size="sm"
        onClick={() => {
          triggerHaptic('tap')
          navigate('/curriculum')
        }}
        className="text-xs px-4 py-2.5 shrink-0 whitespace-nowrap"
      >
        <span className="inline-flex items-center gap-1.5">
          <span>Latihan Sekarang (+XP)</span>
          <ArrowRight weight="bold" className="w-3.5 h-3.5" />
        </span>
      </Button3D>
    </div>
  )
}
