"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { CustomCarouselProps } from "./type";
import Image from "next/image";
import { toPublicUrl } from "@/utils/storage/url";
import { toSizedVariant } from "@/utils/products/media.helpers";

const DEFAULT_BANNER = "/images/default-banner.jpg";

export const CustomCarousel: React.FC<CustomCarouselProps> = ({
  banners,
  autoplaySpeed = 4500,
  className = "h-full",
  isMobile = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasMultipleSlides = banners.length > 1;

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  }, [banners.length]);

  const prev = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (!hasMultipleSlides) return;
    const timer = setInterval(next, autoplaySpeed);
    return () => clearInterval(timer);
  }, [next, autoplaySpeed, hasMultipleSlides]);

  if (banners.length === 0) return null;

  return (
    <div className={cn("relative w-full overflow-hidden group", className)}>
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner, index) => {
          const path = isMobile
            ? banner.imagePathMobile || banner.imagePath
            : banner.imagePathDesktop || banner.imagePath;

          const finalSrc = path
            ? toPublicUrl(toSizedVariant(path, "_orig"))
            : DEFAULT_BANNER;

          return (
            <div
              key={banner.id || index}
              className="w-full shrink-0 h-full relative"
            >
              <Link
                href={banner.href || "#"}
                className="block relative h-full w-full"
              >
                <Image
                  src={finalSrc}
                  alt={banner.title || "Banner"}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover"
                  unoptimized={true}
                />
              </Link>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      {hasMultipleSlides && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 cursor-pointer"
          >
            <ChevronLeft className="text-gray-700 w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 cursor-pointer"
          >
            <ChevronRight className="text-gray-700 w-5 h-5" />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {hasMultipleSlides && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "h-2 transition-all duration-300 rounded-full border-2 cursor-pointer",
                index === currentIndex
                  ? "w-8 bg-orange-500 border-orange-200"
                  : "w-2 bg-white/50 border-white/80",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};
