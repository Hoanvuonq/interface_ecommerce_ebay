"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { ProductCard } from "../ProductCard";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { publicProductService } from "@/services/products/product.service";
import type { PublicProductListItemDTO } from "@/types/product/public-product.dto";
import { CardComponents } from "@/components/card";
import { CustomSpinner } from "@/components";

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
      
      if (filteredProducts.length > 0 || page === 0) {
        setProducts(prev => {
          const updated = append ? [...prev, ...filteredProducts] : filteredProducts;
          const currentTotal = updated.length;
          setHasMore(currentTotal < total && filteredProducts.length > 0);
          return updated;
        });
        setCurrentPage(page);
      } else {
        setHasMore(false);
      }
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
      const scrollAmount = direction === "left" ? -500 : 500;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      
      // Load more logic
      if (direction === "right" && hasMore && !loading) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 600) {
          loadProducts(currentPage + 1, true);
        }
      }
    }
  };

  if (loading && products.length === 0) {
    return (
      <CardComponents title="Sản phẩm cùng shop" className="shadow-sm">
        <div className="text-center py-8"><CustomSpinner /><p className="mt-2 text-gray-500">Đang tải...</p></div>
      </CardComponents>
    );
  }

  if (products.length === 0) return null;

  return (
    <CardComponents
      title="Sản phẩm cùng shop"
      className="border-none shadow-sm hover:shadow-md transition-all duration-300"
      bodyClassName="relative px-2 sm:px-4" // Thêm padding ngang để nút không dính sát lề card
    >
      <div className="relative group/nav">
        {/* Nút cuộn trái */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 z-30 h-10 w-10 rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.15)] border border-gray-100 flex items-center justify-center text-gray-600 opacity-0 group-hover/nav:opacity-100 transition-all duration-300 hover:bg-orange-500 hover:text-white hover:scale-110 active:scale-95"
            aria-label="Scroll left"
          >
            <FiChevronLeft className="text-2xl" />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar scroll-smooth"
        >
          {products.map((p) => (
            <div key={p.id} className="flex-shrink-0 w-[160px] sm:w-[190px] md:w-[210px]">
              <ProductCard product={p} />
            </div>
          ))}
          
          {loading && hasMore && (
            <div className="flex-shrink-0 w-[100px] flex items-center justify-center">
              <CustomSpinner />
            </div>
          )}
        </div>

        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 z-30 h-10 w-10 rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.15)] border border-gray-100 flex items-center justify-center text-gray-600 opacity-0 group-hover/nav:opacity-100 transition-all duration-300 hover:bg-orange-500 hover:text-white hover:scale-110 active:scale-95"
            aria-label="Scroll right"
          >
            <FiChevronRight className="text-2xl" />
          </button>
        )}
      </div>
    </CardComponents>
  );
}