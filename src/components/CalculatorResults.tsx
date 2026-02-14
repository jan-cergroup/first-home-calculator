import type { EnhancedCalculatorResults, StateFormConfig, FormState } from '../types'
import { useState } from 'react'
import { formatCurrency, formatPercentage } from '../utils/format'
import { generatePdf } from '../utils/generatePdf'
import { DonutChart } from './DonutChart'
import { EmailResultsModal } from './EmailResultsModal'

interface CalculatorResultsProps {
  results: EnhancedCalculatorResults
  stateConfig: StateFormConfig
  formState: FormState
}

const DONUT_COLORS = [
  '#7952B3', // accent — deposit
  '#5E3D94', // accent-dark — stamp duty
  '#9B7FCE', // lighter purple — LMI
  '#B59ADB', // even lighter — mortgage reg
  '#6B46A5', // navy — land transfer
  '#D4B8E8', // lavender — transaction fees
  '#4A2D7A', // deep purple — foreign surcharge
  '#C9A6E0', // soft purple — FHOG offset
]

function SchemeStatusIcon({ eligible }: { eligible: boolean }) {
  if (eligible) {
    return (
      <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
        <svg className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
    )
  }
  return (
    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
  )
}

export function CalculatorResults({ results, stateConfig, formState }: CalculatorResultsProps) {
  const [showAssumptions, setShowAssumptions] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)

  const loanAmount = results.loan.loanAmount

  // Build donut segments
  const donutSegments = [
    { label: 'Deposit', value: results.upfrontCosts.deposit, color: DONUT_COLORS[0] },
    { label: 'Stamp duty', value: results.upfrontCosts.stampDuty, color: DONUT_COLORS[1] },
    ...(results.upfrontCosts.lmi > 0 ? [{ label: 'LMI', value: results.upfrontCosts.lmi, color: DONUT_COLORS[2] }] : []),
    { label: 'Mortgage reg', value: results.upfrontCosts.mortgageReg, color: DONUT_COLORS[3] },
    { label: 'Land transfer', value: results.upfrontCosts.landTransfer, color: DONUT_COLORS[4] },
    { label: 'Transaction fees', value: results.upfrontCosts.transactionFees, color: DONUT_COLORS[5] },
    ...(stateConfig.showForeignSurcharge && results.upfrontCosts.foreignSurcharge > 0
      ? [{ label: 'Foreign surcharge', value: results.upfrontCosts.foreignSurcharge, color: DONUT_COLORS[6] }]
      : []),
  ]

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
        {/* Card title */}
        <h2 className="text-xl font-bold text-gray-900">Your First Home Estimate</h2>

        {/* Big headline number */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Monthly repayment</p>
          <p className="text-4xl font-bold text-accent">
            {formatCurrency(results.loan.monthlyRepayment)}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {formState.loanTerm}yr @ {formatPercentage(formState.interestRate)}
          </p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Total upfront</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(results.upfrontCosts.total)}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">Loan amount</p>
            <p className="text-lg font-bold text-gray-900">{formatCurrency(loanAmount)}</p>
          </div>
        </div>

        {/* LVR + LMI badges */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-600 bg-gray-100 rounded-full px-3 py-1">
            LVR {formatPercentage(results.loan.lvr)}
          </span>
          <LmiBadge lmiEstimate={results.loan.lmiEstimate} fhdsEligible={results.fhds.eligible} />
        </div>

        <hr className="border-gray-100" />

        {/* Government Schemes */}
        <div>
          <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Government Schemes
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <SchemeStatusIcon eligible={results.fhds.eligible} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900">First Home Guarantee (FHDS)</p>
                <p className="text-xs text-gray-500 mt-0.5">{results.fhds.reason}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <SchemeStatusIcon eligible={results.stampDutyConcession.status !== 'fullRate'} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  Stamp Duty {results.stampDutyConcession.status === 'exempt' ? 'Exemption' : results.stampDutyConcession.status === 'concession' ? 'Concession' : '— Full Rate'}
                  {results.stampDutyConcession.savings > 0 && (
                    <span className="text-accent ml-1.5 text-xs font-semibold">saving {formatCurrency(results.stampDutyConcession.savings)}</span>
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{results.stampDutyConcession.description}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <SchemeStatusIcon eligible={results.concessions.eligible} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  First Home Owners Grant
                  {results.concessions.eligible && results.concessions.grantAmount > 0 && (
                    <span className="text-accent ml-1.5 text-xs font-semibold">{formatCurrency(results.concessions.grantAmount)}</span>
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{results.concessions.message}</p>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Upfront Costs with donut chart */}
        <div>
          <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-5">
            <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Upfront Costs
          </h3>
          <DonutChart segments={donutSegments} total={results.upfrontCosts.total} />
          {results.upfrontCosts.fhogOffset > 0 && (
            <div className="flex justify-between items-center mt-4 text-sm">
              <span className="text-gray-500">FHOG offset</span>
              <span className="font-semibold text-accent">- {formatCurrency(results.upfrontCosts.fhogOffset)}</span>
            </div>
          )}
        </div>

        {/* Loan Summary */}
        {loanAmount > 0 && (
          <>
            <hr className="border-gray-100" />
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Loan Summary
              </h3>
              <div className="space-y-2.5">
                <CostRow label="Monthly repayment" value={results.loan.monthlyRepayment} />
                <CostRow label={`Total over ${formState.loanTerm} years`} value={results.loan.totalRepayment} />
                <CostRow label="Total interest" value={results.loan.totalInterest} />
              </div>
            </div>
          </>
        )}

        {/* Disclaimer */}
        <p className="text-xs text-gray-400 leading-relaxed">
          You may be eligible for the Federal Government First Home Owner Scheme (FHOS).
          Contact Housing Australia for information. For stamp duty concessions, contact your state Revenue Office.{' '}
          <button
            onClick={() => setShowAssumptions(true)}
            className="text-accent underline cursor-pointer"
          >
            Calculator assumptions*
          </button>
        </p>
      </div>

      {/* CTAs */}
      <div className="space-y-3">
        {/* Download PDF CTA */}
        <button
          onClick={() => generatePdf(formState, results, stateConfig)}
          className="w-full bg-accent-light rounded-2xl p-5 flex items-center gap-4 hover:bg-accent/15 transition-colors cursor-pointer group text-left"
        >
          <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
            <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-accent-dark">Download your estimate</p>
            <p className="text-xs text-accent-dark/60 mt-0.5">Save a PDF summary of your results</p>
          </div>
          <svg className="w-5 h-5 text-accent/40 group-hover:text-accent transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Email CTA */}
        <button
          onClick={() => setShowEmailModal(true)}
          className="w-full bg-accent-light rounded-2xl p-5 flex items-center gap-4 hover:bg-accent/15 transition-colors cursor-pointer group text-left"
        >
          <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
            <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-accent-dark">Email your estimate</p>
            <p className="text-xs text-accent-dark/60 mt-0.5">Get a copy sent to your inbox</p>
          </div>
          <svg className="w-5 h-5 text-accent/40 group-hover:text-accent transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Email modal */}
      <EmailResultsModal isOpen={showEmailModal} onClose={() => setShowEmailModal(false)} />

      {/* Assumptions modal */}
      {showAssumptions && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full relative shadow-lg">
            <button
              onClick={() => setShowAssumptions(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl cursor-pointer"
            >
              &times;
            </button>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Calculator Assumptions</h3>
            <div className="text-sm text-gray-600 leading-relaxed space-y-3">
              <p>
                The results from this calculator should be used as an indication only. It is
                provided for illustrative purposes only, based on the information provided.
              </p>
              <p>
                Stamp duty rates, FHOG amounts, and scheme eligibility are subject to change.
                LMI estimates are approximate and actual premiums may vary by lender.
              </p>
              <p>
                FHDS (First Home Guarantee) eligibility shown is indicative only. Places are
                limited and subject to availability.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function LmiBadge({ lmiEstimate, fhdsEligible }: { lmiEstimate: number; fhdsEligible: boolean }) {
  if (fhdsEligible) {
    return <span className="text-xs font-medium text-accent bg-accent/10 rounded-full px-3 py-1">LMI waived</span>
  }
  if (lmiEstimate === 0) {
    return <span className="text-xs font-medium text-accent bg-accent/10 rounded-full px-3 py-1">No LMI</span>
  }
  if (lmiEstimate === -1) {
    return <span className="text-xs font-medium text-amber-700 bg-amber-100 rounded-full px-3 py-1">LMI — contact lender</span>
  }
  return <span className="text-xs font-medium text-amber-700 bg-amber-100 rounded-full px-3 py-1">LMI ~{formatCurrency(lmiEstimate)}</span>
}

function CostRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{formatCurrency(value)}</span>
    </div>
  )
}
