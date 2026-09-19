import { ComplianceItem } from '../types';

const indiaCore: ComplianceItem[] = [
  {
    level: 'required',
    requirementType: 'Registration',
    title: 'Importer Exporter Code (IEC)',
    detail: 'The baseline business identifier required by DGFT before exporting goods from India. Keep the IEC profile and linked GST details current.',
    issuer: 'Directorate General of Foreign Trade (DGFT)',
    helper: 'Chartered accountant, company secretary or export consultant',
    source: 'DGFT IEC services · reviewed Sep 2026',
    sourceUrl: 'https://www.dgft.gov.in/',
    appliesTo: 'all',
  },
  {
    level: 'required',
    requirementType: 'Tax setup',
    title: 'GST registration and export tax route',
    detail: 'Set up GST for merchandise exports and choose either LUT export without IGST payment or export on payment with a refund claim. This is tax setup, not a product licence.',
    issuer: 'GST authorities / CBIC',
    helper: 'GST practitioner or chartered accountant',
    source: 'DGFT E-Commerce Exports Handbook for MSMEs · reviewed Sep 2026',
    sourceUrl: 'https://content.dgft.gov.in/Website/EcommExportHandbokMSME_E.pdf',
    appliesTo: 'all',
  },
  {
    level: 'required',
    requirementType: 'Customs setup',
    title: 'AD code and export documentation setup',
    detail: 'Link the authorised-dealer bank code to the chosen customs or courier-export flow and prepare the commercial invoice, packing list, ITC-HS classification and export declaration.',
    issuer: 'Authorised dealer bank and Indian Customs',
    helper: 'Bank trade desk and customs broker',
    source: 'DGFT E-Commerce Exports Handbook for MSMEs · reviewed Sep 2026',
    sourceUrl: 'https://content.dgft.gov.in/Website/EcommExportHandbokMSME_E.pdf',
    appliesTo: 'all',
  },
];

const sohraIndia: ComplianceItem[] = [
  ...indiaCore,
  {
    level: 'conditional',
    requirementType: 'Registration',
    title: 'RCMC for the declared main line of business',
    detail: 'Obtain an e-RCMC from the appropriate council when claiming Foreign Trade Policy benefits or council services. Sohra should confirm whether apparel or handicrafts is its main export line before choosing AEPC or EPCH.',
    issuer: 'AEPC or Export Promotion Council for Handicrafts',
    helper: 'Council helpdesk or export consultant',
    source: 'DGFT e-RCMC guidance · reviewed Sep 2026',
    sourceUrl: 'https://www.dgft.gov.in/CP?opt=e-rcmc',
    appliesTo: 'all',
  },
];

const sachiIndia: ComplianceItem[] = [
  ...indiaCore,
  {
    level: 'conditional',
    requirementType: 'Registration',
    title: 'GJEPC Registration-cum-Membership Certificate',
    detail: 'Relevant for Chapter 71 gems and jewellery exporters seeking Foreign Trade Policy authorisations, concessions or GJEPC services. It is not a blanket licence for every jewellery shipment.',
    issuer: 'Gem & Jewellery Export Promotion Council',
    helper: 'GJEPC membership helpdesk or jewellery export consultant',
    source: 'GJEPC Guide to Export · reviewed Sep 2026',
    sourceUrl: 'https://gjepc.org/guide-to-export.php',
    appliesTo: 'jewellery',
  },
  {
    level: 'conditional',
    requirementType: 'Product rule',
    title: 'Confirm the BIS hallmarking position',
    detail: 'BIS lists articles meant for export and re-import under the trade policy among hallmarking exemptions. House of Sachi should document whether each line is export-only or also sold domestically before relying on an exemption.',
    issuer: 'Bureau of Indian Standards',
    helper: 'BIS-recognised Assaying & Hallmarking Centre or jewellery compliance adviser',
    source: 'BIS jeweller hallmarking FAQs · reviewed Sep 2026',
    sourceUrl: 'https://www.bis.gov.in/hallmarking-jewellers?lang=en',
    appliesTo: 'jewellery',
  },
];

const usImporter: ComplianceItem = {
  level: 'conditional',
  requirementType: 'Customs setup',
  title: 'US importer-of-record and customs bond check',
  detail: 'There is no single general US import licence for these products. The party acting as importer must confirm entry, bond, classification, valuation and country-of-origin marking obligations.',
  issuer: 'US Customs and Border Protection',
  helper: 'Licensed US customs broker or importer-of-record partner',
  source: 'CBP customs bond guidance · reviewed Sep 2026',
  sourceUrl: 'https://www.cbp.gov/trade/priority-issues/revenue/bonds',
  appliesTo: 'all',
};

const ukImporter: ComplianceItem[] = [
  {
    level: 'conditional',
    requirementType: 'Customs setup',
    title: 'GB EORI for the importer of record',
    detail: 'A GB EORI is needed by the business responsible for moving goods through Great Britain customs. Confirm whether that is the brand, a managed partner or the customer before applying.',
    issuer: 'HM Revenue & Customs',
    helper: 'UK customs agent or importer-of-record partner',
    source: 'GOV.UK EORI guidance · reviewed Sep 2026',
    sourceUrl: 'https://www.gov.uk/eori/apply-for-eori',
    appliesTo: 'all',
  },
  {
    level: 'required',
    requirementType: 'Tax setup',
    title: 'UK VAT treatment for direct sales',
    detail: 'Direct overseas sales can trigger UK VAT registration and checkout collection, particularly for consignments not exceeding £135. Marketplace and higher-value rules differ.',
    issuer: 'HM Revenue & Customs',
    helper: 'UK VAT agent or cross-border tax adviser',
    source: 'GOV.UK direct overseas sales VAT guidance · reviewed Sep 2026',
    sourceUrl: 'https://www.gov.uk/guidance/charging-vat-on-goods-sold-direct-to-customers-in-the-uk',
    appliesTo: 'all',
  },
];

const sohraUS: ComplianceItem[] = [
  ...sohraIndia,
  usImporter,
  {
    level: 'required',
    requirementType: 'Product rule',
    title: 'US textile and care labels',
    detail: 'Jainsem sets and woven wraps need compliant fibre content, country-of-origin and responsible-company identification, plus care instructions where applicable.',
    issuer: 'US Federal Trade Commission',
    helper: 'US textile labelling consultant or import counsel',
    source: 'FTC Textile and Wool Acts guidance · reviewed Sep 2026',
    sourceUrl: 'https://www.ftc.gov/business-guidance/resources/threading-your-way-through-labeling-requirements-under-textile-wool-acts',
    appliesTo: 'apparel',
  },
  {
    level: 'conditional',
    requirementType: 'Conditional approval',
    title: 'Bamboo species and Lacey Act declaration check',
    detail: 'The US importer should test the exact HTS code and bamboo source against APHIS Phase VII. Products made from cultivated bamboo may qualify for a declaration exemption, but the supporting species and harvest records should be retained.',
    issuer: 'USDA APHIS / US Customs',
    helper: 'US customs broker or APHIS import specialist',
    source: 'APHIS Lacey Act Phase VII guidance · reviewed Sep 2026',
    sourceUrl: 'https://www.aphis.usda.gov/news/program-update/aphis-will-implement-lacey-act-phase-vii-requirements-on-dec-1',
    appliesTo: 'bamboo',
  },
];

const sohraGB: ComplianceItem[] = [
  ...sohraIndia,
  ...ukImporter,
  {
    level: 'required',
    requirementType: 'Product rule',
    title: 'UK textile fibre-composition label',
    detail: 'Jainsem sets, wraps and textile-lined accessories must use recognised fibre names and disclose non-textile parts of animal origin where present.',
    issuer: 'UK trading standards authorities',
    helper: 'UK product-compliance adviser or trading standards consultant',
    source: 'GOV.UK textile labelling guidance · reviewed Sep 2026',
    sourceUrl: 'https://www.gov.uk/guidance/textile-labelling',
    appliesTo: 'apparel',
  },
  {
    level: 'conditional',
    requirementType: 'Conditional approval',
    title: 'Confirm finished-bamboo import treatment',
    detail: 'No blanket UK licence is identified for a finished bamboo fashion accessory. The importer should still confirm the exact commodity code, species, treatment and whether any plant-health control applies before launch.',
    issuer: 'UK customs and plant-health authorities',
    helper: 'UK customs agent or plant-products import adviser',
    source: 'GOV.UK regulatory import requirements · reviewed Sep 2026',
    sourceUrl: 'https://www.gov.uk/guidance/uk-standards-and-regulatory-import-requirements',
    appliesTo: 'bamboo',
  },
];

const sachiUS: ComplianceItem[] = [
  ...sachiIndia,
  usImporter,
  {
    level: 'required',
    requirementType: 'Product rule',
    title: 'Truthful jewellery composition and fineness claims',
    detail: 'Substantiate gold, silver, vermeil, plating, gemstone, pearl, treatment and origin claims. Keep assay and supplier evidence aligned with every product description.',
    issuer: 'US Federal Trade Commission',
    helper: 'Jewellery testing laboratory and US advertising/compliance counsel',
    source: 'FTC Jewelry Guides · reviewed Sep 2026',
    sourceUrl: 'https://www.ftc.gov/news-events/topics/tools-consumers/jewelry-guides',
    appliesTo: 'jewellery',
  },
  {
    level: 'required',
    requirementType: 'Product rule',
    title: 'US textile and care labels',
    detail: 'Occasionwear requires fibre content, country-of-origin and responsible-company identification, with care instructions where applicable.',
    issuer: 'US Federal Trade Commission',
    helper: 'US textile labelling consultant or import counsel',
    source: 'FTC Textile and Wool Acts guidance · reviewed Sep 2026',
    sourceUrl: 'https://www.ftc.gov/business-guidance/resources/threading-your-way-through-labeling-requirements-under-textile-wool-acts',
    appliesTo: 'apparel',
  },
];

const sachiGB: ComplianceItem[] = [
  ...sachiIndia,
  ...ukImporter,
  {
    level: 'required',
    requirementType: 'Product rule',
    title: 'UK hallmark and sponsor’s mark',
    detail: 'Gold, silver, platinum or palladium articles above the statutory exemption weights must carry a legally recognised hallmark before being described and sold as precious metal in the UK.',
    issuer: 'A UK Assay Office',
    helper: 'UK Assay Office, sponsor or jewellery compliance agent',
    source: 'British Hallmarking Council guidance · reviewed Sep 2026',
    sourceUrl: 'https://www.gov.uk/government/publications/hallmarking-guidance-notes/hallmarking-is-the-law-guidance-summary',
    appliesTo: 'jewellery',
  },
  {
    level: 'required',
    requirementType: 'Product rule',
    title: 'UK textile fibre-composition label',
    detail: 'Occasionwear must use recognised fibre names and disclose non-textile parts of animal origin where present.',
    issuer: 'UK trading standards authorities',
    helper: 'UK product-compliance adviser or trading standards consultant',
    source: 'GOV.UK textile labelling guidance · reviewed Sep 2026',
    sourceUrl: 'https://www.gov.uk/guidance/textile-labelling',
    appliesTo: 'apparel',
  },
];

export function complianceFor(profileId: string, country: 'US' | 'GB'): ComplianceItem[] {
  if (profileId === 'aavira') return country === 'US' ? sohraUS : sohraGB;
  if (profileId === 'vanya') return country === 'US' ? sachiUS : sachiGB;
  return country === 'US' ? sohraUS : sohraGB;
}