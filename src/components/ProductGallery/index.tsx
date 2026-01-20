"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ImageWithPreview } from "../imageWithPreview";
import { cn } from "@/utils/cn";
import { Maximize2, Box } from "lucide-react";

const PLACEHOLDER_IMAGE = "https://picsum.photos/600/600";

export const ProductGallery = ({ product, galleryImages = [] }: any) => {
  // Đồng bộ ảnh active khi galleryImages thay đổi
  const [activeImg, setActiveImg] = useState(galleryImages[0]?.url || PLACEHOLDER_IMAGE);

  useEffect(() => {
    if (galleryImages.length > 0) {
      setActiveImg(galleryImages[0].url);
    }
  }, [galleryImages]);

  return (
    <section className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-700">
      {/* Ảnh Chính lớn */}
      <div className="rounded-[2.5rem] border border-orange-50 bg-white p-2 shadow-custom-lg group relative overflow-hidden transition-all duration-500 hover:border-orange-200">
        <div className="relative aspect-square w-full overflow-hidden rounded-[2.2rem]">
          <ImageWithPreview
            src={activeImg}
            alt={product?.name || "Product Image"}
            width={600}
            height={600}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Overlay Web3 Style */}
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 pointer-events-none">
            <span className="bg-white/90 backdrop-blur-xl text-orange-600 px-5 py-2 rounded-2xl text-[10px] flex items-center gap-2 font-bold uppercase tracking-widest shadow-2xl border border-orange-100">
                <Maximize2 size={14} strokeWidth={3} />
                Phóng to tài sản
            </span>
          </div>
        </div>
      </div>

      {galleryImages.length > 1 ? (
        <div className="flex flex-wrap gap-3 px-2">
          {galleryImages.map((img: any, idx: number) => {
            const isSelected = activeImg === img.url;
            return (
              <div
                key={img.key || idx}
                className={cn(
                  "relative h-20 w-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer shadow-sm",
                  isSelected 
                    ? "border-orange-500 ring-4 ring-orange-500/10 scale-95 shadow-orange-500/20" 
                    : "border-slate-100 hover:border-orange-300 grayscale group"
                )}
                onClick={() => setActiveImg(img.url)}
              >
                <Image
                  src={img.thumb || img.url}
                  alt={img.alt || `Thumbnail ${idx}`}
                  fill
                  sizes="80px"
                  className={cn(
                    "object-cover transition-all duration-500",
                    isSelected ? "scale-110 grayscale-0" : "group-hover:grayscale-0"
                  )}
                />
              </div>
            );
          })}
        </div>
      ) : (
          <div className="flex items-center gap-2 px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 opacity-60 italic">
              <Box size={14} className="text-slate-400" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Duy nhất 1 hình ảnh định danh</span>
          </div>
      )}
    </section>
  );
};