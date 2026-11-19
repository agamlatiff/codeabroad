import type { FC } from 'react'
import { CaretDown, Funnel, MagnifyingGlass, X } from '@phosphor-icons/react'
import { triggerHaptic } from '@/shared/utils/haptics'

export interface FilterLevelOption {
  value: string
  label: string
  count?: number
}

export interface FilterCategoryOption {
  value: string
  label: string
}

export interface FilterToolbarProps {
  levelOptions: FilterLevelOption[]
  selectedLevel: string
  onSelectLevel: (value: string) => void
  categoryOptions?: FilterCategoryOption[]
  selectedCategory?: string
  onSelectCategory?: (value: string) => void
  searchValue: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  className?: string
}

/**
 * Compact 1-row Filter Toolbar SSOT combining a unified JLPT segmented control,
 * optional compact category dropdown, and aligned search input.
 */
export const FilterToolbar: FC<FilterToolbarProps> = ({
  levelOptions,
  selectedLevel,
  onSelectLevel,
  categoryOptions,
  selectedCategory = 'ALL',
  onSelectCategory,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Cari materi...',
  className = '',
}) => {
  return (
    <section
      aria-label="Filter dan pencarian"
      className={`flex flex-col lg:flex-row lg:items-center justify-between gap-3 ${className}`}
    >
      <div className="flex flex-wrap items-center gap-2.5 min-w-0">
        {/* Segmented Control for JLPT Levels */}
        <div
          role="group"
          aria-label="Filter level"
          className="inline-flex flex-wrap items-center gap-1 p-1 rounded-2xl bg-slate-100/90 border border-slate-200/80 shadow-inner"
        >
          {levelOptions.map((opt) => {
            const active = selectedLevel === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  triggerHaptic('tap')
                  onSelectLevel(opt.value)
                }}
                className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-brand font-black transition-all cursor-pointer active:translate-y-0.5 ${
                  active
                    ? 'bg-[#2563EB] text-white shadow-[0_2px_0_0_#1D4ED8]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                }`}
              >
                <span>{opt.label}</span>
                {typeof opt.count === 'number' && (
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] leading-none ${
                      active ? 'bg-white/20 text-white' : 'bg-white text-slate-500 border border-slate-200/70'
                    }`}
                  >
                    {opt.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Optional Compact Category Dropdown */}
        {categoryOptions && categoryOptions.length > 0 && onSelectCategory && (
          <div className="relative inline-flex items-center">
            <Funnel
              weight="bold"
              className="w-3.5 h-3.5 text-slate-500 absolute left-3 pointer-events-none"
            />
            <select
              aria-label="Filter kategori"
              value={selectedCategory}
              onChange={(e) => {
                triggerHaptic('tap')
                onSelectCategory(e.target.value)
              }}
              className="appearance-none pl-8 pr-8 py-2 rounded-2xl bg-white border-2 border-slate-200/90 hover:border-slate-300 focus:border-[#2563EB] outline-none text-xs font-brand font-black text-slate-700 cursor-pointer transition-colors shadow-[0_2px_0_0_#E2E8F0]"
            >
              {categoryOptions.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <CaretDown
              weight="bold"
              className="w-3.5 h-3.5 text-slate-500 absolute right-3 pointer-events-none"
            />
          </div>
        )}
      </div>

      {/* Aligned Search Input */}
      <div className="relative w-full lg:w-72 xl:w-80 shrink-0">
        <MagnifyingGlass
          weight="bold"
          className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
        />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full pl-10 pr-9 py-2 rounded-2xl bg-white border-2 border-slate-200/90 focus:border-[#2563EB] outline-none text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 transition-colors shadow-2xs"
        />
        {searchValue && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="Hapus pencarian"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg hover:bg-slate-100 text-slate-400 flex items-center justify-center cursor-pointer"
          >
            <X weight="bold" className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </section>
  )
}
