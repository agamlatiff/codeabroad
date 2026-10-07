import { Link } from 'react-router-dom'
import { useLogin } from '../hooks'
import { AuthLayout } from '../components/auth/AuthLayout'
import { SocialAuthButton } from '../components/auth/SocialAuthButton'
import { AuthField } from '../components/auth/AuthField'
import { AuthDivider } from '../components/auth/AuthDivider'
import { AuthCheckbox } from '../components/auth/AuthCheckbox'
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react'

export const LoginPage = () => {
  const { form, status, actions } = useLogin()

  return (
    <AuthLayout
      title="Selamat Datang"
      subtitle="Masuk ke akunmu untuk melanjutkan persiapan karir tech."
      speechBubble="Halo! Siap lanjut push code hari ini? 🚀"
    >
      {/* Error Alert */}
      {status.error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{status.error}</span>
        </div>
      )}

      {/* ── 1. EMAIL & PASSWORD FORM (FIRST) ── */}
      <form onSubmit={actions.submit} noValidate className="space-y-3.5">
        <AuthField
          id="email"
          label="Alamat Email"
          type="email"
          placeholder="nama@email.com"
          value={form.email}
          error={form.fieldErrors.email}
          onChange={(e) => {
            form.setEmail(e.target.value)
            form.clearFieldError('email')
          }}
          icon={<Mail className="w-4 h-4" />}
        />

        <AuthField
          id="password"
          label="Kata Sandi"
          isPassword
          placeholder="Masukkan kata sandi kamu"
          value={form.password}
          error={form.fieldErrors.password}
          onChange={(e) => {
            form.setPassword(e.target.value)
            form.clearFieldError('password')
          }}
          icon={<Lock className="w-4 h-4" />}
        />

        {/* Remember Me & Forgot Password Row */}
        <div className="flex items-center justify-between pt-0.5">
          <AuthCheckbox
            id="remember"
            label="Ingat saya"
            checked={form.rememberMe}
            onChange={(e) => form.setRememberMe(e.target.checked)}
          />
          <button
            type="button"
            className="text-xs font-medium text-[#4F46E5] hover:text-[#4338CA] hover:underline cursor-pointer"
          >
            Lupa kata sandi?
          </button>
        </div>

        {/* Submit Button with Elevated Glow */}
        <button
          type="submit"
          disabled={status.loading}
          className="w-full h-11 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#4338CA] hover:from-[#4338CA] hover:to-[#3730A3] active:scale-[0.99] text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center cursor-pointer shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 mt-2"
        >
          {status.loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Masuk Sekarang'}
        </button>
      </form>

      {/* ── 2. DIVIDER ── */}
      <AuthDivider text="atau lanjutkan dengan" className="my-3.5 sm:my-4" />

      {/* ── 3. GOOGLE OAUTH BUTTON (SECOND) ── */}
      <div className="space-y-3">
        <SocialAuthButton provider="google" onClick={actions.googleLogin}>
          Masuk dengan Google
        </SocialAuthButton>
      </div>

      {/* ── 4. REGISTRATION FOOTER ── */}
      <div className="mt-4 sm:mt-5 text-center text-xs text-slate-500 font-normal">
        Belum punya akun?{' '}
        <Link to="/register" className="text-[#4F46E5] font-semibold hover:underline">
          Daftar sekarang
        </Link>
      </div>
    </AuthLayout>
  )
}

