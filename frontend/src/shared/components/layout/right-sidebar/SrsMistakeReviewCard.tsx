import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, ArrowsClockwise, CheckCircle } from '@phosphor-icons/react'
import { Skeleton } from '@/shared/components/ui/Skeleton'
import { useAuthStore } from '@/features/auth/store/authStore'
import {
  SRS_DUE_QUERY_KEY,
  exerciseService,
} from '@/features/exercise/services/exerciseService'

/**
 * Compact sidebar CTA linking users directly to /review to practice previously missed exercises.
 */
export const SrsMistakeReviewCard = () => {
  const user = useAuthStore((s) => s.user)
  const { data, isLoading } = useQuery({
    queryKey: [...SRS_DUE_QUERY_KEY, user?.id ?? 'anonymous', 'sidebar'],
    queryFn: ({ signal }) => exerciseService.getDueReviews(20, { signal }),
    enabled: Boolean(user),
    staleTime: 30_000,
    retry: false,
  })

  if (user && isLoading) {
    return <Skeleton className="h-[42px] w-full rounded-2xl" />
  }

  const totalDue = data?.total_due ?? 0

  if (totalDue > 0) {
    return (
      <Link
        to="/review"
        className="block rounded-2xl border-2 border-rose-200/90 bg-gradient-to-br from-rose-50 via-white to-amber-50/70 p-3.5 shadow-[0_3px_0_0_#FECDD3] hover:-translate-y-0.5 transition-all group"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-8 h-8 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
              <ArrowsClockwise weight="bold" className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <p className="font-brand font-black text-xs text-rose-950 truncate">
                Latih Ulang Kesalahan
              </p>
              <p className="text-[11px] font-bold text-rose-700">
                {totalDue} soal siap diulas
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-brand font-black text-rose-700 group-hover:translate-x-0.5 transition-transform shrink-0">
            Ulas
            <ArrowRight weight="bold" className="w-3.5 h-3.5" />
          </span>
        </div>
      </Link>
    )
  }

  return (
    <Link
      to="/review"
      className="flex items-center justify-between gap-2 rounded-2xl border border-slate-200/90 bg-slate-50/80 hover:bg-slate-100/80 px-3 py-2.5 transition-colors group"
    >
      <div className="flex items-center gap-2 min-w-0">
        <CheckCircle weight="fill" className="w-4 h-4 text-emerald-500 shrink-0" />
        <span className="text-[11px] font-brand font-bold text-slate-600 truncate">
          Ulasan Soal Salah • 0 perlu diulas
        </span>
      </div>
      <ArrowRight
        weight="bold"
        className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 shrink-0"
      />
    </Link>
  )
}
