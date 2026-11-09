/**
 * [COMPATIBILITY FACADE: AUDIO UTILITIES]
 * Seamless proxy bridging legacy audioEngine calls to audioService (Driver)
 * and useAudioStore (Zustand SSOT).
 */

import { audioService } from '../services/audioService'
import { useAudioStore } from '../store/audioStore'

class AudioEngineProxy {
  public isMuted(): boolean {
    return useAudioStore.getState().audioMode === 'muted'
  }

  public setMuted(muted: boolean): void {
    useAudioStore.getState().setAudioMode(muted ? 'muted' : 'all')
  }

  public toggleMute(): boolean {
    return useAudioStore.getState().toggleMute()
  }

  public playPop(): void {
    audioService.playPop()
  }

  public playSuccess(): void {
    audioService.playSuccess()
  }

  public playLevelUp(): void {
    audioService.playLevelUp()
  }

  public playError(): void {
    audioService.playError()
  }

  public playWhoosh(): void {
    audioService.playWhoosh()
  }

  public playCoinJingle(): void {
    audioService.playCoinJingle()
  }

  public playChestClaim(): void {
    audioService.playChestClaim()
  }

  public playRewardClaim(): void {
    audioService.playRewardClaim()
  }

  public playStreakFlame(): void {
    audioService.playStreakFlame()
  }

  public playFanfare(): void {
    audioService.playFanfare()
  }

  public speakLanguage(
    text: string,
    lang = 'ja-JP',
    onEnd?: () => void,
    onError?: () => void
  ): void {
    audioService.speakLanguage(text, lang, onEnd, onError)
  }

  public speakJapanese(text: string, onEnd?: () => void, onError?: () => void): void {
    audioService.speakJapanese(text, onEnd, onError)
  }

  public playSpeech(text: string, lang = 'ja-JP'): void {
    audioService.playSpeech(text, lang)
  }
}

export const soundEngine = new AudioEngineProxy()
export const audioEngine = soundEngine
