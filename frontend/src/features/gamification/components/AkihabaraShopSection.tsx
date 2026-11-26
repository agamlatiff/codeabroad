import { useEffect, useId, useState } from 'react'
import {
  FileText,
  Lightning,
  Microphone,
  Snowflake,
  Storefront,
} from '@phosphor-icons/react'
import { Button3D } from "@/shared/components/ui/Button3D"
import { GemIcon } from "@/shared/components/ui/GamificationIcons"
import { triggerHaptic } from "@/shared/utils/haptics"
import type { ShopCategoryFilter, ShopItem } from "@/features/gamification/constants/gamificationCatalog"

export interface AkihabaraShopSectionProps {
  shopItems: ShopItem[]
  shopCategory: ShopCategoryFilter
  onChangeCategory: (category: ShopCategoryFilter) => void
  userGems: number
  inventory: Record<string, number>
  isPurchasingItemId: string | null
  xpBoosterActive?: boolean
  xpBoosterExpiresAt?: string | null
  isActivatingItemId?: string | null
  onActivateItem?: (itemId: string) => void
  onOpenCVModal: () => void
  onOpenMockModal: () => void
  onPurchaseItem: (item: ShopItem) => void
}

const SHOP_FILTER_OPTIONS: ReadonlyArray<{ id: ShopCategoryFilter; label: string }> = [
  { id: 'all', label: 'Semua' },
  { id: 'protection', label: 'Proteksi' },
  { id: 'booster', label: 'Bonus XP' },
  { id: 'career', label: 'Karier' },
]

export const AkihabaraShopSection = ({
  shopItems,
  shopCategory,
  onChangeCategory,
  userGems,
  inventory,
  isPurchasingItemId,
  xpBoosterActive = false,
  xpBoosterExpiresAt,
  isActivatingItemId,
  onActivateItem,
  onOpenCVModal,
  onOpenMockModal,
  onPurchaseItem,
}: AkihabaraShopSectionProps) => {
  const patternId = `guild-shop-seigaiha-${useId().replace(/:/g, '')}`
  const [nowMs, setNowMs] = useState<number>(() => Date.now())

  useEffect(() => {
    if (!xpBoosterActive) return
    const timer = setInterval(() => {
      setNowMs(Date.now())
    }, 30_000)
    return () => clearInterval(timer)
  }, [xpBoosterActive])

  const boosterExpiresMs = xpBoosterExpiresAt ? new Date(xpBoosterExpiresAt).getTime() : 0
  const isBoosterCurrentlyActive =
    xpBoosterActive && Number.isFinite(boosterExpiresMs) && boosterExpiresMs > nowMs
  const boosterRemainingMinutes = isBoosterCurrentlyActive
    ? Math.max(1, Math.ceil((boosterExpiresMs - nowMs) / 60_000))
    : 0
  return (
    <div className="space-y-4">
      {/* Japanese Guild Stall Top Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white rounded-3xl shadow-md border-b-[5px] border-b-blue-900 overflow-hidden">
        {/* Golden Guild Awning Accent Strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-400" />

        {/* Subtle Seigaiha Wave Texture */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.09] pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <pattern id={patternId} width="48" height="24" patternUnits="userSpaceOnUse">
              <path
                d="M0 24A12 12 0 0 1 24 24M24 24A12 12 0 0 1 48 24M12 12A12 12 0 0 1 36 12"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>

        <div className="relative z-10 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/15 border-2 border-white/25 flex items-center justify-center shrink-0 backdrop-blur-xs">
              <Storefront weight="fill" className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-brand font-black text-base sm:text-lg tracking-tight">
                  Toko Hadiah &amp; Perlengkapan
                </h2>
                <span className="bg-amber-400 text-amber-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase">
                  LANGSUNG AKTIF
                </span>
              </div>
              <p className="text-xs text-blue-100 max-w-md font-medium">
                Tukarkan Gems hasil belajarmu dengan pelindung streak, bonus XP, dan kupon bimbingan karier global.
              </p>
            </div>
          </div>

          {/* Live Gems Coin Vault */}
          <div className="bg-white/15 border-2 border-white/25 rounded-2xl px-4 py-2.5 flex items-center gap-3 shrink-0 self-start sm:self-auto backdrop-blur-xs">
            <GemIcon className="w-7 h-7 shrink-0" />
            <div>
              <span className="text-[10px] font-black text-blue-200 block uppercase tracking-wider">
                Saldo Gems Kamu
              </span>
              <span className="text-base font-brand font-black text-amber-300">
                {userGems} Gems
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 flex-wrap">
        {SHOP_FILTER_OPTIONS.map((option) => {
          const isSelected = shopCategory === option.id
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => {
                triggerHaptic('tap')
                onChangeCategory(option.id)
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#2563EB] text-white border-[#1D4ED8] shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>

      {/* Unified Vending Shelf Rack */}
      <div className="bg-white border-2 border-slate-200/90 rounded-3xl divide-y-2 divide-slate-100 shadow-2xs overflow-hidden">
        {shopItems.map((item) => {
          const ItemIcon = item.icon
          const ownedCount = inventory[item.id] || 0
          const isAffordable = userGems >= item.price
          const missingGems = item.price - userGems

          return (
            <div
              key={item.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors group"
            >
              {/* Left Item Token & Info */}
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <div
                  className={`w-13 h-13 rounded-2xl ${item.iconBg} flex items-center justify-center ${item.iconColor} shrink-0 group-hover:scale-105 transition-transform`}
                >
                  <ItemIcon weight="fill" className="w-6 h-6" />
                </div>

                <div className="space-y-0.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-black text-sm sm:text-base text-slate-900">
                      {item.title}
                    </h3>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded border ${item.badgeColor} uppercase tracking-wider`}
                    >
                      {item.badge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              {/* Right: Stock Counter & Purchase/Action Buttons */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex-wrap">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider">
                    Stok Tas
                  </span>
                  <span className="font-mono font-black text-xs text-slate-700">
                    {ownedCount > 0 ? `${ownedCount}x Dimiliki` : 'Belum Ada'}
                  </span>
                </div>

                {/* Action / Active Status Badge if owned or active */}
                {item.id === 'xp-booster' && isBoosterCurrentlyActive && (
                  <span className="text-[11px] font-mono font-black bg-purple-100 text-purple-800 border border-purple-300 px-3 py-1.5 rounded-xl shadow-2xs inline-flex items-center gap-1">
                    <Lightning weight="fill" className="w-3.5 h-3.5 text-purple-600" />
                    <span>2x XP Aktif • {boosterRemainingMinutes} mnt</span>
                  </span>
                )}

                {item.id === 'xp-booster' && ownedCount > 0 && onActivateItem && (
                  <Button3D
                    variant="emerald"
                    size="sm"
                    onClick={() => onActivateItem(item.id)}
                    loading={isActivatingItemId === item.id}
                    loadingText="MENGAKTIFKAN..."
                    disabled={Boolean(isActivatingItemId) || Boolean(isPurchasingItemId)}
                    className="text-xs px-3.5 py-2 border-b-emerald-800"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <Lightning weight="fill" className="w-3.5 h-3.5" />
                      <span>
                        {isBoosterCurrentlyActive ? 'PERPANJANG +15m' : 'AKTIFKAN 2x XP'}
                      </span>
                    </span>
                  </Button3D>
                )}

                {ownedCount > 0 && item.id === 'xp-booster' && !onActivateItem && !isBoosterCurrentlyActive && (
                  <span className="text-[11px] font-mono font-black bg-purple-100 text-purple-800 border border-purple-300 px-3 py-1.5 rounded-xl shadow-2xs inline-flex items-center gap-1">
                    <Lightning weight="fill" className="w-3.5 h-3.5 text-purple-600" />
                    <span>{ownedCount}x Tersedia</span>
                  </span>
                )}

                {ownedCount > 0 && item.id === 'cv-review' && (
                  <Button3D
                    variant="emerald"
                    size="sm"
                    onClick={onOpenCVModal}
                    className="text-xs px-3.5 py-2 border-b-emerald-800"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <FileText weight="bold" className="w-3.5 h-3.5" />
                      <span>KIRIM BERKAS</span>
                    </span>
                  </Button3D>
                )}

                {ownedCount > 0 && item.id === 'mock-interview' && (
                  <Button3D
                    variant="amber"
                    size="sm"
                    onClick={onOpenMockModal}
                    className="text-xs px-3.5 py-2 text-purple-950 bg-gradient-to-r from-purple-300 to-indigo-300 border-b-purple-600"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <Microphone weight="bold" className="w-3.5 h-3.5" />
                      <span>JADWALKAN</span>
                    </span>
                  </Button3D>
                )}

                {ownedCount > 0 && item.id === 'streak-freeze' && (
                  <span className="text-[10px] font-mono font-bold bg-sky-50 text-sky-800 border border-sky-200 px-2.5 py-1.5 rounded-xl inline-flex items-center gap-1 shadow-2xs">
                    <Snowflake weight="fill" className="w-3.5 h-3.5 text-sky-500" />
                    <span>Proteksi Siap</span>
                  </span>
                )}

                <Button3D
                  variant={isAffordable ? 'blue' : 'ghost'}
                  size="sm"
                  onClick={() => onPurchaseItem(item)}
                  loading={isPurchasingItemId === item.id}
                  loadingText="MEMPROSES..."
                  disabled={!isAffordable || Boolean(isPurchasingItemId) || Boolean(isActivatingItemId)}
                  className={`text-xs px-4 py-2 min-w-[124px] ${
                    !isAffordable ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed' : ''
                  }`}
                >
                  {isAffordable ? (
                    <span className="inline-flex items-center gap-1.5">
                      <span>TUKAR</span>
                      <GemIcon className="w-3.5 h-3.5 shrink-0" />
                      <span className="font-mono font-black">{item.price}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      <span>Kurang {missingGems}</span>
                      <GemIcon className="w-3.5 h-3.5 shrink-0" />
                    </span>
                  )}
                </Button3D>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
