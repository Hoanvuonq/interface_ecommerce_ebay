"use client";

import _ from "lodash";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

// Services & Utils
import { createConversation } from "@/app/(chat)/_services";
import { ConversationType } from "@/app/(chat)/_types/chat.dto";
import { useToast } from "@/hooks/useToast";
import { CategoryService } from "@/services/categories/category.service";
import { publicProductService } from "@/services/products/product.service";
import { getShopDetail } from "@/services/shop/shop.service";
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
      (mod) => mod.CustomerShopChat
    ),
  { ssr: false }
);

export default function ShopPage() {
  const { id: shopId } = useParams() as { id: string };
  const { success } = useToast();

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
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [shopChatOpen, setShopChatOpen] = useState(false);

  const pageSize = 20;
  const user = getStoredUserDetail();

  const isShopHome = activeTab === "all" && !searchKeyword && !selectedCategory;

  // --- FETCH DATA ---
  useEffect(() => {
    if (!shopId) return;
    const fetchShop = async () => {
      try {
        setLoading(true);
        const res = await getShopDetail(shopId);
        const data = _.get(res, "data");
        if (data) {
          setShop({
            ...data,
            logoUrl: data.logoUrl ? toPublicUrl(data.logoUrl) : undefined,
            bannerUrl: data.bannerUrl ? toPublicUrl(data.bannerUrl) : undefined,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchCats = async () => {
      const res = await CategoryService.getAllParents();
      const raw = _.get(res, "data", []) as CategoryResponse[];
      const flatten = (list: CategoryResponse[]): CategoryResponse[] =>
        _.flatMap(list, (cat) => [cat, ...flatten(cat.children || [])]);
      setCategories(flatten(raw));
    };

    fetchShop();
    fetchCats();
  }, [shopId]);

  // --- FETCH PRODUCTS ---
  useEffect(() => {
    if (!shopId) return;
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const res = await publicProductService.getByShop(
          shopId,
          currentPage,
          pageSize
        );
        let list = _.get(res, "data.content", []);

        if (searchKeyword) {
          list = _.filter(list, (p) =>
            _.toLower(p.name).includes(_.toLower(searchKeyword))
          );
        }
        if (selectedCategory) {
          list = _.filter(
            list,
            (p) => _.get(p, "category.id") === selectedCategory
          );
        }

        if (sortBy === "price_asc") list = _.orderBy(list, ["price"], ["asc"]);
        if (sortBy === "price_desc") list = _.orderBy(list, ["price"], ["desc"]);

        setProducts(list);
        setTotalProducts(_.get(res, "data.totalElements", 0));
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [shopId, currentPage, searchKeyword, selectedCategory, sortBy]);

  const handleChat = useCallback(async () => {
    if (!user?.userId) return alert("Vui lòng đăng nhập để chat!");
    if (shop?.userId) {
      const res = await createConversation({
        conversationType: ConversationType.BUYER_TO_SHOP,
        participantIds: [shop.userId],
        name: shop.shopName,
      });
      if (_.get(res, "success")) setShopChatOpen(true);
    }
  }, [shop, user]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-orange-50">
        <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!shop)
    return (
      <div className="p-20 text-center text-gray-600">Shop không tồn tại</div>
    );

  return (
    <div className="min-h-screen bg-neutral-50">
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

        <main className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
          <div className={`flex flex-col gap-8 ${!isShopHome ? "lg:flex-row" : ""}`}>
            
            {!isShopHome && (
              <aside className="hidden lg:block w-64 space-y-6 shrink-0 sticky top-24 pb-2 h-fit animate-in fade-in slide-in-from-left-4 duration-500">
                <CategorySidebar
                  isShop={true}
                  data={_.take(categories, 15)}
                  activeId={selectedCategory}
                  onSelect={(id) => {
                    setSelectedCategory(id);
                    setCurrentPage(0);
                  }}
                />
              </aside>
            )}

            <section className="flex-1">
              {isShopHome ? (
                <HomeShopLayout 
                  products={products}
                  onViewAll={() => setActiveTab('new')}
                  onSaveVoucher={(code) => success(`Đã lưu mã ${code}`)}
                />
              ) : (
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
              )}
            </section>
          </div>
        </main>
      </PageContentTransition>

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