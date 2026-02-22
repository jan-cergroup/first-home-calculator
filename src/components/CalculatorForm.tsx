import type { FormState, PropertyPurpose, AustralianState, PropertyType, ChildrenCount, BuyerType } from '../types'
import { STATE_FORM_CONFIG, STATE_LOCATION_LABELS, AUSTRALIAN_STATES } from '../types'
import { CheckboxInput } from './CheckboxInput'
import { RadioGroup } from './RadioGroup'
import { RangeSliderInput } from './RangeSliderInput'
import { CollapsibleSection } from './CollapsibleSection'
import { formatCurrency } from '../utils/format'

interface CalculatorFormProps {
  formState: FormState
  updateField: <K extends keyof FormState>(field: K, value: FormState[K]) => void
}

export function CalculatorForm({ formState, updateField }: CalculatorFormProps) {
  const config = STATE_FORM_CONFIG[formState.state]
  const locationLabels = STATE_LOCATION_LABELS[formState.state]

  return (
    <div className="space-y-8">
      {/* Property Value Slider */}
      <RangeSliderInput
        label="Property value"
        icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        }
        value={formState.propertyValue}
        onChange={(v) => updateField('propertyValue', v)}
        min={100000}
        max={2000000}
        step={10000}
        formatValue={formatCurrency}
      />

      {/* State pills */}
      <RadioGroup
        label="State"
        options={AUSTRALIAN_STATES.map((s) => ({ value: s.value, label: s.label }))}
        value={formState.state}
        onChange={(v) => updateField('state', v as AustralianState)}
      />

      {/* Location pills */}
      <RadioGroup
        label="Location"
        options={[
          { value: 'metro', label: locationLabels.metro },
          { value: 'regional', label: locationLabels.regional },
        ]}
        value={formState.isMetro ? 'metro' : 'regional'}
        onChange={(v) => updateField('isMetro', v === 'metro')}
      />

      {/* Purpose pills */}
      <RadioGroup
        label="Purpose"
        options={[
          { value: 'home', label: 'Home' },
          { value: 'investment', label: 'Investment' },
        ]}
        value={formState.propertyPurpose}
        onChange={(v) => updateField('propertyPurpose', v as PropertyPurpose)}
      />

      {/* Property type pills */}
      <RadioGroup
        label="Property type"
        options={[
          { value: 'established', label: 'Established' },
          { value: 'newlyConstructed', label: 'Newly Built' },
          { value: 'vacantLand', label: 'Vacant Land' },
        ]}
        value={formState.propertyType}
        onChange={(v) => updateField('propertyType', v as PropertyType)}
      />

      <hr className="border-gray-100" />

      {/* About You */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-5">About You</h3>

        <div className="space-y-5">
          <RadioGroup
            label="Buyer"
            options={[
              { value: 'single', label: 'Single' },
              { value: 'couple', label: 'Couple' },
            ]}
            value={formState.buyerType}
            onChange={(v) => updateField('buyerType', v as BuyerType)}
          />

          <div className="space-y-3 pt-1">
            <CheckboxInput
              label="I am a first home buyer"
              checked={formState.isFirstHomeBuyer}
              onChange={(v) => updateField('isFirstHomeBuyer', v)}
            />

            {config.showForeignPurchaser && (
              <CheckboxInput
                label="I am a foreign purchaser"
                checked={formState.isForeignPurchaser}
                onChange={(v) => updateField('isForeignPurchaser', v)}
              />
            )}

            {config.showPensioner && (
              <CheckboxInput
                label="I am an eligible pensioner"
                checked={formState.isEligiblePensioner}
                onChange={(v) => updateField('isEligiblePensioner', v)}
              />
            )}
          </div>

          {config.showNumberOfChildren && (
            <RadioGroup
              label="Number of children"
              options={[
                { value: '0', label: '0' },
                { value: '1', label: '1' },
                { value: '2', label: '2' },
                { value: '3', label: '3' },
                { value: '4', label: '4' },
                { value: '5', label: '5+' },
              ]}
              value={String(formState.childrenCount)}
              onChange={(v) => updateField('childrenCount', parseInt(v) as ChildrenCount)}
            />
          )}
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Your Finances */}
      <CollapsibleSection title="Your Finances" defaultOpen>
        <div className="space-y-6">
          <RangeSliderInput
            label="Deposit savings"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            value={formState.depositSavings}
            onChange={(v) => updateField('depositSavings', v)}
            min={0}
            max={500000}
            step={5000}
            formatValue={formatCurrency}
          />
          <RangeSliderInput
            label="Yearly income (gross, all purchasers)"
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            value={formState.yearlyIncome}
            onChange={(v) => updateField('yearlyIncome', v)}
            min={0}
            max={500000}
            step={5000}
            formatValue={formatCurrency}
          />
        </div>
      </CollapsibleSection>
    </div>
  )
}
