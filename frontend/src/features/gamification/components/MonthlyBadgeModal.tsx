import { Medal, Sparkle, Check, Trophy } from '@phosphor-icons/react'
import { Modal3D } from './Modal3D'
import { Button3D } from "@/shared/components/ui/Button3D"
import { XpBoltIcon } from "@/shared/components/ui/GamificationIcons"
import { triggerHaptic } from "@/shared/utils/haptics"
import { audioEngine } from "@/shared/utils/audio"
import { KodiCharacter } from "@/shared/components/ui/KodiCharacter"
import { MonthlyBadgeEmblem } from "@/features/gamification/components/MonthlyBadgeEmblem"

export interface MonthlyBadgeModalProps {
  isOpen: boolean
  onClose: () => void
  monthYearName: string
  monthShort?: string
  completedCount: number
  targetCount: number
  isClaimed: boolean
  isClaiming?: boolean
  onClaim: () => void
}

export const MonthlyBadgeModal = ({
  isOpen,
  onClose,
  monthYearName,
  monthShort,
  completedCount,
  targetCount,
  isClaimed,
  isClaiming = false,
  onClaim,
}: MonthlyBadgeModalProps) => {
  if (!isOpen) return null

  const isEligible = completedCount >= targetCount
  const progressPercent = Math.min(100, Math.round((completedCount / targetCount) * 100))
  const resolvedMonthShort = (monthShort || monthYearName.slice(0, 3) || 'BLN').toUpperCase()

  const handleClaim = () => {
    triggerHaptic('success')
    audioEngine.playSuccess()
    onClaim()
  }

  return (
    <Modal3D
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      className="text-center"
    >
      <div className="space-y-5 py-2">
        {/* Global Guild Special Badge Tag */}
        <div className="flex justify-center">
          <span className="text-[11px] font-brand font-black px-4 py-1 rounded-full border border-amber-300 bg-amber-100 text-amber-950 uppercase tracking-wider shadow-2xs flex items-center gap-1.5">
            <Trophy weight="fill" className="w-3.5 h-3.5 text-amber-700" />
            <span>Tantangan Bulanan • Language Mastery</span>
          </span>
        </div>

        {/* Kodi with Japanese Golden Medallion Emblem */}
        <div className="relative flex items-center justify-center my-3">
          <div className="absolute w-44 h-44 bg-gradient-to-tr from-amber-300/40 via-yellow-200/30 to-blue-300/30 rounded-full blur-2xl animate-pulse" />

          <div className="relative z-10 flex items-center justify-center">
            <KodiCharacter emotion="celebrate" size={120} interactive />
            <div className="relative -ml-4 bg-white/95 rounded-2xl border-2 border-amber-300 p-1 shadow-lg z-20">
              <MonthlyBadgeEmblem
                monthShort={resolvedMonthShort}
                progressPercent={progressPercent}
                isUnlocked={isClaimed || isEligible}
                size={68}
              />
            </div>
          </div>
        </div>

        {/* Challenge Title & Story */}
        <div className="space-y-1.5">
          <h3 className="font-brand font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
            Lencana Emas Bulanan ({monthYearName})
          </h3>
          <p className="text-xs text-slate-600 font-medium max-w-sm mx-auto leading-relaxed">
            {isClaimed
              ? `Lencana kehormatan edisi ${monthYearName} telah resmi terpasang pada profil Merantalk Anda.`
              : isEligible
              ? `Luar biasa! Anda menuntaskan ${completedCount} aktivitas bulan ini. Klaim lencana emas beserta bonus +150 XP sekarang.`
              : `Selesaikan ${targetCount - completedCount} misi lagi di bulan ${monthYearName} untuk membuka lencana emas bulanan ini.`}
          </p>
        </div>

        {/* Monthly Challenge Progress Bar */}
        <div className="bg-amber-50/60 border border-amber-200/90 rounded-2xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs font-brand font-black">
            <span className="text-slate-700 flex items-center gap-1.5">
              <Medal weight="fill" className="w-4 h-4 text-amber-500" />
              <span>Progres Tantangan</span>
            </span>
            <span className="text-amber-800 font-bold">
              {completedCount} / {targetCount} Misi Tuntas
            </span>
          </div>
          <div className="h-3 bg-white rounded-full border border-amber-300 p-0.5 shadow-inner overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Claim Rewards Info */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-around text-xs font-brand font-black text-slate-800">
          <div className="flex items-center gap-1.5">
            <Medal weight="fill" className="w-4 h-4 text-amber-500" />
            <span>Lencana Profil Permanen</span>
          </div>
          <div className="w-1 h-1 bg-slate-300 rounded-full" />
          <div className="flex items-center gap-1.5 text-amber-700">
            <XpBoltIcon className="w-4 h-4 shrink-0" />
            <span>Bonus +150 XP Otomatis</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {isClaimed ? (
            <Button3D
              variant="ghost"
              size="md"
              fullWidth
              onClick={onClose}
              className="text-xs py-2.5 border-2 border-slate-200 bg-slate-100 text-slate-500"
            >
              <Check weight="bold" className="w-4 h-4 mr-1 text-emerald-600" />
              LENCANA SUDAH DIMILIKI DI PROFIL
            </Button3D>
          ) : isEligible ? (
            <Button3D
              variant="amber"
              size="md"
              fullWidth
              disabled={isClaiming}
              onClick={handleClaim}
              className="text-xs py-3 shadow-md ring-4 ring-amber-300"
            >
              <Sparkle weight="fill" className="w-4 h-4 mr-1.5 text-amber-950" />
              {isClaiming ? 'MENGKLAIM LENCANA...' : 'KLAIM LENCANA & +150 XP'}
            </Button3D>
          ) : (
            <Button3D
              variant="ghost"
              size="md"
              fullWidth
              onClick={onClose}
              className="text-xs py-2.5 border-2 border-slate-200 bg-slate-100 text-slate-400"
            >
              BELUM MEMENUHI SYARAT ({completedCount}/{targetCount})
            </Button3D>
          )}
        </div>
      </div>
    </Modal3D>
  )
}
