import { useEffect } from 'react';
import { useLocation, useSearch } from 'wouter';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CircleDollarSign,
  CreditCard,
  Globe2,
  LockKeyhole,
  Package,
  PackageCheck,
  RotateCcw,
  ScanLine,
  Sparkles,
  XCircle,
  Building2,
  TrendingUp,
  MapPin,
  Tag
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useApp } from '@/hooks/use-app';
import { routeLabel } from '@/lib/compute';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const inr = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
const localMoney = (valueInr: number, currency: string, fxRate: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(valueInr / fxRate);

export default function Radar() {
  const { profile, profiles, markets } = useApp();
  const search = useSearch();
  const [, setLocation] = useLocation();

  const query = new URLSearchParams(search);
  const selectedCountry = query.get('market') || markets[0]?.country;
  const market = markets.find(m => m.country === selectedCountry) || markets[0];

  const totalIntent = markets.reduce((sum, m) => sum + m.leakedInr, 0);
  const totalAttempts = markets.reduce((sum, m) => sum + m.attempts, 0);
  const sohraPeer = profiles.find((item) => item.id === 'aavira');
  const sachiPeer = profiles.find((item) => item.id === 'vanya');

  // Sync URL if default was used
  useEffect(() => {
    if (!query.get('market') && market) {
      setLocation(`/?market=${market.country}`, { replace: true });
    }
  }, [market, query, setLocation]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. HERO SECTION - MUST PRESERVE EXACT WORDING */}
      <section className="relative overflow-hidden rounded-xl border bg-card p-6 md:p-10 shadow-sm">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[.18em] text-primary shadow-sm">
            <ScanLine className="h-3.5 w-3.5" /> KYC + payments intelligence
          </div>
          <p className="mb-2 text-sm text-muted-foreground">{profile.name} has</p>
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-foreground">
            <span className="text-primary drop-shadow-sm">{inr(totalIntent)}</span> INR-equivalent in international intent waiting at checkout.
          </h1>
          <p className="mt-5 max-w-3xl text-base md:text-lg leading-relaxed text-muted-foreground">
            {totalAttempts} foreign-card attempts across {profile.countriesSeen} countries. Passport combines that demand with the products Razorpay already verified during KYC.
          </p>
        </div>
      </section>

      {/* 2. MERCHANT & KYC PRODUCT RIBBON */}
      <section className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
        <div className="rounded-xl border bg-card p-5 shadow-sm hover-elevate">
          <div className="flex items-center gap-2 text-primary mb-4">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Merchant Profile</span>
          </div>
          <div className="flex items-center justify-between border-b border-border/50 pb-4">
            <div>
              <h2 className="text-xl font-bold">{profile.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">{profile.descriptor}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4 pt-4">
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><TrendingUp className="h-3.5 w-3.5" /> Stage</span>
              <span className="text-sm font-medium">{profile.stage}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> Home</span>
              <span className="text-sm font-medium">{profile.city}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><CircleDollarSign className="h-3.5 w-3.5" /> Domestic AOV</span>
              <span className="text-sm font-mono tracking-tight">{inr(profile.domesticAovInr)}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Tag className="h-3.5 w-3.5" /> Gross margin</span>
              <span className="text-sm font-mono tracking-tight">{Math.round(profile.grossMargin * 100)}%</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card flex flex-col shadow-sm overflow-hidden hover-elevate">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/20 p-5 border-b border-border/50">
            <div className="flex items-center gap-2 text-primary">
              <PackageCheck className="h-4 w-4" />
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">KYC-derived Product Passport</span>
            </div>
            <span className="w-fit rounded bg-muted border px-2 py-1 text-[9px] font-mono uppercase tracking-widest text-muted-foreground">
              Source: Razorpay KYC + GST
            </span>
          </div>
          <div className="p-0">
            <div className="divide-y divide-border/50">
              {profile.products.map((p) => (
                <div key={p.hs} className="grid grid-cols-[1fr_auto] sm:grid-cols-[1.2fr_1fr_auto] items-center gap-4 p-4 hover:bg-muted/10 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold truncate">{p.name}</h3>
                      <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">HS {p.hs}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{p.materials}</p>
                  </div>
                  <div className="hidden sm:block text-xs text-muted-foreground">
                    ITC-HS <span className="font-mono">{p.itcHs}</span>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-sm font-mono tracking-tight">{inr(p.priceInr)}</span>
                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground mt-0.5">{Math.round(p.revenueShare * 100)}% rev</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. COCKPIT (MARKET SELECTION + DETAILS) */}
      <section className="grid gap-6 xl:grid-cols-[280px_1fr] items-start">
        {/* Left: Markets List */}
        <div className="flex flex-col gap-3 xl:sticky xl:top-24">
          <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-1 pl-1">Target Markets</h2>
          {markets.map((m) => {
            const isSelected = m.country === market?.country;
            return (
              <button
                key={m.country}
                onClick={() => setLocation(`/?market=${m.country}`)}
                className={cn(
                  "group relative w-full text-left rounded-xl border p-4 transition-all duration-200 overflow-hidden",
                  isSelected
                    ? "bg-primary/5 border-primary/50 shadow-sm"
                    : "bg-card border-border/60 hover:border-primary/30 hover:bg-muted/30"
                )}
              >
                {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className={cn("text-base font-bold", isSelected ? "text-primary" : "text-foreground")}>{m.countryName}</h3>
                    <p className="text-xs font-mono text-muted-foreground mt-0.5">{m.country}</p>
                  </div>
                  <VerdictBadge verdict={m.verdict} small />
                </div>
                <div className="grid grid-cols-2 gap-2 border-t border-border/40 pt-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Intent</span>
                    <span className="text-xs font-mono font-medium">{localMoney(m.leakedInr, m.currency, m.fxRate)}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Attempts</span>
                    <span className="text-xs font-mono font-medium">{m.attempts}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Selected Market Details */}
        {market && (
          <div className="rounded-xl border bg-card shadow-sm overflow-hidden flex flex-col animate-in slide-in-from-right-4 duration-300">
            {/* Header */}
            <div className="border-b p-6 md:p-8 flex flex-col md:flex-row md:items-end justify-between gap-6 bg-muted/10">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[.2em] text-primary mb-2">Diagnosis / {market.country}</p>
                <h2 className="text-3xl md:text-4xl font-bold">{market.countryName}</h2>
                <p className="mt-2 text-sm text-muted-foreground max-w-xl">Demand, economics and operations before compliance work begins.</p>
              </div>
              <div className="shrink-0 flex justify-end">
                <VerdictBadge verdict={market.verdict} large />
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 md:p-8 flex flex-col gap-8">

              {/* Conditional Block Warning */}
              {market.verdict !== 'GO' && (
                <div className="rounded-xl border border-warning/30 bg-warning/10 p-5 flex items-start gap-4">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-warning mb-1">A specific no, not generic caution</p>
                    <h3 className="text-lg font-bold text-foreground">Do not launch {market.countryName} yet.</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {market.nextThreshold} Passport will keep monitoring payment attempts and alert the brand when this flips.
                    </p>
                  </div>
                </div>
              )}

              {profile.id === 'loom-lore' && market.verdict !== 'GO' && sohraPeer && sachiPeer && (
                <section data-testid="panel-loom-global-growth-actions" className="rounded-xl border border-primary/25 bg-primary/5 p-5 md:p-6">
                  <div className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-primary">Close the readiness gap</p>
                      <h3 className="mt-1 text-xl font-bold">What Loom &amp; Lore can do now to build global revenue</h3>
                      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">Patterns from Passport’s stronger merchant scenarios—not a promise of identical results.</p>
                    </div>
                  </div>
                  <div className="mt-5 grid gap-4 lg:grid-cols-3">
                    <article className="rounded-lg border bg-card p-4">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-primary">What worked for Sohra Studio</p>
                      <h4 className="mt-2 font-semibold">Concentrated, repeatable demand</h4>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Sohra combines {sohraPeer.countriesSeen} countries of interest with {Math.round(sohraPeer.markets[0].repeatRate * 100)}% repeat intent. Run one US or UK diaspora occasionwear drop, capture a market-specific waitlist, and use payment links to build toward 80 attempts and ₹5 lakh of intent in one market.</p>
                    </article>
                    <article className="rounded-lg border bg-card p-4">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-primary">What worked for House of Sachi</p>
                      <h4 className="mt-2 font-semibold">A premium occasion-led basket</h4>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Sachi pairs a {inr(sachiPeer.domesticAovInr)} domestic AOV with {Math.round(sachiPeer.grossMargin * 100)}% gross margin. Test saree-and-adornment gifting bundles, document weave and zari provenance, and pitch wedding or festival edits to diaspora stylists and community curators.</p>
                    </article>
                    <article className="rounded-lg border bg-card p-4">
                      <p className="text-[10px] font-mono uppercase tracking-wider text-primary">Fix before scaling traffic</p>
                      <h4 className="mt-2 font-semibold">Bring returns below the readiness line</h4>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Loom &amp; Lore’s domestic return rate is {Math.round(profile.domesticReturnRate * 100)}%; Sohra and Sachi operate at {Math.round(sohraPeer.domesticReturnRate * 100)}% and {Math.round(sachiPeer.domesticReturnRate * 100)}%. Add drape videos, material close-ups, fit guidance and pre-dispatch confirmation to get below 10%.</p>
                    </article>
                  </div>
                </section>
              )}

              {/* Grid: Demand vs Gates */}
              <div className="grid gap-8 lg:grid-cols-[1.1fr_1.3fr]">

                {/* Left Col: Demand */}
                <div className="flex flex-col gap-6">
                  <div>
                    <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground border-b pb-3 mb-4">Observed demand</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-2 gap-3">
                      <Signal icon={CircleDollarSign} label={`Intent · ${market.currency}`} value={localMoney(market.leakedInr, market.currency, market.fxRate)} secondary={`${inr(market.leakedInr)} eq.`} />
                      <Signal icon={CreditCard} label="Attempts" value={String(market.attempts)} />
                      <Signal icon={Package} label={`Attempted AOV`} value={localMoney(market.aovInr, market.currency, market.fxRate)} secondary={`${inr(market.aovInr)} eq.`} />
                      <Signal icon={RotateCcw} label="Repeat intent" value={`${Math.round(market.repeatRate * 100)}%`} />
                      <Signal icon={PackageCheck} label="Expected returns" value={`${Math.round(market.returnRate * 100)}%`} />
                    </div>
                    <p className="mt-3 text-[10px] leading-relaxed text-muted-foreground">
                      Intent observed in INR and converted at ₹{market.fxRate}/{market.currency} (Launch Plan assumption).
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground border-b pb-2 mb-3">
                      <span>Product mix</span>
                      <span>Share of cart</span>
                    </div>
                    <div className="space-y-3">
                      {market.hsMix.map((item) => (
                        <div key={item.hs} className="grid grid-cols-[50px_1fr_40px] items-center gap-3">
                          <span className="text-xs font-mono text-muted-foreground">{item.hs}</span>
                          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                            <div className="h-full bg-primary/80 transition-all" style={{ width: `${item.share * 100}%` }} />
                          </div>
                          <span className="text-right text-xs font-medium">{Math.round(item.share * 100)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Col: Readiness Gates */}
                <div>
                  <div className="flex items-center justify-between border-b pb-3 mb-4">
                    <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Readiness gates</h3>
                    <span className="text-[10px] font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">
                      {market.readiness.filter((item) => item.passed).length}/{market.readiness.length} passed
                    </span>
                  </div>
                  <div className="space-y-0 relative before:absolute before:inset-y-2 before:left-[11px] before:w-[2px] before:bg-border/50">
                    {market.readiness.map((item) => (
                      <div key={item.id} className="relative grid gap-3 py-4 first:pt-0 last:pb-0 sm:grid-cols-[24px_1fr_auto]">
                        <div className="relative z-10 flex items-start justify-center bg-card pt-0.5">
                          {item.passed ? <CheckCircle2 className="h-[22px] w-[22px] text-success fill-success/10" /> : <XCircle className="h-[22px] w-[22px] text-destructive fill-destructive/10" />}
                        </div>
                        <div className="pl-1">
                          <h4 className="text-sm font-semibold">{item.label}</h4>
                          <p className="mt-1 text-xs text-muted-foreground leading-snug">
                            {item.passed ? 'Ready for this market.' : item.message}
                          </p>
                        </div>
                        <div className="sm:text-right pl-8 sm:pl-0">
                          <p className={cn("font-mono text-sm", item.passed ? "text-foreground" : "text-destructive")}>{item.actual}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">{item.target}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Action Footer */}
              <div className={cn(
                "mt-2 rounded-xl border p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 transition-colors",
                market.verdict === 'GO' ? 'border-success/20 bg-success/5' : 'border-warning/20 bg-warning/5'
              )}>
                <div className="flex-1">
                  <p className={cn(
                    "text-[10px] font-mono uppercase tracking-widest mb-1",
                    market.verdict === 'GO' ? 'text-success' : 'text-warning'
                  )}>
                    {market.verdict === 'GO' ? 'Recommended entry route' : 'Readiness outcome'}
                  </p>
                  <h3 className="text-2xl font-bold">{routeLabel(market.route)}</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {market.routeReason}
                  </p>
                </div>

                <div className="shrink-0 flex">
                  {market.verdict === 'GO' ? (
                    <button
                      onClick={() => setLocation(`/launch/${market.country}`)}
                      className="group inline-flex w-full md:w-auto items-center justify-center gap-2 rounded-lg bg-primary hover:bg-primary/90 px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:shadow hover:-translate-y-0.5"
                    >
                      Open Launch Plan
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  ) : (
                    <div className="inline-flex w-full md:w-auto items-center justify-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-6 py-3.5 text-sm font-medium text-muted-foreground/80 cursor-not-allowed">
                      <LockKeyhole className="h-4 w-4" />
                      Launch Plan locked
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}
      </section>

      <div className="flex items-start md:items-center gap-3 rounded-lg border border-dashed border-border/60 p-4 text-xs text-muted-foreground bg-muted/10">
        <Globe2 className="h-4 w-4 text-primary shrink-0 md:mt-0 mt-0.5" />
        <p>MVP scope excludes loose stones, bullion, antiques, restricted wildlife materials, cosmetics, food and children’s products.</p>
      </div>
    </div>
  );
}

function Signal({ icon: Icon, label, value, secondary }: { icon: typeof Package; label: string; value: string; secondary?: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-card p-3 shadow-sm flex flex-col justify-between hover-elevate">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-md bg-primary/10">
          <Icon className="h-3.5 w-3.5 text-primary" />
        </div>
        <p className="text-[9px] uppercase tracking-wider text-muted-foreground truncate" title={label}>{label}</p>
      </div>
      <div>
        <p className="font-mono text-base font-semibold text-foreground tracking-tight">{value}</p>
        {secondary && <p className="mt-0.5 text-[10px] text-muted-foreground/80 font-medium">{secondary}</p>}
      </div>
    </div>
  );
}

function VerdictBadge({ verdict, small = false, large = false }: { verdict: 'GO' | 'WAIT' | 'WATCHING'; small?: boolean; large?: boolean }) {
  const isGo = verdict === 'GO';

  if (large) {
    return (
      <div className={cn(
        "rounded-xl border px-5 py-3 shadow-sm",
        isGo ? "border-success/30 bg-success/10 text-success" : "border-warning/30 bg-warning/10 text-warning"
      )}>
        <p className="text-[10px] font-mono uppercase tracking-widest opacity-80 mb-0.5">Market verdict</p>
        <p className="text-xl font-bold tracking-tight">{verdict}</p>
      </div>
    );
  }

  return (
    <span className={cn(
      "rounded bg-background border px-2 py-0.5 font-bold uppercase tracking-wider shadow-sm",
      small ? "text-[9px]" : "text-[10px]",
      isGo ? "border-success/20 text-success" : "border-warning/20 text-warning"
    )}>
      {verdict}
    </span>
  );
}
