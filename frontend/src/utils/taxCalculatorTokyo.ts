/**
 * Tokyo IT Engineering Salary & Tax Calculator Engine
 * Calculates net take-home salary (Tedori 手取り), statutory social insurance (Shakai Hoken),
 * national income tax (Shotokuzei), local resident tax (Juminzei), and realistic Tokyo living costs
 * with dynamic JPY to IDR currency conversion.
 *
 * Statutory References:
 * - National Tax Agency Japan (Kokuzeicho) Employment Income Deduction & Progressive Tax Brackets
 * - Japan Pension Service & National Health Insurance Association (Kyokai Kenpo Tokyo branch ~9.98% / 2)
 * - Ministry of Health, Labour and Welfare (MHLW) Employment Insurance (0.6% employee share)
 */

export type TokyoHousingLocation = 'central' | 'suburb'

export interface TokyoSalaryInput {
  annualSalaryJpy: number // Gross annual salary (e.g. 6,000,000 JPY)
  locationPreference?: TokyoHousingLocation
  exchangeRateJpyToIdr?: number // Reference exchange rate (default: 105 IDR / 1 JPY)
  customRentJpy?: number
  customFoodJpy?: number
}

export interface TaxAndDeductionBreakdown {
  healthInsurance: number // Kenko Hoken (~4.95%)
  welfarePension: number // Kosei Nenkin (~9.15%)
  employmentInsurance: number // Koyo Hoken (~0.6%)
  totalSocialInsurance: number
  incomeTax: number // Shotokuzei (National Progressive)
  residentTax: number // Juminzei (Local Tokyo ~10%)
  totalDeductions: number
}

export interface TokyoLivingCosts {
  rent: number // 1K Apartment in Tokyo 23 Wards vs Suburbs
  utilities: number // Electricity, Gas, Water, Fiber Internet & Mobile
  food: number // Groceries & everyday meals
  transport: number // Commuting transit (Typically ¥0 because 100% reimbursed by employer Teikiken)
  entertainment: number // Weekend leisure & dining out
  totalExpenses: number
}

export interface TokyoSalaryCalculationResult {
  // Gross
  annualGrossJpy: number
  monthlyGrossJpy: number

  // Taxes & Insurance
  monthlyDeductions: TaxAndDeductionBreakdown
  annualDeductions: TaxAndDeductionBreakdown

  // Take-Home (Tedori 手取り)
  monthlyNetJpy: number
  annualNetJpy: number
  takeHomePercentage: number // e.g. 78%

  // Living Expenses
  monthlyLivingCosts: TokyoLivingCosts
  housingLocation: TokyoHousingLocation

  // Savings Potential
  monthlySavingsJpy: number
  monthlySavingsIdr: number
  annualSavingsJpy: number
  annualSavingsIdr: number
  savingsRatePercentage: number

  // Currency Exchange Rate Used
  exchangeRateJpyToIdr: number
}

const DEFAULT_EXCHANGE_RATE = 105 // 1 JPY = ~Rp 105

/**
 * Calculates official Japanese Employment Income Deduction (Kyuyo Shotoku Kojo)
 */
function calculateEmploymentDeduction(grossAnnual: number): number {
  if (grossAnnual <= 1_625_000) {
    return 550_000
  }
  if (grossAnnual <= 1_800_000) {
    return grossAnnual * 0.4 - 100_000
  }
  if (grossAnnual <= 3_600_000) {
    return grossAnnual * 0.3 + 80_000
  }
  if (grossAnnual <= 6_600_000) {
    return grossAnnual * 0.2 + 440_000
  }
  if (grossAnnual <= 8_500_000) {
    return grossAnnual * 0.1 + 1_100_000
  }
  return 1_950_000 // Capped maximum
}

/**
 * Calculates progressive National Income Tax (Shotokuzei) in Japan
 */
function calculateNationalIncomeTax(taxableAnnualIncome: number): number {
  if (taxableAnnualIncome <= 0) return 0

  let baseTax = 0
  if (taxableAnnualIncome <= 1_950_000) {
    baseTax = taxableAnnualIncome * 0.05
  } else if (taxableAnnualIncome <= 3_300_000) {
    baseTax = taxableAnnualIncome * 0.1 - 97_500
  } else if (taxableAnnualIncome <= 6_950_000) {
    baseTax = taxableAnnualIncome * 0.2 - 427_500
  } else if (taxableAnnualIncome <= 9_000_000) {
    baseTax = taxableAnnualIncome * 0.23 - 636_000
  } else if (taxableAnnualIncome <= 18_000_000) {
    baseTax = taxableAnnualIncome * 0.33 - 1_536_000
  } else {
    baseTax = taxableAnnualIncome * 0.4 - 2_796_000
  }

  // Include 2.1% Special Reconstruction Surtax (Fukko Tokubetsu Shotokuzei)
  return Math.round(baseTax * 1.021)
}

/**
 * Master calculation function for Tokyo Salary & Living Costs
 */
export function calculateTokyoSalary(input: TokyoSalaryInput): TokyoSalaryCalculationResult {
  const {
    annualSalaryJpy,
    locationPreference = 'central',
    exchangeRateJpyToIdr = DEFAULT_EXCHANGE_RATE,
    customRentJpy,
    customFoodJpy,
  } = input

  const clampedSalary = Math.max(2_000_000, Math.min(25_000_000, annualSalaryJpy))
  const monthlyGrossJpy = Math.round(clampedSalary / 12)

  // 1. Social Insurance (Shakai Hoken 社会保険)
  // Employee shares: Health Insurance ~4.99%, Welfare Pension ~9.15%, Employment ~0.6%
  const annualHealthInsurance = Math.round(clampedSalary * 0.0499)
  const annualWelfarePension = Math.round(Math.min(clampedSalary, 7_800_000) * 0.0915) // Pension standard capped
  const annualEmploymentInsurance = Math.round(clampedSalary * 0.006)
  const annualSocialInsuranceTotal = annualHealthInsurance + annualWelfarePension + annualEmploymentInsurance

  // 2. Taxable Income Calculation
  const employmentDeduction = calculateEmploymentDeduction(clampedSalary)
  const basicDeduction = 480_000 // Kiso Kojo for income under ¥24M
  const taxableIncomeForIncomeTax = Math.max(
    0,
    clampedSalary - employmentDeduction - annualSocialInsuranceTotal - basicDeduction
  )

  // 3. National Income Tax (Shotokuzei)
  const annualIncomeTax = calculateNationalIncomeTax(taxableIncomeForIncomeTax)

  // 4. Resident Tax (Juminzei ~10% flat, with basic deduction ¥430,000)
  const residentBasicDeduction = 430_000
  const taxableIncomeForResidentTax = Math.max(
    0,
    clampedSalary - employmentDeduction - annualSocialInsuranceTotal - residentBasicDeduction
  )
  const annualResidentTax = Math.round(taxableIncomeForResidentTax * 0.1)

  // Deductions Summary
  const annualTotalDeductions = annualSocialInsuranceTotal + annualIncomeTax + annualResidentTax
  const monthlyTotalDeductions = Math.round(annualTotalDeductions / 12)

  const monthlyDeductions: TaxAndDeductionBreakdown = {
    healthInsurance: Math.round(annualHealthInsurance / 12),
    welfarePension: Math.round(annualWelfarePension / 12),
    employmentInsurance: Math.round(annualEmploymentInsurance / 12),
    totalSocialInsurance: Math.round(annualSocialInsuranceTotal / 12),
    incomeTax: Math.round(annualIncomeTax / 12),
    residentTax: Math.round(annualResidentTax / 12),
    totalDeductions: monthlyTotalDeductions,
  }

  const annualDeductions: TaxAndDeductionBreakdown = {
    healthInsurance: annualHealthInsurance,
    welfarePension: annualWelfarePension,
    employmentInsurance: annualEmploymentInsurance,
    totalSocialInsurance: annualSocialInsuranceTotal,
    incomeTax: annualIncomeTax,
    residentTax: annualResidentTax,
    totalDeductions: annualTotalDeductions,
  }

  // 5. Net Salary (Tedori 手取り)
  const monthlyNetJpy = monthlyGrossJpy - monthlyTotalDeductions
  const annualNetJpy = monthlyNetJpy * 12
  const takeHomePercentage = Math.round((monthlyNetJpy / monthlyGrossJpy) * 100)

  // 6. Tokyo Living Expenses (Monthly)
  const defaultRent = locationPreference === 'central' ? 88_000 : 66_000
  const rent = customRentJpy ?? defaultRent
  const utilities = 20_000 // Electricity, Gas, Water, High-Speed Optical Fiber Internet
  const food = customFoodJpy ?? 45_000 // Healthy mix of home cooking & occasional teishoku/ramen
  const transport = 0 // In Japan, employers legally or customarily pay 100% of commuter train pass (Teikiken)
  const entertainment = 22_000 // Weekend cafes, Akihabara tech gadgets, leisure

  const totalLivingCosts = rent + utilities + food + transport + entertainment
  const monthlyLivingCosts: TokyoLivingCosts = {
    rent,
    utilities,
    food,
    transport,
    entertainment,
    totalExpenses: totalLivingCosts,
  }

  // 7. Savings Potential (Remaining Remittance to Indonesia)
  const monthlySavingsJpy = Math.max(0, monthlyNetJpy - totalLivingCosts)
  const monthlySavingsIdr = Math.round(monthlySavingsJpy * exchangeRateJpyToIdr)
  const annualSavingsJpy = monthlySavingsJpy * 12
  const annualSavingsIdr = Math.round(annualSavingsJpy * exchangeRateJpyToIdr)
  const savingsRatePercentage = Math.max(0, Math.round((monthlySavingsJpy / monthlyNetJpy) * 100))

  return {
    annualGrossJpy: clampedSalary,
    monthlyGrossJpy,
    monthlyDeductions,
    annualDeductions,
    monthlyNetJpy,
    annualNetJpy,
    takeHomePercentage,
    monthlyLivingCosts,
    housingLocation: locationPreference,
    monthlySavingsJpy,
    monthlySavingsIdr,
    annualSavingsJpy,
    annualSavingsIdr,
    savingsRatePercentage,
    exchangeRateJpyToIdr,
  }
}

/**
 * Format currency helper for clean display
 */
export function formatJpy(amount: number): string {
  return `¥${amount.toLocaleString('ja-JP')}`
}

export function formatIdr(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`
}
