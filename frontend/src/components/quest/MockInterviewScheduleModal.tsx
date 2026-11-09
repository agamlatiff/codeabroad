import { useState } from 'react'
import { Microphone, CheckCircle, CalendarBlank, DiscordLogo, Translate } from '@phosphor-icons/react'
import { Modal3D } from '../ui/Modal3D'
import { Button3D } from '../ui/Button3D'
import { triggerHaptic } from '../../utils/haptics'
import { audioEngine } from '../../utils/audio'

export interface MockInterviewScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  onScheduled: (data: { language: string; discordHandle: string; focusTopic: string; preferredTime: string }) => void
}

export const MockInterviewScheduleModal = ({
  isOpen,
  onClose,
  onScheduled,
}: MockInterviewScheduleModalProps) => {
  const [language, setLanguage] = useState<'bilingual' | 'nihongo' | 'english'>('bilingual')
  const [discordHandle, setDiscordHandle] = useState('')
  const [focusTopic, setFocusTopic] = useState('Golang & System Concurrency')
  const [preferredTime, setPreferredTime] = useState('Weekend Malam (JST/WIB)')
  const [isSuccess, setIsSuccess] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!discordHandle.trim()) {
      triggerHaptic('error')
      return
    }

    triggerHaptic('success')
    audioEngine.playSuccess()
    setIsSuccess(true)

    setTimeout(() => {
      onScheduled({ language, discordHandle, focusTopic, preferredTime })
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
              Simulasi 1-on-1 interview teknis &amp; behavioral standar perusahaan Tokyo via Discord Voice.
            </p>
          </div>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-purple-100 border-2 border-purple-300 text-purple-600 flex items-center justify-center mx-auto text-3xl shadow-sm animate-bounce">
              <CheckCircle weight="fill" className="w-9 h-9" />
            </div>
            <h4 className="font-brand font-black text-lg text-slate-900">
              Jadwal Sesi Terkirim! 🎙️
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Koordinator Discord kami akan menghubungi akun <span className="font-mono font-bold text-slate-800">{discordHandle}</span> untuk konfirmasi link room dan waktu simulasi.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Preferred Language */}
            <div className="space-y-1">
              <label className="text-xs font-brand font-black text-slate-700 flex items-center gap-1.5">
                <Translate weight="bold" className="w-4 h-4 text-purple-600" />
                <span>Format Bahasa Wawancara</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'bilingual' as const, label: 'Campuran (JP & EN)' },
                  { id: 'nihongo' as const, label: 'Full Nihongo (JLPT)' },
                  { id: 'english' as const, label: 'Full English Tech' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setLanguage(item.id)}
                    className={`py-2 px-2.5 rounded-xl border-2 text-[11px] font-black transition-all cursor-pointer text-center ${
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
                value={discordHandle}
                onChange={(e) => setDiscordHandle(e.target.value)}
                placeholder="misal: username_discord#1234 atau username"
                className="w-full bg-white border-2 border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:border-purple-500 focus:outline-none transition-all shadow-2xs"
              />
            </div>

            {/* Focus Topic */}
            <div className="space-y-1">
              <label className="text-xs font-brand font-black text-slate-700 block">
                Fokus Topik Simulasi
              </label>
              <select
                value={focusTopic}
                onChange={(e) => setFocusTopic(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:border-purple-500 focus:outline-none transition-all"
              >
                <option value="Golang & System Concurrency">Golang &amp; Concurrency (Worker Pool &amp; Channels)</option>
                <option value="Clean Architecture & Microservices">Clean Architecture &amp; Database Optimization</option>
                <option value="Live Coding & Data Structures">Live Algorithmic Coding Problem Solving</option>
                <option value="Japanese Tech Culture & Jikoshoukai">Wawancara Budaya &amp; Jikoshoukai (自己紹介)</option>
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
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:border-purple-500 focus:outline-none transition-all"
              >
                <option value="Weekend Malam (JST/WIB)">Sabtu / Minggu Malam (19.00 - 22.00 WIB)</option>
                <option value="Weekday Malam (JST/WIB)">Senin - Jumat Malam (20.00 - 22.00 WIB)</option>
                <option value="Weekend Pagi / Siang">Sabtu / Minggu Siang (13.00 - 16.00 WIB)</option>
              </select>
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
                variant="amber"
                size="sm"
                className="text-xs px-5 py-2 shadow-sm text-purple-950 bg-gradient-to-r from-purple-400 to-indigo-400 border-b-purple-600"
              >
                Kirim Pengajuan Jadwal ➔
              </Button3D>
            </div>
          </form>
        )}
      </div>
    </Modal3D>
  )
}
