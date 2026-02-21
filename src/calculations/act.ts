import type { FormState, FHOGResult, StampDutyBracket, StampDutyConcessionResult, StateCalculator } from '../types'
import { calculateFromBrackets, roundCurrency } from './utils'

// ACT stamp duty brackets (2025-26 schedule — rates unified across residential/commercial)
const generalBrackets: StampDutyBracket[] = [
  { min: 0, max: 200000, base: 0, rate: 0.012 },
  { min: 200001, max: 300000, base: 2400, rate: 0.022 },
  { min: 300001, max: 500000, base: 4600, rate: 0.034 },
  { min: 500001, max: 750000, base: 11400, rate: 0.0432 },
  { min: 750001, max: 1000000, base: 22200, rate: 0.059 },
  { min: 1000001, max: 1455000, base: 36950, rate: 0.064 },
  { min: 1455001, max: 1900000, base: 66070, rate: 0.0454 },
]

// ACT residential rates now match general rates (tax reform convergence)
const residentialBrackets = generalBrackets

// ACT HBCS constants (2025-26 rates — from 1 July 2025)
const HBCS_FULL_EXEMPTION_THRESHOLD = 1_020_000
const HBCS_SLIDING_RATE = 6.40 // per $100 above exemption threshold
const HBCS_UPPER_RATE = 0.0454
const HBCS_MAX_CONCESSION = 35_238
const HBCS_SLIDING_CEILING = 1_455_000

// ACT HBCS income thresholds (from 1 July 2024)
function getHBCSIncomeThreshold(childrenCount: number): number {
  const base = 250000
  const perChild = 4600
  return base + childrenCount * perChild
}

function getFullDuty(inputs: FormState): number {
  // Above $1.9M: flat 5% of total property value
  if (inputs.propertyValue > 1900000) {
    return roundCurrency(inputs.propertyValue * 0.05)
  }
  if (inputs.propertyPurpose === 'home') {
    return roundCurrency(calculateFromBrackets(inputs.propertyValue, residentialBrackets))
  }
  return roundCurrency(calculateFromBrackets(inputs.propertyValue, generalBrackets))
}

export const act: StateCalculator = {
  calculateStampDuty(inputs: FormState): number {
    const value = inputs.propertyValue

    // ACT HBCS: stamp duty concession for eligible first home buyers
    if (inputs.isFirstHomeBuyer && inputs.propertyPurpose === 'home') {
      const incomeThreshold = getHBCSIncomeThreshold(inputs.childrenCount)
      if (inputs.yearlyIncome <= incomeThreshold) {
        if (value <= HBCS_FULL_EXEMPTION_THRESHOLD) {
          return 0
        }
        if (value <= HBCS_SLIDING_CEILING) {
          return roundCurrency((value - HBCS_FULL_EXEMPTION_THRESHOLD) / 100 * HBCS_SLIDING_RATE)
        }
        return roundCurrency(HBCS_UPPER_RATE * value - HBCS_MAX_CONCESSION)
      }
    }

    // Pensioner concession
    if (inputs.isEligiblePensioner && inputs.propertyPurpose === 'home') {
      return 0
    }

    if (inputs.propertyPurpose === 'home') {
      return roundCurrency(calculateFromBrackets(value, residentialBrackets))
    }

    return roundCurrency(calculateFromBrackets(value, generalBrackets))
  },

  calculateFHOG(): FHOGResult {
    // ACT replaced FHOG with HBCS — stamp duty concession is handled in calculateStampDuty
    return { eligible: false, grantAmount: 0, message: 'You are not eligible for a First Home Owners Grant.*' }
  },

  calculateMortgageRegistrationFee(): number {
    return 172
  },

  calculateLandTransferFee(): number {
    return 463
  },

  calculateForeignSurcharge(): number | null {
    // ACT does not have a foreign purchaser surcharge in this context
    return null
  },

  getStampDutyConcessionInfo(inputs: FormState): StampDutyConcessionResult {
    if (inputs.isFirstHomeBuyer && inputs.propertyPurpose === 'home') {
      const incomeThreshold = getHBCSIncomeThreshold(inputs.childrenCount)
      if (inputs.yearlyIncome <= incomeThreshold) {
        const fullDuty = getFullDuty(inputs)
        if (inputs.propertyValue <= HBCS_FULL_EXEMPTION_THRESHOLD) {
          return {
            status: 'exempt',
            savings: fullDuty,
            description: `HBCS: Full stamp duty exemption (property ≤$${(HBCS_FULL_EXEMPTION_THRESHOLD / 1000).toFixed(0)}k)`,
          }
        }
        const concessionalDuty = inputs.propertyValue <= HBCS_SLIDING_CEILING
          ? roundCurrency((inputs.propertyValue - HBCS_FULL_EXEMPTION_THRESHOLD) / 100 * HBCS_SLIDING_RATE)
          : roundCurrency(HBCS_UPPER_RATE * inputs.propertyValue - HBCS_MAX_CONCESSION)
        return {
          status: 'concession',
          savings: roundCurrency(fullDuty - concessionalDuty),
          description: `HBCS: Reduced stamp duty (property above $${(HBCS_FULL_EXEMPTION_THRESHOLD / 1000).toFixed(0)}k threshold)`,
        }
      }
    }

    if (inputs.isEligiblePensioner && inputs.propertyPurpose === 'home') {
      const fullDuty = getFullDuty(inputs)
      return { status: 'exempt', savings: fullDuty, description: 'Pensioner concession: Full stamp duty exemption' }
    }

    return { status: 'fullRate', savings: 0, description: 'No stamp duty concession applies' }
  },
}
