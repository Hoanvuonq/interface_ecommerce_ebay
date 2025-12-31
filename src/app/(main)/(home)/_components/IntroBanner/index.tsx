"use client";

import { useHomepageContext } from "@/app/(main)/(home)/_context/HomepageContext";
import { GRADIENT_PRESETS } from "@/constants/section";
import { cn } from "@/utils/cn";
import { resolveBannerImageUrl } from "@/utils/products/media.helpers";
import { X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BannerResponseDTO } from "../../_types/banner.dto";

const INTRO_BANNER_STORAGE_KEY = "homepageIntroBannerDismissedAt";
const INTRO_BANNER_EXPIRATION_MS = 12 * 60 * 60 * 1000;

const mapBannerToDisplay = (banner: BannerResponseDTO, index: number) => {
  const preset = GRADIENT_PRESETS[index % GRADIENT_PRESETS.length];
  const parts = banner.subtitle?.split("\n") || [];

  return {
    id: banner.id,
    title: banner.title || "Khuyến mãi",
    description: parts[0] || "",
    description2: parts[1] || "",
    href: banner.href || "/products",
    imageUrl: banner.basePath ? resolveBannerImageUrl(banner.basePath, banner.extension!, "_orig") : undefined,
    imageUrlDesktop: banner.basePathDesktop ? resolveBannerImageUrl(banner.basePathDesktop, banner.extensionDesktop!, "_orig") : undefined,
    imageUrlMobile: banner.basePathMobile ? resolveBannerImageUrl(banner.basePathMobile, banner.extensionMobile!, "_orig") : undefined,
    ...preset,
  };
};

export const IntroBanner = () => {
  const [isDismissed, setIsDismissed] = useState(true);
  const [showBanner, setShowBanner] = useState(false);
  
  const { banners, isLoading } = useHomepageContext();
  const introBanners = banners?.intro || [];

  useEffect(() => {
    const dismissedAt = localStorage.getItem(INTRO_BANNER_STORAGE_KEY);
    const isExpired = !dismissedAt || (Date.now() - Number(dismissedAt) > INTRO_BANNER_EXPIRATION_MS);

    if (isExpired) {
      setIsDismissed(false);
      setShowBanner(true);
    }
  }, []);

  useEffect(() => {
    const shouldLock = showBanner && !isDismissed && introBanners.length > 0;
    
    if (shouldLock) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "var(--removed-body-scroll-bar-size, 0px)"; 

      return () => {
        document.body.style.overflow = originalStyle;
        document.body.style.paddingRight = "0px";
      };
    }
  }, [showBanner, isDismissed, introBanners]);

  const bannerData = useMemo(() => {
    if (introBanners.length === 0) return null;
    return mapBannerToDisplay(introBanners[0], 0);
  }, [introBanners]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setShowBanner(false);
    localStorage.setItem(INTRO_BANNER_STORAGE_KEY, Date.now().toString());
  };

  // Nếu đang load hoặc không có dữ liệu thì không render
  if (isLoading || isDismissed || !showBanner || !bannerData) return null;

  const hasImage = !!(bannerData.imageUrl || bannerData.imageUrlDesktop || bannerData.imageUrlMobile);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Overlay: clickable để đóng */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-500" 
        onClick={handleDismiss} 
      />

      <div className="relative z-[10000] w-full max-w-fit flex items-center justify-center animate-in zoom-in-95 duration-300">
        <button
          onClick={handleDismiss}
          className={cn(
            "absolute -top-3 -right-3 z-[10001] bg-white text-slate-900",
            "rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center",
            "shadow-xl border border-slate-200 hover:scale-110 active:scale-95 transition-all"
          )}
          aria-label="Đóng banner"
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        <Link
          href={bannerData.href}
          onClick={handleDismiss}
          className="block outline-none"
        >
          {hasImage ? (
            <picture className="block">
              {bannerData.imageUrlMobile && (
                <source media="(max-width: 768px)" srcSet={bannerData.imageUrlMobile} />
              )}
              {bannerData.imageUrlDesktop && (
                <source media="(min-width: 769px)" srcSet={bannerData.imageUrlDesktop} />
              )}
              <img
                src={bannerData.imageUrl || bannerData.imageUrlDesktop || bannerData.imageUrlMobile}
                alt={bannerData.title}
                className="rounded-2xl shadow-2xl object-contain ring-4 ring-white/10"
                style={{
                  maxWidth: "min(90vw, 500px)",
                  maxHeight: "80vh",
                  width: "auto",
                  height: "auto",
                }}
              />
            </picture>
          ) : (
            <div className={cn(
                "w-[280px] md:w-[350px] aspect-square rounded-3xl flex flex-col items-center justify-center text-white bg-linear-to-br shadow-2xl p-8 text-center",
                bannerData.gradient
              )}>
                <h3 className="text-2xl font-bold uppercase mb-4 italic leading-tight">
                    {bannerData.title}
                </h3>
                <p className="font-medium opacity-95 text-lg">
                    {bannerData.description}
                </p>
                {bannerData.description2 && (
                    <p className="text-sm mt-4 opacity-80 italic">
                        {bannerData.description2}
                    </p>
                )}
                <div className="mt-6 px-6 py-2 bg-white text-slate-900 rounded-full font-bold text-sm">
                    XEM NGAY
                </div>
            </div>
          )}
        </Link>
      </div>
    </div>
  );
};