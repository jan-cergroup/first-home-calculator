import type { CalculatorResults as Results } from '../types'
import type { StateFormConfig } from '../types'
import { useState } from 'react'

interface CalculatorResultsProps {
  results: Results
  stateConfig: StateFormConfig
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value)
}

export function CalculatorResults({ results, stateConfig }: CalculatorResultsProps) {
  const [showAssumptions, setShowAssumptions] = useState(false)

  return (
    <div className="bg-gray-50 rounded-2xl p-6 lg:p-8">
      {/* Concessions section */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Estimated total of government concessions
        </h3>
        {results.concessions.eligible && results.concessions.grantAmount > 0 ? (
          <div className="text-3xl font-bold text-accent mb-2">
            {formatCurrency(results.concessions.grantAmount)}*
          </div>
        ) : null}
        <p className="text-sm text-gray-600">{results.concessions.message}</p>
      </div>

      <hr className="border-gray-200 my-6" />

      {/* Fees section */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Estimated total of government fees
        </h3>
        <div className="text-3xl font-bold text-navy mb-6">
          {formatCurrency(results.fees.total)}*
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Mortgage registration fee</span>
            <span className="font-semibold">{formatCurrency(results.fees.mortgageRegistrationFee)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Land transfer fee</span>
            <span className="font-semibold">{formatCurrency(results.fees.landTransferFee)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Stamp duty on property</span>
            <span className="font-semibold">{formatCurrency(results.fees.stampDuty)}</span>
          </div>
          {stateConfig.showForeignSurcharge && results.fees.foreignPurchaseSurcharge !== null && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Foreign Purchase Surcharge</span>
              <span className="font-semibold">{formatCurrency(results.fees.foreignPurchaseSurcharge)}</span>
            </div>
          )}
        </div>
      </div>

      {/* FHOS note */}
      <p className="mt-6 text-xs text-gray-500 leading-relaxed">
        You may be eligible for the Federal Government First Home Owner Scheme (FHOS).
        Please contact Housing Australia for information. For information on stamp duty
        concessions, contact your local State or Territorial Revenue Office.{' '}
        <button
          onClick={() => setShowAssumptions(true)}
          className="text-accent underline cursor-pointer"
        >
          Calculator assumptions*
        </button>
      </p>

      {/* Assumptions modal */}
      {showAssumptions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full relative">
            <button
              onClick={() => setShowAssumptions(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl cursor-pointer"
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-4">
              First Home Buyers & Owners Grant Calculator Assumptions
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              The results from this calculator should be used as an indication only. It is
              provided for illustrative purposes only, based on the information provided, and
              provides an estimate of the government fees payable. Stamp duty rates are
              subject to change.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
