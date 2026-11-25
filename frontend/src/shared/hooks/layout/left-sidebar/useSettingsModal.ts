import { useState, useCallback, useRef, useEffect } from 'react'
import { z } from 'zod'
import { useUser } from "@/features/user/hooks/useUser"
import { triggerHaptic } from "@/shared/utils/haptics"
import { extractApiErrorMessage } from "@/shared/services/api"
import type { User } from "@/shared/types/user"
import {
  AVATAR_PRESET_SEEDS,
  buildAdventurerAvatarUrl,
  getAvatarUrl,
  type AvatarStyle,
} from "@/shared/utils/avatar"

const resolveInitialAvatarUrl = (user?: User | null): string => getAvatarUrl(user)

const buildInitialAvatarOptions = (initialUrl: string): string[] => {
  const baseOptions = AVATAR_PRESET_SEEDS.map(buildAdventurerAvatarUrl)
  if (initialUrl && !baseOptions.includes(initialUrl)) {
    return [initialUrl, ...baseOptions.slice(0, baseOptions.length - 1)]
  }
  return baseOptions
}

const CLOSE_AFTER_SAVE_MS = 900

export const DAILY_GOAL_MINUTES_OPTIONS = [5, 15, 30, 45] as const
export type SettingsDailyGoalMinutes = (typeof DAILY_GOAL_MINUTES_OPTIONS)[number]

const normalizeDailyGoalMinutes = (value?: number | null): SettingsDailyGoalMinutes => {
  if (value === 5 || value === 15 || value === 30 || value === 45) {
    return value
  }
  return 15
}

const profileSettingsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Nama lengkap minimal 2 karakter')
    .max(100, 'Nama lengkap maksimal 100 karakter'),
  bio: z.string().trim().max(500, 'Bio maksimal 500 karakter'),
})

export const AVATAR_STYLE_OPTIONS: { id: AvatarStyle; label: string; desc: string }[] = [
  { id: 'adventurer', label: 'Petualang Global', desc: 'Gaya modern kasual' },
]

export interface UseSettingsModalOptions {
  isOpen: boolean
  onClose: () => void
  user?: User | null
  avatarStyle: AvatarStyle
  onAvatarStyleChange: (style: AvatarStyle) => void
  onProfileUpdated?: () => void
  onLogout?: () => void
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
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState<SettingsDailyGoalMinutes>(() =>
    normalizeDailyGoalMinutes(user?.daily_goal_minutes)
  )
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState(() => resolveInitialAvatarUrl(user))
  const [avatarOptions, setAvatarOptions] = useState<string[]>(() =>
    buildInitialAvatarOptions(resolveInitialAvatarUrl(user))
  )
  const [selectedAvatarStyle, setSelectedAvatarStyle] = useState<AvatarStyle>(avatarStyle)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen)

  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen)
    if (isOpen) {
      const nextInitialUrl = resolveInitialAvatarUrl(user)
      setName(user?.name || '')
      setBio(user?.bio || '')
      setDailyGoalMinutes(normalizeDailyGoalMinutes(user?.daily_goal_minutes))
      setSelectedAvatarUrl(nextInitialUrl)
      setAvatarOptions(buildInitialAvatarOptions(nextInitialUrl))
      setSelectedAvatarStyle(avatarStyle)
      setSaveSuccess(false)
      setErrorMessage(null)
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

  const handleAvatarSelect = useCallback(
    (style: AvatarStyle) => {
      triggerHaptic('tap')
      setSelectedAvatarStyle(style)
      onAvatarStyleChange(style)
    },
    [onAvatarStyleChange]
  )

  const handleSelectAvatarUrl = useCallback((url: string) => {
    triggerHaptic('tap')
    setSelectedAvatarUrl(url)
  }, [])

  const shuffleAvatarOptions = useCallback(() => {
    triggerHaptic('tap')
    const nonce = Math.random().toString(36).slice(2, 7)
    setAvatarOptions(
      AVATAR_PRESET_SEEDS.map((seed, idx) => buildAdventurerAvatarUrl(`${seed}-${nonce}-${idx}`))
    )
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      triggerHaptic('tap')
      const validation = profileSettingsSchema.safeParse({ name, bio })
      if (!validation.success) {
        setErrorMessage(validation.error.issues[0]?.message || 'Input profil tidak valid')
        triggerHaptic('error')
        return
      }

      setSaveSuccess(false)
      setErrorMessage(null)
      setIsSubmitting(true)

      try {
        await userActions.updateProfile({
          name: validation.data.name,
          bio: validation.data.bio,
          avatar_url: selectedAvatarUrl,
          daily_goal_minutes: dailyGoalMinutes,
        })
        setSaveSuccess(true)
        setErrorMessage(null)
        triggerHaptic('success')
        onProfileUpdated?.()

        if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
        closeTimerRef.current = setTimeout(() => {
          closeTimerRef.current = null
          onClose()
        }, CLOSE_AFTER_SAVE_MS)
      } catch (err: unknown) {
        setErrorMessage(extractApiErrorMessage(err, 'Gagal memperbarui profil pengguna'))
        triggerHaptic('error')
      } finally {
        setIsSubmitting(false)
      }
    },
    [name, bio, dailyGoalMinutes, selectedAvatarUrl, userActions, onProfileUpdated, onClose]
  )

  return {
    name,
    setName,
    bio,
    setBio,
    dailyGoalMinutes,
    setDailyGoalMinutes,
    selectedAvatarUrl,
    avatarOptions,
    selectedAvatarStyle,
    avatarStyles: AVATAR_STYLE_OPTIONS,
    isSubmitting: isSubmitting || userStatus.isUpdating,
    saveSuccess,
    errorMessage,
    handleSelectAvatarUrl,
    shuffleAvatarOptions,
    handleAvatarSelect,
    handleSubmit,
  }
}
