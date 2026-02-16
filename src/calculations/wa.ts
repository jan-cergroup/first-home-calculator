import type { FormState, FHOGResult, StampDutyBracket, StampDutyConcessionResult, StateCalculator } from '../types'
import { calculateFromBrackets, roundCurrency } from './utils'

// WA stamp duty brackets (2025-26 — residential and general rates now unified)
const generalBrackets: StampDutyBracket[] = [
  { min: 0, max: 120000, base: 0, rate: 0.019 },
  { min: 120001, max: 150000, base: 2280, rate: 0.0285 },
  { min: 150001, max: 360000, base: 3135, rate: 0.038 },
  { min: 360001, max: 725000, base: 11115, rate: 0.0475 },
  { min: 725001, max: Infinity, base: 28454, rate: 0.0515 },
]

function calculateFullStampDuty(value: number): number {
  return roundCurrency(calculateFromBrackets(value, generalBrackets))
}

export const wa: StateCalculator = {
  calculateStampDuty(inputs: FormState): number {
    const value = inputs.propertyValue

    // WA FHB: exempt up to $450k, sliding scale $450k–$600k
    // Formula: FHB duty = fullDuty - dutyAt450k × (600k - value) / 150k
    if (inputs.isFirstHomeBuyer && inputs.propertyPurpose === 'home') {
      if (value <= 450000) {
        return 0
      }
      if (value <= 600000) {
        const fullDuty = calculateFullStampDuty(value)
        const exemptDuty = calculateFullStampDuty(450000)
        const slidingFactor = (600000 - value) / 150000
        return roundCurrency(fullDuty - exemptDuty * slidingFactor)
      }
    }

    return calculateFullStampDuty(value)
  },

  calculateFHOG(inputs: FormState): FHOGResult {
    if (!inputs.isFirstHomeBuyer || inputs.propertyPurpose !== 'home') {
      return { eligible: false, grantAmount: 0, message: 'You are not eligible for a First Home Owners Grant.*' }
    }

    if (inputs.propertyType === 'established') {
      return { eligible: false, grantAmount: 0, message: 'You are not eligible for a First Home Owners Grant.*' }
    }

    // WA: $750,000 cap south of 26th parallel, $1M north
    // Default to south (Perth metro) for the calculator
    if (inputs.propertyValue > 750000) {
      return { eligible: false, grantAmount: 0, message: 'You are not eligible for a First Home Owners Grant.*' }
    }

    return { eligible: true, grantAmount: 10000, message: 'You may be eligible for a $10,000 First Home Owners Grant.*' }
  },

  calculateMortgageRegistrationFee(inputs: FormState): number {
    // WA: $174.70, + $42.60 if mortgage > $300k
    if (inputs.propertyValue > 300000) {
      return 217
    }
    return 175
  },

  calculateLandTransferFee(inputs: FormState): number {
    // WA: tiered by value
    const value = inputs.propertyValue
    if (value <= 85000) return 175
    if (value <= 120000) return 185
    if (value <= 200000) return 195
    if (value <= 300000) return 205
    if (value <= 400000) return 225
    if (value <= 500000) return 245
    if (value <= 600000) return 265
    if (value <= 700000) return 285
    if (value <= 800000) return 305
    if (value <= 900000) return 325
    if (value <= 1000000) return 345
    // Over $1M: $345 + $20 per $100k
    return roundCurrency(345 + Math.ceil((value - 1000000) / 100000) * 20)
  },

  calculateForeignSurcharge(inputs: FormState): number | null {
    if (inputs.isForeignPurchaser) {
      return roundCurrency(inputs.propertyValue * 0.07)
    }
    return 0
  },

  getStampDutyConcessionInfo(inputs: FormState): StampDutyConcessionResult {
    if (!inputs.isFirstHomeBuyer || inputs.propertyPurpose !== 'home') {
      return { status: 'fullRate', savings: 0, description: 'No stamp duty concession applies' }
    }

    const value = inputs.propertyValue
    const fullDuty = calculateFullStampDuty(value)

    if (value <= 450000) {
      return { status: 'exempt', savings: fullDuty, description: 'FHB: Full stamp duty exemption for properties up to $450k' }
    }

    if (value <= 600000) {
      const exemptDuty = calculateFullStampDuty(450000)
      const slidingFactor = (600000 - value) / 150000
      const actualDuty = roundCurrency(fullDuty - exemptDuty * slidingFactor)
      return {
        status: 'concession',
        savings: fullDuty - actualDuty,
        description: 'FHB: Sliding scale concession ($450k–$600k)',
      }
    }

    return { status: 'fullRate', savings: 0, description: 'Property value exceeds FHB concession threshold' }
  },
}
