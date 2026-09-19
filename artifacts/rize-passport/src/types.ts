export type RouteRecommendation = 'NOT_YET' | 'DIRECT' | 'MANAGED' | 'ENTITY';
export type ProductKind = 'apparel' | 'jewellery' | 'bamboo';
export type ComplianceLevel = 'required' | 'conditional' | 'recommended';

export type ProductLine = {
  hs: string;
  itcHs: string;
  kind: ProductKind;
  name: string;
  materials: string;
  priceInr: number;
  revenueShare: number;
  weightKg: number;
};

export type ComplianceItem = {
  level: ComplianceLevel;
  requirementType: 'Registration' | 'Tax setup' | 'Customs setup' | 'Product rule' | 'Conditional approval';
  title: string;
  detail: string;
  issuer: string;
  helper: string;
  source: string;
  sourceUrl: string;
  appliesTo?: ProductKind | 'all';
};

export type MarketSignal = {
  country: 'US' | 'GB';
  countryName: string;
  currency: 'USD' | 'GBP';
  fxRate: number;
  attempts: number;
  declined: number;
  leakedInr: number;
  aovInr: number;
  repeatRate: number;
  returnRate: number;
  dutyRate: number;
  taxRate: number;
  hsMix: Array<{ hs: string; share: number }>;
  compliance: ComplianceItem[];
};

export type MerchantProfile = {
  id: string;
  name: string;
  city: string;
  stage: string;
  descriptor: string;
  category: string;
  annualRevenueInr: number;
  netWorthInr: number;
  grossMargin: number;
  domesticAovInr: number;
  domesticReturnRate: number;
  countriesSeen: number;
  wholesaleRequirement: boolean;
  overseasInventory: boolean;
  localReturnsNeed: boolean;
  products: ProductLine[];
  markets: MarketSignal[];
};

export type ReadinessResult = {
  id: string;
  label: string;
  passed: boolean;
  actual: string;
  target: string;
  message: string;
};

export type ComputedMarket = MarketSignal & {
  verdict: 'GO' | 'WAIT' | 'WATCHING';
  route: RouteRecommendation;
  readiness: ReadinessResult[];
  routeReason: string;
  nextThreshold: string;
};