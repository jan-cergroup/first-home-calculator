import { jsPDF } from 'jspdf'
import type { FormState, EnhancedCalculatorResults, StateFormConfig } from '../types'
import { formatCurrency, formatPercentage } from './format'

const ACCENT = '#7952B3'
const GRAY_900 = '#111827'
const GRAY_500 = '#6B7280'
const GRAY_400 = '#9CA3AF'
const GREEN = '#059669'
const RED = '#DC2626'

const PAGE_WIDTH = 210
const MARGIN = 24
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2

function propertyTypeLabel(type: string): string {
  switch (type) {
    case 'established': return 'Established'
    case 'newlyConstructed': return 'Newly Constructed'
    case 'vacantLand': return 'Vacant Land'
    default: return type
  }
}

export function generatePdf(
  formState: FormState,
  results: EnhancedCalculatorResults,
  stateConfig: StateFormConfig,
) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  let y = MARGIN

  // --- Header ---
  doc.setFontSize(10)
  doc.setTextColor(ACCENT)
  doc.text('firsthomebuyercalculator.com.au', MARGIN, y)
  y += 4
  doc.setDrawColor(ACCENT)
  doc.setLineWidth(0.5)
  doc.line(MARGIN, y, MARGIN + CONTENT_WIDTH, y)
  y += 10

  // --- Title ---
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(GRAY_900)
  doc.text('First Home Buyer Estimate', MARGIN, y)
  y += 8

  // --- Subtitle ---
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(GRAY_500)
  const subtitle = [
    formState.state,
    formatCurrency(formState.propertyValue),
    propertyTypeLabel(formState.propertyType),
    formState.isFirstHomeBuyer ? 'First Home Buyer' : 'Not First Home Buyer',
    formState.buyerType === 'couple' ? 'Couple' : 'Single',
  ].join('  |  ')
  doc.text(subtitle, MARGIN, y)
  y += 12

  // --- Monthly Repayment ---
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(GRAY_900)
  doc.text('MONTHLY REPAYMENT', MARGIN, y)
  y += 8
  doc.setFontSize(28)
  doc.setTextColor(ACCENT)
  doc.text(formatCurrency(results.loan.monthlyRepayment), MARGIN, y)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(GRAY_400)
  const repaymentWidth = doc.getTextWidth(formatCurrency(results.loan.monthlyRepayment))
  doc.text(` /mo`, MARGIN + repaymentWidth + 1, y)
  y += 6
  doc.setFontSize(10)
  doc.text(`${formState.loanTerm}yr @ ${formatPercentage(formState.interestRate)}`, MARGIN, y)
  y += 10

  // --- Divider ---
  drawDivider(doc, y)
  y += 8

  // --- Government Schemes ---
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(GRAY_900)
  doc.text('GOVERNMENT SCHEMES', MARGIN, y)
  y += 8

  // FHDS
  y = drawSchemeRow(doc, y, results.fhds.eligible, 'First Home Guarantee (FHDS)', results.fhds.reason)
  y += 2

  // Stamp duty concession
  const sdEligible = results.stampDutyConcession.status !== 'fullRate'
  const sdLabel = `Stamp Duty ${results.stampDutyConcession.status === 'exempt' ? 'Exemption' : results.stampDutyConcession.status === 'concession' ? 'Concession' : '— Full Rate'}`
  const sdDetail = results.stampDutyConcession.savings > 0
    ? `${results.stampDutyConcession.description} — saving ${formatCurrency(results.stampDutyConcession.savings)}`
    : results.stampDutyConcession.description
  y = drawSchemeRow(doc, y, sdEligible, sdLabel, sdDetail)
  y += 2

  // FHOG
  const fhogLabel = results.concessions.eligible && results.concessions.grantAmount > 0
    ? `First Home Owners Grant — ${formatCurrency(results.concessions.grantAmount)}`
    : 'First Home Owners Grant'
  y = drawSchemeRow(doc, y, results.concessions.eligible, fhogLabel, results.concessions.message)
  y += 6

  // --- Divider ---
  drawDivider(doc, y)
  y += 8

  // --- Upfront Costs ---
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(GRAY_900)
  doc.text('UPFRONT COSTS', MARGIN, y)
  y += 8

  y = drawCostRow(doc, y, 'Deposit', results.upfrontCosts.deposit)
  y = drawCostRow(doc, y, 'Stamp duty', results.upfrontCosts.stampDuty)
  if (results.upfrontCosts.lmi > 0) {
    y = drawCostRow(doc, y, 'LMI', results.upfrontCosts.lmi)
  }
  y = drawCostRow(doc, y, 'Mortgage registration', results.upfrontCosts.mortgageReg)
  y = drawCostRow(doc, y, 'Land transfer fee', results.upfrontCosts.landTransfer)
  y = drawCostRow(doc, y, 'Transaction fees', results.upfrontCosts.transactionFees)
  if (stateConfig.showForeignSurcharge && results.upfrontCosts.foreignSurcharge > 0) {
    y = drawCostRow(doc, y, 'Foreign surcharge', results.upfrontCosts.foreignSurcharge)
  }
  if (results.upfrontCosts.fhogOffset > 0) {
    y = drawCostRow(doc, y, 'FHOG offset', -results.upfrontCosts.fhogOffset, GREEN)
  }

  y += 2
  drawDivider(doc, y)
  y += 6
  drawTotalRow(doc, y, 'Total upfront', results.upfrontCosts.total)
  y += 10

  // --- Divider ---
  drawDivider(doc, y)
  y += 8

  // --- Loan Summary ---
  if (results.loan.loanAmount > 0) {
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(GRAY_900)
    doc.text('LOAN SUMMARY', MARGIN, y)
    y += 8

    y = drawCostRow(doc, y, 'Loan amount', results.loan.loanAmount)
    y = drawCostRow(doc, y, 'LVR', null, undefined, formatPercentage(results.loan.lvr))
    y = drawCostRow(doc, y, 'Monthly repayment', results.loan.monthlyRepayment)
    y = drawCostRow(doc, y, `Total over ${formState.loanTerm} years`, results.loan.totalRepayment)
    y = drawCostRow(doc, y, 'Total interest', results.loan.totalInterest)
    y += 4
  }

  // --- Disclaimer ---
  drawDivider(doc, y)
  y += 6
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(GRAY_400)
  const disclaimer = doc.splitTextToSize(
    'This estimate is for illustrative purposes only. Stamp duty rates, FHOG amounts, and scheme eligibility are subject to change. LMI estimates are approximate. FHDS places are limited and subject to availability.',
    CONTENT_WIDTH
  )
  doc.text(disclaimer, MARGIN, y)
  y += disclaimer.length * 3.5 + 4

  const now = new Date()
  const dateStr = now.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
  doc.text(`Generated on ${dateStr} — firsthomebuyercalculator.com.au`, MARGIN, y)

  // --- Save ---
  doc.save(`first-home-estimate-${formState.state.toLowerCase()}.pdf`)
}

function drawDivider(doc: jsPDF, y: number) {
  doc.setDrawColor('#E5E7EB')
  doc.setLineWidth(0.3)
  doc.line(MARGIN, y, MARGIN + CONTENT_WIDTH, y)
}

function drawSchemeRow(doc: jsPDF, y: number, eligible: boolean, label: string, detail: string): number {
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(eligible ? GREEN : RED)
  doc.text(eligible ? '\u2713' : '\u2717', MARGIN, y)

  doc.setTextColor(GRAY_900)
  doc.setFont('helvetica', 'bold')
  doc.text(label, MARGIN + 6, y)
  y += 4.5

  doc.setFont('helvetica', 'normal')
  doc.setTextColor(GRAY_500)
  doc.setFontSize(9)
  const lines = doc.splitTextToSize(detail, CONTENT_WIDTH - 6)
  doc.text(lines, MARGIN + 6, y)
  y += lines.length * 4
  return y
}

function drawCostRow(
  doc: jsPDF,
  y: number,
  label: string,
  value: number | null,
  color?: string,
  formattedValue?: string,
): number {
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(GRAY_500)
  doc.text(label, MARGIN, y)

  doc.setFont('helvetica', 'bold')
  doc.setTextColor(color ?? GRAY_900)
  const displayValue = formattedValue ?? formatCurrency(value ?? 0)
  doc.text(displayValue, MARGIN + CONTENT_WIDTH, y, { align: 'right' })
  return y + 6
}

function drawTotalRow(doc: jsPDF, y: number, label: string, value: number) {
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(GRAY_900)
  doc.text(label, MARGIN, y)
  doc.text(formatCurrency(value), MARGIN + CONTENT_WIDTH, y, { align: 'right' })
}
