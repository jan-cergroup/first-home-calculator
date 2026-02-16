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

  calculateMortgageRegistrationFee(): number {
    return 210.30
  },

  calculateLandTransferFee(inputs: FormState): number {
    // WA: $210.30 base, +$10 at $100k, +$20 per $100k step from $150k
    const value = inputs.propertyValue
    if (value < 100000) return 210.30
    if (value < 150000) return 220.30
    const steps = Math.floor((value - 150000) / 100000) + 1
    return Math.round((220.30 + steps * 20) * 100) / 100
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
