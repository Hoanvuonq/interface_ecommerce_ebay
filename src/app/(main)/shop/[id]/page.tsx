"use client";

import _ from "lodash";
import {
  ChevronRight,
  LayoutGrid,
  Search,
  Sparkles,
  Store,
  TicketPercent,
  ArrowDownWideNarrow, // Icon giá giảm
  ArrowUpWideNarrow,   // Icon giá tăng
  ListFilter,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { createConversation } from "@/app/(chat)/_services";
import { ConversationType } from "@/app/(chat)/_types/chat.dto";
import CategorySidebar from "@/components/categorySidebar";
import PageContentTransition from "@/features/PageContentTransition";
import { useToast } from "@/hooks/useToast";
import { CategoryService } from "@/services/categories/category.service";
import { publicProductService } from "@/services/products/product.service";
import { getShopDetail } from "@/services/shop/shop.service";
import type { CategoryResponse } from "@/types/categories/category.detail";
import type { PublicProductListItemDTO } from "@/types/product/public-product.dto";
import { getStoredUserDetail } from "@/utils/jwt";
import { toPublicUrl } from "@/utils/storage/url";
import { ProductCard } from "../../products/_components";
import { ShopHeader } from "../_components/ShopHeader";
import { ShopVoucherCard } from "../_components/ShopVoucherCard";
import type { ShopDetail } from "../_types/shop.detail.type";
import ShopNavigation from "../_components/ShopNavigation";
import { VOUCHER_SHOP_DATA } from "../_constants/voucher";
import { cn } from "@/utils/cn";

const CustomerShopChat = dynamic(
  () =>
    import("@/app/(chat)/_components/CustomerShopChat").then(
      (mod) => mod.CustomerShopChat
    ),
  { ssr: false }
);

// Cấu hình các nút sắp xếp
const SORT_OPTIONS = [
  { value: "createdDate,desc", label: "Mới nhất" },
  { value: "sold,desc", label: "Bán chạy" },
  { value: "price_asc", label: "Giá thấp đến cao", icon: <ArrowUpWideNarrow size={14} /> },
  { value: "price_desc", label: "Giá cao đến thấp", icon: <ArrowDownWideNarrow size={14} /> },
];

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
      <div className="p-20 text-center text-slate-400">Shop không tồn tại</div>
    );

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
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
              
              {/* === PHẦN TRANG CHỦ SHOP === */}
              {isShopHome ? (
                <div className="animate-in slide-in-from-bottom duration-500 space-y-10 mb-10">
                  {/* Voucher Section */}
                  <div className="bg-white p-6 rounded-3xl border border-orange-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                      <TicketPercent size={150} className="text-[var(--color-mainColor)]" />
                    </div>

                    <div className="flex items-center gap-3 mb-6 relative z-10">
                      <div className="p-2 bg-orange-50 rounded-xl text-[var(--color-mainColor)]">
                        <TicketPercent size={24} />
                      </div>
                      <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">
                        Mã giảm giá Shop
                      </h2>
                    </div>

                    <div
                      className={cn(
                        "flex gap-4 overflow-x-auto pb-4 pt-1 px-1 custom-scrollbar",
                        "snap-x snap-mandatory w-full scroll-smooth"
                      )}
                    >
                      {VOUCHER_SHOP_DATA.map((voucher) => (
                        <div key={voucher.id} className="snap-start shrink-0">
                          <ShopVoucherCard
                            code={voucher.code}
                            discountType={voucher.discountType as any}
                            value={voucher.value}
                            minOrder={voucher.minOrder}
                            endDate={voucher.endDate}
                            onSave={() => success(`Đã lưu mã ${voucher.code}`)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sản phẩm nổi bật */}
                  {!_.isEmpty(products) && (
                    <div>
                      <div className="flex items-center gap-3 mb-6 px-1">
                        <div className="p-2 bg-yellow-50 rounded-xl text-yellow-600">
                          <Sparkles size={24} fill="currentColor" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">
                          Sản phẩm nổi bật
                        </h2>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
                        {_.map(_.slice(products, 0, 10), (p) => (
                          <div key={`featured-${p.id}`} className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500"></div>
                            <div className="relative">
                              <ProductCard product={p} />
                            </div>
                            <div className="absolute top-3 left-3 z-10">
                              <div className="bg-yellow-400 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                                HOT
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-center mt-8">
                        <button 
                           onClick={() => setActiveTab('new')} 
                           className="flex items-center gap-2 px-8 py-3 bg-white border border-gray-200 text-slate-600 font-bold rounded-full hover:bg-[var(--color-mainColor)] hover:text-white hover:border-transparent hover:shadow-lg transition-all duration-300"
                        >
                           Xem tất cả sản phẩm <ChevronRight size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                
                /* === PHẦN DANH SÁCH SẢN PHẨM (CÓ SORT & FILTER) === */
                <>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-50 sticky top-24 z-20">
                    
                    {/* Tiêu đề kết quả */}
                    <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      {searchKeyword ? (
                        <>Kết quả cho "<span className="text-[var(--color-mainColor)]">{searchKeyword}</span>"</>
                      ) : selectedCategory ? (
                        "Sản phẩm theo danh mục"
                      ) : (
                        <>
                          <LayoutGrid size={18} className="text-slate-400" />
                          Tất cả sản phẩm
                        </>
                      )}
                      <span className="text-slate-400 font-normal ml-1">({totalProducts})</span>
                    </h2>

                    {/* --- BUTTONS SORT SCROLLABLE (THAY CHO SELECT) --- */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 custom-scrollbar scroll-smooth snap-x">
                        <div className="flex items-center gap-1.5 shrink-0 pr-2 border-r border-slate-100 mr-2">
                            <ListFilter size={14} className="text-slate-400"/>
                            <span className="text-xs text-slate-500 font-medium hidden sm:block">Sắp xếp:</span>
                        </div>
                        
                        {SORT_OPTIONS.map((option) => {
                            const isActive = sortBy === option.value;
                            return (
                                <button
                                    key={option.value}
                                    onClick={() => setSortBy(option.value)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 border whitespace-nowrap flex items-center gap-1.5 snap-start shrink-0",
                                        isActive 
                                            ? "bg-[var(--color-mainColor)] text-white border-[var(--color-mainColor)] shadow-md shadow-orange-200 transform scale-105"
                                            : "bg-white text-slate-600 border-slate-200 hover:border-[var(--color-mainColor)] hover:text-[var(--color-mainColor)]"
                                    )}
                                >
                                    {option.label}
                                    {option.icon && <span className={isActive ? "text-white" : "text-slate-400"}>{option.icon}</span>}
                                </button>
                            )
                        })}
                    </div>
                  </div>

                  {/* Grid sản phẩm */}
                  {loadingProducts ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                      {_.range(8).map((i) => (
                        <div key={i} className="h-72 bg-white rounded-2xl animate-pulse shadow-sm border border-slate-50" />
                      ))}
                    </div>
                  ) : _.isEmpty(products) ? (
                    <div className="py-32 flex flex-col items-center justify-center text-slate-400">
                      <Store size={64} strokeWidth={1} className="mb-4 opacity-20" />
                      <p className="font-medium">Chưa tìm thấy sản phẩm nào</p>
                      <button
                        onClick={() => {
                          setSearchKeyword("");
                          setSelectedCategory(undefined);
                        }}
                        className="mt-4 text-[var(--color-mainColor)] text-sm hover:underline"
                      >
                        Xóa bộ lọc
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                      {_.map(products, (p) => (
                        <ProductCard key={p.id} product={p} />
                      ))}
                    </div>
                  )}

                  {!_.isEmpty(products) && (
                    <div className="mt-12 flex justify-center gap-2 pb-10">
                      {_.range(Math.min(5, Math.ceil(totalProducts / pageSize))).map((i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i)}
                          className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                            currentPage === i
                              ? "bg-orange-500 text-white shadow-lg shadow-orange-200 scale-110"
                              : "bg-white text-slate-500 hover:bg-orange-50 hover:text-[var(--color-mainColor)] border border-slate-100"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      {Math.ceil(totalProducts / pageSize) > 5 && (
                        <span className="w-9 h-9 flex items-center justify-center text-slate-300">...</span>
                      )}
                      <button
                        disabled={currentPage >= Math.ceil(totalProducts / pageSize) - 1}
                        onClick={() => setCurrentPage((p) => p + 1)}
                        className="w-9 h-9 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-[var(--color-mainColor)] hover:border-orange-200 transition-all disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  )}
                </>
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