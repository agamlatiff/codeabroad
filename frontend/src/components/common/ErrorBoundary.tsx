import { Component, type ErrorInfo, type ReactNode } from 'react'
import { KodiMascot } from '../ui/KodiMascot'
import { Button3D } from '../ui/Button3D'
import { ArrowClockwise, HouseLine, Bug } from '@phosphor-icons/react'

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
    // In production, this can send to Sentry or an error logging endpoint
    console.error('[ErrorBoundary] Uncaught application error:', error, errorInfo)
    this.setState({ errorInfo })
  }

  private handleReload = (): void => {
    window.location.reload()
  }

  private handleGoHome = (): void => {
    window.location.href = '/dashboard'
  }

  public override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-800/80 border-2 border-slate-700/80 rounded-3xl p-6 sm:p-8 text-center shadow-2xl backdrop-blur-md">
            <div className="flex justify-center mb-4">
              <KodiMascot
                emotion="warning"
                size="lg"
                speechText="Aduh, ada sirkuit yang konslet!"
                speechDirection="bottom"
              />
            </div>

            <h1 className="text-2xl sm:text-3xl font-brand font-black text-white tracking-tight mb-2">
              Oops! Terjadi Masalah Teknis
            </h1>

            <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
              Terjadi kesalahan tidak terduga pada halaman ini. Jangan khawatir, progres dan streak belajarmu tetap aman.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
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

            {this.state.error && (
              <details className="mt-4 text-left border border-slate-700 rounded-xl p-3 bg-slate-900/60">
                <summary className="text-xs text-slate-400 cursor-pointer font-mono flex items-center gap-1.5 hover:text-slate-200">
                  <Bug size={14} /> Detail Diagnostik Teknis
                </summary>
                <div className="mt-2 text-[11px] font-mono text-rose-300 break-words max-h-32 overflow-y-auto">
                  {this.state.error.toString()}
                </div>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
