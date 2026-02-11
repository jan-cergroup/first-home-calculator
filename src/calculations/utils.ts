import type { StampDutyBracket } from '../types'

export function calculateFromBrackets(value: number, brackets: StampDutyBracket[]): number {
  for (const bracket of brackets) {
    if (value >= bracket.min && value <= bracket.max) {
      return bracket.base + bracket.rate * (value - bracket.min)
    }
  }
  // If value exceeds all brackets, use the last bracket
  const last = brackets[brackets.length - 1]
  if (last && value > last.max) {
    return last.base + last.rate * (value - last.min)
  }
  return 0
}

export function roundToNearest(value: number, precision: number = 1): number {
  return Math.round(value / precision) * precision
}

export function roundCurrency(value: number): number {
  return Math.round(value)
}
