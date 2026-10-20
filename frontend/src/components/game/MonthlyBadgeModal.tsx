import { Medal, Sparkle, Check, Trophy } from '@phosphor-icons/react'
import { Modal3D } from '../ui/Modal3D'
import { Button3D } from '../ui/Button3D'
import { triggerHaptic } from '../../utils/haptics'
import { audioEngine } from '../../utils/audio'
import doodleCelebrate from '../../assets/kodi/doodle-celebrate.png'

export interface MonthlyBadgeModalProps {
  isOpen: boolean
  onClose: () => void
  monthYearName: string
  completedCount: number
  targetCount: number
  isClaimed: boolean
  onClaim: () => void
}

export const MonthlyBadgeModal = ({
  isOpen,
  onClose,
  monthYearName,
  completedCount,
  targetCount,
  isClaimed,
  onClaim,
}: MonthlyBadgeModalProps) => {
  if (!isOpen) return null

  const isEligible = completedCount >= targetCount

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
        {/* Tokyo Guild Special Badge Tag */}
        <div className="flex justify-center">
          <span className="text-[11px] font-brand font-black px-4 py-1 rounded-full border border-amber-300 bg-amber-100 text-amber-950 uppercase tracking-wider shadow-2xs flex items-center gap-1.5">
            <Trophy weight="fill" className="w-3.5 h-3.5 text-amber-700" />
            <span>Tantangan Bulanan • Tokyo Tech Guild</span>
          </span>
        </div>

        {/* Kodi with Golden Roppongi Medallion */}
        <div className="relative flex items-center justify-center my-3">
          {/* Radiant Aura */}
          <div className="absolute w-44 h-44 bg-gradient-to-tr from-amber-300/40 via-yellow-200/30 to-blue-300/30 rounded-full blur-2xl animate-pulse" />

          {/* Kodi Illustration */}
          <div className="relative z-10 w-36 h-36 flex items-center justify-center">
            <img
              src={doodleCelebrate}
              alt="Kodi Merayakan Lencana"
              className="w-full h-full object-contain drop-shadow-lg"
            />
            {/* Medallion Floating Badge */}
            <div className="absolute -bottom-2 -right-2 w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 border-3 border-white shadow-xl flex items-center justify-center text-white">
              <Medal weight="fill" className="w-9 h-9 text-amber-950 drop-shadow-sm" />
            </div>
          </div>
        </div>

        {/* Challenge Title & Story */}
        <div className="space-y-1.5">
          <h3 className="font-brand font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
            Lencana Emas Roppongi ({monthYearName})
          </h3>
          <p className="text-xs text-slate-600 font-medium max-w-sm mx-auto leading-relaxed">
            {isClaimed
              ? `Lencana kehormatan edisi ${monthYearName} telah resmi disematkan pada etalase portofolio profil CodeAbroad Anda.`
              : isEligible
              ? `Selamat! Anda berhasil menuntaskan ${completedCount} misi bulan ini. Klaim lencana emas permanen beserta bonus gems sekarang!`
              : `Selesaikan ${targetCount - completedCount} misi lagi di bulan ${monthYearName} untuk membuka lencana emas permanen ini.`}
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
              style={{ width: `${Math.min(100, Math.round((completedCount / targetCount) * 100))}%` }}
            />
          </div>
        </div>

        {/* Claim Rewards Info */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-around text-xs font-brand font-black text-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="text-base">🏅</span>
            <span>Lencana Profil Permanen</span>
          </div>
          <div className="w-1 h-1 bg-slate-300 rounded-full" />
          <div className="flex items-center gap-1 text-blue-600">
            <span className="text-base">💎</span>
            <span>+50 Gems</span>
          </div>
          <div className="w-1 h-1 bg-slate-300 rounded-full" />
          <div className="flex items-center gap-1 text-amber-600">
            <span className="text-base">⚡</span>
            <span>+150 XP</span>
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
              LENCANA SUDAH DIMILIKI DI PROFIL ✓
            </Button3D>
          ) : isEligible ? (
            <Button3D
              variant="amber"
              size="md"
              fullWidth
              onClick={handleClaim}
              className="text-xs py-3 shadow-md ring-4 ring-amber-300 animate-pulse"
            >
              <Sparkle weight="fill" className="w-4 h-4 mr-1.5 text-amber-950" />
              KLAIM LENCANA &amp; BONUS SEKARANG (+50 💎)
            </Button3D>
          ) : (
            <Button3D
              variant="ghost"
              size="md"
              fullWidth
              onClick={onClose}
              className="text-xs py-2.5 border-2 border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
            >
              BELUM MEMENUHI SYARAT ({completedCount}/{targetCount})
            </Button3D>
          )}
        </div>
      </div>
    </Modal3D>
  )
}
