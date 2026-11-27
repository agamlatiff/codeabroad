import { Link } from 'react-router-dom'
import {
  CheckCircle,
  Fire,
  Lightning,
  SignIn,
  Sparkle,
  UserPlus,
} from '@phosphor-icons/react'
import { BUTTON_3D_TOKENS } from '@/shared/tokens/elevationTokens'
import { KodiCharacter } from '@/shared/components/ui/KodiCharacter'
import { getGuestTotalXp, useGuestTrialStore } from '@/features/auth/store/guestTrialStore'

const CONVERSION_HIGHLIGHTS = [
  'Simpan progres Unit 1, kosakata & tata bahasa permanen',
  'Kumpulkan XP, jaga Streak harian & buka seluruh unit lanjutan',
  'Aktifkan Misi Harian & jadwal ulang materi otomatis',
] as const

/**
 * Persuasive right-rail conversion card shown to unauthenticated guests in place of
 * account-only Streak, Quests, Mistake Review, and Daily Vocab widgets (prevents unnecessary 401 queries).
 */
export const GuestConversionSidebarCard = () => {
  const completedLessons = useGuestTrialStore((s) => s.completedLessons)
  const guestXp = getGuestTotalXp(completedLessons)
  const completedCount = completedLessons.length

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border-2 border-blue-200/90 bg-gradient-to-b from-blue-50/75 via-white to-white p-4 shadow-[0_5px_0_0_#DBEAFE] space-y-3.5 text-center">
        <div className="flex items-center justify-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/90 border border-blue-200 text-blue-700 font-brand font-black text-[11px] uppercase tracking-wider">
            <Sparkle weight="fill" className="w-3.5 h-3.5 text-blue-600" />
            <span>Mode Coba Tanpa Login</span>
          </span>
        </div>

        <div className="flex justify-center py-1">
          <KodiCharacter
            emotion={completedCount > 0 ? 'celebrate' : 'idea'}
            size={88}
          />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-brand font-black text-slate-900 leading-snug">
            {completedCount > 0
              ? `Hebat! +${guestXp} XP Siap Disimpan`
              : 'Suka dengan Materi Merantalk?'}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {completedCount > 0
              ? `Kamu sudah mencoba ${completedCount} pelajaran Unit 1. Buat akun gratis sekarang agar progres & XP tidak hilang.`
              : 'Unit 1 terbuka penuh untuk dicoba gratis. Masuk atau daftar kapan saja untuk membuka seluruh unit & jalur bahasa!'}
          </p>
        </div>

        {completedCount > 0 && (
          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <div className="rounded-2xl bg-amber-50 border border-amber-200 px-2.5 py-2">
              <div className="flex items-center justify-center gap-1 text-amber-700 font-brand font-black text-sm">
                <Lightning weight="fill" className="w-4 h-4 text-amber-500" />
                <span>+{guestXp} XP</span>
              </div>
              <p className="text-[10px] font-bold text-amber-700/80">Sementara</p>
            </div>
            <div className="rounded-2xl bg-orange-50 border border-orange-200 px-2.5 py-2">
              <div className="flex items-center justify-center gap-1 text-orange-700 font-brand font-black text-sm">
                <Fire weight="fill" className="w-4 h-4 text-orange-500" />
                <span>{completedCount} Misi</span>
              </div>
              <p className="text-[10px] font-bold text-orange-700/80">Unit 1 Selesai</p>
            </div>
          </div>
        )}

        <div className="space-y-2 text-left pt-1">
          {CONVERSION_HIGHLIGHTS.map((item) => (
            <div key={item} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
              <CheckCircle weight="fill" className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2 pt-1">
          <Link
            to="/register?from=guest"
            className={`w-full ${BUTTON_3D_TOKENS.base} ${BUTTON_3D_TOKENS.variants.blue} ${BUTTON_3D_TOKENS.sizes.md}`}
          >
            <UserPlus weight="bold" className="w-4 h-4 shrink-0" />
            <span>{guestXp > 0 ? `Daftar & Klaim +${guestXp} XP` : 'Daftar Gratis (10 Detik)'}</span>
          </Link>
          <Link
            to="/login?from=guest"
            className={`w-full ${BUTTON_3D_TOKENS.base} ${BUTTON_3D_TOKENS.variants.white} ${BUTTON_3D_TOKENS.sizes.sm}`}
          >
            <SignIn weight="bold" className="w-4 h-4 shrink-0" />
            <span>Sudah Punya Akun? Masuk</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
