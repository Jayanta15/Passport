import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { MerchantProfile } from '../types';
import {
  calculateMarketPrice,
  computeMarkets,
  filterCompliance,
  PRICING_ASSUMPTIONS,
  READINESS_THRESHOLDS,
} from './compute';
import { merchantProfiles } from './profiles';

const expectedRoutes = {
  'loom-lore': { US: 'NOT_YET', GB: 'NOT_YET' },
  aavira: { US: 'DIRECT', GB: 'DIRECT' },
  vanya: { US: 'ENTITY', GB: 'ENTITY' },
} as const;

function readyProfile(): MerchantProfile {
  return structuredClone(merchantProfiles.find((profile) => profile.id === 'aavira')!);
}

function routeFor(profile: MerchantProfile) {
  return computeMarkets(profile)[0].route;
}

describe('entry-route fixtures', () => {
  for (const profile of merchantProfiles) {
    test(`${profile.name} keeps its intended US and UK routes`, () => {
      const routes = Object.fromEntries(computeMarkets(profile).map((market) => [market.country, market.route]));
      assert.deepEqual(routes, expectedRoutes[profile.id as keyof typeof expectedRoutes]);
    });
  }
});

describe('readiness boundaries', () => {
  test('demand requires both attempt and intent thresholds', () => {
    const profile = readyProfile();
    profile.markets[0].attempts = READINESS_THRESHOLDS.attempts;
    profile.markets[0].leakedInr = READINESS_THRESHOLDS.leakedInr;
    assert.equal(routeFor(profile), 'DIRECT');
    profile.markets[0].leakedInr -= 1;
    assert.equal(routeFor(profile), 'NOT_YET');
  });

  test('landed margin passes exactly at the headroom threshold', () => {
    const profile = readyProfile();
    const market = profile.markets[0];
    profile.grossMargin = READINESS_THRESHOLDS.marginHeadroom + 0.04 + market.dutyRate;
    assert.equal(routeFor(profile), 'DIRECT');
    profile.grossMargin -= 0.0001;
    assert.equal(routeFor(profile), 'NOT_YET');
  });

  test('domestic and international returns must both pass', () => {
    const profile = readyProfile();
    profile.domesticReturnRate = READINESS_THRESHOLDS.domesticReturnRate;
    profile.markets[0].returnRate = READINESS_THRESHOLDS.internationalReturnRate;
    assert.equal(routeFor(profile), 'MANAGED');
    profile.domesticReturnRate += 0.0001;
    assert.equal(routeFor(profile), 'NOT_YET');
  });

});

describe('route triggers', () => {
  test('a local returns requirement triggers Managed', () => {
    const profile = readyProfile();
    profile.localReturnsNeed = true;
    assert.equal(routeFor(profile), 'MANAGED');
  });

  test('local inventory and wholesale together trigger Entity', () => {
    const profile = readyProfile();
    profile.overseasInventory = true;
    assert.equal(routeFor(profile), 'DIRECT');
    profile.wholesaleRequirement = true;
    assert.equal(routeFor(profile), 'ENTITY');
  });

  test('a failed readiness gate cannot be overridden by entity triggers', () => {
    const profile = readyProfile();
    profile.wholesaleRequirement = true;
    profile.overseasInventory = true;
    profile.markets[0].attempts = READINESS_THRESHOLDS.attempts - 1;
    assert.equal(routeFor(profile), 'NOT_YET');
  });
});

describe('pricing assumptions', () => {
  for (const country of ['US', 'GB'] as const) {
    for (const plan of ['direct', 'managed'] as const) {
      test(`${country} ${plan} price includes fee, duty, tax and returns`, () => {
        const profile = readyProfile();
        const market = profile.markets.find((item) => item.country === country)!;
        const product = profile.products[0];
        const price = calculateMarketPrice(market, product, plan);
        const expectedFeeRate = plan === 'direct' ? PRICING_ASSUMPTIONS.directFeeRate : PRICING_ASSUMPTIONS.managedFeeRate;
        const expectedReturnRate = plan === 'direct' ? market.returnRate : market.returnRate * PRICING_ASSUMPTIONS.managedReturnFactor;

        assert.equal(price.feeRate, expectedFeeRate);
        assert.equal(price.returnRate, expectedReturnRate);
        assert.equal(price.duty, price.productLocal * market.dutyRate);
        assert.ok(Math.abs(price.fee - price.list * expectedFeeRate) < 1e-9);
        assert.ok(Math.abs(price.returns - price.list * expectedReturnRate) < 1e-9);
        assert.ok(Math.abs(price.tax - (price.list - price.list / (1 + market.taxRate))) < 1e-9);
      });
    }
  }

  test('merchant product-base override recalculates the price stack', () => {
    const profile = readyProfile();
    const market = profile.markets[0];
    const product = profile.products[0];
    const observed = calculateMarketPrice(market, product, 'direct');
    const overridden = calculateMarketPrice(market, product, 'direct', observed.productLocal * 1.25);

    assert.equal(overridden.productLocal, observed.productLocal * 1.25);
    assert.ok(Math.abs(overridden.duty - observed.duty * 1.25) < 1e-9);
    assert.ok(Math.abs(overridden.list - observed.list * 1.25) < 1e-9);
    assert.ok(Math.abs(overridden.fee - observed.fee * 1.25) < 1e-9);
    assert.ok(Math.abs(overridden.returns - observed.returns * 1.25) < 1e-9);
  });
});

describe('compliance filtering', () => {
  for (const country of ['US', 'GB'] as const) {
    test(`${country} gives Sohra apparel and bamboo requirements`, () => {
      const market = merchantProfiles.find((profile) => profile.id === 'aavira')!.markets.find((item) => item.country === country)!;
      const apparel = filterCompliance(market.compliance, 'apparel');
      const bamboo = filterCompliance(market.compliance, 'bamboo');

      assert.ok(apparel.some((item) => item.appliesTo === 'apparel'));
      assert.ok(bamboo.some((item) => item.appliesTo === 'bamboo'));
      assert.ok(!market.compliance.some((item) => item.appliesTo === 'jewellery'));
    });

    test(`${country} gives House of Sachi apparel and jewellery requirements`, () => {
      const market = merchantProfiles.find((profile) => profile.id === 'vanya')!.markets.find((item) => item.country === country)!;
      const apparel = filterCompliance(market.compliance, 'apparel');
      const jewellery = filterCompliance(market.compliance, 'jewellery');

      assert.ok(apparel.some((item) => item.appliesTo === 'apparel'));
      assert.ok(jewellery.some((item) => item.appliesTo === 'jewellery'));
      assert.ok(!market.compliance.some((item) => item.appliesTo === 'bamboo'));
    });
  }
});