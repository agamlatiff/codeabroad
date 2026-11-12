import { Link } from 'react-router-dom'
import { useRegister } from "@/features/auth/hooks/useRegister"
import { AuthLayout } from "@/features/auth/components/AuthLayout"
import { Input } from "@/shared/components/ui/Input"
import { PasswordStrengthMeter } from "@/features/auth/components/PasswordStrengthMeter"
// import { SocialAuthButton } from "@/features/auth/components/SocialAuthButton"
// import { AuthDivider } from "@/features/auth/components/AuthDivider"
import { Button3D } from "@/shared/components/ui/Button3D"
import { User, At, EnvelopeSimple, LockSimple } from '@phosphor-icons/react'

export const RegisterPage = () => {
  const { register, watch, errors, status, actions } = useRegister()
  const password = watch('password') ?? ''

  return (
    <AuthLayout
      title="Daftar Akun Baru"
      subtitle="Lengkapi data di bawah ini untuk memulai petualangan karir tech global."
      heroTitle="Mulai Langkah Karir Global Impianmu"
      heroSubtitle="Bergabung bersama ribuan developer Indonesia untuk menembus coding interview ke Jepang, Jerman, dan Singapura."
      heroEmotion="coding"
      speechBubble="Yuk mulai petualangan coding globalmu bareng aku! ✨"
      error={status.error}
    >
      {/* ── 1. REGISTRATION FORM (FIRST) ── */}
      <form onSubmit={actions.submit} noValidate className="space-y-2 sm:space-y-2.5">
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
          className="mt-2.5 text-sm"
        >
          Daftar Sekarang
        </Button3D>
      </form>

      {/* ── 2. DIVIDER & GOOGLE OAUTH BUTTON (TEMPORARILY DISABLED) ── */}
      {/* <AuthDivider text="atau daftar dengan" className="my-3 sm:my-3.5" />
      <div className="space-y-3">
        <SocialAuthButton provider="google" onClick={actions.googleRegister}>
          Daftar dengan Google
        </SocialAuthButton>
      </div> */}

      {/* ── 4. LOGIN FOOTER ── */}
      <div className="mt-3.5 sm:mt-4 text-center text-xs text-slate-500 font-normal">
        Sudah punya akun?{' '}
        <Link to="/login" className="text-blue-600 font-semibold hover:underline">
          Masuk sekarang
        </Link>
      </div>
    </AuthLayout>
  )
}
