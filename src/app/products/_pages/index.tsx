"use client";

import { CustomBreadcrumb } from "@/components";
import PageContentTransition from "@/features/PageContentTransition";
import ProductFilters from "../_components/productFilters";
import { ProductFilterValues } from "../_components/productFilters/type";
import ProductList from "../_components/productList";
import {
  Clock,
  Heart,
  Filter,
  Gift,
  Star,
  Trophy,
  LayoutGrid,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import { CustomButton } from "@/components/button";
import { cn } from "@/utils/cn";
import { PriceRange } from "@/components";
import { CardComponents } from "@/components/card";
import { CustomTag } from "@/components/customTag";

const CategorySidebar = dynamic(() => import("@/components/categorySidebar"), {
  ssr: false,
});

type TabView = "all" | "featured" | "new";

export const ProductScreen = () => {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<ProductFilterValues>({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<TabView>("all");
  
  // Stats thực tế nên được lấy từ API hoặc ProductList trả về
  const [stats, setStats] = useState({
    total: 0,
    featured: 156,
    newProducts: 234,
  });

  // Đồng bộ search params từ URL vào state filters
  useEffect(() => {
    const keyword = searchParams.get("keyword") || undefined;
    const categoryId = searchParams.get("categoryId") || undefined;

    setFilters((prev) => ({
      ...prev,
      keyword: keyword || prev.keyword,
      categoryId: categoryId || prev.categoryId,
    }));
  }, [searchParams]);

  // Handler khi nhấn vào Tag phổ biến
  const handleTagClick = (tag: string) => {
    setFilters((prev) => ({ ...prev, keyword: tag }));
    // Cuộn lên đầu danh sách sản phẩm nếu cần
  };

  const tabItems = [
    { key: "all", label: "Tất cả", icon: <LayoutGrid className="w-4 h-4" /> },
    { key: "featured", label: "Nổi bật", icon: <Trophy className="w-4 h-4" /> },
    { key: "new", label: "Hàng mới", icon: <Gift className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-white">
      <PageContentTransition>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <CustomBreadcrumb
              items={[
                { title: "Trang chủ", href: "/" },
                { title: "Sản phẩm", href: "" },
              ]}
            />
            <div className="flex items-center gap-3">
              <CustomTag icon={<Clock className="w-3.5 h-3.5" />} color="blue">
                Mới cập nhật
              </CustomTag>
              <CustomTag icon={<Heart className="w-3.5 h-3.5" />} color="red">
                {stats.featured} Yêu thích
              </CustomTag>
            </div>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-6">
            <CustomButton
              variant="dark"
              icon={<Filter className="w-5 h-5" />}
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full shadow-lg h-12 rounded-2xl"
            >
              {showMobileFilters ? "Đóng bộ lọc" : "Lọc sản phẩm"}
            </CustomButton>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {/* Sidebar Desktop */}
            <div className="lg:col-span-1 xl:col-span-1 hidden lg:block space-y-6">
              <div className="sticky top-24 space-y-6">
                <CategorySidebar />
                <PriceRange filters={filters} setFilters={setFilters} />

                <CardComponents
                  className="p-4"
                  title={
                    <div className="flex items-center gap-2 font-bold text-gray-800">
                      <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                      <span>Tags phổ biến</span>
                    </div>
                  }
                >
                  <div className="flex flex-wrap gap-2 pt-4">
                    {["Điện thoại", "Laptop", "Tablet", "Tai nghe", "Sạc dự phòng"].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        className={cn(
                          "text-xs px-3 py-1.5 cursor-pointer rounded-full transition-all border",
                          filters.keyword === tag 
                            ? "bg-orange-500 text-white border-orange-500" 
                            : "bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-600"
                        )}
                        onClick={() => handleTagClick(tag)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </CardComponents>

                <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-6 text-white shadow-xl shadow-orange-200/50 relative overflow-hidden group">
                   <div className="relative z-10">
                      <Heart className="w-10 h-10 mb-4 opacity-80 group-hover:scale-110 transition-transform" />
                      <h3 className="font-bold text-lg mb-1 text-white">Hỗ trợ mua sắm</h3>
                      <p className="text-orange-50 text-sm mb-4">Gặp khó khăn? Chúng tôi luôn sẵn sàng hỗ trợ 24/7.</p>
                      <CustomButton className="w-full bg-white text-orange-600 hover:bg-orange-50 border-0 font-bold h-10">
                        Liên hệ ngay
                      </CustomButton>
                   </div>
                   <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3 xl:col-span-4 space-y-6">
              {/* Mobile Filter Dropdown */}
              {showMobileFilters && (
                <div className="lg:hidden animate-in slide-in-from-top-4 duration-300">
                  <CardComponents className="p-4 mb-4 border-orange-100 bg-orange-50/30">
                    <CategorySidebar />
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <PriceRange filters={filters} setFilters={setFilters} />
                    </div>
                  </CardComponents>
                </div>
              )}

              {/* Tabs navigation */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex overflow-x-auto no-scrollbar border-b border-gray-100">
                  {tabItems.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setActiveTab(item.key as TabView)}
                      className={cn(
                        "flex-1 cursor-pointer flex items-center justify-center gap-2 py-4 px-6 text-sm font-bold transition-all min-w-max",
                        activeTab === item.key
                          ? "text-orange-600 border-b-2 border-orange-600 bg-orange-50/50"
                          : "text-gray-500 border-b-2 border-transparent hover:text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                </div>
                
                {/* Product Filters Area (Inside Card or Below) */}
                <div className="p-4 sm:p-6 bg-white">
                  {activeTab === "all" && (
                    <ProductFilters
                      value={filters}
                      onChange={setFilters}
                      onSearch={() => {}}
                      autoSearch={true}
                      showAdvanced={false}
                    />
                  )}
                </div>
              </div>

              {/* Final Product List */}
              <div className="min-h-[400px]">
                 <ProductList 
                    filters={filters} 
                    endpoint={activeTab} 
                 />
              </div>
            </div>
          </div>
        </main>
      </PageContentTransition>
    </div>
  );
};