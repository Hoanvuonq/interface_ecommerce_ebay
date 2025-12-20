"use client";
import { useHomepageBannerContext } from "@/app/(home)/_context/HomepageBannerContext";
import { mapBannerToDisplay } from "@/app/(home)/_utils/bannerMapping";
import { QuickLinks } from "@/constants/section";
import Link from "next/link";
import React, { useMemo } from "react";
import { CustomCarousel, SectionLoading } from "@/components";
import { cn } from "@/utils/cn";
const DEFAULT_BANNER_IMAGE = "/images/hero/default-banner.jpg";

export const Promotion: React.FC = () => {
  const { heroBanners, loading, error } = useHomepageBannerContext();

  const selectedBanners = useMemo(() => {
    return heroBanners;
  }, [heroBanners]);

  const banners = useMemo(() => {
    return selectedBanners.map((banner, index) =>
      mapBannerToDisplay(banner, index)
    );
  }, [selectedBanners]);

  const quickLinksRow = useMemo(
    () => (
      <div className="max-w-300 mx-auto w-full mt-6">
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4 lg:gap-8 py-3">
          {QuickLinks.map((item) => {
            const Icon = item.icon;
            const bgColorClass = item.bgColor;

            return (
              <Link
                key={item.key}
                href={item.href}
                className="flex flex-col items-center gap-2 group transition-colors duration-200"
              >
                <div
                  className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center",
                    "transition-all duration-300",
                    bgColorClass
                  )}
                >
                  <Icon
                    style={{ color: item.color, fontSize: 28 }}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-pink-600 transition-colors text-center leading-tight">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    ),
    [QuickLinks]
  );

  if (loading) {
    return <SectionLoading message="Loading ..." />;
  }

  if (error || banners.length === 0) {
    return (
      <section className="bg-white pt-5 pb-6">
        <div className="max-w-[300 mx-auto px-4 sm:px-6 lg:px-0">
          <div className="w-full rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
            <img
              src={DEFAULT_BANNER_IMAGE}
              alt="Hero banner"
              className="w-full h-auto object-cover"
              loading="lazy"
            />
          </div>
        </div>
        {quickLinksRow}
      </section>
    );
  }

  const mainBanners = banners.slice(0, 3);
  const sideBanner1 = banners[3] || banners[0];
  const sideBanner2 = banners[4] || banners[1] || banners[0];

  return (
    <section className="bg-white pt-5 pb-6">
      <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-0">
        <div className="hidden lg:grid lg:grid-cols-3 gap-4">
          <div className="col-span-2 relative rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.05)] group banner-hover-effect">
            <CustomCarousel banners={mainBanners} className="h-65" />
          </div>
          <div className="flex flex-col gap-4">
            <Link
              href={sideBanner1.href}
              className="block rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.05)] banner-hover-effect"
            >
              <img
                src={
                  sideBanner1.imageUrlDesktop ||
                  sideBanner1.imageUrl ||
                  DEFAULT_BANNER_IMAGE
                }
                alt={sideBanner1.title || "Side banner"}
                className="w-full h-30.5 object-cover"
                loading="lazy"
              />
            </Link>
            <Link
              href={sideBanner2.href}
              className="block rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.05)] banner-hover-effect"
            >
              <img
                src={
                  sideBanner2.imageUrlDesktop ||
                  sideBanner2.imageUrl ||
                  DEFAULT_BANNER_IMAGE
                }
                alt={sideBanner2.title || "Side banner"}
                className="w-full h-30.5 object-cover"
                loading="lazy"
              />
            </Link>
          </div>
        </div>

        <div className="lg:hidden relative rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.05)] group">
          <CustomCarousel banners={banners} isMobile />
        </div>
      </div>
      {quickLinksRow}
    </section>
  );
};
