import type { FormState, FHOGResult, StampDutyBracket, StateCalculator } from '../types'
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

export const tas: StateCalculator = {
  calculateStampDuty(inputs: FormState): number {
    const value = inputs.propertyValue

    // TAS FHB stamp duty exemption: up to $750k for established homes
    // (Feb 2024 to June 2026)
    if (inputs.isFirstHomeBuyer && inputs.propertyPurpose === 'home' && inputs.propertyType === 'established') {
      if (value <= 750000) {
        return 0
      }
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
}
