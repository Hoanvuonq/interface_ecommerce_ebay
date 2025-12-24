"use client";

import React, { useState } from "react";
import { ImageWithPreview } from "../imageWithPreview";
import { cn } from "@/utils/cn";

const PLACEHOLDER_IMAGE = "/placeholder-product.png";

export const ProductGallery = ({ product, galleryImages }: any) => {
  const [activeImg, setActiveImg] = useState(galleryImages[0]?.url || PLACEHOLDER_IMAGE);

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-md group relative">
        <ImageWithPreview
          src={activeImg}
          alt={product.name}
          width={500}
          height={500}
          className="w-full rounded-xl object-cover"
        />
        
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <span className="bg-black/40 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs flex items-center gap-2 font-medium">
             🔍 Click để xem ảnh lớn
          </span>
        </div>
      </div>

      {galleryImages.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {galleryImages.slice(0, 5).map((img: any) => {
            const isSelected = activeImg === img.url;
            return (
              <div
                key={img.key}
                className={cn(
                  "h-20 w-full rounded-lg overflow-hidden border-2 transition-all cursor-pointer",
                  isSelected ? "border-orange-500 scale-95" : "border-gray-200 hover:border-orange-300"
                )}
                onClick={() => setActiveImg(img.url)}
              >
                <img
                  src={img.thumb || img.url}
                  alt={img.alt}
                  className={cn(
                    "h-full w-full object-cover transition-opacity",
                    isSelected ? "opacity-100" : "opacity-60 hover:opacity-100"
                  )}
                />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};