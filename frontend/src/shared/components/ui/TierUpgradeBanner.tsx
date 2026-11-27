import type { FC } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle,
  Crown,
  LockSimple,
  SignIn,
  Sparkle,
  UserPlus,
} from '@phosphor-icons/react'
import { Button3D } from '@/shared/components/ui/Button3D'
import type { LevelAccessReason } from '@/shared/utils/levelAccess'
import { triggerHaptic } from '@/shared/utils/haptics'

export interface TierUpgradeBannerProps {
  levelCode: string
  reason: Exclude<LevelAccessReason, 'ok'>
  featureLabel?: string
  onSelectFreeLevel?: () => void
}

/**
 * Unified Merantalk access-gate card rendered when a learner opens a level
 * requiring a free account (N4-N3) or a Pro subscription (N2-N1) across
 * Curriculum, Grammar, and Flashcards.
 */
export const TierUpgradeBanner: FC<TierUpgradeBannerProps> = ({
  levelCode,
  reason,
  featureLabel = 'materi',
  onSelectFreeLevel,
}) => {
  const navigate = useNavigate()
  const normalized = levelCode.trim().toUpperCase()
  const isCefrTrack = /^(A1|A2|B1|B2|C1|C2)$/.test(normalized)
  const examPrefix = isCefrTrack ? 'CEFR' : 'JLPT'
  const freeGuestLevel = isCefrTrack ? 'A1' : 'N5'
  const freeAccountRange = isCefrTrack ? 'CEFR A2 & B1' : 'JLPT N4 & N3'
  const proRange = isCefrTrack ? 'B2, C1 & C2 (TOEFL 72–120)' : 'N2 & N1'

  if (reason === 'login_required') {
    const loginPerks = isCefrTrack
      ? [
          'Kurikulum A2 & B1 penuh (20 Unit · 640+ Soal)',
          'Panduan Grammar & 20 Deck Flashcard A2–B1',
          'Progres, XP, dan Streak tersimpan otomatis',
        ]
      : [
          'Kurikulum N4 & N3 penuh (20 Unit · 600 Soal)',
          'Panduan Grammar & 40 Deck Flashcard N4–N3',
          'Progres, XP, dan Streak tersimpan otomatis',
        ]

    return (
      <section className="min-w-0 bg-white border-2 border-blue-200/90 rounded-3xl p-5 sm:p-8 shadow-[0_6px_0_0_#DBEAFE] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border-2 border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
            <LockSimple weight="duotone" className="w-6 h-6" />
          </div>
          <div className="space-y-1.5 min-w-0 flex-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-brand font-black uppercase tracking-wider whitespace-nowrap">
              <Sparkle weight="fill" className="w-3 h-3 shrink-0" />
              <span>Gratis untuk Akun Terdaftar</span>
            </span>
            <h2 className="font-brand font-black text-xl sm:text-2xl text-slate-900 leading-tight">
              Daftar Gratis untuk Membuka {featureLabel} {examPrefix} {normalized}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
              Level <strong>{freeGuestLevel}</strong> bisa langsung kamu coba tanpa akun. Untuk
              membuka penuh kurikulum, grammar, dan flashcard <strong>{freeAccountRange}</strong>,
              cukup buat akun gratis dalam 30 detik.
            </p>
          </div>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {loginPerks.map((perk) => (
            <li
              key={perk}
              className="min-w-0 flex items-start gap-2 rounded-2xl bg-slate-50 border border-slate-200/80 px-3.5 py-2.5 text-xs font-semibold text-slate-700"
            >
              <CheckCircle weight="fill" className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{perk}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Button3D
            variant="blue"
            size="md"
            icon={<UserPlus weight="bold" className="w-4 h-4" />}
            onClick={() => {
              triggerHaptic('tap')
              navigate('/register')
            }}
          >
            Daftar Gratis Sekarang
          </Button3D>
          <Link
            to="/login"
            onClick={() => triggerHaptic('tap')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border-2 border-slate-200 hover:border-blue-300 text-xs sm:text-sm font-brand font-black text-slate-700 hover:text-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <SignIn weight="bold" className="w-4 h-4" />
            <span>Sudah Punya Akun? Masuk</span>
          </Link>
          {onSelectFreeLevel && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic('tap')
                onSelectFreeLevel()
              }}
              className="text-xs font-brand font-bold text-slate-500 hover:text-slate-800 underline underline-offset-4 cursor-pointer px-2 py-1"
            >
              Kembali ke {freeGuestLevel}
            </button>
          )}
        </div>
      </section>
    )
  }

  const proPerks = isCefrTrack
    ? [
        'Bebas lompat ke unit mana pun tanpa harus berurutan',
        'Kurikulum B2, C1 & C2 penuh (30 Unit · Fokus TOEFL iBT 72–120)',
        '30 Panduan Grammar & 30 Deck Kartu Kosakata B2–C2 dengan pengingat otomatis',
      ]
    : [
        'Bebas lompat ke unit mana pun (Unit 1 langsung ke Unit 3+)',
        'Kurikulum N2 & N1 penuh (20 Unit · 600 Soal)',
        '20 Panduan Grammar & 40 Deck Kartu Kosakata N2–N1 dengan pengingat otomatis',
      ]

  return (
    <section className="min-w-0 bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 text-white border-2 border-blue-700 rounded-3xl p-5 sm:p-8 shadow-[0_6px_0_0_#1D4ED8] space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white/15 border-2 border-white/25 text-amber-300 flex items-center justify-center shrink-0">
          <Crown weight="fill" className="w-6 h-6" />
        </div>
        <div className="space-y-1.5 min-w-0 flex-1">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-amber-300 text-amber-950 text-[11px] font-brand font-black uppercase tracking-wider whitespace-nowrap">
            <Sparkle weight="fill" className="w-3 h-3 text-amber-900 shrink-0" />
            <span>Merantalk Pro • Mulai Rp 33rb/bln</span>
          </span>
          <h2 className="font-brand font-black text-xl sm:text-2xl text-white leading-tight">
            Buka {featureLabel} {examPrefix} {normalized} dengan Merantalk Pro
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed max-w-2xl">
            Level <strong>{proRange}</strong> dirancang khusus untuk target karier profesional
            internasional, beasiswa universitas (LPDP/Fulbright/MEXT), dan skor sertifikasi tingkat
            mahir.
          </p>
        </div>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
        {proPerks.map((perk) => (
          <li
            key={perk}
            className="min-w-0 flex items-start gap-2 rounded-2xl bg-white/15 border border-white/20 px-3.5 py-2.5 text-xs font-semibold text-white"
          >
            <CheckCircle weight="fill" className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            <span>{perk}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <Button3D
          variant="white"
          size="md"
          icon={<ArrowRight weight="bold" className="w-4 h-4 text-blue-700" />}
          onClick={() => {
            triggerHaptic('tap')
            navigate('/pricing')
          }}
          className="text-blue-700 font-brand font-black"
        >
          Lihat Paket Merantalk Pro
        </Button3D>
        {onSelectFreeLevel && (
          <button
            type="button"
            onClick={() => {
              triggerHaptic('tap')
              onSelectFreeLevel()
            }}
            className="text-xs font-brand font-bold text-blue-100 hover:text-white underline underline-offset-4 cursor-pointer px-2 py-1"
          >
            Kembali ke level yang terbuka
          </button>
        )}
      </div>
    </section>
  )
}
