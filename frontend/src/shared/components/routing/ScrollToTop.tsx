import { useEffect, useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

const MAX_HASH_RETRY_FRAMES = 15

function decodeHashTarget(hash: string): string {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash
  try {
    return decodeURIComponent(raw)
  } catch {
    return raw
  }
}

/**
 * Resets window scroll to the top on route pathname changes while preserving
 * same-page query param updates and smooth-scrolling to `#hash` anchors.
 */
export const ScrollToTop = (): null => {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (typeof window === 'undefined' || !('scrollRestoration' in window.history)) {
      return undefined
    }
    const previous = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    return () => {
      window.history.scrollRestoration = previous
    }
  }, [])

  useLayoutEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return undefined
    }

    if (hash && hash.length > 1) {
      const targetId = decodeHashTarget(hash)
      let frameId = 0
      let attempts = 0

      const scrollToHashTarget = () => {
        const target = document.getElementById(targetId)
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
          return
        }
        attempts += 1
        if (attempts < MAX_HASH_RETRY_FRAMES) {
          frameId = window.requestAnimationFrame(scrollToHashTarget)
        }
      }

      const immediateTarget = document.getElementById(targetId)
      if (immediateTarget) {
        immediateTarget.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        frameId = window.requestAnimationFrame(scrollToHashTarget)
      }

      return () => {
        if (frameId !== 0) {
          window.cancelAnimationFrame(frameId)
        }
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    return undefined
  }, [pathname, hash])

  return null
}
