import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import axios from 'axios'
import './index.css'
import App from './App.tsx'
import '@/features/auth/store/authStore'
import '@/features/onboarding/store/onboardingStore'

const NON_RETRYABLE_STATUS = new Set([400, 401, 403, 404, 409, 413, 422, 429])

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes cache
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (failureCount >= 1) return false
        if (axios.isAxiosError(error) && error.response) {
          return !NON_RETRYABLE_STATUS.has(error.response.status)
        }
        return true
      },
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
