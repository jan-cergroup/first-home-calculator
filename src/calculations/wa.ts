import type { FormState, FHOGResult, StampDutyBracket, StateCalculator } from '../types'
import { calculateFromBrackets, roundCurrency } from './utils'

// WA general (non-residential) stamp duty brackets
const generalBrackets: StampDutyBracket[] = [
  { min: 0, max: 80000, base: 0, rate: 0.019 },
  { min: 80001, max: 100000, base: 1520, rate: 0.0285 },
  { min: 100001, max: 250000, base: 2090, rate: 0.038 },
  { min: 250001, max: 500000, base: 7790, rate: 0.0475 },
  { min: 500001, max: Infinity, base: 19665, rate: 0.0515 },
]

// WA residential rates (different brackets for owner-occupied residential)
const residentialBrackets: StampDutyBracket[] = [
  { min: 0, max: 120000, base: 0, rate: 0.019 },
  { min: 120001, max: 150000, base: 2280, rate: 0.0285 },
  { min: 150001, max: 360000, base: 3135, rate: 0.038 },
  { min: 360001, max: 725000, base: 11115, rate: 0.0515 },
  { min: 725001, max: Infinity, base: 29910, rate: 0.0515 },
]

export const wa: StateCalculator = {
  calculateStampDuty(inputs: FormState): number {
    const value = inputs.propertyValue

    // WA FHB: exempt up to $430k, sliding $430k-$530k
    if (inputs.isFirstHomeBuyer && inputs.propertyPurpose === 'home') {
      if (value <= 430000) {
        return 0
      }
      if (value <= 530000) {
        const fullDuty = roundCurrency(calculateFromBrackets(value, residentialBrackets))
        const concessionRate = (530000 - value) / 100000
        return roundCurrency(fullDuty * (1 - concessionRate))
      }
    }

    // Residential rates for owner-occupied
    if (inputs.propertyPurpose === 'home') {
      return roundCurrency(calculateFromBrackets(value, residentialBrackets))
    }

    return roundCurrency(calculateFromBrackets(value, generalBrackets))
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
}
