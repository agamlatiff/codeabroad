import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowRight,
  GlobeHemisphereEast,
  LockSimple,
  Sparkle,
  SpeakerHigh,
} from '@phosphor-icons/react'
import { languageService } from '@/features/curriculum/services/languageService'
import { LANGUAGES_QUERY_KEY } from '@/shared/constants/queryKeys'
import {
  GLOBAL_LANGUAGE_CATALOG,
  getLanguageCatalogMeta,
} from '@/shared/constants/languageCatalog'
import { LanguageFlagIllustration } from '@/features/onboarding/components/illustrations/FlagIllustrations'

interface TrackCardItem {
  id: string
  code: string
  name: string
  examTag: string
  description: string
  badgeLabel: string
  isActive: boolean
}

export const LandingLanguageTracksSection = () => {
  const { data: languages = [] } = useQuery({
    queryKey: LANGUAGES_QUERY_KEY,
    queryFn: ({ signal }) => languageService.listLanguages({ signal }),
    staleTime: 1000 * 60 * 10,
    retry: false,
  })

  const trackItems: TrackCardItem[] =
    languages.length > 0
      ? languages.map((lang) => {
          const meta = getLanguageCatalogMeta(lang.code, lang.name)
          return {
            id: lang.id,
            code: lang.code,
            name: lang.name || meta.name,
            examTag: meta.examTag,
            description: meta.description,
            badgeLabel: meta.badgeLabel,
            isActive: lang.is_active,
          }
        })
      : GLOBAL_LANGUAGE_CATALOG.map((meta) => ({
          id: '',
          code: meta.code,
          name: meta.name,
          examTag: meta.examTag,
          description: meta.description,
          badgeLabel: meta.badgeLabel,
          isActive: meta.fallbackActive,
        }))

  return (
    <section id="bahasa" className="py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-brand font-black text-xs uppercase tracking-wider">
            <GlobeHemisphereEast weight="fill" className="w-3.5 h-3.5 text-blue-600" />
            <span>Multi-Bahasa • Siap Kerja &amp; Studi Global</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-brand font-black text-slate-900 tracking-tight">
            6 Jalur Bahasa &amp; Sertifikasi Internasional
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Dari Asia Timur hingga Eropa — pilih destinasi studimu atau kariermu, pelajari
            kurikulum terstruktur, dan coba langsung jalurnya sebelum mendaftar.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {trackItems.map((item) => {
            if (item.isActive) {
              const targetHref = item.id ? `/curriculum/${item.id}` : '/curriculum'
              return (
                <Link
                  key={item.id || item.code}
                  to={targetHref}
                  className="group bg-white border-2 border-emerald-300/90 hover:border-blue-400 rounded-3xl p-5 shadow-[0_6px_0_0_#D1FAE5] hover:shadow-[0_8px_0_0_#BFDBFE] hover:-translate-y-0.5 transition-all flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-16 h-11 rounded-xl border border-slate-200 bg-white overflow-hidden shrink-0">
                        <LanguageFlagIllustration
                          code={item.code}
                          compact
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-brand font-black text-[11px]">
                        <Sparkle weight="fill" className="w-3 h-3 text-emerald-500" />
                        <span>Aktif • Unit 1 Terbuka</span>
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-lg font-brand font-black text-slate-900">
                          {item.name}
                        </h3>
                        <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-lg shrink-0">
                          {item.examTag}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 text-sm font-brand font-black text-blue-600 group-hover:text-blue-700">
                    <span>Coba Unit 1 Tanpa Login</span>
                    <ArrowRight
                      weight="bold"
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </Link>
              )
            }

            return (
              <div
                key={item.id || item.code}
                className="bg-slate-50/85 border-2 border-slate-200/90 rounded-3xl p-5 shadow-[0_4px_0_0_#E2E8F0] flex flex-col justify-between gap-4"
              >
                <div className="space-y-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-16 h-11 rounded-xl border border-slate-200 bg-white overflow-hidden shrink-0">
                      <LanguageFlagIllustration
                        code={item.code}
                        compact
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200/75 border border-slate-300/80 text-slate-600 font-brand font-black text-[11px]">
                      <LockSimple weight="bold" className="w-3 h-3" />
                      <span>Segera Hadir</span>
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-lg font-brand font-black text-slate-800">{item.name}</h3>
                      <span className="text-[11px] font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-lg shrink-0">
                        {item.examTag}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <a
                  href="#coba-kilat"
                  className="inline-flex items-center gap-1.5 text-xs font-brand font-black text-slate-600 hover:text-blue-600 transition-colors w-fit"
                >
                  <SpeakerHigh weight="fill" className="w-4 h-4 text-blue-500" />
                  <span>Coba demo audio di bawah</span>
                </a>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
