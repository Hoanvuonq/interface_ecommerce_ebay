"use client";
import { cn } from "@/utils/cn";
import Image from "next/image";
import { motion } from "framer-motion";
import { useMemo } from "react";
import {
  resolveMediaUrl as resolveMediaUrlHelper,
  resolveVariantImageUrl as resolveVariantImageUrlHelper,
} from "@/utils/products/media.helpers";
import { Heart, Sparkles } from "lucide-react";

export const BrandCard = ({
  product,
  isWishlisted,
}: {
  product: any;
  isWishlisted: boolean;
}) => {
  const imageUrl = useMemo(() => {
    const media = product?.media || [];
    if (Array.isArray(media) && media.length > 0) {
      const image =
        media.find((m: any) => m.isPrimary && m.type === "IMAGE") || media[0];
      return resolveMediaUrlHelper(image, "_medium");
    }
    return "/placeholder.png";
  }, [product]);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 transition-all cursor-pointer group h-full relative overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-none"
    >
      <div className="absolute top-3 left-3 z-10">
        <div className="bg-slate-900 text-white text-[8px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-widest border border-white/20 shadow-lg">
          <Sparkles size={8} className="text-orange-400" /> Mall
        </div>
      </div>

      <button className="absolute top-3 right-3 z-10 size-8 flex items-center justify-center rounded-full bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 active:scale-90">
        <Heart
          size={14}
          className={cn(
            isWishlisted ? "fill-red-500 text-red-500" : "text-slate-400",
          )}
        />
      </button>

      <div className="relative w-full aspect-square p-4 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-center">
        <Image
          src={imageUrl}
          alt={product.name || "Product"}
          fill
          sizes="200px"
          className="object-contain p-4 transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      <div className="p-4 flex flex-col items-center gap-2">
        <h4 className="text-slate-800 dark:text-slate-100 text-[11px] font-bold uppercase tracking-tight line-clamp-1 group-hover:text-orange-500 transition-colors">
          {product.name}
        </h4>
        <div className="flex items-center gap-2">
          <span className="text-slate-900 dark:text-white font-black text-sm tabular-nums tracking-tighter">
            {product.basePrice?.toLocaleString("vi-VN")}
            <span className="text-[10px] ml-0.5">đ</span>
          </span>
          {product.comparePrice > product.basePrice && (
            <span className="text-[9px] text-slate-400 line-through opacity-70">
              -
              {Math.round(
                ((product.comparePrice - product.basePrice) /
                  product.comparePrice) *
                  100,
              )}
              %
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
