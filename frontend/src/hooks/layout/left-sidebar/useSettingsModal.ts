import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '../../../services/authService'
import { onboardingService } from '../../../services/onboardingService'
import { useAuthStore } from '../../../store/authStore'
import { triggerHaptic } from '../../../utils/haptics'
import { mapCareerPathsToTrackOptions } from '../../../utils/roadmapMapper'
import { CAREER_PATHS_QUERY_KEY, PROFILE_QUERY_KEY } from '../top-bar/useAppTopBar'
import type { User } from '../../../types/auth'
import type { AvatarStyle } from '../../../utils/avatar'

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
 * Manages profile update mutation, dynamic career track options from PostgreSQL,
 * and avatar style selection.
 */
export const useSettingsModal = ({
  isOpen,
  onClose,
  user,
  avatarStyle,
  onAvatarStyleChange,
  onProfileUpdated,
}: UseSettingsModalOptions) => {
  const queryClient = useQueryClient()
  const { updateUser } = useAuthStore()

  const [name, setName] = useState(user?.name || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [primaryStack, setPrimaryStack] = useState(user?.primary_stack || 'golang')
  const [selectedAvatarStyle, setSelectedAvatarStyle] = useState<AvatarStyle>(avatarStyle)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen)
  if (isOpen && !prevIsOpen) {
    setPrevIsOpen(true)
    setName(user?.name || '')
    setBio(user?.bio || '')
    setPrimaryStack(user?.primary_stack || 'golang')
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

  const { data: careerPaths = [] } = useQuery({
    queryKey: CAREER_PATHS_QUERY_KEY,
    queryFn: () => onboardingService.getCareerPaths(),
    enabled: isOpen,
    staleTime: 1000 * 60 * 10,
  })

  const stackOptions = useMemo(
    () => mapCareerPathsToTrackOptions(careerPaths),
    [careerPaths]
  )

  const updateProfileMutation = useMutation({
    mutationFn: () =>
      authService.updateProfile({
        name: name.trim() || undefined,
        bio: bio.trim() || undefined,
        primary_stack: primaryStack,
      }),
    onSuccess: (updatedUser) => {
      updateUser(updatedUser)
      setSaveSuccess(true)
      setErrorMessage(null)
      triggerHaptic('success')
      void queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY })
      onProfileUpdated?.()

      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
      closeTimerRef.current = setTimeout(() => {
        onClose()
      }, CLOSE_AFTER_SAVE_MS)
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : 'Gagal memperbarui profil pengguna'
      setErrorMessage(msg)
      triggerHaptic('error')
    },
  })

  const handleAvatarSelect = useCallback(
    (style: AvatarStyle) => {
      triggerHaptic('tap')
      setSelectedAvatarStyle(style)
      onAvatarStyleChange(style)
    },
    [onAvatarStyleChange]
  )

  const handleStackSelect = useCallback((slug: string) => {
    triggerHaptic('tap')
    setPrimaryStack(slug)
  }, [])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      triggerHaptic('tap')
      setSaveSuccess(false)
      setErrorMessage(null)
      updateProfileMutation.mutate()
    },
    [updateProfileMutation]
  )

  return {
    name,
    setName,
    bio,
    setBio,
    primaryStack,
    selectedAvatarStyle,
    stackOptions,
    avatarStyles: AVATAR_STYLE_OPTIONS,
    isSubmitting: updateProfileMutation.isPending,
    saveSuccess,
    errorMessage,
    handleAvatarSelect,
    handleStackSelect,
    handleSubmit,
  }
}

