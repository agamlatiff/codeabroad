import { X } from '@phosphor-icons/react'
import { Button3D } from '@/shared/components/ui/Button3D'
import { KodiCharacter } from '@/shared/components/ui/KodiCharacter'
import { Skeleton } from '@/shared/components/ui/Skeleton'

interface ExerciseSessionLoadingViewProps {
  mode: 'loading'
  message: string
  onExit?: () => void
}

interface ExerciseSessionStatusCardProps {
  mode: 'status'
  emotion?: 'worried' | 'celebrate' | 'thinking'
  title: string
  message: string
  primaryLabel: string
  primaryVariant?: 'blue' | 'emerald'
  onPrimary: () => void
  secondaryLabel?: string
  onSecondary?: () => void
  isSecondaryLoading?: boolean
}

type ExerciseSessionStatusViewProps =
  | ExerciseSessionLoadingViewProps
  | ExerciseSessionStatusCardProps

/**
 * Shared full-screen loading & error/status card across Lesson, SRS Review, and Exam players.
 */
export const ExerciseSessionStatusView = (props: ExerciseSessionStatusViewProps) => {
  if (props.mode === 'loading') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="h-screen h-dvh bg-[#FAFAF9] flex flex-col font-sans"
      >
        <header className="shrink-0 h-16 bg-white border-b-2 border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4">
          {props.onExit ? (
            <button
              type="button"
              onClick={props.onExit}
              aria-label="Kembali"
              className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <X weight="bold" className="w-6 h-6" />
            </button>
          ) : (
            <Skeleton className="w-10 h-10 rounded-xl" />
          )}
          <div className="flex-1 max-w-2xl flex items-center gap-3">
            <Skeleton variant="pill" className="flex-1 h-4" />
            <Skeleton variant="pill" className="w-10 h-4" />
          </div>
          <div className="w-10" />
        </header>

        <main className="flex-1 flex flex-col justify-center max-w-2xl w-full mx-auto px-4 sm:px-6 py-6 gap-5 overflow-y-auto">
          <div className="inline-flex items-center gap-3 self-start rounded-2xl border-2 border-blue-200 bg-[#EFF6FF] px-4 py-2.5 shadow-[0_3px_0_0_#DBEAFE]">
            <KodiCharacter emotion="thinking" size="sm" interactive={false} />
            <span className="text-xs sm:text-sm font-brand font-extrabold text-[#2563EB]">
              {props.message}
            </span>
          </div>
          <Skeleton className="h-7 w-3/4 rounded-xl" />
          <div className="space-y-3 pt-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-14 rounded-2xl bg-white border-2 border-slate-200 shadow-[0_3px_0_0_#E2E8F0] px-4 flex items-center gap-3 animate-pulse"
              >
                <Skeleton className="w-7 h-7 rounded-lg" />
                <Skeleton className="h-4 flex-1 max-w-[220px]" />
              </div>
            ))}
          </div>
        </main>

        <footer className="shrink-0 border-t-2 border-slate-200 bg-white px-4 sm:px-6 py-4">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
            <Skeleton className="h-4 w-48 hidden sm:block" />
            <Skeleton className="h-12 w-full sm:w-52 rounded-2xl" />
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-sm text-center space-y-4">
        <KodiCharacter
          emotion={props.emotion ?? 'worried'}
          size="md"
          interactive={false}
        />
        <div className="space-y-1.5">
          <h1 className="text-xl font-brand font-extrabold text-slate-900">
            {props.title}
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">{props.message}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button3D
            type="button"
            variant={props.primaryVariant ?? 'blue'}
            size="md"
            fullWidth
            disabled={props.isSecondaryLoading}
            onClick={props.onPrimary}
          >
            {props.primaryLabel}
          </Button3D>
          {props.secondaryLabel && props.onSecondary && (
            <Button3D
              type="button"
              variant="white"
              size="md"
              fullWidth
              loading={props.isSecondaryLoading}
              loadingText="Memuat..."
              onClick={props.onSecondary}
            >
              {props.secondaryLabel}
            </Button3D>
          )}
        </div>
      </div>
    </div>
  )
}

