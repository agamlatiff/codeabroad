import { useState } from 'react'
import { FileText, GithubLogo, LinkedinLogo, CheckCircle, PaperPlaneTilt } from '@phosphor-icons/react'
import { Modal3D } from '../ui/Modal3D'
import { Button3D } from '../ui/Button3D'
import { triggerHaptic } from '../../utils/haptics'
import { audioEngine } from '../../utils/audio'

export interface CVReviewSubmissionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmitted: (data: { githubUrl: string; resumeUrl: string; targetRole: string; notes: string }) => void
}

export const CVReviewSubmissionModal = ({
  isOpen,
  onClose,
  onSubmitted,
}: CVReviewSubmissionModalProps) => {
  const [githubUrl, setGithubUrl] = useState('')
  const [resumeUrl, setResumeUrl] = useState('')
  const [targetRole, setTargetRole] = useState('Golang Backend Engineer')
  const [notes, setNotes] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!githubUrl.trim() || !resumeUrl.trim()) {
      triggerHaptic('error')
      return
    }

    triggerHaptic('success')
    audioEngine.playSuccess()
    setIsSuccess(true)

    setTimeout(() => {
      onSubmitted({ githubUrl, resumeUrl, targetRole, notes })
      setIsSuccess(false)
      onClose()
    }, 1800)
  }

  return (
    <Modal3D
      isOpen={isOpen}
      onClose={onClose}
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
                Klaim Kupon Review CV &amp; Portofolio Tokyo
              </h3>
              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200 uppercase">
                1 KUPON
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Audit resume teknis dan GitHub repository oleh diaspora software engineer di Tokyo.
            </p>
          </div>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto text-3xl shadow-sm animate-bounce">
              <CheckCircle weight="fill" className="w-9 h-9" />
            </div>
            <h4 className="font-brand font-black text-lg text-slate-900">
              Berkas Berhasil Dikirim! 🇯🇵
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Mentor diaspora Tokyo akan mengulas GitHub dan resume Anda dalam 1-2 hari kerja. Notifikasi hasil audit akan dikirim ke akun Anda.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Target Role Field */}
            <div className="space-y-1">
              <label className="text-xs font-brand font-black text-slate-700 block">
                Target Posisi Pekerjaan di Tokyo
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:border-blue-500 focus:outline-none transition-all"
              >
                <option value="Golang Backend Engineer">Golang Backend Engineer (Tokyo Spec)</option>
                <option value="Fullstack React & Node.js">Fullstack React &amp; Node.js Engineer</option>
                <option value="DevOps & Cloud Engineer">DevOps &amp; Cloud Platform Engineer</option>
                <option value="Bilingual Junior SWE">Bilingual Junior SWE (English/Nihongo)</option>
              </select>
            </div>

            {/* GitHub URL */}
            <div className="space-y-1">
              <label className="text-xs font-brand font-black text-slate-700 flex items-center gap-1.5">
                <GithubLogo weight="bold" className="w-4 h-4 text-slate-800" />
                <span>Link Profil / Repository GitHub *</span>
              </label>
              <input
                type="url"
                required
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username/project"
                className="w-full bg-white border-2 border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none transition-all shadow-2xs"
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
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username atau link Google Drive"
                className="w-full bg-white border-2 border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none transition-all shadow-2xs"
              />
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <label className="text-xs font-brand font-black text-slate-700 block">
                Catatan Tambahan untuk Mentor (Opsional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Tolong fokus audit concurrency pattern dan formatting CV standar Tokyo Tech Guild..."
                className="w-full bg-white border-2 border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none transition-all shadow-2xs resize-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button3D
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-xs px-4 py-2"
              >
                Batal
              </Button3D>
              <Button3D
                type="submit"
                variant="blue"
                size="sm"
                className="text-xs px-5 py-2 shadow-sm flex items-center gap-1.5"
              >
                <PaperPlaneTilt weight="fill" className="w-3.5 h-3.5" />
                <span>Kirim untuk Direview</span>
              </Button3D>
            </div>
          </form>
        )}
      </div>
    </Modal3D>
  )
}
