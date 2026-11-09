/**
 * [COMPATIBILITY FACADE: SOUND UTILITIES]
 * Seamless proxy bridging legacy calls to the new domain-driven
 * audioService (Driver Layer) and useAudioStore (Zustand SSOT).
 */

import {
  audioService,
  type SoundEffectType,
  type SoundscapeTrack,
  type AudioPlaybackMode,
} from '../services/audioService'
import { useAudioStore } from '../store/audioStore'

export type { SoundEffectType, SoundscapeTrack, AudioPlaybackMode }

export const playSound = (type: SoundEffectType, volumeMultiplier = 1): void => {
  audioService.play(type, volumeMultiplier)
}

export const playBgm = (track: SoundscapeTrack = 'universal'): void => {
  useAudioStore.getState().playBgm(track)
}

export const stopBgm = (): void => {
  audioService.stopBgm()
}

export const getAudioMode = (): AudioPlaybackMode => useAudioStore.getState().audioMode
export const setAudioMode = (mode: AudioPlaybackMode): void =>
  useAudioStore.getState().setAudioMode(mode)
export const cycleAudioMode = (): AudioPlaybackMode => useAudioStore.getState().cycleAudioMode()
export const isSoundMuted = (): boolean => useAudioStore.getState().audioMode === 'muted'
export const toggleSoundMuted = (): boolean => useAudioStore.getState().toggleMute()

export const subscribeAudioMode = (listener: (mode: AudioPlaybackMode) => void) =>
  useAudioStore.subscribe((state) => {
    listener(state.audioMode)
  })
