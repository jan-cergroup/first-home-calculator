import type { FormState, FHOGResult, StampDutyBracket, StateCalculator } from '../types'
import { calculateFromBrackets, roundCurrency } from './utils'

// VIC general (non-PPR / investment) stamp duty brackets
const generalBrackets: StampDutyBracket[] = [
  { min: 0, max: 25000, base: 0, rate: 0.014 },
  { min: 25001, max: 130000, base: 350, rate: 0.024 },
  { min: 130001, max: 960000, base: 2870, rate: 0.06 },
  { min: 960001, max: Infinity, base: 0, rate: 0.055 },
]

// VIC PPR (principal place of residence) concession brackets
const pprBrackets: StampDutyBracket[] = [
  { min: 0, max: 25000, base: 0, rate: 0.014 },
  { min: 25001, max: 130000, base: 350, rate: 0.024 },
  { min: 130001, max: 440000, base: 2870, rate: 0.05 },
  { min: 440001, max: 550000, base: 18370, rate: 0.06 },
  { min: 550001, max: 960000, base: 24970, rate: 0.06 },
  { min: 960001, max: Infinity, base: 0, rate: 0.055 },
]

function calculateGeneralStampDuty(value: number): number {
  // For properties over $960k, it's 5.5% of total value
  if (value > 960000 && value <= 2000000) {
    return roundCurrency(value * 0.055)
  }
  if (value > 2000000) {
    return roundCurrency(110000 + (value - 2000000) * 0.065)
  }
  return roundCurrency(calculateFromBrackets(value, generalBrackets))
}

function calculatePPRStampDuty(value: number): number {
  if (value > 960000 && value <= 2000000) {
    return roundCurrency(value * 0.055)
  }
  if (value > 2000000) {
    return roundCurrency(110000 + (value - 2000000) * 0.065)
  }
  return roundCurrency(calculateFromBrackets(value, pprBrackets))
}

export const vic: StateCalculator = {
  calculateStampDuty(inputs: FormState): number {
    const value = inputs.propertyValue

    // VIC FHB: $0 stamp duty up to $600k, sliding scale $600k-$750k
    if (inputs.isFirstHomeBuyer && inputs.propertyPurpose === 'home') {
      if (value <= 600000) {
        return 0
      }
      if (value <= 750000) {
        const fullDuty = calculateGeneralStampDuty(value)
        const concessionRate = (750000 - value) / 150000
        return roundCurrency(fullDuty * (1 - concessionRate))
      }
    }

    // PPR concession applies for owner-occupiers
    if (inputs.propertyPurpose === 'home') {
      // Pensioner concession - similar to PPR rates
      if (inputs.isEligiblePensioner && value <= 750000) {
        return 0
      }
      return calculatePPRStampDuty(value)
    }

    return calculateGeneralStampDuty(value)
  },

  calculateFHOG(inputs: FormState): FHOGResult {
    if (!inputs.isFirstHomeBuyer || inputs.propertyPurpose !== 'home') {
      return { eligible: false, grantAmount: 0, message: 'You are not eligible for a First Home Owners Grant.*' }
    }

    if (inputs.propertyType === 'established') {
      return { eligible: false, grantAmount: 0, message: 'You are not eligible for a First Home Owners Grant.*' }
    }

    if (inputs.propertyValue > 750000) {
      return { eligible: false, grantAmount: 0, message: 'You are not eligible for a First Home Owners Grant.*' }
    }

    return { eligible: true, grantAmount: 10000, message: 'You may be eligible for a $10,000 First Home Owners Grant.*' }
  },

  calculateMortgageRegistrationFee(): number {
    return 136
  },

  calculateLandTransferFee(inputs: FormState): number {
    // VIC: $111.80 + $2.34 per $1,000 of property value (max $3,621)
    const fee = 111.80 + (inputs.propertyValue / 1000) * 2.34
    return roundCurrency(Math.min(fee, 3621))
  },

  calculateForeignSurcharge(inputs: FormState): number | null {
    if (inputs.isForeignPurchaser) {
      return roundCurrency(inputs.propertyValue * 0.08)
    }
    return 0
  },
}
