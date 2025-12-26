"use client";
import React from "react";
import Link from "next/link";
import { CustomCarousel } from "@/components";

const DEFAULT_BANNER_IMAGE = "/images/hero/default-banner.jpg";

interface HeroBannersProps {
  banners: any[];
}

export const HeroBanners: React.FC<HeroBannersProps> = ({ banners }) => {
  if (banners.length === 0) {
    return (
      <div className="w-full rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
        <img
          src={DEFAULT_BANNER_IMAGE}
          alt="Hero banner default"
          className="w-full h-auto object-cover"
        />
      </div>
    );
  }

  const mainBanners = banners.slice(0, 3);
  const sideBanner1 = banners[3] || banners[0];
  const sideBanner2 = banners[4] || banners[1] || banners[0];

  return (
    <>
      <div className="hidden lg:grid lg:grid-cols-3 gap-4">
        <div className="col-span-2 relative rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.05)] group banner-hover-effect">
          <CustomCarousel banners={mainBanners} className="h-65" />
        </div>
        
        <div className="flex flex-col gap-4">
          {[sideBanner1, sideBanner2].map((banner, idx) => (
            <Link
              key={idx}
              href={banner.href}
              className="block rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.05)] banner-hover-effect"
            >
              <img
                src={banner.imageUrlDesktop || banner.imageUrl || DEFAULT_BANNER_IMAGE}
                alt={banner.title || "Side banner"}
                className="w-full h-30.5 object-cover"
                loading="lazy"
              />
            </Link>
          ))}
        </div>
      </div>

      <div className="lg:hidden relative rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.05)] group">
        <CustomCarousel banners={banners} isMobile />
      </div>
    </>
  );
};