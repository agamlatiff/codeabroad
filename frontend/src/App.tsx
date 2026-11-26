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
  <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center p-6">
    <div className="flex flex-col items-center gap-3 text-slate-500">
      <div className="w-10 h-10 rounded-2xl border-4 border-blue-200 border-t-blue-600 animate-spin" />
      <span className="text-xs font-brand font-bold tracking-wide text-slate-500">
        Memuat halaman...
      </span>
    </div>
  </div>
)

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
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
