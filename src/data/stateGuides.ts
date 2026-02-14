import type { AustralianState } from '../types'

export interface StateGuide {
  slug: string
  code: AustralianState
  name: string
  description: string
}

export const STATE_GUIDES: StateGuide[] = [
  {
    slug: 'nsw',
    code: 'NSW',
    name: 'New South Wales',
    description: 'First Home Buyers Assistance Scheme with stamp duty exemptions up to $800,000 and concessions up to $1,000,000.',
  },
  {
    slug: 'vic',
    code: 'VIC',
    name: 'Victoria',
    description: 'First Home Owner Grant of $10,000 for new homes plus stamp duty exemptions up to $600,000 and concessions up to $750,000.',
  },
  {
    slug: 'qld',
    code: 'QLD',
    name: 'Queensland',
    description: 'Generous $30,000 First Home Owner Grant for new homes and stamp duty concessions for established properties.',
  },
  {
    slug: 'wa',
    code: 'WA',
    name: 'Western Australia',
    description: '$10,000 First Home Owner Grant for new homes with discounted stamp duty rates for first home buyers.',
  },
  {
    slug: 'sa',
    code: 'SA',
    name: 'South Australia',
    description: '$15,000 First Home Owner Grant for new homes with no stamp duty on properties up to $650,000 for eligible buyers.',
  },
  {
    slug: 'tas',
    code: 'TAS',
    name: 'Tasmania',
    description: '$10,000 First Home Owner Grant for new homes plus a 50% stamp duty discount for first home buyers.',
  },
  {
    slug: 'act',
    code: 'ACT',
    name: 'Australian Capital Territory',
    description: 'Home Buyer Concession Scheme offering full stamp duty exemption based on income thresholds — no separate FHOG.',
  },
  {
    slug: 'nt',
    code: 'NT',
    name: 'Northern Territory',
    description: 'Unique grants for both new ($50,000) and established ($10,000) homes, plus stamp duty concessions.',
  },
]

export function getGuideBySlug(slug: string): StateGuide | undefined {
  return STATE_GUIDES.find((g) => g.slug === slug)
}
