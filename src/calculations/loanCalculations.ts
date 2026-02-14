/**
 * P&I (Principal & Interest) monthly repayment calculation.
 * Standard amortization formula.
 */
export function calcMonthlyRepayment(principal: number, loanTermYears: number, annualRate: number): number {
  if (principal <= 0) return 0
  if (annualRate <= 0) return principal / (loanTermYears * 12)

  const monthlyRate = annualRate / 100 / 12
  const numPayments = loanTermYears * 12
  const repayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1)

  return Math.round(repayment * 100) / 100
}

/**
 * Loan-to-Value Ratio as a percentage.
 */
export function calcLVR(purchasePrice: number, deposit: number): number {
  if (purchasePrice <= 0) return 0
  const loanAmount = purchasePrice - deposit
  if (loanAmount <= 0) return 0
  return (loanAmount / purchasePrice) * 100
}
