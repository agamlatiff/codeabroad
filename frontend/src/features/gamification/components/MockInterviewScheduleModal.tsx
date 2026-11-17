import { useState, useRef, useEffect } from 'react'
import { Microphone, CheckCircle, CalendarBlank, DiscordLogo, Translate } from '@phosphor-icons/react'
import { z } from 'zod'
import { Modal3D } from './Modal3D'
import { Button3D } from "@/shared/components/ui/Button3D"
import { extractApiErrorMessage } from "@/shared/services/api"
import { triggerHaptic } from "@/shared/utils/haptics"
import { audioEngine } from "@/shared/utils/audio"

export interface MockInterviewSchedulePayload {
  language: string
  discordHandle: string
  focusTopic: string
  preferredTime: string
}

export interface MockInterviewScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  onScheduled: (data: MockInterviewSchedulePayload) => Promise<void>
}

const mockInterviewSchema = z.object({
  language: z.enum(['english', 'nihongo', 'german', 'mandarin', 'french', 'bilingual']),
  discordHandle: z
    .string()
    .trim()
    .min(2, 'Masukkan username Discord minimal 2 karakter.')
    .max(64, 'Username Discord maksimal 64 karakter.'),
  focusTopic: z.string().trim().min(2).max(120),
  preferredTime: z.string().trim().min(2).max(120),
})

export const MockInterviewScheduleModal = ({
  isOpen,
  onClose,
  onScheduled,
}: MockInterviewScheduleModalProps) => {
  const [language, setLanguage] = useState<'english' | 'nihongo' | 'german' | 'mandarin' | 'french' | 'bilingual'>('bilingual')
  const [discordHandle, setDiscordHandle] = useState('')
  const [focusTopic, setFocusTopic] = useState('Global Bilingual Interview')
  const [preferredTime, setPreferredTime] = useState('Weekend Malam (WIB)')
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

    const validated = mockInterviewSchema.safeParse({
      language,
      discordHandle,
      focusTopic,
      preferredTime,
    })
    if (!validated.success) {
      triggerHaptic('error')
      setErrorMessage(validated.error.issues[0]?.message ?? 'Periksa kembali isian formulir Anda.')
      return
    }

    setErrorMessage(null)
    setIsSubmitting(true)
    try {
      await onScheduled(validated.data)
      triggerHaptic('success')
      audioEngine.playSuccess()
      setIsSuccess(true)

      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
      closeTimerRef.current = setTimeout(() => {
        setDiscordHandle('')
        setIsSuccess(false)
        onClose()
      }, 1500)
    } catch (err: unknown) {
      triggerHaptic('error')
      audioEngine.playError()
      setErrorMessage(
        extractApiErrorMessage(
          err,
          'Gagal menjadwalkan Mock Interview. Pastikan kupon Anda mencukupi.'
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
          <div className="w-11 h-11 rounded-2xl bg-purple-50 border-2 border-purple-200 text-purple-600 flex items-center justify-center shrink-0 shadow-2xs">
            <Microphone weight="bold" className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-brand font-black text-base text-slate-900">
                Jadwalkan Live Mock Interview VIP
              </h3>
              <span className="text-[10px] font-mono bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded border border-purple-200 uppercase">
                1 SESI LIVE
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Simulasi 1-on-1 wawancara kerja &amp; percakapan profesional dalam bahasa pilihan Anda via Discord Voice.
            </p>
          </div>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-purple-100 border-2 border-purple-300 text-purple-600 flex items-center justify-center mx-auto text-3xl shadow-sm animate-bounce">
              <CheckCircle weight="fill" className="w-9 h-9" />
            </div>
            <h4 className="font-brand font-black text-lg text-slate-900">
              Jadwal Sesi Terkirim!
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Koordinator mentor kami akan menghubungi akun <span className="font-mono font-bold text-slate-800">{discordHandle}</span> untuk konfirmasi link room dan waktu simulasi.
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

            {/* Preferred Language */}
            <div className="space-y-1">
              <label className="text-xs font-brand font-black text-slate-700 flex items-center gap-1.5">
                <Translate weight="bold" className="w-4 h-4 text-purple-600" />
                <span>Bahasa Wawancara</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'bilingual' as const, label: 'Bilingual' },
                  { id: 'english' as const, label: 'Inggris' },
                  { id: 'nihongo' as const, label: 'Jepang' },
                  { id: 'german' as const, label: 'Jerman' },
                  { id: 'mandarin' as const, label: 'Mandarin' },
                  { id: 'french' as const, label: 'Prancis' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setLanguage(item.id)}
                    className={`py-2 px-2.5 rounded-xl border-2 text-[11px] font-black transition-all cursor-pointer text-center disabled:opacity-60 ${
                      language === item.id
                        ? 'bg-purple-50 border-purple-400 text-purple-900 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Discord Username */}
            <div className="space-y-1">
              <label className="text-xs font-brand font-black text-slate-700 flex items-center gap-1.5">
                <DiscordLogo weight="bold" className="w-4 h-4 text-indigo-600" />
                <span>Username Discord Anda *</span>
              </label>
              <input
                type="text"
                required
                maxLength={64}
                disabled={isSubmitting}
                value={discordHandle}
                onChange={(e) => setDiscordHandle(e.target.value)}
                placeholder="misal: username_discord"
                className="w-full bg-white border-2 border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:border-purple-500 focus:outline-none transition-all shadow-2xs disabled:opacity-60"
              />
            </div>

            {/* Focus Topic */}
            <div className="space-y-1">
              <label className="text-xs font-brand font-black text-slate-700 block">
                Fokus Topik Simulasi
              </label>
              <select
                value={focusTopic}
                disabled={isSubmitting}
                onChange={(e) => setFocusTopic(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:border-purple-500 focus:outline-none transition-all disabled:opacity-60"
              >
                <option value="Global Bilingual Interview">Simulasi Wawancara Kerja Internasional</option>
                <option value="Formal Business Conversation">Percakapan Bisnis &amp; Tata Krama Formal</option>
                <option value="Speaking & Listening Certification Prep">Persiapan Speaking/Listening (JLPT/IELTS/Goethe/HSK/DELF)</option>
                <option value="Self-Introduction & Cultural Fit">Perkenalan Diri Profesional &amp; Budaya Kerja</option>
              </select>
            </div>

            {/* Preferred Time */}
            <div className="space-y-1">
              <label className="text-xs font-brand font-black text-slate-700 flex items-center gap-1.5">
                <CalendarBlank weight="bold" className="w-4 h-4 text-slate-500" />
                <span>Preferensi Waktu Sesi</span>
              </label>
              <select
                value={preferredTime}
                disabled={isSubmitting}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:border-purple-500 focus:outline-none transition-all disabled:opacity-60"
              >
                <option value="Weekend Malam (WIB)">Sabtu / Minggu Malam (19.00 - 22.00 WIB)</option>
                <option value="Weekday Malam (WIB)">Senin - Jumat Malam (20.00 - 22.00 WIB)</option>
                <option value="Weekend Pagi / Siang (WIB)">Sabtu / Minggu Siang (13.00 - 16.00 WIB)</option>
              </select>
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
                variant="amber"
                size="sm"
                loading={isSubmitting}
                disableSound
                className="text-xs px-5 py-2 shadow-sm text-purple-950 bg-gradient-to-r from-purple-400 to-indigo-400 border-b-purple-600"
              >
                {isSubmitting ? 'Mengirim...' : 'Kirim Pengajuan Jadwal'}
              </Button3D>
            </div>
          </form>
        )}
      </div>
    </Modal3D>
  )
}
