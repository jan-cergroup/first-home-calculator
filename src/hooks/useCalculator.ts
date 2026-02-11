import { useState, useMemo, useCallback } from 'react'
import type { FormState, CalculatorResults, AustralianState, PropertyPurpose, PropertyType, ChildrenCount } from '../types'
import { DEFAULT_FORM_STATE } from '../types'
import { calculate } from '../calculations'

export function useCalculator() {
  const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE)

  const results: CalculatorResults = useMemo(() => calculate(formState), [formState])

  const updateField = useCallback(<K extends keyof FormState>(field: K, value: FormState[K]) => {
    setFormState(prev => ({ ...prev, [field]: value }))
  }, [])

  const setPropertyPurpose = useCallback((v: PropertyPurpose) => updateField('propertyPurpose', v), [updateField])
  const setState = useCallback((v: AustralianState) => updateField('state', v), [updateField])
  const setPropertyValue = useCallback((v: number) => updateField('propertyValue', v), [updateField])
  const setTotalIncome = useCallback((v: number) => updateField('totalIncome', v), [updateField])
  const setIsFirstHomeBuyer = useCallback((v: boolean) => updateField('isFirstHomeBuyer', v), [updateField])
  const setIsForeignPurchaser = useCallback((v: boolean) => updateField('isForeignPurchaser', v), [updateField])
  const setIsEligiblePensioner = useCallback((v: boolean) => updateField('isEligiblePensioner', v), [updateField])
  const setPropertyType = useCallback((v: PropertyType) => updateField('propertyType', v), [updateField])
  const setChildrenCount = useCallback((v: ChildrenCount) => updateField('childrenCount', v), [updateField])

  return {
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
  }
}
