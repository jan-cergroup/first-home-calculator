export type AustralianState = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT'

export type PropertyPurpose = 'home' | 'investment'

export type PropertyType = 'established' | 'newlyConstructed' | 'vacantLand'

export type ChildrenCount = 0 | 1 | 2 | 3 | 4 | 5

export type BuyerType = 'single' | 'couple'

export type LoanTerm = 15 | 20 | 25 | 30

export interface FormState {
  propertyPurpose: PropertyPurpose
  state: AustralianState
  propertyValue: number
  yearlyIncome: number
  isFirstHomeBuyer: boolean
  isForeignPurchaser: boolean
  isEligiblePensioner: boolean
  propertyType: PropertyType
  childrenCount: ChildrenCount
  depositSavings: number
  monthlyExpenses: number
  hecsDebt: number
  buyerType: BuyerType
  isMetro: boolean
  interestRate: number
  loanTerm: LoanTerm
  transactionFees: number
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

export interface StampDutyConcessionResult {
  status: 'exempt' | 'concession' | 'fullRate'
  savings: number
  description: string
}

export interface FHDSResult {
  eligible: boolean
  reason: string
}

export interface LoanDetails {
  loanAmount: number
  lvr: number
  monthlyRepayment: number
  totalRepayment: number
  totalInterest: number
  lmiEstimate: number
}

export interface UpfrontCosts {
  deposit: number
  stampDuty: number
  lmi: number
  mortgageReg: number
  landTransfer: number
  transactionFees: number
  foreignSurcharge: number
  fhogOffset: number
  total: number
}

export interface EnhancedCalculatorResults {
  concessions: FHOGResult
  fees: FeesBreakdown
  stampDutyConcession: StampDutyConcessionResult
  fhds: FHDSResult
  loan: LoanDetails
  upfrontCosts: UpfrontCosts
}

export interface CalculatorResults {
  concessions: FHOGResult
  fees: FeesBreakdown
}

export interface StateFormConfig {
  showForeignPurchaser: boolean
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
  getStampDutyConcessionInfo(inputs: FormState): StampDutyConcessionResult
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
  NSW: { showForeignPurchaser: true, showPensioner: false, showNumberOfChildren: false, showForeignSurcharge: true },
  VIC: { showForeignPurchaser: true, showPensioner: true, showNumberOfChildren: false, showForeignSurcharge: true },
  QLD: { showForeignPurchaser: true, showPensioner: false, showNumberOfChildren: false, showForeignSurcharge: true },
  WA:  { showForeignPurchaser: true, showPensioner: false, showNumberOfChildren: false, showForeignSurcharge: true },
  SA:  { showForeignPurchaser: true, showPensioner: false, showNumberOfChildren: false, showForeignSurcharge: true },
  TAS: { showForeignPurchaser: true, showPensioner: false, showNumberOfChildren: false, showForeignSurcharge: true },
  ACT: { showForeignPurchaser: false, showPensioner: true, showNumberOfChildren: true, showForeignSurcharge: false },
  NT:  { showForeignPurchaser: false, showPensioner: true, showNumberOfChildren: false, showForeignSurcharge: false },
}

export const DEFAULT_FORM_STATE: FormState = {
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

export const FHDS_PRICE_CAPS: Record<AustralianState, { metro: number; regional: number }> = {
  NSW: { metro: 1500000, regional: 800000 },
  VIC: { metro: 950000, regional: 650000 },
  QLD: { metro: 1000000, regional: 700000 },
  WA:  { metro: 850000, regional: 600000 },
  SA:  { metro: 900000, regional: 500000 },
  TAS: { metro: 700000, regional: 550000 },
  ACT: { metro: 1000000, regional: 1000000 },
  NT:  { metro: 600000, regional: 600000 },
}

export const STATE_LOCATION_LABELS: Record<AustralianState, { metro: string; regional: string }> = {
  NSW: { metro: 'Sydney, Newcastle, Wollongong', regional: 'Rest of NSW' },
  VIC: { metro: 'Melbourne, Geelong', regional: 'Rest of VIC' },
  QLD: { metro: 'Brisbane, Gold Coast, Sunshine Coast', regional: 'Rest of QLD' },
  WA:  { metro: 'Perth', regional: 'Rest of WA' },
  SA:  { metro: 'Adelaide', regional: 'Rest of SA' },
  TAS: { metro: 'Hobart, Launceston', regional: 'Rest of TAS' },
  ACT: { metro: 'Canberra', regional: 'Canberra' },
  NT:  { metro: 'Darwin', regional: 'Rest of NT' },
}
