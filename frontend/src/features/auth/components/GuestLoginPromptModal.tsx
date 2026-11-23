import { useNavigate } from 'react-router-dom'
import {
  CheckCircle,
  Fire,
  Lightning,
  LockSimple,
  Sparkle,
  UserPlus,
  X,
} from '@phosphor-icons/react'
import { AccessibleModal } from '@/shared/components/ui/AccessibleModal'
import { Button3D } from '@/shared/components/ui/Button3D'
import { KodiCharacter } from '@/shared/components/ui/KodiCharacter'
import { triggerHaptic } from '@/shared/utils/haptics'

export type GuestLoginPromptReason =
  | 'locked_unit'
  | 'save_progress'
  | 'quests'
  | 'srs_review'
  | 'exam'
  | 'kana_practice'
  | 'grammar_check'
  | 'flashcard_srs'

interface PromptCopyConfig {
  badge: string
  title: string
  description: string
  emotion: 'idea' | 'celebrate' | 'happy' | 'thinking'
}

const PROMPT_COPY_BY_REASON: Record<GuestLoginPromptReason, PromptCopyConfig> = {
  locked_unit: {
    badge: 'Unit Lanjutan',
    title: 'Buka Semua Unit Lanjutan Secara Gratis!',
    description:
      'Kamu sudah lihat alur Unit 1. Buat akun gratis dalam 10 detik untuk lanjut ke unit berikutnya dan simpan progres belajarmu.',
    emotion: 'happy',
  },
  save_progress: {
    badge: 'Simpan Progresmu',
    title: 'Jangan Sampai XP Latihanmu Hilang!',
    description:
      'Daftarkan akun gratis agar XP, riwayat latihan, dan capaianmu tersimpan aman dan bisa diakses dari perangkat mana saja.',
    emotion: 'celebrate',
  },
  quests: {
    badge: 'Misi & Toko Hadiah',
    title: 'Kumpulkan Gems & Klaim Misi Harian',
    description:
      'Masuk dengan akun gratis untuk menyelesaikan Misi Harian, membuka Peti Harta, dan menukar Gems dengan Streak Freeze.',
    emotion: 'idea',
  },
  srs_review: {
    badge: 'Ulasan Terjadwal',
    title: 'Aktifkan Pengingat Ulasan Otomatis',
    description:
      'Soal yang masih keliru akan dijadwalkan ulang secara otomatis sesuai progresmu. Daftar gratis untuk menyimpan daftar ulasanmu.',
    emotion: 'thinking',
  },
  exam: {
    badge: 'Ujian Kesiapan Sertifikasi',
    title: 'Uji Kesiapan & Raih Sertifikat Belajar',
    description:
      'Masuk untuk mengikuti ujian membaca, mendengar, menulis, dan berbicara serta mencatat riwayat skor kelulusanmu.',
    emotion: 'happy',
  },
  kana_practice: {
    badge: 'Penguasaan Aksara',
    title: 'Simpan Penguasaan Aksara & Latihan Tulis',
    description:
      'Latihan lokal tetap bisa dicoba di mode tamu. Buat akun gratis jika ingin catatan perkembangan tiap huruf tersimpan permanen.',
    emotion: 'idea',
  },
  grammar_check: {
    badge: 'Pemahaman Grammar',
    title: 'Catat Skor & Jadwal Ulasan Tata Bahasa',
    description:
      'Skor kuis pemahamanmu butuh akun agar sistem bisa mengingatkan kapan pola kalimat ini perlu diulang kembali.',
    emotion: 'idea',
  },
  flashcard_srs: {
    badge: 'Jadwal Ulang Flashcard',
    title: 'Simpan Jadwal Ulang Kartu Kosakata',
    description:
      'Kamu tetap bebas membalik dan mendengar seluruh dek kartu di mode coba. Masuk agar jadwal pengulangan harianmu ikut tersimpan.',
    emotion: 'idea',
  },
}

const FREE_ACCOUNT_BENEFITS = [
  'Simpan progres pelajaran, kosakata, & tata bahasa di akunmu',
  'Jaga kebiasaan belajar lewat Streak harian & pelindungnya',
  'Jadwal ulang otomatis untuk materi yang perlu diasah & Papan Peringkat',
] as const

export interface GuestLoginPromptModalProps {
  isOpen: boolean
  onClose: () => void
  reason?: GuestLoginPromptReason
  customTitle?: string
  customDescription?: string
  pendingXp?: number
}

/**
 * Reusable persuasive conversion modal explaining the benefits of creating a free account
 * whenever a guest hits an account-backed feature or wants to save trial progress.
 */
export const GuestLoginPromptModal = ({
  isOpen,
  onClose,
  reason = 'locked_unit',
  customTitle,
  customDescription,
  pendingXp = 0,
}: GuestLoginPromptModalProps) => {
  const navigate = useNavigate()
  const copy = PROMPT_COPY_BY_REASON[reason]

  const handleRegister = () => {
    triggerHaptic('success')
    onClose()
    navigate('/register?from=guest')
  }

  const handleLogin = () => {
    triggerHaptic('tap')
    onClose()
    navigate('/login?from=guest')
  }

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel={customTitle ?? copy.title}
    >
      <div className="relative w-full max-w-md bg-white border-2 border-slate-200/95 rounded-3xl p-6 sm:p-7 shadow-[0_12px_36px_-10px_rgba(15,23,42,0.22)] animate-pop">
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup modal ajakan login"
          className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X weight="bold" className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center space-y-3">
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-2 rounded-full bg-gradient-to-tr from-blue-200/60 via-sky-100/60 to-amber-100/60 blur-md"
            />
            <div className="relative">
              <KodiCharacter emotion={copy.emotion} size={84} />
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-brand font-black text-[11px] uppercase tracking-wider">
              <LockSimple weight="fill" className="w-3.5 h-3.5" />
              <span>{copy.badge}</span>
            </span>

            {pendingXp > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-brand font-black text-[11px]">
                <Lightning weight="fill" className="w-3.5 h-3.5 text-amber-500" />
                <span>+{pendingXp} XP siap diklaim</span>
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-brand font-black text-slate-900 leading-tight">
              {customTitle ?? copy.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {customDescription ?? copy.description}
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl bg-slate-50 border border-slate-200/80 p-3.5 space-y-2.5 text-left">
          <div className="flex items-center gap-1.5 text-[11px] font-brand font-black uppercase tracking-wider text-slate-500">
            <Sparkle weight="fill" className="w-3.5 h-3.5 text-amber-500" />
            <span>Kenapa Buat Akun Gratis?</span>
          </div>
          {FREE_ACCOUNT_BENEFITS.map((benefit) => (
            <div key={benefit} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
              <CheckCircle weight="fill" className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-2.5">
          <Button3D
            type="button"
            variant="blue"
            size="md"
            fullWidth
            icon={<UserPlus weight="bold" className="w-4 h-4" />}
            onClick={handleRegister}
          >
            {pendingXp > 0 ? `Daftar Gratis & Klaim +${pendingXp} XP` : 'Daftar Gratis Sekarang'}
          </Button3D>

          <Button3D
            type="button"
            variant="white"
            size="sm"
            fullWidth
            icon={<Fire weight="fill" className="w-4 h-4 text-orange-500" />}
            onClick={handleLogin}
          >
            Sudah Punya Akun? Masuk
          </Button3D>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            Nanti dulu, lanjut coba materi terbuka
          </button>
        </div>
      </div>
    </AccessibleModal>
  )
}
