"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";

interface ProductPreviewSidebarProps {
  previewImage?: string;
  fileList?: any[];
  videoList?: any[];
  name?: string;
  basePrice?: number;
  description?: string;
  totalStock: number;
}

export const ProductPreviewSidebar: React.FC<ProductPreviewSidebarProps> = ({
  fileList = [],
  videoList = [],
  name,
  basePrice,
  description,
  totalStock,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 cho trái, 1 cho phải

  const mediaItems = [
    ...videoList.map((v) => ({ ...v, type: "video" })),
    ...fileList.map((f) => ({ ...f, type: "image" })),
  ];

  const formattedPrice = basePrice
    ? new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(basePrice)
    : "0 ₫";

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
  };

  // Variants cho hiệu ứng trượt
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
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
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
        <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
          <ImageIcon size={18} className="text-orange-500" />
          Xem trước sản phẩm
        </h3>
      </div>

      <div className="p-5 flex flex-col gap-5">
        <div className="aspect-square w-full rounded-xl overflow-hidden relative group shadow-custom">
          <AnimatePresence initial={false} custom={direction}>
            {mediaItems.length > 0 ? (
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="absolute inset-0 w-full h-full flex items-center justify-center"
              >
                {mediaItems[currentIndex].type === "video" ? (
                  <div className="relative w-full h-full">
                    <video
                      src={mediaItems[currentIndex].url}
                      className="w-full h-full object-contain"
                      muted
                      playsInline
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <PlayCircle
                        size={48}
                        className="text-white/80 drop-shadow-lg"
                      />
                    </div>
                  </div>
                ) : (
                  <Image
                    src={mediaItems[currentIndex].url}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                )}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-300 h-full bg-gray-50">
                <ImageIcon size={48} className="mb-2 opacity-50" />
                <span className="text-xs font-medium">Chưa có ảnh/video</span>
              </div>
            )}
          </AnimatePresence>

          {/* Navigation Controls */}
          {mediaItems.length > 1 && (
            <>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={prevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft size={20} className="text-gray-800" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={nextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight size={20} className="text-gray-800" />
              </motion.button>
            </>
          )}

          {/* Pagination Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {mediaItems.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className="focus:outline-none"
              >
                <motion.div
                  animate={{
                    width: currentIndex === idx ? 20 : 8,
                    backgroundColor:
                      currentIndex === idx
                        ? "#f97316"
                        : "rgba(255,255,255,0.6)",
                  }}
                  className="h-2 rounded-full"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <motion.div layout>
            <span className="text-xs font-bold text-gray-400 uppercase block mb-1">
              Tên sản phẩm
            </span>
            <p className="text-sm font-semibold text-gray-900 line-clamp-2 min-h-10 leading-snug">
              {name || "Đang nhập tên sản phẩm..."}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            <motion.div layout>
              <span className="text-xs font-bold text-gray-400 uppercase block mb-1">
                Giá bán
              </span>
              <p className="text-xl font-bold text-orange-600 tabular-nums">
                {formattedPrice}
              </p>
            </motion.div>
            <motion.div layout>
              <span className="text-xs font-bold text-gray-400 uppercaseblock mb-1">
                Tồn kho
              </span>
              <p className="text-base font-bold text-gray-700 tabular-nums">
                {totalStock}{" "}
                <span className="text-xs font-normal text-gray-400 uppercase">
                  sp
                </span>
              </p>
            </motion.div>
          </div>

          <hr className="border-gray-100" />

          <motion.div layout>
            <span className="text-xs font-bold text-gray-400 uppercase block mb-2">
              Mô tả chi tiết
            </span>
            <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100 min-h-25 max-h-45 overflow-y-auto text-xs text-gray-600 leading-relaxed custom-scrollbar">
              {description ? (
                <div dangerouslySetInnerHTML={{ __html: description }} />
              ) : (
                <span className="italic text-gray-400">
                  Nội dung mô tả sẽ được cập nhật tại đây...
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
