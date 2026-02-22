/**
 * Stamp Duty Test Script
 *
 * Run with: npx tsx test-stamp-duty.ts
 *
 * Tests all 8 state calculators against a comprehensive set of scenarios
 * and outputs results in a formatted table.
 */

import type { FormState, AustralianState, StateCalculator } from './src/types'
import { nsw } from './src/calculations/nsw'
import { vic } from './src/calculations/vic'
import { qld } from './src/calculations/qld'
import { wa } from './src/calculations/wa'
import { sa } from './src/calculations/sa'
import { tas } from './src/calculations/tas'
import { act } from './src/calculations/act'
import { nt } from './src/calculations/nt'

// ---------------------------------------------------------------------------
// State calculators map
// ---------------------------------------------------------------------------

const calculators: Record<AustralianState, StateCalculator> = {
  NSW: nsw,
  VIC: vic,
  QLD: qld,
  WA: wa,
  SA: sa,
  TAS: tas,
  ACT: act,
  NT: nt,
}

const STATES: AustralianState[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT']

// ---------------------------------------------------------------------------
// Base form state (shared defaults -- overridden per scenario)
// ---------------------------------------------------------------------------

const BASE: FormState = {
  propertyPurpose: 'home',
  state: 'NSW',
  propertyValue: 650000,
  yearlyIncome: 100000,
  isFirstHomeBuyer: true,
  isForeignPurchaser: false,
  isEligiblePensioner: false,
  propertyType: 'established',
  childrenCount: 0,
  depositSavings: 65000,
  buyerType: 'single',
  isMetro: true,
  interestRate: 6.5,
  loanTerm: 30,
  transactionFees: 3000,
}

// ---------------------------------------------------------------------------
// Test scenario definitions
// ---------------------------------------------------------------------------

interface TestScenario {
  label: string
  overrides: Partial<FormState>
}

const scenarios: TestScenario[] = [
  {
    label: '$500k established, FHB, owner-occ, single',
    overrides: {
      propertyValue: 500000,
      propertyType: 'established',
      isFirstHomeBuyer: true,
      propertyPurpose: 'home',
      buyerType: 'single',
      yearlyIncome: 100000,
      depositSavings: 50000,
    },
  },
  {
    label: '$650k established, FHB, owner-occ, single',
    overrides: {
      propertyValue: 650000,
      propertyType: 'established',
      isFirstHomeBuyer: true,
      propertyPurpose: 'home',
      buyerType: 'single',
      yearlyIncome: 100000,
      depositSavings: 65000,
    },
  },
  {
    label: '$800k established, FHB, owner-occ, single',
    overrides: {
      propertyValue: 800000,
      propertyType: 'established',
      isFirstHomeBuyer: true,
      propertyPurpose: 'home',
      buyerType: 'single',
      yearlyIncome: 100000,
      depositSavings: 80000,
    },
  },
  {
    label: '$500k new home, FHB, owner-occ, single',
    overrides: {
      propertyValue: 500000,
      propertyType: 'newlyConstructed',
      isFirstHomeBuyer: true,
      propertyPurpose: 'home',
      buyerType: 'single',
      yearlyIncome: 100000,
      depositSavings: 50000,
    },
  },
  {
    label: '$650k new home, FHB, owner-occ, single',
    overrides: {
      propertyValue: 650000,
      propertyType: 'newlyConstructed',
      isFirstHomeBuyer: true,
      propertyPurpose: 'home',
      buyerType: 'single',
      yearlyIncome: 100000,
      depositSavings: 65000,
    },
  },
  {
    label: '$500k established, NOT FHB, owner-occ',
    overrides: {
      propertyValue: 500000,
      propertyType: 'established',
      isFirstHomeBuyer: false,
      propertyPurpose: 'home',
      buyerType: 'single',
      yearlyIncome: 100000,
      depositSavings: 50000,
    },
  },
  {
    label: '$650k established, NOT FHB, owner-occ',
    overrides: {
      propertyValue: 650000,
      propertyType: 'established',
      isFirstHomeBuyer: false,
      propertyPurpose: 'home',
      buyerType: 'single',
      yearlyIncome: 100000,
      depositSavings: 65000,
    },
  },
  {
    label: '$1M established, NOT FHB, investor',
    overrides: {
      propertyValue: 1000000,
      propertyType: 'established',
      isFirstHomeBuyer: false,
      propertyPurpose: 'investment',
      buyerType: 'single',
      yearlyIncome: 100000,
      depositSavings: 200000,
    },
  },
]

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

function formatCurrency(value: number): string {
  if (value === 0) return '$0'
  return '$' + value.toLocaleString('en-AU', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

function pad(str: string, width: number, align: 'left' | 'right' = 'right'): string {
  if (align === 'left') {
    return str.padEnd(width)
  }
  return str.padStart(width)
}

// ---------------------------------------------------------------------------
// Run tests and print results
// ---------------------------------------------------------------------------

const COL_WIDTH = 12
const LABEL_WIDTH = 44

function printSeparator() {
  const line = '-'.repeat(LABEL_WIDTH) + '+' + STATES.map(() => '-'.repeat(COL_WIDTH + 1)).join('+')
  console.log(line)
}

function printHeader() {
  const header = pad('Scenario', LABEL_WIDTH, 'left') + '|' +
    STATES.map(s => pad(s, COL_WIDTH) + ' ').join('|')
  console.log(header)
}

console.log()
console.log('='.repeat(LABEL_WIDTH + (COL_WIDTH + 2) * STATES.length))
console.log('  STAMP DUTY TEST RESULTS — All States x All Scenarios')
console.log('='.repeat(LABEL_WIDTH + (COL_WIDTH + 2) * STATES.length))
console.log()

printHeader()
printSeparator()

for (const scenario of scenarios) {
  const values: string[] = []

  for (const state of STATES) {
    const inputs: FormState = {
      ...BASE,
      ...scenario.overrides,
      state,
    }

    const calc = calculators[state]
    const stampDuty = calc.calculateStampDuty(inputs)
    values.push(formatCurrency(stampDuty))
  }

  const row = pad(scenario.label, LABEL_WIDTH, 'left') + '|' +
    values.map(v => pad(v, COL_WIDTH) + ' ').join('|')
  console.log(row)
}

printSeparator()

// ---------------------------------------------------------------------------
// Also print concession info for FHB scenarios
// ---------------------------------------------------------------------------

console.log()
console.log('='.repeat(LABEL_WIDTH + (COL_WIDTH + 2) * STATES.length))
console.log('  STAMP DUTY CONCESSION STATUS — FHB Scenarios Only')
console.log('='.repeat(LABEL_WIDTH + (COL_WIDTH + 2) * STATES.length))
console.log()

const CONCESSION_COL = 16

function printConcessionHeader() {
  const header = pad('Scenario', LABEL_WIDTH, 'left') + '|' +
    STATES.map(s => pad(s, CONCESSION_COL) + ' ').join('|')
  console.log(header)
}

function printConcessionSeparator() {
  const line = '-'.repeat(LABEL_WIDTH) + '+' + STATES.map(() => '-'.repeat(CONCESSION_COL + 1)).join('+')
  console.log(line)
}

printConcessionHeader()
printConcessionSeparator()

const fhbScenarios = scenarios.filter(s => s.overrides.isFirstHomeBuyer === true)

for (const scenario of fhbScenarios) {
  const values: string[] = []

  for (const state of STATES) {
    const inputs: FormState = {
      ...BASE,
      ...scenario.overrides,
      state,
    }

    const calc = calculators[state]
    const info = calc.getStampDutyConcessionInfo(inputs)
    values.push(info.status)
  }

  const row = pad(scenario.label, LABEL_WIDTH, 'left') + '|' +
    values.map(v => pad(v, CONCESSION_COL) + ' ').join('|')
  console.log(row)
}

printConcessionSeparator()

// ---------------------------------------------------------------------------
// Print FHOG results too for completeness
// ---------------------------------------------------------------------------

console.log()
console.log('='.repeat(LABEL_WIDTH + (COL_WIDTH + 2) * STATES.length))
console.log('  FHOG GRANT AMOUNTS — All Scenarios')
console.log('='.repeat(LABEL_WIDTH + (COL_WIDTH + 2) * STATES.length))
console.log()

printHeader()
printSeparator()

for (const scenario of scenarios) {
  const values: string[] = []

  for (const state of STATES) {
    const inputs: FormState = {
      ...BASE,
      ...scenario.overrides,
      state,
    }

    const calc = calculators[state]
    const fhog = calc.calculateFHOG(inputs)
    values.push(fhog.eligible ? formatCurrency(fhog.grantAmount) : '-')
  }

  const row = pad(scenario.label, LABEL_WIDTH, 'left') + '|' +
    values.map(v => pad(v, COL_WIDTH) + ' ').join('|')
  console.log(row)
}

printSeparator()
console.log()
console.log('Done. Run with: npx tsx test-stamp-duty.ts')
console.log()
