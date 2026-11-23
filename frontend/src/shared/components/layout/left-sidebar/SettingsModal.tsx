import type { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { AccessibleModal } from '@/shared/components/ui/AccessibleModal'
import {
  X,
  User as UserIcon,
  Fire,
  Star,
  Check,
  CircleNotch,
  SpeakerHigh,
  SpeakerLow,
  SpeakerSimpleSlash,
  Shuffle,
  Compass,
  SignOut,
  Clock,
} from '@phosphor-icons/react'
import { Button3D } from "@/shared/components/ui/Button3D"
import { UserAvatar } from './UserAvatar'
import { triggerHaptic } from "@/shared/utils/haptics"
import { useAudioStore } from "@/shared/store/audioStore"
import { computeXpLevelProgress } from "@/shared/utils/progression"
import {
  DAILY_GOAL_MINUTES_OPTIONS,
  useSettingsModal,
  type UseSettingsModalOptions,
} from "@/shared/hooks/layout/left-sidebar/useSettingsModal"

export type SettingsModalProps = UseSettingsModalOptions

/**
 * SettingsModal (SSOT)
 * Pure declarative account settings modal for AppLeftSidebar.
 * Powered 1:1 by useSettingsModal.
 */
export const SettingsModal: FC<SettingsModalProps> = (props) => {
  const { isOpen, onClose, user, onLogout } = props
  const navigate = useNavigate()

  const {
    name,
    setName,
    bio,
    setBio,
    dailyGoalMinutes,
    setDailyGoalMinutes,
    selectedAvatarUrl,
    avatarOptions,
    selectedAvatarStyle,
    isSubmitting,
    saveSuccess,
    errorMessage,
    handleSelectAvatarUrl,
    shuffleAvatarOptions,
    handleSubmit,
  } = useSettingsModal(props)

  const { audioMode, setAudioMode, autoPlayVoice, toggleAutoPlayVoice } = useAudioStore()

  if (!isOpen) return null

  const previewUser = user
    ? { ...user, avatar_url: selectedAvatarUrl }
    : { name: 'Pembelajar Global', avatar_url: selectedAvatarUrl }

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={() => {
        triggerHaptic('tap')
        onClose()
      }}
      ariaLabel="Pengaturan Akun"
      backdropClassName="bg-slate-900/50 backdrop-blur-xs"
    >
      <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-5 sm:p-7 max-w-2xl w-full space-y-5 shadow-2xl animate-pop relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic('tap')
            onClose()
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold cursor-pointer transition-colors"
          title="Tutup"
        >
          <X weight="bold" className="w-4 h-4" />
        </button>

        {/* ── 1. HEADER WITH AVATAR & USER SUMMARY ── */}
        <div className="flex items-center gap-4 pr-6">
          <div className="relative group">
            <div className="ring-4 ring-blue-100 rounded-full transition-transform">
              <UserAvatar
                user={previewUser}
                size="lg"
                style={selectedAvatarStyle}
                className="w-14 h-14"
              />
            </div>
            <span className="w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full absolute -bottom-0.5 -right-0.5 shadow-2xs" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-brand font-black text-lg text-slate-900 truncate">
                {user?.name || user?.username || 'Pembelajar Global'}
              </h3>
              <span className="bg-blue-50 border border-blue-200 text-blue-600 font-brand font-black text-[10px] px-2 py-0.5 rounded-full shrink-0">
                Lv. {user?.current_level || 1}
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate">
              {user?.email || 'user@merantalk.id'}
            </p>
            {(() => {
              const xpProgress = computeXpLevelProgress(user?.xp ?? 0, user?.current_level)
              return (
                <div className="mt-2 space-y-1">
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#2563EB] transition-all duration-300"
                      style={{ width: `${xpProgress.progressPercent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500">
                    <span>{xpProgress.xpInLevel}/{xpProgress.xpForNextLevel} XP</span>
                    <span>{xpProgress.xpRemaining} XP lagi ke Lv. {xpProgress.level + 1}</span>
                  </div>
                </div>
              )
            })()}
          </div>
        </div>

        {/* ── 2. QUICK STATS SUMMARY ── */}
        <div className="grid grid-cols-3 gap-2.5 p-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-center">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
              Streak
            </span>
            <div className="font-brand font-black text-sm text-orange-600 flex items-center justify-center gap-1">
              <Fire weight="fill" className="w-3.5 h-3.5 text-orange-500" />
              <span>{user?.streak || 0} Hari</span>
            </div>
          </div>
          <div className="space-y-0.5 border-x border-slate-200/80">
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
              Total XP
            </span>
            <div className="font-brand font-black text-sm text-amber-600 flex items-center justify-center gap-1">
              <Star weight="fill" className="w-3.5 h-3.5 text-amber-500" />
              <span>{user?.xp?.toLocaleString() || 0} XP</span>
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
              Target Harian
            </span>
            <div className="font-brand font-black text-sm text-blue-600 flex items-center justify-center gap-1 truncate px-1">
              <Clock weight="fill" className="w-3.5 h-3.5 text-blue-500" />
              <span>{dailyGoalMinutes} mnt/hari</span>
            </div>
          </div>
        </div>

        {/* ── 3. FORM EDIT PROFIL ── */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold">
              {errorMessage}
            </div>
          )}

          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
              <Check weight="bold" className="w-4 h-4 text-emerald-600" />
              <span>Profil berhasil diperbarui dan tersimpan!</span>
            </div>
          )}

          {/* Nama Pengembang */}
          <div className="space-y-1">
            <label className="text-xs font-brand font-black text-slate-700 block">
              Nama Lengkap
            </label>
            <div className="relative">
              <UserIcon
                weight="bold"
                className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama kamu..."
                className="w-full bg-white text-xs font-medium pl-9 pr-3.5 py-2.5 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-400 text-slate-900 shadow-2xs"
              />
            </div>
          </div>

          {/* Bio Profil */}
          <div className="space-y-1">
            <label className="text-xs font-brand font-black text-slate-700 block">
              Bio Profil Singkat
            </label>
            <textarea
              rows={2}
              maxLength={500}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Contoh: Sedang menyiapkan sertifikasi bahasa untuk studi dan karir internasional."
              className="w-full bg-white text-xs font-medium p-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-400 text-slate-900 shadow-2xs resize-none"
            />
          </div>

          {/* Target Belajar Harian */}
          <div className="space-y-2">
            <label className="text-xs font-brand font-black text-slate-700 block">
              Target Belajar Harian
            </label>
            <div className="grid grid-cols-4 gap-2">
              {DAILY_GOAL_MINUTES_OPTIONS.map((mins) => {
                const isSelected = dailyGoalMinutes === mins
                return (
                  <button
                    key={mins}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => {
                      triggerHaptic('tap')
                      setDailyGoalMinutes(mins)
                    }}
                    className={`py-2 px-2 rounded-xl border-2 text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300'
                    }`}
                  >
                    <span className="block font-brand font-black text-sm leading-tight">
                      {mins} mnt
                    </span>
                    <span className="block text-[10px] font-semibold text-slate-500">
                      per hari
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Pilih Foto Profil (Petualang Global) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs font-brand font-black text-slate-700">
                Pilih Foto Profil ({avatarOptions.length} Pilihan)
              </label>
              <button
                type="button"
                onClick={shuffleAvatarOptions}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-[11px] font-brand font-bold text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-200 transition-colors cursor-pointer select-none"
              >
                <Shuffle weight="bold" className="w-3.5 h-3.5" />
                <span>Acak Pilihan</span>
              </button>
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-3 justify-items-center py-1">
              {avatarOptions.map((url, idx) => {
                const isSelected = selectedAvatarUrl === url
                return (
                  <button
                    key={url}
                    type="button"
                    onClick={() => handleSelectAvatarUrl(url)}
                    aria-label={`Pilih avatar ${idx + 1}`}
                    aria-pressed={isSelected}
                    className={`w-12 h-12 sm:w-13 sm:h-13 rounded-full p-0.5 transition-all cursor-pointer relative flex items-center justify-center bg-white select-none ${
                      isSelected
                        ? 'ring-2 ring-[#2563EB] ring-offset-2 shadow-sm'
                        : 'ring-1 ring-slate-200 hover:ring-blue-300'
                    }`}
                  >
                    <img
                      src={url}
                      alt={`Avatar pilihan ${idx + 1}`}
                      loading="lazy"
                      className="w-full h-full rounded-full object-cover pointer-events-none"
                    />
                    {isSelected && (
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-xs ring-2 ring-white"
                      >
                        <Check weight="bold" className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── AUDIO & SOUNDSCAPE PREFERENCES ── */}
          <div className="space-y-2.5 pt-3 border-t border-slate-200/80">
            <label className="block text-xs font-brand font-black uppercase text-slate-700 tracking-wider">
              Suara & Musik Latar
            </label>

            {/* Audio Mode 3D Segmented Control */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('tap')
                  setAudioMode('all')
                }}
                className={`py-2 px-2.5 rounded-xl border-2 text-center text-xs font-brand font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  audioMode === 'all'
                    ? 'border-emerald-500 bg-emerald-50/80 text-emerald-800 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                }`}
              >
                <SpeakerHigh weight={audioMode === 'all' ? 'fill' : 'bold'} className="w-4 h-4 text-emerald-600" />
                <span className="text-[10px]">BGM & SFX</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic('tap')
                  setAudioMode('sfx_only')
                }}
                className={`py-2 px-2.5 rounded-xl border-2 text-center text-xs font-brand font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  audioMode === 'sfx_only'
                    ? 'border-blue-500 bg-blue-50/80 text-blue-800 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                }`}
              >
                <SpeakerLow weight={audioMode === 'sfx_only' ? 'fill' : 'bold'} className="w-4 h-4 text-blue-600" />
                <span className="text-[10px]">SFX Saja</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic('tap')
                  setAudioMode('muted')
                }}
                className={`py-2 px-2.5 rounded-xl border-2 text-center text-xs font-brand font-bold transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  audioMode === 'muted'
                    ? 'border-slate-400 bg-slate-100 text-slate-800 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                }`}
              >
                <SpeakerSimpleSlash weight={audioMode === 'muted' ? 'fill' : 'bold'} className="w-4 h-4 text-slate-500" />
                <span className="text-[10px]">Hening</span>
              </button>
            </div>

            {/* Auto-Play TTS Voice Switch */}
            <div className="flex items-center justify-between gap-3 rounded-2xl border-2 border-slate-200/80 bg-slate-50/70 px-3.5 py-2.5">
              <div className="min-w-0">
                <p className="text-xs font-brand font-black text-slate-800">
                  Putar Suara Otomatis (Auto-Play TTS)
                </p>
                <p className="text-[11px] font-medium text-slate-500">
                  {audioMode === 'muted'
                    ? 'Nonaktifkan mode Hening terlebih dahulu agar suara terdengar.'
                    : 'Langsung bacakan pelafalan Jepang saat kartu materi, flashcard, atau soal terbuka.'}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={autoPlayVoice}
                aria-label="Putar Suara Otomatis"
                onClick={() => {
                  triggerHaptic('tap')
                  toggleAutoPlayVoice()
                }}
                className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border-2 transition-colors cursor-pointer ${
                  autoPlayVoice
                    ? 'bg-emerald-500 border-emerald-600'
                    : 'bg-slate-200 border-slate-300'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`inline-block h-5 w-5 rounded-full bg-white shadow-xs transition-transform ${
                    autoPlayVoice ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* ── PANDUAN FITUR ── */}
          <div className="space-y-2 pt-3 border-t border-slate-200/80">
            <label className="block text-xs font-brand font-black uppercase text-slate-700 tracking-wider">
              Panduan Fitur
            </label>
            <button
              type="button"
              onClick={() => {
                triggerHaptic('tap')
                onClose()
                navigate('/curriculum?tour=1')
              }}
              className="w-full py-2.5 px-3.5 rounded-xl border-2 border-blue-200 bg-blue-50/70 hover:bg-blue-100/80 text-blue-700 text-xs font-brand font-black transition-all cursor-pointer flex items-center justify-center gap-2 active:translate-y-0.5"
            >
              <Compass weight="bold" className="w-4 h-4" />
              <span>Ulangi Panduan Fitur</span>
            </button>
          </div>

          {onLogout && (
            <div className="md:hidden pt-3 border-t border-slate-200/80">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('tap')
                  onClose()
                  onLogout()
                }}
                className="w-full py-2.5 px-3.5 rounded-xl border-2 border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-700 text-xs font-brand font-black transition-all cursor-pointer flex items-center justify-center gap-2 active:translate-y-0.5"
              >
                <SignOut weight="bold" className="w-4 h-4" />
                <span>Keluar Akun</span>
              </button>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <Button3D
              type="button"
              variant="white"
              size="md"
              onClick={() => {
                triggerHaptic('tap')
                onClose()
              }}
              className="px-4 py-2 text-xs"
            >
              BATAL
            </Button3D>
            <Button3D
              type="submit"
              variant="blue"
              size="md"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs shadow-[0_3px_0_0_#1D4ED8]"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-1.5">
                  <CircleNotch weight="bold" className="w-3.5 h-3.5 animate-spin" />
                  <span>MENYIMPAN...</span>
                </span>
              ) : (
                'SIMPAN PERUBAHAN'
              )}
            </Button3D>
          </div>
        </form>
      </div>
    </AccessibleModal>
  )
}

