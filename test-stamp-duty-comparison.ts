/**
 * Stamp Duty Comparison Script
 *
 * Compares our calculator results against money.com.au API reference.
 * Run with: npx tsx test-stamp-duty-comparison.ts
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
  NSW: nsw, VIC: vic, QLD: qld, WA: wa, SA: sa, TAS: tas, ACT: act, NT: nt,
}

const STATES: AustralianState[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT']

// ---------------------------------------------------------------------------
// money.com.au API types
// ---------------------------------------------------------------------------

interface MoneyApiResponse {
  stamp_duty: string
  savings?: string
  mortgage_registration_fee: string
  transfer_fee: string
  fhb_grant: string
}

type MoneyPropertyType = 'ESTABLISHED' | 'NEW' | 'VACANT_LAND'

interface MoneyApiScenario {
  contract_price: string
  residential: 'YES' | 'NO'
  property_type: MoneyPropertyType
  foreign_purchaser: 'YES' | 'NO'
  ppr: 'YES' | 'NO'
  first_home_buyer: 'YES' | 'NO'
  all_purchasers_first_home_buyers?: 'YES' | 'NO'
}

// ---------------------------------------------------------------------------
// API call helper
// ---------------------------------------------------------------------------

async function callMoneyApi(state: string, scenario: MoneyApiScenario): Promise<MoneyApiResponse | null> {
  const stateKey = `${state.toLowerCase()}_input_data`
  const body = { state, [stateKey]: scenario }

  try {
    const resp = await fetch('https://calculators.money.com.au/v1/stamp-duty/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'https://www.money.com.au',
        'Referer': 'https://www.money.com.au/',
      },
      body: JSON.stringify(body),
    })
    if (!resp.ok) {
      console.error(`  API error for ${state}: ${resp.status} ${resp.statusText}`)
      return null
    }
    return await resp.json() as MoneyApiResponse
  } catch (e) {
    console.error(`  API error for ${state}:`, (e as Error).message)
    return null
  }
}

// ---------------------------------------------------------------------------
// Test scenario definitions
// ---------------------------------------------------------------------------

interface TestScenario {
  label: string
  ourOverrides: Partial<FormState>
  apiScenario: MoneyApiScenario
}

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
  monthlyExpenses: 2000,
  hecsDebt: 0,
  buyerType: 'single',
  isMetro: true,
  interestRate: 6.5,
  loanTerm: 30,
  transactionFees: 3000,
}

const scenarios: TestScenario[] = [
  // --- FHB scenarios ---
  {
    label: '$500k estab, FHB, owner-occ',
    ourOverrides: { propertyValue: 500000, propertyType: 'established', isFirstHomeBuyer: true, propertyPurpose: 'home' },
    apiScenario: { contract_price: '500000', residential: 'YES', property_type: 'ESTABLISHED', foreign_purchaser: 'NO', ppr: 'YES', first_home_buyer: 'YES', all_purchasers_first_home_buyers: 'YES' },
  },
  {
    label: '$650k estab, FHB, owner-occ',
    ourOverrides: { propertyValue: 650000, propertyType: 'established', isFirstHomeBuyer: true, propertyPurpose: 'home' },
    apiScenario: { contract_price: '650000', residential: 'YES', property_type: 'ESTABLISHED', foreign_purchaser: 'NO', ppr: 'YES', first_home_buyer: 'YES', all_purchasers_first_home_buyers: 'YES' },
  },
  {
    label: '$800k estab, FHB, owner-occ',
    ourOverrides: { propertyValue: 800000, propertyType: 'established', isFirstHomeBuyer: true, propertyPurpose: 'home' },
    apiScenario: { contract_price: '800000', residential: 'YES', property_type: 'ESTABLISHED', foreign_purchaser: 'NO', ppr: 'YES', first_home_buyer: 'YES', all_purchasers_first_home_buyers: 'YES' },
  },
  {
    label: '$900k estab, FHB, owner-occ',
    ourOverrides: { propertyValue: 900000, propertyType: 'established', isFirstHomeBuyer: true, propertyPurpose: 'home' },
    apiScenario: { contract_price: '900000', residential: 'YES', property_type: 'ESTABLISHED', foreign_purchaser: 'NO', ppr: 'YES', first_home_buyer: 'YES', all_purchasers_first_home_buyers: 'YES' },
  },
  {
    label: '$500k new, FHB, owner-occ',
    ourOverrides: { propertyValue: 500000, propertyType: 'newlyConstructed', isFirstHomeBuyer: true, propertyPurpose: 'home' },
    apiScenario: { contract_price: '500000', residential: 'YES', property_type: 'NEW', foreign_purchaser: 'NO', ppr: 'YES', first_home_buyer: 'YES', all_purchasers_first_home_buyers: 'YES' },
  },
  {
    label: '$650k new, FHB, owner-occ',
    ourOverrides: { propertyValue: 650000, propertyType: 'newlyConstructed', isFirstHomeBuyer: true, propertyPurpose: 'home' },
    apiScenario: { contract_price: '650000', residential: 'YES', property_type: 'NEW', foreign_purchaser: 'NO', ppr: 'YES', first_home_buyer: 'YES', all_purchasers_first_home_buyers: 'YES' },
  },
  // --- Non-FHB scenarios ---
  {
    label: '$500k estab, NOT FHB, owner-occ',
    ourOverrides: { propertyValue: 500000, propertyType: 'established', isFirstHomeBuyer: false, propertyPurpose: 'home' },
    apiScenario: { contract_price: '500000', residential: 'YES', property_type: 'ESTABLISHED', foreign_purchaser: 'NO', ppr: 'YES', first_home_buyer: 'NO' },
  },
  {
    label: '$650k estab, NOT FHB, owner-occ',
    ourOverrides: { propertyValue: 650000, propertyType: 'established', isFirstHomeBuyer: false, propertyPurpose: 'home' },
    apiScenario: { contract_price: '650000', residential: 'YES', property_type: 'ESTABLISHED', foreign_purchaser: 'NO', ppr: 'YES', first_home_buyer: 'NO' },
  },
  {
    label: '$1M estab, NOT FHB, investor',
    ourOverrides: { propertyValue: 1000000, propertyType: 'established', isFirstHomeBuyer: false, propertyPurpose: 'investment' },
    apiScenario: { contract_price: '1000000', residential: 'YES', property_type: 'ESTABLISHED', foreign_purchaser: 'NO', ppr: 'NO', first_home_buyer: 'NO' },
  },
  // --- Foreign purchaser ---
  {
    label: '$650k estab, foreign, investor',
    ourOverrides: { propertyValue: 650000, propertyType: 'established', isFirstHomeBuyer: false, propertyPurpose: 'investment', isForeignPurchaser: true },
    apiScenario: { contract_price: '650000', residential: 'YES', property_type: 'ESTABLISHED', foreign_purchaser: 'YES', ppr: 'NO', first_home_buyer: 'NO' },
  },
]

// ---------------------------------------------------------------------------
// Comparison logic
// ---------------------------------------------------------------------------

interface ComparisonRow {
  state: AustralianState
  scenario: string
  ourStampDuty: number
  refStampDuty: number | null
  ourMortReg: number
  refMortReg: number | null
  ourTransfer: number
  refTransfer: number | null
  ourFHOG: number
  refFHOG: number | null
  stampDutyDiff: number | null
  mortRegDiff: number | null
  transferDiff: number | null
  fhogDiff: number | null
}

function fmt(n: number): string {
  return '$' + n.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function fmtDiff(diff: number | null): string {
  if (diff === null) return 'N/A'
  if (diff === 0) return '  OK'
  const sign = diff > 0 ? '+' : ''
  return `${sign}${diff.toFixed(2)}`
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log()
  console.log('='.repeat(180))
  console.log('  STAMP DUTY COMPARISON: Our Calculator vs money.com.au Reference')
  console.log('='.repeat(180))
  console.log()

  const discrepancies: ComparisonRow[] = []
  const allRows: ComparisonRow[] = []

  for (const scenario of scenarios) {
    console.log(`\n--- ${scenario.label} ---`)
    console.log(
      'State'.padEnd(5) + ' | ' +
      'Our SD'.padStart(12) + ' | ' +
      'Ref SD'.padStart(12) + ' | ' +
      'SD Diff'.padStart(10) + ' | ' +
      'Our MortReg'.padStart(12) + ' | ' +
      'Ref MortReg'.padStart(12) + ' | ' +
      'MR Diff'.padStart(10) + ' | ' +
      'Our Transfer'.padStart(12) + ' | ' +
      'Ref Transfer'.padStart(12) + ' | ' +
      'TF Diff'.padStart(10) + ' | ' +
      'Our FHOG'.padStart(10) + ' | ' +
      'Ref FHOG'.padStart(10) + ' | ' +
      'FHOG Diff'.padStart(10)
    )
    console.log('-'.repeat(180))

    for (const state of STATES) {
      const inputs: FormState = { ...BASE, ...scenario.ourOverrides, state }
      const calc = calculators[state]

      // Our calculations
      const ourSD = calc.calculateStampDuty(inputs)
      const ourMR = calc.calculateMortgageRegistrationFee(inputs)
      const ourTF = calc.calculateLandTransferFee(inputs)
      const fhogResult = calc.calculateFHOG(inputs)
      const ourFHOG = fhogResult.eligible ? fhogResult.grantAmount : 0

      // Reference API call
      const ref = await callMoneyApi(state, scenario.apiScenario)

      const refSD = ref ? parseFloat(ref.stamp_duty) : null
      const refMR = ref ? parseFloat(ref.mortgage_registration_fee) : null
      const refTF = ref ? parseFloat(ref.transfer_fee) : null
      const refFHOG = ref ? parseFloat(ref.fhb_grant) : null

      const sdDiff = refSD !== null ? ourSD - refSD : null
      const mrDiff = refMR !== null ? ourMR - refMR : null
      const tfDiff = refTF !== null ? ourTF - refTF : null
      const fhogDiff = refFHOG !== null ? ourFHOG - refFHOG : null

      const row: ComparisonRow = {
        state, scenario: scenario.label,
        ourStampDuty: ourSD, refStampDuty: refSD,
        ourMortReg: ourMR, refMortReg: refMR,
        ourTransfer: ourTF, refTransfer: refTF,
        ourFHOG: ourFHOG, refFHOG: refFHOG,
        stampDutyDiff: sdDiff, mortRegDiff: mrDiff,
        transferDiff: tfDiff, fhogDiff: fhogDiff,
      }
      allRows.push(row)

      const hasDiscrepancy = (sdDiff !== null && Math.abs(sdDiff) > 1) ||
        (mrDiff !== null && Math.abs(mrDiff) > 1) ||
        (tfDiff !== null && Math.abs(tfDiff) > 1) ||
        (fhogDiff !== null && Math.abs(fhogDiff) > 1)

      if (hasDiscrepancy) discrepancies.push(row)

      const marker = hasDiscrepancy ? ' !!!' : ''

      console.log(
        state.padEnd(5) + ' | ' +
        fmt(ourSD).padStart(12) + ' | ' +
        (refSD !== null ? fmt(refSD) : 'N/A').padStart(12) + ' | ' +
        fmtDiff(sdDiff).padStart(10) + ' | ' +
        fmt(ourMR).padStart(12) + ' | ' +
        (refMR !== null ? fmt(refMR) : 'N/A').padStart(12) + ' | ' +
        fmtDiff(mrDiff).padStart(10) + ' | ' +
        fmt(ourTF).padStart(12) + ' | ' +
        (refTF !== null ? fmt(refTF) : 'N/A').padStart(12) + ' | ' +
        fmtDiff(tfDiff).padStart(10) + ' | ' +
        fmt(ourFHOG).padStart(10) + ' | ' +
        (refFHOG !== null ? fmt(refFHOG) : 'N/A').padStart(10) + ' | ' +
        fmtDiff(fhogDiff).padStart(10) +
        marker
      )
    }
  }

  // ---------------------------------------------------------------------------
  // Summary of discrepancies
  // ---------------------------------------------------------------------------

  console.log()
  console.log('='.repeat(180))
  console.log('  DISCREPANCIES SUMMARY (differences > $1)')
  console.log('='.repeat(180))
  console.log()

  if (discrepancies.length === 0) {
    console.log('  No discrepancies found!')
  } else {
    console.log(`  Found ${discrepancies.length} test cases with discrepancies:`)
    console.log()

    for (const d of discrepancies) {
      console.log(`  ${d.state} | ${d.scenario}`)
      if (d.stampDutyDiff !== null && Math.abs(d.stampDutyDiff) > 1) {
        console.log(`    Stamp Duty: ours=${fmt(d.ourStampDuty)}, ref=${fmt(d.refStampDuty!)}, diff=${fmtDiff(d.stampDutyDiff)}`)
      }
      if (d.mortRegDiff !== null && Math.abs(d.mortRegDiff) > 1) {
        console.log(`    Mortgage Reg: ours=${fmt(d.ourMortReg)}, ref=${fmt(d.refMortReg!)}, diff=${fmtDiff(d.mortRegDiff)}`)
      }
      if (d.transferDiff !== null && Math.abs(d.transferDiff) > 1) {
        console.log(`    Transfer Fee: ours=${fmt(d.ourTransfer)}, ref=${fmt(d.refTransfer!)}, diff=${fmtDiff(d.transferDiff)}`)
      }
      if (d.fhogDiff !== null && Math.abs(d.fhogDiff) > 1) {
        console.log(`    FHOG Grant: ours=${fmt(d.ourFHOG)}, ref=${fmt(d.refFHOG!)}, diff=${fmtDiff(d.fhogDiff)}`)
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Pass/fail stats
  // ---------------------------------------------------------------------------

  console.log()
  const total = allRows.length
  const passing = total - discrepancies.length
  console.log(`  Total comparisons: ${total}, Passing: ${passing}, Failing: ${discrepancies.length}`)
  console.log()
}

main().catch(console.error)
