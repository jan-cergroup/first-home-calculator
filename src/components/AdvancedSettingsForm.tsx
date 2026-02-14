import type { FormState, LoanTerm } from '../types'
import { RangeSliderInput } from './RangeSliderInput'
import { RadioGroup } from './RadioGroup'
import { CollapsibleSection } from './CollapsibleSection'
import { formatCurrency, formatPercentage } from '../utils/format'

interface AdvancedSettingsFormProps {
  formState: FormState
  updateField: <K extends keyof FormState>(field: K, value: FormState[K]) => void
}

export function AdvancedSettingsForm({ formState, updateField }: AdvancedSettingsFormProps) {
  return (
    <CollapsibleSection title="Advanced Settings">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
          <RangeSliderInput
            label="Interest rate"
            icon={<span className="text-base">%</span>}
            value={formState.interestRate}
            onChange={(v) => updateField('interestRate', Math.round(v * 10) / 10)}
            min={1}
            max={15}
            step={0.1}
            formatValue={(v) => formatPercentage(v)}
          />
          <div>
            <RadioGroup
              label="Loan term"
              options={[
                { value: '15', label: '15yr' },
                { value: '20', label: '20yr' },
                { value: '25', label: '25yr' },
                { value: '30', label: '30yr' },
              ]}
              value={String(formState.loanTerm)}
              onChange={(v) => updateField('loanTerm', parseInt(v) as LoanTerm)}
            />
          </div>
        </div>
        <RangeSliderInput
          label="Transaction fees"
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          value={formState.transactionFees}
          onChange={(v) => updateField('transactionFees', v)}
          min={0}
          max={10000}
          step={100}
          formatValue={formatCurrency}
        />
      </div>
    </CollapsibleSection>
  )
}
