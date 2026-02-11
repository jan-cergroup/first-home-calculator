import type { FormState, FHOGResult, StampDutyBracket, StateCalculator } from '../types'
import { calculateFromBrackets, roundCurrency } from './utils'

// QLD standard transfer duty brackets
const generalBrackets: StampDutyBracket[] = [
  { min: 0, max: 5000, base: 0, rate: 0 },
  { min: 5001, max: 75000, base: 0, rate: 0.015 },
  { min: 75001, max: 540000, base: 1050, rate: 0.035 },
  { min: 540001, max: 1000000, base: 17325, rate: 0.045 },
  { min: 1000001, max: Infinity, base: 38025, rate: 0.0575 },
]

// QLD home concession rate brackets (owner-occupier, non-FHB)
const homeConcessionBrackets: StampDutyBracket[] = [
  { min: 0, max: 350000, base: 0, rate: 0.01 },
  { min: 350001, max: 540000, base: 3500, rate: 0.035 },
  { min: 540001, max: 1000000, base: 10150, rate: 0.045 },
  { min: 1000001, max: Infinity, base: 30850, rate: 0.0575 },
]

export const qld: StateCalculator = {
  calculateStampDuty(inputs: FormState): number {
    const value = inputs.propertyValue

    // QLD FHB concession for established homes: exempt up to $700k, sliding $700k-$800k
    if (inputs.isFirstHomeBuyer && inputs.propertyPurpose === 'home') {
      if (inputs.propertyType === 'newlyConstructed' || inputs.propertyType === 'vacantLand') {
        // From 1 May 2025: full exemption for FHB new homes, no value cap
        // Before that date: exemption up to $750k
        // We'll use the current rules: full exemption for new homes
        return 0
      }
      // Established homes FHB: exempt up to $700k, sliding $700k-$800k
      if (value <= 700000) {
        return 0
      }
      if (value <= 800000) {
        const homeDuty = roundCurrency(calculateFromBrackets(value, homeConcessionBrackets))
        const concessionRate = (800000 - value) / 100000
        return roundCurrency(homeDuty * (1 - concessionRate))
      }
      // Over $800k: home concession rate if owner-occupier
      return roundCurrency(calculateFromBrackets(value, homeConcessionBrackets))
    }

    // Home concession for owner-occupier non-FHB
    if (inputs.propertyPurpose === 'home' && !inputs.isFirstHomeBuyer) {
      return roundCurrency(calculateFromBrackets(value, homeConcessionBrackets))
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

    if (inputs.propertyValue > 750000) {
      return { eligible: false, grantAmount: 0, message: 'You are not eligible for a First Home Owners Grant.*' }
    }

    return { eligible: true, grantAmount: 30000, message: 'You may be eligible for a $30,000 First Home Owners Grant.*' }
  },

  calculateMortgageRegistrationFee(): number {
    return 238
  },

  calculateLandTransferFee(inputs: FormState): number {
    // QLD: $238.14 + $44.71 per $10k over $180k
    const value = inputs.propertyValue
    if (value <= 180000) {
      return 238
    }
    const additionalUnits = Math.ceil((value - 180000) / 10000)
    return roundCurrency(238.14 + additionalUnits * 44.71)
  },

  calculateForeignSurcharge(inputs: FormState): number | null {
    if (inputs.isForeignPurchaser) {
      return roundCurrency(inputs.propertyValue * 0.08)
    }
    return 0
  },
}
