"use client";
import React from "react";
import Link from "next/link";
import { CustomCarousel } from "@/components";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/utils/cn";

const DEFAULT_BANNER_IMAGE = "/images/hero/default-banner.jpg";

interface HeroBannersProps {
  banners: any[];
}

export const HeroBanners: React.FC<HeroBannersProps> = ({ banners }) => {
  if (banners.length === 0) {
    return (
      <div className="w-full rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        <img
          src={DEFAULT_BANNER_IMAGE}
          alt="Hero banner default"
          className="w-full h-48 object-cover opacity-50"
        />
      </div>
    );
  }

  const mainBanners = banners.slice(0, 3);
  const sideBanner1 = banners[3] || banners[0];
  const sideBanner2 = banners[4] || banners[1] || banners[0];

  return (
    <div className="w-full mx-auto px-4 py-3">
      <div className="flex flex-col lg:flex-row gap-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:w-[ %] relative rounded-3xl overflow-hidden shadow-lg border border-white/40 group"
        >
          <CustomCarousel banners={mainBanners} className="h-60 lg:h-80" />

          <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
        </motion.div>

        <div className="lg:w-[32%] flex flex-col gap-3">
          {[sideBanner1, sideBanner2].map((banner, idx) => (
            <Link
              key={idx}
              href={banner.href}
              className={cn(
                "relative flex-1 group rounded-3xl overflow-hidden border",
                "border-gray-100 shadow-sm transition-all duration-500 hover:shadow-blue-200/50"
              )}
            >
              <Image
                src={
                  banner.imageUrlDesktop ||
                  banner.imageUrl ||
                  DEFAULT_BANNER_IMAGE
                }
                alt={banner.title || "Side banner"}
                fill
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />

              <div
                className={cn(
                  "absolute top-3 right-3 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full",
                  "border border-white/30 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0",
                )}
              >
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                  Discover
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
