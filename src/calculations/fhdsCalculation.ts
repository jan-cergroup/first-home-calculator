/**
 * FHDS (First Home Guarantee / First Home Deposit Scheme) eligibility check.
 *
 * The scheme allows eligible first home buyers to purchase with as little as
 * 5% deposit without paying LMI — the government guarantees the difference
 * up to 15% of the property value.
 *
 * Eligibility criteria:
 * - Must be a first home buyer
 * - Property purpose must be owner-occupied (home)
 * - Property value must be within state/location price cap
 * - LVR must be between 80% and 95% (deposit between 5% and 20%)
 * - Income caps were removed (previously $125k single / $200k couple)
 */

import type { FormState, FHDSResult } from '../types'
import { FHDS_PRICE_CAPS } from '../types'
import { calcLVR } from './loanCalculations'

export function calculateFHDSEligibility(inputs: FormState): FHDSResult {
  // Must be first home buyer
  if (!inputs.isFirstHomeBuyer) {
    return { eligible: false, reason: 'Only available for first home buyers' }
  }

  // Must be owner-occupied
  if (inputs.propertyPurpose !== 'home') {
    return { eligible: false, reason: 'Only available for owner-occupied properties' }
  }

  // Check price cap for state/location
  const caps = FHDS_PRICE_CAPS[inputs.state]
  const priceCap = inputs.isMetro ? caps.metro : caps.regional
  if (inputs.propertyValue > priceCap) {
    const location = inputs.isMetro ? 'metro' : 'regional'
    return {
      eligible: false,
      reason: `Property exceeds ${location} price cap of $${(priceCap / 1000).toFixed(0)}k for ${inputs.state}`,
    }
  }

  // Check deposit / LVR range (need 5-20% deposit)
  const lvr = calcLVR(inputs.propertyValue, inputs.depositSavings)
  if (lvr <= 80) {
    return { eligible: false, reason: 'Deposit exceeds 20% — LMI not required' }
  }
  if (lvr > 95) {
    return { eligible: false, reason: 'Minimum 5% deposit required' }
  }

  return { eligible: true, reason: 'You may be eligible for the First Home Guarantee' }
}
