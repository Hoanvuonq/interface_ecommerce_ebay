'use client';

import { CustomBreadcrumb } from "@/components";
import PageContentTransition from "@/features/PageContentTransition";
import ProductFilters from "../_components/productFilters";
import { ProductFilterValues } from "../_components/productFilters/type";
import ProductList from "../_components/productList";
import {
    Clock, Heart, Filter, Flame, Gift, Star, Trophy, LayoutGrid,
} from 'lucide-react'; 
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CustomButton } from "@/components/button"; 
import { cn } from "@/utils/cn"; 
import { PriceRange } from "@/components";
import { CardComponents } from "@/components/card";
const CategorySidebar = dynamic(() => import("@/components/categorySidebar"), {
    ssr: false,
});

type TabView = "all" | "featured" | "new";


const CustomTabs: React.FC<any> = ({ activeKey, onChange, items, className, ...rest }) => (
    <div className={cn("border-b mb-2 border-gray-200", className)} {...rest}>
        <div className="flex flex-wrap -mb-px">
            {items.map((item: any) => (
                <button
                    key={item.key}
                    onClick={() => onChange(item.key)}
                    className={cn(
                        "py-3 px-4 text-sm sm:text-base font-semibold border-b-2 transition-colors duration-200 cursor-pointer focus:ring-0",
                        "focus:outline-none",
                        item.key === activeKey
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    )}
                >
                    {item.label}
                </button>
            ))}
        </div>
    </div>
);

const CustomTag: React.FC<any> = ({ icon: Icon, color, children, className, ...rest }) => {
    const safeColor: string = color || 'gray';

    const colorClasses: string = ({
        blue: "bg-blue-100 text-blue-800 border-blue-300",
        red: "bg-red-100 text-red-800 border-red-300",
        green: "bg-green-100 text-green-800 border-green-300",
        yellow: "bg-yellow-100 text-yellow-800 border-yellow-300",
        purple: "bg-purple-100 text-purple-800 border-purple-300",
        gray: "bg-gray-100 text-gray-800 border-gray-300",
    } as Record<string, string>)[safeColor] || "bg-gray-100 text-gray-800 border-gray-300";

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 text-xs sm:text-sm font-bold py-1 px-2 rounded-lg border cursor-default",
                colorClasses,
                className
            )}
            {...rest}
        >
            {Icon && React.cloneElement(Icon, { className: "w-3 h-3" })}
            {children}
        </span>
    );
};

export const ProductScreen = () => {
    const searchParams = useSearchParams();
    const [filters, setFilters] = useState<ProductFilterValues>({}); 
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [activeTab, setActiveTab] = useState<TabView>("all");
    const [stats, setStats] = useState({
        total: 1234,
        featured: 156,
        newProducts: 234,
    });

    useEffect(() => {
        const keyword = searchParams.get("keyword") || undefined;
        const categoryId = searchParams.get("categoryId") || undefined;

        setFilters((prev: ProductFilterValues) => ({
            ...prev,
            keyword,
            categoryId,
        }));
    }, [searchParams]);


    const tabItems = [
        {
            key: "all",
            label: (
                <span className="flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4" /> 
                    Tất cả
                </span>
            ),
        },
        {
            key: "featured",
            label: (
                <span className="flex items-center gap-2">
                    <Trophy className="w-4 h-4" /> 
                    Nổi bật
                </span>
            ),
        },
        {
            key: "new",
            label: (
                <span className="flex items-center gap-2">
                    <Gift className="w-4 h-4" /> 
                    Hàng mới
                </span>
            ),
        },
    ];


    return (
        <div className="min-h-screen bg-gray-50">
            <PageContentTransition>
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                        <CustomBreadcrumb
                            items={[
                                { title: "Trang chủ", href: "/" },
                                { title: "Sản phẩm", href: "" },
                            ]}
                        />
                        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                            <CustomTag
                                icon={<Clock className="w-4 h-4" />}
                                color="blue"
                            >
                                Cập nhật: Hôm nay
                            </CustomTag>
                            <CustomTag
                                icon={<Heart className="w-4 h-4" />}
                                color="red"
                            >
                                {stats.featured} Yêu thích
                            </CustomTag>
                        </div>
                    </div>

                    <div className="lg:hidden mb-4">
                        <CustomButton
                            type="primary"
                            icon={<Filter className="w-5 h-5" />}
                            onClick={() => setShowMobileFilters(!showMobileFilters)}
                            className="w-full !h-12 !text-lg"
                        >
                            {showMobileFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
                        </CustomButton>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        <div className="lg:col-span-1 xl:col-span-1 hidden lg:block">
                            <div className="sticky top-24 space-y-6">
                                 <CategorySidebar />
                                  <PriceRange filters={filters} setFilters={setFilters} />

                                <CardComponents
                                    title={
                                        <div className="flex items-center gap-2">
                                            <Star className="w-4 h-4 text-yellow-500" />
                                            <span>Tags phổ biến</span>
                                        </div>
                                    }
                                >
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            "Điện thoại", "Laptop", "Tablet", "Phụ kiện",
                                            "Tai nghe", "Sạc dự phòng",
                                        ].map((tag) => (
                                            <span
                                                key={tag}
                                                className="cursor-pointer text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
                                                onClick={() => setFilters({ ...filters, keyword: tag })}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </CardComponents>

                                <CardComponents className="bg-gradient-to-br from-blue-100 to-indigo-100 border-none shadow-lg !p-6">
                                    <div className="text-center">
                                        <Heart className="w-10 h-10 text-blue-600 mb-2 mx-auto" />
                                        <h3 className="font-bold text-lg mb-2 text-gray-800">Hỗ trợ mua sắm</h3>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Luôn sẵn sàng hỗ trợ bạn
                                        </p>
                                        <CustomButton type="primary" className="w-full !h-10 cursor-pointer">
                                            Liên hệ ngay
                                        </CustomButton>
                                    </div>
                                </CardComponents>
                            </div>
                        </div>

                        <div className="lg:col-span-3 xl:col-span-4 space-y-6 flex flex-col gap-4">
                            {showMobileFilters && (
                                <div className="lg:hidden">
                                    <CardComponents className="mb-4">
                                        <CategorySidebar />
                                    </CardComponents>
                                </div>
                            )}

                            <CardComponents className="shadow-lg !p-0">
                                <CustomTabs
                                    activeKey={activeTab}
                                    onChange={(key: string) => setActiveTab(key as TabView)}
                                    items={tabItems}
                                    className="px-4"
                                />
                            </CardComponents>

                            {activeTab === "all" && (
                                <ProductFilters
                                    value={filters}
                                    onChange={setFilters}
                                    onSearch={() => {}}
                                    autoSearch={true}
                                    showAdvanced={false}
                                />
                            )}

                            <ProductList filters={filters} endpoint={activeTab} />
                        </div>
                    </div>
                </main>
            </PageContentTransition>
        </div>
    );
};