"use client";

import { ProductCard } from "@/app/(main)/products/_components";
import { SectionLoading } from "@/components";
import { SectionSreen } from "@/features/SectionSreen";
import { userProductService } from "@/services/products/product.service";
import { cn } from "@/utils/cn";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Flame, Plus, Sparkles, Star } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useHomepageContext } from "../../_context/HomepageContext";
import { useInfiniteProducts } from "../../_hooks/useHomePageData";
import { PublicProductListItemDTO } from "@/types/product/public-product.dto";

export const ProductShowcaseTest = ({
  title = "TEST GET ALL PRODUCTS",
  subtitle = "Dành riêng cho bạn",
}) => {
  const [activeTab, setActiveTab] = useState<"all" | "sale" | "new">("all");
  const saleQuery = useInfiniteProducts("sale");
  const newQuery = useInfiniteProducts("new");
  const { isLoading: homepageLoading, wishlistMap } = useHomepageContext();

  // Query lấy tất cả sản phẩm
  const allQuery = useInfiniteQuery({
    queryKey: ["products", "all"],
    queryFn: ({ pageParam = 0 }) =>
      userProductService.getAllProducts(pageParam, 12),
    getNextPageParam: (lastPage: any) => {
      const pageData = lastPage?.data?.data || lastPage?.data;
      if (pageData && typeof pageData.number === "number") {
        return pageData.number + 1 < pageData.totalPages
          ? pageData.number + 1
          : undefined;
      }
      return undefined;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
  });

  // Lấy danh sách sản phẩm từ từng query
  const allList = useMemo(
    () => allQuery.data?.pages.flatMap((p) => p.data.content) || [],
    [allQuery.data]
  );
  const saleList = useMemo(
    () => saleQuery.data?.pages.flatMap((p) => p.data.content) || [],
    [saleQuery.data]
  );
  const newList = useMemo(
    () => newQuery.data?.pages.flatMap((p) => p.data.content) || [],
    [newQuery.data]
  );

  // Chọn danh sách hiển thị theo tab
  const displayProducts = useMemo(() => {
    if (activeTab === "sale") return saleList;
    if (activeTab === "new") return newList;
    return allList;
  }, [activeTab, allList, saleList, newList]);

  const tabConfigs = [
    { id: "all", label: "Tất cả", icon: Star },
    { id: "sale", label: "Giảm giá", icon: Flame },
    { id: "new", label: "Mới nhất", icon: Sparkles },
  ] as const;

  if (
    allQuery.isLoading ||
    saleQuery.isLoading ||
    newQuery.isLoading ||
    homepageLoading
  )
    return <SectionLoading />;

  return (
    <SectionSreen id="calatha-mall" animation="slideUp">
      <div className="flex flex-col items-center text-center mb-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white uppercase italic">
          {title}
        </h2>
        <p className="text-white/80 font-medium tracking-widest text-[11px] uppercase">
          {subtitle}
        </p>
        <div className="w-8 h-1 bg-red-500/80 rounded-full mt-1" />
      </div>

      <div className="flex justify-center mb-6">
        <div className="inline-flex p-1 bg-gray-50 border border-gray-200/60 rounded-full relative">
        
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
        <AnimatePresence mode="popLayout">
          {displayProducts
            .filter(
              (product) =>
                !!product && !!product.category && !!product.category.slug
            )
            .slice(0, 11)
            .map((product, idx) => (
              <motion.div
                key={`${activeTab}-${product.id}-${idx}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <ProductCard
                  product={product as PublicProductListItemDTO}
                  isWishlisted={
                    wishlistMap.get(product.variants?.[0]?.id || "") || false
                  }
                />
              </motion.div>
            ))}

          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full"
          >
            <Link
              href="/products"
              className="group h-full flex flex-col items-center justify-center p-6 bg-red-50 border-2 border-dashed border-red-200 rounded-2xl hover:bg-red-50 hover:border-red-200 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-red-500 group-hover:text-white transition-all duration-300">
                <ArrowRight size={20} />
              </div>
              <span className="mt-4 text-[12px] font-bold uppercase  text-red-500 group-hover:text-red-600">
                Xem tất cả
              </span>
              <div className="mt-1 flex items-center gap-1 text-[9px] text-gray-600 font-medium">
                <Plus size={10} />
                <span>Hơn 1000+ sản phẩm</span>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </SectionSreen>
  );
};
