import type { ReactNode } from 'react'

interface RangeSliderInputProps {
  label: string
  icon: ReactNode
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step: number
  formatValue: (v: number) => string
}

export function RangeSliderInput({
  label,
  icon,
  value,
  onChange,
  min,
  max,
  step,
  formatValue,
}: RangeSliderInputProps) {
  const percent = ((value - min) / (max - min)) * 100

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-gray-400">{icon}</span>
        <span className="text-sm font-medium text-gray-500">{label}</span>
      </div>
      <p className="text-2xl font-bold text-accent mb-3">{formatValue(value)}</p>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-slider w-full"
        style={{ '--range-percent': `${percent}%` } as React.CSSProperties}
      />
      <div className="flex justify-between mt-1">
        <span className="text-xs text-gray-400">{formatValue(min)}</span>
        <span className="text-xs text-gray-400">{formatValue(max)}</span>
      </div>
    </div>
  )
}
