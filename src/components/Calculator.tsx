import { useCalculator } from '../hooks/useCalculator'
import { STATE_FORM_CONFIG } from '../types'
import { CalculatorForm } from './CalculatorForm'
import { CalculatorResults } from './CalculatorResults'
import { AdvancedSettingsForm } from './AdvancedSettingsForm'

export function Calculator() {
  const { formState, results, updateField, resetForm } = useCalculator()

  const stateConfig = STATE_FORM_CONFIG[formState.state]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form card */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900">Property Details</h2>
            <button
              type="button"
              onClick={resetForm}
              className="text-gray-400 hover:text-accent transition-colors cursor-pointer"
              title="Reset all fields"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          <CalculatorForm
            formState={formState}
            updateField={updateField}
          />
        </div>

        {/* Results card — sticky */}
        <div className="lg:col-span-2 lg:self-start lg:sticky lg:top-22">
          <CalculatorResults results={results} stateConfig={stateConfig} formState={formState} />
        </div>
      </div>

      {/* Advanced Settings card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <AdvancedSettingsForm formState={formState} updateField={updateField} />
      </div>
    </div>
  )
}
