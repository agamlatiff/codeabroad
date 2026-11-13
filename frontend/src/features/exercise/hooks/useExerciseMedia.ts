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

  const speechRecognitionSupported = useMemo(
    () => getSpeechRecognitionConstructor() !== null,
    []
  )

  const stopActiveAudio = useCallback(() => {
    if (activeHtmlAudioRef.current) {
      activeHtmlAudioRef.current.pause()
      activeHtmlAudioRef.current = null
    }
    audioEngine.stopSpeech()
    setIsSpeakingAudio(false)
  }, [])

  const stopMediaSession = useCallback(() => {
    recognitionRef.current?.stop()
    stopActiveAudio()
    setIsRecordingSpeech(false)
    setAudioPlaybackError(null)
  }, [stopActiveAudio])

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop()
      stopActiveAudio()
    }
  }, [stopActiveAudio])

  const handlePlayAudio = useCallback(
    (audioUrl?: string, spokenText?: string) => {
      setAudioPlaybackError(null)
      triggerHaptic('tap')
      stopActiveAudio()
      setIsSpeakingAudio(true)

      const speakFallback = () => {
        if (!spokenText) {
          setIsSpeakingAudio(false)
          setAudioPlaybackError('Teks audio tidak tersedia untuk latihan ini.')
          return
        }
        audioEngine.speakLanguage(
          spokenText,
          speechLocale,
          () => setIsSpeakingAudio(false),
          () => {
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
          if (fallbackTriggered) return
          fallbackTriggered = true
          speakFallback()
        }

        const audio = new Audio(audioUrl)
        activeHtmlAudioRef.current = audio
        audio.onended = () => setIsSpeakingAudio(false)
        audio.onerror = triggerFallbackOnce
        void audio.play().catch(triggerFallbackOnce)
        return
      }

      speakFallback()
    },
    [speechLocale, stopActiveAudio]
  )

  const handleToggleRecording = useCallback(() => {
    if (isLocked) return

    if (isRecordingSpeech && recognitionRef.current) {
      recognitionRef.current.stop()
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
      setAudioPlaybackError(null)
      const recognition = new RecognitionCtor()
      recognition.lang = speechLocale
      recognition.interimResults = false
      recognition.maxAlternatives = 1

      recognition.onresult = (event: BrowserSpeechRecognitionEvent) => {
        const transcript = event.results[0]?.[0]?.transcript?.trim() ?? ''
        if (transcript) {
          onTranscript(transcript)
        }
      }
      recognition.onerror = () => {
        setIsRecordingSpeech(false)
        setAudioPlaybackError(
          'Mikrofon gagal menangkap suara. Coba ulangi atau ketik manual.'
        )
      }
      recognition.onend = () => {
        setIsRecordingSpeech(false)
      }

      recognitionRef.current = recognition
      setIsRecordingSpeech(true)
      recognition.start()
      triggerHaptic('tap')
    } catch {
      setIsRecordingSpeech(false)
    }
  }, [isLocked, isRecordingSpeech, onTranscript, speechLocale])

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

