import type { AustralianState } from '../types'
import { AUSTRALIAN_STATES } from '../types'

interface StateSelectProps {
  value: AustralianState
  onChange: (state: AustralianState) => void
}

export function StateSelect({ value, onChange }: StateSelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
      <div className="flex flex-wrap gap-2">
        {AUSTRALIAN_STATES.map((state) => (
          <button
            key={state.value}
            type="button"
            onClick={() => onChange(state.value)}
            className={`px-4 py-2.5 rounded-full text-sm font-medium border-2 transition-all cursor-pointer ${
              value === state.value
                ? 'border-accent bg-accent text-white'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            {state.label}
          </button>
        ))}
      </div>
    </div>
  )
}
