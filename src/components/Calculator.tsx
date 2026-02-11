import { useCalculator } from '../hooks/useCalculator'
import { STATE_FORM_CONFIG } from '../types'
import { CalculatorForm } from './CalculatorForm'
import { CalculatorResults } from './CalculatorResults'

export function Calculator() {
  const {
    formState,
    results,
    setPropertyPurpose,
    setState,
    setPropertyValue,
    setTotalIncome,
    setIsFirstHomeBuyer,
    setIsForeignPurchaser,
    setIsEligiblePensioner,
    setPropertyType,
    setChildrenCount,
  } = useCalculator()

  const stateConfig = STATE_FORM_CONFIG[formState.state]

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <CalculatorForm
          formState={formState}
          setPropertyPurpose={setPropertyPurpose}
          setState={setState}
          setPropertyValue={setPropertyValue}
          setTotalIncome={setTotalIncome}
          setIsFirstHomeBuyer={setIsFirstHomeBuyer}
          setIsForeignPurchaser={setIsForeignPurchaser}
          setIsEligiblePensioner={setIsEligiblePensioner}
          setPropertyType={setPropertyType}
          setChildrenCount={setChildrenCount}
        />
        <CalculatorResults results={results} stateConfig={stateConfig} />
      </div>
    </div>
  )
}
