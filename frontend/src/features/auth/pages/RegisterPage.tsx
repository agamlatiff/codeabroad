import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useWatch } from 'react-hook-form'
import { useRegister } from "@/features/auth/hooks/useRegister"
import { AuthLayout } from "@/features/auth/components/AuthLayout"
import { GoogleAuthButton } from "@/features/auth/components/GoogleAuthButton"
import { Input } from "@/shared/components/ui/Input"
import { PasswordStrengthMeter } from "@/features/auth/components/PasswordStrengthMeter"
import { Button3D } from "@/shared/components/ui/Button3D"
import { User, At, EnvelopeSimple, LockSimple } from '@phosphor-icons/react'

export const RegisterPage = () => {
  const { register, control, errors, status, actions } = useRegister()
  const [googleError, setGoogleError] = useState<string | null>(null)
  const [googleLoading, setGoogleLoading] = useState(false)
  const password = useWatch({ control, name: 'password', defaultValue: '' }) ?? ''

  const handleSubmit = (event: FormEvent) => {
    setGoogleError(null)
    actions.submit(event)
  }

  return (
    <AuthLayout
      mode="register"
      title="Daftar Akun Baru"
      subtitle="Isi data singkat di bawah untuk mulai belajar bahasa baru."
      heroTitle="Kuasai Bahasa Impianmu Secara Terstruktur"
      heroSubtitle="Bangun kebiasaan belajar lintas bahasa dengan kurikulum terstruktur, latihan kosakata harian, dan persiapan sertifikasi global."
      heroEmotion="happy"
      speechBubble="Yuk mulai petualangan bahasa barumu bareng Mera!"
      helperBanner="Progres Unit 1 yang sudah kamu coba tanpa login akan tersimpan otomatis."
      error={status.error || googleError}
    >
      {/* ── 1. GOOGLE OAUTH CUSTOM BUTTON ── */}
      <GoogleAuthButton
        mode="register"
        rememberMe={true}
        disabled={status.loading}
        onLoadingChange={setGoogleLoading}
        onStart={status.clearError}
        onError={setGoogleError}
      />

      {/* ── 2. REGISTRATION FORM ── */}
      <form onSubmit={handleSubmit} noValidate className="space-y-2 sm:space-y-2.5">
        <Input
          id="name"
          label="Nama Lengkap"
          type="text"
          autoComplete="name"
          placeholder="Contoh: Budi Pratama"
          error={errors.name?.message}
          icon={<User weight="bold" className="w-4 h-4" />}
          {...register('name')}
        />

        <Input
          id="username"
          label="Username"
          type="text"
          autoComplete="username"
          placeholder="nama_kamu"
          error={errors.username?.message}
          icon={<At weight="bold" className="w-4 h-4" />}
          {...register('username')}
        />

        <Input
          id="email"
          label="Alamat Email"
          type="email"
          autoComplete="email"
          placeholder="nama@email.com"
          error={errors.email?.message}
          icon={<EnvelopeSimple weight="bold" className="w-4 h-4" />}
          {...register('email')}
        />

        <div>
          <Input
            id="password"
            label="Kata Sandi"
            isPassword
            autoComplete="new-password"
            placeholder="Minimal 8 karakter"
            error={errors.password?.message}
            icon={<LockSimple weight="bold" className="w-4 h-4" />}
            {...register('password')}
          />
          {/* Real-time Password Strength Meter */}
          <PasswordStrengthMeter password={password} />
        </div>

        {/* Submit Button with Duolingo 3D Tactile Push-Down */}
        <Button3D
          type="submit"
          variant="blue"
          size="md"
          fullWidth
          loading={status.loading}
          disabled={googleLoading}
          className="mt-2.5 text-sm"
        >
          Daftar Sekarang
        </Button3D>
      </form>

      {/* ── LOGIN FOOTER ── */}
      <div className="mt-3.5 sm:mt-4 text-center text-xs text-slate-500 font-normal">
        Sudah punya akun?{' '}
        <Link to="/login" className="text-blue-600 font-semibold hover:underline">
          Masuk sekarang
        </Link>
      </div>
    </AuthLayout>
  )
}
