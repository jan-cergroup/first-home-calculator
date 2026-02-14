# First Home Buyer Calculator

A free online calculator for Australian first home buyers at [firsthomebuyercalculator.com.au](https://firsthomebuyercalculator.com.au).

## What it does

Estimates the full cost of buying your first home in Australia, including:

- **Stamp duty** with state-specific first home buyer concessions and exemptions
- **First Home Owners Grant (FHOG)** eligibility and amount by state
- **First Home Guarantee (FHDS)** scheme eligibility based on price caps, income, and LVR
- **Borrowing power** based on income, expenses, HECS debt, and HEM benchmarks
- **Lenders Mortgage Insurance (LMI)** estimates (waived when FHDS eligible)
- **Upfront costs** breakdown — deposit, stamp duty, registration fees, transfer fees, conveyancing
- **Monthly repayments** with principal & interest over 15–30 year terms

Everything runs in the browser. No data is sent to any server.

## States and territories

All 8 Australian states and territories are supported, each with their own stamp duty rates, concession thresholds, grant amounts, and government fees:

| State | FHOG (new homes) | Stamp duty FHB concession |
|-------|-------------------|---------------------------|
| NSW | $10,000 (up to $600k) | Exempt up to $800k, sliding to $1M |
| VIC | $10,000 (up to $750k) | Exempt up to $600k, sliding to $750k |
| QLD | $30,000 (up to $750k) | New homes exempt (from May 2025); established homes concession up to $800k |
| WA | $10,000 (up to $750k) | Varies by property type |
| SA | $15,000 | Full exemption for eligible properties |
| TAS | $10,000 (no price cap) | 50% discount on duty |
| ACT | No grant (replaced by HBCS) | Full stamp duty concession via Home Buyer Concession Scheme |
| NT | $10,000–$50,000 | Stamp duty concessions available |

## First Home Guarantee (FHDS) price caps

The calculator checks eligibility against current property price caps (October 2025):

| State | Capital city / metro | Regional |
|-------|---------------------|----------|
| NSW | $1,500,000 | $800,000 |
| VIC | $950,000 | $650,000 |
| QLD | $1,000,000 | $700,000 |
| WA | $850,000 | $600,000 |
| SA | $900,000 | $500,000 |
| TAS | $700,000 | $550,000 |
| ACT | $1,000,000 | $1,000,000 |
| NT | $600,000 | $600,000 |

Income caps: $125,000 (single) / $200,000 (couple).

## Accuracy

Stamp duty calculations for NSW, VIC, and QLD have been verified against [calculatorsaustralia.com.au](https://stampduty.calculatorsaustralia.com.au/). Other figures are estimates:

- **LMI** uses approximate lookup tables — actual premiums vary by lender
- **Borrowing power** uses a DTI model with 3% interest rate buffer — lenders may assess differently
- **HEM benchmarks** are approximate — real values are proprietary Melbourne Institute data
- **HECS repayment** thresholds are based on 2024–25 ATO rates

## Known limitations

- WA stamp duty is missing the "First Home Owner Rate of Duty" brackets
- WA land transfer fee formula is incomplete
- SA land transfer fee is off by ~$12

## Disclaimer

This calculator provides estimates only. Contact your state revenue office for exact stamp duty figures and grant eligibility.
