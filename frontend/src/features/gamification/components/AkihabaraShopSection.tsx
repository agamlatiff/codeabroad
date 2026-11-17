import { Button3D } from "@/shared/components/ui/Button3D"
import type { ShopItem } from "@/features/gamification/constants/gamificationCatalog"

export interface AkihabaraShopSectionProps {
  shopItems: ShopItem[]
  userGems: number
  inventory: Record<string, number>
  isPurchasingItemId: string | null
  onOpenCVModal: () => void
  onOpenMockModal: () => void
  onPurchaseItem: (item: ShopItem) => void
}

export const AkihabaraShopSection = ({
  shopItems,
  userGems,
  inventory,
  isPurchasingItemId,
  onOpenCVModal,
  onOpenMockModal,
  onPurchaseItem,
}: AkihabaraShopSectionProps) => {
  return (
    <div className="space-y-4">
      {/* Vending Console Top HUD */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-5 sm:p-6 shadow-md border-b-[5px] border-b-blue-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/10 border-2 border-white/20 flex items-center justify-center text-2xl shrink-0 backdrop-blur-xs">
            🕹️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
                Pasar Hadiah &amp; Perlengkapan Guild
              </h3>
              <span className="bg-amber-400 text-amber-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase">
                AUTO DISPENSE
              </span>
            </div>
            <p className="text-xs text-blue-100 max-w-md">
              Tukarkan Gems hasil belajar Anda dengan proteksi streak, koleksi booster, dan kupon bimbingan karier global.
            </p>
          </div>
        </div>

        {/* Live Gems Coin Vault */}
        <div className="bg-white/15 border-2 border-white/20 rounded-2xl px-4 py-2.5 flex items-center gap-3 shrink-0 self-start sm:self-auto backdrop-blur-xs">
          <span className="text-2xl animate-bounce">💎</span>
          <div>
            <span className="text-[10px] font-black text-blue-200 block uppercase tracking-wider">
              Saldo Gems Anda
            </span>
            <span className="text-base font-black text-amber-300">
              {userGems} Gems
            </span>
          </div>
        </div>
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
                  className={`w-12 h-12 rounded-2xl border-2 ${item.iconBg} flex items-center justify-center ${item.iconColor} shadow-2xs shrink-0 group-hover:scale-105 transition-transform`}
                >
                  <ItemIcon weight="bold" className="w-6 h-6" />
                </div>

                <div className="space-y-0.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-black text-sm sm:text-base text-slate-900">
                      {item.title}
                    </h4>
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
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                    Stok Tas
                  </span>
                  <span className="font-mono font-black text-xs text-slate-700">
                    {ownedCount > 0 ? `${ownedCount}x Dimiliki` : 'Belum Ada'}
                  </span>
                </div>

                {/* Action if owned */}
                {ownedCount > 0 && item.id === 'xp-booster' && (
                  <span className="text-[11px] font-mono font-black bg-purple-100 text-purple-800 border border-purple-300 px-3 py-1.5 rounded-xl shadow-2xs flex items-center gap-1">
                    <span>⚡ {ownedCount}x Tersedia</span>
                  </span>
                )}

                {ownedCount > 0 && item.id === 'cv-review' && (
                  <Button3D
                    variant="emerald"
                    size="sm"
                    onClick={onOpenCVModal}
                    className="text-xs px-3.5 py-2 border-b-emerald-800"
                  >
                    KIRIM BERKAS 📋
                  </Button3D>
                )}

                {ownedCount > 0 && item.id === 'mock-interview' && (
                  <Button3D
                    variant="amber"
                    size="sm"
                    onClick={onOpenMockModal}
                    className="text-xs px-3.5 py-2 text-purple-950 bg-gradient-to-r from-purple-300 to-indigo-300 border-b-purple-600"
                  >
                    JADWALKAN 🎙️
                  </Button3D>
                )}

                {ownedCount > 0 && item.id === 'streak-freeze' && (
                  <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-1.5 rounded-xl flex items-center gap-1 shadow-2xs">
                    <span>❄️ Proteksi Siap</span>
                  </span>
                )}

                <div>
                  <Button3D
                    variant={isAffordable ? 'blue' : 'ghost'}
                    size="sm"
                    onClick={() => onPurchaseItem(item)}
                    disabled={!isAffordable || isPurchasingItemId === item.id}
                    className={`text-xs px-4 py-2 min-w-[120px] ${
                      !isAffordable ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed' : ''
                    }`}
                  >
                    {isPurchasingItemId === item.id ? (
                      <span>MEMPROSES...</span>
                    ) : isAffordable ? (
                      <span className="flex items-center gap-1.5">
                        <span>TUKAR</span>
                        <span className="font-mono font-black">💎 {item.price}</span>
                      </span>
                    ) : (
                      <span>Kurang {missingGems} 💎</span>
                    )}
                  </Button3D>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
