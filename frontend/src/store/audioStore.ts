import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import {
  audioService,
  type SoundEffectType,
  type SoundscapeTrack,
  type AudioPlaybackMode,
} from '../services/audioService'
import {
  DEFAULT_MASTER_VOLUME,
  DEFAULT_BGM_VOLUME,
  SOUND_STORAGE_KEYS,
} from '../tokens/soundTokens'

export interface AudioState {
  audioMode: AudioPlaybackMode
  masterVolume: number
  bgmVolume: number
  soundscapeTrack: SoundscapeTrack

  // Actions
  setAudioMode: (mode: AudioPlaybackMode) => void
  cycleAudioMode: () => AudioPlaybackMode
  setMasterVolume: (volume: number) => void
  setBgmVolume: (volume: number) => void
  setSoundscapeTrack: (track: SoundscapeTrack) => void
  toggleMute: () => boolean
  playSfx: (type: SoundEffectType, volumeMultiplier?: number) => void
  playBgm: (track?: SoundscapeTrack) => void
  stopBgm: () => void
}

/**
 * Recovers legacy localStorage sound settings for seamless backwards compatibility.
 */
const getInitialSettings = () => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return {
      audioMode: 'all' as AudioPlaybackMode,
      masterVolume: DEFAULT_MASTER_VOLUME,
      bgmVolume: DEFAULT_BGM_VOLUME,
    }
  }

  let mode: AudioPlaybackMode = 'all'
  const legacyMode = localStorage.getItem(SOUND_STORAGE_KEYS.audioMode) as AudioPlaybackMode | null
  if (legacyMode === 'all' || legacyMode === 'sfx_only' || legacyMode === 'muted') {
    mode = legacyMode
  } else if (localStorage.getItem(SOUND_STORAGE_KEYS.muted) === 'true') {
    mode = 'muted'
  }

  let masterVol = DEFAULT_MASTER_VOLUME
  const storedVol = localStorage.getItem(SOUND_STORAGE_KEYS.volume)
  if (storedVol !== null) {
    const parsed = parseFloat(storedVol)
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
      masterVol = parsed
    }
  }

  return { audioMode: mode, masterVolume: masterVol, bgmVolume: DEFAULT_BGM_VOLUME }
}

const initial = getInitialSettings()

export const useAudioStore = create<AudioState>()(
  persist(
    (set, get) => ({
      audioMode: initial.audioMode,
      masterVolume: initial.masterVolume,
      bgmVolume: initial.bgmVolume,
      soundscapeTrack: 'universal',

      setAudioMode: (mode) => {
        set({ audioMode: mode })
        audioService.setMode(mode)
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
        if (get().audioMode === 'all') {
          audioService.playBgm(track)
        }
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
        if (get().audioMode === 'all') {
          audioService.playBgm(targetTrack)
        }
      },

      stopBgm: () => {
        audioService.stopBgm()
      },
    }),
    {
      name: 'codeabroad_audio_storage',
      storage: createJSONStorage(() => localStorage),
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
