import type { FormState, PropertyPurpose, AustralianState, PropertyType, ChildrenCount } from '../types'
import { STATE_FORM_CONFIG } from '../types'
import { RadioGroup } from './RadioGroup'
import { CurrencyInput } from './CurrencyInput'
import { StateSelect } from './StateSelect'

interface CalculatorFormProps {
  formState: FormState
  setPropertyPurpose: (v: PropertyPurpose) => void
  setState: (v: AustralianState) => void
  setPropertyValue: (v: number) => void
  setTotalIncome: (v: number) => void
  setIsFirstHomeBuyer: (v: boolean) => void
  setIsForeignPurchaser: (v: boolean) => void
  setIsEligiblePensioner: (v: boolean) => void
  setPropertyType: (v: PropertyType) => void
  setChildrenCount: (v: ChildrenCount) => void
}

export function CalculatorForm({
  formState,
  setPropertyPurpose,
  setState,
  setPropertyValue,
  setTotalIncome,
  setIsFirstHomeBuyer,
  setIsForeignPurchaser,
  setIsEligiblePensioner,
  setPropertyType,
  setChildrenCount,
}: CalculatorFormProps) {
  const config = STATE_FORM_CONFIG[formState.state]

  return (
    <div className="space-y-6">
      <RadioGroup
        label="Property purpose"
        options={[
          { value: 'home' as PropertyPurpose, label: 'Home' },
          { value: 'investment' as PropertyPurpose, label: 'Investment' },
        ]}
        value={formState.propertyPurpose}
        onChange={setPropertyPurpose}
      />

      <StateSelect value={formState.state} onChange={setState} />

      <CurrencyInput
        label="Property value"
        value={formState.propertyValue}
        onChange={setPropertyValue}
      />

      {config.showTotalIncome && (
        <CurrencyInput
          label="Total income"
          subtitle="of all purchasers"
          value={formState.totalIncome}
          onChange={setTotalIncome}
        />
      )}

      {config.showForeignPurchaser && (
        <RadioGroup
          label="Are you a foreign purchaser?"
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
          value={formState.isForeignPurchaser ? 'yes' : 'no'}
          onChange={(v) => setIsForeignPurchaser(v === 'yes')}
        />
      )}

      <RadioGroup
        label="Are you a first home buyer?"
        options={[
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ]}
        value={formState.isFirstHomeBuyer ? 'yes' : 'no'}
        onChange={(v) => setIsFirstHomeBuyer(v === 'yes')}
      />

      {config.showPensioner && (
        <RadioGroup
          label="Are you an eligible pensioner?"
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
          value={formState.isEligiblePensioner ? 'yes' : 'no'}
          onChange={(v) => setIsEligiblePensioner(v === 'yes')}
        />
      )}

      <RadioGroup
        label="Property type"
        options={[
          { value: 'established' as PropertyType, label: 'An established home' },
          { value: 'newlyConstructed' as PropertyType, label: 'A newly constructed home' },
          { value: 'vacantLand' as PropertyType, label: 'Vacant Land' },
        ]}
        value={formState.propertyType}
        onChange={setPropertyType}
      />

      {config.showNumberOfChildren && (
        <RadioGroup
          label="Number of children"
          options={[
            { value: '0', label: '0' },
            { value: '1', label: '1' },
            { value: '2', label: '2' },
            { value: '3', label: '3' },
            { value: '4', label: '4' },
            { value: '5', label: '5 or more' },
          ]}
          value={String(formState.childrenCount)}
          onChange={(v) => setChildrenCount(parseInt(v) as ChildrenCount)}
        />
      )}
    </div>
  )
}
