import { create } from 'zustand'
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware'
import {
  audioService,
  type SoundEffectType,
  type SoundscapeTrack,
  type AudioPlaybackMode,
} from "@/shared/services/audioService"
import {
  DEFAULT_MASTER_VOLUME,
  DEFAULT_BGM_VOLUME,
  SOUND_STORAGE_KEYS,
  LEGACY_SOUND_STORAGE_KEYS,
} from "@/shared/tokens/soundTokens"

const AUDIO_STORAGE_KEY = 'merantalk_audio_storage'
const LEGACY_AUDIO_STORAGE_KEY = 'codeabroad_audio_storage'

if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
  try {
    if (!localStorage.getItem(AUDIO_STORAGE_KEY)) {
      const legacyAudio = localStorage.getItem(LEGACY_AUDIO_STORAGE_KEY)
      if (legacyAudio) {
        localStorage.setItem(AUDIO_STORAGE_KEY, legacyAudio)
        localStorage.removeItem(LEGACY_AUDIO_STORAGE_KEY)
      }
    }
  } catch {
    // Ignore storage access errors
  }
}

export interface AudioState {
  audioMode: AudioPlaybackMode
  autoPlayVoice: boolean
  masterVolume: number
  bgmVolume: number
  soundscapeTrack: SoundscapeTrack

  // Actions
  setAudioMode: (mode: AudioPlaybackMode) => void
  setAutoPlayVoice: (enabled: boolean) => void
  toggleAutoPlayVoice: () => boolean
  cycleAudioMode: () => AudioPlaybackMode
  setMasterVolume: (volume: number) => void
  setBgmVolume: (volume: number) => void
  setSoundscapeTrack: (track: SoundscapeTrack) => void
  toggleMute: () => boolean
  playSfx: (type: SoundEffectType, volumeMultiplier?: number) => void
  playBgm: (track?: SoundscapeTrack) => void
  stopBgm: () => void
}

const safeLocalStorage: StateStorage = {
  getItem: (name) => {
    if (typeof window === 'undefined') return null
    try {
      return window.localStorage.getItem(name)
    } catch {
      return null
    }
  },
  setItem: (name, value) => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(name, value)
    } catch {
      // Ignore storage quota/privacy restrictions
    }
  },
  removeItem: (name) => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.removeItem(name)
    } catch {
      // Ignore storage quota/privacy restrictions
    }
  },
}

/**
 * Recovers legacy localStorage sound settings for seamless backwards compatibility.
 */
const getInitialSettings = () => {
  const defaults = {
    audioMode: 'all' as AudioPlaybackMode,
    masterVolume: DEFAULT_MASTER_VOLUME,
    bgmVolume: DEFAULT_BGM_VOLUME,
  }
  if (typeof window === 'undefined') {
    return defaults
  }

  try {
    let mode: AudioPlaybackMode = 'all'
    const legacyMode = (window.localStorage.getItem(SOUND_STORAGE_KEYS.audioMode) ||
      window.localStorage.getItem(LEGACY_SOUND_STORAGE_KEYS.audioMode)) as AudioPlaybackMode | null
    if (legacyMode === 'all' || legacyMode === 'sfx_only' || legacyMode === 'muted') {
      mode = legacyMode
    } else if (
      window.localStorage.getItem(SOUND_STORAGE_KEYS.muted) === 'true' ||
      window.localStorage.getItem(LEGACY_SOUND_STORAGE_KEYS.muted) === 'true'
    ) {
      mode = 'muted'
    }

    let masterVol = DEFAULT_MASTER_VOLUME
    const storedVol =
      window.localStorage.getItem(SOUND_STORAGE_KEYS.volume) ||
      window.localStorage.getItem(LEGACY_SOUND_STORAGE_KEYS.volume)
    if (storedVol !== null) {
      const parsed = parseFloat(storedVol)
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
        masterVol = parsed
      }
    }

    return { audioMode: mode, masterVolume: masterVol, bgmVolume: DEFAULT_BGM_VOLUME }
  } catch {
    return defaults
  }
}

const initial = getInitialSettings()

export const useAudioStore = create<AudioState>()(
  persist(
    (set, get) => ({
      audioMode: initial.audioMode,
      autoPlayVoice: true,
      masterVolume: initial.masterVolume,
      bgmVolume: initial.bgmVolume,
      soundscapeTrack: 'universal',

      setAudioMode: (mode) => {
        set({ audioMode: mode })
        audioService.setMode(mode)
      },

      setAutoPlayVoice: (autoPlayVoice) => {
        set({ autoPlayVoice })
      },

      toggleAutoPlayVoice: () => {
        const next = !get().autoPlayVoice
        set({ autoPlayVoice: next })
        return next
      },

      cycleAudioMode: () => {
        const current = get().audioMode
        const next: AudioPlaybackMode =
          current === 'all' ? 'sfx_only' : current === 'sfx_only' ? 'muted' : 'all'

        set({ audioMode: next })
        audioService.setMode(next)

        if (next !== 'muted') {
          audioService.play('node_tap')
        }

        return next
      },

      setMasterVolume: (masterVolume) => {
        const bounded = Math.max(0, Math.min(1, masterVolume))
        set({ masterVolume: bounded })
        audioService.setMasterVolume(bounded)
      },

      setBgmVolume: (bgmVolume) => {
        const bounded = Math.max(0, Math.min(1, bgmVolume))
        set({ bgmVolume: bounded })
        audioService.setBgmVolume(bounded)
      },

      setSoundscapeTrack: (track) => {
        set({ soundscapeTrack: track })
        audioService.playBgm(track)
      },

      toggleMute: () => {
        const current = get().audioMode
        const next: AudioPlaybackMode = current === 'muted' ? 'all' : 'muted'
        set({ audioMode: next })
        audioService.setMode(next)
        return next === 'muted'
      },

      playSfx: (type, volumeMultiplier = 1) => {
        audioService.play(type, volumeMultiplier)
      },

      playBgm: (track) => {
        const targetTrack = track || get().soundscapeTrack
        set({ soundscapeTrack: targetTrack })
        audioService.playBgm(targetTrack)
      },

      stopBgm: () => {
        audioService.stopBgm()
      },
    }),
    {
      name: AUDIO_STORAGE_KEY,
      storage: createJSONStorage(() => safeLocalStorage),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<AudioState> | undefined
        return {
          ...currentState,
          ...persisted,
          autoPlayVoice: persisted?.autoPlayVoice ?? true,
        }
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          audioService.setMode(state.audioMode)
          audioService.setMasterVolume(state.masterVolume)
          audioService.setBgmVolume(state.bgmVolume)
        }
      },
    }
  )
)
