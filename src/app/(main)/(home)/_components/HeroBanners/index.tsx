"use client";
import React from "react";
import Link from "next/link";
import { CustomCarousel } from "@/components";
import { motion } from "framer-motion";
import Image from "next/image";
import { toPublicUrl } from "@/utils/storage/url";
import { toSizedVariant } from "@/utils/products/media.helpers";

const DEFAULT_BANNER_IMAGE = "/images/banner-khuyen-mai-42.jpg";

interface HeroBannersProps {
  banners: any[];
}

export const HeroBanners: React.FC<HeroBannersProps> = ({ banners }) => {
 const getUrl = (banner: any) => {
  const path = banner?.imagePathDesktop || banner?.imagePath;
  if (!path) return DEFAULT_BANNER_IMAGE;
  
  const finalPath = toSizedVariant(path, "_orig");
  const fullUrl = toPublicUrl(finalPath);
  
  return fullUrl;
};

  if (!banners || banners.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="w-full relative h-60 lg:h-80 rounded-3xl overflow-hidden shadow-sm border border-gray-100">
          <Image
            src={DEFAULT_BANNER_IMAGE}
            alt="Hero banner default"
            fill
            className="object-cover opacity-50"
          />
        </div>
      </div>
    );
  }

  const mainBanners = banners.slice(0, 3);
  const sideBanners = banners.slice(3, 5);

  const displaySideBanners = [
    sideBanners[0] || banners[0],
    sideBanners[1] || banners[1] || banners[0],
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-3">
      <div className="flex flex-col lg:flex-row gap-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:w-[68%] relative rounded-3xl overflow-hidden shadow-lg border border-white/40 group"
        >
          <CustomCarousel banners={mainBanners} className="h-60 lg:h-80" />

          <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
        </motion.div>

        <div className="lg:w-[32%] flex flex-col gap-3">
          {displaySideBanners.map((banner, idx) => (
            <Link
              key={banner.id || idx}
              href={banner.href || "#"}
              className="relative flex-1 min-h-30 group rounded-3xl overflow-hidden border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-blue-200/50"
            >
              <Image
                src={getUrl(banner)}
                alt={banner.title || "Side banner"}
                fill
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 33vw"
                priority={idx === 0}
              />

              <div className="absolute top-3 right-3 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/30 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                  Discover
                </span>
              </div>

              {banner.title && (
                <div className="absolute bottom-4 left-4 z-10">
                  <h4 className="text-white font-bold text-sm drop-shadow-md uppercase">
                    {banner.title}
                  </h4>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
