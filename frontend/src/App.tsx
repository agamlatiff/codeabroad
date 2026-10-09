import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { RoadmapPage } from './pages/RoadmapPage'
import { QuestLogPage } from './pages/QuestLogPage'
import { LearnWorkspacePage } from './pages/LearnWorkspacePage'
import { QuestCompletePage } from './pages/QuestCompletePage'
import { ProtectedRoute, OnboardingRoute, GuestRoute } from './components/guards'

function App() {
  return (
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
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/courses" element={<RoadmapPage />} />
          <Route path="/roadmap/:track" element={<RoadmapPage />} />
          <Route path="/quests" element={<QuestLogPage />} />
          <Route path="/learn/:id" element={<LearnWorkspacePage />} />
          <Route path="/learn/:id/complete" element={<QuestCompletePage />} />
        </Route>

        {/* Default Fallback */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
