"use client";

import { ProductCard } from "@/app/(main)/products/_components";
import { ButtonField, SectionLoading } from "@/components";
import ScrollReveal from "@/features/ScrollReveal";
import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import _ from "lodash";
import { ArrowRight, Flame, LayoutGrid, Loader2, ShoppingCart, Sparkles, Star } from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { useInfiniteProducts } from "../../_hooks/useHomePageData";
import useWishlistStatus from "../../_hooks/useWishlistStatus";

interface ProductShowcaseProps {
  title?: string;
  subtitle?: string;
}

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({ 
  title = "GỢI Ý HÔM NAY", 
  subtitle = "Dành riêng cho bạn" 
}) => {
  const [activeTab, setActiveTab] = useState<"all" | "sale" | "new">("all");

  const saleQuery = useInfiniteProducts("sale");
  const newQuery = useInfiniteProducts("new");

  const saleList = useMemo(() => saleQuery.data?.pages.flatMap((p) => p.data.content) || [], [saleQuery.data]);
  const newList = useMemo(() => newQuery.data?.pages.flatMap((p) => p.data.content) || [], [newQuery.data]);

  const displayProducts = useMemo(() => {
    if (activeTab === "sale") return saleList;
    if (activeTab === "new") return newList;

    return _.take(_.compact(_.flatten(_.zip(saleList, newList))), 12);
  }, [activeTab, saleList, newList]);

  const { wishlistMap } = useWishlistStatus(displayProducts);

  const tabConfigs = [
    { id: "all", label: "Gợi ý", icon: Star },
    { id: "sale", label: "Giảm giá", icon: Flame },
    { id: "new", label: "Mới nhất", icon: Sparkles },
  ] as const;

  const currentQuery = activeTab === "sale" ? saleQuery : newQuery;
  if (saleQuery.isLoading || newQuery.isLoading) return <SectionLoading />;

  return (
    <section className="py-16 bg-[#fafafa]">
      <ScrollReveal animation="slideUp" delay={150}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-12 space-y-3">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tighter text-slate-900 uppercase italic">
              {title}
            </h2>
            <p className="text-slate-500 font-medium tracking-wide uppercase text-xs md:text-sm">{subtitle}</p>
            <div className="w-12 h-1.5 bg-orange-500 rounded-full" />
          </div>

          <div className="flex justify-center mb-10">
            <div className="inline-flex p-1.5 bg-white border border-slate-100 rounded-4xl shadow-sm relative">
              {tabConfigs.map((tab) => {
                const IsActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "relative flex items-center gap-2 md:px-6 px-5 md:py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-300 z-10",
                      IsActive ? "text-white" : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    {IsActive && (
                      <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 bg-orange-500 rounded-full shadow-lg shadow-orange-500/20"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <tab.icon size={14} className="relative z-10" />
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            <AnimatePresence mode="popLayout">
              {displayProducts.map((product, idx) => (
                <motion.div
                  key={`${activeTab}-${product.id}-${idx}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard
                    product={product}
                    isWishlisted={wishlistMap.get(product.variants?.[0]?.id || "") || false}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex flex-col items-center gap-6 pt-12">
            {activeTab !== "all" && currentQuery.hasNextPage && (
              <button
                onClick={() => currentQuery.fetchNextPage()}
                disabled={currentQuery.isFetchingNextPage}
                className="flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 rounded-2xl font-semibold text-[10px] uppercase tracking-[0.2em] text-slate-600 hover:border-orange-500 hover:text-orange-600 transition-all shadow-sm active:scale-95 disabled:opacity-50"
              >
                {currentQuery.isFetchingNextPage ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <LayoutGrid size={14} />
                )}
                Xem thêm sản phẩm
              </button>
            )}

            <Link href="/products">
              <ButtonField
                htmlType="button"
                type="login"
                className="flex w-60 items-center gap-2 px-5 py-4 rounded-full text-sm font-semibold shadow-md shadow-orange-500/20 transition-all active:scale-95 border-0 h-auto"
              >
                <span className="flex items-center gap-2 uppercase font-bold">
                  <ShoppingCart size={22} strokeWidth={2.5} />
                  Tất cả sản phẩm
                  <ArrowRight size={18} />
                </span>
              </ButtonField>
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};
