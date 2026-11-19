import type { FC, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { CaretRight, House } from '@phosphor-icons/react'
import { triggerHaptic } from '@/shared/utils/haptics'

export interface BreadcrumbItem {
  label: string
  to?: string
}

export interface AppBreadcrumbProps {
  items: BreadcrumbItem[]
  rightSlot?: ReactNode
  className?: string
}

/**
 * Unified accessible breadcrumb trail (SSOT across primary app pages).
 */
export const AppBreadcrumb: FC<AppBreadcrumbProps> = ({
  items,
  rightSlot,
  className = '',
}) => {
  if (items.length === 0 && !rightSlot) return null

  return (
    <div className={`flex items-center justify-between gap-3 flex-wrap min-w-0 ${className}`}>
      <nav aria-label="Breadcrumb" className="min-w-0">
        <ol className="flex items-center flex-wrap gap-1.5 text-xs font-brand font-bold text-slate-500">
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1
            const isHome = idx === 0

            return (
              <li key={`${item.label}-${idx}`} className="inline-flex items-center gap-1.5 min-w-0">
                {idx > 0 && (
                  <CaretRight weight="bold" className="w-3 h-3 text-slate-400 shrink-0" />
                )}
                {item.to && !isLast ? (
                  <Link
                    to={item.to}
                    onClick={() => triggerHaptic('tap')}
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-blue-600 transition-colors truncate max-w-[160px] sm:max-w-[240px]"
                  >
                    {isHome && <House weight="bold" className="w-3.5 h-3.5 shrink-0" />}
                    <span className="truncate">{item.label}</span>
                  </Link>
                ) : (
                  <span
                    aria-current={isLast ? 'page' : undefined}
                    className={`truncate max-w-[200px] sm:max-w-sm ${
                      isLast
                        ? 'px-2 py-0.5 rounded-lg bg-slate-100 text-slate-900 font-black'
                        : 'text-slate-600'
                    }`}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </nav>

      {rightSlot && <div className="shrink-0">{rightSlot}</div>}
    </div>
  )
}
