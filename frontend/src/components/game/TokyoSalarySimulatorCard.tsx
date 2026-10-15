import { useState, useMemo } from 'react'
import {
  CurrencyJpy,
  Coins,
  House,
  Train,
  ForkKnife,
  Lightning,
  Sparkle,
  TrendUp,
  CaretDown,
  CaretUp,
  ShieldCheck,
  Info,
} from '@phosphor-icons/react'
import {
  calculateTokyoSalary,
  formatJpy,
  formatIdr,
} from '../../utils/taxCalculatorTokyo'
import type { TokyoHousingLocation } from '../../utils/taxCalculatorTokyo'
import { triggerHaptic } from '../../utils/haptics'
import doodleProud from '../../assets/kodi/doodle-proud.png'

export interface TokyoSalarySimulatorCardProps {
  className?: string
}

export const TokyoSalarySimulatorCard = ({ className = '' }: TokyoSalarySimulatorCardProps) => {
  const [annualSalary, setAnnualSalary] = useState<number>(6_000_000)
  const [location, setLocation] = useState<TokyoHousingLocation>('central')
  const [showTaxBreakdown, setShowTaxBreakdown] = useState<boolean>(false)

  // Quick salary presets common in Tokyo Tech
  const PRESETS = [
    { label: 'Junior Engineer', salary: 4_500_000 },
    { label: 'Mid-Level', salary: 6_000_000 },
    { label: 'Senior Engineer', salary: 8_500_000 },
    { label: 'Lead / Architect', salary: 10_500_000 },
  ]

  const calculation = useMemo(() => {
    return calculateTokyoSalary({
      annualSalaryJpy: annualSalary,
      locationPreference: location,
      exchangeRateJpyToIdr: 105,
    })
  }, [annualSalary, location])

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnnualSalary(Number(e.target.value))
  }

  const handleSelectPreset = (presetSalary: number) => {
    triggerHaptic('tap')
    setAnnualSalary(presetSalary)
  }

  const handleSelectLocation = (loc: TokyoHousingLocation) => {
    triggerHaptic('tap')
    setLocation(loc)
  }

  return (
    <div
      className={`bg-white border-2 border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-7 shadow-xs ${className}`}
    >
      {/* ── CARD HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-900 border border-amber-300/80 text-[10px] font-brand font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <CurrencyJpy weight="bold" className="w-3.5 h-3.5 text-amber-700" />
              <span>Kalkulator Finansial Tokyo 2026</span>
            </span>
            <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-brand font-black px-2 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck weight="fill" className="w-3 h-3 text-emerald-600" />
              <span>Resmi Pajak Jepang (Kokuzeicho)</span>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-brand font-black text-slate-900">
            Simulasi Gaji Bersih (Tedori 手取り) & Biaya Hidup
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-2xl">
            Hitung perkiraan take-home pay riil setelah potongan asuransi sosial (Shakai Hoken) dan pajak Jepang, serta potensi sisa tabungan remitansi ke Indonesia.
          </p>
        </div>

        {/* Currency Tag */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-2xl">
          <Coins weight="bold" className="w-4 h-4 text-amber-500" />
          <span className="text-[11px] font-mono font-bold text-slate-700">
            1 JPY ≈ Rp {calculation.exchangeRateJpyToIdr}
          </span>
        </div>
      </div>

      {/* ── SALARY INPUT SLIDER SECTION ── */}
      <div className="bg-slate-50 border-2 border-slate-200/80 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <label
              htmlFor="salary-range"
              className="text-xs font-brand font-black text-slate-700 uppercase tracking-wider"
            >
              Gaji Kotor Tahunan (Gross Annual Base)
            </label>
            <p className="text-[11px] text-slate-500 font-medium">
              Geser slider atau pilih standar tier posisi engineering di Tokyo:
            </p>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-brand font-black text-blue-600">
              {formatJpy(annualSalary)}
            </span>
            <span className="text-xs font-mono font-bold text-slate-400">/ tahun</span>
          </div>
        </div>

        {/* Interactive Range Slider */}
        <div className="space-y-1.5 pt-1">
          <input
            id="salary-range"
            type="range"
            min={4_000_000}
            max={12_000_000}
            step={250_000}
            value={annualSalary}
            onChange={handleSliderChange}
            className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[10px] font-mono font-bold text-slate-400 px-1">
            <span>¥4,000,000 (Junior)</span>
            <span>¥6,000,000 (Mid)</span>
            <span>¥8,500,000 (Senior)</span>
            <span>¥12,000,000 (Lead)</span>
          </div>
        </div>

        {/* Preset Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-[11px] font-brand font-bold text-slate-500 mr-1">Rekomendasi:</span>
          {PRESETS.map((preset) => {
            const isSelected = annualSalary === preset.salary
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleSelectPreset(preset.salary)}
                className={`px-3 py-1.5 rounded-xl text-xs font-brand font-black transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-blue-600 border-blue-700 text-white shadow-[0_2px_0_0_#1D4ED8]'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 active:translate-y-0.5'
                }`}
              >
                {preset.label} ({formatJpy(preset.salary)})
              </button>
            )
          })}
        </div>
      </div>

      {/* ── HOUSING LOCATION TOGGLE ── */}
      <div className="space-y-2">
        <label className="text-xs font-brand font-black text-slate-700 uppercase tracking-wider block">
          Pilihan Lokasi Tempat Tinggal di Tokyo:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleSelectLocation('central')}
            className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start gap-3 ${
              location === 'central'
                ? 'bg-blue-50/70 border-blue-500 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                location === 'central' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              <House weight="fill" className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-brand font-black text-xs text-slate-900">
                  Tokyo 23 Wards (Pusat Kota)
                </span>
                {location === 'central' && (
                  <span className="bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-md">
                    Dipilih
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Shinjuku, Shibuya, Minato, Setagaya. Dekat kantor & stasiun Yamanote.
              </p>
              <span className="text-xs font-mono font-bold text-blue-700 block pt-1">
                Estimasi Sewa 1K: ~¥88,000 / bln
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleSelectLocation('suburb')}
            className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start gap-3 ${
              location === 'suburb'
                ? 'bg-blue-50/70 border-blue-500 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                location === 'suburb' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              <House weight="bold" className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-brand font-black text-xs text-slate-900">
                  Tokyo Suburban (Pinggiran / Kanagawa / Saitama)
                </span>
                {location === 'suburb' && (
                  <span className="bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-md">
                    Dipilih
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Kawasaki, Yokohama, Chiba. Lebih lapang, asri, 30-40 menit naik kereta komuter.
              </p>
              <span className="text-xs font-mono font-bold text-blue-700 block pt-1">
                Estimasi Sewa 1K: ~¥66,000 / bln
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* ── 4 SUMMARY METRIC CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Gaji Kotor */}
        <div className="bg-white border-2 border-slate-200/90 rounded-2xl p-4.5 space-y-1.5 shadow-2xs">
          <span className="text-[10px] font-brand font-black text-slate-400 uppercase tracking-wider block">
            1. Gaji Kotor Bulanan
          </span>
          <div className="text-xl font-brand font-black text-slate-900">
            {formatJpy(calculation.monthlyGrossJpy)}
          </div>
          <p className="text-[11px] font-mono text-slate-500">
            Gaji pokok per bulan sebelum potongan
          </p>
        </div>

        {/* Card 2: Tedori (Gaji Bersih) */}
        <div className="bg-blue-50/70 border-2 border-blue-200 rounded-2xl p-4.5 space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-brand font-black text-blue-900 uppercase tracking-wider block">
              2. Gaji Bersih (Tedori 手取り)
            </span>
            <span className="bg-blue-600 text-white text-[9px] font-brand font-black px-1.5 py-0.5 rounded-md">
              {calculation.takeHomePercentage}%
            </span>
          </div>
          <div className="text-xl font-brand font-black text-blue-700">
            {formatJpy(calculation.monthlyNetJpy)}
          </div>
          <p className="text-[11px] font-mono text-blue-900 font-medium">
            Masuk rekening bank Jepang (Yuucho/SMBC)
          </p>
        </div>

        {/* Card 3: Total Potongan */}
        <div className="bg-white border-2 border-rose-200/80 rounded-2xl p-4.5 space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-brand font-black text-rose-800 uppercase tracking-wider block">
              3. Pajak & Asuransi
            </span>
            <span className="bg-rose-100 text-rose-800 text-[9px] font-brand font-black px-1.5 py-0.5 rounded-md">
              -{100 - calculation.takeHomePercentage}%
            </span>
          </div>
          <div className="text-xl font-brand font-black text-rose-600">
            -{formatJpy(calculation.monthlyDeductions.totalDeductions)}
          </div>
          <p className="text-[11px] font-mono text-slate-500">
            Shakai Hoken, Shotokuzei & Juminzei
          </p>
        </div>

        {/* Card 4: Sisa Tabungan Remitansi */}
        <div className="bg-emerald-50/80 border-2 border-emerald-300 rounded-2xl p-4.5 space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-brand font-black text-emerald-900 uppercase tracking-wider block">
              4. Sisa Tabungan / Kirim RI
            </span>
            <span className="bg-emerald-600 text-white text-[9px] font-brand font-black px-1.5 py-0.5 rounded-md">
              {calculation.savingsRatePercentage}%
            </span>
          </div>
          <div className="text-xl font-brand font-black text-emerald-700">
            {formatIdr(calculation.monthlySavingsIdr)}
          </div>
          <p className="text-[11px] font-mono text-emerald-900 font-bold">
            ≈ {formatJpy(calculation.monthlySavingsJpy)} / bln
          </p>
        </div>
      </div>

      {/* ── EXPENSE BREAKDOWN PILLS & MONTHLY BUDGET ── */}
      <div className="space-y-3 bg-slate-50/80 border-2 border-slate-200/80 rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h4 className="font-brand font-black text-sm text-slate-900">
              Rincian Pengeluaran Hidup Bulanan di Tokyo
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              Gaya hidup nyaman single engineer dengan pola makan seimbang & apartemen privat.
            </p>
          </div>
          <span className="text-sm font-mono font-black text-slate-800">
            Total: {formatJpy(calculation.monthlyLivingCosts.totalExpenses)} / bln
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
          <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <House weight="bold" className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-bold text-[11px]">Sewa Apartemen</span>
            </div>
            <div className="font-mono font-black text-xs text-slate-900">
              {formatJpy(calculation.monthlyLivingCosts.rent)}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <ForkKnife weight="bold" className="w-3.5 h-3.5 text-amber-600" />
              <span className="font-bold text-[11px]">Makan & Kebutuhan</span>
            </div>
            <div className="font-mono font-black text-xs text-slate-900">
              {formatJpy(calculation.monthlyLivingCosts.food)}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <Lightning weight="bold" className="w-3.5 h-3.5 text-indigo-600" />
              <span className="font-bold text-[11px]">Utilitas & Wifi</span>
            </div>
            <div className="font-mono font-black text-xs text-slate-900">
              {formatJpy(calculation.monthlyLivingCosts.utilities)}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
              <Sparkle weight="bold" className="w-3.5 h-3.5 text-rose-500" />
              <span className="font-bold text-[11px]">Hiburan & Weekend</span>
            </div>
            <div className="font-mono font-black text-xs text-slate-900">
              {formatJpy(calculation.monthlyLivingCosts.entertainment)}
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 space-y-1 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-1.5 text-emerald-800 text-xs">
              <Train weight="bold" className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-bold text-[11px]">Transport Kerja</span>
            </div>
            <div className="font-mono font-black text-xs text-emerald-700">
              ¥0 (Gratis)
            </div>
            <span className="text-[9px] font-bold text-emerald-800 block">
              100% Ditanggung Kantor
            </span>
          </div>
        </div>
      </div>

      {/* ── TOGGLEABLE OFFICIAL JAPANESE TAX BREAKDOWN ACCORDION ── */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden">
        <button
          type="button"
          onClick={() => {
            triggerHaptic('tap')
            setShowTaxBreakdown(!showTaxBreakdown)
          }}
          className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-2">
            <Info weight="bold" className="w-4 h-4 text-slate-600" />
            <span className="font-brand font-black text-xs text-slate-800">
              Lihat Rincian Potongan Hukum Jepang (Asuransi Shakai Hoken & Pajak)
            </span>
          </div>
          <div className="flex items-center gap-1 text-slate-500 text-xs font-bold">
            <span>{showTaxBreakdown ? 'Tutup' : 'Buka Rincian'}</span>
            {showTaxBreakdown ? (
              <CaretUp weight="bold" className="w-4 h-4" />
            ) : (
              <CaretDown weight="bold" className="w-4 h-4" />
            )}
          </div>
        </button>

        {showTaxBreakdown && (
          <div className="p-4 sm:p-5 bg-white space-y-3 text-xs border-t border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="font-brand font-black text-slate-900 text-xs block border-b pb-1">
                  A. Asuransi Sosial (Shakai Hoken 社会保険)
                </span>
                <div className="flex justify-between text-slate-600">
                  <span>Asuransi Kesehatan (Kenko Hoken ~4.99%):</span>
                  <span className="font-mono font-bold">
                    {formatJpy(calculation.monthlyDeductions.healthInsurance)} / bln
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Dana Pensiun Pegawai (Kosei Nenkin ~9.15%):</span>
                  <span className="font-mono font-bold">
                    {formatJpy(calculation.monthlyDeductions.welfarePension)} / bln
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Asuransi Ketenagakerjaan (Koyo Hoken ~0.6%):</span>
                  <span className="font-mono font-bold">
                    {formatJpy(calculation.monthlyDeductions.employmentInsurance)} / bln
                  </span>
                </div>
                <div className="flex justify-between text-blue-700 font-bold pt-1 border-t border-dashed">
                  <span>Subtotal Asuransi Sosial:</span>
                  <span className="font-mono">
                    {formatJpy(calculation.monthlyDeductions.totalSocialInsurance)} / bln
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-brand font-black text-slate-900 text-xs block border-b pb-1">
                  B. Pajak Penghasilan & Daerah
                </span>
                <div className="flex justify-between text-slate-600">
                  <span>Pajak Penghasilan Nasional (Shotokuzei):</span>
                  <span className="font-mono font-bold">
                    {formatJpy(calculation.monthlyDeductions.incomeTax)} / bln
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Pajak Penduduk Tokyo (Juminzei ~10%):</span>
                  <span className="font-mono font-bold">
                    {formatJpy(calculation.monthlyDeductions.residentTax)} / bln
                  </span>
                </div>
                <div className="flex justify-between text-rose-700 font-bold pt-1 border-t border-dashed">
                  <span>Subtotal Pajak:</span>
                  <span className="font-mono">
                    {formatJpy(
                      calculation.monthlyDeductions.incomeTax +
                        calculation.monthlyDeductions.residentTax
                    )}{' '}
                    / bln
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 italic pt-1">
                  *Catatan: Juminzei tahun pertama biasanya ¥0 karena dihitung dari penghasilan tahun sebelumnya di Jepang.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── 1-YEAR REMITTANCE & SAVINGS PROJECTION HIGHLIGHT ── */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-5 sm:p-6 text-white flex flex-col md:flex-row items-center justify-between gap-5 shadow-sm">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="flex items-center gap-1.5 justify-center md:justify-start">
            <TrendUp weight="bold" className="w-5 h-5 text-amber-300" />
            <span className="text-[10px] font-brand font-black uppercase tracking-wider text-emerald-100">
              Proyeksi Akumulasi 1 Tahun
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-brand font-black">
            Potensi Simpanan: {formatIdr(calculation.annualSavingsIdr)}
          </h3>
          <p className="text-xs text-emerald-100 font-medium max-w-lg">
            Setara dengan <span className="font-black text-white">{formatJpy(calculation.annualSavingsJpy)}</span> per tahun setelah seluruh biaya tempat tinggal, makan, utilitas, dan pajak di Tokyo terpenuhi.
          </p>
        </div>

        <div className="bg-white/10 border border-white/20 rounded-2xl px-5 py-3 text-center shrink-0">
          <span className="text-[10px] font-mono text-emerald-200 uppercase block font-bold">
            Savings Rate
          </span>
          <span className="text-2xl font-brand font-black text-amber-300">
            {calculation.savingsRatePercentage}%
          </span>
          <span className="text-[10px] text-emerald-100 block">dari gaji bersih</span>
        </div>
      </div>

      {/* ── KODI MENTOR ADVICE BANNER ── */}
      <div className="bg-blue-50/70 border-2 border-blue-200/90 rounded-3xl p-5 flex items-center gap-4">
        <img
          src={doodleProud}
          alt="Kodi Proud Advisor"
          className="w-16 h-16 object-contain shrink-0 drop-shadow-sm"
        />
        <div className="space-y-1">
          <h4 className="font-brand font-black text-xs text-slate-900 flex items-center gap-1.5">
            <Sparkle weight="fill" className="w-3.5 h-3.5 text-amber-500" />
            <span>Kodi Relocation Tip: Rahasia Teikiken (定期券)!</span>
          </h4>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Di Jepang, perusahaan secara hukum atau kontrak menanggung 100% tiket komuter bulanan kereta Anda dari rumah ke kantor. Anda bahkan bisa naik-turun sepuasnya secara cuma-cuma di seluruh stasiun sepanjang rute komuter tersebut setiap hari!
          </p>
        </div>
      </div>
    </div>
  )
}
