"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Star,
  Flame,
  Sparkles,
  ArrowRight,
  Loader2,
  ShoppingCart,
  LayoutGrid,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { publicProductService } from "@/services/products/product.service";
import { PublicProductListItemDTO } from "@/types/product/public-product.dto";
import { useWishlist } from "@/app/wishlist/_hooks/useWishlist";
import { ProductCard } from "@/app/products/_components";
import { isAuthenticated } from "@/utils/local.storage";
import { cn } from "@/utils/cn";
import { ButtonField } from "@/components";
import ScrollReveal from "@/features/ScrollReveal";

interface ProductShowcaseProps {
  title?: string;
  subtitle?: string;
  rows?: number;
}

const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  title = "GỢI Ý HÔM NAY",
  subtitle = "Dành riêng cho phong cách của bạn",
  rows = 4,
}) => {
  const [activeTab, setActiveTab] = useState<"all" | "sale" | "new">("all");
  const [saleProducts, setSaleProducts] = useState<PublicProductListItemDTO[]>(
    []
  );
  const [newProducts, setNewProducts] = useState<PublicProductListItemDTO[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [wishlistMap, setWishlistMap] = useState<Map<string, boolean>>(
    new Map()
  );
  const [currentPage, setCurrentPage] = useState({ sale: 0, new: 0 });
  const [hasMore, setHasMore] = useState({ sale: true, new: true });
  const [colsPerRow, setColsPerRow] = useState(6);

  const { checkVariantsInWishlist } = useWishlist();
  const hasInitialFetchedRef = useRef(false);

  useEffect(() => {
    const updateLayout = () => {
      if (typeof window === "undefined") return;
      const width = window.innerWidth;
      if (width < 640) setColsPerRow(2);
      else if (width < 1024) setColsPerRow(4);
      else setColsPerRow(6);
    };
    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  const productsPerPage = colsPerRow * rows;

  const fetchProducts = useCallback(
    async (type: "sale" | "new", page: number) => {
      try {
        const response =
          type === "sale"
            ? await publicProductService.getSale(page, productsPerPage)
            : await publicProductService.getNew(page, productsPerPage);

        const productsList = (response.data?.content ||
          []) as PublicProductListItemDTO[];

        if (productsList.length > 0) {
          if (type === "sale")
            setSaleProducts((prev) =>
              page === 0 ? productsList : [...prev, ...productsList]
            );
          else
            setNewProducts((prev) =>
              page === 0 ? productsList : [...prev, ...productsList]
            );

          if (isAuthenticated()) {
            const variantIds = productsList
              .map((p) => p.variants?.[0]?.id)
              .filter((id): id is string => !!id);

            if (variantIds.length > 0) {
              const statusMap = await checkVariantsInWishlist(variantIds);
              setWishlistMap((prev) => new Map([...prev, ...statusMap]));
            }
          }

          const totalElements = response.data?.totalElements || 0;
          const currentTotal = (page + 1) * productsPerPage;
          setHasMore((prev) => ({
            ...prev,
            [type]: currentTotal < totalElements,
          }));
        } else {
          setHasMore((prev) => ({ ...prev, [type]: false }));
        }
      } catch (error) {
        console.error(error);
      }
    },
    [productsPerPage, checkVariantsInWishlist]
  );

  useEffect(() => {
    if (hasInitialFetchedRef.current) return;
    hasInitialFetchedRef.current = true;
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchProducts("sale", 0), fetchProducts("new", 0)]);
      setLoading(false);
    };
    load();
  }, [fetchProducts]);

  const handleLoadMore = async () => {
    if (activeTab === "all") return;
    setLoadingMore(true);
    const nextPage = currentPage[activeTab] + 1;
    await fetchProducts(activeTab, nextPage);
    setCurrentPage((prev) => ({ ...prev, [activeTab]: nextPage }));
    setLoadingMore(false);
  };

  const getDisplayProducts = () => {
    if (activeTab === "sale") return saleProducts;
    if (activeTab === "new") return newProducts;

    const mixed: PublicProductListItemDTO[] = [];
    const maxLength = Math.max(saleProducts.length, newProducts.length);
    for (let i = 0; i < maxLength; i++) {
      if (saleProducts[i]) mixed.push(saleProducts[i]);
      if (newProducts[i]) mixed.push(newProducts[i]);
    }
    return mixed.slice(0, productsPerPage);
  };

  const displayProducts = getDisplayProducts();
  const canLoadMore = activeTab !== "all" && hasMore[activeTab];

  const tabConfigs = [
    { id: "all", label: "Gợi ý", icon: Star },
    { id: "sale", label: "Giảm giá", icon: Flame },
    { id: "new", label: "Mới nhất", icon: Sparkles },
  ];

  return (
    <section className="py-16 bg-[#fafafa]">
      <ScrollReveal animation="slideUp" delay={150}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-12 space-y-3">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase italic">
              {title}
            </h2>
            <p className="text-slate-500 font-medium tracking-wide uppercase text-xs md:text-sm">
              {subtitle}
            </p>
            <div className="w-12 h-1.5 bg-orange-500 rounded-full" />
          </div>

          <div className="flex justify-center mb-10">
            <div className="inline-flex p-1.5 bg-white border border-slate-100 rounded-4xl shadow-sm relative">
              {tabConfigs.map((tab) => {
                const IsActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "relative flex items-center gap-2 md:px-6 px-5 md:py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 z-10",
                      IsActive
                        ? "text-white"
                        : "text-slate-400 hover:text-slate-600"
                    )}
                  >
                    {IsActive && (
                      <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 bg-orange-500 rounded-full shadow-lg shadow-orange-500/20"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                    <Icon size={14} className="relative z-10" />
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                Đang tải dữ liệu...
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
                <AnimatePresence mode="popLayout">
                  {displayProducts.map((product, idx) => {
                    const vId = product.variants?.[0]?.id || "";
                    const key =
                      activeTab === "all"
                        ? `all-${product.id}-${idx}`
                        : `${activeTab}-${product.id}`;
                    return (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ProductCard
                          product={product}
                          isWishlisted={wishlistMap.get(vId) || false}
                        />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              <div className="flex flex-col items-center gap-6 pt-4">
                {canLoadMore && (
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="flex items-center gap-2 px-8 py-4 bg-white border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-slate-600 hover:border-orange-500 hover:text-orange-600 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                  >
                    {loadingMore ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <LayoutGrid size={14} />
                    )}
                    Xem thêm sản phẩm
                  </button>
                )}

                <Link href="/products">
                  <ButtonField
                    form="profile-form"
                    htmlType="submit"
                    type="login"
                    className="flex w-60 items-center gap-2 px-5 py-4 rounded-full text-sm font-semibold shadow-md shadow-orange-500/20 transition-all active:scale-95 border-0 h-auto"
                  >
                    <span className="flex items-center gap-2 uppercase font-bold">
                      <ShoppingCart size={22} strokeWidth={2.5} />
                      Tất cả sản phẩm
                      <ArrowRight
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </span>
                  </ButtonField>
                </Link>
              </div>
            </div>
          )}
        </div>
      </ScrollReveal>
    </section>
  );
};

export default ProductShowcase;
