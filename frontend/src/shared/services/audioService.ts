/**
 * [DOMAIN: AUDIO SERVICE & SOUNDSCAPE SYNTHESIZER]
 * Hardware & Web Audio API synthesizer driver for CodeAbroad.
 * Generates 100% royalty-free, mathematical background ambient soundscapes (Lo-Fi focus & Tokyo Zen)
 * and Duolingo-grade tactile sound effects without requiring any external MP3 files.
 */

import {
  SOUND_PRESETS,
  DEFAULT_MASTER_VOLUME,
  DEFAULT_BGM_VOLUME,
  UNIVERSAL_SOUNDSCAPE_CHORDS,
  JAPAN_SOUNDSCAPE_SCALE,
  type SoundEffectType,
  type SoundscapeTrack,
  type AudioPlaybackMode,
} from "@/shared/tokens/soundTokens"

export type { SoundEffectType, SoundscapeTrack, AudioPlaybackMode }

/**
 * Procedural BGM Soundscape Synthesizer.
 * Generates continuous mathematical ambient soundscapes for deep focus coding.
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
    if (this.ctx.state !== 'closed') {
      this.bgmGain.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime)
    }
  }

  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }
}

/**
 * AudioService (Driver Layer)
 * Manages Web Audio API context, master routing, and audio unlocking.
 */
class AudioService {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private soundscape: SoundscapePlayer | null = null

  private mode: AudioPlaybackMode = 'all'
  private masterVolume: number = DEFAULT_MASTER_VOLUME
  private bgmVolume: number = DEFAULT_BGM_VOLUME
  private activeSoundscapeTrack: SoundscapeTrack = 'universal'
  private isUnlocked: boolean = false

  constructor() {
    this.setupAutoUnlock()
  }

  /**
   * Registers one-time user interaction listener to unblock browser autoplay restrictions.
   */
  private setupAutoUnlock(): void {
    if (typeof window === 'undefined') return

    const unlockHandler = () => {
      void this.unlock()
      window.removeEventListener('pointerdown', unlockHandler)
      window.removeEventListener('keydown', unlockHandler)
    }

    window.addEventListener('pointerdown', unlockHandler, { once: true, passive: true })
    window.addEventListener('keydown', unlockHandler, { once: true, passive: true })
  }

  /**
   * Lazily initializes and resumes the Web Audio Context on user gesture.
   */
  public async unlock(): Promise<void> {
    const ctx = this.getContext()
    if (ctx && ctx.state === 'suspended') {
      try {
        await ctx.resume()
        this.isUnlocked = true
        if (this.mode === 'all') {
          this.playBgm(this.activeSoundscapeTrack)
        }
      } catch {
        // Ignored if user has not interacted with document yet
      }
    } else if (ctx && ctx.state === 'running') {
      this.isUnlocked = true
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
      void this.ctx.resume().catch(() => {})
    }

    return this.ctx
  }

  /**
   * Plays a Duolingo-grade procedural tactile sound effect.
   */
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

  /**
   * Starts ambient background soundscape (Lo-Fi or Tokyo Zen).
   */
  public playBgm(track: SoundscapeTrack = 'universal'): void {
    this.activeSoundscapeTrack = track
    if (this.mode !== 'all') return

    const ctx = this.getContext()
    if (!ctx || !this.soundscape) return

    this.soundscape.start(track)
  }

  /**
   * Stops ambient background soundscape.
   */
  public stopBgm(): void {
    if (this.soundscape) {
      this.soundscape.stop()
    }
  }

  /**
   * Updates playback mode ('all' | 'sfx_only' | 'muted').
   */
  public setMode(mode: AudioPlaybackMode): void {
    this.mode = mode

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
  }

  public setMasterVolume(vol: number): void {
    this.masterVolume = Math.max(0, Math.min(1, vol))
    if (this.ctx && this.masterGain && this.mode !== 'muted') {
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime)
    }
  }

  public setBgmVolume(vol: number): void {
    this.bgmVolume = Math.max(0, Math.min(1, vol))
    if (this.soundscape) {
      this.soundscape.setVolume(this.bgmVolume)
    }
  }

  public getIsUnlocked(): boolean {
    return this.isUnlocked
  }

  // ── Tactile Convenience API Aliases ──
  public playPop(): void {
    this.play('node_tap')
  }

  public playSuccess(): void {
    this.play('quest_start')
  }

  public playLevelUp(): void {
    this.play('trophy_tap')
  }

  public playError(): void {
    this.play('node_locked')
  }

  public playWhoosh(): void {
    this.play('track_change')
  }

  public playCoinJingle(): void {
    this.play('gem_collect')
  }

  public playChestClaim(): void {
    this.play('gem_collect')
  }

  public playRewardClaim(): void {
    this.play('gem_collect')
  }

  public playStreakFlame(): void {
    this.play('streak_ignite')
  }

  public playFanfare(): void {
    this.play('quest_complete')
  }

  /**
   * Synthesizes language pronunciation via Web Speech API.
   */
  public speakLanguage(
    text: string,
    lang = 'ja-JP',
    onEnd?: () => void,
    onError?: () => void
  ): void {
    if (
      typeof window === 'undefined' ||
      !('speechSynthesis' in window) ||
      this.mode === 'muted'
    ) {
      onEnd?.()
      return
    }

    try {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang
      utterance.rate = 0.88
      utterance.pitch = 1.05

      const voices = window.speechSynthesis.getVoices()
      const langPrefix = lang.split('-')[0].toLowerCase()
      const matchedVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith(langPrefix) ||
          v.lang.toLowerCase().includes(lang.toLowerCase())
      )
      if (matchedVoice) {
        utterance.voice = matchedVoice
      }

      utterance.onend = () => onEnd?.()
      utterance.onerror = () => onError?.()

      window.speechSynthesis.speak(utterance)
    } catch {
      onError?.()
    }
  }

  public speakJapanese(text: string, onEnd?: () => void, onError?: () => void): void {
    this.speakLanguage(text, 'ja-JP', onEnd, onError)
  }

  public playSpeech(text: string, lang = 'ja-JP'): void {
    this.speakLanguage(text, lang)
  }
}

export const audioService = new AudioService()
