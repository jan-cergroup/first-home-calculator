interface RadioOption<T extends string> {
  value: T
  label: string
}

interface RadioGroupProps<T extends string> {
  options: RadioOption<T>[]
  value: T
  onChange: (value: T) => void
  label?: string
}

export function RadioGroup<T extends string>({ options, value, onChange, label }: RadioGroupProps<T>) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-500 mb-2">{label}</label>}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all cursor-pointer ${
              value === option.value
                ? 'border-accent text-accent bg-accent-light'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
