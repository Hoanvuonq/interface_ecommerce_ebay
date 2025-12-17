"use client";

import type { PublicProductListItemDTO } from "@/types/product/public-product.dto";
import { cn } from "@/utils/cn";
import { resolveMediaUrl } from "@/utils/products/media.helpers";
import { Loader2, Star } from "lucide-react"; // ✅ Lucide Icons
import Link from "next/link";
import React from "react";
import { CardComponents } from "@/components/card";


// Tái tạo Antd Spin
const CustomSpinner: React.FC<any> = ({ size = 'small' }) => {
    const sizeMap = { small: 4, middle: 6, large: 8 };
    const currentSize = sizeMap[size as keyof typeof sizeMap] || 4;
    return (
        <div className="flex items-center justify-center">
            <Loader2 className={`w-${currentSize} h-${currentSize} animate-spin text-orange-500`} />
        </div>
    );
};

// Tái tạo Antd Tag
const CustomTag: React.FC<any> = ({ children, colorClass, className, ...rest }) => (
    <span
        className={cn(
            "inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-md",
            colorClass,
            className
        )}
        {...rest}
    >
        {children}
    </span>
);


// Placeholder Image SVG
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
      <rect width="100%" height="100%" fill="#f5f5f5"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#bfbfbf" font-size="16">No image</text>
    </svg>`
  );

// ====================================================================
// FEATURED PRODUCTS SIDEBAR
// ====================================================================

interface FeaturedProductsSidebarProps {
    products: PublicProductListItemDTO[];
    loading?: boolean;
}

export function FeaturedProductsSidebar({
    products,
    loading = false,
}: FeaturedProductsSidebarProps) {
    const getProductImage = (p: PublicProductListItemDTO) => {
        // ✅ Khắc phục lỗi Implicit any: ép kiểu khi truy cập media
        const media = (p as any).media || []; 
        if (Array.isArray(media) && media.length > 0) {
            const image =
                media.find((m: any) => m.isPrimary && m.type === "IMAGE") ||
                media.find((m: any) => m.type === "IMAGE") ||
                media[0];
            const url = resolveMediaUrl(image, "_thumb");
            if (url) return url;
        }
        return PLACEHOLDER_IMAGE;
    };

    return (
        <CardComponents
            title={
                <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
                    <span className="font-bold text-gray-800">Sản phẩm nổi bật</span>
                </div>
            }
            className="shadow-xl hover:shadow-2xl transition-shadow"
        >
            {loading || products.length === 0 ? (
                <div className="py-8 text-center">
                    <CustomSpinner size="small" />
                    <p className="mt-2 text-sm text-gray-500">
                        {products.length === 0 && !loading ? "Không có sản phẩm nổi bật." : "Đang tải sản phẩm..."}
                    </p>
                </div>
            ) : (
                <div className="space-y-4 -m-4 p-4">
                    {products.map((p) => {
                        const price = p.basePrice || 0;
                        const comparePrice = (p as any).comparePrice; // ✅ Truy cập comparePrice an toàn hơn
                        const hasDiscount = comparePrice && comparePrice > price;
                        const discountPercent = hasDiscount
                            ? Math.round(((comparePrice! - price) / comparePrice!) * 100)
                            : 0;
                        const productSlug = p.slug || p.id;
                        
                        // Hàm format giá cơ bản (không dùng formatVND phức tạp)
                        const formatPrice = (p: number) => `₫${new Intl.NumberFormat("vi-VN").format(p)}`;

                        return (
                            <Link
                                key={p.id}
                                href={`/products/${productSlug}`}
                                className="flex gap-3 p-2 rounded-xl border border-transparent transition-all duration-300 hover:bg-white hover:shadow-md hover:border-gray-200 group"
                            >
                                {/* Image & Discount Tag */}
                                <div className="relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-100 shadow-md">
                                    <img
                                        src={getProductImage(p)}
                                        alt={p.name}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                                        }}
                                        loading="lazy"
                                    />
                                    {hasDiscount && (
                                        <div className="absolute top-0 left-0 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-br font-bold">
                                            -{discountPercent}%
                                        </div>
                                    )}
                                </div>
                                
                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors">
                                        {p.name}
                                    </h4>
                                    
                                    <div className="mt-1 flex flex-col gap-0.5">
                                        {/* Price */}
                                        <span className="text-sm text-red-600 font-extrabold">
                                            {formatPrice(price)}
                                        </span>
                                        {comparePrice && hasDiscount && (
                                            <span className="text-xs text-gray-400 line-through">
                                                {formatPrice(comparePrice)}
                                            </span>
                                        )}
                                    </div>
                                    
                                    {(p as any).active === false && (
                                        <CustomTag colorClass="bg-gray-200 text-gray-500 mt-1">
                                            Hết hàng
                                        </CustomTag>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </CardComponents>
    );
}