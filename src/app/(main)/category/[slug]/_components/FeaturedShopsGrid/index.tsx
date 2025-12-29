"use client";

import {
  brandColors,
  FeaturedShopsGridProps,
  getShopsForCategory,
} from "@/app/(main)/category/_types/category";
import { cn } from "@/utils/cn";
import { ChevronRight, Store, Sparkles } from "lucide-react";
import Link from "next/link";
import { ShopCard } from "../ShopCard";

export default function FeaturedShopsGrid({
  categorySlug,
  maxItems = 8,
  className = "",
}: FeaturedShopsGridProps) {
  const shops = getShopsForCategory(categorySlug, maxItems);

  if (!shops || shops.length === 0) return null;

  return (
    <div
      className={cn(
        "mb-8 overflow-hidden rounded-3xl bg-white border border-orange-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500",
        className
      )}
    >
      <div className="relative overflow-hidden px-6 pt-6 pb-4">
        <div className="absolute top-0 left-0 h-1 w-full bg-linear-to-r from-orange-400 via-orange-500 to-red-500" />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Icon Box nổi bật */}
            <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-orange-500 to-red-600 shadow-lg shadow-orange-200">
                    <Store className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1">
                    <Sparkles className="w-4 h-4 text-orange-400 animate-pulse" />
                </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black tracking-tight text-slate-800">
                  <span className="bg-linear-to-r from-orange-600 to-red-600 bg-clip-text text-transparent uppercase">
                    Calatha
                  </span>
                  <span className="ml-1.5 inline-block rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    Mall
                  </span>
                </h3>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="h-1 w-1 rounded-full bg-orange-400" />
                <p className="text-[13px] font-medium text-slate-500">
                   Thương hiệu độc quyền · Miễn phí trả hàng · 100% Chính hãng
                </p>
              </div>
            </div>
          </div>

          <Link
            href={`/shops?category=${categorySlug}`}
            className="group flex items-center gap-1.5 rounded-full bg-orange-50 px-4 py-2 text-sm font-bold text-orange-600 transition-all duration-300 hover:bg-orange-600 hover:text-white"
          >
            <span>Xem tất cả</span>
            <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      <div className="hidden grid-cols-4 gap-5 p-6 md:grid lg:grid-cols-8 bg-linear-to-b from-white to-orange-50/20">
        {shops.map((shop, index) => (
          <div 
            key={shop.id} 
            className="transition-transform duration-300 hover:-translate-y-2"
          >
            <Link href={`/shop/${shop.slug}`} className="block">
              <ShopCard
                shop={shop}
                color={brandColors[index % brandColors.length]}
              />
            </Link>
          </div>
        ))}
      </div>

      <div
        className="flex gap-4 overflow-x-auto px-6 pb-6 md:hidden custom-scrollbar-none"
        style={{ scrollbarWidth: "none" }}
      >
        {shops.map((shop, index) => (
          <div key={shop.id} className="min-w-[100px] shrink-0">
            <Link href={`/shop/${shop.slug}`}>
              <ShopCard
                shop={shop}
                color={brandColors[index % brandColors.length]}
                isMobile
              />
            </Link>
          </div>
        ))}
      </div>

      <div className="h-1.5 w-full bg-linear-to-r from-transparent via-orange-100/50 to-transparent" />
      
      <style jsx global>{`
        .custom-scrollbar-none::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}