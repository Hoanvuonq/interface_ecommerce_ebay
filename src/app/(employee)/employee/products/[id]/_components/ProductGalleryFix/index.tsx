"use client";

import { cn } from "@/utils/cn";
import {
  Box,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Play,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { ProductGalleryProps } from "@/components/ProductGallery/type";
import { resolveMediaUrl } from "@/utils/products/media.helpers";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import { ImageWithPreview } from "@/components";

export const ProductGalleryFix = ({
  product,
  media = [],
  activeImg: primaryImageFromParent,
  onThumbnailClick,
  onZoomClick,
}: ProductGalleryProps) => {
  const swiperRef = useRef<SwiperType | null>(null);

  // 1. Chuyển đổi media từ API - Giữ nguyên logic xử lý URL xịn
  const galleryItems = useMemo(() => {
    if (!media || media.length === 0) return [];

    return media.map((m: any, idx: number) => {
      const fullUrl = resolveMediaUrl(m, "_large");
      const thumbUrl = resolveMediaUrl(m, "_thumb");

      return {
        key: m.id || `media-${idx}`,
        preview: fullUrl,
        thumb: thumbUrl,
        type: m.type,
      };
    });
  }, [media]);

  // 2. Quản lý trạng thái ảnh
  const [currentImg, setCurrentImg] = useState("");

  // 3. Cập nhật ảnh hiện tại và đồng bộ Swiper
  useEffect(() => {
    const targetImg = primaryImageFromParent || galleryItems[0]?.preview || "";
    setCurrentImg(targetImg);

    // Tự động scroll Swiper đến ảnh đang active
    if (swiperRef.current) {
      const index = galleryItems.findIndex(
        (item) => item.preview === targetImg,
      );
      if (index !== -1) swiperRef.current.slideTo(index);
    }
  }, [primaryImageFromParent, galleryItems]);

  const handleSelect = useCallback(
    (imgPreview: string, imgKey: string) => {
      if (currentImg === imgPreview) return;
      setCurrentImg(imgPreview);
      onThumbnailClick?.(imgPreview, imgKey);
    },
    [onThumbnailClick, currentImg],
  );

  if (galleryItems.length === 0) {
    return (
      <div className="aspect-square bg-slate-50 rounded-4xl border border-dashed border-slate-200 flex flex-col items-center justify-center gap-3">
        <div className="p-4 bg-white rounded-full shadow-sm">
          <ImageIcon className="text-slate-300" size={32} />
        </div>
        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">
          Chưa có dữ liệu hình ảnh
        </span>
      </div>
    );
  }

  return (
    <section className="space-y-5 animate-in fade-in slide-in-from-left-4 duration-700">
      {/* Ảnh Chính lớn - Sử dụng Component Preview bạn vừa fix ở trên */}
      <div className="rounded-[2.5rem] border border-slate-100 bg-white p-2 shadow-custom-lg transition-all duration-500 hover:border-orange-200 group relative">
        <div className="relative aspect-square w-full overflow-hidden rounded-[2rem] bg-slate-50 flex items-center justify-center">
          <ImageWithPreview
            src={currentImg || "/placeholder-product.png"}
            alt={product?.name || "Product Image"}
            className="w-full h-full rounded-[2rem]"
          />
          {/* Overlay hướng dẫn khi hover */}
          <div className="absolute inset-0 flex items-end justify-center pb-8 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none z-20">
            <div className="bg-white/90 backdrop-blur-md text-slate-900 px-5 py-2.5 rounded-2xl text-[10px] flex items-center gap-2 font-bold uppercase tracking-widest border border-white shadow-2xl translate-y-4 group-hover:translate-y-0 transition-transform">
              <Maximize2
                size={12}
                strokeWidth={3}
                className="text-orange-500"
              />
              Click để tương tác ảnh
            </div>
          </div>
        </div>
      </div>

      {galleryItems.length > 1 ? (
        <div className="relative px-10 group/carousel">
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            modules={[Navigation, FreeMode]}
            watchSlidesProgress={true}
            spaceBetween={14}
            slidesPerView={5}
            freeMode={true}
            navigation={{
              nextEl: ".thumb-next",
              prevEl: ".thumb-prev",
            }}
            breakpoints={{
              320: { slidesPerView: 4, spaceBetween: 10 },
              640: { slidesPerView: 5, spaceBetween: 14 },
            }}
            className="thumbnail-swiper !py-2"
          >
            {galleryItems.map((img, idx) => {
              const isSelected = currentImg === img.preview;
              const isVideo = img.type === "VIDEO";

              return (
                <SwiperSlide key={img.key}>
                  <div
                    className={cn(
                      "relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer bg-white shadow-sm hover:shadow-md",
                      isSelected
                        ? "border-orange-500 scale-95 ring-4 ring-orange-50"
                        : "border-transparent hover:border-slate-200",
                    )}
                    onClick={() => handleSelect(img.preview, img.key)}
                  >
                    <Image
                      src={img.thumb}
                      alt={`Thumbnail ${idx}`}
                      fill
                      sizes="120px"
                      className={cn(
                        "object-cover transition-all duration-500",
                        isSelected
                          ? "scale-110"
                          : "opacity-90 hover:opacity-100",
                      )}
                    />

                    <div className="absolute top-1.5 right-1.5 bg-black/50 backdrop-blur-md rounded-lg p-1.5 text-white z-10 border border-white/10 shadow-lg">
                      {isVideo ? (
                        <Play size={10} fill="white" className="ml-0.5" />
                      ) : (
                        <ImageIcon size={10} />
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          <button className="thumb-prev absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-white border border-slate-100 rounded-full shadow-xl text-slate-400 hover:text-orange-500 hover:scale-110 hover:border-orange-100 transition-all opacity-0 group-hover/carousel:opacity-100 disabled:opacity-0">
            <ChevronLeft size={20} strokeWidth={3} />
          </button>
          <button className="thumb-next absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-white border border-slate-100 rounded-full shadow-xl text-slate-400 hover:text-orange-500 hover:scale-110 hover:border-orange-100 transition-all opacity-0 group-hover/carousel:opacity-100 disabled:opacity-0">
            <ChevronRight size={20} strokeWidth={3} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3 px-6 py-4 bg-slate-50/50 rounded-2xl border border-slate-100/50 backdrop-blur-sm">
          <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">
            Single Asset Mode
          </span>
        </div>
      )}

      <style jsx global>{`
        .thumbnail-swiper .swiper-slide {
          height: auto;
        }
        .thumb-prev.swiper-button-disabled,
        .thumb-next.swiper-button-disabled {
          display: none !important;
        }
      `}</style>
    </section>
  );
};
