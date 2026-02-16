import type { FormState, FHOGResult, StampDutyConcessionResult, StateCalculator } from '../types'
import { roundCurrency } from './utils'

// NT uses a different stamp duty formula:
// Duty = (0.06571441 × V^2) + 15V
// where V = property value / 1000
// For properties over $525,000, it's 4.95% of value
function calculateNTStampDuty(value: number): number {
  if (value <= 525000) {
    const v = value / 1000
    const duty = (0.06571441 * v * v) + (15 * v)
    return roundCurrency(Math.max(0, duty))
  }
  // 4.95% of the dutiable value for properties over $525,000
  return roundCurrency(value * 0.0495)
}

export const nt: StateCalculator = {
  calculateStampDuty(inputs: FormState): number {
    const value = inputs.propertyValue

    // NT FHB stamp duty concession:
    // No stamp duty for FHB on properties up to $650k
    if (inputs.isFirstHomeBuyer && inputs.propertyPurpose === 'home') {
      if (value <= 650000) {
        return 0
      }
    }

    // Pensioner concession
    if (inputs.isEligiblePensioner && inputs.propertyPurpose === 'home') {
      if (value <= 750000) {
        return 0
      }
    }

    return calculateNTStampDuty(value)
  },

  calculateFHOG(inputs: FormState): FHOGResult {
    if (inputs.propertyPurpose !== 'home') {
      return { eligible: false, grantAmount: 0, message: 'You are not eligible for a First Home Owners Grant.*' }
    }

    // NT is unique: offers grants for both new and established homes
    // and for existing homeowners building new
    if (inputs.isFirstHomeBuyer) {
      if (inputs.propertyType === 'newlyConstructed') {
        return { eligible: true, grantAmount: 50000, message: 'You may be eligible for a $50,000 First Home Owners Grant.*' }
      }
      if (inputs.propertyType === 'vacantLand') {
        return { eligible: true, grantAmount: 50000, message: 'You may be eligible for a $50,000 First Home Owners Grant.*' }
      }
      if (inputs.propertyType === 'established') {
        return { eligible: true, grantAmount: 10000, message: 'You may be eligible for a $10,000 First Home Owners Grant.*' }
      }
    }

    return { eligible: false, grantAmount: 0, message: 'You are not eligible for a First Home Owners Grant.*' }
  },

  calculateMortgageRegistrationFee(): number {
    return 172
  },

  calculateLandTransferFee(): number {
    return 172
  },

  calculateForeignSurcharge(): number | null {
    // NT does not have a foreign purchaser surcharge
    return null
  },

  getStampDutyConcessionInfo(inputs: FormState): StampDutyConcessionResult {
    const value = inputs.propertyValue

    if (inputs.isFirstHomeBuyer && inputs.propertyPurpose === 'home' && value <= 650000) {
      const fullDuty = calculateNTStampDuty(value)
      return { status: 'exempt', savings: fullDuty, description: 'FHB: Full stamp duty exemption for properties up to $650k' }
    }

    if (inputs.isEligiblePensioner && inputs.propertyPurpose === 'home' && value <= 750000) {
      const fullDuty = calculateNTStampDuty(value)
      return { status: 'exempt', savings: fullDuty, description: 'Pensioner concession: Full stamp duty exemption up to $750k' }
    }

    return { status: 'fullRate', savings: 0, description: 'No stamp duty concession applies' }
  },
}
