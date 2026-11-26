import { useEffect, useSyncExternalStore, type FC } from 'react'
import { useGoogleLogin, useGoogleOAuth } from '@react-oauth/google'
import { CircleNotch } from '@phosphor-icons/react'
import {
  getGoogleScriptLoadError,
  GOOGLE_CLIENT_ID,
  subscribeGoogleScriptLoadError,
} from '@/features/auth/hooks/authHelpers'
import { useGoogleAuth } from '@/features/auth/hooks/useGoogleAuth'
import { triggerHaptic } from '@/shared/utils/haptics'

export interface GoogleAuthButtonProps {
  mode: 'login' | 'register'
  rememberMe?: boolean
  disabled?: boolean
  onLoadingChange?: (loading: boolean) => void
  onStart?: () => void
  onError: (message: string | null) => void
}

interface GoogleButtonShellProps {
  mode: 'login' | 'register'
  loading?: boolean
  disabled?: boolean
  scriptError?: boolean
  onClick: () => void
}

const GoogleBrandMark: FC = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-[18px] h-[18px] shrink-0"
    aria-hidden="true"
  >
    <path
      fill="#EA4335"
      d="M12 5.04c1.64 0 3.12.56 4.28 1.66l3.2-3.2C17.54 1.69 14.96.6 12 .6 7.36.6 3.36 3.26 1.4 7.14l3.73 2.89C6.01 7.36 8.76 5.04 12 5.04Z"
    />
    <path
      fill="#4285F4"
      d="M23.49 12.27c0-.86-.08-1.69-.22-2.49H12v4.72h6.45c-.28 1.49-1.12 2.75-2.38 3.6l3.67 2.84c2.15-1.98 3.75-4.9 3.75-8.67Z"
    />
    <path
      fill="#FBBC05"
      d="M5.13 14.97a6.94 6.94 0 0 1 0-4.94L1.4 7.14a11.4 11.4 0 0 0 0 9.72l3.73-2.89Z"
    />
    <path
      fill="#34A853"
      d="M12 23.4c3.08 0 5.67-1.02 7.56-2.76l-3.67-2.84c-1.02.68-2.32 1.09-3.89 1.09-3.24 0-5.99-2.32-6.87-4.92L1.4 16.86C3.36 20.74 7.36 23.4 12 23.4Z"
    />
  </svg>
)

const GoogleAuthButtonShell: FC<GoogleButtonShellProps> = ({
  mode,
  loading = false,
  disabled = false,
  scriptError = false,
  onClick,
}) => (
  <div>
    <button
      type="button"
      disabled={disabled || loading}
      onClick={onClick}
      className="w-full inline-flex items-center justify-center gap-2.5 rounded-2xl border-2 border-slate-200/95 bg-white hover:bg-slate-50 hover:border-slate-300 px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-brand font-bold text-[#1E293B] shadow-[0_3px_0_0_#E2E8F0] active:translate-y-0.5 active:shadow-none disabled:opacity-60 disabled:cursor-not-allowed disabled:active:translate-y-0 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20"
    >
      {loading ? (
        <>
          <CircleNotch
            weight="bold"
            className="w-4 h-4 text-[#2563EB] animate-spin shrink-0"
            aria-hidden="true"
          />
          <span>Menghubungkan ke Google...</span>
        </>
      ) : (
        <>
          <GoogleBrandMark />
          <span>Lanjutkan dengan Google</span>
        </>
      )}
    </button>

    {scriptError && (
      <p
        role="status"
        className="mt-2 text-center text-[11px] font-medium text-amber-700 leading-snug"
      >
        Layanan Google Sign-In gagal dimuat. Periksa koneksi atau nonaktifkan pemblokir skrip, lalu muat ulang halaman.
      </p>
    )}

    <div className="relative my-3.5 sm:my-4 flex items-center" aria-hidden="true">
      <div className="flex-1 border-t border-slate-200/90" />
      <span className="px-3 text-[11px] font-semibold text-slate-500">
        {mode === 'register' ? 'atau daftar dengan email' : 'atau masuk dengan email'}
      </span>
      <div className="flex-1 border-t border-slate-200/90" />
    </div>
  </div>
)

const GoogleAuthConfiguredButton: FC<GoogleAuthButtonProps> = ({
  mode,
  rememberMe = false,
  disabled = false,
  onLoadingChange,
  onStart,
  onError,
}) => {
  const { scriptLoadedSuccessfully } = useGoogleOAuth()
  const hasScriptError = useSyncExternalStore(
    subscribeGoogleScriptLoadError,
    getGoogleScriptLoadError,
    () => false
  )
  const { authenticateWithCode, loading } = useGoogleAuth({
    rememberMe,
    onError: (msg) => onError(msg),
  })

  useEffect(() => {
    onLoadingChange?.(loading)
    return () => {
      onLoadingChange?.(false)
    }
  }, [loading, onLoadingChange])

  const openGooglePopup = useGoogleLogin({
    flow: 'auth-code',
    scope: 'openid email profile',
    ux_mode: 'popup',
    onSuccess: (codeResponse) => {
      if (!codeResponse.code) {
        onError('Kode autentikasi Google tidak diterima. Silakan coba lagi.')
        return
      }
      authenticateWithCode(codeResponse.code)
    },
    onError: (errorResponse) => {
      if (errorResponse.error === 'access_denied') {
        onError('Akses masuk dengan Google dibatalkan.')
        return
      }
      onError(errorResponse.error_description || 'Gagal menghubungkan akun Google. Silakan coba lagi.')
    },
    onNonOAuthError: (nonOAuthError) => {
      if (nonOAuthError.type === 'popup_closed') {
        return
      }
      if (nonOAuthError.type === 'popup_failed_to_open') {
        onError('Popup Google gagal dibuka. Izinkan popup di browser lalu coba lagi.')
        return
      }
      onError('Gagal membuka jendela masuk Google. Silakan coba lagi.')
    },
  })

  const handleClick = () => {
    if (disabled || loading) return
    triggerHaptic('tap')
    onError(null)
    onStart?.()
    if (hasScriptError) {
      onError(
        'Skrip Google Sign-In gagal dimuat. Periksa koneksi atau nonaktifkan pemblokir iklan lalu muat ulang halaman.'
      )
      return
    }
    if (!scriptLoadedSuccessfully) {
      onError('Layanan masuk Google masih dimuat, silakan tunggu sebentar lalu coba lagi.')
      return
    }
    openGooglePopup()
  }

  return (
    <GoogleAuthButtonShell
      mode={mode}
      loading={loading}
      disabled={disabled}
      scriptError={hasScriptError}
      onClick={handleClick}
    />
  )
}

export const GoogleAuthButton: FC<GoogleAuthButtonProps> = (props) => {
  if (!GOOGLE_CLIENT_ID) {
    return (
      <GoogleAuthButtonShell
        mode={props.mode}
        disabled={props.disabled}
        onClick={() => {
          triggerHaptic('tap')
          props.onStart?.()
          props.onError(
            'Masuk dengan Google belum dikonfigurasi. Isi VITE_GOOGLE_CLIENT_ID di file .env terlebih dahulu.'
          )
        }}
      />
    )
  }

  return <GoogleAuthConfiguredButton {...props} />
}
