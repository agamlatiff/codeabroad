import { Link } from 'react-router-dom'
import {
  CheckCircle,
  Compass,
  LockSimple,
  Sparkle,
  UserPlus,
} from '@phosphor-icons/react'
import { Button3D } from '@/shared/components/ui/Button3D'
import { GUEST_VS_ACCOUNT_ROWS } from '@/features/landing/data/landingContent'

export const LandingGuestVsAccountSection = () => {
  return (
    <section id="bandingkan" className="py-14 sm:py-18 bg-white border-t-2 border-slate-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-brand font-black text-xs uppercase tracking-wider">
            <Sparkle weight="fill" className="w-3.5 h-3.5 text-emerald-500" />
            <span>100% Gratis untuk Memulai</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-brand font-black text-slate-900 tracking-tight">
            Coba Bebas Sebagai Tamu, Simpan Progres dengan Akun Gratis
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Kami tidak memaksa login di depan. Coba dulu Unit 1 sepuasnya — dan kapan pun siap,
            hasil percobaanmu bisa langsung ikut tersimpan saat mendaftar.
          </p>
        </div>

        <div className="bg-[#FAFAF9] border-2 border-slate-200/95 rounded-3xl overflow-hidden shadow-[0_6px_0_0_#E2E8F0]">
          <div className="grid grid-cols-12 bg-slate-900 text-white px-5 py-4 text-xs sm:text-sm font-brand font-black">
            <div className="col-span-6">Kemampuan Platform</div>
            <div className="col-span-3 text-center text-slate-300">Mode Coba</div>
            <div className="col-span-3 text-center text-sky-300">Akun Gratis</div>
          </div>

          <div className="divide-y divide-slate-200">
            {GUEST_VS_ACCOUNT_ROWS.map((row) => (
              <div
                key={row.feature}
                className="grid grid-cols-12 items-center px-5 py-4 gap-3 text-xs sm:text-sm bg-white"
              >
                <div className="col-span-6 font-semibold text-slate-800">{row.feature}</div>
                <div className="col-span-3 text-center text-slate-500 font-medium flex items-center justify-center gap-1">
                  {row.guestAccess.includes('Terkunci') || row.guestAccess.includes('Perlu') ? (
                    <LockSimple weight="fill" className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden sm:inline" />
                  ) : null}
                  <span>{row.guestAccess}</span>
                </div>
                <div className="col-span-3 text-center font-brand font-black text-emerald-700 flex items-center justify-center gap-1">
                  <CheckCircle weight="fill" className="w-4 h-4 text-emerald-500 shrink-0 hidden sm:inline" />
                  <span>{row.accountAccess}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <Link to="/curriculum" className="w-full sm:w-auto">
            <Button3D
              variant="white"
              size="md"
              fullWidth
              icon={<Compass weight="fill" className="w-4 h-4 text-blue-600" />}
            >
              Masuk ke Mode Coba Dulu
            </Button3D>
          </Link>
          <Link to="/register" className="w-full sm:w-auto">
            <Button3D
              variant="blue"
              size="md"
              fullWidth
              icon={<UserPlus weight="bold" className="w-4 h-4" />}
            >
              Daftar Akun Gratis Sekarang
            </Button3D>
          </Link>
        </div>
      </div>
    </section>
  )
}
