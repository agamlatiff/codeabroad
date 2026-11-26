import { useEffect } from 'react'
import { useIsMutating } from '@tanstack/react-query'
import { CircleNotch } from '@phosphor-icons/react'
import {
  LOGOUT_MUTATION_KEY,
  SWITCH_LANGUAGE_MUTATION_KEY,
} from '@/shared/constants/queryKeys'

/**
 * Full-viewport interaction lock for session-wide transitions (logout & track switch)
 * so learners cannot trigger conflicting clicks while caches & sessions reset.
 */
export const GlobalActionBlocker = () => {
  const isLoggingOut = useIsMutating({ mutationKey: LOGOUT_MUTATION_KEY }) > 0
  const isSwitchingLanguage =
    useIsMutating({ mutationKey: SWITCH_LANGUAGE_MUTATION_KEY }) > 0

  const isActive = isLoggingOut || isSwitchingLanguage

  useEffect(() => {
    if (!isActive) return
    const blockEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
      }
    }
    window.addEventListener('keydown', blockEscape, true)
    return () => window.removeEventListener('keydown', blockEscape, true)
  }, [isActive])

  if (!isActive) return null

  const label = isLoggingOut
    ? 'Mengeluarkan sesi akun...'
    : 'Mengaktifkan kurikulum bahasa...'

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-busy="true"
      aria-label={label}
      className="fixed inset-0 z-[190] flex items-center justify-center bg-slate-900/25 backdrop-blur-[2px] p-4 select-none"
    >
      <div className="inline-flex items-center gap-3 rounded-2xl border-2 border-blue-200 bg-white px-5 py-3.5 shadow-[0_6px_0_0_rgba(37,99,235,0.16)]">
        <CircleNotch
          weight="bold"
          className="w-5 h-5 text-[#2563EB] animate-spin shrink-0"
          aria-hidden="true"
        />
        <span className="text-xs sm:text-sm font-brand font-extrabold text-slate-800">
          {label}
        </span>
      </div>
    </div>
  )
}
