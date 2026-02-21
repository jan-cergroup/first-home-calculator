import type { FormState, FHOGResult, StampDutyConcessionResult, StateCalculator } from '../types'
import { roundCurrency } from './utils'

// NT stamp duty formula:
// ≤$525k: Duty = (0.06571441 × V²) + 15V where V = value / 1000
// $525,001–$3M: 4.95%
// $3,000,001–$5M: 5.75%
// $5,000,001+: 5.95%
function calculateNTStampDuty(value: number): number {
  if (value <= 525000) {
    const v = value / 1000
    const duty = (0.06571441 * v * v) + (15 * v)
    return roundCurrency(Math.max(0, duty))
  }
  if (value <= 3000000) {
    return roundCurrency(value * 0.0495)
  }
  if (value <= 5000000) {
    return roundCurrency(value * 0.0575)
  }
  return roundCurrency(value * 0.0595)
}

export const nt: StateCalculator = {
  calculateStampDuty(inputs: FormState): number {
    const value = inputs.propertyValue

    // NT HLPE: House and Land Package Exemption for FHB new detached homes
    // Full stamp duty exemption, valid until 30 June 2027
    if (inputs.isFirstHomeBuyer && inputs.propertyPurpose === 'home') {
      if (inputs.propertyType === 'newlyConstructed' || inputs.propertyType === 'vacantLand') {
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
    return 176
  },

  calculateLandTransferFee(): number {
    return 176
  },

  calculateForeignSurcharge(): number | null {
    // NT does not have a foreign purchaser surcharge
    return null
  },

  getStampDutyConcessionInfo(inputs: FormState): StampDutyConcessionResult {
    if (inputs.isFirstHomeBuyer && inputs.propertyPurpose === 'home') {
      if (inputs.propertyType === 'newlyConstructed' || inputs.propertyType === 'vacantLand') {
        const fullDuty = calculateNTStampDuty(inputs.propertyValue)
        return { status: 'exempt', savings: fullDuty, description: 'HLPE: Full stamp duty exemption for new homes (until June 2027)' }
      }
    }

    return { status: 'fullRate', savings: 0, description: 'No stamp duty concession applies' }
  },
}
