import {
  SOUND_PRESETS,
  SOUND_STORAGE_KEYS,
  DEFAULT_MASTER_VOLUME,
  type SoundEffectType,
} from '../tokens/soundTokens'

export type { SoundEffectType }

class AudioEngine {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private muted: boolean = false
  private volume: number = DEFAULT_MASTER_VOLUME

  constructor() {
    this.restoreSettings()
  }

  private restoreSettings() {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return
    try {
      const storedMuted = localStorage.getItem(SOUND_STORAGE_KEYS.muted)
      if (storedMuted !== null) {
        this.muted = storedMuted === 'true'
      }
      const storedVol = localStorage.getItem(SOUND_STORAGE_KEYS.volume)
      if (storedVol !== null) {
        const parsed = parseFloat(storedVol)
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
          this.volume = parsed
        }
      }
    } catch {
      // Ignored in restricted environments
    }
  }

  private persistSettings() {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return
    try {
      localStorage.setItem(SOUND_STORAGE_KEYS.muted, String(this.muted))
      localStorage.setItem(SOUND_STORAGE_KEYS.volume, String(this.volume))
    } catch {
      // Ignored
    }
  }

  /**
   * Lazily initializes and unlocks the Web Audio Context upon user interaction
   * conforming to modern browser autoplay security policies.
   */
  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null

    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext

      if (!AudioCtx) return null

      this.ctx = new AudioCtx()
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.setValueAtTime(
        this.muted ? 0 : this.volume,
        this.ctx.currentTime
      )
      this.masterGain.connect(this.ctx.destination)
    }

    if (this.ctx.state === 'suspended') {
      void this.ctx.resume()
    }

    return this.ctx
  }

  public play(type: SoundEffectType, volumeMultiplier = 1): void {
    if (this.muted) return

    const config = SOUND_PRESETS[type]
    if (!config) return

    const ctx = this.getContext()
    if (!ctx || !this.masterGain) return

    const baseTime = ctx.currentTime

    for (const step of config.steps) {
      try {
        const startTime = baseTime + (step.delay || 0)
        const stopTime = startTime + step.duration

        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = step.type || 'sine'
        osc.frequency.setValueAtTime(step.freq, startTime)

        if (step.targetFreq) {
          if (step.rampType === 'linear') {
            osc.frequency.linearRampToValueAtTime(step.targetFreq, stopTime)
          } else {
            // Exponential ramps cannot reach zero or negative numbers
            osc.frequency.exponentialRampToValueAtTime(
              Math.max(step.targetFreq, 0.01),
              stopTime
            )
          }
        }

        // Soft ADSR envelope to prevent acoustic clipping
        const peakGain = Math.max(step.gain * config.volume * volumeMultiplier, 0.0001)
        gain.gain.setValueAtTime(0.0001, startTime)
        gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.008) // 8ms quick attack
        gain.gain.exponentialRampToValueAtTime(0.0001, stopTime)

        osc.connect(gain)
        gain.connect(this.masterGain)

        osc.start(startTime)
        osc.stop(stopTime)
      } catch {
        // Graceful audio failover without throwing errors in user flow
      }
    }
  }

  public isMuted(): boolean {
    return this.muted
  }

  public setMuted(muted: boolean): void {
    this.muted = muted
    this.persistSettings()
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setValueAtTime(
        muted ? 0 : this.volume,
        this.ctx.currentTime
      )
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.muted)
    return this.muted
  }

  public getVolume(): number {
    return this.volume
  }

  public setVolume(vol: number): void {
    const clamped = Math.max(0, Math.min(1, vol))
    this.volume = clamped
    this.persistSettings()
    if (this.ctx && this.masterGain && !this.muted) {
      this.masterGain.gain.setValueAtTime(clamped, this.ctx.currentTime)
    }
  }
}

// Global audio engine singleton
const audioEngine = new AudioEngine()

/**
 * Triggers a procedural Web Audio sound effect with zero asset downloading and zero latency.
 */
export const playSound = (type: SoundEffectType, volumeMultiplier = 1): void => {
  audioEngine.play(type, volumeMultiplier)
}

export const isSoundMuted = (): boolean => audioEngine.isMuted()
export const setSoundMuted = (muted: boolean): void => audioEngine.setMuted(muted)
export const toggleSoundMuted = (): boolean => audioEngine.toggleMute()
export const getSoundVolume = (): number => audioEngine.getVolume()
export const setSoundVolume = (volume: number): void => audioEngine.setVolume(volume)
