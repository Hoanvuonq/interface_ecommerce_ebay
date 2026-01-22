"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  Box,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";

interface ProductPreviewSidebarProps {
  fileList?: any[];
  videoList?: any[];
  variants?: any[]; // Thêm variants
  optionNames?: string[];
  name?: string;
  basePrice?: number;
  description?: string;
  totalStock: number;
}

export const ProductPreviewSidebar: React.FC<ProductPreviewSidebarProps> = ({
  fileList = [],
  videoList = [],
  variants = [],
  name,
  basePrice,
  description,
  totalStock,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const mediaItems = useMemo(() => {
    const items = [
      ...videoList.map((v) => ({
        url: v.url,
        type: "video",
        label: "Video SP",
      })),
      ...fileList.map((f) => ({ url: f.url, type: "image", label: "Ảnh SP" })),
    ];

    variants.forEach((v, idx) => {
      if (v.imageUrl) {
        items.push({
          url: v.imageUrl,
          type: "image",
          label: `Biến thể: ${v.optionValueNames?.join(" - ") || idx}`,
        });
      }
    });

    return items;
  }, [fileList, videoList, variants]);

  const formattedPrice = useMemo(() => {
    if (!basePrice && variants.length === 0) return "0 ₫";

    // Nếu có biến thể, lấy khoảng giá
    const prices = variants.map((v) => v.price).filter((p) => p > 0);
    if (prices.length > 0) {
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      const format = (val: number) =>
        new Intl.NumberFormat("vi-VN").format(val) + " ₫";
      return min === max ? format(min) : `${format(min)} - ${format(max)}`;
    }

    return new Intl.NumberFormat("vi-VN").format(basePrice || 0) + " ₫";
  }, [basePrice, variants]);

  // Logic chuyển slide giữ nguyên...
  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
  };
  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
  };

  const variants_motion = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: { zIndex: 1, x: 0, opacity: 1, scale: 1 },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-25 w-full bg-white rounded-4xl border border-gray-200 shadow-custom overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 uppercase italic tracking-tighter">
          <ImageIcon size={18} className="text-orange-500" /> Xem trước sản phẩm
        </h3>
        {mediaItems.length > 0 && (
          <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-100">
            {currentIndex + 1} / {mediaItems.length}
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col gap-5">
        <div className="aspect-square w-full rounded-4xl overflow-hidden relative group shadow-inner bg-gray-50 border border-gray-200">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            {mediaItems.length > 0 ? (
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants_motion}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="absolute inset-0 w-full h-full"
              >
                {mediaItems[currentIndex].type === "video" ? (
                  <video
                    src={mediaItems[currentIndex].url}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                  />
                ) : (
                  <Image
                    src={mediaItems[currentIndex].url}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                )}
                <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md text-[9px] text-white px-2 py-1 rounded-full font-bold uppercase ">
                  {mediaItems[currentIndex].label}
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-500 h-full">
                <ImageIcon size={48} className="mb-2 opacity-20" />
                <span className="text-[10px] font-bold uppercase ">
                  Chưa có ảnh
                </span>
              </div>
            )}
          </AnimatePresence>

          {mediaItems.length > 1 && (
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-3 z-10 pointer-events-none">
              <button
                type="button"
                onClick={prevSlide}
                className="p-2 rounded-full bg-white/90 shadow-lg pointer-events-auto hover:bg-orange-500 hover:text-white transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="p-2 rounded-full bg-white/90 shadow-lg pointer-events-auto hover:bg-orange-500 hover:text-white transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div>
            <span className="text-[12px] font-bold text-gray-500 uppercase block mb-1 ">
              Sản phẩm
            </span>
            <p className="text-xl font-bold text-gray-800 line-clamp-2 leading-tight italic uppercase ">
              {name || "Đang thiết lập..."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 bg-orange-50/30 p-4 rounded-3xl border border-orange-100/50">
            <div>
              <span className="text-[12px] font-bold text-gray-600 uppercase block mb-1 ">
                Giá niêm yết
              </span>
              <p className="text-lg font-bold text-orange-600 tabular-nums italic ">
                {formattedPrice}
              </p>
            </div>
            <div>
              <span className="text-[12px] font-bold text-gray-600 uppercase block mb-1 ">
                Tổng kho
              </span>
              <p className="text-lg font-bold text-gray-800 tabular-nums italic ">
                {totalStock}{" "}
                <span className="text-[11px] font-bold italic text-gray-500">
                  UNIT
                </span>
              </p>
            </div>
          </div>

          {variants.length > 0 && (
            <div>
              <span className="text-[12px] font-bold text-gray-600 uppercase block mb-2 ">
                Biến thể ({variants.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {variants.slice(0, 6).map((v, i) => (
                  <div
                    key={i}
                    className="px-2 py-1 bg-white border border-gray-100 rounded-lg text-[10px] font-bold text-gray-600 shadow-sm uppercase"
                  >
                    {v.optionValueNames?.join(" / ")}
                  </div>
                ))}
                {variants.length > 6 && (
                  <span className="text-[12px] font-bold text-(--color-mainColor)">
                    +{variants.length - 6}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="pt-2">
            <span className="text-[12px] font-bold text-gray-500 uppercase block mb-2 ">
              Mô tả
            </span>
            <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100 min-h-20 max-h-32 overflow-y-auto text-[11px] text-gray-500 leading-relaxed font-medium italic custom-scrollbar">
              {description ? (
                <div dangerouslySetInnerHTML={{ __html: description }} />
              ) : (
                "Nội dung đang được cập nhật..."
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
