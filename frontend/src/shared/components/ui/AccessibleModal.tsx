import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'

export interface AccessibleModalProps {
  isOpen: boolean
  onClose: () => void
  ariaLabel: string
  children: ReactNode
  backdropClassName?: string
}

/**
 * Shared accessible modal portal with ARIA semantics, Escape-to-close,
 * backdrop dismiss, and document scroll lock.
 */
export const AccessibleModal = ({
  isOpen,
  onClose,
  ariaLabel,
  children,
  backdropClassName = 'bg-slate-900/40 backdrop-blur-xs',
}: AccessibleModalProps) => {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen || typeof document === 'undefined') return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      className={`fixed inset-0 z-50 w-screen h-screen flex items-center justify-center p-3 sm:p-4 animate-fade-in ${backdropClassName}`}
    >
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative z-10 w-full flex justify-center pointer-events-none">
        <div className="pointer-events-auto w-full flex justify-center">{children}</div>
      </div>
    </div>,
    document.body
  )
}
