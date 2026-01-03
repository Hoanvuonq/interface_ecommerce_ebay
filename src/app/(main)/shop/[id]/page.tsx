"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import _ from "lodash";
import { 
  Heart, 
  MessageCircle, 
  Store, 
  Filter, 
  ChevronRight, 
  Flame, 
  Search,
  ChevronDown,
  Clock,
  LayoutGrid,
  ExternalLink
} from "lucide-react";

import { publicProductService } from "@/services/products/product.service";
import { getShopDetail } from "@/services/shop/shop.service";
import { CategoryService } from "@/services/categories/category.service";
import { createConversation } from "@/app/(chat)/_services";
import { ConversationType } from "@/app/(chat)/_types/chat.dto";
import { getStoredUserDetail } from "@/utils/jwt";
import { toPublicUrl } from "@/utils/storage/url";

import PageContentTransition from "@/features/PageContentTransition";
import { ProductCard } from "../../products/_components";
import type { PublicProductListItemDTO } from "@/types/product/public-product.dto";
import type { CategoryResponse } from "@/types/categories/category.detail";
import type { ShopDetail } from "../_types/shop.detail.type";

// const CustomerShopChat = dynamic(
//   () => import("@/app/(chat)/_components/CustomerShopChat").then((m) => m.default),
//   { ssr: false }
// );

export default function ShopPage() {
  const { id: shopId } = useParams() as { id: string };
  
  // States
  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState<ShopDetail | null>(null);
  const [products, setProducts] = useState<PublicProductListItemDTO[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(20);
  const [activeTab, setActiveTab] = useState("all");
  const [isFollowing, setIsFollowing] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortBy, setSortBy] = useState("createdDate,desc");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [shopChatOpen, setShopChatOpen] = useState(false);
  const [creatingShopChat, setCreatingShopChat] = useState(false);

  // Load Shop Info
  useEffect(() => {
    const loadShopInfo = async () => {
      if (!shopId) return;
      try {
        setLoading(true);
        const res = await getShopDetail(shopId);
        const data = _.get(res, "data");
        if (_.get(res, "success") && data) {
          setShop({
            shopId: _.get(data, "shopId", shopId),
            shopName: _.get(data, "shopName", "Shop"),
            userId: _.get(data, "userId"),
            username: _.get(data, "username"),
            logoUrl: data.logoUrl ? toPublicUrl(data.logoUrl) : undefined,
            bannerUrl: data.bannerUrl ? toPublicUrl(data.bannerUrl) : undefined,
            description: _.get(data, "description"),
            status: _.get(data, "status", "ACTIVE"),
            createdDate: _.get(data, "createdDate"),
          });
        }
      } catch (err) {
        console.error("Shop load error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadShopInfo();
  }, [shopId]);

  // Load & Flatten Categories using Lodash
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await CategoryService.getAllParents();
        const rawCats = Array.isArray(res) ? res : _.get(res, "data", []);

        const flatten = (cats: CategoryResponse[]): CategoryResponse[] => {
          return _.flatMap(cats, (cat) => {
            if (!cat.active) return [];
            return [cat, ...flatten(_.get(cat, "children", []))];
          });
        };

        setCategories(flatten(rawCats));
      } catch (err) {
        console.error("Category load error:", err);
      }
    };
    loadCategories();
  }, []);

  // Load Products with Lodash Filtering
  useEffect(() => {
    const loadProducts = async () => {
      if (!shopId) return;
      try {
        setLoadingProducts(true);
        const res = await publicProductService.getByShop(shopId, currentPage, pageSize);
        
        if (_.get(res, "success")) {
          let list = _.get(res, "data.content", []);

          // Client-side Filter logic using Lodash
          if (searchKeyword) {
            list = _.filter(list, (p) => 
              _.toLower(p.name).includes(_.toLower(searchKeyword))
            );
          }
          if (selectedCategory) {
            list = _.filter(list, (p) => _.get(p, "category.id") === selectedCategory);
          }

          setProducts(list);
          setTotalProducts(_.get(res, "data.totalElements", 0));
        }
      } catch (err) {
        console.error("Products load error:", err);
      } finally {
        setLoadingProducts(false);
      }
    };
    loadProducts();
  }, [shopId, currentPage, pageSize, searchKeyword, selectedCategory, sortBy]);

  // Chat Logic
  const handleOpenShopChat = useCallback(async () => {
    if (creatingShopChat) return;
    const user = getStoredUserDetail();
    if (!_.get(user, "userId")) return alert("Vui lòng đăng nhập");

    const shopUserId = _.get(shop, "userId");
    if (!shopUserId) return;

    try {
      setCreatingShopChat(true);
      const res = await createConversation({
        conversationType: ConversationType.BUYER_TO_SHOP,
        participantIds: [shopUserId],
        name: _.get(shop, "shopName"),
      });
      if (_.get(res, "success")) setShopChatOpen(true);
    } finally {
      setCreatingShopChat(false);
    }
  }, [creatingShopChat, shop]);

  // Helpers
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const diffDays = Math.floor((new Date().getTime() - date.getTime()) / 86400000);
    if (diffDays < 30) return `${diffDays} ngày trước`;
    return `${Math.floor(diffDays / 30)} tháng trước`;
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
    </div>
  );

  if (!shop) return <div className="p-20 text-center text-gray-500">Không tìm thấy shop</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <PageContentTransition>
        {/* Banner Section */}
        <div className="relative h-48 w-full md:h-72 lg:h-80">
          <img 
            src={shop.bannerUrl || "/placeholder-banner.jpg"} 
            className="h-full w-full object-cover" 
            alt="Banner" 
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Shop Header Card */}
        <div className="mx-auto -mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative group">
                <img 
                  src={shop.logoUrl || "/placeholder-avatar.jpg"} 
                  className="h-24 w-24 rounded-full border-4 border-white shadow-md object-cover md:h-32 md:w-32" 
                  alt="Logo" 
                />
                <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-white" title="Online" />
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-gray-900">{shop.shopName}</h1>
                  <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-600">Mall</span>
                </div>
                
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>Tham gia: {formatDate(shop.createdDate)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <LayoutGrid size={16} />
                    <span>Sản phẩm: {totalProducts}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2 max-w-2xl bg-gray-50 p-2 rounded-lg border-l-4 border-blue-400">
                  {shop.description || "Chào mừng bạn đến với cửa hàng của chúng tôi!"}
                </p>
              </div>

              <div className="flex w-full md:w-auto gap-3">
                <button 
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-2 rounded-lg px-6 py-2.5 font-medium transition-all ${
                    isFollowing 
                      ? "bg-red-50 text-red-500 border border-red-200" 
                      : "bg-white text-gray-700 border border-gray-300 hover:border-red-400 hover:text-red-500"
                  }`}
                >
                  <Heart size={18} fill={isFollowing ? "currentColor" : "none"} />
                  {isFollowing ? "Đang Theo" : "Theo Dõi"}
                </button>
                <button 
                  onClick={handleOpenShopChat}
                  disabled={creatingShopChat}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-2.5 font-medium text-white hover:bg-blue-700 transition-all shadow-md disabled:bg-gray-400"
                >
                  <MessageCircle size={18} />
                  Chat
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Navigation */}
        <div className="sticky top-0 z-40 mt-6 border-b border-gray-200 bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8 overflow-x-auto scrollbar-hide">
              {["all", "products", ..._.map(_.slice(categories, 0, 5), c => `cat-${c.id}`)].map((key) => {
                const label = key === "all" ? "Trang Chủ" : key === "products" ? "Sản Phẩm" : _.find(categories, { id: key.replace("cat-", "") })?.name;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setActiveTab(key);
                      setSelectedCategory(key.startsWith("cat-") ? key.replace("cat-", "") : undefined);
                      setCurrentPage(0);
                    }}
                    className={`whitespace-nowrap py-4 text-sm font-medium transition-all relative ${
                      activeTab === key ? "text-blue-600" : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {label}
                    {activeTab === key && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
                  </button>
                );
              })}
            </div>
            
            <div className="hidden md:flex relative items-center">
               <Search size={16} className="absolute left-3 text-gray-400" />
               <input 
                placeholder="Tìm tại shop..."
                className="bg-gray-100 border-none rounded-full pl-10 pr-4 py-1.5 text-xs focus:ring-2 focus:ring-blue-500 w-64 transition-all"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
               />
            </div>
          </div>
        </div>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="hidden lg:block w-64 space-y-6">
              <div className="rounded-xl bg-white p-5 border border-gray-100 shadow-sm">
                <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4">
                  <Filter size={16} className="text-blue-500" /> DANH MỤC
                </h3>
                <div className="space-y-1">
                  <button 
                    onClick={() => { setSelectedCategory(undefined); setCurrentPage(0); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${!selectedCategory ? "bg-blue-50 text-blue-600 font-bold" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    Tất cả sản phẩm
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedCategory(cat.id); setCurrentPage(0); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${selectedCategory === cat.id ? "bg-blue-50 text-blue-600 font-bold" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Product Grid Area */}
            <section className="flex-1 space-y-6">
              {/* Hot Section (Suggestions) */}
              {activeTab === "all" && !searchKeyword && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Flame className="text-orange-500" size={20} fill="currentColor" />
                    <h2 className="text-lg font-bold tracking-tight text-gray-900 uppercase">Gợi ý cho bạn</h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                    {_.slice(products, 0, 10).map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                  <hr className="border-gray-200" />
                </div>
              )}

              {/* Toolbar */}
              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-400 font-medium">Sắp xếp:</span>
                  <div className="flex gap-2">
                    {["popular", "createdDate,desc", "sold,desc"].map(sort => (
                      <button 
                        key={sort}
                        onClick={() => setSortBy(sort)}
                        className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all ${sortBy === sort ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                      >
                        {sort === "popular" ? "PHỔ BIẾN" : sort === "sold,desc" ? "BÁN CHẠY" : "MỚI NHẤT"}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                   <span className="text-xs text-gray-400 font-mono">{currentPage + 1}/{Math.ceil(totalProducts / pageSize) || 1}</span>
                   <button 
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-30 bg-white"
                   >
                     <ChevronRight className="rotate-180" size={16} />
                   </button>
                   <button 
                    disabled={currentPage >= Math.ceil(totalProducts / pageSize) - 1}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="p-1.5 rounded-lg border border-gray-200 disabled:opacity-30 bg-white"
                   >
                     <ChevronRight size={16} />
                   </button>
                </div>
              </div>

              {/* Grid */}
              {loadingProducts ? (
                <div className="py-20 text-center"><div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" /></div>
              ) : _.isEmpty(products) ? (
                <div className="py-20 text-center text-gray-400 flex flex-col items-center gap-4">
                   <Store size={48} className="opacity-20" />
                   <p>Không tìm thấy sản phẩm nào</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}

              {/* Pagination Footer */}
              {!_.isEmpty(products) && (
                <div className="flex justify-center pt-10">
                   <div className="flex gap-2">
                      {_.range(Math.ceil(totalProducts / pageSize)).map(i => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i)}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === i ? "bg-blue-600 text-white shadow-lg" : "bg-white border border-gray-200 text-gray-500 hover:border-blue-400"}`}
                        >
                          {i + 1}
                        </button>
                      ))}
                   </div>
                </div>
              )}
            </section>
          </div>
        </main>
      </PageContentTransition>

      {/* {shop?.userId && (
        <CustomerShopChat
          open={shopChatOpen}
          onClose={() => setShopChatOpen(false)}
          targetShopId={shop.userId}
          targetShopName={shop.shopName}
        />
      )} */}
    </div>
  );
}