import { createContext, useContext, ReactNode, useMemo, useState } from 'react';
import { computeMarkets } from '../lib/compute';
import { merchantProfiles } from '../lib/profiles';
import { ComputedMarket, MerchantProfile } from '../types';

type AppContextType = {
  profile: MerchantProfile;
  profiles: MerchantProfile[];
  selectProfile: (id: string) => void;
  markets: ComputedMarket[];
  loading: boolean;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [profileId, setProfileId] = useState(() => localStorage.getItem('rize-passport-profile') || 'aavira');
  const profile = merchantProfiles.find((item) => item.id === profileId) || merchantProfiles[1];
  const markets = useMemo(() => computeMarkets(profile), [profile]);

  const selectProfile = (id: string) => {
    localStorage.setItem('rize-passport-profile', id);
    setProfileId(id);
  };

  return (
    <AppContext.Provider value={{ profile, profiles: merchantProfiles, selectProfile, markets, loading: false }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error('useApp must be used inside AppProvider');
  return value;
}