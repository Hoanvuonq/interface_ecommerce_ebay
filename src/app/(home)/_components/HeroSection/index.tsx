"use client";

import { useHomepageBannerContext } from "@/app/(home)/_context/HomepageBannerContext";
import { mapBannerToDisplay } from "@/app/(home)/_utils/bannerMapping";
import { QuickLinks } from "@/constants/section";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Carousel, Spin } from "antd";
import Link from "next/link";
import React, { useEffect, useMemo, useRef } from "react";
const DEFAULT_BANNER_IMAGE = "/images/hero/default-banner.jpg";

const HeroSection: React.FC = () => {
  const carouselRef = useRef<any>(null);

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
      <div className="max-w-[1200px] mx-auto w-full mt-6">
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-4 lg:gap-6 py-3">
          {QuickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.key}
                href={item.href}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-12 h-12 flex items-center justify-center transition-transform group-hover:scale-110">
                  <Icon style={{ color: item.color, fontSize: 32 }} />
                </div>
                <span className="text-[14px] font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
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

  useEffect(() => {
    const styleId = "hero-carousel-custom-styles";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
            .hero-carousel .custom-dots {
                bottom: 20px !important;
            }
            .hero-carousel .custom-dots li button {
                width: 14px !important;
                height: 14px !important;
                border-radius: 50% !important;
                background: rgba(255, 255, 255, 0.5) !important;
                border: 2px solid rgba(255, 255, 255, 0.8) !important;
            }
            .hero-carousel .custom-dots li.slick-active button {
                background: #ff6b00 !important;
                border-color: #ff6b00 !important;
                width: 36px !important;
                border-radius: 6px !important;
            }
            .hero-carousel .slick-slide {
                transition: transform 0.3s ease;
            }
            .banner-hover-effect {
                transition: transform 0.25s ease, box-shadow 0.25s ease;
            }
            .banner-hover-effect:hover {
                transform: scale(1.01);
                box-shadow: 0 4px 16px rgba(0,0,0,0.12);
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

  // Show loading state
  if (loading) {
    return (
      <section className="bg-white pt-5 pb-6">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-0">
          <div className="flex justify-center items-center min-h-[280px]">
            <Spin size="large" />
          </div>
        </div>
      </section>
    );
  }

  // Show error or empty state with default banner
  if (error || banners.length === 0) {
    return (
      <section className="bg-white pt-5 pb-6">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-0">
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

  // Get banners for different positions
  const mainBanners = banners.slice(0, 3); // For carousel
  const sideBanner1 = banners[3] || banners[0]; // First side banner (or fallback to first main)
  const sideBanner2 = banners[4] || banners[1] || banners[0]; // Second side banner (or fallback)

  return (
    <section className="bg-white pt-5 pb-6">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-0">
        {/* Desktop Grid Layout: 67%-33% */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-4">
          <div className="col-span-2 relative rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.05)] group banner-hover-effect">
            {mainBanners.length > 1 && (
              <>
                <button
                  onClick={() => carouselRef.current?.prev()}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                  aria-label="Slide trước"
                >
                  <LeftOutlined className="text-gray-700" />
                </button>
                <button
                  onClick={() => carouselRef.current?.next()}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                  aria-label="Slide tiếp theo"
                >
                  <RightOutlined className="text-gray-700" />
                </button>
              </>
            )}
            <Carousel
              ref={carouselRef}
              autoplay
              autoplaySpeed={4500}
              effect="fade"
              dots={{ className: "custom-dots" }}
              className="hero-carousel"
              pauseOnHover
            >
              {mainBanners.map((banner) => (
                <div key={banner.id} className="w-full">
                  <Link href={banner.href}>
                    <img
                      src={
                        banner.imageUrlDesktop ||
                        banner.imageUrl ||
                        DEFAULT_BANNER_IMAGE
                      }
                      alt={banner.title || "Hero banner"}
                      className="w-full h-[260px] object-cover"
                      loading="lazy"
                    />
                  </Link>
                </div>
              ))}
            </Carousel>
          </div>

          {/* Side Banners - 33% (1 column) */}
          <div className="flex flex-col gap-4">
            {/* Top Side Banner */}
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
                className="w-full h-[122px] object-cover"
                loading="lazy"
              />
            </Link>

            {/* Bottom Side Banner */}
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
                className="w-full h-[122px] object-cover"
                loading="lazy"
              />
            </Link>
          </div>
        </div>

        {/* Mobile/Tablet: Single Carousel */}
        <div className="lg:hidden relative rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.05)] group">
          {banners.length > 1 && (
            <>
              <button
                onClick={() => carouselRef.current?.prev()}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                aria-label="Slide trước"
              >
                <LeftOutlined className="text-gray-700" />
              </button>
              <button
                onClick={() => carouselRef.current?.next()}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                aria-label="Slide tiếp theo"
              >
                <RightOutlined className="text-gray-700" />
              </button>
            </>
          )}
          <Carousel
            ref={carouselRef}
            autoplay
            autoplaySpeed={4500}
            effect="fade"
            dots={{ className: "custom-dots" }}
            className="hero-carousel"
            pauseOnHover
          >
            {banners.map((banner) => (
              <div key={banner.id} className="w-full">
                <Link href={banner.href}>
                  <img
                    src={
                      banner.imageUrlMobile ||
                      banner.imageUrl ||
                      DEFAULT_BANNER_IMAGE
                    }
                    alt={banner.title || "Hero banner"}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </Link>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
      {quickLinksRow}
    </section>
  );
};

export default HeroSection;
