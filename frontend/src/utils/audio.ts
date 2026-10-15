/**
 * Web Audio API Synthesizer & Speech Engine for CodeAbroad
 * Provides Duolingo-grade tactile sound effects (pops, chimes, coin jingles)
 * completely synthesized on the fly (0 external MP3 files required).
 */

const STORAGE_KEY = 'codeabroad_sound_muted'

class SoundEngine {
  private ctx: AudioContext | null = null
  private muted: boolean = false

  constructor() {
    if (typeof window !== 'undefined') {
      this.muted = localStorage.getItem(STORAGE_KEY) === 'true'
    }
  }

  /**
   * Lazily initializes or resumes the AudioContext upon user gesture.
   */
  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {})
    }
    return this.ctx
  }

  public isMuted(): boolean {
    return this.muted
  }

  public setMuted(muted: boolean): void {
    this.muted = muted
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, String(muted))
      window.dispatchEvent(new CustomEvent('codeabroad_sound_toggle', { detail: { muted } }))
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.muted)
    return this.muted
  }

  /**
   * playPop: Tactile bubble pop when pressing buttons or nodes.
   */
  public playPop(): void {
    if (this.muted) return
    const ctx = this.getContext()
    if (!ctx) return

    try {
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      // Frequency drop for rich tactile 'plop'
      osc.frequency.setValueAtTime(260, now)
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.07)

      gain.gain.setValueAtTime(0.18, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.08)
    } catch {
      // Ignored if audio device unavailable
    }
  }

  /**
   * playSuccess: Melodic arpeggio fanfare (C5, E5, G5, C6) when tests pass or quest is completed.
   */
  public playSuccess(): void {
    if (this.muted) return
    const ctx = this.getContext()
    if (!ctx) return

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
      const noteDelay = 0.07
      const startTime = ctx.currentTime

      notes.forEach((freq, index) => {
        const noteStart = startTime + index * noteDelay
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, noteStart)

        const duration = index === notes.length - 1 ? 0.35 : 0.18
        gain.gain.setValueAtTime(0.16, noteStart)
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + duration)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(noteStart)
        osc.stop(noteStart + duration)
      })
    } catch {
      // Ignored
    }
  }

  /**
   * playFanfare: Alias for playSuccess to celebrate quest completions.
   */
  public playFanfare(): void {
    this.playSuccess()
  }

  /**
   * playChestClaim: Sparkling metallic coin chime when opening chests (+50 XP).
   */
  public playChestClaim(): void {
    if (this.muted) return
    const ctx = this.getContext()
    if (!ctx) return

    try {
      const freqs = [880, 1174.66, 1760, 2093] // A5, D6, A6, C7
      const startTime = ctx.currentTime

      freqs.forEach((freq, idx) => {
        const noteStart = startTime + idx * 0.05
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, noteStart)

        gain.gain.setValueAtTime(0.2, noteStart)
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.3)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(noteStart)
        osc.stop(noteStart + 0.32)
      })
    } catch {
      // Ignored
    }
  }

  /**
   * playRewardClaim: Alias for playChestClaim when claiming rewards/chests.
   */
  public playRewardClaim(): void {
    this.playChestClaim()
  }

  /**
   * playStreakFlame: Ascending warm whoosh when streak increases.
   */
  public playStreakFlame(): void {
    if (this.muted) return
    const ctx = this.getContext()
    if (!ctx) return

    try {
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(200, now)
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.22)

      gain.gain.setValueAtTime(0.01, now)
      gain.gain.linearRampToValueAtTime(0.15, now + 0.1)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.26)
    } catch {
      // Ignored
    }
  }

  /**
   * playError: Soft double-thud when tests fail or invalid code submitted.
   */
  public playError(): void {
    if (this.muted) return
    const ctx = this.getContext()
    if (!ctx) return

    try {
      const startTime = ctx.currentTime
      ;[140, 110].forEach((freq, idx) => {
        const noteStart = startTime + idx * 0.11
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, noteStart)

        gain.gain.setValueAtTime(0.15, noteStart)
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.1)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(noteStart)
        osc.stop(noteStart + 0.12)
      })
    } catch {
      // Ignored
    }
  }

  /**
   * speakJapanese: Speaks text using native Web Speech Synthesis with ja-JP voice.
   */
  public speakJapanese(text: string, onEnd?: () => void, onError?: () => void): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onEnd?.()
      return
    }

    try {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'ja-JP'
      utterance.rate = 0.88
      utterance.pitch = 1.05

      // Attempt to find dedicated Japanese voice
      const voices = window.speechSynthesis.getVoices()
      const jaVoice = voices.find((v) => v.lang.startsWith('ja') || v.lang.includes('JP'))
      if (jaVoice) {
        utterance.voice = jaVoice
      }

      utterance.onend = () => onEnd?.()
      utterance.onerror = () => onError?.()

      window.speechSynthesis.speak(utterance)
    } catch {
      onError?.()
    }
  }
}

export const audioEngine = new SoundEngine()
export const soundEngine = audioEngine
