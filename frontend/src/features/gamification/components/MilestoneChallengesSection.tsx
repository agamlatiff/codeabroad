import { Check } from '@phosphor-icons/react'
import { Button3D } from "@/shared/components/ui/Button3D"
import { KodiCharacter } from "@/shared/components/ui/KodiCharacter"
import type { MilestoneChallengeViewItem } from "@/features/gamification/constants/gamificationCatalog"

export interface MilestoneChallengesSectionProps {
  challenges: MilestoneChallengeViewItem[]
  hasSearchNoResults: boolean
  onStartChallenge: (route: string) => void
  onContinueCurriculum: () => void
}

export const MilestoneChallengesSection = ({
  challenges,
  hasSearchNoResults,
  onStartChallenge,
  onContinueCurriculum,
}: MilestoneChallengesSectionProps) => {
  if (challenges.length === 0 && !hasSearchNoResults) {
    return (
      <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-8 sm:p-10 text-center space-y-4 shadow-2xs">
        <div className="flex items-center justify-center mx-auto">
          <KodiCharacter emotion="thinking" size={100} />
        </div>
        <div className="space-y-1.5 max-w-md mx-auto">
          <h3 className="font-brand font-black text-base sm:text-lg text-slate-900">
            Tantangan Capstone Belum Terbuka
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
            Tantangan evaluasi tingkat lanjut memerlukan penguasaan modul dasar &amp; menengah. Selesaikan pelajaran kurikulum bahasa terlebih dahulu!
          </p>
        </div>
        <Button3D
          variant="blue"
          size="md"
          onClick={onContinueCurriculum}
          className="text-xs sm:text-sm px-6 py-3 mx-auto"
        >
          Tingkatkan Level di Kurikulum ▶
        </Button3D>
      </div>
    )
  }

  if (challenges.length === 0) {
    return null
  }

  const totalXpBounty = challenges.reduce((sum, item) => sum + item.xp_reward, 0)
  const totalGemBounty = challenges.reduce((sum, item) => sum + item.gem_reward, 0)

  return (
    <div className="space-y-4">
      {/* Console Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div>
          <h3 className="font-brand font-black text-base sm:text-lg text-slate-900 flex items-center gap-2">
            <span>⚔️</span>
            <span>Tantangan Penguasaan Bahasa</span>
            <span className="text-[10px] font-mono bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md border border-purple-200">
              MILESTONE TEST
            </span>
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Uji kemampuan membaca, menyimak, dan percakapan bisnis standar sertifikasi global.
          </p>
        </div>

        {/* Total Bounty Badge */}
        <div className="flex items-center gap-2 text-xs font-brand font-black bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl text-amber-900 shrink-0 self-start sm:self-auto shadow-2xs">
          <span>Bounty:</span>
          <span className="text-amber-600">⚡ +{totalXpBounty} XP</span>
          <span>•</span>
          <span className="text-blue-600">💎 +{totalGemBounty} Gems</span>
        </div>
      </div>

      {/* Tactile Mission Slat Cartridges */}
      <div className="bg-white border-2 border-slate-200/90 rounded-3xl divide-y-2 divide-slate-100 shadow-2xs overflow-hidden">
        {challenges.map((challenge, idx) => (
          <div
            key={challenge.id}
            className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:bg-slate-50/80 transition-colors group"
          >
            {/* Left: Indicator & Track Info */}
            <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 border-2 border-slate-200 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:border-blue-400 transition-all text-2xl shadow-2xs">
                {challenge.icon}
              </div>

              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black font-mono px-2.5 py-0.5 rounded-md border border-amber-300 bg-amber-50 text-amber-800 uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                    🏆 S-Rank Capstone
                  </span>
                  {challenge.isCompleted && (
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-flex items-center gap-1">
                      <Check weight="bold" className="w-3 h-3 text-emerald-600" />
                      <span>LULUS KUALIFIKASI</span>
                    </span>
                  )}
                </div>

                <h4 className="font-black text-sm sm:text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                  {challenge.title}
                </h4>

                <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-2xl">
                  {challenge.subtitle}
                </p>

                {/* Skill Tags Minimal Row */}
                <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                  {challenge.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/80"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Bounty & Tactile Action */}
            <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
              <div className="text-left md:text-right">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  Bounty
                </div>
                <div className="flex md:flex-col items-center md:items-end gap-1.5 md:gap-0 font-brand font-black text-xs">
                  <span className="text-amber-600">⚡ +{challenge.xp_reward} XP</span>
                  <span className="text-blue-600">💎 +{challenge.gem_reward} Gems</span>
                </div>
              </div>

              <div>
                <Button3D
                  variant={challenge.isCompleted ? 'ghost' : idx === 0 ? 'amber' : 'blue'}
                  size="sm"
                  onClick={() => onStartChallenge(challenge.route)}
                  className={`text-xs px-4 py-2 ${
                    challenge.isCompleted
                      ? 'border border-emerald-300 bg-emerald-50 text-emerald-700'
                      : ''
                  }`}
                >
                  {challenge.isCompleted ? (
                    <span className="inline-flex items-center gap-1">
                      <Check weight="bold" className="w-3.5 h-3.5 text-emerald-600" />
                      <span>LIHAT HASIL</span>
                    </span>
                  ) : (
                    'MULAI SAYEMBARA ➔'
                  )}
                </Button3D>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
