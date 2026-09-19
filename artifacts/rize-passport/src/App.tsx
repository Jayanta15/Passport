import { type ReactNode, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  Route,
  Switch,
  useLocation,
  useParams,
  Router as WouterRouter,
} from 'wouter';
import { AppProvider, useApp } from '@/hooks/use-app';
import { Nav } from '@/components/nav';

import Radar from '@/pages/radar';
import LaunchPlan from '@/pages/launch-plan';

const queryClient = new QueryClient();

function Layout({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const { markets, profile } = useApp();

  // Keyboard nav
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const query = new URLSearchParams(window.location.search);
      const defaultCountry = markets?.[0]?.country || 'US';
      const pathParts = location.split('/');
      let currentCountry: string = defaultCountry;

      if (location === '/') {
        currentCountry = query.get('market') || defaultCountry;
      } else if (pathParts.length > 2) {
        currentCountry = pathParts[2].split('?')[0];
      }

      const marketReady = markets.find((market) => market.country === currentCountry)?.route !== 'NOT_YET';

      switch(e.key) {
        case '1':
          setLocation(`/?market=${currentCountry}`);
          break;
        case '2':
          if (marketReady) setLocation(`/launch/${currentCountry}`);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [location, setLocation, markets]);

  useEffect(() => {
    const routeMatch = location.match(/^\/(?:launch|price)\/([^?]+)/);
    if (!routeMatch) return;
    const currentMarket = markets.find((market) => market.country === routeMatch[1]);
    if (currentMarket?.route === 'NOT_YET') {
      setLocation(`/?market=${currentMarket.country}`, { replace: true });
    }
  }, [location, markets, setLocation]);

  useEffect(() => {
    const section = location.startsWith('/launch') || location.startsWith('/price') ? 'Launch Plan' : 'Radar';
    document.title = `${section} · ${profile.name} · Rize Passport`;
    const description = document.querySelector('meta[name="description"]') || document.head.appendChild(document.createElement('meta'));
    description.setAttribute('name', 'description');
    description.setAttribute('content', 'Rize Passport helps Indian heritage fashion and jewellery brands decide when and how to enter international markets.');
  }, [location, profile.name]);

  return (
    <div className="min-h-[100dvh] w-full flex flex-col bg-background text-foreground selection:bg-primary/30">
      <Nav />
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 pb-24">
        {children}
      </main>
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Layout>
        <Switch>
          <Route path="/" component={Radar} />
          <Route path="/market/:country" component={LegacyMarketRedirect} />
          <Route path="/launch/:country" component={LaunchPlan} />
          <Route path="/price/:country" component={LegacyPriceRedirect} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </RoutedErrorBoundary>
  );
}

function LegacyMarketRedirect() {
  const { country } = useParams();
  const [, setLocation] = useLocation();
  useEffect(() => {
    setLocation(`/?market=${country}`, { replace: true });
  }, [country, setLocation]);
  return null;
}

function LegacyPriceRedirect() {
  const { country } = useParams();
  const [, setLocation] = useLocation();
  useEffect(() => {
    setLocation(`/launch/${country}${window.location.search}`, { replace: true });
  }, [country, setLocation]);
  return null;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={150}>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <AppProvider>
            <Router />
          </AppProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
