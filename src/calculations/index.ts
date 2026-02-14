import type { AustralianState, FormState, EnhancedCalculatorResults, StateCalculator } from '../types'
import { nsw } from './nsw'
import { vic } from './vic'
import { qld } from './qld'
import { wa } from './wa'
import { sa } from './sa'
import { tas } from './tas'
import { act } from './act'
import { nt } from './nt'
import { calcMonthlyRepayment, calcLVR } from './loanCalculations'
import { calcLMI } from './lmiCalculation'
import { calculateFHDSEligibility } from './fhdsCalculation'

const calculators: Record<AustralianState, StateCalculator> = {
  NSW: nsw,
  VIC: vic,
  QLD: qld,
  WA: wa,
  SA: sa,
  TAS: tas,
  ACT: act,
  NT: nt,
}

export function calculate(inputs: FormState): EnhancedCalculatorResults {
  const calc = calculators[inputs.state]

  // 1. Existing state calculations
  const concessions = calc.calculateFHOG(inputs)
  const mortgageRegistrationFee = calc.calculateMortgageRegistrationFee(inputs)
  const landTransferFee = calc.calculateLandTransferFee(inputs)
  const stampDuty = calc.calculateStampDuty(inputs)
  const foreignPurchaseSurcharge = calc.calculateForeignSurcharge(inputs)

  const feesTotal = mortgageRegistrationFee + landTransferFee + stampDuty +
    (foreignPurchaseSurcharge !== null ? foreignPurchaseSurcharge : 0)

  // 2. Stamp duty concession info
  const stampDutyConcession = calc.getStampDutyConcessionInfo(inputs)

  // 3. FHDS eligibility
  const fhds = calculateFHDSEligibility(inputs)

  // 4. Loan calculations
  const loanAmount = Math.max(0, inputs.propertyValue - inputs.depositSavings)
  const lvr = calcLVR(inputs.propertyValue, inputs.depositSavings)
  const monthlyRepayment = calcMonthlyRepayment(loanAmount, inputs.loanTerm, inputs.interestRate)
  const totalRepayment = Math.round(monthlyRepayment * inputs.loanTerm * 12)
  const totalInterest = totalRepayment - loanAmount

  // 5. LMI — waived if FHDS eligible
  let lmiEstimate = 0
  if (!fhds.eligible) {
    lmiEstimate = calcLMI(inputs.propertyValue, loanAmount, lvr)
  }
  // Normalize -1 (unknown) for display purposes — keep as -1 so UI can show "unknown"
  const lmiForCosts = lmiEstimate > 0 ? lmiEstimate : 0

  // 6. Upfront costs
  const fhogOffset = concessions.eligible ? concessions.grantAmount : 0
  const foreignSurchargeAmount = foreignPurchaseSurcharge !== null ? foreignPurchaseSurcharge : 0
  const upfrontTotal = inputs.depositSavings + stampDuty + lmiForCosts +
    mortgageRegistrationFee + landTransferFee + inputs.transactionFees +
    foreignSurchargeAmount - fhogOffset

  return {
    concessions,
    fees: {
      mortgageRegistrationFee,
      landTransferFee,
      stampDuty,
      foreignPurchaseSurcharge,
      total: feesTotal,
    },
    stampDutyConcession,
    fhds,
    loan: {
      loanAmount,
      lvr,
      monthlyRepayment,
      totalRepayment,
      totalInterest,
      lmiEstimate,
    },
    upfrontCosts: {
      deposit: inputs.depositSavings,
      stampDuty,
      lmi: lmiForCosts,
      mortgageReg: mortgageRegistrationFee,
      landTransfer: landTransferFee,
      transactionFees: inputs.transactionFees,
      foreignSurcharge: foreignSurchargeAmount,
      fhogOffset,
      total: upfrontTotal,
    },
  }
}
