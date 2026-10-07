import { Link } from 'react-router-dom'
import { useRegister } from '../hooks'
import { AuthLayout } from '../components/auth/AuthLayout'
import { AuthField } from '../components/auth/AuthField'
import { PasswordStrengthMeter } from '../components/auth/PasswordStrengthMeter'
import { SocialAuthButton } from '../components/auth/SocialAuthButton'
import { AuthDivider } from '../components/auth/AuthDivider'
import { Button3D } from '../components/ui/Button3D'
import doodleCoding from '../assets/kodi/doodle-coding.png'
import { User, AtSign, Mail, Lock, AlertCircle } from 'lucide-react'

export const RegisterPage = () => {
  const { form, status, actions } = useRegister()

  return (
    <AuthLayout
      title="Daftar Akun Baru"
      subtitle="Lengkapi data di bawah ini untuk memulai petualangan karir tech global."
      heroTitle="Mulai Langkah Karir Global Impianmu"
      heroSubtitle="Bergabung bersama ribuan developer Indonesia untuk menembus coding interview ke Jepang, Jerman, dan Singapura."
      heroImage={doodleCoding}
      speechBubble="Yuk mulai petualangan coding globalmu bareng aku! ✨"
    >
      {/* Error Alert */}
      {status.error && (
        <div className="mb-3.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{status.error}</span>
        </div>
      )}

      {/* ── 1. REGISTRATION FORM (FIRST) ── */}
      <form onSubmit={actions.submit} noValidate className="space-y-2 sm:space-y-2.5">
        <AuthField
          id="name"
          label="Nama Lengkap"
          type="text"
          placeholder="Contoh: Budi Pratama"
          value={form.name}
          error={form.fieldErrors.name}
          onChange={(e) => {
            form.setName(e.target.value)
            form.clearFieldError('name')
          }}
          icon={<User className="w-4 h-4" />}
        />

        <AuthField
          id="username"
          label="Username"
          type="text"
          placeholder="nama_kamu"
          value={form.username}
          error={form.fieldErrors.username}
          onChange={(e) => {
            form.setUsername(e.target.value.toLowerCase().trim())
            form.clearFieldError('username')
          }}
          icon={<AtSign className="w-4 h-4" />}
        />

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

        <div>
          <AuthField
            id="password"
            label="Kata Sandi"
            isPassword
            placeholder="Minimal 8 karakter"
            value={form.password}
            error={form.fieldErrors.password}
            onChange={(e) => {
              form.setPassword(e.target.value)
              form.clearFieldError('password')
            }}
            icon={<Lock className="w-4 h-4" />}
          />
          {/* Real-time Password Strength Meter */}
          <PasswordStrengthMeter password={form.password} />
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

      {/* ── 2. DIVIDER ── */}
      <AuthDivider text="atau daftar dengan" className="my-3 sm:my-3.5" />

      {/* ── 3. GOOGLE OAUTH BUTTON ── */}
      <div className="space-y-3">
        <SocialAuthButton provider="google" onClick={actions.googleRegister}>
          Daftar dengan Google
        </SocialAuthButton>
      </div>

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

