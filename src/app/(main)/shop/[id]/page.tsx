"use client";

import _ from "lodash";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState, useMemo } from "react";

import { createConversation } from "@/app/(chat)/_services";
import { ConversationType } from "@/app/(chat)/_types/chat.dto";
import { useToast } from "@/hooks/useToast";
import { CategoryService } from "../../category/_service/category.service";
import { publicProductService } from "@/services/products/product.service";
import { getShopDetail } from "@/app/(main)/shop/_service/shop.service";
import { getStoredUserDetail } from "@/utils/jwt";
import { toPublicUrl } from "@/utils/storage/url";

// Types
import type { CategoryResponse } from "@/types/categories/category.detail";
import type { PublicProductListItemDTO } from "@/types/product/public-product.dto";
import type { ShopDetail } from "../_types/shop.detail.type";

// Components
import CategorySidebar from "@/components/categorySidebar";
import PageContentTransition from "@/features/PageContentTransition";
import { ShopHeader } from "../_components/ShopHeader";
import ShopNavigation from "../_components/ShopNavigation";
import HomeShopLayout from "../_components/HomeShopLayout";
import ProductListLayout from "../_components/ProductListLayout";

const CustomerShopChat = dynamic(
  () =>
    import("@/app/(chat)/_components/CustomerShopChat").then(
      (mod) => mod.CustomerShopChat,
    ),
  { ssr: false },
);

export default function ShopPage() {
  const { id: shopId } = useParams() as { id: string };
  const { success, warning } = useToast();

  // --- STATE ---
  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState<ShopDetail | null>(null);
  const [products, setProducts] = useState<PublicProductListItemDTO[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeTab, setActiveTab] = useState("all");
  const [isFollowing, setIsFollowing] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortBy, setSortBy] = useState("createdDate,desc");
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [shopChatOpen, setShopChatOpen] = useState(false);

  const pageSize = 20;
  const user = getStoredUserDetail();

  const isShopHome = useMemo(
    () => activeTab === "all" && !searchKeyword && !selectedCategory,
    [activeTab, searchKeyword, selectedCategory],
  );

  // --- FETCH INITIAL DATA ---
  useEffect(() => {
    if (!shopId) return;
    const initData = async () => {
      try {
        setLoading(true);
        const [shopRes, catRes] = await Promise.all([
          getShopDetail(shopId),
          CategoryService.getAllParents(),
        ]);

        const shopData = _.get(shopRes, "data");
        if (shopData) {
          setShop({
            ...shopData,
            logoUrl: shopData.logoUrl
              ? toPublicUrl(shopData.logoUrl)
              : undefined,
            bannerUrl: shopData.bannerUrl
              ? toPublicUrl(shopData.bannerUrl)
              : undefined,
          });
        }

        const rawCats = _.get(catRes, "data", []) as CategoryResponse[];
        const flatten = (list: CategoryResponse[]): CategoryResponse[] =>
          _.flatMap(list, (cat) => [cat, ...flatten(cat.children || [])]);
        setCategories(flatten(rawCats));
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [shopId]);

  // --- FETCH PRODUCTS (Debounced logic for search) ---
  useEffect(() => {
    if (!shopId) return;
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const res = await publicProductService.getByShop(
          shopId,
          currentPage,
          pageSize,
        );
        let list = _.get(res, "data.content", []);

        // Client-side filtering as secondary (Server-side should be preferred if API supports)
        if (searchKeyword) {
          list = _.filter(list, (p) =>
            _.toLower(p.name).includes(_.toLower(searchKeyword)),
          );
        }
        if (selectedCategory) {
          list = _.filter(
            list,
            (p) => _.get(p, "category.id") === selectedCategory,
          );
        }

        if (sortBy === "price_asc") list = _.orderBy(list, ["price"], ["asc"]);
        if (sortBy === "price_desc")
          list = _.orderBy(list, ["price"], ["desc"]);

        setProducts(list);
        setTotalProducts(_.get(res, "data.totalElements", 0));
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [shopId, currentPage, searchKeyword, selectedCategory, sortBy]);

  const handleChat = useCallback(async () => {
    if (!user?.userId)
      return warning("Vui lòng đăng nhập để trao đổi với shop!");
    if (shop?.userId) {
      const res = await createConversation({
        conversationType: ConversationType.BUYER_TO_SHOP,
        participantIds: [shop.userId],
        name: shop.shopName,
      });
      if (_.get(res, "success")) setShopChatOpen(true);
    }
  }, [shop, user, warning]);

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-orange-100 rounded-full" />
          <div className="absolute w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="mt-4  text-gray-400 font-bold text-sm animate-pulse uppercase tracking-widest">
          Đang tải cửa hàng...
        </p>
      </div>
    );

  if (!shop)
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center  text-gray-500 gap-4">
        <div className="text-6xl  text-gray-200 font-bold tracking-tighter italic">
          404
        </div>
        <p className="font-bold uppercase text-xs tracking-[0.3em]">
          Cửa hàng này không còn tồn tại
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <PageContentTransition>
        <ShopHeader
          shop={shop}
          isFollowing={isFollowing}
          onFollow={() => setIsFollowing(!isFollowing)}
          onChat={handleChat}
          totalProducts={totalProducts}
        />

        <ShopNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
        />

        <main className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div
            className={`flex flex-col gap-8 transition-all duration-500 ${!isShopHome ? "lg:flex-row" : ""}`}
          >
            {/* Sidebar chỉ hiện ở tab Sản phẩm hoặc khi có Filter */}
            {!isShopHome && (
              <aside className="hidden lg:block w-72 space-y-6 shrink-0 sticky top-20 pb-4 h-fit animate-in fade-in slide-in-from-left-4 duration-700">
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-2">
                  <CategorySidebar
                    isShop={true}
                    data={_.take(categories, 15)}
                    activeId={selectedCategory}
                    onSelect={(id) => {
                      setSelectedCategory(id);
                      setCurrentPage(0);
                    }}
                  />
                </div>
              </aside>
            )}

            <section className="flex-1">
              <div className="transition-all duration-700 ease-in-out">
                {isShopHome ? (
                  <HomeShopLayout
                    products={products}
                    onViewAll={() => setActiveTab("new")}
                    onSaveVoucher={(code) =>
                      success(`Đã lưu mã ${code} thành công!`)
                    }
                  />
                ) : (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <ProductListLayout
                      products={products}
                      loading={loadingProducts}
                      totalProducts={totalProducts}
                      currentPage={currentPage}
                      pageSize={pageSize}
                      searchKeyword={searchKeyword}
                      selectedCategory={selectedCategory}
                      sortBy={sortBy}
                      onSetSortBy={setSortBy}
                      onPageChange={setCurrentPage}
                      onClearFilter={() => {
                        setSearchKeyword("");
                        setSelectedCategory(undefined);
                      }}
                    />
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
      </PageContentTransition>

      {/* Floating Chat Button (Mobile) or Chat Box */}
      {shop.userId && (
        <CustomerShopChat
          open={shopChatOpen}
          onClose={() => setShopChatOpen(false)}
          targetShopId={shop.userId}
          targetShopName={shop.shopName}
        />
      )}
    </div>
  );
}
