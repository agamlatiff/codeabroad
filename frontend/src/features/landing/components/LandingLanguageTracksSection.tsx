import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'motion/react'
import { ArrowRight, Clock } from '@phosphor-icons/react'
import { languageService } from '@/features/curriculum/services/languageService'
import { LANGUAGES_QUERY_KEY } from '@/shared/constants/queryKeys'
import {
  GLOBAL_LANGUAGE_CATALOG,
  getLanguageCatalogMeta,
} from '@/shared/constants/languageCatalog'
import { LanguageFlagIllustration } from '@/features/onboarding/components/illustrations/FlagIllustrations'

interface TrackItem {
  id: string
  code: string
  name: string
  examTag: string
  description: string
  isActive: boolean
}

export const LandingLanguageTracksSection = () => {
  const { data: languages = [] } = useQuery({
    queryKey: LANGUAGES_QUERY_KEY,
    queryFn: ({ signal }) => languageService.listLanguages({ signal }),
    staleTime: 1000 * 60 * 10,
    retry: false,
  })

  const allTracks: TrackItem[] =
    languages.length > 0
      ? languages.map((lang) => {
          const meta = getLanguageCatalogMeta(lang.code, lang.name)
          return {
            id: lang.id,
            code: lang.code,
            name: lang.name || meta.name,
            examTag: meta.examTag,
            description: meta.description,
            isActive: lang.is_active,
          }
        })
      : GLOBAL_LANGUAGE_CATALOG.map((meta) => ({
          id: '',
          code: meta.code,
          name: meta.name,
          examTag: meta.examTag,
          description: meta.description,
          isActive: meta.fallbackActive,
        }))

  const activeTracks = allTracks.filter((item) => item.isActive)
  const upcomingTracks = allTracks.filter((item) => !item.isActive)

  return (
    <section id="bahasa" className="py-14 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-brand font-black uppercase tracking-widest text-blue-600">
              Pilihan Bahasa Target
            </p>
            <h2 className="text-2xl sm:text-4xl font-brand font-black text-slate-900 tracking-tight">
              Fokus pada Jalur yang Siap Dipelajari
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Setiap bahasa disusun mengikuti standar ujian resmi internasional. Bahasa aktif di
              bawah ini bisa langsung kamu buka dan coba Unit 1-nya sekarang.
            </p>
          </div>
        </div>

        {/* Active Tracks (Prominent Interactive Cards) */}
        <div
          className={`grid gap-5 ${
            activeTracks.length === 1
              ? 'max-w-xl'
              : activeTracks.length === 2
                ? 'md:grid-cols-2'
                : 'sm:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {activeTracks.map((item, idx) => {
            const targetHref = item.id ? `/curriculum/${item.id}` : '/curriculum'
            return (
              <motion.div
                key={item.id || item.code}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
              >
                <Link
                  to={targetHref}
                  className="group h-full bg-white border-2 border-slate-200/95 hover:border-blue-400 rounded-3xl p-6 shadow-[0_6px_0_0_#E2E8F0] hover:-translate-y-0.5 transition-all flex flex-col justify-between gap-5"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-10 rounded-xl border border-slate-200 bg-white overflow-hidden shrink-0">
                          <LanguageFlagIllustration
                            code={item.code}
                            compact
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-brand font-black text-slate-900 leading-tight">
                            Bahasa {item.name}
                          </h3>
                          <span className="text-xs font-mono font-bold text-blue-600">
                            {item.examTag}
                          </span>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-brand font-black text-[11px] shrink-0">
                        Unit 1 Terbuka
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                  </div>

                  <div className="inline-flex items-center gap-1.5 text-sm font-brand font-black text-blue-600 group-hover:text-blue-700">
                    <span>Buka Kurikulum {item.name}</span>
                    <ArrowRight
                      weight="bold"
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Upcoming Tracks (Honest, Compact Strip instead of giant locked cards) */}
        {upcomingTracks.length > 0 && (
          <div className="rounded-2xl bg-white border border-slate-200/90 px-4 py-3.5 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-brand font-bold text-slate-500 shrink-0">
              <Clock weight="bold" className="w-4 h-4 text-slate-400" />
              <span>Sedang Disiapkan:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 flex-1">
              {upcomingTracks.map((item) => (
                <span
                  key={item.id || item.code}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAFAF9] border border-slate-200/80 text-xs font-semibold text-slate-600"
                >
                  <span className="w-4.5 h-3 rounded-xs overflow-hidden border border-slate-200 shrink-0">
                    <LanguageFlagIllustration
                      code={item.code}
                      compact
                      className="w-full h-full object-contain"
                    />
                  </span>
                  <span>{item.name}</span>
                  <span className="text-[10px] font-mono text-slate-400">({item.examTag})</span>
                </span>
              ))}
            </div>

            <a
              href="#rute-belajar"
              className="text-xs font-brand font-black text-blue-600 hover:text-blue-700 shrink-0"
            >
              Lihat rute belajar ↓
            </a>
          </div>
        )}
      </div>
    </section>
  )
}
