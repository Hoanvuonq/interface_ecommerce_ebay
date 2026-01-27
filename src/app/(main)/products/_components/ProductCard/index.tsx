"use client";

import { AddToWishlistModal } from "@/app/(main)/wishlist/_components/AddToWishlistModal";
import { CustomHasDiscount } from "@/components";
import { CustomButton } from "@/components/custom/components/customButton";
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
  MapPin,
  Package,
  ShoppingBag,
  ShoppingCart,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { TYPE_CONFIG } from "../../_constants/typeProduct";
import { useCart } from "../../_hooks/useCart";

const HeartFilled = (props: any) => <Heart {...props} fill="currentColor" />;

export const ProductCard = ({
  product,
  highlight,
  isType = "mall",
  isWishlisted: initialIsWishlisted,
  imageSize = "_medium",
  viewMode = "grid",
}: {
  product: PublicProductListItemDTO;
  highlight?: "new" | "sale";
  isType?: "mall" | "flashsale" | "new" | "special";
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
  const currentType = TYPE_CONFIG[isType] || TYPE_CONFIG.mall;

  const imageUrl = useMemo(() => {
    const media = (product as any).media || [];
    if (Array.isArray(media) && media.length > 0) {
      const image =
        media.find((m: any) => m.isPrimary && m.type === "IMAGE") || media[0];
      return resolveMediaUrlHelper(image, imageSize);
    }
    const variants = (product as any)?.variants || [];
    const withImage = variants.find(
      (v: any) => v?.imageUrl || v?.imageBasePath,
    );
    return withImage
      ? resolveVariantImageUrlHelper(withImage, imageSize)
      : null;
  }, [product, imageSize]);

  const shopLocation =
    (product as any)?.shop?.shop_location ||
    (product as any)?.shop?.place ||
    "Việt Nam";

  const stockAvailable = useMemo(() => {
    const variants = (product as any).variants;
    if (Array.isArray(variants) && variants.length > 0) {
      return variants.reduce(
        (acc: number, v: any) => acc + (v.inventory?.stock ?? v.stock ?? 0),
        0,
      );
    }
    return (product as any).stock ?? 0;
  }, [product]);

  const isOutOfStock = stockAvailable <= 0;

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
        resp.data.variants?.find(
          (v: any) => (v.inventory?.stock ?? v.stock ?? 0) > 0,
        ) || resp.data.variants?.[0];
      if (!variant) return toast.warning("Sản phẩm hiện không có sẵn");
      await quickAddToCart(variant.id, 1);
    } catch (error) {
      toast.error("Lỗi thêm vào giỏ");
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!requireAuthentication(window.location.pathname)) return;
    setLoadingProductDetail(true);
    try {
      const resp = await publicProductService.getBySlug(
        product.slug || product.id,
      );
      setProductDetail(resp.data);
      setWishlistModalOpen(true);
    } catch (error) {
      toast.error("Lỗi tải thông tin");
    } finally {
      setLoadingProductDetail(false);
    }
  };

  const displayPrice =
    // product.priceAfterBestVoucher || product.priceMin || product.basePrice;
    // Test lấy giá
    product.priceMin || product.basePrice;
  const originalPrice = product.priceMax || product.basePrice;
  const discountPercent = product.showDiscount || 0;
  const hasDiscount = discountPercent > 0 && originalPrice > displayPrice;

  return (
    <>
      <Link
        href={`/products/${product.slug || product.id}`}
        className={cn(
          "group relative flex bg-white rounded-3xl border border-gray-100 hover:border-orange-200 hover:shadow-custom hover:shadow-orange-500/10 transition-all duration-500 overflow-hidden",
          isList ? "flex-row h-44 md:h-52" : "flex-col h-full",
          isOutOfStock && "grayscale-[0.5]",
        )}
      >
        <div
          className={cn(
            "relative overflow-hidden bg-slate-50 shrink-0",
            isList
              ? "w-40 md:w-52 h-full border-r border-gray-50"
              : "aspect-square w-full",
          )}
        >
          {imageUrl && !imgError ? (
            <Image
              alt={product.name}
              src={imageUrl}
              fill
              sizes={isList ? "200px" : "33vw"}
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              onError={() => setImgError(true)}
              priority={highlight === "new"}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl opacity-20 bg-slate-100">
              📦
            </div>
          )}

          {highlight === "new" && (
            <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-white/90 backdrop-blur-md border border-slate-200 px-2 py-0.5 rounded-lg shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
              <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest">
                New
              </span>
            </div>
          )}

          {!isList && !isOutOfStock && (
            <div className="absolute inset-x-3 bottom-2 translate-y-12 group-hover:translate-y-0 transition-all duration-300 z-20 hidden sm:block">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className={cn(
                  "w-full bg-white/95 backdrop-blur-md py-2.5 rounded-2xl text-[11px] font-bold",
                  "uppercase tracking-wider shadow-2xl flex items-center justify-center gap-2",
                  "transition-all hover:bg-orange-500 hover:text-white active:scale-95",
                )}
              >
                {addingToCart ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <>
                    <ShoppingBag size={14} /> THÊM VÀO GIỎ
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <div
          className={cn(
            "py-4 px-2 flex-1 flex flex-col min-w-0",
            isList ? "justify-center gap-1.5" : "justify-between",
          )}
        >
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <div className="flex items-center gap-1.5 min-w-0">
                <div
                  className={cn(
                    "flex items-center gap-0.5 px-1.5 py-0.5 rounded border text-[9px] font-bold italic uppercase shadow-sm shrink-0",
                    currentType.className,
                  )}
                >
                  {currentType.icon}
                  {currentType.text}
                </div>
                <span className="text-[11px]  text-gray-400 font-bold truncate">
                  {(product as any).shop?.shopName || "CanoX Store"}
                </span>
              </div>
              <button
                onClick={handleAddToWishlist}
                className="p-1.5 rounded-full hover:bg-rose-50  text-gray-300 hover:text-rose-500 transition-all active:scale-75"
              >
                {loadingProductDetail ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : isWishlisted ? (
                  <HeartFilled size={18} className="text-rose-500" />
                ) : (
                  <Heart size={18} />
                )}
              </button>
            </div>

            <h3
              className={cn(
                "font-bold  text-gray-800 group-hover:text-orange-600 transition-colors leading-snug tracking-tight mb-2",
                isList ? "text-lg line-clamp-1" : "text-sm line-clamp-2 h-10",
              )}
            >
              {product.name}
            </h3>

            <div className="flex items-center gap-2 flex-wrap min-h-6">
              <span
                className={cn(
                  "font-bold text-orange-600 tracking-tight",
                  isList ? "text-2xl" : "text-lg",
                )}
              >
                {formatPrice(displayPrice)}
              </span>

              {hasDiscount && <CustomHasDiscount discount={discountPercent} />}
            </div>

            {/* {hasDiscount && (
              <span className="text-[11px]  text-gray-400 line-through font-medium italic block -mt-0.5">
                {formatPrice(originalPrice)}
              </span>
            )} */}
          </div>

          <div className="mt-auto pt-3 border-t border-slate-50 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5 bg-amber-50 px-1.5 py-0.5 rounded-md shrink-0">
                <Star size={10} className="text-amber-500 fill-amber-500" />
                <span className="text-[10px] font-bold text-amber-700">
                  4.8
                </span>
              </div>

              <div className="w-px h-3 bg-slate-200" />

              <span className="text-[10px] font-bold  text-gray-500 tracking-tighter whitespace-nowrap">
                Đã bán 1.2k+
              </span>

              <div className="w-px h-3 bg-slate-200" />

              <div
                className={cn(
                  "flex items-center gap-1 shrink-0",
                  isOutOfStock ? "text-rose-500" : "text-emerald-600",
                )}
              >
                {isOutOfStock ? (
                  <Package size={10} />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                )}
                <span className="text-[9px] font-bold uppercase tracking-tighter">
                  {isOutOfStock
                    ? "HẾT HÀNG"
                    : `KHO: ${stockAvailable.toLocaleString()}`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1  text-gray-400 group-hover:text-orange-500 transition-colors">
              <MapPin size={10} className="shrink-0" />
              <span className="text-[10px] font-bold truncate uppercase tracking-tight opacity-70">
                {shopLocation}
              </span>
            </div>
          </div>

          {isList && (
            <div className="mt-2 hidden sm:block">
              <CustomButton
                variant="dark"
                className={cn(
                  "h-10 px-6 text-[10px] font-bold uppercase tracking-widest rounded-2xl shadow-lg",
                  isOutOfStock && "opacity-50",
                )}
                onClick={handleAddToCart}
                loading={addingToCart}
                disabled={isOutOfStock}
                icon={!isOutOfStock && <ShoppingCart size={14} />}
              >
                {isOutOfStock ? "HẾT HÀNG" : "MUA NGAY"}
              </CustomButton>
            </div>
          )}
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
