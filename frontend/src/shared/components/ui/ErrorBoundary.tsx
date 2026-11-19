import { Component, type ErrorInfo, type ReactNode } from 'react'
import { KodiCharacter } from './KodiCharacter'
import { Button3D } from './Button3D'
import { ArrowClockwise, HouseLine, WarningCircle } from '@phosphor-icons/react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary] Uncaught application error:', error, errorInfo)
    }
    this.setState({ errorInfo })
  }

  private handleReload = (): void => {
    window.location.reload()
  }

  private handleGoHome = (): void => {
    window.location.href = '/curriculum'
  }

  public override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white border-2 border-slate-200/90 rounded-3xl p-6 sm:p-8 text-center shadow-[0_6px_0_0_#E2E8F0] space-y-5 animate-pop">
            <div className="flex justify-center">
              <KodiCharacter emotion="worried" size={104} />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-brand font-black text-[11px] uppercase tracking-wider">
                <WarningCircle weight="fill" className="w-3.5 h-3.5" />
                <span>Gangguan Sementara</span>
              </span>

              <h1 className="text-2xl font-brand font-black text-slate-900 tracking-tight">
                Halaman Mengalami Kendala
              </h1>

              <p className="text-slate-600 text-sm leading-relaxed">
                Maaf atas ketidaknyamanannya. Coba muat ulang halaman ini — progres, XP, dan streak belajarmu tetap tersimpan aman.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-1">
              <Button3D
                variant="blue"
                size="md"
                icon={<ArrowClockwise size={18} weight="bold" />}
                onClick={this.handleReload}
                fullWidth
              >
                Muat Ulang
              </Button3D>
              <Button3D
                variant="white"
                size="md"
                icon={<HouseLine size={18} weight="bold" />}
                onClick={this.handleGoHome}
                fullWidth
              >
                Ke Beranda
              </Button3D>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
