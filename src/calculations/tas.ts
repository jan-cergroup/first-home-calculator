import type { FormState, FHOGResult, StampDutyBracket, StampDutyConcessionResult, StateCalculator } from '../types'
import { calculateFromBrackets, roundCurrency } from './utils'

// TAS general stamp duty brackets
const generalBrackets: StampDutyBracket[] = [
  { min: 0, max: 3000, base: 50, rate: 0 },
  { min: 3001, max: 25000, base: 50, rate: 0.0175 },
  { min: 25001, max: 75000, base: 435, rate: 0.0225 },
  { min: 75001, max: 200000, base: 1560, rate: 0.035 },
  { min: 200001, max: 375000, base: 5935, rate: 0.04 },
  { min: 375001, max: 725000, base: 12935, rate: 0.0425 },
  { min: 725001, max: Infinity, base: 27810, rate: 0.045 },
]

function calculateFullStampDuty(value: number): number {
  return roundCurrency(calculateFromBrackets(value, generalBrackets))
}

export const tas: StateCalculator = {
  calculateStampDuty(inputs: FormState): number {
    const value = inputs.propertyValue

    // TAS FHB stamp duty exemption: full exemption for established homes (no value cap)
    if (inputs.isFirstHomeBuyer && inputs.propertyPurpose === 'home' && inputs.propertyType === 'established') {
      return 0
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

    // TAS: $10,000 for new homes, no cap
    return { eligible: true, grantAmount: 10000, message: 'You may be eligible for a $10,000 First Home Owners Grant.*' }
  },

  calculateMortgageRegistrationFee(): number {
    return 163
  },

  calculateLandTransferFee(): number {
    return 250
  },

  calculateForeignSurcharge(inputs: FormState): number | null {
    if (inputs.isForeignPurchaser) {
      return roundCurrency(inputs.propertyValue * 0.08)
    }
    return 0
  },

  getStampDutyConcessionInfo(inputs: FormState): StampDutyConcessionResult {
    if (!inputs.isFirstHomeBuyer || inputs.propertyPurpose !== 'home') {
      return { status: 'fullRate', savings: 0, description: 'No stamp duty concession applies' }
    }

    // TAS FHB: full stamp duty exemption for established homes (no value cap)
    if (inputs.propertyType === 'established') {
      const fullDuty = calculateFullStampDuty(inputs.propertyValue)
      return { status: 'exempt', savings: fullDuty, description: 'FHB: Full stamp duty exemption for established homes' }
    }

    // For new/vacant land — no stamp duty concession in TAS (FHOG applies instead)
    return { status: 'fullRate', savings: 0, description: 'No stamp duty concession for this property type' }
  },
}
