import { MerchantProfile, ProductLine } from '../types';
import { complianceFor } from './compliance-repository';

const products: ProductLine[] = [
  { hs: '5007.20', itcHs: '50072010', kind: 'apparel', name: 'Handwoven silk sarees', materials: 'Silk, zari', priceInr: 28000, revenueShare: 0.42, weightKg: 0.9 },
  { hs: '6204.43', itcHs: '62044390', kind: 'apparel', name: 'Designer occasion sets', materials: 'Silk blend, embroidery', priceInr: 36000, revenueShare: 0.33, weightKg: 1.4 },
  { hs: '7113.11', itcHs: '71131190', kind: 'jewellery', name: 'Artisan silver jewellery', materials: '925 silver, enamel, semi-precious stones', priceInr: 18000, revenueShare: 0.25, weightKg: 0.3 },
];

const sohraProducts: ProductLine[] = [
  { hs: '6204.43', itcHs: '62044390', kind: 'apparel', name: 'Contemporary Jainsem sets', materials: 'Handwoven cotton, eri silk', priceInr: 32000, revenueShare: 0.48, weightKg: 1.2 },
  { hs: '6214.90', itcHs: '62149090', kind: 'apparel', name: 'Meghalaya woven wraps', materials: 'Eri silk, natural-dyed cotton', priceInr: 18000, revenueShare: 0.29, weightKg: 0.7 },
  { hs: '4602.11', itcHs: '46021100', kind: 'bamboo', name: 'Finished bamboo accessories', materials: 'Treated bamboo, handwoven textile lining', priceInr: 12000, revenueShare: 0.23, weightKg: 0.6 },
];

const markets = (
  profileId: string,
  scale: 'early' | 'ready' | 'scaled',
  hsMix: Array<{ hs: string; share: number }> = [
    { hs: '5007.20', share: 0.45 },
    { hs: '6204.43', share: 0.3 },
    { hs: '7113.11', share: 0.25 },
  ],
) => {
  const multiplier = scale === 'early' ? 0.28 : scale === 'ready' ? 1 : 2.4;
  const quality = scale === 'early' ? { returns: 0.17 } : scale === 'ready' ? { returns: 0.08 } : { returns: 0.12 };
  return [
    {
      country: 'US' as const, countryName: 'United States', currency: 'USD' as const, fxRate: 88.4,
      attempts: Math.round(176 * multiplier), declined: Math.round(121 * multiplier), leakedInr: Math.round(1840000 * multiplier),
      aovInr: scale === 'early' ? 9200 : scale === 'ready' ? 28400 : 42000, repeatRate: scale === 'early' ? 0.12 : 0.36,
      returnRate: quality.returns, dutyRate: 0.12, taxRate: 0,
      hsMix,
      compliance: complianceFor(profileId, 'US'),
    },
    {
      country: 'GB' as const, countryName: 'United Kingdom', currency: 'GBP' as const, fxRate: 118.2,
      attempts: Math.round(104 * multiplier), declined: Math.round(73 * multiplier), leakedInr: Math.round(980000 * multiplier),
      aovInr: scale === 'early' ? 8600 : scale === 'ready' ? 24800 : 36800, repeatRate: scale === 'early' ? 0.1 : 0.31,
      returnRate: quality.returns + 0.01, dutyRate: 0.1, taxRate: 0.2,
      hsMix,
      compliance: complianceFor(profileId, 'GB'),
    },
  ];
};

export const merchantProfiles: MerchantProfile[] = [
  {
    id: 'loom-lore', name: 'Loom & Lore', city: 'Kolkata', stage: 'Emerging atelier',
    descriptor: 'Handwoven sarees and small-batch silver adornment', category: 'Indian Heritage Fashion & Jewellery',
    annualRevenueInr: 14000000, netWorthInr: 4500000, grossMargin: 0.46, domesticAovInr: 11800, domesticReturnRate: 0.12,
    countriesSeen: 6, wholesaleRequirement: false, overseasInventory: false, localReturnsNeed: false, products,
    markets: markets('loom-lore', 'early'),
  },
  {
    id: 'aavira', name: 'Sohra Studio', city: 'Shillong', stage: 'Export-ready D2C',
    descriptor: 'Contemporary Jainsem occasionwear and finished bamboo accessories', category: 'Indian Heritage Fashion & Jewellery',
    annualRevenueInr: 68000000, netWorthInr: 18000000, grossMargin: 0.68, domesticAovInr: 22600, domesticReturnRate: 0.06,
    countriesSeen: 14, wholesaleRequirement: false, overseasInventory: false, localReturnsNeed: false, products: sohraProducts,
    markets: markets('aavira', 'ready', [
      { hs: '6204.43', share: 0.48 },
      { hs: '6214.90', share: 0.29 },
      { hs: '4602.11', share: 0.23 },
    ]),
  },
  {
    id: 'vanya', name: 'House of Sachi', city: 'Mumbai', stage: 'Scaled omnichannel',
    descriptor: 'Luxury occasionwear and collectible designer jewellery', category: 'Indian Heritage Fashion & Jewellery',
    annualRevenueInr: 310000000, netWorthInr: 92000000, grossMargin: 0.72, domesticAovInr: 48500, domesticReturnRate: 0.07,
    countriesSeen: 21, wholesaleRequirement: true, overseasInventory: true, localReturnsNeed: true, products,
    markets: markets('vanya', 'scaled'),
  },
];