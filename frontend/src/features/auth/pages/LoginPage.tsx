import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useWatch } from 'react-hook-form'
import { useLogin } from "@/features/auth/hooks/useLogin"
import { AuthLayout } from "@/features/auth/components/AuthLayout"
import { GoogleAuthButton } from "@/features/auth/components/GoogleAuthButton"
import { Input } from "@/shared/components/ui/Input"
import { AuthCheckbox } from "@/features/auth/components/AuthCheckbox"
import { Button3D } from "@/shared/components/ui/Button3D"
import { EnvelopeSimple, LockSimple } from '@phosphor-icons/react'

export const LoginPage = () => {
  const { register, control, errors, status, actions } = useLogin()
  const [googleError, setGoogleError] = useState<string | null>(null)
  const [googleLoading, setGoogleLoading] = useState(false)
  const rememberMe = useWatch({ control, name: 'remember_me', defaultValue: false }) ?? false
  const isBusy = status.loading || googleLoading

  const handleSubmit = (event: FormEvent) => {
    if (isBusy) {
      event.preventDefault()
      return
    }
    setGoogleError(null)
    actions.submit(event)
  }

  return (
    <AuthLayout
      mode="login"
      title="Selamat Datang"
      subtitle="Masuk ke akunmu untuk melanjutkan latihan bahasa harianmu."
      heroTitle="Lanjutkan Progres Bahasamu"
      heroSubtitle="Pantau streak harian, kartu kosakata, dan target sertifikasi global bersama Mera."
      speechBubble="Halo! Siap lanjutkan latihan bahasamu hari ini?"
      helperBanner="Progres belajar, kosakata, dan jadwal latihan ulang tersimpan otomatis di akunmu."
      isBusy={isBusy}
      busyLabel={googleLoading ? 'Memverifikasi akun Google kamu...' : null}
      error={status.error || googleError}
    >
      {/* ── 1. GOOGLE OAUTH CUSTOM BUTTON ── */}
      <GoogleAuthButton
        mode="login"
        rememberMe={rememberMe}
        disabled={status.loading}
        onLoadingChange={setGoogleLoading}
        onStart={status.clearError}
        onError={setGoogleError}
      />

      {/* ── 2. EMAIL & PASSWORD FORM ── */}
      <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
        <Input
          id="email"
          label="Alamat Email"
          type="email"
          autoComplete="email"
          placeholder="nama@email.com"
          disabled={isBusy}
          error={errors.email?.message}
          icon={<EnvelopeSimple weight="bold" className="w-4 h-4" />}
          {...register('email')}
        />

        <Input
          id="password"
          label="Kata Sandi"
          isPassword
          autoComplete="current-password"
          placeholder="Masukkan kata sandi kamu"
          disabled={isBusy}
          error={errors.password?.message}
          icon={<LockSimple weight="bold" className="w-4 h-4" />}
          {...register('password')}
        />

        {/* Remember Me Row */}
        <div className="flex items-center justify-between pt-0.5">
          <AuthCheckbox
            id="remember"
            label="Ingat saya"
            disabled={isBusy}
            {...register('remember_me')}
          />
        </div>

        {/* Submit Button with Merantalk 3D Tactile Push-Down */}
        <Button3D
          type="submit"
          variant="blue"
          size="md"
          fullWidth
          loading={status.loading}
          loadingText="Memproses..."
          disabled={googleLoading}
          className="mt-2 text-sm"
        >
          Masuk Sekarang
        </Button3D>
      </form>

      {/* ── REGISTRATION FOOTER ── */}
      <div className="mt-4 sm:mt-5 text-center text-xs text-slate-500 font-normal">
        Belum punya akun?{' '}
        <Link
          to="/register"
          aria-disabled={isBusy || undefined}
          tabIndex={isBusy ? -1 : undefined}
          className={`text-blue-600 font-semibold hover:underline ${
            isBusy ? 'pointer-events-none opacity-50' : ''
          }`}
        >
          Daftar sekarang
        </Link>
      </div>
    </AuthLayout>
  )
}
