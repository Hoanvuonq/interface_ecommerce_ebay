"use client";

import { useState, useCallback, useEffect } from "react";
import { ProductCard } from "../ProductCard";
import { FiChevronRight, FiLayers } from "react-icons/fi";
import { publicProductService } from "@/app/(shop)/shop/products/_services/product.service";
import type { PublicProductListItemDTO } from "@/types/product/public-product.dto";
import { CustomSpinner } from "@/components";
import { CardComponents } from "@/components/card";
import { cn } from "@/utils/cn";

interface SimilarProductsProps {
  productId: string;
}

export function SimilarProducts({ productId }: SimilarProductsProps) {
  const [products, setProducts] = useState<PublicProductListItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalElements, setTotalElements] = useState<number>(0);

  const loadProducts = useCallback(async (page = 0, append = false) => {
    try {
      if (!append) setLoading(true);
      const response = await publicProductService.getRelated(productId, page, 20);
      
      const responseData = response?.data;
      const newProducts = responseData?.content || [];
      const total = responseData?.totalElements || 0;
      
      setProducts(prev => {
        const updated = append ? [...prev, ...newProducts] : newProducts;
        setHasMore(updated.length < total && newProducts.length > 0);
        return updated;
      });
      setCurrentPage(page);
      setTotalElements(total);
    } catch (error) {
      console.error("Failed to load similar products:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (productId) loadProducts(0, false);
  }, [productId, loadProducts]);

  const loadMore = () => {
    if (loading || !hasMore) return;
    loadProducts(currentPage + 1, true);
  };

  if (!loading && products.length === 0) return null;

  return (
    <CardComponents
      className="border-none shadow-sm bg-white overflow-hidden"
      bodyClassName="p-4 sm:p-6"
    >
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
            <FiLayers size={22} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight">
              Sản phẩm tương tự
            </h3>
            <p className="text-xs text-gray-600 font-medium">
              Khám phá thêm <span className="text-orange-500">{totalElements}</span> sản phẩm cùng loại
            </p>
          </div>
        </div>
      </div>

      {/* GRID SECTION */}
      <div className="relative">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((p) => (
            <div key={p.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <ProductCard product={p} />
            </div>
          ))}
          
          {/* SKELETON PLACEHOLDERS KHI LOAD MORE */}
          {loading && products.length > 0 && 
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-50 rounded-2xl animate-pulse border border-gray-100" />
            ))
          }
        </div>

        {/* LOADING STATE LẦN ĐẦU */}
        {loading && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <CustomSpinner />
            <p className="text-sm text-gray-600 animate-pulse font-medium">Đang tìm kiếm sản phẩm phù hợp...</p>
          </div>
        )}

        {/* ACTION BUTTON */}
        {hasMore && products.length > 0 && (
          <div className="flex justify-center mt-10">
            <button
              type="button"
              onClick={loadMore}
              disabled={loading}
              className={cn(
                "group flex items-center gap-2 px-10 py-3 bg-white border-2 border-gray-100 rounded-2xl",
                "text-sm font-bold text-gray-600 transition-all duration-300",
                "hover:border-gray-500 hover:text-orange-500 hover:shadow-lg hover:shadow-orange-100",
                "active:scale-95 disabled:opacity-50"
              )}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                  <span>ĐANG TẢI...</span>
                </div>
              ) : (
                <>
                  <span>XEM THÊM KẾT QUẢ</span>
                  <FiChevronRight className="text-lg group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </CardComponents>
  );
}