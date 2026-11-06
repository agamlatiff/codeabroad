import {
  SOUND_PRESETS,
  SOUND_STORAGE_KEYS,
  DEFAULT_MASTER_VOLUME,
  DEFAULT_BGM_VOLUME,
  UNIVERSAL_SOUNDSCAPE_CHORDS,
  JAPAN_SOUNDSCAPE_SCALE,
  type SoundEffectType,
  type SoundscapeTrack,
  type AudioPlaybackMode,
} from '../tokens/soundTokens'

export type { SoundEffectType, SoundscapeTrack, AudioPlaybackMode }

/**
 * Procedural BGM Soundscape Synthesizer.
 * Generates 100% royalty-free, mathematical background ambient soundscapes
 * for deep focus learning and cultural immersion.
 */
class SoundscapePlayer {
  private ctx: AudioContext
  private bgmGain: GainNode
  private track: SoundscapeTrack = 'universal'
  private intervalId: ReturnType<typeof setInterval> | null = null
  private chordIndex = 0

  constructor(ctx: AudioContext, destination: AudioNode, volume: number) {
    this.ctx = ctx
    this.bgmGain = ctx.createGain()
    this.bgmGain.gain.setValueAtTime(volume, ctx.currentTime)
    this.bgmGain.connect(destination)
  }

  public start(track: SoundscapeTrack) {
    this.stop()
    this.track = track
    this.playCycle()

    // Universal chill chords cycle every 6.5s; Japan zen koto cycles every 4.2s
    const intervalMs = track === 'japan' ? 4200 : 6500
    this.intervalId = setInterval(() => {
      this.playCycle()
    }, intervalMs)
  }

  private playCycle() {
    if (this.ctx.state === 'suspended') return

    if (this.track === 'japan') {
      this.playJapanNote()
    } else {
      this.playUniversalChord()
    }
  }

  /**
   * Universal Track: Ambient Lo-Fi 7th chords with warm analog low-pass filter.
   */
  private playUniversalChord() {
    const chords = UNIVERSAL_SOUNDSCAPE_CHORDS
    const chord = chords[this.chordIndex % chords.length]
    this.chordIndex++

    const now = this.ctx.currentTime
    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(420, now)

    const chordGain = this.ctx.createGain()
    chordGain.gain.setValueAtTime(0.0001, now)
    chordGain.gain.linearRampToValueAtTime(0.035, now + 1.6) // Breathing swell
    chordGain.gain.exponentialRampToValueAtTime(0.0001, now + 6.2) // Smooth tail

    filter.connect(chordGain)
    chordGain.connect(this.bgmGain)

    for (const freq of chord) {
      const osc = this.ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now)
      osc.connect(filter)
      osc.start(now)
      osc.stop(now + 6.2)
    }
  }

  /**
   * Japan Track: Meditative traditional Insen/Yo pentatonic scale (Koto & temple chime).
   */
  private playJapanNote() {
    const scale = JAPAN_SOUNDSCAPE_SCALE
    const now = this.ctx.currentTime

    // Pluck 2 harmonious pentatonic notes with gentle delay
    const note1 = scale[Math.floor(Math.random() * scale.length)]
    const note2 = scale[Math.floor(Math.random() * scale.length)]

    const notes = [
      { freq: note1, delay: 0 },
      { freq: note2, delay: 0.32 },
    ]

    for (const n of notes) {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'triangle' // Crisp plucked koto harmonic
      osc.frequency.setValueAtTime(n.freq, now + n.delay)

      gain.gain.setValueAtTime(0.0001, now + n.delay)
      gain.gain.linearRampToValueAtTime(0.05, now + n.delay + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + n.delay + 2.8)

      osc.connect(gain)
      gain.connect(this.bgmGain)

      osc.start(now + n.delay)
      osc.stop(now + n.delay + 2.8)
    }
  }

  public setVolume(vol: number) {
    this.bgmGain.gain.setValueAtTime(vol, this.ctx.currentTime)
  }

  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }
}

class AudioEngine {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private soundscape: SoundscapePlayer | null = null

  private mode: AudioPlaybackMode = 'all'
  private masterVolume: number = DEFAULT_MASTER_VOLUME
  private bgmVolume: number = DEFAULT_BGM_VOLUME
  private activeSoundscapeTrack: SoundscapeTrack = 'universal'
  private modeListeners: Set<(mode: AudioPlaybackMode) => void> = new Set()

  constructor() {
    this.restoreSettings()
  }

  private restoreSettings() {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return
    try {
      const storedMode = localStorage.getItem(SOUND_STORAGE_KEYS.audioMode) as AudioPlaybackMode | null
      if (storedMode === 'all' || storedMode === 'sfx_only' || storedMode === 'muted') {
        this.mode = storedMode
      } else {
        // Backwards compatibility with previous boolean muted key
        const storedMuted = localStorage.getItem(SOUND_STORAGE_KEYS.muted)
        if (storedMuted === 'true') {
          this.mode = 'muted'
        }
      }

      const storedVol = localStorage.getItem(SOUND_STORAGE_KEYS.volume)
      if (storedVol !== null) {
        const parsed = parseFloat(storedVol)
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
          this.masterVolume = parsed
        }
      }
    } catch {
      // Ignored
    }
  }

  private persistSettings() {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return
    try {
      localStorage.setItem(SOUND_STORAGE_KEYS.audioMode, this.mode)
      localStorage.setItem(SOUND_STORAGE_KEYS.muted, String(this.mode === 'muted'))
      localStorage.setItem(SOUND_STORAGE_KEYS.volume, String(this.masterVolume))
    } catch {
      // Ignored
    }
  }

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
        this.mode === 'muted' ? 0 : this.masterVolume,
        this.ctx.currentTime
      )
      this.masterGain.connect(this.ctx.destination)

      this.soundscape = new SoundscapePlayer(this.ctx, this.masterGain, this.bgmVolume)
    }

    if (this.ctx.state === 'suspended') {
      void this.ctx.resume()
    }

    return this.ctx
  }

  public play(type: SoundEffectType, volumeMultiplier = 1): void {
    if (this.mode === 'muted') return

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
            osc.frequency.exponentialRampToValueAtTime(
              Math.max(step.targetFreq, 0.01),
              stopTime
            )
          }
        }

        const peakGain = Math.max(step.gain * config.volume * volumeMultiplier, 0.0001)
        gain.gain.setValueAtTime(0.0001, startTime)
        gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.008)
        gain.gain.exponentialRampToValueAtTime(0.0001, stopTime)

        osc.connect(gain)
        gain.connect(this.masterGain)

        osc.start(startTime)
        osc.stop(stopTime)
      } catch {
        // Graceful failover
      }
    }
  }

  public playBgm(track: SoundscapeTrack = 'universal'): void {
    this.activeSoundscapeTrack = track
    if (this.mode !== 'all') return

    const ctx = this.getContext()
    if (!ctx || !this.soundscape) return

    this.soundscape.start(track)
  }

  public stopBgm(): void {
    if (this.soundscape) {
      this.soundscape.stop()
    }
  }

  public getAudioMode(): AudioPlaybackMode {
    return this.mode
  }

  public setAudioMode(mode: AudioPlaybackMode): void {
    this.mode = mode
    this.persistSettings()

    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setValueAtTime(
        mode === 'muted' ? 0 : this.masterVolume,
        this.ctx.currentTime
      )
    }

    if (mode === 'all') {
      this.playBgm(this.activeSoundscapeTrack)
    } else {
      this.stopBgm()
    }

    this.modeListeners.forEach((fn) => fn(mode))
  }

  public cycleAudioMode(): AudioPlaybackMode {
    const nextMode: AudioPlaybackMode =
      this.mode === 'all' ? 'sfx_only' : this.mode === 'sfx_only' ? 'muted' : 'all'

    this.setAudioMode(nextMode)
    if (nextMode !== 'muted') {
      this.play('node_tap')
    }
    return nextMode
  }

  public subscribeMode(listener: (mode: AudioPlaybackMode) => void): () => void {
    this.modeListeners.add(listener)
    return () => {
      this.modeListeners.delete(listener)
    }
  }

  public isMuted(): boolean {
    return this.mode === 'muted'
  }

  public toggleMute(): boolean {
    const nextMode: AudioPlaybackMode = this.mode === 'muted' ? 'all' : 'muted'
    this.setAudioMode(nextMode)
    return this.mode === 'muted'
  }
}

// Global audio singleton
const audioEngine = new AudioEngine()

export const playSound = (type: SoundEffectType, volumeMultiplier = 1): void => {
  audioEngine.play(type, volumeMultiplier)
}

export const playBgm = (track: SoundscapeTrack = 'universal'): void => {
  audioEngine.playBgm(track)
}

export const stopBgm = (): void => {
  audioEngine.stopBgm()
}

export const getAudioMode = (): AudioPlaybackMode => audioEngine.getAudioMode()
export const setAudioMode = (mode: AudioPlaybackMode): void => audioEngine.setAudioMode(mode)
export const cycleAudioMode = (): AudioPlaybackMode => audioEngine.cycleAudioMode()
export const isSoundMuted = (): boolean => audioEngine.isMuted()
export const toggleSoundMuted = (): boolean => audioEngine.toggleMute()
export const subscribeAudioMode = (listener: (mode: AudioPlaybackMode) => void) =>
  audioEngine.subscribeMode(listener)
