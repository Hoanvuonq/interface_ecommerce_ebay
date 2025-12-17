"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    ShoppingCart,
    Star,
    Heart,
    Loader2,
} from "lucide-react"; 
import { toast } from "sonner";
import type { PublicProductListItemDTO } from "@/types/product/public-product.dto";
import { useRouter } from "next/navigation";
import { publicProductService } from "@/services/products/product.service";
import { useCart } from "../../_hooks/useCart";
import { requireAuthentication } from "@/utils/cart/cart-auth.utils";
import AddToWishlistModal from "@/components/wishlist/AddToWishlistModal";
import { resolveMediaUrl as resolveMediaUrlHelper,
  resolveVariantImageUrl as resolveVariantImageUrlHelper  } from "@/utils/products/media.helpers";
import type { PublicProductDetailDTO } from "@/types/product/public-product.dto";


import { cn } from "@/utils/cn"; 

const HeartFilled = (props: any) => (
    <Heart {...props} fill="currentColor" />
);

export const ProductCard =({
    product,
    highlight,
    isWishlisted: initialIsWishlisted,
    imageSize = "_thumb",
}: {
    product: PublicProductListItemDTO;
    highlight?: "new" | "sale";
    isWishlisted?: boolean;
    imageSize?: "_thumb" | "_medium" | "_large" | "_orig";
}) =>{
    const router = useRouter();
    const { quickAddToCart } = useCart();
    const [addingToCart, setAddingToCart] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted || false);
    const [wishlistModalOpen, setWishlistModalOpen] = useState(false);
    const [productDetail, setProductDetail] = useState<PublicProductDetailDTO | null>(null);
    const [loadingProductDetail, setLoadingProductDetail] = useState(false);

    useEffect(() => {
        if (initialIsWishlisted !== undefined) {
            setIsWishlisted(initialIsWishlisted);
        }
    }, [initialIsWishlisted]);

    const formatPrice = (price: number) => {
        const numPrice = typeof price === "number" ? price : parseFloat(price) || 0;
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(numPrice);
    };

    const resolveMediaUrl = resolveMediaUrlHelper;
    const resolveVariantImageUrl = resolveVariantImageUrlHelper;

    const PLACEHOLDER_DATA_URL =
        'data:image/svg+xml;utf8,' +
        encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
          <rect width="100%" height="100%" fill="#f5f5f5"/>
          <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#bfbfbf" font-size="16">No image</text>
        </svg>`
        );

    const getPrimaryImage = (media: any[]) => {
        // 1) Try media - sử dụng resolveMediaUrl từ media.helpers
        if (Array.isArray(media) && media.length > 0) {
            const image = media.find((m) => m.isPrimary && m.type === 'IMAGE') || media.find((m) => m.type === 'IMAGE') || media[0];
            const url = resolveMediaUrl(image, imageSize);
            if (url) return url;
        }
        // 2) Fallback: try variant image if available in product payload
        const variants = (product as any)?.variants as any[] | undefined;
        if (Array.isArray(variants) && variants.length > 0) {
            const withImage = variants.find(v => v?.imageUrl || (v?.imageBasePath && v?.imageExtension)) || variants[0];
            const url = resolveVariantImageUrl(withImage, imageSize);
            if (url) return url;
        }
        // 3) Final fallback
        return PLACEHOLDER_DATA_URL;
    };

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!requireAuthentication(window.location.pathname)) {
            return;
        }

        setAddingToCart(true);

        try {
            const productDetailResponse = product.slug
                ? await publicProductService.getBySlug(product.slug)
                : await publicProductService.getById(product.id);

            if (!productDetailResponse.data.variants || productDetailResponse.data.variants.length === 0) {
                // ✅ Thay thế message.warning
                toast.warning("Sản phẩm chưa có phiên bản để thêm vào giỏ");
                router.push(`/products/${product.slug || product.id}`);
                return;
            }

            const availableVariant =
                productDetailResponse.data.variants.find(
                    (v: any) => v.stock && v.stock > 0
                ) || productDetailResponse.data.variants[0];

            if (!availableVariant) {
                // ✅ Thay thế message.warning
                toast.warning("Sản phẩm hiện không có sẵn");
                return;
            }

            const success = await quickAddToCart(availableVariant.id, 1);

            if (success) {
                // ✅ Thay thế message.success
                toast.success(`Đã thêm "${product.name}" vào giỏ hàng`);
            } else {
                throw new Error("Failed to add to cart");
            }
        } catch (error: any) {
            console.error("Error adding to cart:", error);

            if (error?.message?.includes("variant")) {
                // ✅ Thay thế message.info
                toast.info("Vui lòng chọn phiên bản sản phẩm");
                router.push(`/products/${product.slug || product.id}`);
            } else {
                // ✅ Thay thế message.error
                toast.error("Không thể thêm vào giỏ hàng. Vui lòng thử lại!");
            }
        } finally {
            setAddingToCart(false);
        }
    };

    const handleAddToWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!requireAuthentication(window.location.pathname)) {
            return;
        }

        setLoadingProductDetail(true);
        try {
            const productDetailResponse = product.slug
                ? await publicProductService.getBySlug(product.slug)
                : await publicProductService.getById(product.id);
            if (!productDetailResponse.data.variants || productDetailResponse.data.variants.length === 0) {
                // ✅ Thay thế message.warning
                toast.warning("Sản phẩm chưa có phiên bản để thêm vào yêu thích");
                return;
            }
            setProductDetail(productDetailResponse.data);
            setWishlistModalOpen(true);
        } catch (error: any) {
            console.error("Error loading product detail:", error);
            // ✅ Thay thế message.error
            toast.error("Không thể tải thông tin sản phẩm");
        } finally {
            setLoadingProductDetail(false);
        }
    };

    const handleWishlistModalSuccess = () => {
        setIsWishlisted(true);
        setWishlistModalOpen(false);
        setProductDetail(null);
    };

    // Calculate discount from comparePrice vs basePrice
    const hasDiscount = !!(
        product.comparePrice && product.comparePrice > product.basePrice
    );
    const discountPercent = hasDiscount
        ? Math.round(
            ((product.comparePrice! - product.basePrice) / product.comparePrice!) *
            100
        )
        : 0;
    const originalPrice = product.comparePrice || product.basePrice;

    // Check promotion and featured status
    const now = new Date();
    const promotedDate = product.promotedUntil ? new Date(product.promotedUntil) : null;
    const isPromoted = promotedDate !== null && promotedDate > now;
    const isFeatured = Boolean(product.isFeatured);

    // --- Tailwind Class Optimization ---

    const cardClasses = cn(
        "group bg-white rounded-sm hover:shadow-lg transition-all duration-200 overflow-hidden",
        "border border-gray-200 h-full flex flex-col relative"
    );

    const wishlistButtonClasses = cn(
        "absolute bottom-1 right-1 bg-white/90 hover:bg-white rounded-full p-1.5 sm:p-2 shadow-md",
        "transition-all duration-200 hover:scale-110 z-20 group/wishlist",
        loadingProductDetail && "opacity-70 cursor-not-allowed"
    );

    const addToCartButtonClasses = cn(
        "hidden sm:flex items-center justify-center w-full h-8 mt-2 text-xs font-semibold rounded-md",
        "bg-orange-600 text-white hover:bg-orange-700 transition-colors duration-200",
        (addingToCart || product.active === false) && "opacity-80 cursor-not-allowed"
    );

    return (
        <>
            <Link
                href={`/products/${product.slug || product.id}`}
                className={cardClasses}
            >
                {/* Image Container */}
                <div className="relative overflow-hidden bg-gray-50 aspect-square">
                    <img
                        alt={product.name}
                        src={getPrimaryImage((product as any).media || [])}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = PLACEHOLDER_DATA_URL;
                        }}
                    />

                    {/* Discount badge - Top Left */}
                    {hasDiscount && (
                        <div className="absolute top-0 left-0 bg-red-600 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded-br-lg shadow-lg border-2 border-white z-10">
                            -{discountPercent}%
                        </div>
                    )}

                    {/* Labels - Top Right */}
                    <div className="absolute top-1 right-1 flex flex-col gap-0.5 z-20">
                        {/* Promoted badge */}
                        {isPromoted && (
                            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded font-bold shadow-lg border border-white/50 whitespace-nowrap">
                                🔥 Đang được đẩy tin
                            </span>
                        )}
                        {/* Featured badge */}
                        {isFeatured && (
                            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded font-bold shadow-lg border border-white/50 whitespace-nowrap">
                                ⭐ Nổi bật
                            </span>
                        )}
                        {/* New badge */}
                        {highlight === "new" && (
                            <span className="bg-red-600 text-white text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded font-bold shadow-sm whitespace-nowrap">
                                Mới
                            </span>
                        )}
                        {/* Out of stock badge */}
                        {product.active === false && (
                            <span className="bg-gray-500 text-white text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded font-bold shadow-sm whitespace-nowrap">
                                Hết hàng
                            </span>
                        )}
                    </div>

                    {/* Mall badge - Bottom Left */}
                    <div className="absolute bottom-1 left-1">
                        <span className="bg-red-600 text-white text-[8px] sm:text-[9px] px-1 sm:px-1.5 py-0.5 rounded font-bold shadow-sm border border-white/30">
                            Mall
                        </span>
                    </div>

                    {/* Wishlist Button - Bottom Right */}
                    <button
                        onClick={handleAddToWishlist}
                        disabled={loadingProductDetail}
                        className={wishlistButtonClasses}
                        aria-label={isWishlisted ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
                    >
                        {loadingProductDetail ? (
                            <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
                        ) : isWishlisted ? (
                            <HeartFilled className="text-red-600 w-4 h-4" /> 
                        ) : (
                            <Heart className="text-gray-600 group-hover/wishlist:text-red-600 w-4 h-4 transition-colors" /> 
                        )}
                    </button>
                </div>

                <div className="p-1.5 sm:p-3 flex-1 flex flex-col">
                    <div className="text-gray-800 hover:text-orange-600 transition-colors line-clamp-2 text-[11px] sm:text-sm leading-tight mb-1 sm:mb-2 flex-1 min-h-[32px] sm:min-h-[40px]">
                        {product.name}
                    </div>

                    {/* Price Section *}
                    <div className="flex items-end gap-1 mb-1">
                        {hasDiscount && (
                            <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                                {formatPrice(originalPrice)}
                            </span>
                        )}
                    </div>

                    <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-[10px] sm:text-xs text-orange-600 font-normal">
                            ₫
                        </span>
                        <span className="text-base sm:text-xl font-medium text-orange-600">
                            {product.basePrice
                                ? new Intl.NumberFormat("vi-VN").format(product.basePrice)
                                : "0"}
                        </span>
                    </div>

                    {/* Discount label */}
                    {hasDiscount && (
                        <div className="flex items-center gap-1 mb-2">
                            <span className="bg-red-600 text-white text-[9px] sm:text-[10px] px-2 py-0.5 rounded font-semibold">
                                Giảm {discountPercent}%
                            </span>
                        </div>
                    )}

                    {/* Rating & Sold */}
                    <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500 mt-auto">
                        <div className="flex items-center gap-0.5">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> {/* ✅ Thay thế StarFilled */}
                            <span>4.5</span>
                        </div>
                        <span>Đã bán 999+</span>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={addingToCart || product.active === false}
                        className={addToCartButtonClasses}
                    >
                        {addingToCart ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-1" />
                        ) : (
                            <ShoppingCart className="w-4 h-4 mr-1" /> // ✅ Thay thế ShoppingCartOutlined
                        )}
                        {addingToCart ? "Đang thêm..." : "Thêm vào giỏ"}
                    </button>
                </div>
            </Link>

            {/* Add to Wishlist Modal - Render outside Link to prevent navigation */}
            <AddToWishlistModal
                open={wishlistModalOpen}
                onCancel={() => {
                    setWishlistModalOpen(false);
                    setProductDetail(null);
                }}
                onSuccess={handleWishlistModalSuccess}
                product={productDetail}
                defaultVariantId={
                    productDetail?.variants && productDetail.variants.length > 0
                        ? productDetail.variants[0].id
                        : undefined
                }
            />
        </>
    );
}