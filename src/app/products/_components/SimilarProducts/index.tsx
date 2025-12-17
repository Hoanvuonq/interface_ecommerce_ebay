"use client";

import { useState, useCallback, useEffect } from "react";
import { ProductCard } from "../ProductCard";
import { FiChevronRight } from "react-icons/fi";
import { publicProductService } from "@/services/products/product.service";
import type { PublicProductListItemDTO } from "@/types/product/public-product.dto";
import { CustomSpinner } from "@/components";
import { CardComponents } from "@/components/card";

interface SimilarProductsProps {
  productId: string;
}

export function SimilarProducts({ productId }: SimilarProductsProps) {
  const [products, setProducts] = useState<PublicProductListItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalElements, setTotalElements] = useState<number | null>(null);

  const loadProducts = useCallback(async (page = 0, append = false) => {
    try {
      if (!append) setLoading(true);
      // Load 20 sản phẩm để hiển thị 4 hàng (5 sản phẩm/hàng)
      const response = await publicProductService.getRelated(productId, page, 20);
      
      const responseData = response?.data;
      const newProducts = responseData?.content || [];
      const total = responseData?.totalElements || 0;
      
      if (newProducts.length > 0 || page === 0) {
        setProducts(prev => {
          const updated = append ? [...prev, ...newProducts] : newProducts;
          // Check if there's more data based on updated list
          const currentTotal = updated.length;
          setHasMore(currentTotal < total && newProducts.length > 0);
          return updated;
        });
        setCurrentPage(page);
        setTotalElements(total);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load similar products:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (productId) {
      loadProducts(0, false);
    }
  }, [productId]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    loadProducts(currentPage + 1, true);
  }, [loading, hasMore, currentPage, loadProducts]);

  if (loading && products.length === 0) {
    return (
      <CardComponents
        title="Sản phẩm liên quan"
        className="shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="text-center py-8">
          <CustomSpinner />
          <p className="mt-2 text-gray-500">Đang tải sản phẩm...</p>
        </div>
      </CardComponents>
    );
  }

  if (products.length === 0) {
    return null;
  }

  const canLoadMore = hasMore && (products.length >= 20 || (currentPage === 0 && products.length > 0));

  return (
    <CardComponents
      title="Sản phẩm liên quan"
      className="shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {canLoadMore && (
          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={loadMore}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-500 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <CustomSpinner />
                  <span>Đang tải...</span>
                </>
              ) : (
                <>
                  <span>Xem thêm</span>
                  <FiChevronRight className="text-lg" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </CardComponents>
  );
}

