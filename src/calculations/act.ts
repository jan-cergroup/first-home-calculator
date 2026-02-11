import type { FormState, FHOGResult, StampDutyBracket, StateCalculator } from '../types'
import { calculateFromBrackets, roundCurrency } from './utils'

// ACT general stamp duty brackets (commercial/non-residential schedule)
const generalBrackets: StampDutyBracket[] = [
  { min: 0, max: 200000, base: 0, rate: 0.006 },
  { min: 200001, max: 300000, base: 1200, rate: 0.023 },
  { min: 300001, max: 500000, base: 3500, rate: 0.04 },
  { min: 500001, max: 750000, base: 11500, rate: 0.055 },
  { min: 750001, max: 1000000, base: 25250, rate: 0.05 },
  { min: 1000001, max: 1455000, base: 37750, rate: 0.05 },
  { min: 1455001, max: Infinity, base: 60500, rate: 0.055 },
]

// ACT residential stamp duty (owner-occupied)
const residentialBrackets: StampDutyBracket[] = [
  { min: 0, max: 200000, base: 0, rate: 0.0068 },
  { min: 200001, max: 300000, base: 1360, rate: 0.0232 },
  { min: 300001, max: 500000, base: 3680, rate: 0.0408 },
  { min: 500001, max: 750000, base: 11840, rate: 0.057 },
  { min: 750001, max: 1000000, base: 26090, rate: 0.0636 },
  { min: 1000001, max: 1455000, base: 41990, rate: 0.0714 },
  { min: 1455001, max: Infinity, base: 74470, rate: 0.058 },
]

// ACT Home Buyer Concession Scheme (HBCS) income thresholds
// Base income threshold: ~$170,000 for no children, increases per child
function getHBCSIncomeThreshold(childrenCount: number): number {
  const base = 170000
  const perChild = 3330
  return base + childrenCount * perChild
}

export const act: StateCalculator = {
  calculateStampDuty(inputs: FormState): number {
    const value = inputs.propertyValue

    // ACT HBCS: full stamp duty concession for eligible first home buyers
    if (inputs.isFirstHomeBuyer && inputs.propertyPurpose === 'home') {
      const incomeThreshold = getHBCSIncomeThreshold(inputs.childrenCount)
      if (inputs.totalIncome <= incomeThreshold) {
        return 0
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

  calculateFHOG(_inputs: FormState): FHOGResult {
    // ACT replaced FHOG with HBCS — stamp duty concession is handled in calculateStampDuty
    return { eligible: false, grantAmount: 0, message: 'You are not eligible for a First Home Owners Grant.*' }
  },

  calculateMortgageRegistrationFee(): number {
    return 178
  },

  calculateLandTransferFee(inputs: FormState): number {
    // ACT: land transfer fee based on property value
    const value = inputs.propertyValue
    if (value <= 100000) return 279
    if (value <= 200000) return 379
    if (value <= 300000) return 429
    if (value <= 500000) return 479
    if (value <= 750000) return 479
    if (value <= 1000000) return 579
    return 679
  },

  calculateForeignSurcharge(): number | null {
    // ACT does not have a foreign purchaser surcharge in this context
    return null
  },
}
