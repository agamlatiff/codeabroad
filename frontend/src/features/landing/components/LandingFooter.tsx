import { Link } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import { Button3D } from '@/shared/components/ui/Button3D'
import { Logo } from '@/shared/components/ui/Logo'
import { KodiCharacter } from '@/shared/components/ui/KodiCharacter'

export const LandingFooter = () => {
  return (
    <footer className="py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 p-7 sm:p-10 text-white shadow-[0_10px_0_0_#1E3A8A] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="hidden sm:block shrink-0">
              <KodiCharacter emotion="celebrate" size={82} />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-brand font-black leading-tight">
                Siap Mulai Langkah Pertama ke Luar Negeri?
              </h2>
              <p className="text-sm text-blue-100 max-w-xl">
                Langsung buka peta kurikulum sekarang tanpa login, atau buat akun gratis agar
                seluruh pencapaian belajarmu selalu aman.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
            <Link to="/curriculum" className="w-full sm:w-auto">
              <Button3D
                variant="amber"
                size="md"
                fullWidth
                icon={<ArrowRight weight="bold" className="w-4 h-4" />}
              >
                Coba Sekarang
              </Button3D>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button3D variant="white" size="md" fullWidth>
                Masuk Akun
              </Button3D>
            </Link>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <Logo size="sm" variant="slate" linkTo="/" />
          <div className="flex flex-wrap items-center justify-center gap-4 font-semibold">
            <a href="#bahasa" className="hover:text-slate-900 transition-colors">
              Bahasa
            </a>
            <Link to="/curriculum" className="hover:text-slate-900 transition-colors">
              Peta Belajar
            </Link>
            <Link to="/kana/hiragana" className="hover:text-slate-900 transition-colors">
              Papan Aksara
            </Link>
            <Link to="/flashcards" className="hover:text-slate-900 transition-colors">
              Flashcard
            </Link>
            <Link to="/grammar" className="hover:text-slate-900 transition-colors">
              Grammar
            </Link>
            <Link to="/leaderboard" className="hover:text-slate-900 transition-colors">
              Peringkat
            </Link>
          </div>
          <p className="font-medium">© {new Date().getFullYear()} Merantalk</p>
        </div>
      </div>
    </footer>
  )
}
