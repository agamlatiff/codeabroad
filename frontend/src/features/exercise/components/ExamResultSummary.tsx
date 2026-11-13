import type { ReadinessExamResponse } from '@/features/exercise/types/exercise'
import { Button3D } from '@/shared/components/ui/Button3D'
import { KodiCharacter } from '@/shared/components/ui/KodiCharacter'
import {
  ArrowCounterClockwise,
  Certificate,
  CheckCircle,
  Medal,
  XCircle,
} from '@phosphor-icons/react'

interface ExamResultSummaryProps {
  result: ReadinessExamResponse
  onRetryExam: () => void
  onBackToCurriculum: () => void
}

/**
 * 4-pillar readiness exam result breakdown & official certificate display.
 */
export const ExamResultSummary = ({
  result,
  onRetryExam,
  onBackToCurriculum,
}: ExamResultSummaryProps) => {
  const { attempt, certificate, awarded_badges } = result
  const isPassed = attempt.is_passed

  const pillars = [
    { label: 'Reading', score: attempt.reading_score, tone: 'bg-sky-50 border-sky-200 text-sky-900' },
    { label: 'Listening', score: attempt.listening_score, tone: 'bg-amber-50 border-amber-200 text-amber-900' },
    { label: 'Writing', score: attempt.writing_score, tone: 'bg-indigo-50 border-indigo-200 text-indigo-900' },
    { label: 'Speaking', score: attempt.speaking_score, tone: 'bg-emerald-50 border-emerald-200 text-emerald-900' },
  ]

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-slate-900 font-sans flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-xl rounded-3xl bg-white border-2 border-slate-200 shadow-lg p-6 sm:p-8 space-y-6">
        {/* Status Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <KodiCharacter
              emotion={isPassed ? 'celebrate' : 'worried'}
              size="lg"
              interactive={false}
            />
          </div>
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
              isPassed
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-rose-100 text-rose-800'
            }`}
          >
            {isPassed ? (
              <CheckCircle weight="fill" className="w-4 h-4" />
            ) : (
              <XCircle weight="fill" className="w-4 h-4" />
            )}
            {isPassed ? 'Lulus Ujian Kesiapan!' : 'Belum Mencapai Nilai Lulus'}
          </div>
          <h1 className="text-3xl font-brand font-black text-slate-900">
            Skor Total: {attempt.score_percent}%
          </h1>
          <p className="text-sm text-slate-600">
            {isPassed
              ? 'Selamat! Kamu berhak melanjutkan ke level kemahiran berikutnya.'
              : 'Pelajari kembali bagian yang lemah dan coba ulang ujian kapan pun siap.'}
          </p>
        </div>

        {/* 4-Pillar Score Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {pillars.map((pillar) => (
            <div
              key={pillar.label}
              className={`p-3.5 rounded-2xl border-2 text-center space-y-1 ${pillar.tone}`}
            >
              <p className="text-[11px] font-extrabold uppercase tracking-wider opacity-80">
                {pillar.label}
              </p>
              <p className="text-xl font-brand font-black">{pillar.score}%</p>
            </div>
          ))}
        </div>

        {/* Official Exam Certificate */}
        {certificate && (
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 via-white to-sky-50 border-2 border-blue-200 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-blue-700">
                <Certificate weight="fill" className="w-6 h-6" />
                <span className="text-xs font-black uppercase tracking-wider">
                  Sertifikat Kesiapan Resmi
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-lg bg-blue-100 text-blue-800 text-xs font-mono font-bold">
                {certificate.level_code}
              </span>
            </div>
            <p className="text-base font-brand font-extrabold text-slate-900">
              {certificate.exam_name || `Sertifikasi Level ${certificate.level_code}`}
            </p>
            <p className="text-xs font-semibold text-slate-600">
              Diberikan kepada <span className="text-slate-900 font-bold">{certificate.candidate_name}</span> • Skor {certificate.score}/{certificate.max_score} ({certificate.percentage}%)
            </p>
            <p className="text-[11px] font-mono text-slate-400">
              ID: {certificate.certificate_id}
            </p>
          </div>
        )}

        {/* Awarded Badges */}
        {awarded_badges && awarded_badges.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Lencana Terbuka
            </p>
            <div className="space-y-2">
              {awarded_badges.map((badge) => (
                <div
                  key={badge.id}
                  className="p-3 rounded-2xl bg-blue-50 border border-blue-200 flex items-center gap-3"
                >
                  <Medal weight="fill" className="w-6 h-6 text-blue-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold text-slate-900 truncate">
                      {badge.title}
                    </p>
                    <p className="text-xs text-slate-600">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <Button3D
            type="button"
            variant={isPassed ? 'emerald' : 'blue'}
            size="lg"
            fullWidth
            onClick={onBackToCurriculum}
          >
            Kembali ke Kurikulum
          </Button3D>
          {!isPassed && (
            <Button3D
              type="button"
              variant="white"
              size="lg"
              fullWidth
              onClick={onRetryExam}
              icon={<ArrowCounterClockwise weight="bold" className="w-5 h-5" />}
            >
              Ulangi Ujian
            </Button3D>
          )}
        </div>
      </div>
    </div>
  )
}

