import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { X } from 'lucide-react'

export interface Modal3DProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

/**
 * Modal3D — Tactile Clean Light Mode modal dialog.
 * Features rounded-3xl geometry, crisp 2px border, soft atmospheric backdrop,
 * and seamless keyboard accessibility (ESC to close).
 */
export const Modal3D = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'md',
  className = '',
}: Modal3DProps) => {
  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }[maxWidth]

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200"
    >
      {/* Click outside to close backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card Stage */}
      <div
        className={`relative w-full ${maxWidthClasses} bg-white border-2 border-slate-200/90 rounded-3xl shadow-[0_25px_50px_-12px_rgba(15,23,42,0.18)] p-6 sm:p-7 z-10 animate-in zoom-in-95 duration-200 ${className}`}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-2xl border-2 border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          aria-label="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        {(title || subtitle) && (
          <div className="mb-4 pr-8 text-left">
            {title && (
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed font-normal">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Modal Body */}
        <div className="text-slate-700 text-sm leading-relaxed">{children}</div>

        {/* Modal Footer Actions */}
        {footer && <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">{footer}</div>}
      </div>
    </div>
  )
}
