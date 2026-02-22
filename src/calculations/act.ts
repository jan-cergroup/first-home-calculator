import type { FormState, FHOGResult, StampDutyBracket, StampDutyConcessionResult, StateCalculator } from '../types'
import { calculateFromBrackets, roundCurrency } from './utils'

// ACT general/investor stamp duty brackets (2025-26 schedule, from 1 July 2025)
const generalBrackets: StampDutyBracket[] = [
  { min: 0, max: 200000, base: 0, rate: 0.012 },
  { min: 200001, max: 300000, base: 2400, rate: 0.022 },
  { min: 300001, max: 500000, base: 4600, rate: 0.034 },
  { min: 500001, max: 750000, base: 11400, rate: 0.0432 },
  { min: 750001, max: 1000000, base: 22200, rate: 0.059 },
  { min: 1000001, max: 1455000, base: 36950, rate: 0.064 },
]

// ACT residential owner-occupier stamp duty brackets (2025-26 schedule, from 1 July 2025)
// Lower first bracket ($0.28/$100) vs general ($1.20/$100)
const residentialBrackets: StampDutyBracket[] = [
  { min: 0, max: 260000, base: 0, rate: 0.0028 },
  { min: 260001, max: 300000, base: 728, rate: 0.022 },
  { min: 300001, max: 500000, base: 1608, rate: 0.034 },
  { min: 500001, max: 750000, base: 8408, rate: 0.0432 },
  { min: 750001, max: 1000000, base: 19208, rate: 0.059 },
  { min: 1000001, max: 1455000, base: 33958, rate: 0.064 },
  { min: 1455001, max: Infinity, base: 66057, rate: 0.0454 },
]

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

// ACT general/investor: above $1,455,000 flat 4.54% on total value (intentional discontinuity)
const GENERAL_FLAT_RATE_THRESHOLD = 1_455_000
const GENERAL_FLAT_RATE = 0.0454

function calculateResidentialDuty(value: number): number {
  return roundCurrency(calculateFromBrackets(value, residentialBrackets))
}

function calculateGeneralDuty(value: number): number {
  if (value > GENERAL_FLAT_RATE_THRESHOLD) {
    return roundCurrency(value * GENERAL_FLAT_RATE)
  }
  return roundCurrency(calculateFromBrackets(value, generalBrackets))
}

function getFullDuty(inputs: FormState): number {
  if (inputs.propertyPurpose === 'home') {
    return calculateResidentialDuty(inputs.propertyValue)
  }
  return calculateGeneralDuty(inputs.propertyValue)
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

    // Pensioner concession: same thresholds as HBCS
    if (inputs.isEligiblePensioner && inputs.propertyPurpose === 'home') {
      if (value <= HBCS_FULL_EXEMPTION_THRESHOLD) {
        return 0
      }
      if (value <= HBCS_SLIDING_CEILING) {
        return roundCurrency((value - HBCS_FULL_EXEMPTION_THRESHOLD) / 100 * HBCS_SLIDING_RATE)
      }
      return roundCurrency(HBCS_UPPER_RATE * value - HBCS_MAX_CONCESSION)
    }

    if (inputs.propertyPurpose === 'home') {
      return calculateResidentialDuty(value)
    }

    return calculateGeneralDuty(value)
  },

  calculateFHOG(): FHOGResult {
    // ACT replaced FHOG with HBCS — stamp duty concession is handled in calculateStampDuty
    return { eligible: false, grantAmount: 0, message: 'You are not eligible for a First Home Owners Grant.*' }
  },

  calculateMortgageRegistrationFee(): number {
    return 178
  },

  calculateLandTransferFee(): number {
    return 479
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
