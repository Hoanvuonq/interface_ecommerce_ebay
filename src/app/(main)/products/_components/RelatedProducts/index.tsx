"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { ProductCard } from "../ProductCard";
import { FiChevronRight, FiChevronLeft, FiShoppingBag } from "react-icons/fi";
import { publicProductService } from "@/services/products/product.service";
import type { PublicProductListItemDTO } from "@/types/product/public-product.dto";
import { CardComponents } from "@/components/card";
import { CustomSpinner } from "@/components";
import { cn } from "@/utils/cn";

interface RelatedProductsProps {
  shopId: string;
  excludeProductId?: string;
}

export function RelatedProducts({ shopId, excludeProductId }: RelatedProductsProps) {
  const [products, setProducts] = useState<PublicProductListItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const loadProducts = useCallback(async (page = 0, append = false) => {
    try {
      if (!append) setLoading(true);
      const response = await publicProductService.getByShop(shopId, page, 10);
      const responseData = response?.data;
      const newProducts = responseData?.content || [];
      const total = responseData?.totalElements || 0;
      
      const filteredProducts = excludeProductId
        ? newProducts.filter((p: PublicProductListItemDTO) => p.id !== excludeProductId)
        : newProducts;
      
      setProducts(prev => {
        const updated = append ? [...prev, ...filteredProducts] : filteredProducts;
        setHasMore(updated.length < total && newProducts.length > 0);
        return updated;
      });
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to load shop products:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [shopId, excludeProductId]);

  useEffect(() => {
    if (shopId) loadProducts(0, false);
  }, [shopId, loadProducts]);

  const checkScrollButtons = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    checkScrollButtons();
    container.addEventListener("scroll", checkScrollButtons);
    window.addEventListener("resize", checkScrollButtons);
    return () => {
      container.removeEventListener("scroll", checkScrollButtons);
      window.removeEventListener("resize", checkScrollButtons);
    };
  }, [products, checkScrollButtons]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({ 
        left: direction === "left" ? -scrollAmount : scrollAmount, 
        behavior: "smooth" 
      });
      
      // Infinite scroll logic
      if (direction === "right" && hasMore && !loading) {
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 800) {
          loadProducts(currentPage + 1, true);
        }
      }
    }
  };

  if (loading && products.length === 0) {
    return (
      <CardComponents className="border-none shadow-sm bg-white">
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <CustomSpinner />
          <p className="text-sm text-gray-600 font-medium animate-pulse">Đang tìm thêm sản phẩm từ shop...</p>
        </div>
      </CardComponents>
    );
  }

  if (products.length === 0) return null;

  return (
    <CardComponents
      className="border-none shadow-sm hover:shadow-md transition-all duration-300 bg-white overflow-hidden"
      bodyClassName="relative p-0" 
    >
      <div className="flex items-center gap-3 px-6 pt-6 mb-4">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
          <FiShoppingBag size={20} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight">
          Sản phẩm cùng Shop
        </h3>
      </div>

      <div className="relative group/nav px-4 pb-6">
        <button
          onClick={() => scroll("left")}
          className={cn(
            "absolute left-2 top-1/2 -translate-y-1/2 z-30 h-11 w-11 rounded-full bg-white shadow-xl border border-gray-100 flex items-center justify-center text-gray-600 transition-all duration-300 hover:bg-orange-500 hover:text-white hover:scale-110 active:scale-95",
            canScrollLeft ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
          )}
        >
          <FiChevronLeft className="text-2xl" />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-none scroll-smooth snap-x"
        >
          {products.map((p) => (
            <div key={p.id} className="shrink-0 w-45 sm:w-50 md:w-55 snap-start transition-transform duration-300 hover:-translate-y-1">
              <ProductCard product={p} />
            </div>
          ))}
          
          {loading && hasMore && (
            <div className="shrink-0 w-32 flex flex-col items-center justify-center gap-2 text-gray-600">
              <div className="w-8 h-8 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-[10px] font-bold uppercase tracking-tighter">Tải thêm</span>
            </div>
          )}
        </div>

        <button
          onClick={() => scroll("right")}
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 z-30 h-11 w-11 rounded-full bg-white shadow-xl border border-gray-100 flex items-center justify-center text-gray-600 transition-all duration-300 hover:bg-orange-500 hover:text-white hover:scale-110 active:scale-95",
            canScrollRight ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
          )}
        >
          <FiChevronRight className="text-2xl" />
        </button>
      </div>
    </CardComponents>
  );
}