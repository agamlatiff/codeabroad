import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { ProtectedRoute, OnboardingRoute, GuestRoute } from '@/features/auth/components/ProtectedRoute'
import { OnboardingPage } from '@/features/onboarding/pages/OnboardingPage'
import { RoadmapPage } from '@/features/curriculum/pages/RoadmapPage'
import { QuestLogPage } from '@/features/gamification/pages/QuestLogPage'
import { LearnWorkspacePage } from '@/features/exercise/pages/LearnWorkspacePage'
import { QuestCompletePage } from '@/features/exercise/pages/QuestCompletePage'
import { LeaderboardPage } from '@/features/leaderboard/pages/LeaderboardPage'
import { NotFoundPage } from '@/shared/pages/NotFoundPage'
import { ErrorBoundary } from '@/shared/components/ui/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
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

          {/* Protected App Routes (Requires completed onboarding) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/roadmap/:track" element={<RoadmapPage />} />
            <Route path="/courses" element={<Navigate to="/roadmap" replace />} />
            <Route path="/quests" element={<QuestLogPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/learn/:id" element={<LearnWorkspacePage />} />
            <Route path="/learn/:id/complete" element={<QuestCompletePage />} />
            <Route path="/career" element={<Navigate to="/roadmap" replace />} />
          </Route>

          {/* Default Fallback */}
          <Route path="/" element={<Navigate to="/roadmap" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
