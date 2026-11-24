import { Link } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import { Button3D } from '@/shared/components/ui/Button3D'
import { Logo } from '@/shared/components/ui/Logo'
import { KodiCharacter } from '@/shared/components/ui/KodiCharacter'

export const LandingFooter = () => {
  return (
    <footer className="py-12 sm:py-16 border-t border-slate-200/80 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="rounded-3xl bg-[#FAFAF9] border border-slate-200/90 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="hidden sm:block shrink-0">
              <KodiCharacter emotion="welcome" size={64} interactive={false} />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-brand font-black text-slate-900 leading-tight">
                Siap Mulai Belajar Hari Ini?
              </h2>
              <p className="text-sm text-slate-600 max-w-lg">
                Langsung buka peta kurikulum untuk mencoba Unit 1 tanpa login, atau daftar akun
                gratis supaya progresmu selalu tersimpan.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
            <Link to="/curriculum" className="w-full sm:w-auto">
              <Button3D
                variant="blue"
                size="md"
                fullWidth
                icon={<ArrowRight weight="bold" className="w-4 h-4" />}
              >
                Buka Kurikulum
              </Button3D>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button3D variant="white" size="md" fullWidth>
                Masuk
              </Button3D>
            </Link>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <Logo size="sm" variant="slate" linkTo="/" />
          <div className="flex flex-wrap items-center justify-center gap-5 font-semibold">
            <a href="#bahasa" className="hover:text-slate-900 transition-colors">
              Bahasa
            </a>
            <Link to="/curriculum" className="hover:text-slate-900 transition-colors">
              Peta Belajar
            </Link>
            <Link to="/flashcards" className="hover:text-slate-900 transition-colors">
              Flashcard
            </Link>
            <Link to="/grammar" className="hover:text-slate-900 transition-colors">
              Tata Bahasa
            </Link>
          </div>
          <p className="font-medium">© {new Date().getFullYear()} Merantalk</p>
        </div>
      </div>
    </footer>
  )
}
