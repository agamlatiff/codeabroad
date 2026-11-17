import { useState, useRef, useEffect } from 'react'
import { FileText, Link as LinkIcon, LinkedinLogo, CheckCircle, PaperPlaneTilt } from '@phosphor-icons/react'
import { z } from 'zod'
import { Modal3D } from './Modal3D'
import { Button3D } from "@/shared/components/ui/Button3D"
import { extractApiErrorMessage } from "@/shared/services/api"
import { triggerHaptic } from "@/shared/utils/haptics"
import { audioEngine } from "@/shared/utils/audio"

export interface CVReviewSubmissionPayload {
  githubUrl: string
  resumeUrl: string
  targetRole: string
  notes: string
}

export interface CVReviewSubmissionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmitted: (data: CVReviewSubmissionPayload) => Promise<void>
}

const isValidHttpUrl = (val: string) => {
  try {
    const u = new URL(val)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

const cvSubmissionSchema = z.object({
  targetRole: z.string().trim().min(2, 'Pilih tujuan sertifikasi atau target bahasa.').max(120),
  githubUrl: z
    .string()
    .trim()
    .max(300)
    .refine((v) => v === '' || isValidHttpUrl(v), 'URL portofolio harus diawali http:// atau https://'),
  resumeUrl: z
    .string()
    .trim()
    .min(1, 'Link Resume / CV wajib diisi.')
    .max(300)
    .refine(isValidHttpUrl, 'Link Resume harus berupa URL valid (http:// atau https://).'),
  notes: z.string().trim().max(600, 'Catatan maksimal 600 karakter.'),
})

export const CVReviewSubmissionModal = ({
  isOpen,
  onClose,
  onSubmitted,
}: CVReviewSubmissionModalProps) => {
  const [githubUrl, setGithubUrl] = useState('')
  const [resumeUrl, setResumeUrl] = useState('')
  const [targetRole, setTargetRole] = useState('Persiapan Kerja Jepang (JLPT N4–N2)')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen)
    if (!isOpen) {
      setIsSuccess(false)
      setErrorMessage(null)
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (!isOpen && closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current)
        closeTimerRef.current = null
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    const validated = cvSubmissionSchema.safeParse({
      targetRole,
      githubUrl,
      resumeUrl,
      notes,
    })
    if (!validated.success) {
      triggerHaptic('error')
      setErrorMessage(validated.error.issues[0]?.message ?? 'Periksa kembali isian formulir Anda.')
      return
    }

    setErrorMessage(null)
    setIsSubmitting(true)
    try {
      await onSubmitted(validated.data)
      triggerHaptic('success')
      audioEngine.playSuccess()
      setIsSuccess(true)

      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
      closeTimerRef.current = setTimeout(() => {
        setGithubUrl('')
        setResumeUrl('')
        setNotes('')
        setIsSuccess(false)
        onClose()
      }, 1500)
    } catch (err: unknown) {
      triggerHaptic('error')
      audioEngine.playError()
      setErrorMessage(
        extractApiErrorMessage(
          err,
          'Gagal mengirim pengajuan Review CV. Pastikan kupon Anda mencukupi.'
        )
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal3D
      isOpen={isOpen}
      onClose={isSubmitting ? () => undefined : onClose}
      maxWidth="md"
      className="text-left"
    >
      <div className="space-y-4 py-1">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
            <FileText weight="bold" className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-brand font-black text-base text-slate-900">
                Klaim Kupon Review CV &amp; Portofolio Global
              </h3>
              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200 uppercase">
                1 KUPON
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Audit CV (Rirekisho/Lebenslauf/Resume Internasional) &amp; kesiapan bahasa karier oleh mentor berpengalaman.
            </p>
          </div>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto text-3xl shadow-sm animate-bounce">
              <CheckCircle weight="fill" className="w-9 h-9" />
            </div>
            <h4 className="font-brand font-black text-lg text-slate-900">
              Berkas Berhasil Dikirim!
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Mentor akan mengulas CV dan berkas lamaran Anda dalam 1-2 hari kerja. Notifikasi hasil audit akan dikirim ke akun Anda.
            </p>
          </div>
        ) : (
          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-3.5">
            {errorMessage && (
              <div
                role="alert"
                className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700"
              >
                {errorMessage}
              </div>
            )}

            {/* Target Role Field */}
            <div className="space-y-1">
              <label className="text-xs font-brand font-black text-slate-700 block">
                Target Sertifikasi / Tujuan Bahasa
              </label>
              <select
                value={targetRole}
                disabled={isSubmitting}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none transition-all disabled:opacity-60"
              >
                <option value="Persiapan Kerja Jepang (JLPT N4–N2)">Persiapan Kerja Jepang (JLPT N4–N2)</option>
                <option value="Business Japanese & Keigo">Business Japanese &amp; Keigo Profesional</option>
                <option value="Goethe-Zertifikat Jerman (A2–B2)">Goethe-Zertifikat Jerman (A2–B2)</option>
                <option value="Global English / IELTS">Global English / IELTS Profesional</option>
                <option value="Mandarin Bisnis (HSK 3–5)">Mandarin Bisnis (HSK 3–5)</option>
                <option value="Prancis Profesional (DELF B1–B2)">Prancis Profesional (DELF B1–B2)</option>
              </select>
            </div>

            {/* Portfolio URL (Optional) */}
            <div className="space-y-1">
              <label className="text-xs font-brand font-black text-slate-700 flex items-center gap-1.5">
                <LinkIcon weight="bold" className="w-4 h-4 text-slate-700" />
                <span>Link Portofolio / Karya Tambahan (Opsional)</span>
              </label>
              <input
                type="url"
                disabled={isSubmitting}
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://portofolio-anda.com atau Google Drive karya"
                className="w-full bg-white border-2 border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none transition-all shadow-2xs disabled:opacity-60"
              />
            </div>

            {/* Resume URL */}
            <div className="space-y-1">
              <label className="text-xs font-brand font-black text-slate-700 flex items-center gap-1.5">
                <LinkedinLogo weight="bold" className="w-4 h-4 text-blue-600" />
                <span>Link Resume / LinkedIn / Google Drive PDF *</span>
              </label>
              <input
                type="url"
                required
                disabled={isSubmitting}
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username atau link Google Drive"
                className="w-full bg-white border-2 border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none transition-all shadow-2xs disabled:opacity-60"
              />
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <label className="text-xs font-brand font-black text-slate-700 block">
                Catatan Tambahan untuk Mentor (Opsional)
              </label>
              <textarea
                rows={2}
                disabled={isSubmitting}
                maxLength={600}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Tolong fokus audit tata bahasa dan kejelasan deskripsi pengalaman kerja internasional..."
                className="w-full bg-white border-2 border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none transition-all shadow-2xs resize-none disabled:opacity-60"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button3D
                type="button"
                variant="ghost"
                size="sm"
                disabled={isSubmitting}
                onClick={onClose}
                className="text-xs px-4 py-2"
              >
                Batal
              </Button3D>
              <Button3D
                type="submit"
                variant="blue"
                size="sm"
                loading={isSubmitting}
                disableSound
                className="text-xs px-5 py-2 shadow-sm flex items-center gap-1.5"
              >
                <PaperPlaneTilt weight="fill" className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Mengirim...' : 'Kirim untuk Direview'}</span>
              </Button3D>
            </div>
          </form>
        )}
      </div>
    </Modal3D>
  )
}
