import { Sparkle, Check } from '@phosphor-icons/react'
import { Modal3D } from '../ui/Modal3D'
import { Button3D } from '../ui/Button3D'
import { triggerHaptic } from '../../utils/haptics'
import { audioEngine } from '../../utils/audio'
import doodleCelebrate from '../../assets/kodi/doodle-celebrate.png'

export interface ChestRewardModalProps {
  isOpen: boolean
  onClose: () => void
  tier: 1 | 2 | 3
  title: string
  gemReward: number
  xpReward?: number
  icon: string
  isClaimed: boolean
  onClaim: () => void
}

export const ChestRewardModal = ({
  isOpen,
  onClose,
  tier,
  title,
  gemReward,
  xpReward = 0,
  icon,
  isClaimed,
  onClaim,
}: ChestRewardModalProps) => {
  if (!isOpen) return null

  const handleClaim = () => {
    triggerHaptic('success')
    audioEngine.playChestClaim()
    onClaim()
  }

  const tierColors = {
    1: {
      bg: 'from-amber-100 via-amber-50 to-orange-50',
      border: 'border-amber-300',
      text: 'text-amber-900',
      tag: 'bg-amber-100 text-amber-900 border-amber-300',
      shadow: '#B45309',
    },
    2: {
      bg: 'from-slate-100 via-slate-50 to-blue-50',
      border: 'border-slate-300',
      text: 'text-slate-800',
      tag: 'bg-slate-100 text-slate-800 border-slate-300',
      shadow: '#475569',
    },
    3: {
      bg: 'from-yellow-100 via-amber-50 to-yellow-100',
      border: 'border-yellow-400',
      text: 'text-amber-950',
      tag: 'bg-amber-100 text-amber-950 border-amber-400',
      shadow: '#D97706',
    },
  }[tier]

  return (
    <Modal3D
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="sm"
      className="text-center"
    >
      <div className="space-y-5 py-2">
        {/* Tier Header Badge */}
        <div className="flex justify-center">
          <span
            className={`text-[11px] font-brand font-black px-3.5 py-1 rounded-full border uppercase tracking-wider shadow-2xs ${tierColors.tag}`}
          >
            Misi Harian • Tier {tier}
          </span>
        </div>

        {/* Kodi Mascot & 3D Chest Burst Display */}
        <div className="relative flex items-center justify-center my-2">
          {/* Ambient Glow */}
          <div className="absolute w-36 h-36 bg-amber-300/30 rounded-full blur-2xl animate-pulse" />

          {/* Kodi Illustration */}
          <div className="relative z-10 w-32 h-32 flex items-center justify-center">
            <img
              src={doodleCelebrate}
              alt="Kodi Merayakan"
              className="w-full h-full object-contain drop-shadow-md animate-bounce"
            />
            {/* Chest Icon Overlap Badge */}
            <div className="absolute -bottom-2 -right-1 w-14 h-14 bg-white rounded-2xl border-2 border-amber-300 shadow-md flex items-center justify-center text-3xl">
              {icon}
            </div>
          </div>
        </div>

        {/* Title & Celebration Copy */}
        <div className="space-y-1.5">
          <h3 className="font-brand font-black text-xl text-slate-900">
            {isClaimed ? `${title} Telah Dibuka!` : `Buka ${title}!`}
          </h3>
          <p className="text-xs text-slate-600 font-medium max-w-xs mx-auto leading-relaxed">
            {isClaimed
              ? 'Hadiah dari peti ini sudah berhasil ditambahkan ke saldo akun Anda hari ini.'
              : 'Target misi harian Anda telah tercapai! Klaim perolehan gems dan XP Anda sekarang.'}
          </p>
        </div>

        {/* Reward Showcase Capsule */}
        <div className={`p-4 rounded-2xl border-2 bg-gradient-to-r ${tierColors.bg} ${tierColors.border} shadow-2xs space-y-2`}>
          <div className="text-[11px] font-black uppercase tracking-wider text-slate-500">
            Isi Peti Hadiah
          </div>
          <div className="flex items-center justify-center gap-4 text-sm font-brand font-black">
            <div className="flex items-center gap-1.5 text-blue-700 bg-white/80 px-3 py-1.5 rounded-xl border border-blue-200 shadow-2xs">
              <span className="text-lg">💎</span>
              <span>+{gemReward} Gems</span>
            </div>
            {xpReward > 0 && (
              <div className="flex items-center gap-1.5 text-amber-700 bg-white/80 px-3 py-1.5 rounded-xl border border-amber-200 shadow-2xs">
                <span className="text-lg">⚡</span>
                <span>+{xpReward} XP</span>
              </div>
            )}
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
              SUDAH DIKLAIM HARI INI
            </Button3D>
          ) : (
            <Button3D
              variant="amber"
              size="md"
              fullWidth
              onClick={handleClaim}
              className="text-xs py-3 shadow-md ring-4 ring-amber-200 animate-pulse"
            >
              <Sparkle weight="fill" className="w-4 h-4 mr-1.5 text-amber-950" />
              BUKA PETI SEKARANG (+{gemReward} 💎)
            </Button3D>
          )}
        </div>
      </div>
    </Modal3D>
  )
}
