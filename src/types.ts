export type AustralianState = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT'

export type PropertyPurpose = 'home' | 'investment'

export type PropertyType = 'established' | 'newlyConstructed' | 'vacantLand'

export type ChildrenCount = 0 | 1 | 2 | 3 | 4 | 5

export interface FormState {
  propertyPurpose: PropertyPurpose
  state: AustralianState
  propertyValue: number
  totalIncome: number
  isFirstHomeBuyer: boolean
  isForeignPurchaser: boolean
  isEligiblePensioner: boolean
  propertyType: PropertyType
  childrenCount: ChildrenCount
}

export interface FHOGResult {
  eligible: boolean
  grantAmount: number
  message: string
}

export interface FeesBreakdown {
  mortgageRegistrationFee: number
  landTransferFee: number
  stampDuty: number
  foreignPurchaseSurcharge: number | null
  total: number
}

export interface CalculatorResults {
  concessions: FHOGResult
  fees: FeesBreakdown
}

export interface StateFormConfig {
  showForeignPurchaser: boolean
  showTotalIncome: boolean
  showPensioner: boolean
  showNumberOfChildren: boolean
  showForeignSurcharge: boolean
}

export interface StampDutyBracket {
  min: number
  max: number
  base: number
  rate: number
}

export interface StateCalculator {
  calculateStampDuty(inputs: FormState): number
  calculateFHOG(inputs: FormState): FHOGResult
  calculateMortgageRegistrationFee(inputs: FormState): number
  calculateLandTransferFee(inputs: FormState): number
  calculateForeignSurcharge(inputs: FormState): number | null
}

export const AUSTRALIAN_STATES: { value: AustralianState; label: string }[] = [
  { value: 'NSW', label: 'NSW' },
  { value: 'VIC', label: 'VIC' },
  { value: 'QLD', label: 'QLD' },
  { value: 'WA', label: 'WA' },
  { value: 'SA', label: 'SA' },
  { value: 'TAS', label: 'TAS' },
  { value: 'ACT', label: 'ACT' },
  { value: 'NT', label: 'NT' },
]

export const STATE_FORM_CONFIG: Record<AustralianState, StateFormConfig> = {
  NSW: { showForeignPurchaser: true, showTotalIncome: false, showPensioner: false, showNumberOfChildren: false, showForeignSurcharge: true },
  VIC: { showForeignPurchaser: true, showTotalIncome: false, showPensioner: true, showNumberOfChildren: false, showForeignSurcharge: true },
  QLD: { showForeignPurchaser: true, showTotalIncome: false, showPensioner: false, showNumberOfChildren: false, showForeignSurcharge: true },
  WA:  { showForeignPurchaser: true, showTotalIncome: false, showPensioner: false, showNumberOfChildren: false, showForeignSurcharge: true },
  SA:  { showForeignPurchaser: true, showTotalIncome: false, showPensioner: false, showNumberOfChildren: false, showForeignSurcharge: true },
  TAS: { showForeignPurchaser: true, showTotalIncome: false, showPensioner: false, showNumberOfChildren: false, showForeignSurcharge: true },
  ACT: { showForeignPurchaser: false, showTotalIncome: true, showPensioner: true, showNumberOfChildren: true, showForeignSurcharge: false },
  NT:  { showForeignPurchaser: false, showTotalIncome: false, showPensioner: true, showNumberOfChildren: false, showForeignSurcharge: false },
}

export const DEFAULT_FORM_STATE: FormState = {
  propertyPurpose: 'home',
  state: 'NSW',
  propertyValue: 650000,
  totalIncome: 142000,
  isFirstHomeBuyer: true,
  isForeignPurchaser: false,
  isEligiblePensioner: false,
  propertyType: 'established',
  childrenCount: 0,
}
