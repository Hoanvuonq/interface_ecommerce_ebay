"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { ProductCard } from "@/app/(main)/products/_components";
import { SectionLoading } from "@/components";
import AnimatedBadge from "@/features/AnimatedBadge";
import ScrollReveal from "@/features/ScrollReveal";
import { cn } from "@/utils/cn";
import { PublicProductListItemDTO } from "@/types/product/public-product.dto";

import { useHomepageContext } from "../../_context/HomepageContext";
import { ProductSectionProps } from "./type";

export const ProductSection: React.FC<ProductSectionProps> = ({
  type,
  title,
  subtitle,
  icon,
  badgeType,
  showBadge = true,
  columns = { mobile: 2, tablet: 4, desktop: 6 },
  rows = 2,
  showViewAll = true,
  viewAllHref = "/products",
  sidebar,
}) => {
  const { featured, flashSale, isLoading, wishlistMap } = useHomepageContext();

  const rawProducts = useMemo(() => {
    const data = type === "featured" ? featured : flashSale;
    return Array.isArray(data) ? data : [];
  }, [type, featured, flashSale]);

  const [currentPage, setCurrentPage] = useState(0);
  const colsPerRow = columns.desktop || 6;
  const pageSize = colsPerRow * rows;

  const config = {
    featured: { title: "NỔI BẬT", badgeType: "featured" as const },
    sale: { title: "GIẢM GIÁ", badgeType: "sale" as const },
    new: { title: "MỚI VỀ", badgeType: "new" as const },
  }[type];

  const paginatedProducts = useMemo(() => {
    const startIndex = currentPage * pageSize;
    return rawProducts.slice(startIndex, startIndex + pageSize);
  }, [rawProducts, currentPage, pageSize]);

  if (isLoading && rawProducts.length === 0) return <SectionLoading />;
  
  if (!isLoading && rawProducts.length === 0) return null;

  return (
    <section className="py-16 bg-[#ffffff] relative overflow-hidden">
      <ScrollReveal animation="slideUp" delay={250}>
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-orange-100/30 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-100/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-gray-100 pb-8 px-2">
            <div className="space-y-3">
              {showBadge && (
                <AnimatedBadge
                  type={badgeType || config.badgeType}
                  size="small"
                  animation="glow"
                  className="mb-1"
                />
              )}
              <h2 className="text-4xl md:text-6xl font-semibold tracking-tighter uppercase italic leading-none text-gray-950 flex items-center gap-4">
                {icon && <span className="text-orange-500 drop-shadow-sm">{icon}</span>}
                {title || config.title}
              </h2>
              <p className="text-gray-600 text-xs md:text-sm font-bold uppercase tracking-[0.3em] pl-1">
                {subtitle || "Khám phá bộ sưu tập tốt nhất hôm nay"}
              </p>
            </div>

            {showViewAll && (
              <Link
                href={viewAllHref}
                className="group inline-flex items-center gap-3 px-6 py-3 bg-gray-50 hover:bg-orange-500 rounded-2xl text-[11px] font-semibold uppercase tracking-widest text-gray-600 hover:text-white transition-all duration-300 shadow-sm"
              >
                XEM TẤT CẢ
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>

          <div className={cn("relative", sidebar ? "grid grid-cols-1 lg:grid-cols-4 gap-10" : "")}>
            {sidebar && (
              <div className="lg:col-span-1 hidden lg:block sticky top-24 h-fit group">
                <div className="bg-white border border-gray-100 rounded-[2.5rem] p-4 shadow-sm group-hover:shadow-xl transition-all duration-500">
                  {sidebar}
                </div>
              </div>
            )}

            <div className={cn("relative", sidebar ? "lg:col-span-3" : "w-full")}>
              <div className="relative group/grid">
                <AnimatePresence>
                  {currentPage > 0 && (
                    <motion.button
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      onClick={() => setCurrentPage((p) => p - 1)}
                      className="absolute -left-6 top-1/2 -translate-y-1/2 z-40 w-14 h-14 bg-white rounded-full shadow-xl border border-gray-50 flex items-center justify-center text-gray-900 hover:text-orange-500 transition-all active:scale-90"
                    >
                      <ChevronLeft size={28} strokeWidth={2.5} />
                    </motion.button>
                  )}

                  {(currentPage + 1) * pageSize < rawProducts.length && (
                    <motion.button
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      onClick={() => setCurrentPage((p) => p + 1)}
                      className="absolute -right-6 top-1/2 -translate-y-1/2 z-40 w-14 h-14 bg-white rounded-full shadow-xl border border-gray-50 flex items-center justify-center text-gray-900 hover:text-orange-500 transition-all active:scale-90"
                    >
                      <ChevronRight size={28} strokeWidth={2.5} />
                    </motion.button>
                  )}
                </AnimatePresence>

                <div
                  className={cn(
                    "grid gap-6 md:gap-8",
                    sidebar
                      ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                      : "grid-cols-2 md:grid-cols-4 lg:grid-cols-6"
                  )}
                >
                  {paginatedProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <ProductCard
                        product={product as PublicProductListItemDTO}
                        isWishlisted={wishlistMap.get(product.variants?.[0]?.id || "") || false}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};