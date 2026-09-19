import {
  ComplianceItem,
  ComputedMarket,
  MarketSignal,
  MerchantProfile,
  ProductKind,
  ProductLine,
  ReadinessResult,
  RouteRecommendation,
} from '../types';

export const READINESS_THRESHOLDS = {
  attempts: 80,
  leakedInr: 500000,
  marginHeadroom: 0.2,
  domesticReturnRate: 0.1,
  internationalReturnRate: 0.14,
  managedReturnRate: 0.11,
} as const;

export const PRICING_ASSUMPTIONS = {
  directFeeRate: 0.04,
  managedFeeRate: 0.1,
  managedReturnFactor: 0.72,
  targetContributionRate: 0.25,
} as const;

const FLOATING_POINT_TOLERANCE = 1e-10;

export type PricingPlan = 'direct' | 'managed';

export function calculateMarketPrice(market: MarketSignal, product: ProductLine, plan: PricingPlan, productBaseLocal?: number) {
  const productLocal = productBaseLocal ?? product.priceInr / market.fxRate;
  const feeRate = plan === 'direct' ? PRICING_ASSUMPTIONS.directFeeRate : PRICING_ASSUMPTIONS.managedFeeRate;
  const returnRate = plan === 'direct' ? market.returnRate : market.returnRate * PRICING_ASSUMPTIONS.managedReturnFactor;
  const duty = productLocal * market.dutyRate;
  const targetNet = (productLocal + duty) / (1 - feeRate - returnRate - PRICING_ASSUMPTIONS.targetContributionRate);
  const list = targetNet * (1 + market.taxRate);
  const fee = list * feeRate;
  const returns = list * returnRate;
  const tax = list - list / (1 + market.taxRate);
  const merchantNet = list - fee - returns - tax - duty;

  return { productLocal, duty, fee, returns, tax, list, merchantNet, feeRate, returnRate };
}

export function filterCompliance(items: ComplianceItem[], productKind: ProductKind) {
  return items.filter((item) => !item.appliesTo || item.appliesTo === 'all' || item.appliesTo === productKind);
}

export function routeLabel(route: RouteRecommendation) {
  return {
    NOT_YET: 'Not yet',
    DIRECT: 'Launch from India',
    MANAGED: 'Razorpay Managed',
    ENTITY: 'Set up entity',
  }[route];
}

export function computeMarkets(profile: MerchantProfile): ComputedMarket[] {
  return profile.markets.map((market) => {
    const crossBorderLoad = 0.04 + market.dutyRate;
    const marginHeadroom = profile.grossMargin - crossBorderLoad;
    const readiness: ReadinessResult[] = [
      {
        id: 'demand',
        label: 'Demand depth',
        passed: market.attempts >= READINESS_THRESHOLDS.attempts && market.leakedInr >= READINESS_THRESHOLDS.leakedInr,
        actual: `${market.attempts} attempts`,
        target: '80 attempts + ₹5L intent',
        message: 'Not enough concentrated demand to justify an active launch.',
      },
      {
        id: 'margin',
        label: 'Landed margin',
        passed: marginHeadroom + FLOATING_POINT_TOLERANCE >= READINESS_THRESHOLDS.marginHeadroom,
        actual: `${Math.round(marginHeadroom * 100)}% headroom`,
        target: '20% after duty & payment',
        message: 'Current pricing does not safely absorb cross-border costs.',
      },
      {
        id: 'returns',
        label: 'Return readiness',
        passed: profile.domesticReturnRate <= READINESS_THRESHOLDS.domesticReturnRate
          && market.returnRate <= READINESS_THRESHOLDS.internationalReturnRate,
        actual: `${Math.round(market.returnRate * 100)}% projected`,
        target: '≤14% international returns',
        message: 'Sizing and returns operations need to stabilize first.',
      },
    ];

    const demandPass = readiness[0].passed;
    const allPass = readiness.every((item) => item.passed);
    let verdict: ComputedMarket['verdict'] = 'WATCHING';
    if (demandPass) verdict = allPass ? 'GO' : 'WAIT';
    else if (market.attempts >= 30) verdict = 'WAIT';

    let route: RouteRecommendation = 'NOT_YET';
    let routeReason = 'Demand and operating readiness do not yet support an international launch.';
    if (verdict === 'GO') {
      if (profile.wholesaleRequirement && profile.overseasInventory) {
        route = 'ENTITY';
        routeReason = 'Local inventory and a wholesale channel require a durable local seller relationship.';
      } else if (profile.localReturnsNeed || market.returnRate >= READINESS_THRESHOLDS.managedReturnRate) {
        route = 'MANAGED';
        routeReason = 'Demand is ready, but tax, disputes and return operations make managed liability economical.';
      } else {
        route = 'DIRECT';
        routeReason = 'The brand can export directly from India without paying for a foreign entity or managed liability.';
      }
    }

    const firstFail = readiness.find((item) => !item.passed);
    const nextThreshold = firstFail
      ? `${firstFail.label}: move from ${firstFail.actual} to ${firstFail.target}.`
      : route === 'DIRECT'
        ? 'Reassess when local inventory, hiring or wholesale requirements appear.'
        : 'Review the route each quarter as international GMV and returns change.';

    return { ...market, verdict, route, readiness, routeReason, nextThreshold };
  });
}