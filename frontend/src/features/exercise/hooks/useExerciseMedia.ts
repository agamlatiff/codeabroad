import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { audioEngine } from '@/shared/utils/audio'
import { triggerHaptic } from '@/shared/utils/haptics'

interface BrowserSpeechRecognitionAlternative {
  transcript: string
}

interface BrowserSpeechRecognitionResult {
  [index: number]: BrowserSpeechRecognitionAlternative | undefined
}

interface BrowserSpeechRecognitionEvent {
  results: {
    [index: number]: BrowserSpeechRecognitionResult | undefined
  }
}

interface BrowserSpeechRecognition {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  onresult: ((event: BrowserSpeechRecognitionEvent) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

type SpeechRecognitionConstructor = new () => BrowserSpeechRecognition

const getSpeechRecognitionConstructor = (): SpeechRecognitionConstructor | null => {
  if (typeof window === 'undefined') return null
  const win = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
  return win.SpeechRecognition ?? win.webkitSpeechRecognition ?? null
}

interface UseExerciseMediaOptions {
  speechLocale: string
  isLocked: boolean
  onTranscript: (transcript: string) => void
}

/**
 * Headless controller hook managing lesson exercise audio playback, TTS fallback,
 * and browser SpeechRecognition capture with leak-free cleanup.
 */
export const useExerciseMedia = ({
  speechLocale,
  isLocked,
  onTranscript,
}: UseExerciseMediaOptions) => {
  const [isSpeakingAudio, setIsSpeakingAudio] = useState(false)
  const [isRecordingSpeech, setIsRecordingSpeech] = useState(false)
  const [audioPlaybackError, setAudioPlaybackError] = useState<string | null>(null)

  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null)
  const activeHtmlAudioRef = useRef<HTMLAudioElement | null>(null)
  const audioSessionIdRef = useRef(0)
  const speechSessionIdRef = useRef(0)
  const isLockedRef = useRef(isLocked)
  const onTranscriptRef = useRef(onTranscript)

  useEffect(() => {
    isLockedRef.current = isLocked
  }, [isLocked])

  useEffect(() => {
    onTranscriptRef.current = onTranscript
  }, [onTranscript])

  const speechRecognitionSupported = useMemo(
    () => getSpeechRecognitionConstructor() !== null,
    []
  )

  const stopActiveAudio = useCallback(() => {
    audioSessionIdRef.current += 1
    const activeAudio = activeHtmlAudioRef.current
    if (activeAudio) {
      activeAudio.onended = null
      activeAudio.onerror = null
      activeAudio.pause()
      activeHtmlAudioRef.current = null
    }
    audioEngine.stopSpeech()
    setIsSpeakingAudio(false)
  }, [])

  const stopActiveRecognition = useCallback(() => {
    speechSessionIdRef.current += 1
    const recognition = recognitionRef.current
    if (recognition) {
      recognition.onresult = null
      recognition.onerror = null
      recognition.onend = null
      try {
        recognition.stop()
      } catch {
        // Ignore browser errors when stopping an already terminated session
      }
      recognitionRef.current = null
    }
  }, [])

  const stopMediaSession = useCallback(() => {
    stopActiveRecognition()
    stopActiveAudio()
    setIsRecordingSpeech(false)
    setAudioPlaybackError(null)
  }, [stopActiveAudio, stopActiveRecognition])

  useEffect(() => {
    if (isLocked) {
      stopActiveRecognition()
    }
  }, [isLocked, stopActiveRecognition])

  useEffect(() => {
    return () => {
      stopActiveRecognition()
      stopActiveAudio()
    }
  }, [stopActiveAudio, stopActiveRecognition])

  const handlePlayAudio = useCallback(
    (audioUrl?: string, spokenText?: string) => {
      setAudioPlaybackError(null)
      triggerHaptic('tap')
      stopActiveAudio()
      const sessionId = audioSessionIdRef.current
      setIsSpeakingAudio(true)

      const speakFallback = () => {
        if (sessionId !== audioSessionIdRef.current) return
        if (!spokenText) {
          setIsSpeakingAudio(false)
          setAudioPlaybackError('Teks audio tidak tersedia untuk latihan ini.')
          return
        }
        audioEngine.speakLanguage(
          spokenText,
          speechLocale,
          () => {
            if (sessionId === audioSessionIdRef.current) {
              setIsSpeakingAudio(false)
            }
          },
          () => {
            if (sessionId !== audioSessionIdRef.current) return
            setIsSpeakingAudio(false)
            setAudioPlaybackError(
              'Audio speaker tidak didukung browser ini, silakan baca transkripnya.'
            )
          }
        )
      }

      if (audioUrl && typeof Audio !== 'undefined') {
        let fallbackTriggered = false
        const triggerFallbackOnce = () => {
          if (fallbackTriggered || sessionId !== audioSessionIdRef.current) return
          fallbackTriggered = true
          speakFallback()
        }

        const audio = new Audio(audioUrl)
        activeHtmlAudioRef.current = audio
        audio.onended = () => {
          if (sessionId === audioSessionIdRef.current) {
            setIsSpeakingAudio(false)
          }
        }
        audio.onerror = triggerFallbackOnce
        void audio.play().catch(triggerFallbackOnce)
        return
      }

      speakFallback()
    },
    [speechLocale, stopActiveAudio]
  )

  const handleToggleRecording = useCallback(() => {
    if (isLockedRef.current) return

    if (isRecordingSpeech && recognitionRef.current) {
      stopActiveRecognition()
      setIsRecordingSpeech(false)
      return
    }

    const RecognitionCtor = getSpeechRecognitionConstructor()
    if (!RecognitionCtor) {
      setAudioPlaybackError(
        'Pengenalan suara browser tidak tersedia. Ketik atau konfirmasi pelafalan secara manual.'
      )
      return
    }

    try {
      stopActiveRecognition()
      const sessionId = speechSessionIdRef.current
      setAudioPlaybackError(null)
      const recognition = new RecognitionCtor()
      recognition.lang = speechLocale
      recognition.interimResults = false
      recognition.maxAlternatives = 1

      recognition.onresult = (event: BrowserSpeechRecognitionEvent) => {
        if (sessionId !== speechSessionIdRef.current || isLockedRef.current) return
        const transcript = event.results[0]?.[0]?.transcript?.trim() ?? ''
        if (transcript) {
          onTranscriptRef.current(transcript)
        }
      }
      recognition.onerror = () => {
        if (sessionId !== speechSessionIdRef.current) return
        setIsRecordingSpeech(false)
        setAudioPlaybackError(
          'Mikrofon gagal menangkap suara. Coba ulangi atau ketik manual.'
        )
      }
      recognition.onend = () => {
        if (sessionId !== speechSessionIdRef.current) return
        setIsRecordingSpeech(false)
      }

      recognitionRef.current = recognition
      setIsRecordingSpeech(true)
      recognition.start()
      triggerHaptic('tap')
    } catch {
      setIsRecordingSpeech(false)
    }
  }, [isRecordingSpeech, speechLocale, stopActiveRecognition])

  return {
    isSpeakingAudio,
    isRecordingSpeech,
    speechRecognitionSupported,
    audioPlaybackError,
    stopMediaSession,
    handlePlayAudio,
    handleToggleRecording,
  }
}

