# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Vite dev server (localhost:5173)
- `npm run build` — Production build (tsc + vite build)
- `npm run lint` — ESLint
- `npm run preview` — Preview production build

## Architecture

Australian first home buyer calculator (FHOG Calculator clone of loans.com.au/calculators/fhog-calculator) built with React 19, Vite, TypeScript (strict), and Tailwind CSS v4.

### Calculation pipeline

`useCalculator` hook (`src/hooks/useCalculator.ts`) is the core orchestrator. It holds all form state via `useState` and computes results via `useMemo`. For a given property value and state it calculates: FHOG eligibility → stamp duty (with FHB concessions) → mortgage registration fee → land transfer fee → foreign surcharge.

### Key directories

- `src/calculations/` — Per-state calculators (each implements `StateCalculator` interface from types.ts)
  - `index.ts` — Dispatcher: calls the correct state module and assembles `CalculatorResults`
  - `utils.ts` — `calculateFromBrackets()` shared by all states
  - `nsw.ts`, `vic.ts`, `qld.ts`, `wa.ts`, `sa.ts`, `tas.ts`, `act.ts`, `nt.ts`
- `src/components/` — UI components
  - `Calculator.tsx` — Root: two-column layout, wires hook to form + results
  - `CalculatorForm.tsx` — Left column: all inputs, conditionally rendered per state
  - `CalculatorResults.tsx` — Right column: concession message, fee breakdown, assumptions modal
  - `RadioGroup.tsx`, `CurrencyInput.tsx`, `StateSelect.tsx` — Reusable input primitives
  - `InfoSection.tsx` — "What is FHOG?" + per-state descriptions
  - `FAQAccordion.tsx` — 4-item expandable FAQ
- `src/hooks/useCalculator.ts` — Core hook: form state + derived results
- `src/types.ts` — All types, `STATE_FORM_CONFIG`, `DEFAULT_FORM_STATE`, `AUSTRALIAN_STATES`

### Conventions

- All calculators are pure functions implementing the `StateCalculator` interface
- Path alias: `@/*` maps to `src/*` (configured in tsconfig.app.json + vite.config.ts)
- State-specific form fields controlled by `STATE_FORM_CONFIG` record in `src/types.ts`
- Stamp duty uses tiered bracket tables processed by `calculateFromBrackets()` in utils.ts
- Each state module exports a single `StateCalculator` object with 5 methods: `calculateStampDuty`, `calculateFHOG`, `calculateMortgageRegistrationFee`, `calculateLandTransferFee`, `calculateForeignSurcharge`
- Currency formatting uses `Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' })`
- Accent color: `#E91E8C` (pink/magenta), navy: `#1B1464` — defined as Tailwind theme tokens in `src/index.css`

### Dynamic form fields per state

| Field                | NSW | VIC | QLD | WA | SA | TAS | ACT | NT |
|----------------------|-----|-----|-----|----|----|-----|-----|----|
| Foreign purchaser?   | Yes | Yes | Yes | Yes| Yes| Yes | No  | No |
| Total income         | No  | No  | No  | No | No | No  | Yes | No |
| Pensioner?           | No  | Yes | No  | No | No | No  | Yes | Yes|
| Number of children   | No  | No  | No  | No | No | No  | Yes | No |
| Foreign surcharge    | Yes | Yes | Yes | Yes| Yes| Yes | No  | No |

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
