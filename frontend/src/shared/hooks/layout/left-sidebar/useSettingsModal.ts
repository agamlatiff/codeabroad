import { useState, useCallback, useRef, useEffect } from 'react'
import { useUser } from "@/features/user/hooks/useUser"
import { triggerHaptic } from "@/shared/utils/haptics"
import type { User } from "@/features/user/types/user"
import type { AvatarStyle } from "@/features/user/utils/avatar"

const CLOSE_AFTER_SAVE_MS = 900

export const AVATAR_STYLE_OPTIONS: { id: AvatarStyle; label: string; desc: string }[] = [
  { id: 'adventurer', label: 'Petualang Tokyo', desc: 'Gaya modern kasual' },
  { id: 'bottts', label: 'Cyber Mech', desc: 'Robot tech futuristik' },
  { id: 'lorelei', label: 'Manga Anime', desc: 'Ilustrasi elegan khas Jepang' },
]

export interface UseSettingsModalOptions {
  isOpen: boolean
  onClose: () => void
  user?: User | null
  avatarStyle: AvatarStyle
  onAvatarStyleChange: (style: AvatarStyle) => void
  onProfileUpdated?: () => void
}

/**
 * 1:1 Headless controller hook for SettingsModal in AppLeftSidebar.
 * Manages profile update mutation via SSOT useUser hook and avatar style selection.
 */
export const useSettingsModal = ({
  isOpen,
  onClose,
  user,
  avatarStyle,
  onAvatarStyleChange,
  onProfileUpdated,
}: UseSettingsModalOptions) => {
  const { actions: userActions, status: userStatus } = useUser()

  const [name, setName] = useState(user?.name || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [selectedAvatarStyle, setSelectedAvatarStyle] = useState<AvatarStyle>(avatarStyle)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen)
  if (isOpen && !prevIsOpen) {
    setPrevIsOpen(true)
    setName(user?.name || '')
    setBio(user?.bio || '')
    setSelectedAvatarStyle(avatarStyle)
    setSaveSuccess(false)
    setErrorMessage(null)
  } else if (!isOpen && prevIsOpen) {
    setPrevIsOpen(false)
  }

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current)
      }
    }
  }, [])

  const handleAvatarSelect = useCallback(
    (style: AvatarStyle) => {
      triggerHaptic('tap')
      setSelectedAvatarStyle(style)
      onAvatarStyleChange(style)
    },
    [onAvatarStyleChange]
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      triggerHaptic('tap')
      const trimmedName = name.trim()
      if (!trimmedName) {
        setErrorMessage('Nama lengkap tidak boleh kosong')
        triggerHaptic('error')
        return
      }
      setSaveSuccess(false)
      setErrorMessage(null)
      setIsSubmitting(true)

      try {
        await userActions.updateProfile({
          name: trimmedName,
          bio: bio.trim(),
        })
        setSaveSuccess(true)
        setErrorMessage(null)
        triggerHaptic('success')
        onProfileUpdated?.()

        if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
        closeTimerRef.current = setTimeout(() => {
          onClose()
        }, CLOSE_AFTER_SAVE_MS)
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Gagal memperbarui profil pengguna'
        setErrorMessage(msg)
        triggerHaptic('error')
      } finally {
        setIsSubmitting(false)
      }
    },
    [name, bio, userActions, onProfileUpdated, onClose]
  )

  return {
    name,
    setName,
    bio,
    setBio,
    selectedAvatarStyle,
    avatarStyles: AVATAR_STYLE_OPTIONS,
    isSubmitting: isSubmitting || userStatus.isUpdating,
    saveSuccess,
    errorMessage,
    handleAvatarSelect,
    handleSubmit,
  }
}
