import { useEffect, type FC } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import {
  X,
  Translate,
  Lightning,
  Diamond,
  CheckCircle,
  Sparkle,
} from '@phosphor-icons/react'
import { Button3D } from "@/shared/components/ui/Button3D"
import { KodiCharacter, type KodiEmotion } from "@/shared/components/ui/KodiCharacter"
import type { PathMapNode } from "@/features/curriculum/types/curriculum"
import {
  resolveMapCategoryTokens,
  MAP_MODAL_TOKENS,
} from "@/features/curriculum/tokens/curriculumTokens"
import { CurriculumModalNodeIcon } from './CurriculumNodeIcon'

export interface CurriculumNodeDetailModalProps {
  node: PathMapNode | null
  onClose: () => void
  onStartLesson?: (route: string) => void
  isViewingInactiveTrack?: boolean
  isActivatingTrack?: boolean
  onActivateTrack?: () => void
}

const resolveMascotEmotion = (node: PathMapNode): KodiEmotion => {
  if (node.isChest || node.isTrophy) return 'celebrate'
  if (node.status === 'locked') return 'thinking'
  if (node.status === 'completed') return 'happy'
  return 'coding'
}

export const CurriculumNodeDetailModal: FC<CurriculumNodeDetailModalProps> = ({
  node,
  onClose,
  onStartLesson,
  isViewingInactiveTrack = false,
  isActivatingTrack = false,
  onActivateTrack,
}) => {
  const navigate = useNavigate()

  useEffect(() => {
    if (!node) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [node, onClose])

  if (!node || typeof document === 'undefined') {
    return null
  }

  const catTokens = resolveMapCategoryTokens(node.category)
  const mascotEmotion = resolveMascotEmotion(node)
  const isLockedPreview = node.status === 'locked' && isViewingInactiveTrack

  const modalIconBg =
    node.status === 'completed'
      ? catTokens.modalIconBgCompleted
      : node.status === 'active'
        ? catTokens.modalIconBgActive
        : catTokens.modalIconBgLocked

  const handleAction = () => {
    onClose()
    const targetRoute =
      node.route && node.route !== '/courses'
        ? node.route
        : `/learn/${node.id}`

    if (onStartLesson) {
      onStartLesson(targetRoute)
    } else {
      navigate(targetRoute)
    }
  }

  const handleActivateAndClose = () => {
    onClose()
    onActivateTrack?.()
  }

  return createPortal(
    <div className="fixed inset-0 z-50 w-screen h-screen flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 bg-white border-2 border-slate-200 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl animate-pop">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 min-w-[44px] min-h-[44px] rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold cursor-pointer transition-colors"
          aria-label="Tutup detail lesson"
        >
          <X weight="bold" className="w-4 h-4" />
        </button>

        {/* Living Mascot Character Expression */}
        <div className="flex items-center justify-center py-0.5">
          <KodiCharacter
            emotion={mascotEmotion}
            size={90}
            interactive
          />
        </div>

        <div className="flex items-center gap-3">
          <CurriculumModalNodeIcon node={node} modalIconBg={modalIconBg} />

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-brand font-black uppercase tracking-wider text-slate-400">
                {isLockedPreview ? 'Mode Pratinjau' : MAP_MODAL_TOKENS.statusBadge[node.status]}
              </span>
              {node.badgeLabel && (
                <span
                  className={`text-[9px] font-brand font-black uppercase px-1.5 py-0.5 rounded inline-flex items-center gap-1 ${catTokens.badgeClass}`}
                >
                  {node.category === 'language' && (
                    <Translate weight="bold" className="w-2.5 h-2.5" />
                  )}
                  <span>{node.badgeLabel}</span>
                </span>
              )}
            </div>
            <h3 className="font-brand font-black text-base text-slate-900 leading-tight mt-0.5">
              {node.title}
            </h3>
          </div>
        </div>

        <p className="text-xs text-slate-600 font-medium leading-relaxed">
          {isLockedPreview
            ? 'Anda sedang mempratinjau kurikulum bahasa non-aktif. Aktifkan bahasa ini terlebih dahulu untuk membuka akses dan mulai belajar.'
            : node.status === 'locked'
              ? MAP_MODAL_TOKENS.lockedDescription
              : node.isSkipped
                ? 'Lesson ini telah dilewati otomatis berdasarkan hasil tes penempatan level Anda.'
                : node.subtitle}
        </p>

        <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-bold text-slate-700">
          <span className="flex items-center gap-1.5 text-amber-700">
            <Lightning weight="fill" className="w-4 h-4 text-amber-500" />
            <span>+{node.xpReward} XP Reward</span>
          </span>
          {node.status === 'completed' && typeof node.score === 'number' && !node.isSkipped ? (
            <span className="flex items-center gap-1 text-emerald-700 font-brand font-black">
              <CheckCircle weight="fill" className="w-4 h-4 text-emerald-500" />
              <span>Skor {node.score}%</span>
            </span>
          ) : typeof node.gemsReward === 'number' && node.gemsReward > 0 ? (
            <span className="flex items-center gap-1 text-cyan-700 font-brand font-black">
              <Diamond weight="fill" className="w-3.5 h-3.5 text-cyan-500" />
              <span>+{node.gemsReward} Permata</span>
            </span>
          ) : null}
        </div>

        {isLockedPreview ? (
          <div className="space-y-2">
            {onActivateTrack && (
              <Button3D
                variant="amber"
                size="md"
                fullWidth
                icon={<Sparkle weight="fill" className="w-4 h-4" />}
                onClick={handleActivateAndClose}
                disabled={isActivatingTrack}
                className="text-xs py-2.5"
              >
                {isActivatingTrack ? 'MENGAKTIFKAN BAHASA...' : 'AKTIFKAN BAHASA INI'}
              </Button3D>
            )}
            <Button3D
              variant="white"
              size="md"
              fullWidth
              onClick={onClose}
              className="text-xs py-2"
            >
              TUTUP PRATINJAU
            </Button3D>
          </div>
        ) : node.status === 'locked' ? (
          <Button3D
            variant="white"
            size="md"
            fullWidth
            onClick={onClose}
            className="text-xs py-2.5 opacity-80"
          >
            MENGERTI, TUTUP
          </Button3D>
        ) : (
          <Button3D
            variant={
              node.status === 'completed'
                ? 'emerald'
                : node.isChest || node.isTrophy
                  ? 'amber'
                  : catTokens.activeButtonVariant
            }
            size="md"
            fullWidth
            onClick={handleAction}
            className="text-xs py-2.5"
          >
            {node.isTrophy
              ? node.status === 'completed'
                ? 'LIHAT STATUS EVALUASI'
                : 'IKUTI EVALUASI UNIT'
              : node.status === 'completed'
                ? 'ULANGI LATIHAN LESSON'
                : `MULAI BELAJAR (+${node.xpReward} XP)`}
          </Button3D>
        )}
      </div>
    </div>,
    document.body
  )
}
