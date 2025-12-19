"use client";
import {
  brandColors,
  FeaturedShopsGridProps,
  getShopsForCategory,
} from "@/app/category/_types/category";
import { cn } from "@/utils/cn";
import { ChevronRight, Store } from "lucide-react";
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
        "mb-4 overflow-hidden rounded-2xl bg-linear-to-br from-white to-orange-50/30 p-6 shadow-lg transition-opacity duration-500",
        className
      )}
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-orange-500 to-red-600 shadow-lg">
            <Store className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              <span className="bg-linear-to-rm-orange-600 to-red-600 bg-clip-text text-transparent">
                SHOPEE
              </span>{" "}
              <span className="text-slate-700">MALL</span>
            </h3>
            <p className="text-xs text-gray-500">
              Siêu thương hiệu · Uy tín · 100% Chính hãng
            </p>
          </div>
        </div>

        <Link
          href={`/shops?category=${categorySlug}`}
          className="group flex items-center gap-1 text-sm font-semibold text-orange-600 transition-all duration-300 hover:gap-2 hover:text-orange-700"
        >
          <span>Xem tất cả</span>
          <ChevronRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" />{" "}
        </Link>
      </div>

      <div className="hidden grid-cols-4 gap-4 md:grid lg:grid-cols-8">
        {shops.map((shop, index) => (
          <div key={shop.id}>
            <Link href={`/shop/${shop.slug}`}>
              <ShopCard
                shop={shop}
                color={brandColors[index % brandColors.length]}
              />
            </Link>
          </div>
        ))}
      </div>

      <div
        className="flex gap-3 overflow-x-none pb-2 md:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {shops.map((shop, index) => (
          <div key={shop.id} className="min-w-22.5">
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
    </div>
  );
}
