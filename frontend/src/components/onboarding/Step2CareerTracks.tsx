import React from 'react'
import type { CareerPath, TechStack } from '../../types/onboarding'
import { Check, Lock } from 'lucide-react'
import {
  SpecialistMindsetIllustration,
  GeneralistMindsetIllustration,
  FrontendIllustration,
  BackendIllustration,
  FullstackIllustration,
  DevOpsIllustration,
  ProductEngineerIllustration,
  SolutionsArchitectIllustration,
  TechIcon,
} from '../illustrations/onboarding'
import { TRACK_BADGES, STACK_DESCRIPTIONS } from '../../static/onboarding'
import { formatStackBadge } from '../../utils/formatters'

export type Step2SubStep = 'mindset' | 'track' | 'stack' | 'stack_fe' | 'stack_be'

// Static track illustration lookup map placed outside the component
const TRACK_ILLUSTRATION_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  frontend: FrontendIllustration,
  backend: BackendIllustration,
  fullstack: FullstackIllustration,
  devops: DevOpsIllustration,
  product_engineer: ProductEngineerIllustration,
  solutions_architect: SolutionsArchitectIllustration,
}

interface Step2CareerTracksProps {
  trackSubStep: Step2SubStep
  setTrackSubStep: (subStep: Step2SubStep) => void
  mindsetTab: 'specialist' | 'generalist'
  onSwitchMindsetTab: (tab: 'specialist' | 'generalist') => void
  careerPaths: CareerPath[]
  selectedCareerPathId: string
  selectedCareerPath: CareerPath | undefined
  onSelectCareerPath: (path: CareerPath) => void
  selectedStackSlug: string
  onSelectStackSlug: (slug: string) => void
  selectedFullstackFe: string
  onSelectFullstackFe: (fe: string) => void
  selectedFullstackBe: string
  onSelectFullstackBe: (be: string) => void
  feOptions: (TechStack | { slug: string; label: string; is_active: boolean; badge: string })[]
  beOptions: (TechStack | { slug: string; label: string; is_active: boolean; badge: string })[]
}

export const Step2CareerTracks = ({
  trackSubStep,
  setTrackSubStep,
  mindsetTab,
  onSwitchMindsetTab,
  careerPaths,
  selectedCareerPathId,
  selectedCareerPath,
  onSelectCareerPath,
  selectedStackSlug,
  onSelectStackSlug,
  selectedFullstackFe,
  onSelectFullstackFe,
  selectedFullstackBe,
  onSelectFullstackBe,
  feOptions,
  beOptions,
}: Step2CareerTracksProps) => {
  return (
    <div className="w-full flex flex-col items-center">
      {/* ── SUB-STEP 2A: CAREER MINDSET SELECTION (2 HERO CARDS) ── */}
      {trackSubStep === 'mindset' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7 max-w-4xl w-full justify-items-center">
          {/* Card 1: Specialist Track */}
          <div
            role="button"
            tabIndex={0}
            aria-pressed={mindsetTab === 'specialist'}
            onClick={() => onSwitchMindsetTab('specialist')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSwitchMindsetTab('specialist')
              }
            }}
            className={`rounded-3xl p-6 sm:p-7 flex flex-col text-center transition-all duration-200 max-w-[380px] w-full relative focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20 ${
              mindsetTab === 'specialist'
                ? 'bg-indigo-50/60 border-2 border-[#4F46E5] shadow-md shadow-indigo-500/10 ring-4 ring-indigo-500/10 cursor-pointer'
                : 'bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-sm cursor-pointer'
            }`}
          >
            {/* Top Illustration Frame */}
            <div className="w-full h-40 sm:h-44 rounded-2xl flex items-center justify-center mb-4 overflow-hidden relative bg-[#F8FAFC]">
              <SpecialistMindsetIllustration />
              <span className="absolute top-2.5 right-2.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-indigo-100 text-indigo-700 border-indigo-200">
                3 Jalur Tersedia
              </span>
            </div>

            <div className="flex items-center justify-center gap-1.5 mb-1">
              <span className="text-base">🎯</span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Specialist Track
              </h2>
            </div>
            <p className="text-xs font-semibold text-indigo-600 mb-2">Deep Domain Mastery</p>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal mb-4">
              Fokus mendalam pada satu ranah rekayasa software spesifik dengan standar arsitektur mendalam.
            </p>

            {/* Sub-track preview chips */}
            <div className="mt-auto pt-3 border-t border-slate-100/90 flex flex-wrap gap-1.5 justify-center">
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">Backend</span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">Frontend</span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">Cloud &amp; DevOps</span>
            </div>

            <div className="mt-3 text-xs font-semibold">
              {mindsetTab === 'specialist' ? (
                <span className="text-[#4F46E5] flex items-center justify-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Mindset Terpilih
                </span>
              ) : (
                <span className="text-slate-400">Klik untuk memilih</span>
              )}
            </div>
          </div>

          {/* Card 2: Generalist Track */}
          <div
            role="button"
            tabIndex={0}
            aria-pressed={mindsetTab === 'generalist'}
            onClick={() => onSwitchMindsetTab('generalist')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onSwitchMindsetTab('generalist')
              }
            }}
            className={`rounded-3xl p-6 sm:p-7 flex flex-col text-center transition-all duration-200 max-w-[380px] w-full relative focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20 ${
              mindsetTab === 'generalist'
                ? 'bg-indigo-50/60 border-2 border-[#4F46E5] shadow-md shadow-indigo-500/10 ring-4 ring-indigo-500/10 cursor-pointer'
                : 'bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-sm cursor-pointer'
            }`}
          >
            {/* Top Illustration Frame */}
            <div className="w-full h-40 sm:h-44 rounded-2xl flex items-center justify-center mb-4 overflow-hidden relative bg-[#F8FAFC]">
              <GeneralistMindsetIllustration />
              <span className="absolute top-2.5 right-2.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-amber-100 text-amber-700 border-amber-200">
                3 Jalur Tersedia
              </span>
            </div>

            <div className="flex items-center justify-center gap-1.5 mb-1">
              <span className="text-base">🌐</span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Generalist Track
              </h2>
            </div>
            <p className="text-xs font-semibold text-amber-600 mb-2">End-to-End Product Impact</p>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal mb-4">
              Kuasai delivery produk dari hulu ke hilir dengan perpaduan frontend, backend, cloud, dan pemikiran produk.
            </p>

            {/* Sub-track preview chips */}
            <div className="mt-auto pt-3 border-t border-slate-100/90 flex flex-wrap gap-1.5 justify-center">
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">Fullstack &amp; Cloud</span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">Product Engineer</span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">Solutions Architect</span>
            </div>

            <div className="mt-3 text-xs font-semibold">
              {mindsetTab === 'generalist' ? (
                <span className="text-[#4F46E5] flex items-center justify-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Mindset Terpilih
                </span>
              ) : (
                <span className="text-slate-400">Klik untuk memilih</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── SUB-STEP 2B: SPECIFIC TRACK SELECTION (3 Symmetrical Cards) ── */}
      {trackSubStep === 'track' && (
        <div className="flex flex-col items-center w-full">
          {/* Subtle Mindset Context Header */}
          <div className="flex items-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold shadow-2xs">
              <span>{mindsetTab === 'specialist' ? '🎯' : '🌐'}</span>
              <span>{mindsetTab === 'specialist' ? 'Specialist Track' : 'Generalist Track'}</span>
            </span>
            <button
              type="button"
              onClick={() => setTrackSubStep('mindset')}
              className="text-xs text-slate-400 hover:text-indigo-600 font-semibold cursor-pointer transition-colors"
            >
              (Ubah Mindset)
            </button>
          </div>

          {/* 3 Symmetrical Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 max-w-5xl w-full justify-items-center">
            {(mindsetTab === 'specialist'
              ? careerPaths.filter((p) => ['frontend', 'backend', 'devops'].includes(p.slug))
              : careerPaths.filter((p) => ['fullstack', 'product_engineer', 'solutions_architect'].includes(p.slug))
            ).map((path) => {
              const isSelected = selectedCareerPathId === path.id
              const badge = TRACK_BADGES[path.slug] || { text: 'Jalur Aktif', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' }
              const isComingSoon = path.slug === 'product_engineer' || path.slug === 'solutions_architect'
              const TrackIllustration = TRACK_ILLUSTRATION_MAP[path.slug] || BackendIllustration

              return (
                <div
                  key={path.id}
                  role="button"
                  tabIndex={isComingSoon ? -1 : 0}
                  aria-disabled={isComingSoon}
                  aria-pressed={isSelected}
                  onClick={() => {
                    if (!isComingSoon) {
                      onSelectCareerPath(path)
                    }
                  }}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && !isComingSoon) {
                      e.preventDefault()
                      onSelectCareerPath(path)
                    }
                  }}
                  className={`rounded-3xl p-6 sm:p-7 flex flex-col items-center text-center transition-all duration-200 max-w-[310px] sm:max-w-[330px] w-full relative focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20 ${
                    isComingSoon
                      ? 'bg-slate-50/70 border border-dashed border-slate-300/80 opacity-60 cursor-not-allowed select-none'
                      : isSelected
                      ? 'bg-indigo-50/60 border-2 border-[#4F46E5] shadow-md shadow-indigo-500/10 ring-4 ring-indigo-500/10 cursor-pointer'
                      : 'bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-sm cursor-pointer'
                  }`}
                >
                  {/* Top Track Illustration Frame */}
                  <div
                    className={`w-full h-40 sm:h-44 rounded-2xl flex items-center justify-center mb-4 overflow-hidden relative ${
                      isComingSoon ? 'bg-slate-100/70' : 'bg-[#F8FAFC]'
                    }`}
                  >
                    <TrackIllustration />

                    {/* Track Badge */}
                    <span
                      className={`absolute top-2.5 right-2.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border flex items-center gap-1 ${badge.color}`}
                    >
                      {isComingSoon && <Lock className="w-2.5 h-2.5 stroke-[2.5]" />}
                      {badge.text}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5">
                    {path.label}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                    {path.description || 'Pilihan kurikulum spesialisasi berstandar global.'}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── SUB-STEP 2C: SINGLE STACK SELECTION (BACKEND / FRONTEND / DEVOPS) ── */}
      {trackSubStep === 'stack' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 max-w-5xl w-full justify-items-center">
          {selectedCareerPath?.stacks?.map((stack) => {
            const isSelected = selectedStackSlug === stack.slug
            const isActive = stack.is_active

            return (
              <div
                key={stack.slug}
                role="button"
                tabIndex={isActive ? 0 : -1}
                aria-disabled={!isActive}
                aria-pressed={isSelected}
                onClick={() => {
                  if (isActive) {
                    onSelectStackSlug(stack.slug)
                  }
                }}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && isActive) {
                    e.preventDefault()
                    onSelectStackSlug(stack.slug)
                  }
                }}
                className={`rounded-3xl p-6 sm:p-7 flex flex-col items-center text-center transition-all duration-200 max-w-[310px] sm:max-w-[330px] w-full relative focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20 ${
                  isActive
                    ? isSelected
                      ? 'bg-indigo-50/60 border-2 border-[#4F46E5] shadow-md shadow-indigo-500/10 ring-4 ring-indigo-500/10 cursor-pointer'
                      : 'bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-sm cursor-pointer'
                    : 'bg-slate-50/70 border border-dashed border-slate-300/80 opacity-60 cursor-not-allowed select-none'
                }`}
              >
                {/* Top Tech Logo Frame */}
                <div
                  className={`w-full h-40 sm:h-44 rounded-2xl flex items-center justify-center mb-4 overflow-hidden relative ${
                    isActive ? 'bg-[#F8FAFC]' : 'bg-slate-100/70'
                  }`}
                >
                  <TechIcon slug={stack.slug} className="w-20 h-20" />

                  {/* Stack Badge */}
                  <span
                    className={`absolute top-2.5 right-2.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                      isActive
                        ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                        : 'bg-slate-200/80 text-slate-600 border-slate-300'
                    }`}
                  >
                    {!isActive && <Lock className="w-2.5 h-2.5 stroke-[2.5]" />}
                    {formatStackBadge(stack.badge, isActive)}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className={`text-lg sm:text-xl font-bold mb-1.5 ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>
                  {stack.label}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                  {STACK_DESCRIPTIONS[stack.slug] || 'Standar rekayasa teknologi berstandar industri global.'}
                </p>
              </div>
            )
          })}
        </div>
      )}

      {/* ── SUB-STEP 2D: FULLSTACK FRONTEND SELECTION (STEP 1/2) ── */}
      {trackSubStep === 'stack_fe' && (
        <div className="flex flex-col items-center w-full">
          {/* Stepper Progress Pill */}
          <div className="mb-5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/90 text-xs font-semibold text-[#4F46E5] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#4F46E5] animate-pulse"></span>
            <span>Langkah 1 dari 2: Rekayasa Frontend</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 max-w-5xl w-full justify-items-center">
            {feOptions.map((stack) => {
              const isSelected = selectedFullstackFe === stack.slug
              const isActive = stack.is_active

              return (
                <div
                  key={stack.slug}
                  role="button"
                  tabIndex={isActive ? 0 : -1}
                  aria-disabled={!isActive}
                  aria-pressed={isSelected}
                  onClick={() => {
                    if (isActive) {
                      onSelectFullstackFe(stack.slug)
                      onSelectStackSlug(`${stack.slug}_${selectedFullstackBe}`)
                    }
                  }}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && isActive) {
                      e.preventDefault()
                      onSelectFullstackFe(stack.slug)
                      onSelectStackSlug(`${stack.slug}_${selectedFullstackBe}`)
                    }
                  }}
                  className={`rounded-3xl p-6 sm:p-7 flex flex-col items-center text-center transition-all duration-200 max-w-[310px] sm:max-w-[330px] w-full relative focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20 ${
                    isActive
                      ? isSelected
                        ? 'bg-indigo-50/60 border-2 border-[#4F46E5] shadow-md shadow-indigo-500/10 ring-4 ring-indigo-500/10 cursor-pointer'
                        : 'bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-sm cursor-pointer'
                      : 'bg-slate-50/70 border border-dashed border-slate-300/80 opacity-60 cursor-not-allowed select-none'
                  }`}
                >
                  {/* Top Tech Logo Frame */}
                  <div
                    className={`w-full h-40 sm:h-44 rounded-2xl flex items-center justify-center mb-4 overflow-hidden relative ${
                      isActive ? 'bg-[#F8FAFC]' : 'bg-slate-100/70'
                    }`}
                  >
                    <TechIcon slug={stack.slug} className="w-20 h-20" />

                    {/* Stack Badge */}
                    <span
                      className={`absolute top-2.5 right-2.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                        isActive
                          ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                          : 'bg-slate-200/80 text-slate-600 border-slate-300'
                      }`}
                    >
                      {!isActive && <Lock className="w-2.5 h-2.5 stroke-[2.5]" />}
                      {formatStackBadge(stack.badge, isActive)}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className={`text-lg sm:text-xl font-bold mb-1.5 ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>
                    {stack.label}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                    {STACK_DESCRIPTIONS[stack.slug] || 'Standar rekayasa teknologi berstandar industri global.'}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── SUB-STEP 2E: FULLSTACK BACKEND SELECTION (STEP 2/2) ── */}
      {trackSubStep === 'stack_be' && (
        <div className="flex flex-col items-center w-full">
          {/* Stepper Progress Pill with Selected FE */}
          <div className="mb-5 inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/90 text-xs font-semibold text-[#4F46E5] shadow-2xs">
            <span>
              Frontend: <strong className="text-indigo-900">{selectedFullstackFe === 'react' ? 'React + TypeScript' : selectedFullstackFe}</strong>
            </span>
            <span className="text-indigo-300">➔</span>
            <span className="flex items-center gap-1.5 text-indigo-700">
              <span className="w-2 h-2 rounded-full bg-[#4F46E5] animate-pulse"></span>
              Langkah 2 dari 2: Pilih Backend Pendamping
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 max-w-5xl w-full justify-items-center">
            {beOptions.map((stack) => {
              const isSelected = selectedFullstackBe === stack.slug
              const isActive = stack.is_active

              return (
                <div
                  key={stack.slug}
                  role="button"
                  tabIndex={isActive ? 0 : -1}
                  aria-disabled={!isActive}
                  aria-pressed={isSelected}
                  onClick={() => {
                    if (isActive) {
                      onSelectFullstackBe(stack.slug)
                      onSelectStackSlug(`${selectedFullstackFe}_${stack.slug}`)
                    }
                  }}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && isActive) {
                      e.preventDefault()
                      onSelectFullstackBe(stack.slug)
                      onSelectStackSlug(`${selectedFullstackFe}_${stack.slug}`)
                    }
                  }}
                  className={`rounded-3xl p-6 sm:p-7 flex flex-col items-center text-center transition-all duration-200 max-w-[310px] sm:max-w-[330px] w-full relative focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20 ${
                    isActive
                      ? isSelected
                        ? 'bg-indigo-50/60 border-2 border-[#4F46E5] shadow-md shadow-indigo-500/10 ring-4 ring-indigo-500/10 cursor-pointer'
                        : 'bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 hover:shadow-sm cursor-pointer'
                      : 'bg-slate-50/70 border border-dashed border-slate-300/80 opacity-60 cursor-not-allowed select-none'
                  }`}
                >
                  {/* Top Tech Logo Frame */}
                  <div
                    className={`w-full h-40 sm:h-44 rounded-2xl flex items-center justify-center mb-4 overflow-hidden relative ${
                      isActive ? 'bg-[#F8FAFC]' : 'bg-slate-100/70'
                    }`}
                  >
                    <TechIcon slug={stack.slug} className="w-20 h-20" />

                    {/* Stack Badge */}
                    <span
                      className={`absolute top-2.5 right-2.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                        isActive
                          ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                          : 'bg-slate-200/80 text-slate-600 border-slate-300'
                      }`}
                    >
                      {!isActive && <Lock className="w-2.5 h-2.5 stroke-[2.5]" />}
                      {formatStackBadge(stack.badge, isActive)}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className={`text-lg sm:text-xl font-bold mb-1.5 ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>
                    {stack.label}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                    {STACK_DESCRIPTIONS[stack.slug] || 'Standar rekayasa teknologi berstandar industri global.'}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
