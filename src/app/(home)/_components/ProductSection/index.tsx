"use client";

import { ProductCard } from "@/app/products/_components";
import AnimatedBadge from "@/features/AnimatedBadge";
import { useWishlist } from "@/hooks/useWishlist";
import { publicProductService } from "@/services/products/product.service";
import { PublicProductListItemDTO } from "@/types/product/public-product.dto";
import { cn } from "@/utils/cn";
import { isAuthenticated } from "@/utils/local.storage";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ProductSectionProps, ProductWithVariants } from "./type";
import ScrollReveal from "@/features/ScrollReveal";

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
  const [products, setProducts] = useState<ProductWithVariants[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [wishlistMap, setWishlistMap] = useState<Map<string, boolean>>(
    new Map()
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [colsPerRow, setColsPerRow] = useState(columns.desktop || 6);
  const { checkVariantsInWishlist } = useWishlist();
  const hasInitialFetchedRef = useRef(false);

  const config = {
    featured: { title: "NỔI BẬT", badgeType: "featured" as const },
    sale: { title: "GIẢM GIÁ", badgeType: "sale" as const },
    new: { title: "MỚI VỀ", badgeType: "new" as const },
  }[type];

  const fetchProducts = useCallback(
    async (page: number, size: number = 24, isInitial: boolean = false) => {
      try {
        isInitial ? setLoading(true) : setLoadingMore(true);
        let response;
        if (type === "featured")
          response = await publicProductService.getFeatured(page, size);
        else if (type === "sale")
          response = await publicProductService.getSale(page, size);
        else response = await publicProductService.getNew(page, size);

        const list = (response.data?.content || []) as ProductWithVariants[];
        if (list.length > 0) {
          setProducts((prev) => (isInitial ? list : [...prev, ...list]));
          setHasMore(
            products.length + list.length < (response.data?.totalElements || 0)
          );

          if (isAuthenticated()) {
            const vIds = list
              .map((p) =>
                "variants" in p && p.variants?.[0]?.id ? p.variants[0].id : ""
              )
              .filter((id) => id);
            if (vIds.length > 0) {
              const status = await checkVariantsInWishlist(vIds);
              setWishlistMap((prev) => new Map([...prev, ...status]));
            }
          }
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [type, checkVariantsInWishlist, products.length]
  );

  useEffect(() => {
    if (!hasInitialFetchedRef.current) {
      hasInitialFetchedRef.current = true;
      fetchProducts(0, colsPerRow * rows * 2, true);
    }
  }, []);

  const pageSize = colsPerRow * rows;
  const startIndex = currentPage * pageSize;
  const paginatedProducts = products.slice(startIndex, startIndex + pageSize);

  return (
    <section className="py-16 bg-[#ffffff] relative overflow-hidden">
      <ScrollReveal animation="slideUp" delay={250}>
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-orange-100/30 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-100/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-slate-100 pb-8 px-2">
            <div className="space-y-3">
              {showBadge && (
                <AnimatedBadge
                  type={badgeType || config.badgeType}
                  size="small"
                  animation="glow"
                  className="mb-1"
                />
              )}
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none text-slate-950 flex items-center gap-4">
                {icon && (
                  <span className="text-orange-500 drop-shadow-sm">{icon}</span>
                )}
                {title || config.title}
              </h2>
              <p className="text-slate-400 text-xs md:text-sm font-bold uppercase tracking-[0.3em] pl-1">
                {subtitle || "Khám phá bộ sưu tập tốt nhất hôm nay"}
              </p>
            </div>

            {showViewAll && (
              <Link
                href={viewAllHref}
                className="group inline-flex items-center gap-3 px-6 py-3 bg-slate-50 hover:bg-orange-500 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-600 hover:text-white transition-all duration-300 shadow-sm shadow-slate-200/50"
              >
                XEM TẤT CẢ
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            )}
          </div>

          <div
            className={cn(
              "relative",
              sidebar ? "grid grid-cols-1 lg:grid-cols-4 gap-10" : ""
            )}
          >
            {sidebar && (
              <div className="lg:col-span-1 hidden lg:block sticky top-24 h-fit group">
                <div className="bg-white border border-slate-100 rounded-[2.5rem] p-4 shadow-sm group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-500">
                  {sidebar}
                </div>
              </div>
            )}

            <div
              className={cn("relative", sidebar ? "lg:col-span-3" : "w-full")}
            >
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {[...Array(colsPerRow)].map((_, i) => (
                    <div
                      key={i}
                      className="aspect-3/4 bg-slate-100 rounded-3xl animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <div className="relative group/grid">
                  <AnimatePresence>
                    {currentPage > 0 && (
                      <motion.button
                        key="prev-btn"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        onClick={() => setCurrentPage((p) => p - 1)}
                        className="absolute -left-6 top-1/2 -translate-y-1/2 z-40 w-14 h-14 bg-white rounded-full shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)] border border-slate-50 flex items-center justify-center text-slate-900 hover:text-orange-500 transition-all active:scale-90"
                      >
                        <ChevronLeft size={28} strokeWidth={2.5} />
                      </motion.button>
                    )}

                    {(startIndex + pageSize < products.length || hasMore) && (
                      <motion.button
                        key="next-btn"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        onClick={() => {
                          if (startIndex + pageSize >= products.length)
                            fetchProducts(currentPage + 1, pageSize, false);
                          setCurrentPage((p) => p + 1);
                        }}
                        className="absolute -right-6 top-1/2 -translate-y-1/2 z-40 w-14 h-14 bg-white rounded-full shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)] border border-slate-50 flex items-center justify-center text-slate-900 hover:text-orange-500 transition-all active:scale-90 disabled:opacity-50"
                        disabled={loadingMore}
                      >
                        {loadingMore ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          <ChevronRight size={28} strokeWidth={2.5} />
                        )}
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
                    {paginatedProducts.map((product) => {
                      const vId =
                        ("variants" in product && product.variants?.[0]?.id) ||
                        "";
                      return (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4 }}
                        >
                          <ProductCard
                            product={product as PublicProductListItemDTO}
                            isWishlisted={wishlistMap.get(vId) || false}
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};
