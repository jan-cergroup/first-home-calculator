import { useState, useMemo, useCallback } from 'react'
import type { FormState, EnhancedCalculatorResults } from '../types'
import { DEFAULT_FORM_STATE } from '../types'
import { calculate } from '../calculations'

export function useCalculator() {
  const [formState, setFormState] = useState<FormState>(DEFAULT_FORM_STATE)

  const results: EnhancedCalculatorResults = useMemo(() => calculate(formState), [formState])

  const updateField = useCallback(<K extends keyof FormState>(field: K, value: FormState[K]) => {
    setFormState(prev => ({ ...prev, [field]: value }))
  }, [])

  const resetForm = useCallback(() => {
    setFormState(DEFAULT_FORM_STATE)
  }, [])

  return {
    formState,
    results,
    updateField,
    resetForm,
  }
}
