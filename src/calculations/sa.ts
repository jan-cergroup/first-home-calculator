import type { FormState, FHOGResult, StampDutyBracket, StampDutyConcessionResult, StateCalculator } from '../types'
import { calculateFromBrackets, roundCurrency } from './utils'

// SA general stamp duty brackets
const generalBrackets: StampDutyBracket[] = [
  { min: 0, max: 12000, base: 0, rate: 0.01 },
  { min: 12001, max: 30000, base: 120, rate: 0.02 },
  { min: 30001, max: 50000, base: 480, rate: 0.03 },
  { min: 50001, max: 100000, base: 1080, rate: 0.035 },
  { min: 100001, max: 200000, base: 2830, rate: 0.04 },
  { min: 200001, max: 250000, base: 6830, rate: 0.0425 },
  { min: 250001, max: 300000, base: 8955, rate: 0.0475 },
  { min: 300001, max: 500000, base: 11330, rate: 0.05 },
  { min: 500001, max: Infinity, base: 21330, rate: 0.055 },
]

function calculateFullStampDuty(value: number): number {
  return roundCurrency(calculateFromBrackets(value, generalBrackets))
}

export const sa: StateCalculator = {
  calculateStampDuty(inputs: FormState): number {
    const value = inputs.propertyValue

    // SA FHB relief: full stamp duty relief for new homes and vacant land only
    // (established home exemption was temporary: 6 Jun 2024 – 30 Jun 2025, now expired)
    if (inputs.isFirstHomeBuyer && inputs.propertyPurpose === 'home') {
      if (inputs.propertyType === 'newlyConstructed' || inputs.propertyType === 'vacantLand') {
        return 0
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

    // SA: $15,000 for new homes, no cap specified
    return { eligible: true, grantAmount: 15000, message: 'You may be eligible for a $15,000 First Home Owners Grant.*' }
  },

  calculateMortgageRegistrationFee(): number {
    return 198
  },

  calculateLandTransferFee(inputs: FormState): number {
    // SA: Tiered fee schedule
    const value = inputs.propertyValue
    if (value <= 5000) return 198
    if (value <= 20000) return 297
    if (value <= 40000) return 396
    if (value <= 50000) return 594
    // For higher values: calculated based on value
    // Approximately $198 base + fee per value bracket
    const fee = 594 + Math.ceil((value - 50000) / 10000) * 98
    return roundCurrency(Math.min(fee, 10000))
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

    if (inputs.propertyType === 'newlyConstructed' || inputs.propertyType === 'vacantLand') {
      const fullDuty = calculateFullStampDuty(value)
      return { status: 'exempt', savings: fullDuty, description: 'FHB: Full stamp duty exemption for new homes and vacant land' }
    }

    return { status: 'fullRate', savings: 0, description: 'No stamp duty concession for established homes' }
  },
}
