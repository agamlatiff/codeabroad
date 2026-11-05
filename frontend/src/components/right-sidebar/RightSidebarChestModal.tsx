import { createPortal } from 'react-dom'
import type { FC } from 'react'
import { Gift, Lightning, X } from '@phosphor-icons/react'
import { Button3D } from '../ui/Button3D'

export interface RightSidebarChestModalProps {
  isOpen: boolean
  onClose: () => void
  dailyTargetXp: number
  remainingXp: number
  isChestUnlocked: boolean
  isChestClaimedToday: boolean
  onClaimChest: (e?: React.MouseEvent) => void
}

/**
 * RightSidebarChestModal
 * Pure presentational celebration & claim modal for the Daily Golden Chest in AppRightSidebar.
 */
export const RightSidebarChestModal: FC<RightSidebarChestModalProps> = ({
  isOpen,
  onClose,
  dailyTargetXp,
  remainingXp,
  isChestUnlocked,
  isChestClaimedToday,
  onClaimChest,
}) => {
  if (!isOpen || typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed inset-0 z-50 w-screen h-screen flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border-2 border-amber-300 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-xl animate-pop relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold cursor-pointer"
        >
          <X weight="bold" className="w-4 h-4" />
        </button>
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 shadow-[0_6px_0_0_#B45309] flex items-center justify-center text-amber-950 animate-bounce">
          <Gift weight="fill" className="w-10 h-10 text-white drop-shadow-md" />
        </div>
        <div className="space-y-1">
          <h3 className="font-brand font-black text-xl text-slate-900">
            Peti Emas Hadiah Terbuka! 🎉
          </h3>
          <p className="text-xs text-slate-600 font-medium">
            {isChestClaimedToday
              ? 'Hadiah peti hari ini sudah kamu klaim. Kembali lagi besok untuk peti berikutnya!'
              : isChestUnlocked
                ? `Kerja kerasmu hari ini luar biasa! Kamu telah menuntaskan target ${dailyTargetXp} XP harian.`
                : `Kumpulkan ${remainingXp} XP lagi hari ini untuk membuka hadiah permata di peti ini.`}
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-2xl">
          <span className="font-brand font-black text-sm text-amber-900 flex items-center gap-1">
            <Lightning weight="fill" className="w-4 h-4 text-amber-500" />
            <span>+{dailyTargetXp} XP Harian</span>
          </span>
          <span className="text-slate-300">•</span>
          <span className="font-brand font-black text-sm text-amber-900 flex items-center gap-1">
            <span>+20 💎 Permata</span>
          </span>
        </div>
        <Button3D
          variant="amber"
          size="md"
          fullWidth
          disabled={!isChestUnlocked || isChestClaimedToday}
          onClick={(e) => onClaimChest(e)}
          className="py-2.5 font-black text-xs shadow-[0_3px_0_0_#B45309]"
        >
          {isChestClaimedToday
            ? 'HADIAH PETI SUDAH DIKLAIM ✓'
            : isChestUnlocked
              ? 'KLAIM HADIAH & LANJUTKAN 🎁'
              : `SELESAIKAN TARGET ${dailyTargetXp} XP (TERKUNCI)`}
        </Button3D>
      </div>
    </div>,
    document.body
  )
}
