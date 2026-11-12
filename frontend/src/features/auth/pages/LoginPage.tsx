import { Link } from 'react-router-dom'
import { useLogin } from "@/features/auth/hooks/useLogin"
import { AuthLayout } from "@/features/auth/components/AuthLayout"
// import { SocialAuthButton } from "@/features/auth/components/SocialAuthButton"
import { Input } from "@/shared/components/ui/Input"
// import { AuthDivider } from "@/features/auth/components/AuthDivider"
import { AuthCheckbox } from "@/features/auth/components/AuthCheckbox"
import { Button3D } from "@/shared/components/ui/Button3D"
import { EnvelopeSimple, LockSimple } from '@phosphor-icons/react'

export const LoginPage = () => {
  const { register, errors, status, actions } = useLogin()

  return (
    <AuthLayout
      title="Selamat Datang"
      subtitle="Masuk ke akunmu untuk melanjutkan persiapan karir tech."
      speechBubble="Halo! Siap lanjut push code hari ini? 🚀"
      error={status.error}
    >
      {/* ── 1. EMAIL & PASSWORD FORM (FIRST) ── */}
      <form onSubmit={actions.submit} noValidate className="space-y-3.5">
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

        <Input
          id="password"
          label="Kata Sandi"
          isPassword
          autoComplete="current-password"
          placeholder="Masukkan kata sandi kamu"
          error={errors.password?.message}
          icon={<LockSimple weight="bold" className="w-4 h-4" />}
          {...register('password')}
        />

        {/* Remember Me Row (Forgot Password temporarily disabled) */}
        <div className="flex items-center justify-between pt-0.5">
          <AuthCheckbox
            id="remember"
            label="Ingat saya"
            {...register('remember_me')}
          />
        </div>

        {/* Submit Button with Duolingo 3D Tactile Push-Down */}
        <Button3D
          type="submit"
          variant="blue"
          size="md"
          fullWidth
          loading={status.loading}
          className="mt-2 text-sm"
        >
          Masuk Sekarang
        </Button3D>
      </form>

      {/* ── 2. DIVIDER & GOOGLE OAUTH BUTTON (TEMPORARILY DISABLED) ── */}
      {/* <AuthDivider text="atau lanjutkan dengan" className="my-3.5 sm:my-4" />
      <div className="space-y-3">
        <SocialAuthButton provider="google" onClick={actions.googleLogin}>
          Masuk dengan Google
        </SocialAuthButton>
      </div> */}

      {/* ── 4. REGISTRATION FOOTER ── */}
      <div className="mt-4 sm:mt-5 text-center text-xs text-slate-500 font-normal">
        Belum punya akun?{' '}
        <Link to="/register" className="text-blue-600 font-semibold hover:underline">
          Daftar sekarang
        </Link>
      </div>
    </AuthLayout>
  )
}
