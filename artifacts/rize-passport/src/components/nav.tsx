import { Link, useLocation, useSearch } from 'wouter';
import { ChevronDown, LockKeyhole, Shield } from 'lucide-react';
import { useApp } from '@/hooks/use-app';

export function Nav() {
  const [location] = useLocation();
  const search = useSearch();
  const { profile, profiles, selectProfile, markets } = useApp();

  const query = new URLSearchParams(search);
  const pathParts = location.split('/');

  let country: string = markets[0]?.country || 'US';
  if (location === '/') {
    country = query.get('market') || country;
  } else if (pathParts.length > 2) {
    country = pathParts[2].split('?')[0];
  }

  const marketReady = markets.find((market) => market.country === country)?.route !== 'NOT_YET';
  const navItems = [
    { path: `/?market=${country}`, label: 'Radar', locked: false, isActive: location === '/' },
    { path: `/launch/${country}`, label: 'Launch Plan', locked: !marketReady, isActive: location.startsWith('/launch') },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/95 backdrop-blur">
      <div className="w-full max-w-7xl mx-auto flex min-h-16 items-center justify-between gap-3 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Shield className="h-5 w-5 text-primary" />
          <div className="hidden sm:flex flex-col">
            <span className="font-semibold leading-none tracking-tight">Rize Passport</span>
            <span className="text-[9px] text-muted-foreground uppercase tracking-[0.18em] font-mono">Razorpay Rize</span>
          </div>
        </Link>
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item, i) => {
            if (item.locked) {
              return <span key={i} title="Available after this market passes Border Check" aria-disabled="true" className="flex cursor-not-allowed items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground/45"><LockKeyhole className="h-3 w-3" />{item.label}</span>;
            }
            return (
              <Link key={i} href={item.path} className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${item.isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <label className="relative flex items-center min-w-0">
          <span className="sr-only">Switch merchant</span>
          <select
            value={profile.id}
            onChange={(event) => selectProfile(event.target.value)}
            className="appearance-none max-w-[190px] rounded-md border bg-card py-2 pl-3 pr-8 text-sm font-medium outline-none focus:ring-2 focus:ring-primary"
          >
            {profiles.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 h-4 w-4 text-muted-foreground" />
        </label>
      </div>
      <nav className="lg:hidden flex overflow-x-auto border-t px-3 py-1">
        {navItems.map((item, i) => item.locked
          ? <span key={i} aria-disabled="true" className="flex cursor-not-allowed items-center gap-1 whitespace-nowrap px-3 py-2 text-xs text-muted-foreground/45"><LockKeyhole className="h-3 w-3" />{item.label}</span>
          : <Link key={i} href={item.path} className={`whitespace-nowrap px-3 py-2 text-xs transition-colors ${item.isActive ? 'text-primary font-medium' : 'text-muted-foreground'}`}>{item.label}</Link>)}
      </nav>
    </header>
  );
}
