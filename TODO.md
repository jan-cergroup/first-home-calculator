# TODO — First Home Calculator

## Priority 1: Fix calculation accuracy

### WA stamp duty (currently $26,050, should be $20,445 at $650k FHB newly constructed)

**What's wrong:** The WA stamp duty for first home buyers uses a special "First Home Owner Rate of Duty" which is a completely separate rate table from both the general and residential rates. My current code applies the residential rate with no FHB concession above $530k.

**What to investigate:**
- The WA "First Home Owner Rate of Duty" applies for properties up to $700k (house+land) or $450k (vacant land)
- Brackets found in `.firecrawl/stampduty-wa.md` line 263-269 show the residential rate but NOT the FHB rate
- The FHB rate has different brackets: $0-100k nil, then escalating rates up to $500k-700k bracket
- Need to find the exact FHB rate brackets that produce $20,445 at $650k
- Likely source: WA Revenue Online duty calculator or WA Duties Act 2008 Schedule 2B

**Files to edit:** `src/calculations/wa.ts` — add FHB-specific bracket table and apply it when `isFirstHomeBuyer && propertyPurpose === 'home'`

### WA land transfer fee (currently $285, should be $347 at $650k)

**What's wrong:** My tiered lookup table doesn't match the actual WA Landgate fee schedule.

**What to investigate:**
- `.firecrawl/stampduty-wa.md` line 229 says: "$174.70 for land up to $85,000; $184.70 for $85,001-$120,000; $204.70 for $120,001-$200,000 and then $20 for every $100,000 or part thereof"
- But that formula gives $204.70 + $20*5 = $304.70 at $650k, not $347
- The Landgate fee likely has additional components (e.g., a "consideration fee") not captured in that summary
- Need to check Landgate's actual Transfer of Land fee schedule

**Files to edit:** `src/calculations/wa.ts` — `calculateLandTransferFee()`

### SA land transfer fee (currently $6,474, should be $6,462 at $650k)

**What's wrong:** My SA land transfer formula is approximate. Off by $12.

**What to investigate:**
- SA Lands Titles Office registration fee schedule
- The formula is likely: base fee + incremental per $1k or $10k of property value
- May need precise base amounts and per-unit fees

**Files to edit:** `src/calculations/sa.ts` — `calculateLandTransferFee()`

## Priority 2: Additional test scenarios

Test these scenarios against the live calculator to verify broader accuracy:

- [ ] All states with $400,000 / FHB / established — tests FHB stamp duty exemptions at lower values
- [ ] All states with $800,000 / FHB / newly constructed — tests value cap behaviour
- [ ] All states with $650,000 / NOT FHB / established — tests non-FHB rates
- [ ] All states with $650,000 / investment — tests investment/general rates
- [ ] NSW with $650,000 / FHB / foreign purchaser — tests foreign surcharge
- [ ] ACT with different income levels and children counts — tests HBCS thresholds
- [ ] NT with established home / FHB — tests NT $10k grant for established

## Priority 3: Polish and features

- [ ] Add responsive sticky positioning for results panel on desktop (`sticky top-4`)
- [ ] Improve mobile layout — radio buttons should wrap better on small screens
- [ ] Add number formatting on CurrencyInput while typing (currently only on blur)
- [ ] Add loading/transition animation when switching states
- [ ] Consider adding a "Reset" button to restore defaults
- [ ] Add page metadata (description, og tags) for SEO
- [ ] Replace vite.svg favicon with a custom icon

## Priority 4: Testing infrastructure

- [ ] Set up Vitest (`npm install -D vitest`)
- [ ] Write unit tests for each state's calculation module using the verified test data
- [ ] Test stamp duty bracket boundary conditions (exact threshold values)
- [ ] Test FHB eligibility edge cases (property type, value caps, investment)
- [ ] Test ACT HBCS income thresholds with different children counts

## Notes

### How the StateCalculator interface works

Each state module in `src/calculations/` exports an object implementing `StateCalculator` (defined in `src/types.ts`). The dispatcher in `src/calculations/index.ts` looks up the correct module by state code and calls all 5 methods:

```
calculateStampDuty(inputs) → number
calculateFHOG(inputs) → { eligible, grantAmount, message }
calculateMortgageRegistrationFee(inputs) → number
calculateLandTransferFee(inputs) → number
calculateForeignSurcharge(inputs) → number | null (null = not applicable for this state)
```

### How to add/fix a state's calculations

1. Open `src/calculations/{state}.ts`
2. Modify the bracket tables or calculation logic
3. Run `npm run build` to type-check
4. Run `npm run dev` and test in browser — results update live
5. Compare against reference values in the table above (or test against the live calculator)

### Key architectural decisions

- **One file per state** (not one file per concept) because each state has unique enough rules that a shared abstraction adds complexity without benefit
- **`calculateFromBrackets()` in utils.ts** is the only shared logic — it applies a standard tiered bracket calculation
- **`STATE_FORM_CONFIG` in types.ts** controls which form fields show per state — modify this record to change field visibility
- **ACT has no FHOG** — it uses the Home Buyer Concession Scheme (HBCS) which is a stamp duty exemption, not a grant. The FHOG result always returns "not eligible" for ACT; the concession is reflected in $0 stamp duty.
