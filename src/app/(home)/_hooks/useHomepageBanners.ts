'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { homepageService } from '../services/homepage.service';
import { BannerResponseDTO, BannerDisplayLocation } from '../_types/banner.dto';

interface UseHomepageBannersOptions {
  locale?: string;
  device?: string;
  autoFetch?: boolean;
}

interface UseHomepageBannersReturn {
  heroBanners: BannerResponseDTO[];
  introBanners: BannerResponseDTO[];
  sidebarBanners: BannerResponseDTO[];
  footerBanners: BannerResponseDTO[];
  allBanners: BannerResponseDTO[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook để fetch và quản lý homepage banners
 * Tách logic fetch data ra khỏi component để:
 * - Tái sử dụng ở nhiều component khác
 * - Dễ test
 * - Code component sạch hơn
 * - Centralized state management
 */
export const useHomepageBanners = (
  options: UseHomepageBannersOptions = {}
): UseHomepageBannersReturn => {
  const {
    locale = 'vi',
    device,
    autoFetch = true,
  } = options;

  const [heroBanners, setHeroBanners] = useState<BannerResponseDTO[]>([]);
  const [introBanners, setIntroBanners] = useState<BannerResponseDTO[]>([]);
  const [sidebarBanners, setSidebarBanners] = useState<BannerResponseDTO[]>([]);
  const [footerBanners, setFooterBanners] = useState<BannerResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use ref to prevent duplicate API calls
  const isFetchingRef = useRef(false);
  const lastFetchParamsRef = useRef<{ locale: string; device: string } | null>(null);

  // Memoize fetchBanners to prevent recreation on every render
  const fetchBanners = useCallback(async () => {
    // Detect device type if not provided
    const deviceType = device || (typeof window !== 'undefined'
      ? window.innerWidth >= 768 ? 'DESKTOP' : 'MOBILE'
      : 'ALL');

    // Check if we're already fetching with the same params
    const currentParams = { locale, device: deviceType };
    if (isFetchingRef.current) {
      console.log('[useHomepageBanners] Already fetching, skipping duplicate call');
      return;
    }

    // Check if we already fetched with the same params
    if (lastFetchParamsRef.current && 
        lastFetchParamsRef.current.locale === currentParams.locale &&
        lastFetchParamsRef.current.device === currentParams.device) {
      console.log('[useHomepageBanners] Already fetched with same params, skipping');
      return;
    }

    try {
      isFetchingRef.current = true;
      lastFetchParamsRef.current = currentParams;
      setLoading(true);
      setError(null);

      console.log('[useHomepageBanners] Fetching banners - locale:', locale, 'device:', deviceType);

      // Fetch ALL HOMEPAGE banners at once using /active/by-page API
      const response = await homepageService.getBannersByPage({
        page: 'HOMEPAGE',
        locale,
        device: deviceType,
      });

      if (response.success && response.data && response.data.banners) {
        const groupedBanners = response.data.banners;

        // Extract banners by display location
        setIntroBanners(groupedBanners['HOMEPAGE_INTRO'] || []);
        setHeroBanners(groupedBanners['HOMEPAGE_HERO'] || []);
        setSidebarBanners(groupedBanners['HOMEPAGE_SIDEBAR'] || []);
        setFooterBanners(groupedBanners['HOMEPAGE_FOOTER'] || []);
        
        console.log('[useHomepageBanners] Banners fetched successfully');
      } else {
        setError('Không thể tải banners');
        // Reset all banners on error
        setIntroBanners([]);
        setHeroBanners([]);
        setSidebarBanners([]);
        setFooterBanners([]);
      }
    } catch (err: any) {
      console.error('[useHomepageBanners] Error fetching homepage banners:', err);
      setError(err?.response?.data?.message || err?.message || 'Đã có lỗi xảy ra');
      // Reset last fetch params on error so we can retry
      lastFetchParamsRef.current = null;
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [locale, device]); // Depend on locale and device

  useEffect(() => {
    if (autoFetch) {
      fetchBanners();
    }
  }, [autoFetch, fetchBanners]); // Depend on autoFetch and memoized fetchBanners

  return {
    heroBanners,
    introBanners,
    sidebarBanners,
    footerBanners,
    allBanners: [
      ...introBanners,
      ...heroBanners,
      ...sidebarBanners,
      ...footerBanners,
    ],
    loading,
    error,
    refetch: fetchBanners,
  };
};

