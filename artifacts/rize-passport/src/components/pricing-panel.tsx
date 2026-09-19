import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Check, RotateCcw, ShieldCheck } from 'lucide-react';
import { useApp } from '@/hooks/use-app';
import { calculateMarketPrice, PricingPlan } from '@/lib/compute';
import { MarketSignal } from '@/types';

export function PricingPanel({ market, plan, onPlanChange }: { market: MarketSignal; plan: PricingPlan; onPlanChange: (plan: PricingPlan) => void }) {
  const { profile } = useApp();
  const [productHs, setProductHs] = useState(profile.products[0].hs);
  useEffect(() => setProductHs(profile.products[0].hs), [profile.id, profile.products]);

  const product = profile.products.find((item) => item.hs === productHs) || profile.products[0];
  const observedProductBase = Math.round(product.priceInr / market.fxRate);
  const [productBase, setProductBase] = useState(observedProductBase);
  useEffect(() => setProductBase(observedProductBase), [market.country, observedProductBase, product.hs]);
  const numbers = useMemo(() => calculateMarketPrice(market, product, plan, productBase), [market, plan, product, productBase]);
  const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: market.currency, maximumFractionDigits: 0 }).format(value);
  const rows = [
    [`Duty (${Math.round(market.dutyRate * 100)}%)`, numbers.duty],
    [`Illustrative ${plan === 'direct' ? 'Direct' : 'Managed'} service fee (${Math.round(numbers.feeRate * 100)}%)`, numbers.fee],
    [`Returns provision (${Math.round(numbers.returnRate * 100)}%)`, numbers.returns],
    [market.taxRate ? `VAT included (${Math.round(market.taxRate * 100)}%)` : 'Checkout sales tax', numbers.tax],
  ] as const;

  return (
    <section id="pricing" className="space-y-6 border-t pt-8">
      <div>
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Destination pricing</p>
        <h2 className="mt-1 text-xl font-bold">Price the selected launch model</h2>
        <p className="mt-2 text-sm text-muted-foreground">One SKU, two liability models, with delivery and logistics kept outside the calculation.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <main className="space-y-6">
          <div className="rounded-xl border bg-card p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <label className="block flex-1"><span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Product / HS code</span><select value={product.hs} onChange={(event) => setProductHs(event.target.value)} className="mt-2 w-full rounded-lg border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-primary">{profile.products.map((item) => <option key={item.hs} value={item.hs}>HS {item.hs} · {item.name}</option>)}</select></label>
              <div><p className="mb-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Chosen commercial model</p><div className="flex rounded-lg border bg-background p-1">
                <button onClick={() => onPlanChange('direct')} className={`rounded px-4 py-2 text-xs font-semibold ${plan === 'direct' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>Passport Direct</button>
                <button onClick={() => onPlanChange('managed')} className={`rounded px-4 py-2 text-xs font-semibold ${plan === 'managed' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>Passport Managed</button>
              </div></div>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border bg-card">
            <div className="border-b p-5"><p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Price stack</p><h3 className="mt-1 text-xl font-bold">Every modelled cost the list price must carry</h3></div>
            <div className="border-b bg-primary/5 px-5 py-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <label className="block flex-1">
                  <span className="text-xs font-semibold">Product base · {market.currency}</span>
                  <span className="mt-1 block max-w-2xl text-xs leading-relaxed text-muted-foreground">Razorpay observes {money(observedProductBase)} as a viable starting price for this product in {market.countryName}. The business can change it based on its own market view.</span>
                  <div className="relative mt-3 max-w-xs">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm font-medium text-muted-foreground">{market.currency}</span>
                    <input
                      aria-label={`Product base in ${market.currency}`}
                      type="number"
                      min="1"
                      step="1"
                      value={Math.round(productBase)}
                      onChange={(event) => setProductBase(Math.max(1, Number(event.target.value) || 1))}
                      className="w-full rounded-lg border bg-background py-3 pl-14 pr-3 font-mono text-lg font-semibold outline-none transition-shadow focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </label>
                <button type="button" onClick={() => setProductBase(observedProductBase)} className="inline-flex w-fit items-center gap-2 rounded-md border bg-background px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"><RotateCcw className="h-3.5 w-3.5" />Reset to observed</button>
              </div>
            </div>
            <div className="divide-y">{rows.map(([label, value]) => <div key={label} className="flex items-center justify-between px-5 py-4 text-sm"><span className="text-muted-foreground">{label}</span><span className="font-mono">{value ? money(value) : 'Collected separately'}</span></div>)}</div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border bg-card p-5"><p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">What changes on Managed</p><ul className="mt-4 space-y-3 text-sm">{['Indirect-tax administration', 'Fraud and dispute handling', 'Transaction support and refund orchestration'].map((item) => <li key={item} className="flex gap-2"><Check className="h-4 w-4 text-success" />{item}</li>)}</ul></div>
            <div className="rounded-xl border bg-card p-5"><p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">What never transfers silently</p><ul className="mt-4 space-y-3 text-sm">{['Product authenticity and composition', 'Safety and manufacturing quality', 'Accuracy of labelling inputs'].map((item) => <li key={item} className="flex gap-2"><ShieldCheck className="h-4 w-4 text-warning" />{item}</li>)}</ul></div>
          </div>
        </main>

        <aside className="space-y-4">
          <div className="sticky top-24 rounded-xl bg-primary p-7 text-primary-foreground shadow-xl shadow-primary/15">
            <p className="text-xs font-mono uppercase tracking-widest opacity-80">Recommended customer price</p><div className="mt-3 text-5xl font-bold tracking-tight">{money(numbers.list)}</div><p className="mt-2 text-sm opacity-80">{plan === 'direct' ? 'Brand is merchant of record' : 'Managed merchant-of-record assumption'}</p>
            <div className="mt-7 space-y-3 border-t border-white/20 pt-5 text-sm">
              <div className="flex justify-between"><span className="opacity-75">Merchant receives</span><strong>{money(numbers.merchantNet)}</strong></div>
              <div className="flex justify-between"><span className="opacity-75">Target contribution</span><strong>25%</strong></div>
              <div className="flex justify-between"><span className="opacity-75">Illustrative service fee</span><strong>{Math.round(numbers.feeRate * 100)}%</strong></div>
            </div>
          </div>
          <div className="flex gap-3 rounded-xl border border-warning/30 bg-warning/10 p-4 text-xs leading-relaxed text-muted-foreground"><AlertTriangle className="h-5 w-5 shrink-0 text-warning" />This is an illustrative Passport service-fee assumption, not a published Razorpay price. Delivery and logistics are outside this model. Confirm commercial terms, duty, tax and FX before quoting a customer.</div>
        </aside>
      </div>
    </section>
  );
}