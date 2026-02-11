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
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium border-2 transition-all cursor-pointer ${
              value === option.value
                ? 'border-accent bg-accent text-white'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
