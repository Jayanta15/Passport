# Rize Passport
## Turning Indian ambition into global readiness

**Judge write-up · 19 September 2026**  
**Product:** Razorpay Rize Passport  
**Research note:** Public facts are cited. All market funnels and commercial scenarios are directional assumptions, not Razorpay forecasts or published pricing.

> **The idea in one sentence:** Passport uses signals Razorpay may already hold—with merchant consent—to tell an Indian business where it is ready to expand, what route it should take, what registrations and product rules apply, and what the product should cost in that market.

## 1. The problem: India has the ambition; small businesses need a path

A friend recently sent me this message:

> “Hello Jayanta, I’m so happy to share that I’ve launched my very own saree label — Rāsya by Akansha! A little dream of mine, now come to life. Each saree is handwoven and sourced directly from the weavers of Varanasi—pure georgette, cotton silk, mulberry silk and more. Authentic weaves with real gold zari, at honest prices.”

That message stayed with me because it captures what Indian entrepreneurship actually looks like. It is personal, product-led and ambitious. A founder has already taken the hard first steps: finding the weavers, understanding the materials, creating a brand, building a catalogue and putting her reputation behind every product.

The next ambition is obvious: *Could this brand sell to customers in London, New York or Dubai?* The appetite for risk is there. The product is there. What is missing is a reliable way to turn ambition into an operating decision.

This is not a niche aspiration. India recorded **$778.13 billion of merchandise and services exports in FY2023-24**. The Department of Commerce subsequently reported that April–December 2024 exports reached an estimated **$602.64 billion**, 6.03% above the same period a year earlier.[[1]](https://www.commerce.gov.in/files/2025-08/Commerce_AR-2024-25-English-1.pdf) MSMEs sit at the centre of that story: the Ministry of MSME describes them as contributing around **30% of GDP and more than 45% of exports**.[[2]](https://msme.gov.in/static/uploads/2025/06/cdd1fa9e3553498f59e6fef26bcc34b4.pdf)

The government is also trying to widen digital participation. The MSME-TEAM initiative has a ₹277.35 crore outlay and aims to onboard five lakh micro and small enterprises to e-commerce between 2024 and 2027, including 2.5 lakh women-owned businesses.[[2]](https://msme.gov.in/static/uploads/2025/06/cdd1fa9e3553498f59e6fef26bcc34b4.pdf) DGFT’s export handbook explicitly identifies textiles, handloom and apparel, handicrafts, home décor, and semi-precious jewellery as Indian strengths for cross-border e-commerce—the exact kind of categories Passport was designed around.[[3]](https://content.dgft.gov.in/Website/EcommExportHandbokMSME_E.pdf)

Yet accepting a foreign card is only the last visible step in a much longer decision chain. Before a merchant gets there, she must answer:

1. **Which market has real demand—not just anecdotal interest?**
2. **Is the business operationally ready for that market?**
3. **Can it export directly, or should another party carry transaction and compliance liability?**
4. **Which registrations, customs setup and product rules apply to this exact SKU?**
5. **What customer price absorbs duty, tax, service fees and returns while protecting margin?**

DGFT itself advises exporters to study foreign demand, customer segments, culture, seasonality and competitor pricing before selecting a market. It also states that ITC-HS classification determines export policy and helps identify destination-country requirements; non-compliance can create penalties or import-country issues.[[3]](https://content.dgft.gov.in/Website/EcommExportHandbokMSME_E.pdf) WTO research shows why this burden falls disproportionately on smaller firms: trade friction includes far more than tariffs, and reducing export delays benefits SMEs relatively more.[[4]](https://www.wto.org/english/res_e/booksp_e/trade-costs-incl-growth_full_e.pdf) Indian industry evidence points in the same direction—SMEs report demand for simpler tax compliance and import-export regulation.[[5]](https://ficci.in/public/storage/SPDocument/23826/gDgHYdVQZUEeikm2MEJ0B8x3z8pqjOjWlYMUyc8d.pdf)

The problem, then, is not lack of ambition. It is fragmented decision-making. Demand signals sit in payments. Product identity sits in KYC, GST and the merchant catalogue. Rules sit across regulators and advisers. Pricing lives in a spreadsheet. Liability decisions often happen only after a problem appears.

**Indian businesses have the ambition and the risk appetite. They need the right insight at the right moment—and help operationalising it.**

## 2. The solution: Passport

Rize Passport is a proposed decision and execution layer for Indian heritage-fashion and jewellery businesses going global. It is deliberately focused on the work between “I want to export” and “I am ready to switch on this market.” It has two surfaces.

### Radar: where should I go, and am I ready?

Radar begins with a message a founder immediately understands: the INR-equivalent value of international intent already waiting at checkout. It combines consented payment signals—foreign-card attempts, destination, attempted order value and repeat intent—with the products Razorpay has verified during KYC.

For each candidate market, Radar shows:

- observed demand and product mix;
- merchant and KYC-derived product context;
- readiness gates for demand, margin headroom and returns;
- a clear GO, WAIT or WATCHING verdict;
- an explainable recommended route: not yet, launch directly from India, use a managed model, or consider a local entity at scale.

The important design choice is that Radar does not produce generic country advice. It produces a recommendation for *this merchant, these products and this market*.

### Launch Plan: how do I make the market operational?

Once a market passes Radar, Launch Plan turns the recommendation into a working commercial path.

It lets the merchant compare **Passport Direct** with a proposed **Passport Managed** model. Direct keeps the Indian brand as merchant and exporter of record. Managed represents a future Razorpay or designated-partner model for payment collection, indirect-tax administration, fraud decisions, disputes and transaction support—subject to legal validation and commercial agreement.

Launch Plan then provides:

- a product- and destination-specific repository of registrations, tax setup, customs setup, product rules and conditional approvals;
- the issuing authority, official source and type of adviser who can help;
- clearly labelled fictional provider examples for the prototype;
- destination pricing that starts from a Razorpay-observed market base, while allowing the merchant to override that number;
- automatic recalculation of duty, illustrative service fee, returns provision, tax, recommended customer price and merchant proceeds.

Passport intentionally excludes logistics. It is not trying to become a shipping platform. Its job is to make the market-entry decision explainable and operational before payments are enabled.

## 3. The market: large enough to matter, narrow enough to pilot

India had approximately **5.77 crore Udyam/UAP registrations as of 31 December 2024**. That is a broad formalised-business denominator, not Passport’s addressable market. A more useful qualification lens is turnover: the MSME report’s bands imply roughly **10.99 lakh registrations with declared turnover of ₹1 crore or more**, through the ₹250 crore band.[[2]](https://msme.gov.in/static/uploads/2025/06/cdd1fa9e3553498f59e6fef26bcc34b4.pdf)

Passport’s initial serviceable market should be defined by observable fit rather than a top-down market percentage. The merchant should:

- sell physical products online;
- operate in a supported category;
- have consented KYC, GST, catalogue and payment signals;
- show international intent or active export interest;
- have repeatable product and returns processes;
- be willing to confirm product materials and claims.

If only **1%–3%** of the ₹1 crore-plus registration pool met those conditions, the directional serviceable market would be approximately **11,000–33,000 merchants**. That percentage is an assumption to be validated, not an observed national conversion rate. It is useful because it gives the pilot a falsifiable target without pretending that all 5.77 crore registrations are prospects.

An external estimate placed Indian e-commerce exports at roughly **$4–5 billion in FY2023**, but this is a consultancy estimate rather than an official national series.[[6]](https://www.ey.com/content/dam/ey-unified-site/ey-com/en-in/newsroom/2024/07/ey-enabling-e-commerce-exports-from-india.pdf) The stronger “why now” signal is institutional: DGFT, Commerce and MSME programmes are all investing in digital market access, export guidance and e-commerce enablement.[[7]](https://www.commerce.gov.in/files/d-m-y/PIB2149736.pdf) Passport can make those ambitions actionable inside a merchant workflow.

### Competitive landscape

| Player | Publicly visible strength | Where Passport is different |
|---|---|---|
| **Skydo** | Cross-border receivables for Indian exporters, local receiving accounts, FIRA and fee/FX positioning.[[8]](https://www.skydo.com/features/receive-cross-border-payments) | Passport begins before collection: demand diagnosis, readiness gates, route/liability choice, SKU-level requirements and destination pricing. |
| **Stripe** | Global payment infrastructure; India documentation supports international transactions subject to account, IEC and enablement requirements. India remains shown as Preview on Stripe’s global availability page.[[9]](https://docs.stripe.com/india-accept-international-payments?locale=en-GB)[[10]](https://stripe.com/in/global) | Passport is merchant-specific market-entry intelligence, not only payment acceptance infrastructure. |
| **Airwallex** | Global accounts, FX, local payment methods, transfers and payouts in supported markets.[[11]](https://www.airwallex.com/en-uk/ppc/cross-border-payments)[[12]](https://www.airwallex.com/en-fr/business-account/global-accounts) | Passport is designed around Indian KYC/payment context and market-readiness decisions. India-specific availability was not established in the public pages reviewed. |
| **Rize Passport** | Proposed insight-to-action layer: observed demand → readiness verdict → route → licences and product rules → destination economics. | It can sit upstream of and connect into payment, tax and adviser ecosystems rather than replacing every provider. |

The differentiation is not “we also move money.” Passport’s position is: **Razorpay can help a merchant decide whether and how to enter a market because it can connect payment intent with verified merchant and product context.** Competitors are potential rails or partners as much as competitors.

## 4. The commercial use case for Razorpay Rize

Rize is a credible launch surface because its public site already positions the programme around early-stage founders, D2C businesses and global exports. It reports **1,500+ founders in its community and 20,000+ company registrations facilitated**; these are company-reported reach figures, not active or export-eligible merchant counts.[[13]](https://razorpay.com/rize/rize)

Passport can create value for Razorpay in four ways:

1. **Acquire international-payments merchants earlier.** Radar turns failed or unserved international intent into a qualified expansion conversation.
2. **Increase activation.** A merchant that understands its route, requirements and price has fewer reasons to abandon international-payment enablement midway.
3. **Grow processed volume.** Passport revenue is secondary to the larger opportunity: helping more Rize merchants become international-payment merchants.
4. **Build a partner layer.** Verified CAs, company secretaries, customs brokers, testing labs and tax advisers could eventually become a curated referral network—only after proper vetting and commercial design.

### Directional three-year annualised scenario

The model below is deliberately simple. It does not use private Razorpay data. “Eligible merchants” is a planning pool, “activation” means at least one live cross-border transaction, and annual GMV is per activated merchant.

| Scenario | Eligible merchants | Activation | Activated merchants | Annual cross-border GMV per merchant | Passport-enabled GMV | Illustrative processing revenue at 3%* | Illustrative incremental Passport economics |
|---|---:|---:|---:|---:|---:|---:|---:|
| **Low** | 2,000 | 10% | 200 | ₹5 lakh | **₹10 crore** | **₹30 lakh** | **₹2.5 lakh** at 0.25% |
| **Base** | 5,000 | 20% | 1,000 | ₹15 lakh | **₹150 crore** | **₹4.5 crore** | **₹75 lakh** at 0.50% |
| **High** | 10,000 | 30% | 3,000 | ₹30 lakh | **₹900 crore** | **₹27 crore** | **₹6.75 crore** at 0.75% |

*The 3% is a directional modelling assumption aligned with publicly visible international-card price signals, not a quote, margin or guaranteed Razorpay rate. Razorpay’s main public pricing page advertises headline payment pricing and custom plans for larger merchants; actual international pricing varies by method, eligibility, contract, GST, FX and risk.[[14]](https://razorpay.com/pricing) Processing revenue must not be added to Passport economics if Passport is bundled into that rate, and neither number represents contribution profit.

A subscription alternative is also testable. At 1,000 activated merchants paying an illustrative ₹3,000 per year, Passport would produce **₹30 lakh in annual fee revenue**. The stronger base-case value, however, is the potential **₹150 crore of Passport-enabled annual cross-border GMV** and the merchant relationship that comes with it.

### What Razorpay should test first

A responsible pilot would start with **100–200 Rize D2C/Xport+ merchants** in two categories and two destinations. Success should be measured through:

- consent rate for using KYC and payment signals;
- percentage of merchants receiving a clear GO or WAIT decision;
- international-payments activation after a GO decision;
- time from diagnosis to first successful foreign payment;
- payment volume and repeat rate after 90 days;
- readiness-gate failure reasons;
- merchant willingness to pay for Passport or accept a bundled rate;
- adviser referral completion and quality, if a partner layer is tested.

RBI’s PA-CB framework requires authorisation, merchant due diligence, risk management and controls around prohibited goods and cross-border collection/settlement.[[15]](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12561) That makes the staged approach essential. Passport Direct can be piloted as decision support around existing regulated flows. Passport Managed should remain a proposed future model until legal structure, destination coverage, liability, tax, refunds, disputes and commercial ownership are formally validated.

## Closing

Akansha does not need another dashboard telling her that global e-commerce is large. She needs an answer to a much more practical question:

> *“For my sarees, with my current business and the demand I am already seeing, which market should I enter—and what exactly do I need to do next?”*

That is what Passport is designed to answer.

Radar converts payment noise into a market decision. Launch Plan converts that decision into a route, a compliance path and viable economics. Together, they let Razorpay Rize move from supporting founders at incorporation to supporting them at international expansion.

**Passport is not a promise that every Indian business is ready to go global. It is a system for showing the right businesses when they are ready, why they are ready, and how to proceed.**

## Important limitations

This prototype uses illustrative merchant scenarios, service-fee assumptions and provider names. It is not legal, tax or customs advice. Public market data does not provide a clean count of active Indian e-commerce exporters, active Rize export-ready merchants, Passport activation or per-merchant cross-border GMV. The market funnel and commercial scenarios must therefore be validated through a cohort pilot. Passport Managed is a product hypothesis, not a currently published Razorpay service or price.


## Sources

1. [Department of Commerce Annual Report 2024-25](https://www.commerce.gov.in/files/2025-08/Commerce_AR-2024-25-English-1.pdf) — February 2025; Tier 1.
2. [Ministry of MSME Annual Report 2024-25](https://msme.gov.in/static/uploads/2025/06/cdd1fa9e3553498f59e6fef26bcc34b4.pdf) — 2025; Tier 1.
3. [E-Commerce Exports Handbook for MSMEs](https://content.dgft.gov.in/Website/EcommExportHandbokMSME_E.pdf) — January 2023; Tier 1.
4. [Trade Costs and Inclusive Growth](https://www.wto.org/english/res_e/booksp_e/trade-costs-incl-growth_full_e.pdf) — 2016; Tier 1.
5. [FICCI Report on SMEs in India](https://ficci.in/public/storage/SPDocument/23826/gDgHYdVQZUEeikm2MEJ0B8x3z8pqjOjWlYMUyc8d.pdf) — September 2023; Tier 2.
6. [Enabling e-commerce exports from India](https://www.ey.com/content/dam/ey-unified-site/ey-com/en-in/newsroom/2024/07/ey-enabling-e-commerce-exports-from-india.pdf) — July 2024; Tier 2.
7. [Government measures to promote exports](https://www.commerce.gov.in/files/d-m-y/PIB2149736.pdf) — 29 July 2025; Tier 1.
8. [Skydo Receive Cross-Border Payments](https://www.skydo.com/features/receive-cross-border-payments) — Undated; accessed 19 September 2026; Tier 3.
9. [Stripe India international payments documentation](https://docs.stripe.com/india-accept-international-payments?locale=en-GB) — Undated; accessed 19 September 2026; Tier 3.
10. [Stripe global availability – India](https://stripe.com/in/global) — Undated; accessed 19 September 2026; Tier 3.
11. [Airwallex cross-border payments](https://www.airwallex.com/en-uk/ppc/cross-border-payments) — Undated; accessed 19 September 2026; Tier 3.
12. [Airwallex Global Accounts](https://www.airwallex.com/en-fr/business-account/global-accounts) — Undated; accessed 19 September 2026; Tier 3.
13. [Razorpay Rize](https://razorpay.com/rize/rize) — Undated; accessed 19 September 2026; Tier 3.
14. [Razorpay Payments Pricing](https://razorpay.com/pricing) — Undated; accessed 19 September 2026; Tier 3.
15. [RBI regulation of Payment Aggregator – Cross Border](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12561) — 31 October 2023; Tier 1.
