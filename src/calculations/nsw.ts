import type { FormState, FHOGResult, StampDutyBracket, StateCalculator } from '../types'
import { calculateFromBrackets, roundCurrency } from './utils'

// NSW general stamp duty brackets
const generalBrackets: StampDutyBracket[] = [
  { min: 0, max: 17000, base: 0, rate: 0.0125 },
  { min: 17001, max: 37000, base: 212, rate: 0.015 },
  { min: 37001, max: 99000, base: 512, rate: 0.0175 },
  { min: 99001, max: 372000, base: 1597, rate: 0.035 },
  { min: 372001, max: 1240000, base: 11152, rate: 0.045 },
  { min: 1240001, max: 3721000, base: 50212, rate: 0.055 },
  { min: 3721001, max: Infinity, base: 186667, rate: 0.07 },
]

function calculateGeneralStampDuty(value: number): number {
  return roundCurrency(calculateFromBrackets(value, generalBrackets))
}

export const nsw: StateCalculator = {
  calculateStampDuty(inputs: FormState): number {
    const value = inputs.propertyValue

    // First Home Buyer Assistance Scheme (FHBAS)
    // Full exemption for properties up to $800,000 (new or existing)
    // Sliding scale concession from $800,001 to $1,000,000
    if (inputs.isFirstHomeBuyer && inputs.propertyPurpose === 'home') {
      if (value <= 800000) {
        return 0
      }
      if (value <= 1000000) {
        const fullDuty = calculateGeneralStampDuty(value)
        const concessionRate = (1000000 - value) / 200000
        return roundCurrency(fullDuty * (1 - concessionRate))
      }
    }

    return calculateGeneralStampDuty(value)
  },

  calculateFHOG(inputs: FormState): FHOGResult {
    // NSW FHOG: $10,000 for new homes up to $600,000, or new builds up to $750,000
    if (!inputs.isFirstHomeBuyer || inputs.propertyPurpose !== 'home') {
      return { eligible: false, grantAmount: 0, message: 'You are not eligible for a First Home Owners Grant.*' }
    }

    if (inputs.propertyType === 'established') {
      return { eligible: false, grantAmount: 0, message: 'You are not eligible for a First Home Owners Grant.*' }
    }

    const cap = inputs.propertyType === 'vacantLand' ? 750000 : 600000
    if (inputs.propertyValue > cap) {
      return { eligible: false, grantAmount: 0, message: 'You are not eligible for a First Home Owners Grant.*' }
    }

    return { eligible: true, grantAmount: 10000, message: 'You may be eligible for a $10,000 First Home Owners Grant.*' }
  },

  calculateMortgageRegistrationFee(): number {
    return 176
  },

  calculateLandTransferFee(): number {
    return 176
  },

  calculateForeignSurcharge(inputs: FormState): number | null {
    if (inputs.isForeignPurchaser) {
      return roundCurrency(inputs.propertyValue * 0.09)
    }
    return 0
  },
}
