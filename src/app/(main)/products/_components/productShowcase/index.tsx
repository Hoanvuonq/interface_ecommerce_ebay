"use client";

import { CustomTabs } from "@/components";
import { CustomButton } from "@/components/button";
import { useWishlist } from "@/app/(main)/wishlist/_hooks/useWishlist";
import { publicProductService } from "@/services/products/product.service";
import { PublicProductListItemDTO } from "@/types/product/public-product.dto";
import { cn } from "@/utils/cn"; 
import { isAuthenticated } from "@/utils/local.storage";
import { Flame, Loader2, ShoppingCart, Star } from "lucide-react";
import Link from "next/link";
import React, {
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";
import { toast } from "sonner";
import { ProductCard } from "../ProductCard";
import { batchCheckVariantsInWishlist } from "@/app/(main)/wishlist/_hooks/batchCheckVariantsInWishlist";

const CustomLoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center py-12">
    <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
  </div>
);

interface ProductShowcaseProps {
  title?: string;
  subtitle?: string;
  rows?: number; 
}

export const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  title = "GỢI Ý HÔM NAY",
  subtitle = "Dành riêng cho bạn",
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
  const [currentPage, setCurrentPage] = useState<{ sale: number; new: number }>(
    { sale: 0, new: 0 }
  );
  const [hasMore, setHasMore] = useState<{ sale: boolean; new: boolean }>({
    sale: true,
    new: true,
  });

  const { checkVariantsInWishlist } = useWishlist();
  const hasInitialFetchedRef = useRef(false);
  const [colsPerRow, setColsPerRow] = useState(6);

  useEffect(() => {
    const updateLayout = () => {
      if (typeof window === "undefined") return;
      const width = window.innerWidth;
      if (width < 640) {
        setColsPerRow(2);
      } else if (width < 1024) {
        setColsPerRow(4);
      } else {
        setColsPerRow(6);
      }
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
            : await publicProductService.getNewProducts(page, productsPerPage);

        const productsList = (response.data?.content ||
          []) as PublicProductListItemDTO[];

        if (productsList.length > 0) {
          if (type === "sale") {
            setSaleProducts((prev: PublicProductListItemDTO[]) =>
              page === 0 ? productsList : [...prev, ...productsList]
            );
          } else {
            setNewProducts((prev: PublicProductListItemDTO[]) =>
              page === 0 ? productsList : [...prev, ...productsList]
            );
          }

          // Update wishlist status
          if (isAuthenticated()) {
            const variantIds: string[] = [];
            productsList.forEach((product: any) => {
              if (
                product.variants &&
                Array.isArray(product.variants) &&
                product.variants.length > 0
              ) {
                variantIds.push(product.variants[0].id);
              }
            });

            if (variantIds.length > 0) {
              const wishlistStatusMap = await batchCheckVariantsInWishlist(
                checkVariantsInWishlist,
                variantIds,
                20
              );
              setWishlistMap((prev: Map<string, boolean>) => {
                const newMap = new Map(prev);
                wishlistStatusMap.forEach((value, key) => {
                  newMap.set(key, value);
                });
                return newMap;
              });
            }
          }

          // Check if has more
          const totalElements = response.data?.totalElements || 0;
          const currentTotal =
            type === "sale"
              ? page === 0
                ? productsList.length
                : saleProducts.length + productsList.length
              : page === 0
              ? productsList.length
              : newProducts.length + productsList.length;

          // 🎯 Sửa lỗi Implicit any: Khai báo kiểu cho prev: { sale: boolean, new: boolean }
          setHasMore((prev: { sale: boolean; new: boolean }) => ({
            ...prev,
            [type]: currentTotal < totalElements,
          }));
        } else {
          // 🎯 Sửa lỗi Implicit any: Khai báo kiểu cho prev: { sale: boolean, new: boolean }
          setHasMore((prev: { sale: boolean; new: boolean }) => ({
            ...prev,
            [type]: false,
          }));
        }
      } catch (error) {
        console.error(`Error fetching ${type} products:`, error);
        toast.error(
          `Không thể tải sản phẩm ${type === "sale" ? "giảm giá" : "mới"}`
        ); // ✅ Thay thế message.error
      }
    },
    [
      productsPerPage,
      checkVariantsInWishlist,
      saleProducts.length,
      newProducts.length,
    ]
  );

  // Initial load
  useEffect(() => {
    if (hasInitialFetchedRef.current) return;
    hasInitialFetchedRef.current = true;

    const loadInitialProducts = async () => {
      setLoading(true);
      // Cần đảm bảo productsPerPage được tính toán chính xác trước khi gọi fetchProducts
      await Promise.all([fetchProducts("sale", 0), fetchProducts("new", 0)]);
      setLoading(false);
    };

    // Delay nhẹ để đảm bảo productsPerPage đã được tính toán sau resize
    const timeoutId = setTimeout(loadInitialProducts, 100);
    return () => clearTimeout(timeoutId);
  }, [fetchProducts]);

  // Load more handler
  const handleLoadMore = async () => {
    const type = activeTab === "sale" ? "sale" : "new";
    if (activeTab === "all") return;

    setLoadingMore(true);
    const nextPage = currentPage[type] + 1;
    await fetchProducts(type, nextPage);

    // 🎯 Sửa lỗi Implicit any: Khai báo kiểu cho prev: { sale: number, new: number }
    setCurrentPage((prev: { sale: number; new: number }) => ({
      ...prev,
      [type]: nextPage,
    }));
    setLoadingMore(false);
  };

  // Get products to display based on active tab
  const getDisplayProducts = () => {
    switch (activeTab) {
      case "sale":
        return saleProducts;
      case "new":
        return newProducts;
      case "all":
      default:
        // Mix sale and new products, alternating
        const mixed: PublicProductListItemDTO[] = [];
        const maxLength = Math.max(saleProducts.length, newProducts.length);
        for (let i = 0; i < maxLength; i++) {
          if (saleProducts[i]) mixed.push(saleProducts[i]);
          if (newProducts[i]) mixed.push(newProducts[i]);
        }
        // Giới hạn hiển thị chỉ 1 lần productsPerPage cho tab 'all'
        return mixed.slice(0, productsPerPage);
    }
  };

  const displayProducts = getDisplayProducts();
  const canLoadMore =
    activeTab !== "all" && hasMore[activeTab as "sale" | "new"];

  // Tab items (Sử dụng CustomTabs)
  const tabItems = [
    {
      key: "all",
      label: (
        <span className="flex items-center gap-2 px-2">
          <Star className="w-4 h-4" /> {/* ✅ Thay thế StarOutlined */}
          Gợi ý
        </span>
      ),
    },
    {
      key: "sale",
      label: (
        <span className="flex items-center gap-2 px-2 text-red-500">
          <Flame className="w-4 h-4 fill-red-500" />{" "}
          {/* ✅ Thay thế FireOutlined */}
          Giảm giá
        </span>
      ),
    },
    {
      key: "new",
      label: (
        <span className="flex items-center gap-2 px-2 text-blue-500">
          ✨ Mới nhất
        </span>
      ),
    },
  ];

  return (
    <section className="py-8 sm:py-12 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-1">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-gray-600">{subtitle}</p>
        </div>

        <div className="mb-6">
          <CustomTabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            className="mx-auto max-w-lg"
          />
        </div>

        {loading ? (
          <CustomLoadingSpinner />
        ) : (
          <>
            {displayProducts.length === 0 ? (
              <div className="text-center py-12 text-gray-500 border border-dashed border-gray-200 rounded-xl bg-white">
                <p>Không có sản phẩm nào để hiển thị trong mục này.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {displayProducts.map((product: PublicProductListItemDTO) => {
                  const firstVariantId = product.variants?.length
                    ? product.variants[0].id
                    : null;
                  const isWishlisted = firstVariantId
                    ? wishlistMap.get(firstVariantId) || false
                    : false;

                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isWishlisted={isWishlisted}
                    />
                  );
                })}
              </div>
            )}

            {canLoadMore && (
              <div className="text-center mt-8">
                <CustomButton
                  type="default"
                  loading={loadingMore}
                  onClick={handleLoadMore}
                  className="px-8 h-12 border-2 border-gray-500 text-orange-600 hover:bg-orange-50 rounded-lg font-semibold"
                >
                  {loadingMore ? "Đang tải..." : "Xem thêm sản phẩm"}
                </CustomButton>
              </div>
            )}

            <div className="text-center mt-6">
              <Link href="/products">
                <CustomButton
                  type="primary"
                  icon={<ShoppingCart className="w-4 h-4" />}
                  className={cn(
                    " bg-linear-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 ",
                    "border-0 rounded-full shadow-md font-semibold text-sm px-6 h-10"
                  )}
                >
                  Xem tất cả sản phẩm
                </CustomButton>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ProductShowcase;
