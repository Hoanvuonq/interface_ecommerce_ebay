"use client";

import type { PublicProductListItemDTO } from "@/types/product/public-product.dto";
import { cn } from "@/utils/cn";
import { resolveMediaUrl } from "@/utils/products/media.helpers";
import { Loader2, Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import React from "react";
import { CardComponents } from "@/components/card";
import { formatPriceFull } from "@/hooks/useFormatPrice";
// Spinner tối giản, hiện đại
const CustomSpinner: React.FC<{ size?: 'small' | 'middle' | 'large' }> = ({ size = 'small' }) => {
    const sizeMap = { small: "w-5 h-5", middle: "w-8 h-8", large: "w-12 h-12" };
    return (
        <div className="flex items-center justify-center py-10">
            <Loader2 className={cn("animate-spin text-orange-500", sizeMap[size])} />
        </div>
    );
};

// Tag "Hết hàng" tinh tế hơn
const SoldOutTag = () => (
    <span className="inline-block text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-400 border border-gray-200 mt-1">
        Hết hàng
    </span>
);

const PLACEHOLDER_IMAGE = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="100%" height="100%" fill="#f5f5f5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#bfbfbf" font-size="16">No image</text></svg>`);

interface FeaturedProductsSidebarProps {
    products: PublicProductListItemDTO[];
    loading?: boolean;
}

export function FeaturedProductsSidebar({ products, loading = false }: FeaturedProductsSidebarProps) {
    const getProductImage = (p: PublicProductListItemDTO) => {
        const media = (p as any).media || []; 
        if (Array.isArray(media) && media.length > 0) {
            const image = media.find((m: any) => m.isPrimary && m.type === "IMAGE") || media.find((m: any) => m.type === "IMAGE") || media[0];
            const url = resolveMediaUrl(image, "_large"); // Dùng ảnh to hơn cho nét
            if (url) return url;
        }
        return PLACEHOLDER_IMAGE;
    };


    return (
        <CardComponents
            title={
                <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-orange-100 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-orange-600" />
                    </div>
                    <span className="font-extrabold text-gray-900 tracking-tight text-lg">Sản phẩm nổi bật</span>
                </div>
            }
            className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 overflow-hidden"
            bodyClassName="p-0" // Xóa padding mặc định để làm list khít hơn
        >
            {loading ? (
                <CustomSpinner size="small" />
            ) : products.length === 0 ? (
                <div className="py-12 text-center">
                    <p className="text-sm text-gray-400 italic">Không có sản phẩm nổi bật.</p>
                </div>
            ) : (
                <div className="divide-y divide-gray-50">
                    {products.slice(0, 6).map((p, index) => {
                        const price = p.basePrice || 0;
                        const comparePrice = (p as any).comparePrice; 
                        const hasDiscount = comparePrice && comparePrice > price;
                        const discountPercent = hasDiscount ? Math.round(((comparePrice! - price) / comparePrice!) * 100) : 0;
                        const productSlug = p.slug || p.id;

                        return (
                            <Link
                                key={p.id}
                                href={`/products/${productSlug}`}
                                className="group flex items-start gap-4 p-4 transition-all duration-300 hover:bg-orange-50/30"
                            >
                                {/* Ảnh sản phẩm với Badge giảm giá */}
                                <div className="relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
                                    <img
                                        src={getProductImage(p)}
                                        alt={p.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                    {hasDiscount && (
                                        <div className="absolute top-0 left-0 bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-br-lg font-black shadow-sm">
                                            -{discountPercent}%
                                        </div>
                                    )}
                                </div>
                                
                                {/* Thông tin sản phẩm */}
                                <div className="flex-1 min-w-0 pt-0.5">
                                    <h4 className="text-[13px] font-bold text-gray-800 line-clamp-2 leading-relaxed group-hover:text-orange-600 transition-colors duration-300">
                                        {p.name}
                                    </h4>
                                    
                                    <div className="mt-2 flex flex-col">
                                        <span className="text-[15px] text-orange-600 font-black">
                                            {formatPriceFull(price)}
                                        </span>
                                        {hasDiscount && (
                                            <span className="text-[11px] text-gray-400 line-through font-medium">
                                                {formatPriceFull(comparePrice)}
                                            </span>
                                        )}
                                    </div>
                                    
                                    {(p as any).active === false && <SoldOutTag />}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
            
            {/* Footer của sidebar nếu cần nút Xem tất cả */}
            <div className="p-4 bg-gray-50/50 border-t border-gray-50 text-center">
                <Link href="/products" className="text-xs font-bold text-gray-500 hover:text-orange-600 transition-colors uppercase tracking-widest">
                    Xem tất cả
                </Link>
            </div>
        </CardComponents>
    );
}