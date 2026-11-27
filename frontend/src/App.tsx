import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import {
  ProtectedRoute,
  OnboardingRoute,
  GuestRoute,
  HomeRoute,
  PreviewableRoute,
} from '@/features/auth/components/ProtectedRoute'
import { ErrorBoundary } from '@/shared/components/ui/ErrorBoundary'
import { GlobalTopProgressBar } from '@/shared/components/ui/GlobalTopProgressBar'
import { GlobalActionBlocker } from '@/shared/components/ui/GlobalActionBlocker'
import { Skeleton } from '@/shared/components/ui/Skeleton'
import { ScrollToTop } from '@/shared/components/routing/ScrollToTop'

const LandingPage = lazy(() =>
  import('@/features/landing/pages/LandingPage').then((m) => ({ default: m.LandingPage }))
)

const LoginPage = lazy(() =>
  import('@/features/auth/pages/LoginPage').then((m) => ({ default: m.LoginPage }))
)
const RegisterPage = lazy(() =>
  import('@/features/auth/pages/RegisterPage').then((m) => ({ default: m.RegisterPage }))
)
const OnboardingPage = lazy(() =>
  import('@/features/onboarding/pages/OnboardingPage').then((m) => ({
    default: m.OnboardingPage,
  }))
)
const CurriculumPage = lazy(() =>
  import('@/features/curriculum/pages/CurriculumPage').then((m) => ({
    default: m.CurriculumPage,
  }))
)
const QuestLogPage = lazy(() =>
  import('@/features/gamification/pages/QuestLogPage').then((m) => ({ default: m.QuestLogPage }))
)
const LearnWorkspacePage = lazy(() =>
  import('@/features/exercise/pages/LearnWorkspacePage').then((m) => ({
    default: m.LearnWorkspacePage,
  }))
)
const QuestCompletePage = lazy(() =>
  import('@/features/exercise/pages/QuestCompletePage').then((m) => ({
    default: m.QuestCompletePage,
  }))
)
const ReadinessExamPage = lazy(() =>
  import('@/features/exercise/pages/ReadinessExamPage').then((m) => ({
    default: m.ReadinessExamPage,
  }))
)
const FlashcardPage = lazy(() =>
  import('@/features/flashcard/pages/FlashcardPage').then((m) => ({ default: m.FlashcardPage }))
)
const LeaderboardPage = lazy(() =>
  import('@/features/leaderboard/pages/LeaderboardPage').then((m) => ({
    default: m.LeaderboardPage,
  }))
)
const GrammarPage = lazy(() =>
  import('@/features/curriculum/pages/GrammarPage').then((m) => ({ default: m.GrammarPage }))
)
const GrammarDetailPage = lazy(() =>
  import('@/features/curriculum/pages/GrammarDetailPage').then((m) => ({
    default: m.GrammarDetailPage,
  }))
)
const KanaPage = lazy(() =>
  import('@/features/curriculum/pages/KanaPage').then((m) => ({ default: m.KanaPage }))
)
const SrsReviewPage = lazy(() =>
  import('@/features/exercise/pages/SrsReviewPage').then((m) => ({ default: m.SrsReviewPage }))
)
const PricingPage = lazy(() =>
  import('@/features/pricing/pages/PricingPage').then((m) => ({ default: m.PricingPage }))
)
const NotFoundPage = lazy(() =>
  import('@/shared/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
)

const RouteLoadingFallback = () => (
  <div
    role="status"
    aria-live="polite"
    className="min-h-screen bg-[#FAFAF9] flex flex-col"
  >
    <div className="h-16 border-b-2 border-slate-200/80 bg-white px-4 sm:px-8 flex items-center justify-between">
      <Skeleton className="h-9 w-36" />
      <div className="flex items-center gap-2.5">
        <Skeleton variant="pill" className="h-8 w-20" />
        <Skeleton variant="pill" className="h-8 w-20 hidden sm:block" />
      </div>
    </div>
    <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 space-y-5">
      <div className="inline-flex items-center gap-2.5 rounded-2xl border-2 border-blue-200 bg-[#EFF6FF] px-4 py-2 shadow-[0_3px_0_0_#DBEAFE]">
        <div className="w-4 h-4 rounded-full border-2 border-blue-300 border-t-[#2563EB] animate-spin shrink-0" />
        <span className="text-xs font-brand font-extrabold text-[#2563EB]">
          Memuat halaman...
        </span>
      </div>
      <div className="rounded-3xl border-2 border-slate-200/80 bg-white p-6 shadow-[0_4px_0_0_#E2E8F0] space-y-4">
        <Skeleton className="h-7 w-2/5" />
        <Skeleton className="h-4 w-3/4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      </div>
    </div>
  </div>
)

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <GlobalTopProgressBar />
        <GlobalActionBlocker />
        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            {/* Guest Routes (Only accessible when NOT logged in) */}
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Onboarding Wizard (Accessible to authenticated users who need setup) */}
            <Route element={<OnboardingRoute />}>
              <Route path="/onboarding" element={<OnboardingPage />} />
            </Route>

            {/* Public Landing Page (Accessible to both guests and authenticated learners) */}
            <Route element={<HomeRoute />}>
              <Route path="/" element={<LandingPage />} />
            </Route>
            <Route path="/welcome" element={<LandingPage />} />

            {/* Previewable App Routes (Accessible to Guests in Trial Mode & Onboarded Users) */}
            <Route element={<PreviewableRoute />}>
              <Route path="/curriculum" element={<CurriculumPage />} />
              <Route path="/curriculum/:languageId" element={<CurriculumPage />} />
              <Route path="/grammar" element={<GrammarPage />} />
              <Route path="/grammar/:id" element={<GrammarDetailPage />} />
              <Route path="/kana" element={<KanaPage />} />
              <Route path="/kana/:script" element={<KanaPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/roadmap" element={<Navigate to="/curriculum" replace />} />
              <Route path="/roadmap/:track" element={<Navigate to="/curriculum" replace />} />
              <Route path="/courses" element={<Navigate to="/curriculum" replace />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/learn/:id" element={<LearnWorkspacePage />} />
              <Route path="/learn/:id/complete" element={<QuestCompletePage />} />
              <Route path="/flashcards" element={<FlashcardPage />} />
              <Route path="/flashcard" element={<Navigate to="/flashcards" replace />} />
              <Route path="/career" element={<Navigate to="/curriculum" replace />} />
            </Route>

            {/* Account-Only Protected Routes (Requires Auth + Onboarding) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/quests" element={<QuestLogPage />} />
              <Route path="/review" element={<SrsReviewPage />} />
              <Route path="/exam/:langCode/:levelCode" element={<ReadinessExamPage />} />
              <Route path="/exam/:levelId" element={<ReadinessExamPage />} />
            </Route>

            {/* Default Fallback */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
