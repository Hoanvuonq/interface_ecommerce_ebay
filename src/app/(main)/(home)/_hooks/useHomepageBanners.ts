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

  // Chỉ fetch 1 lần duy nhất cho mỗi cặp locale/device
  const fetchedParamsRef = useRef<{ locale: string; device: string }[]>([]);
  const isFetchingRef = useRef(false);

  const fetchBanners = useCallback(async () => {
    const deviceType = device || (typeof window !== 'undefined'
      ? window.innerWidth >= 768 ? 'DESKTOP' : 'MOBILE'
      : 'ALL');
    const currentParams = { locale, device: deviceType };

    // Kiểm tra đã fetch chưa
    if (fetchedParamsRef.current.some(
      (p) => p.locale === currentParams.locale && p.device === currentParams.device
    )) {
      // Đã fetch rồi, không gọi lại nữa
      return;
    }
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const response = await homepageService.getBannersByPage({
        page: 'HOMEPAGE',
        locale,
        device: deviceType,
      });
      if (response.success && response.data && response.data.banners) {
        const groupedBanners = response.data.banners;
        setIntroBanners(groupedBanners['HOMEPAGE_INTRO'] || []);
        setHeroBanners(groupedBanners['HOMEPAGE_HERO'] || []);
        setSidebarBanners(groupedBanners['HOMEPAGE_SIDEBAR'] || []);
        setFooterBanners(groupedBanners['HOMEPAGE_FOOTER'] || []);
        // Đánh dấu đã fetch
        fetchedParamsRef.current.push(currentParams);
      } else {
        setError('Không thể tải banners');
        setIntroBanners([]);
        setHeroBanners([]);
        setSidebarBanners([]);
        setFooterBanners([]);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [locale, device]);

  useEffect(() => {
    if (autoFetch) {
      fetchBanners();
    }
  }, [autoFetch, locale, device]);

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

