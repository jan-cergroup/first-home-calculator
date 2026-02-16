import type { FormState, FHOGResult, StampDutyBracket, StampDutyConcessionResult, StateCalculator } from '../types'
import { calculateFromBrackets, roundCurrency } from './utils'

// NSW general stamp duty brackets (2025-26 schedule)
const generalBrackets: StampDutyBracket[] = [
  { min: 0, max: 17000, base: 0, rate: 0.0125 },
  { min: 17001, max: 36000, base: 212, rate: 0.015 },
  { min: 36001, max: 97000, base: 497, rate: 0.0175 },
  { min: 97001, max: 364000, base: 1564, rate: 0.035 },
  { min: 364001, max: 1212000, base: 10909, rate: 0.045 },
  { min: 1212001, max: Infinity, base: 49069, rate: 0.055 },
]

function calculateGeneralStampDuty(value: number): number {
  return roundCurrency(calculateFromBrackets(value, generalBrackets))
}

export const nsw: StateCalculator = {
  calculateStampDuty(inputs: FormState): number {
    const value = inputs.propertyValue

    // First Home Buyer Assistance Scheme (FHBAS)
    // Sliding scale: concession = duty_at_exempt_threshold × sliding_factor
    // Result = full_duty - concession
    if (inputs.isFirstHomeBuyer && inputs.propertyPurpose === 'home') {
      if (inputs.propertyType === 'vacantLand') {
        // Vacant land: full exemption up to $350k, sliding scale $350k–$450k
        if (value <= 350000) return 0
        if (value <= 450000) {
          const fullDuty = calculateGeneralStampDuty(value)
          const exemptDuty = calculateGeneralStampDuty(350000)
          const slidingFactor = (450000 - value) / 100000
          return roundCurrency(fullDuty - exemptDuty * slidingFactor)
        }
      } else {
        // New/established homes: full exemption up to $800k, sliding scale $800k–$1M
        if (value <= 800000) return 0
        if (value <= 1000000) {
          const fullDuty = calculateGeneralStampDuty(value)
          const exemptDuty = calculateGeneralStampDuty(800000)
          const slidingFactor = (1000000 - value) / 200000
          return roundCurrency(fullDuty - exemptDuty * slidingFactor)
        }
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
    return 171.70
  },

  calculateLandTransferFee(): number {
    return 171.70
  },

  calculateForeignSurcharge(inputs: FormState): number | null {
    if (inputs.isForeignPurchaser) {
      return roundCurrency(inputs.propertyValue * 0.09)
    }
    return 0
  },

  getStampDutyConcessionInfo(inputs: FormState): StampDutyConcessionResult {
    if (!inputs.isFirstHomeBuyer || inputs.propertyPurpose !== 'home') {
      return { status: 'fullRate', savings: 0, description: 'No stamp duty concession applies' }
    }

    const value = inputs.propertyValue
    const fullDuty = calculateGeneralStampDuty(value)

    if (inputs.propertyType === 'vacantLand') {
      if (value <= 350000) {
        return { status: 'exempt', savings: fullDuty, description: 'FHBAS: Full stamp duty exemption for vacant land up to $350k' }
      }
      if (value <= 450000) {
        const exemptDuty = calculateGeneralStampDuty(350000)
        const slidingFactor = (450000 - value) / 100000
        const actualDuty = roundCurrency(fullDuty - exemptDuty * slidingFactor)
        return {
          status: 'concession',
          savings: fullDuty - actualDuty,
          description: 'FHBAS: Sliding scale concession for vacant land ($350k–$450k)',
        }
      }
    } else {
      if (value <= 800000) {
        return { status: 'exempt', savings: fullDuty, description: 'FHBAS: Full stamp duty exemption for properties up to $800k' }
      }
      if (value <= 1000000) {
        const exemptDuty = calculateGeneralStampDuty(800000)
        const slidingFactor = (1000000 - value) / 200000
        const actualDuty = roundCurrency(fullDuty - exemptDuty * slidingFactor)
        return {
          status: 'concession',
          savings: fullDuty - actualDuty,
          description: 'FHBAS: Sliding scale concession ($800k–$1M)',
        }
      }
    }

    return { status: 'fullRate', savings: 0, description: 'Property value exceeds FHBAS threshold' }
  },
}
