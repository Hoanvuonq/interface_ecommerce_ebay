"use client";

import { cn } from "@/utils/cn";
import { Box, Maximize2 } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState, useMemo } from "react";
import { ImageWithPreview } from "../imageWithPreview";
import { GalleryItem, ProductGalleryProps } from "./type";

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
    primaryImageFromParent || finalImages[0]?.preview || PLACEHOLDER_IMAGE
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
    [onThumbnailClick]
  );

  return (
    <section className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-700">
      <div className="rounded-4xl border border-slate-100 bg-white p-1.5 shadow-custom transition-all duration-500 hover:border-orange-200 group relative">
        <div className="relative aspect-square w-full overflow-hidden rounded-[1.8rem] bg-slate-50">
          <ImageWithPreview
            src={currentImg}
            alt={product?.name || "Product Image"}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-cover cursor-zoom-in transition-transform duration-700 group-hover:scale-105"
            onClick={() => onZoomClick && onZoomClick(currentImg)}
          />

          <div className="absolute inset-0 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
            <div className="bg-white/80 backdrop-blur-md text-slate-700 px-4 py-2 rounded-xl text-[10px] flex items-center gap-2 font-black uppercase tracking-widest border border-white shadow-xl translate-y-2 group-hover:translate-y-0 transition-transform">
              <Maximize2 size={12} strokeWidth={3} className="text-orange-500" />
              Click để xem ảnh lớn
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách Thumbnails */}
      {finalImages.length > 1 ? (
        <div className="grid grid-cols-5 gap-2.5">
          {finalImages.map((img: GalleryItem, idx: number) => {
            const isSelected = currentImg === img.preview;
            return (
              <div
                key={img.key}
                className={cn(
                  "relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer bg-white",
                  isSelected
                    ? "border-orange-500 shadow-sm scale-95"
                    : "border-slate-100 hover:border-orange-200"
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
                    !isSelected && "opacity-90 hover:opacity-100"
                  )}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 opacity-60">
          <Box size={14} className="text-slate-400" />
          <span className="text-[10px] font-bold text-slate-500 uppercase">
            Duy nhất 1 ảnh định danh
          </span>
        </div>
      )}
    </section>
  );
};