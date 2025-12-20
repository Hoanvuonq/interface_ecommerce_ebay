"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { toast } from "sonner";
import {
  LayoutGrid,
  List,
  Heart,
  Star,
  ShoppingCart,
  Loader2,
  Search,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

import { ProductCard } from "../ProductCard";
import { publicProductService } from "@/services/products/product.service";
import {
  PublicProductSearchQueryDTO,
  PublicProductListItemDTO,
} from "@/types/product/public-product.dto";
import { useCart } from "../../_hooks/useCart";
import { requireAuthentication } from "@/utils/cart/cart-auth.utils";
import { useRouter } from "next/navigation";
import { cn } from "@/utils/cn";
import { CustomButton } from "@/components/button";
import { TabsChangeLayout } from "../TabsChangeLayout";

const CustomPagination: React.FC<{
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize: number) => void;
}> = ({ page, pageSize, total, onChange }) => {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-12 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 w-fit mx-auto">
      <CustomButton
        variant="outline"
        onClick={() => onChange(page - 1, pageSize)}
        disabled={page <= 1}
        className="!h-10 !w-10 !p-0 rounded-xl"
        icon={<ArrowLeft size={18} />}
      />
      <div className="flex items-center gap-2 px-4">
        <span className="text-sm font-bold text-orange-600 bg-ortext-orange-50 px-3 py-1 rounded-lg">
          {page}
        </span>
        <span className="text-gray-400 text-sm">/</span>
        <span className="text-sm font-medium text-gray-600">{totalPages}</span>
      </div>
      <CustomButton
        variant="outline"
        onClick={() => onChange(page + 1, pageSize)}
        disabled={page >= totalPages}
        className="!h-10 !w-10 !p-0 rounded-xl"
        icon={<ArrowRight size={18} />}
      />
    </div>
  );
};

export default function ProductList({
  filters,
  endpoint = "all",
}: {
  filters: Partial<PublicProductSearchQueryDTO>;
  endpoint?: "all" | "featured" | "new" | "promoted";
}) {
  const router = useRouter();
  const { quickAddToCart } = useCart();

  // State Management
  const [products, setProducts] = useState<PublicProductListItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  // Fetching Logic
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: page - 1,
        size: pageSize,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v != null && v !== "")
        ),
      };

      let res;
      switch (endpoint) {
        case "featured":
          res = await publicProductService.getFeatured(
            params.page,
            params.size
          );
          break;
        case "new":
          res = await publicProductService.getNew(params.page, params.size);
          break;
        case "promoted":
          res = await publicProductService.getPromoted(
            params.page,
            params.size
          );
          break;
        default:
          res = await publicProductService.search(params);
      }

      const data = res?.data;
      setProducts(data?.content || (Array.isArray(data) ? data : []));
      setTotal(data?.totalElements || (Array.isArray(data) ? data.length : 0));
    } catch (err) {
      toast.error("Không thể kết nối đến máy chủ");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [endpoint, page, pageSize, filters]);

  useEffect(() => {
    setPage(1);
  }, [filters, endpoint]);
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddToCart = async (product: PublicProductListItemDTO) => {
    if (!requireAuthentication(window.location.pathname)) return;
    setAddingToCart(product.id);
    try {
      const detail = await publicProductService.getBySlug(
        product.slug || product.id
      );
      const variant =
        detail.data.variants?.find((v: any) => v.stockQuantity > 0) ||
        detail.data.variants?.[0];

      if (!variant) return toast.warning("Sản phẩm hết hàng");

      const success = await quickAddToCart(variant.id, 1);
      if (success) toast.success(`Đã thêm ${product.name}`);
    } catch (error) {
      toast.error("Lỗi khi thêm vào giỏ");
    } finally {
      setAddingToCart(null);
    }
  };
const [sort, setSort] = useState("newest");

const handleSort = (val: string) => {
  setSort(val);
};

  return (
    <div className="bg-transparent space-y-6">
      <TabsChangeLayout
        total={products.length}
        viewMode={viewMode}
        setViewMode={setViewMode}
        sortValue={sort}
        onSortChange={handleSort}
      />

      <div className="min-h-100">
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 animate-pulse aspect-[3/4] rounded-2xl"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-100">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-black text-gray-800">
              Không tìm thấy gì cả
            </h3>
            <p className="text-gray-500 mt-2">
              Hãy thử thay đổi tiêu chí tìm kiếm của bạn
            </p>
            <CustomButton
              variant="dark"
              onClick={() => window.location.reload()}
              className="mt-6"
            >
              Làm mới trang
            </CustomButton>
          </div>
        ) : (
          <>
            <div
              className={cn(
                viewMode === "grid"
                  ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
                  : "flex flex-col gap-4" 
              )}
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} viewMode={viewMode}/>
              ))}
            </div>
            <CustomPagination
              page={page}
              pageSize={pageSize}
              total={total}
              onChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
