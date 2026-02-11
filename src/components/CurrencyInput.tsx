import { useState, useCallback } from 'react'

interface CurrencyInputProps {
  value: number
  onChange: (value: number) => void
  label: string
  subtitle?: string
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(value)
}

export function CurrencyInput({ value, onChange, label, subtitle }: CurrencyInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [inputValue, setInputValue] = useState(String(value))

  const handleFocus = useCallback(() => {
    setIsFocused(true)
    setInputValue(String(value))
  }, [value])

  const handleBlur = useCallback(() => {
    setIsFocused(false)
    const parsed = parseInt(inputValue.replace(/[^0-9]/g, ''), 10)
    if (!isNaN(parsed) && parsed >= 0) {
      onChange(parsed)
    } else {
      setInputValue(String(value))
    }
  }, [inputValue, onChange, value])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    setInputValue(raw)
    const parsed = parseInt(raw, 10)
    if (!isNaN(parsed) && parsed >= 0) {
      onChange(parsed)
    }
  }, [onChange])

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {subtitle && <span className="text-gray-400 font-normal ml-1">{subtitle}</span>}
      </label>
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={isFocused ? inputValue : formatCurrency(value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base focus:outline-none focus:border-accent transition-colors"
        />
      </div>
    </div>
  )
}
