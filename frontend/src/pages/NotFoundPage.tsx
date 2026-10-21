import { useNavigate } from 'react-router-dom'
import { KodiMascot } from '../components/ui/KodiMascot'
import { Button3D } from '../components/ui/Button3D'
import { Compass, GameController, ArrowLeft } from '@phosphor-icons/react'

export const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full text-center">
        {/* Mascot */}
        <div className="flex justify-center mb-6">
          <KodiMascot
            emotion="thinking"
            size="xl"
            speechText="Hmm, radar Kodi tidak mendeteksi koordinat ini!"
            speechDirection="bottom"
          />
        </div>

        {/* 404 Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-brand font-black text-xs tracking-wider uppercase mb-3">
          Error 404 — Koordinat Hilang
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl font-brand font-black text-white tracking-tight mb-3">
          Jalur Ini Belum Terpetakan
        </h1>

        <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto">
          Halaman yang kamu tuju sepertinya salah ketik atau telah dipindahkan ke stasiun belajar lain. Yuk, kembali ke jalur karirmu!
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
          <Button3D
            variant="blue"
            size="lg"
            icon={<Compass size={20} weight="fill" />}
            onClick={() => navigate('/courses')}
            fullWidth
          >
            Buka Roadmap
          </Button3D>

          <Button3D
            variant="dark"
            size="lg"
            icon={<GameController size={20} weight="fill" />}
            onClick={() => navigate('/quests')}
            fullWidth
          >
            Quest Log
          </Button3D>
        </div>

        {/* Secondary back button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-6 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 font-bold transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} /> Kembali ke halaman sebelumnya
        </button>
      </div>
    </div>
  )
}
