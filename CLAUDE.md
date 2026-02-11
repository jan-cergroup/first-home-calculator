# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Vite dev server (localhost:5173)
- `npm run build` — Production build (tsc + vite build)
- `npm run lint` — ESLint
- `npm run preview` — Preview production build

## Architecture

Australian first home buyer calculator built with React 19, Vite, TypeScript (strict), and Tailwind CSS v4. All calculations are client-side, no backend.

### Calculation pipeline

`useCalculator` hook (`src/hooks/useCalculator.ts`) is the core orchestrator. It holds all form state via `useState` and computes `EnhancedCalculatorResults` via `useMemo`. The dispatcher (`src/calculations/index.ts`) runs:

1. **State fees** — FHOG eligibility, stamp duty (with FHB concessions), mortgage reg, land transfer, foreign surcharge
2. **Stamp duty concession info** — metadata about exemption/concession status and savings amount
3. **FHDS eligibility** — First Home Guarantee scheme check (price caps, LVR, income)
4. **Loan calculations** — P&I monthly repayment, LVR, total repayment/interest
5. **LMI estimate** — lookup table by LVR band × price bucket (waived if FHDS eligible)
6. **Borrowing power** — max loan using DTI 0.6 at assessment rate (interest + 3% buffer), HEM benchmark, HECS
7. **Upfront costs** — all fees + deposit + LMI - FHOG offset

### Key directories

- `src/calculations/` — Per-state calculators (each implements `StateCalculator` interface from types.ts)
  - `index.ts` — Dispatcher: calls the correct state module and assembles `EnhancedCalculatorResults`
  - `utils.ts` — `calculateFromBrackets()` shared by all states
  - `nsw.ts`, `vic.ts`, `qld.ts`, `wa.ts`, `sa.ts`, `tas.ts`, `act.ts`, `nt.ts` — State-specific fee logic
  - `loanCalculations.ts` — P&I amortization, LVR, max borrowing power
  - `lmiCalculation.ts` — LMI lookup table (LVR 81-95%, 5 price buckets)
  - `hecsCalculation.ts` — ATO 2024-25 HECS repayment rate thresholds
  - `expensesCalculation.ts` — HEM (Household Expenditure Measure) benchmarks
  - `fhdsCalculation.ts` — First Home Guarantee scheme eligibility
- `src/components/` — UI components
  - `Calculator.tsx` — Root: two-column layout, wires hook to form + results
  - `CalculatorForm.tsx` — Left column: property, about you, finances, advanced settings sections
  - `CalculatorResults.tsx` — Right column: summary cards, government schemes, cost breakdown, loan summary
  - `SelectInput.tsx` — Generic dropdown (`<select>`) with bottom-border style
  - `CheckboxInput.tsx` — Custom styled checkbox with accent color
  - `CurrencyInput.tsx` — Currency input with `$` prefix and bottom-border style
  - `NumberInput.tsx` — Numeric input with optional suffix (e.g. `%`) and bottom-border style
  - `CollapsibleSection.tsx` — Collapsible panel with section header styling and accent underline
  - `InfoSection.tsx` — "What is FHOG?" + per-state descriptions
  - `FAQAccordion.tsx` — 4-item expandable FAQ
- `src/hooks/useCalculator.ts` — Core hook: form state + derived results + generic `updateField` setter
- `src/types.ts` — All types, constants (`STATE_FORM_CONFIG`, `DEFAULT_FORM_STATE`, `FHDS_PRICE_CAPS`, `STATE_LOCATION_LABELS`)
- `src/utils/format.ts` — Shared `formatCurrency()` and `formatPercentage()`

### Conventions

- All calculators are pure functions implementing the `StateCalculator` interface (6 methods)
- Path alias: `@/*` maps to `src/*` (configured in tsconfig.app.json + vite.config.ts)
- State-specific form fields controlled by `STATE_FORM_CONFIG` record in `src/types.ts`
- Stamp duty uses tiered bracket tables processed by `calculateFromBrackets()` in utils.ts
- Each state module exports a `StateCalculator` object with 6 methods: `calculateStampDuty`, `calculateFHOG`, `calculateMortgageRegistrationFee`, `calculateLandTransferFee`, `calculateForeignSurcharge`, `getStampDutyConcessionInfo`
- Currency formatting via shared `formatCurrency()` in `src/utils/format.ts`
- Form uses generic `updateField<K>(field, value)` pattern — no individual setter props
- Color scheme: forest green — defined as Tailwind theme tokens in `src/index.css`:
  - Accent: `#2E7D52` (forest green), light: `#E6F4EC`, dark: `#236841`
  - Navy: `#1A3329` (dark forest), light: `#264D3A`
- Domain: `firsthomebuyercalculator.com.au`
- Favicon: `public/favicon.svg` (house icon in accent green)
- Header: logo bar (house icon + wordmark) + hero section
- Footer: copyright + disclaimer

### FormState fields

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| propertyPurpose | `'home' \| 'investment'` | `'home'` | |
| state | `AustralianState` | `'NSW'` | |
| propertyValue | `number` | `650000` | |
| yearlyIncome | `number` | `100000` | Gross, all purchasers |
| isFirstHomeBuyer | `boolean` | `true` | |
| isForeignPurchaser | `boolean` | `false` | |
| isEligiblePensioner | `boolean` | `false` | |
| propertyType | `PropertyType` | `'established'` | |
| childrenCount | `ChildrenCount` | `0` | ACT only |
| depositSavings | `number` | `65000` | |
| monthlyExpenses | `number` | `2000` | |
| hecsDebt | `number` | `0` | |
| buyerType | `'single' \| 'couple'` | `'single'` | |
| isMetro | `boolean` | `true` | Affects FHDS price caps |
| interestRate | `number` | `6.5` | % p.a. |
| loanTerm | `15 \| 20 \| 25 \| 30` | `30` | Years |
| transactionFees | `number` | `3000` | Conveyancing, inspections, etc. |

### Dynamic form fields per state

| Field                | NSW | VIC | QLD | WA | SA | TAS | ACT | NT |
|----------------------|-----|-----|-----|----|----|-----|-----|----|
| Foreign purchaser?   | Yes | Yes | Yes | Yes| Yes| Yes | No  | No |
| Pensioner?           | No  | Yes | No  | No | No | No  | Yes | Yes|
| Number of children   | No  | No  | No  | No | No | No  | Yes | No |
| Foreign surcharge    | Yes | Yes | Yes | Yes| Yes| Yes | No  | No |

Fields always shown: property purpose, state, location (metro/regional), property value, property type, buyer type, first home buyer, deposit, yearly income, monthly expenses, HECS debt. Advanced settings (interest rate, loan term, transaction fees) are in a collapsed section.

### FHDS price caps (Oct 2025)

| State | Metro | Regional |
|-------|-------|----------|
| NSW | $1.5M | $800k |
| VIC | $950k | $650k |
| QLD | $1M | $700k |
| WA | $850k | $600k |
| SA | $900k | $500k |
| TAS | $700k | $550k |
| ACT | $1M | $1M |
| NT | $600k | $600k |

### Reference data

Scraped content from the live calculator is in `.firecrawl/` (gitignored):
- `fhog-calculator.md` — Full page content including FAQ text and state descriptions
- `fhog-calculator-section.png`, `fhog-calculator-bottom.png` — UI screenshots
- `stampduty-nsw.md`, `stampduty-vic.md`, `stampduty-qld.md`, `stampduty-wa.md` — Rate tables from calculatorsaustralia.com.au

### Verified test data ($650,000, first home buyer, newly constructed)

| State | FHOG    | Mort Reg | Land Transfer | Stamp Duty | Foreign Surcharge | Status   |
|-------|---------|----------|---------------|------------|-------------------|----------|
| NSW   | Not elig| $176     | $176          | $0         | $0                | PASS     |
| VIC   | $10,000 | $136     | $1,633        | $11,357    | $0                | PASS     |
| QLD   | $30,000 | $238     | $2,340        | $0         | $0                | PASS     |
| WA    | $10,000 | $217     | $285→$347     | $26,050→$20,445 | $0           | FAIL     |
| SA    | $15,000 | $198     | $6,474→$6,462 | $0         | $0                | ~$12 off |
| TAS   | $10,000 | $163     | $250          | $24,623    | $0                | PASS     |
| ACT   | Not elig| $178     | $479          | $0         | N/A               | PASS     |
| NT    | $50,000 | $176     | $176          | $0         | N/A               | PASS     |

Reference values (→target) are from the live loans.com.au calculator.

### Known issues

- WA stamp duty needs "First Home Owner Rate of Duty" brackets (separate from general/residential)
- WA land transfer fee formula is incomplete — Landgate fees have components beyond basic schedule
- SA land transfer fee off by ~$12 — needs exact fee schedule from SA Lands Titles Office
- LMI lookup table uses approximate rates — actual premiums vary by lender
- HEM benchmarks are approximate — real values are proprietary Melbourne Institute data
- HECS thresholds are 2024-25 rates — will need annual updates
