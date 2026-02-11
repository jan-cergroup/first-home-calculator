import type { AustralianState, FormState, CalculatorResults, StateCalculator } from '../types'
import { nsw } from './nsw'
import { vic } from './vic'
import { qld } from './qld'
import { wa } from './wa'
import { sa } from './sa'
import { tas } from './tas'
import { act } from './act'
import { nt } from './nt'

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

export function calculate(inputs: FormState): CalculatorResults {
  const calc = calculators[inputs.state]

  const concessions = calc.calculateFHOG(inputs)
  const mortgageRegistrationFee = calc.calculateMortgageRegistrationFee(inputs)
  const landTransferFee = calc.calculateLandTransferFee(inputs)
  const stampDuty = calc.calculateStampDuty(inputs)
  const foreignPurchaseSurcharge = calc.calculateForeignSurcharge(inputs)

  const total = mortgageRegistrationFee + landTransferFee + stampDuty +
    (foreignPurchaseSurcharge !== null ? foreignPurchaseSurcharge : 0)

  return {
    concessions,
    fees: {
      mortgageRegistrationFee,
      landTransferFee,
      stampDuty,
      foreignPurchaseSurcharge,
      total,
    },
  }
}
