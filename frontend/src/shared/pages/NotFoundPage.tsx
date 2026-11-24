import { useNavigate } from 'react-router-dom'
import { KodiCharacter } from "@/shared/components/ui/KodiCharacter"
import { Button3D } from "@/shared/components/ui/Button3D"
import { Compass, ArrowLeft } from '@phosphor-icons/react'

export const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-900 flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="max-w-lg w-full bg-white border-2 border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-[0_6px_0_0_#E2E8F0] text-center">
        {/* Mascot */}
        <div className="flex justify-center mb-5">
          <KodiCharacter emotion="thinking" size={148} interactive />
        </div>

        {/* Eyebrow */}
        <p className="font-mono text-xs font-bold tracking-[0.2em] uppercase text-blue-600 mb-2">
          404
        </p>

        {/* Headline */}
        <h1 className="text-2xl sm:text-3xl font-brand font-black text-slate-900 tracking-tight mb-3">
          Halaman Tidak Ditemukan
        </h1>

        <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-7 max-w-md mx-auto">
          Tautan yang kamu buka sepertinya salah ketik atau halamannya sudah dipindahkan. Yuk, kembali ke halaman belajar!
        </p>

        {/* Actions */}
        <div className="flex flex-col items-center gap-3.5 max-w-xs mx-auto">
          <Button3D
            variant="blue"
            size="lg"
            icon={<Compass size={20} weight="fill" />}
            onClick={() => navigate('/curriculum')}
            fullWidth
          >
            Kembali ke Kurikulum
          </Button3D>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 font-bold transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} weight="bold" />
            <span>Kembali ke halaman sebelumnya</span>
          </button>
        </div>
      </div>
    </div>
  )
}
