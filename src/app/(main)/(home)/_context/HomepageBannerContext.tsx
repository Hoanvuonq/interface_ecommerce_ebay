'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useHomepageBanners } from '../_hooks/useHomepageBanners';
import { BannerResponseDTO } from '../_types/banner.dto';

interface HomepageBannerContextValue {
  heroBanners: BannerResponseDTO[];
  introBanners: BannerResponseDTO[];
  sidebarBanners: BannerResponseDTO[];
  footerBanners: BannerResponseDTO[];
  allBanners: BannerResponseDTO[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const HomepageBannerContext = createContext<HomepageBannerContextValue | undefined>(undefined);

interface HomepageBannerProviderProps {
  children: ReactNode;
  locale?: string;
  device?: string;
}

export const HomepageBannerProvider: React.FC<HomepageBannerProviderProps> = ({
  children,
  locale = 'vi',
  device,
}) => {
  const bannerData = useHomepageBanners({
    locale,
    device,
    autoFetch: true,
  });

  return (
    <HomepageBannerContext.Provider value={bannerData}>
      {children}
    </HomepageBannerContext.Provider>
  );
};

export const useHomepageBannerContext = (): HomepageBannerContextValue => {
  const context = useContext(HomepageBannerContext);
  if (context === undefined) {
    throw new Error('useHomepageBannerContext must be used within HomepageBannerProvider');
  }
  return context;
};

