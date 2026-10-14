import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { FC } from 'react'
import {
  X,
  User as UserIcon,
  Fire,
  Star,
  Check,
  CircleNotch,
  Code,
  Cpu,
  DeviceMobile,
} from '@phosphor-icons/react'
import { Button3D } from '../ui/Button3D'
import { UserAvatar } from '../ui/UserAvatar'
import { triggerHaptic } from '../../utils/haptics'
import { authService } from '../../services/authService'
import type { User } from '../../types/auth'
import type { AvatarStyle } from '../../utils/avatar'

export interface AccountSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  user?: User | null
  avatarStyle: AvatarStyle
  onAvatarStyleChange: (style: AvatarStyle) => void
  onProfileUpdated?: () => void
}

export const AccountSettingsModal: FC<AccountSettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  avatarStyle,
  onAvatarStyleChange,
  onProfileUpdated,
}) => {
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [primaryStack, setPrimaryStack] = useState('golang')
  const [selectedAvatarStyle, setSelectedAvatarStyle] = useState<AvatarStyle>(avatarStyle)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setBio(user.bio || '')
      setPrimaryStack(user.primary_stack || 'golang')
      setSelectedAvatarStyle(avatarStyle)
      setSaveSuccess(false)
      setErrorMessage(null)
    }
  }, [user, avatarStyle, isOpen])

  if (!isOpen) return null

  const handleAvatarSelect = (style: AvatarStyle) => {
    triggerHaptic('tap')
    setSelectedAvatarStyle(style)
    onAvatarStyleChange(style)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)
    setSaveSuccess(false)
    triggerHaptic('tap')

    try {
      await authService.updateProfile({
        name: name.trim() || undefined,
        bio: bio.trim() || undefined,
        primary_stack: primaryStack,
      })
      setSaveSuccess(true)
      triggerHaptic('success')
      if (onProfileUpdated) {
        onProfileUpdated()
      }
      setTimeout(() => {
        onClose()
      }, 900)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memperbarui profil pengguna'
      setErrorMessage(msg)
      triggerHaptic('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const stackOptions = [
    {
      id: 'golang',
      label: 'Golang Backend',
      desc: 'Gin, Postgres & Microservices',
      icon: Code,
      badgeColor: 'border-blue-400 bg-blue-50 text-blue-700',
    },
    {
      id: 'frontend',
      label: 'React & TypeScript',
      desc: 'Components, Hooks & Web Apps',
      icon: DeviceMobile,
      badgeColor: 'border-cyan-400 bg-cyan-50 text-cyan-700',
    },
    {
      id: 'devops',
      label: 'DevOps & Cloud',
      desc: 'Docker, Linux & AWS CI/CD',
      icon: Cpu,
      badgeColor: 'border-amber-400 bg-amber-50 text-amber-700',
    },
  ]

  const avatarStyles: { id: AvatarStyle; label: string; desc: string }[] = [
    { id: 'adventurer', label: 'Petualang Tokyo', desc: 'Gaya modern kasual' },
    { id: 'bottts', label: 'Cyber Mech', desc: 'Robot tech futuristik' },
    { id: 'lorelei', label: 'Manga Anime', desc: 'Ilustrasi elegan khas Jepang' },
  ]

  if (typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed inset-0 z-50 w-screen h-screen flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-5 sm:p-7 max-w-lg w-full space-y-5 shadow-2xl animate-pop relative max-h-[92vh] overflow-y-auto">
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
                user={user}
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
                {user?.name || user?.username || 'Pengembang Tokyo'}
              </h3>
              <span className="bg-blue-50 border border-blue-200 text-blue-600 font-brand font-black text-[10px] px-2 py-0.5 rounded-full shrink-0">
                Lv. {user?.current_level || 1}
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate">
              {user?.email || 'user@codeabroad.io'}
            </p>
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
              Tujuan
            </span>
            <div className="font-brand font-black text-sm text-slate-700 flex items-center justify-center gap-1 truncate px-1">
              <span>🗼 Tokyo, JP</span>
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
              <span>Profil berhasil diperbarui dan tersimpan ke cloud!</span>
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama kamu..."
                className="w-full bg-white text-xs font-medium pl-9 pr-3.5 py-2.5 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-400 text-slate-900 shadow-2xs"
              />
            </div>
          </div>

          {/* Bio Developer */}
          <div className="space-y-1">
            <label className="text-xs font-brand font-black text-slate-700 block">
              Bio Developer Singkat
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Contoh: Backend engineer spesialis Golang menargetkan karier di startup Tokyo 2026."
              className="w-full bg-white text-xs font-medium p-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-400 text-slate-900 shadow-2xs resize-none"
            />
          </div>

          {/* Pilihan Gaya Avatar */}
          <div className="space-y-2">
            <label className="text-xs font-brand font-black text-slate-700 block">
              Gaya Avatar Profil
            </label>
            <div className="grid grid-cols-3 gap-2">
              {avatarStyles.map((item) => {
                const isSelected = selectedAvatarStyle === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleAvatarSelect(item.id)}
                    className={`p-2.5 rounded-xl border-2 text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <UserAvatar
                      user={user}
                      size="sm"
                      style={item.id}
                      className="w-8 h-8 pointer-events-none"
                    />
                    <div className="leading-tight">
                      <span className="font-brand font-black text-[11px] text-slate-800 block">
                        {item.label}
                      </span>
                      <span className="text-[9px] text-slate-400 block font-medium">
                        {item.desc}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Pilihan Target Spesialisasi */}
          <div className="space-y-2">
            <label className="text-xs font-brand font-black text-slate-700 block">
              Peminatan Karier Utama
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {stackOptions.map((stk) => {
                const Icon = stk.icon
                const isSelected = primaryStack === stk.id

                return (
                  <button
                    key={stk.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic('tap')
                      setPrimaryStack(stk.id)
                    }}
                    className={`p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/70 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                        <Icon weight="bold" className="w-3.5 h-3.5" />
                      </div>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                          <Check weight="bold" className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>
                    <div>
                      <span className="font-brand font-black text-xs text-slate-900 block">
                        {stk.label}
                      </span>
                      <span className="text-[9px] text-slate-500 block font-medium mt-0.5">
                        {stk.desc}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

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
    </div>,
    document.body
  )
}
