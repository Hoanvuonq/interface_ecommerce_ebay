'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useHomepageBannerContext } from '@/app/(home)/_context/HomepageBannerContext';
import { BannerResponseDTO } from '../../_types/banner.dto';
import { resolveBannerImageUrl } from '@/utils/products/media.helpers';

const INTRO_BANNER_STORAGE_KEY = 'homepageIntroBannerDismissedAt';
const INTRO_BANNER_EXPIRATION_MS = 12 * 60 * 60 * 1000; // 12h

const GRADIENT_PRESETS = [
  { gradient: 'from-blue-300 via-cyan-200 to-teal-300' },
  { gradient: 'from-orange-400 via-pink-400 to-red-500' },
  { gradient: 'from-purple-400 via-indigo-400 to-blue-500' },
  { gradient: 'from-green-400 via-emerald-300 to-teal-400' },
  { gradient: 'from-pink-400 via-rose-300 to-red-400' },
];

const mapBannerToDisplay = (banner: BannerResponseDTO, index: number) => {
  const preset = GRADIENT_PRESETS[index % GRADIENT_PRESETS.length];

  let imageUrl: string | undefined;
  let imageUrlDesktop: string | undefined;
  let imageUrlMobile: string | undefined;

  // Legacy/Fallback
  if (banner.basePath && banner.extension) {
    imageUrl = resolveBannerImageUrl(banner.basePath, banner.extension, '_orig');
  }

  // Desktop
  if (banner.basePathDesktop && banner.extensionDesktop) {
    imageUrlDesktop = resolveBannerImageUrl(banner.basePathDesktop, banner.extensionDesktop, '_orig');
  }

  // Mobile
  if (banner.basePathMobile && banner.extensionMobile) {
    imageUrlMobile = resolveBannerImageUrl(banner.basePathMobile, banner.extensionMobile, '_orig');
  }

  const parts = banner.subtitle?.split('\n') || [];
  return {
    id: banner.id,
    title: banner.title || 'Khuyến mãi',
    description: parts[0] || '',
    description2: parts[1] || '',
    href: banner.href || '/products',
    imageUrl,
    imageUrlDesktop,
    imageUrlMobile,
    ...preset,
  };
};

export default function IntroBanner() {
  const [isDismissed, setIsDismissed] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  const { introBanners, loading } = useHomepageBannerContext();

  // Check whether banner should be shown
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const dismissedAt = Number(localStorage.getItem(INTRO_BANNER_STORAGE_KEY));
    if (!dismissedAt || Number.isNaN(dismissedAt)) {
      setIsDismissed(false);
      setShowBanner(true);
      return;
    }

    // Check if expired
    if (Date.now() - dismissedAt > INTRO_BANNER_EXPIRATION_MS) {
      localStorage.removeItem(INTRO_BANNER_STORAGE_KEY);
      setIsDismissed(false);
      setShowBanner(true);
    } else {
      setIsDismissed(true);
      setShowBanner(false);
    }
  }, []);

  // Lock scroll when banner is shown
  useEffect(() => {
    if (!showBanner || isDismissed) return;

    const y = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${y}px`;
    document.body.style.width = '100%';

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, y);
    };
  }, [showBanner, isDismissed]);

  // Inject custom CSS để đảm bảo hình ảnh luôn hiển thị
  useEffect(() => {
    const styleId = 'intro-banner-image-force-display';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .intro-banner-image {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        max-width: min(60vw, 600px) !important;
        max-height: 50vh !important;
        width: auto !important;
        height: auto !important;
        object-fit: contain !important;
        margin: 0 auto !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  const banner = useMemo(() => {
    if (introBanners.length === 0) return null;
    return mapBannerToDisplay(introBanners[0], 0);
  }, [introBanners]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setShowBanner(false);
    localStorage.setItem(INTRO_BANNER_STORAGE_KEY, Date.now().toString());
  };

  // Don't show if dismissed, loading, or no banner
  if (!banner || loading || isDismissed || !showBanner) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center"
      style={{ width: '100vw', height: '100vh' }}
    >
      {/* Backdrop - chỉ để click đóng, không có nền */}
      <div
        className="absolute inset-0 bg-black/20"
        onClick={handleDismiss}
      />

      {/* Content - Căn giữa ngang, dịch lên trên */}
      <div className="relative z-[2100] flex items-center justify-center -mt-32 md:-mt-40">

        {/* Close button - nổi bật trên ảnh */}
        <button
          onClick={handleDismiss}
          className="absolute -top-3 -right-3 z-[2200] bg-white/95 hover:bg-white 
                     rounded-full w-10 h-10 flex items-center justify-center 
                     shadow-lg border border-gray-200 hover:scale-110 transition-all"
          aria-label="Đóng banner"
        >
          <X className="text-lg text-gray-700" />
        </button>

        {/* Image - không có nền, border, shadow, kích thước vừa phải */}
        <Link href={banner.href} onClick={handleDismiss} className="block relative">
          {banner.imageUrl || banner.imageUrlDesktop || banner.imageUrlMobile ? (
            <picture>
              {/* Mobile Source */}
              {banner.imageUrlMobile && (
                <source media="(max-width: 768px)" srcSet={banner.imageUrlMobile} />
              )}
              {/* Desktop Source */}
              {banner.imageUrlDesktop && (
                <source media="(min-width: 769px)" srcSet={banner.imageUrlDesktop} />
              )}
              {/* Fallback Image */}
              <img
                src={banner.imageUrl || banner.imageUrlDesktop || banner.imageUrlMobile || ''}
                alt={banner.title}
                onError={() => setImageError(true)}
                className="intro-banner-image"
                style={{
                  maxWidth: "min(60vw, 600px)",
                  maxHeight: "50vh",
                  width: "auto",
                  height: "auto",
                  objectFit: "contain",
                  display: "block",
                  margin: "0 auto",
                }}
              />
            </picture>
          ) : (
            <div
              className={`w-[300px] h-[300px] flex items-center justify-center 
                          text-white bg-gradient-to-br ${banner.gradient}`}
            >
              Không thể tải hình ảnh
            </div>
          )}
        </Link>

      </div>
    </div>
  );
}
