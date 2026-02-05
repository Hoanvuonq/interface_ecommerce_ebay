"use client";

import { cn } from "@/utils/cn";
import { Box, Maximize2, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState, useMemo } from "react";
// import { ImageWithPreview } from "../ImagePreviewModal2";
import { GalleryItem, ProductGalleryProps } from "./type";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import { ImageWithPreview } from "../ImageWithPreview";

const PLACEHOLDER_IMAGE = "https://picsum.photos/600/600";

export const ProductGallery = ({
  product,
  galleryImages: manualImages,
  media,
  activeImg: primaryImageFromParent,
  onThumbnailClick,
  onZoomClick,
}: ProductGalleryProps) => {
  const finalImages = useMemo(() => {
    if (manualImages && manualImages.length > 0) return manualImages;
    if (media && media.length > 0) {
      return media.map((m: any, idx: number) => ({
        key: m.id || `media-${idx}`,
        preview: m.url || m.previewUrl || PLACEHOLDER_IMAGE,
        thumb: m.url || m.previewUrl || PLACEHOLDER_IMAGE,
      }));
    }
    return [];
  }, [manualImages, media]);

  const [currentImg, setCurrentImg] = useState(
    primaryImageFromParent || finalImages[0]?.preview || PLACEHOLDER_IMAGE,
  );

  useEffect(() => {
    if (primaryImageFromParent) {
      setCurrentImg(primaryImageFromParent);
    } else if (finalImages.length > 0 && !currentImg) {
      setCurrentImg(finalImages[0].preview);
    }
  }, [primaryImageFromParent, finalImages]);

  const handleSelect = useCallback(
    (img: GalleryItem) => {
      setCurrentImg(img.preview);
      if (onThumbnailClick) {
        onThumbnailClick(img.preview, img.key);
      }
    },
    [onThumbnailClick],
  );

  return (
    <section className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-700">
      <div className="rounded-4xl border border-gray-100 bg-white p-1.5 shadow-custom transition-all duration-500 hover:border-orange-200 group relative">
        <div className="relative aspect-square w-full overflow-hidden rounded-[1.8rem] bg-gray-50">
          <ImageWithPreview
            src={currentImg}
            alt={product?.name || "Product Image"}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
            className="object-cover cursor-zoom-in transition-transform duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
            <div className="bg-white/80 backdrop-blur-md text-gray-700 px-4 py-2 rounded-xl text-[10px] flex items-center gap-2 font-bold uppercase tracking-widest border border-white shadow-xl trangray-y-2 group-hover:trangray-y-0 transition-transform">
              <Maximize2
                size={12}
                strokeWidth={3}
                className="text-orange-500"
              />
              Phóng to tài sản
            </div>
          </div>
        </div>
      </div>

      {finalImages.length > 1 ? (
        <div className="relative px-8 group/carousel">
          <Swiper
            modules={[Navigation, FreeMode]}
            spaceBetween={10}
            slidesPerView={5}
            freeMode={true}
            watchSlidesProgress={true}
            navigation={{
              nextEl: ".thumb-next",
              prevEl: ".thumb-prev",
            }}
            breakpoints={{
              320: { slidesPerView: 4 },
              640: { slidesPerView: 5 },
            }}
            className="thumbnail-swiper"
          >
            {finalImages.map((img: GalleryItem, idx: number) => {
              const isSelected = currentImg === img.preview;
              return (
                <SwiperSlide key={img.key}>
                  <div
                    className={cn(
                      "relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer bg-white",
                      isSelected
                        ? "border-orange-500 shadow-sm scale-95"
                        : "border-gray-100 hover:border-orange-200",
                    )}
                    onClick={() => handleSelect(img)}
                  >
                    <Image
                      src={img.thumb}
                      alt={`Thumbnail ${idx}`}
                      fill
                      sizes="100px"
                      className={cn(
                        "object-cover transition-opacity duration-300",
                        !isSelected && "opacity-90 hover:opacity-100",
                      )}
                    />
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          <button className="thumb-prev absolute left-0 top-1/2 -trangray-y-1/2 z-10 w-7 h-7 flex items-center justify-center bg-white border border-gray-100 rounded-full shadow-md text-gray-400 hover:text-orange-500 hover:border-orange-200 transition-all opacity-0 group-hover/carousel:opacity-100 disabled:hidden">
            <ChevronLeft size={16} strokeWidth={3} />
          </button>
          <button className="thumb-next absolute right-0 top-1/2 -trangray-y-1/2 z-10 w-7 h-7 flex items-center justify-center bg-white border border-gray-100 rounded-full shadow-md text-gray-400 hover:text-orange-500 hover:border-orange-200 transition-all opacity-0 group-hover/carousel:opacity-100 disabled:hidden">
            <ChevronRight size={16} strokeWidth={3} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl border border-gray-200 ">
          <Box size={16} className="text-gray-400" />
          <span className="text-[12px] font-bold text-gray-600 uppercase tracking-tight">
            Duy nhất 1 hình ảnh định danh
          </span>
        </div>
      )}

      <style jsx global>{`
        .thumbnail-swiper .swiper-slide {
          height: auto;
        }
      `}</style>
    </section>
  );
};
