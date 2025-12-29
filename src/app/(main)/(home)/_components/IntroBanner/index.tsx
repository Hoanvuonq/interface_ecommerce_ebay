"use client";

import { useHomepageBannerContext } from "@/app/(main)/(home)/_context/HomepageBannerContext";
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

  let imageUrl: string | undefined;
  let imageUrlDesktop: string | undefined;
  let imageUrlMobile: string | undefined;

  if (banner.basePath && banner.extension) {
    imageUrl = resolveBannerImageUrl(
      banner.basePath,
      banner.extension,
      "_orig"
    );
  }

  if (banner.basePathDesktop && banner.extensionDesktop) {
    imageUrlDesktop = resolveBannerImageUrl(
      banner.basePathDesktop,
      banner.extensionDesktop,
      "_orig"
    );
  }

  if (banner.basePathMobile && banner.extensionMobile) {
    imageUrlMobile = resolveBannerImageUrl(
      banner.basePathMobile,
      banner.extensionMobile,
      "_orig"
    );
  }

  const parts = banner.subtitle?.split("\n") || [];
  return {
    id: banner.id,
    title: banner.title || "Khuyến mãi",
    description: parts[0] || "",
    description2: parts[1] || "",
    href: banner.href || "/products",
    imageUrl,
    imageUrlDesktop,
    imageUrlMobile,
    ...preset,
  };
};

export const IntroBanner = () => {
  const [isDismissed, setIsDismissed] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  const { introBanners, loading } = useHomepageBannerContext();
  useEffect(() => {
    if (typeof window === "undefined") return;

    const dismissedAt = Number(localStorage.getItem(INTRO_BANNER_STORAGE_KEY));
    if (!dismissedAt || Number.isNaN(dismissedAt)) {
      setIsDismissed(false);
      setShowBanner(true);
      return;
    }

    if (Date.now() - dismissedAt > INTRO_BANNER_EXPIRATION_MS) {
      localStorage.removeItem(INTRO_BANNER_STORAGE_KEY);
      setIsDismissed(false);
      setShowBanner(true);
    } else {
      setIsDismissed(true);
      setShowBanner(false);
    }
  }, []);

  useEffect(() => {
    if (!showBanner || isDismissed) return;

    const y = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${y}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, y);
    };
  }, [showBanner, isDismissed]);

  useEffect(() => {
    const styleId = "intro-banner-image-force-display";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
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

  if (!banner || loading || isDismissed || !showBanner) return null;

  return (
    <div
      className="fixed inset-0 z-2000 flex items-center justify-center"
      style={{ width: "100vw", height: "100vh" }}
    >
      <div className="absolute inset-0 bg-black/20" onClick={handleDismiss} />
      <div className="relative z-2100 flex items-center justify-center -mt-32 md:-mt-40">
        <button
          onClick={handleDismiss}
          className={cn(
            "absolute -top-3 -right-3 z-2200 bg-white/95 hover:bg-white",
            "rounded-full w-10 h-10 flex items-center justify-center",
            "shadow-lg border border-gray-200 hover:scale-110 transition-all"
          )}
          aria-label="Đóng banner"
        >
          <X className="text-lg text-gray-700" />
        </button>

        <Link
          href={banner.href}
          onClick={handleDismiss}
          className="block relative"
        >
          {banner.imageUrl ||
          banner.imageUrlDesktop ||
          banner.imageUrlMobile ? (
            <picture>
              {banner.imageUrlMobile && (
                <source
                  media="(max-width: 768px)"
                  srcSet={banner.imageUrlMobile}
                />
              )}
              {banner.imageUrlDesktop && (
                <source
                  media="(min-width: 769px)"
                  srcSet={banner.imageUrlDesktop}
                />
              )}
              <img
                src={
                  banner.imageUrl ||
                  banner.imageUrlDesktop ||
                  banner.imageUrlMobile ||
                  ""
                }
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
            <div className={cn(
                "w-[320px] h-80 rounded-3xl flex flex-col items-center justify-center text-white bg-linear-to-br shadow-2xl p-8",
                banner.gradient,
                "dark:ring-2 dark:ring-white/20"
              )}>
               <h3 className="text-2xl font-bold mb-2">{banner.title}</h3>
               <p className="opacity-90">{banner.description}</p>
            </div>
          )}
        </Link>
      </div>
    </div>
  );
}
