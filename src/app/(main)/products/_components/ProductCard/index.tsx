"use client";

import {
  categoryIcons,
  getStandardizedKey,
  ICON_BG_COLORS,
} from "@/app/(main)/(home)/_types/categories";
import { AddToWishlistModal } from "@/app/(main)/wishlist/_components/AddToWishlistModal";
import { CustomButton } from "@/components/button";
import { formatPrice } from "@/hooks/useFormatPrice";
import { publicProductService } from "@/services/products/product.service";
import type {
  PublicProductDetailDTO,
  PublicProductListItemDTO,
} from "@/types/product/public-product.dto";
import { requireAuthentication } from "@/utils/cart/cart-auth.utils";
import { cn } from "@/utils/cn";
import {
  resolveMediaUrl as resolveMediaUrlHelper,
  resolveVariantImageUrl as resolveVariantImageUrlHelper,
} from "@/utils/products/media.helpers";
import {
  Heart,
  Loader2,
  ShoppingBag,
  ShoppingCart,
  Star,
  Zap,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useCart } from "../../_hooks/useCart";

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
  const { quickAddToCart } = useCart();
  const [addingToCart, setAddingToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(
    initialIsWishlisted || false,
  );
  const [wishlistModalOpen, setWishlistModalOpen] = useState(false);
  const [productDetail, setProductDetail] =
    useState<PublicProductDetailDTO | null>(null);
  const [loadingProductDetail, setLoadingProductDetail] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (initialIsWishlisted !== undefined) setIsWishlisted(initialIsWishlisted);
  }, [initialIsWishlisted]);

  const isList = viewMode === "list";

  // --- LOGIC NHẬN DIỆN CHIẾN DỊCH (MEGA/FLASH SALE) ---
  const campaignInfo = useMemo(() => {
    const type = (product as any)?.campaignType;
    if (type === "MEGA_SALE")
      return {
        label: "MEGA SALE",
        icon: <Sparkles size={10} />,
        className: "bg-purple-600 shadow-purple-200",
      };
    if (type === "FLASH_SALE")
      return {
        label: "FLASH SALE",
        icon: <Zap size={10} />,
        className: "bg-orange-600 shadow-orange-200",
      };
    return {
      label: "GIẢM GIÁ",
      icon: null,
      className: "bg-red-500 shadow-red-100",
    };
  }, [product]);

  const categoryUI = useMemo(() => {
    const key = getStandardizedKey(product.name);
    return {
      colors: ICON_BG_COLORS[key] || ICON_BG_COLORS["default"],
      emoji: categoryIcons[key] || "📦",
    };
  }, [product.name]);

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
        (v: any) => v?.imageUrl || v?.imageBasePath,
      );
      return resolveVariantImageUrlHelper(withImage, imageSize);
    }
    return null;
  }, [product, imageSize]);

  // --- LOGIC GIỮ NGUYÊN ---
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!requireAuthentication(window.location.pathname)) return;
    setAddingToCart(true);
    try {
      const resp = await publicProductService.getBySlug(
        product.slug || product.id,
      );
      const variant =
        resp.data.variants?.find((v: any) => v.stock > 0) ||
        resp.data.variants?.[0];
      if (!variant) return toast.warning("Sản phẩm hiện không có sẵn");
      await quickAddToCart(variant.id, 1);
    } catch (error) {
      toast.error("Không thể thêm vào giỏ hàng");
    } finally {
      setAddingToCart(false);
    }
  };

  const stockAvailable = useMemo(() => {
    const variants = (product as any).variants;
    if (typeof (product as any).stock === "number")
      return (product as any).stock;
    return Array.isArray(variants)
      ? variants.reduce(
          (acc: number, v: any) => acc + (v.inventory?.stock || v.stock || 0),
          0,
        )
      : 0;
  }, [product]);

  const isOutOfStock = stockAvailable <= 0;
  const discountPercent =
   

  product.comparePrice && product.comparePrice > product.basePrice
      ? Math.round(
          ((product.comparePrice - product.basePrice) / product.comparePrice) *
            100,
        )
      : 0;
 const hasDiscount = !!(product.comparePrice && product.comparePrice > product.basePrice);
  return (
    <>
      <Link
        href={`/products/${product.slug || product.id}`}
        className={cn(
          "group relative flex bg-white rounded-[2rem] border border-slate-100 transition-all duration-500 overflow-hidden",
          "hover:border-orange-200 hover:shadow-[0_20px_40px_-15px_rgba(249,115,22,0.15)]",
          isList ? "flex-row h-44" : "flex-col h-full",
        )}
      >
        {/* IMAGE SECTION - SỬA LỖI HỞ VIỀN BẰNG OBJECT-COVER VÀ BỎ PADDING */}
        <div
          className={cn(
            "relative overflow-hidden bg-slate-50 shrink-0",
            isList
              ? "w-40 h-full border-r border-slate-50"
              : "aspect-square w-full",
          )}
        >
          {imageUrl && !imgError ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className={cn(
                "w-full h-full flex flex-col items-center justify-center gap-2",
                categoryUI.colors.bg,
              )}
            >
              <span className={isList ? "text-2xl" : "text-5xl"}>
                {categoryUI.emoji}
              </span>
              <span
                className={cn(
                  "text-[8px] font-bold uppercase tracking-widest opacity-40",
                  categoryUI.colors.text,
                )}
              >
                Không có ảnh
              </span>
            </div>
          )}

          {/* BADGES CHIẾN DỊCH */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {discountPercent > 0 && (
              <div
                className={cn(
                  "text-white text-[9px] font-black px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg italic tracking-tighter",
                  campaignInfo.className,
                )}
              >
                {campaignInfo.icon} {campaignInfo.label} -{discountPercent}%
              </div>
            )}
            {highlight === "new" && !isList && (
              <div className="bg-blue-600 text-white text-[9px] font-black px-2 py-1 rounded-lg shadow-lg uppercase tracking-widest italic border border-white/20">
                Mới
              </div>
            )}
          </div>

          {/* NÚT THÊM NHANH (GLASSMORPHISM) */}
          {!isList && (
            <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/20 to-transparent hidden sm:block z-10">
              <button
                onClick={handleAddToCart}
                disabled={
                  addingToCart || product.active === false || isOutOfStock
                }
                className={cn(
                  "w-full bg-white/80 backdrop-blur-md py-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-2xl transition-all",
                  "flex items-center justify-center gap-2 hover:bg-orange-500 hover:text-white active:scale-95",
                  isOutOfStock &&
                    "opacity-70 cursor-not-allowed hover:bg-gray-200 grayscale",
                )}
              >
                {addingToCart ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : isOutOfStock ? (
                  "🚫 Hết hàng"
                ) : (
                  <ShoppingBag size={14} strokeWidth={2.5} />
                )}
                {!addingToCart && !isOutOfStock && "THÊM VÀO GIỎ"}
              </button>
            </div>
          )}
        </div>

        {/* CONTENT SECTION - VIỆT HÓA THUẦN */}
        <div
          className={cn(
            "p-4 flex-1 flex flex-col min-w-0",
            isList ? "justify-center" : "justify-between",
          )}
        >
          <div className="flex justify-between items-start mb-1">
            <div className="flex items-center gap-1.5 overflow-hidden pr-6">
              <span className="bg-orange-50 text-orange-600 text-[8px] font-bold px-1.5 py-0.5 rounded border border-orange-100 uppercase shrink-0 italic">
                Cano Store
              </span>
              <span className="text-[11px] text-slate-400 font-bold uppercase truncate italic">
                Chính hãng
              </span>
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setWishlistModalOpen(true);
              }}
              className={cn(
                "p-2 rounded-full transition-all duration-300 active:scale-90",
                isList
                  ? "text-slate-300 bg-slate-50"
                  : "absolute top-3 right-3 bg-white/80 backdrop-blur-md shadow-sm z-20",
              )}
            >
              {loadingProductDetail ? (
                <Loader2 size={14} className="animate-spin" />
              ) : isWishlisted ? (
                <HeartFilled size={16} className="text-red-500" />
              ) : (
                <Heart size={16} className="text-slate-400" />
              )}
            </button>
          </div>

          <h3
            className={cn(
              "font-bold text-slate-800 group-hover:text-orange-500 transition-colors leading-snug mb-3",
              isList ? "text-base" : "text-sm line-clamp-2 h-10",
            )}
          >
            {product.name}
          </h3>

          <div
            className={cn(
              "mt-auto",
              isList && "flex items-end justify-between gap-3",
            )}
          >
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-1">
                <span
                  className={cn(
                    "font-black text-slate-900 tracking-tighter",
                    isList ? "text-xl md:text-2xl" : "text-xl",
                  )}
                >
                  {formatPrice(product.priceMin || product.basePrice)}
                </span>
                {hasDiscount && (
                  <span className="text-[11px] text-slate-400 line-through font-bold">
                    {formatPrice(product.comparePrice!)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 mt-2 pt-2 border-t border-slate-50">
                <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-orange-50 rounded-md">
                  <Star size={10} className="text-orange-500 fill-orange-500" />
                  <span className="text-[10px] font-black text-orange-700 italic">
                    4.5
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  Đã bán 1.2k+
                </span>
                <span
                  className={cn(
                    "text-[10px] font-black uppercase italic ml-auto",
                    isOutOfStock ? "text-red-500" : "text-emerald-500",
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
                    "h-10! px-6! rounded-2xl! text-[11px]! uppercase font-black italic shadow-lg active:scale-95",
                    isOutOfStock &&
                      "bg-slate-200! text-slate-400! cursor-not-allowed!",
                  )}
                  onClick={handleAddToCart}
                  loading={addingToCart}
                  disabled={isOutOfStock || product.active === false}
                  icon={
                    !isOutOfStock && (
                      <ShoppingCart size={14} strokeWidth={2.5} />
                    )
                  }
                >
                  {isOutOfStock ? "Hết hàng" : "Mua Ngay"}
                </CustomButton>
              </div>
            )}
          </div>
        </div>
      </Link>

      <AddToWishlistModal
        open={wishlistModalOpen}
        onCancel={() => setWishlistModalOpen(false)}
        onSuccess={() => setIsWishlisted(true)}
        product={productDetail}
      />
    </>
  );
};
