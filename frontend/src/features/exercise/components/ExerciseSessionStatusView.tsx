import { Button3D } from '@/shared/components/ui/Button3D'
import { KodiCharacter } from '@/shared/components/ui/KodiCharacter'

interface ExerciseSessionLoadingViewProps {
  mode: 'loading'
  message: string
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
      <div className="min-h-screen bg-[#FAFAF9] flex flex-col items-center justify-center p-6 gap-4 font-sans">
        <KodiCharacter emotion="thinking" size="md" interactive={false} />
        <p className="text-sm font-bold text-slate-600">{props.message}</p>
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

