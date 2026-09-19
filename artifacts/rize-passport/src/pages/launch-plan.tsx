import { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { BadgeCheck, Building2, Check, CircleAlert, ExternalLink, Handshake, ShieldCheck, UserRoundCheck } from 'lucide-react';
import { useApp } from '@/hooks/use-app';
import { ComplianceLevel, ProductKind } from '@/types';
import { filterCompliance, routeLabel } from '@/lib/compute';
import { PricingPanel } from '@/components/pricing-panel';

type CommercialPlan = 'direct' | 'managed';

const levelMeta: Record<ComplianceLevel, { label: string; className: string }> = {
  required: { label: 'Required before export', className: 'text-destructive bg-destructive/10 border-destructive/25' },
  conditional: { label: 'Conditional', className: 'text-warning bg-warning/10 border-warning/25' },
  recommended: { label: 'Recommended control', className: 'text-primary bg-primary/10 border-primary/25' },
};

function illustrativeProviders(helper: string) {
  const value = helper.toLowerCase();
  if (value.includes('assay') || value.includes('jewellery') || value.includes('testing laboratory')) return ['GemSure Compliance Labs', 'KaratMark Advisory'];
  if (value.includes('uk vat') || value.includes('cross-border tax')) return ['Britannia VAT Partners', 'Thames Trade Tax'];
  if (value.includes('uk customs') || value.includes('plant-products')) return ['ClearPort UK', 'Thames Import Advisory'];
  if (value.includes('us customs') || value.includes('aphis') || value.includes('importer-of-record')) return ['Atlas Import Compliance', 'Stateside Customs Desk'];
  if (value.includes('textile') || value.includes('product-compliance') || value.includes('trading standards')) return ['LabelRight Studio', 'MaterialProof Advisory'];
  if (value.includes('chartered accountant') || value.includes('company secretary') || value.includes('gst practitioner')) return ['LedgerLine CA', 'FormWise CS'];
  if (value.includes('council') || value.includes('export consultant')) return ['ExportSpring Advisory', 'TradePath India'];
  if (value.includes('bank trade') || value.includes('customs broker')) return ['ClearGate Customs Brokers', 'Meridian Trade Desk'];
  return ['CrossBorder Works', 'MarketReady Partners'];
}

export default function LaunchPlan() {
  const { country } = useParams();
  const [, setLocation] = useLocation();
  const { profile, markets } = useApp();
  const market = markets.find((item) => item.country === country);
  const [productKind, setProductKind] = useState<ProductKind>('apparel');
  const recommendedPlan: CommercialPlan = market?.route === 'MANAGED' || market?.route === 'ENTITY' ? 'managed' : 'direct';
  const requestedPlan = new URLSearchParams(window.location.search).get('plan');
  const initialPlan = requestedPlan === 'direct' || requestedPlan === 'managed' ? requestedPlan : recommendedPlan;
  const [selectedPlan, setSelectedPlan] = useState<CommercialPlan>(initialPlan);
  const availableKinds = [...new Set(profile.products.map((product) => product.kind))];
  useEffect(() => {
    setSelectedPlan(requestedPlan === 'direct' || requestedPlan === 'managed' ? requestedPlan : recommendedPlan);
  }, [profile.id, country, recommendedPlan, requestedPlan]);
  useEffect(() => {
    if (!availableKinds.includes(productKind)) setProductKind(availableKinds[0]);
  }, [availableKinds, productKind]);
  if (!market) return <div className="p-8 text-center">Market not found</div>;

  const applicable = useMemo(() => filterCompliance(market.compliance, productKind), [market, productKind]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="border-b pb-6">
        <p className="text-xs font-mono uppercase tracking-[.2em] text-primary">Launch Plan / {profile.name} / {market.country}</p>
        <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><h1 className="text-3xl font-bold">{routeLabel(market.route)}</h1><p className="mt-2 max-w-3xl text-muted-foreground">{market.routeReason}</p></div><span className="w-fit rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">Computed from demand + operations + liability</span></div>
      </header>

      {market.route === 'NOT_YET' ? (
        <section className="rounded-xl border border-warning/30 bg-warning/10 p-8 text-center">
          <CircleAlert className="mx-auto h-10 w-10 text-warning" /><h2 className="mt-4 text-2xl font-bold">Keep India as the focus for now.</h2><p className="mx-auto mt-3 max-w-xl text-muted-foreground">{market.nextThreshold}</p><button onClick={() => setLocation(`/market/${market.country}`)} className="mt-6 text-sm font-semibold text-primary">Review the failed gate →</button>
        </section>
      ) : (
        <>
          <section>
            <div className="mb-4"><p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Commercial model</p><h2 className="mt-1 text-xl font-bold">Choose who carries the transaction liability</h2><p className="mt-2 text-sm text-muted-foreground">Passport recommends a model from the merchant signals, but the brand can choose either option for its pilot.</p></div>
            <div className="grid gap-5 lg:grid-cols-2">
              <PlanCard
                name="Passport Direct"
                fee="3–5%"
                feeLabel="Illustrative service fee"
                subtitle="Indian brand remains merchant and exporter of record"
                recommended={recommendedPlan === 'direct'}
                selected={selectedPlan === 'direct'}
                onSelect={() => setSelectedPlan('direct')}
                icon={BadgeCheck}
                items={['International payment acceptance', 'KYC-derived compliance workspace', 'Destination pricing and FX guardrails', 'Brand manages taxes, customs, refunds and disputes']}
              />
              <PlanCard
                name="Passport Managed"
                fee="8–12%"
                feeLabel="Illustrative service fee"
                subtitle="Proposed Razorpay or designated-partner merchant-of-record model"
                recommended={recommendedPlan === 'managed'}
                selected={selectedPlan === 'managed'}
                onSelect={() => setSelectedPlan('managed')}
                icon={ShieldCheck}
                items={['Payment collection and indirect-tax administration', 'Fraud decisions and chargeback handling', 'Refund and transaction-support orchestration', 'Brand still warrants authenticity, composition and safety']}
              />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">Not published Razorpay pricing.</strong> These ranges are illustrative Passport service-fee assumptions for comparing pilot economics. Delivery and logistics are outside this model. Physical-goods merchant-of-record coverage remains subject to legal structure, destination support and commercial agreement.</p>
          </section>

          {market.route === 'ENTITY' && (
            <section className="rounded-xl border border-primary/30 bg-primary/5 p-6">
              <div className="flex gap-4"><Building2 className="h-6 w-6 shrink-0 text-primary" /><div><p className="text-xs font-mono uppercase tracking-widest text-primary">Scale decision</p><h2 className="mt-2 text-xl font-bold">Managed now; entity when local operations become permanent</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{profile.name}’s wholesale buyer and local inventory create a real entity trigger. Managed is the faster pilot route; a local entity becomes economical when recurring managed fees exceed entity, tax, accounting and local-operating costs.</p></div></div>
            </section>
          )}

          <section>
            <div className="flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div><p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Licence & registration repository</p><h2 className="mt-1 text-xl font-bold">What {profile.name} needs for {market.countryName}</h2><p className="mt-2 max-w-3xl text-sm text-muted-foreground">Required registrations are separated from tax setup, customs setup, product rules and conditional approvals.</p></div>
              <div className="flex rounded-lg border bg-card p-1">
                {availableKinds.map((kind) => <button key={kind} onClick={() => setProductKind(kind)} className={`rounded px-4 py-2 text-xs font-medium capitalize ${productKind === kind ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>{kind}</button>)}
              </div>
            </div>
            <div className="mt-5 grid gap-4">
              {applicable.map((item) => {
                const meta = levelMeta[item.level];
                return (
                  <article key={`${item.level}-${item.title}`} className="rounded-xl border bg-card p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex flex-wrap gap-2"><span className={`w-fit rounded border px-2 py-1 text-[10px] font-mono uppercase tracking-wider ${meta.className}`}>{meta.label}</span><span className="w-fit rounded border bg-muted px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{item.requirementType}</span></div>
                      <span className="text-xs text-muted-foreground">{item.issuer}</span>
                    </div>
                    <h3 className="mt-4 font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
                    <div className="mt-4 grid gap-3 border-t pt-4 sm:grid-cols-[1fr_auto] sm:items-center">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs"><UserRoundCheck className="h-4 w-4 shrink-0 text-primary" /><span><span className="text-muted-foreground">Who can help:</span> {item.helper}</span></div>
                        <div className="flex flex-wrap items-center gap-1.5 pl-6">
                          <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">Fictional demo providers</span>
                          {illustrativeProviders(item.helper).map((provider) => <span key={provider} className="rounded-full border bg-background px-2 py-1 text-[10px] text-foreground">{provider}</span>)}
                        </div>
                      </div>
                      <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">{item.source}<ExternalLink className="h-3 w-3" /></a>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="mt-4 flex gap-3 rounded-lg border border-dashed p-4 text-xs leading-relaxed text-muted-foreground"><Handshake className="h-5 w-5 shrink-0 text-primary" />Research repository, not legal or tax advice. Requirements depend on the exact material, HS classification, order value, sales channel and importer-of-record arrangement. Confirm the final path with the named authority or adviser.</div>
          </section>

          <PricingPanel market={market} plan={selectedPlan} onPlanChange={setSelectedPlan} />
        </>
      )}
    </div>
  );
}

function PlanCard({ name, fee, feeLabel, subtitle, recommended, selected, onSelect, icon: Icon, items }: { name: string; fee: string; feeLabel: string; subtitle: string; recommended: boolean; selected: boolean; onSelect: () => void; icon: typeof ShieldCheck; items: string[] }) {
  return <button type="button" aria-pressed={selected} onClick={onSelect} className={`rounded-xl border p-6 text-left transition-all ${selected ? 'border-primary bg-primary/10 ring-2 ring-primary/30' : 'bg-card hover:border-primary/40'}`}><div className="flex items-start justify-between gap-3"><Icon className="h-6 w-6 text-primary" /><div className="flex flex-wrap justify-end gap-2">{recommended && <span className="rounded-full border border-primary/40 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">Recommended</span>}{selected && <span className="rounded-full bg-primary px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">Selected</span>}</div></div><div className="mt-5 flex items-start justify-between gap-4"><h3 className="text-xl font-bold">{name}</h3><div className="text-right"><span className="font-mono text-2xl font-bold">{fee}</span><p className="text-[9px] uppercase tracking-wider text-muted-foreground">{feeLabel}</p></div></div><p className="mt-2 text-sm text-muted-foreground">{subtitle}</p><ul className="mt-5 space-y-3 border-t pt-5">{items.map((item) => <li key={item} className="flex gap-2 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />{item}</li>)}</ul></button>;
}