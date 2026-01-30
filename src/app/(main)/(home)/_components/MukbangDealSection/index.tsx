"use client";

import { ProductCard } from "@/app/(main)/products/_components";
import { ButtonField, SectionLoading } from "@/components";
import { Sparkles, Utensils, Zap, ShoppingBag } from "lucide-react";
import Link from "next/link";
import React from "react";
import { cn } from "@/utils/cn";
import { useHomepageContext } from "../../_context/HomepageContext";
import { SectionSreen } from "@/features/SectionSreen";

export const MukbangDealSection: React.FC = () => {
  const { flashSale: deals, isLoading, wishlistMap } = useHomepageContext();

  if (isLoading && deals.length === 0)
    return <SectionLoading message="Đang soạn món..." />;
  if (deals.length === 0) return null;

  return (
    <SectionSreen id="mukbang-deals">
      <div className="relative w-full max-w-6xl mx-auto mb-12 rounded-[3rem] overflow-hidden bg-linear-to-br from-orange-500 via-red-600 to-rose-700 shadow-2xl shadow-red-500/20">
        <Utensils className="absolute top-10 left-10 text-white/10 -rotate-12 size-20 md:size-32" />
        <Zap className="absolute bottom-10 right-20 text-yellow-400/20 rotate-12 size-24 md:size-40" />

        <div className="relative z-10 py-12 md:py-16 flex flex-col items-center text-center px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/30 mb-6 animate-bounce">
            <Sparkles className="size-3 text-yellow-300 fill-yellow-300" />
            <span className="text-[10px] font-bold text-white uppercase tracking-[0.3em]">
              Đại tiệc ưu đãi
            </span>
          </div>

          <h2 className="text-5xl md:text-8xl font-bold text-white italic uppercase tracking-tighter leading-none mb-4 drop-shadow-2xl">
            Mukbang{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-b from-yellow-300 to-orange-400">
              DEAL
            </span>{" "}
            Shop
          </h2>

          <p className="max-w-xl text-white/80 font-medium text-sm md:text-lg leading-relaxed italic">
            "Cuốn" từng ưu đãi, săn ngay những siêu phẩm với mức giá ngon khó
            cưỡng. Duy nhất tuần này!
          </p>
        </div>

        <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-linear-to-r from-transparent via-white/10 to-transparent opacity-40 animate-shine" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 relative z-10 max-w-7xl mx-auto px-2">
        {deals.map((product: any) => {
          const firstVariant = product.variants?.[0] || {};
          const isWishlisted = wishlistMap.get(firstVariant.id) || false;

          return (
            <div key={product.id} className="group relative">
              <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/10 rounded-4xl blur-2xl transition-all duration-500" />

              <div className="relative bg-white border border-slate-100 rounded-[2.25rem] overflow-hidden transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-orange-500/20">
                <ProductCard
                  product={product}
                  isWishlisted={isWishlisted}
                  isType="flashsale"
                />

                <div className="absolute top-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md text-white text-[8px] font-bold px-2 py-1 rounded-lg uppercase italic tracking-widest border border-white/10">
                  Sản phẩm HOT
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-16 flex justify-center relative z-10">
        <Link href="/products?filter=mukbang-deal">
          <button className="group relative px-12 py-5 bg-slate-950 rounded-2xl overflow-hidden transition-all active:scale-95 shadow-2xl shadow-slate-950/40">
            <div className="absolute inset-0 w-0 bg-orange-600 transition-all duration-500 ease-out group-hover:w-full" />
            <span className="relative z-10 flex items-center gap-3 text-white font-bold uppercase italic tracking-widest text-sm">
              Ghé thăm shop săn deal{" "}
              <span className="text-xl group-hover:translate-x-2 transition-transform">
                →
              </span>
            </span>
          </button>
        </Link>
      </div>
    </SectionSreen>
  );
};
