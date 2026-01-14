"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ShoppingCart, Star, Heart, Loader2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import type {PublicProductListItemDTO, PublicProductDetailDTO } from "@/types/product/public-product.dto";
import { useRouter } from "next/navigation";
import { publicProductService } from "@/services/products/product.service";
import { useCart } from "../../_hooks/useCart";
import { requireAuthentication } from "@/utils/cart/cart-auth.utils";
import { AddToWishlistModal } from "@/app/(main)/wishlist/_components/AddToWishlistModal";
import {
  resolveMediaUrl as resolveMediaUrlHelper,
  resolveVariantImageUrl as resolveVariantImageUrlHelper,
} from "@/utils/products/media.helpers";
import { cn } from "@/utils/cn";
import {
  getStandardizedKey,
  ICON_BG_COLORS,
  categoryIcons,
} from "@/app/(main)/(home)/_types/categories";
import { CustomButton } from "@/components/button";

const HeartFilled = (props: any) => <Heart {...props} fill="currentColor" />;

export const ProductCard = ({
  product,
  highlight,
  isWishlisted: initialIsWishlisted,
  imageSize = "_medium",
  viewMode = "grid",
}: {
  product: PublicProductListItemDTO;
  highlight?: "new" | "sale";
  isWishlisted?: boolean;
  imageSize?: "_thumb" | "_medium" | "_large" | "_orig";
  viewMode?: "grid" | "list";
}) => {
  const router = useRouter();
  const { quickAddToCart } = useCart();
  const [addingToCart, setAddingToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(
    initialIsWishlisted || false
  );
  const [wishlistModalOpen, setWishlistModalOpen] = useState(false);
  const [productDetail, setProductDetail] =
    useState<PublicProductDetailDTO | null>(null);
  const [loadingProductDetail, setLoadingProductDetail] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (initialIsWishlisted !== undefined) {
      setIsWishlisted(initialIsWishlisted);
    }
  }, [initialIsWishlisted]);

  const isList = viewMode === "list";

  // --- CATEGORY UI LOGIC ---
  const categoryUI = useMemo(() => {
    const key = getStandardizedKey(product.name);
    return {
      colors: ICON_BG_COLORS[key] || ICON_BG_COLORS["default"],
      emoji: categoryIcons[key] || "📦",
    };
  }, [product.name]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const imageUrl = useMemo(() => {
    const media = (product as any).media || [];
    if (Array.isArray(media) && media.length > 0) {
      const image =
        media.find((m: any) => m.isPrimary && m.type === "IMAGE") || media[0];
      return resolveMediaUrlHelper(image, imageSize);
    }
    const variants = (product as any)?.variants || [];
    if (Array.isArray(variants) && variants.length > 0) {
      const withImage = variants.find(
        (v: any) => v?.imageUrl || v?.imageBasePath
      );
      return resolveVariantImageUrlHelper(withImage, imageSize);
    }
    return null;
  }, [product, imageSize]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!requireAuthentication(window.location.pathname)) return;

    setAddingToCart(true);
    try {
      const resp = await publicProductService.getBySlug(
        product.slug || product.id
      );
      const variant =
        resp.data.variants?.find((v: any) => v.stock > 0) ||
        resp.data.variants?.[0];

      if (!variant) {
        toast.warning("Sản phẩm hiện không có sẵn");
        return;
      }

      const success = await quickAddToCart(variant.id, 1);
    } catch (error) {
      toast.error("Không thể thêm vào giỏ hàng");
    } finally {
      setAddingToCart(false);
    }
  };
  const stockAvailable = useMemo(() => {
    if (typeof (product as any).stock === "number") {
      return (product as any).stock;
    }
    const variants = (product as any).variants;
    if (Array.isArray(variants) && variants.length > 0) {
      return variants.reduce((acc: number, v: any) => {
        const qty = v.inventory?.stock || v.stock || 0;
        return acc + qty;
      }, 0);
    }
    return 0;
  }, [product]);

  const isOutOfStock = stockAvailable <= 0;

  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault(); 
    e.stopPropagation();

    if (!requireAuthentication(window.location.pathname)) return;

    setLoadingProductDetail(true);
    try {
      const resp = await publicProductService.getBySlug(
        product.slug || product.id
      );
      setProductDetail(resp.data);
      setWishlistModalOpen(true);
    } catch (error) {
      toast.error("Lỗi tải thông tin");
    } finally {
      setLoadingProductDetail(false);
    }
  };

  const hasDiscount = !!(
    product.comparePrice && product.comparePrice > product.basePrice
  );
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.comparePrice! - product.basePrice) / product.comparePrice!) *
          100
      )
    : 0;

  return (
    <>
      <Link
        href={`/products/${product.slug || product.id}`}
        className={cn(
          "group relative flex bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-xl  hover:shadow-orange-500/10 transition-all duration-500 overflow-hidden",
          isList ? "flex-row h-40 md:h-44" : "flex-col h-full"
        )}
      >
        <div
          className={cn(
            "relative overflow-hidden bg-gray-50 shrink-0 transition-all duration-300",
            isList
              ? "w-32 md:w-46 h-full border-r border-gray-50"
              : "aspect-square w-full"
          )}
        >
          {imageUrl && !imgError ? (
            <img
              alt={product.name}
              src={imageUrl}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 antialiased"
              style={{ imageRendering: "auto" }}
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className={cn(
                "w-full h-full flex flex-col items-center justify-center gap-2",
                categoryUI.colors.bg
              )}
            >
              <span className={isList ? "text-2xl" : "text-5xl"}>
                {categoryUI.emoji}
              </span>
              <span
                className={cn(
                  "text-[8px] font-semibold uppercase tracking-widest opacity-40",
                  categoryUI.colors.text
                )}
              >
                No Image
              </span>
            </div>
          )}

          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {hasDiscount && (
              <div className="bg-red-500 text-white text-[8px] md:text-[9px] font-semibold px-1.5 py-0.5 rounded shadow-lg border border-white/20">
                -{discountPercent}%
              </div>
            )}
            {highlight === "new" && !isList && (
              <div className="bg-blue-600 text-white text-[9px] font-semibold px-2 py-1 rounded shadow-lg border border-white/20 uppercase tracking-tighter">
                New
              </div>
            )}
          </div>

          {!isList && (
            <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-linear-to-t from-black/20 to-transparent hidden sm:block">
              <button
                onClick={handleAddToCart}
                disabled={
                  addingToCart || product.active === false || isOutOfStock
                }
                className={cn(
                  "w-full bg-white/90 backdrop-blur-md cursor-pointer hover:bg-orange-500 hover:text-white text-gray-900 ",
                  "py-2 rounded-xl text-[10px] font-semibold uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2",
                  isOutOfStock &&
                    "opacity-70 cursor-not-allowed hover:bg-gray-200 hover:text-gray-500 grayscale"
                )}
              >
                {addingToCart ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : isOutOfStock ? (
                  <span className="text-[10px]">🚫</span>
                ) : (
                  <ShoppingBag size={14} />
                )}
                {isOutOfStock ? "Hết hàng" : "Thêm vào giỏ"}
              </button>
            </div>
          )}
        </div>

        <div
          className={cn(
            "p-3 md:p-4 flex-1 flex flex-col min-w-0",
            isList ? "justify-center" : "justify-between"
          )}
        >
          <div className="flex justify-between items-start mb-1">
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="bg-orange-50 text-(--color-mainColor) text-[8px] font-semibold px-1.5 py-0.5 rounded border border-gray-100 uppercase shrink-0 tracking-tighter">
                Mall
              </span>
              <span className="text-[10px] text-gray-600 font-bold uppercase tracking-tight truncate">
                CaLaTha Store
              </span>
            </div>

            <button
              onClick={handleAddToWishlist}
              className={cn(
                "p-1.5 rounded-full transition-all duration-300 active:scale-90",
                isList
                  ? "text-gray-300 hover:text-red-500"
                  : "absolute top-2 right-2 bg-white/80 backdrop-blur-md shadow-sm hover:bg-white hover:text-red-500 z-20"
              )}
            >
              {loadingProductDetail ? (
                <Loader2 size={14} className="animate-spin" />
              ) : isWishlisted ? (
                <HeartFilled size={isList ? 16 : 14} className="text-red-500" />
              ) : (
                <Heart
                  size={isList ? 16 : 14}
                  className="text-gray-600 group-hover:text-red-500"
                />
              )}
            </button>
          </div>

          <h3
            className={cn(
              "font-bold text-gray-800 group-hover:text-(--color-mainColor) transition-colors leading-snug mb-2",
              isList
                ? "text-sm md:text-base line-clamp-1"
                : "text-sm line-clamp-2 h-10"
            )}
          >
            {product.name}
          </h3>

          <div
            className={cn(
              "mt-auto",
              isList && "flex items-end justify-between gap-3"
            )}
          >
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-0.5">
                <span
                  className={cn(
                    "font-semibold text-(--color-mainColor) tracking-tighter leading-none",
                    isList ? "text-lg md:text-xl" : "text-lg"
                  )}
                >
                  {formatPrice(product.basePrice)}
                </span>
                {hasDiscount && (
                  <span className="text-[10px] text-gray-600 line-through font-medium">
                    {formatPrice(product.comparePrice!)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mt-1">
                {" "}
                <div className="flex items-center gap-0.5">
                  <Star size={10} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-[10px] font-bold text-gray-600">
                    4.5
                  </span>
                </div>
                <span className="text-[10px] font-medium text-gray-600 border-l border-gray-200 pl-2">
                  Đã bán 1.2k+
                </span>
                <span
                  className={cn(
                    "text-[10px] font-medium border-l border-gray-200 pl-2",
                    isOutOfStock ? "text-red-500 font-bold" : "text-green-600"
                  )}
                >
                  {isOutOfStock ? "Hết hàng" : `Kho: ${stockAvailable}`}
                </span>
              </div>
            </div>

            {isList && (
             <div className="hidden sm:block">
        <CustomButton 
            variant="dark" 
            className={cn(
                "h-9! px-4! text-[10px]! uppercase tracking-wider shadow-md",
                isOutOfStock && "bg-gray-300! text-gray-500! cursor-not-allowed! border-gray-300!"
            )}
            onClick={handleAddToCart}
            loading={addingToCart}
            disabled={isOutOfStock || product.active === false}
            icon={!isOutOfStock && <ShoppingCart size={14} />}
        >
            {isOutOfStock ? "Hết hàng" : "Thêm"}
        </CustomButton>
    </div>
            )}
          </div>
        </div>
      </Link>

      <AddToWishlistModal
        open={wishlistModalOpen}
        onCancel={() => {
          setWishlistModalOpen(false);
          setProductDetail(null);
        }}
        onSuccess={() => setIsWishlisted(true)}
        product={productDetail}
      />
    </>
  );
};
