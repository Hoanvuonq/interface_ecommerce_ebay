"use client";

import { useCart } from "@/app/(main)/products/_hooks/useCart";
import { CustomHasDiscount } from "@/components";
import { formatPrice } from "@/hooks/useFormatPrice";
import { publicProductService } from "@/app/(shop)/shop/products/_services/product.service";
import { requireAuthentication } from "@/utils/cart/cart-auth.utils";
import { cn } from "@/utils/cn";
import { resolveMediaUrl as resolveMediaUrlHelper } from "@/utils/products/media.helpers";
import { motion } from "framer-motion";
import { Heart, Loader2, ShoppingBag, Sparkles, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const HeartFilled = (props: any) => <Heart {...props} fill="currentColor" />;

export const BrandCard = ({
  product,
  isWishlisted: initialIsWishlisted,
}: {
  product: any;
  isWishlisted: boolean;
}) => {
  const { quickAddToCart } = useCart();
  const [addingToCart, setAddingToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);

  useEffect(() => {
    setIsWishlisted(initialIsWishlisted);
  }, [initialIsWishlisted]);

  const imageUrl = useMemo(() => {
    const primaryMedia = product?.media?.find((m: any) => m.isPrimary);
    if (primaryMedia) return resolveMediaUrlHelper(primaryMedia, "_medium");
    const variantWithImg = product?.variants?.find((v: any) => v.imageUrl);
    if (variantWithImg) return resolveMediaUrlHelper(variantWithImg, "_medium");
    return "/placeholder.png";
  }, [product]);

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
        resp.data.variants?.find((v: any) => v.inventory?.stock > 0) ||
        resp.data.variants?.[0];
      if (!variant) {
        toast.warning("Sản phẩm hiện không có sẵn");
        return;
      }
      await quickAddToCart(variant.id, 1);
    } catch (error) {
      toast.error("Không thể thêm vào giỏ hàng");
    } finally {
      setAddingToCart(false);
    }
  };

  const displayPrice = product.priceAfterBestVoucher || product.priceMin;
    const originalPrice = product.priceBeforeDiscount;

  const discountPercent = product.showDiscount;

  return (
    <Link href={`/products/${product.slug || product.id}`} className="block">
      <motion.div
        whileHover={{ y: -4 }}
        className={cn(
          "group relative mt-1 flex flex-col bg-white rounded-4xl border border-gray-100",
          "transition-all duration-500 overflow-hidden shadow-custom",
        )}
      >
        <div className="relative aspect-4/4 w-full overflow-hidden bg-gray-50 dark:bg-gray-800/50 shrink-0">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-1000 group-hover:scale-110 antialiased"
          />

          <button
            className={cn(
              "absolute top-4 right-4 z-20 size-9 flex items-center justify-center",
              "rounded-full bg-white/90 backdrop-blur-md shadow-sm text-gray-400 hover:text-rose-500 transition-all active:scale-75",
            )}
          >
            {isWishlisted ? (
              <HeartFilled size={18} className="text-rose-500" />
            ) : (
              <Heart size={18} />
            )}
          </button>

          <div
            className={cn(
              "absolute inset-x-4 bottom-4 z-20 translate-y-12 opacity-0 group-hover:translate-y-0",
              "group-hover:opacity-100 transition-all duration-500 hidden sm:block",
            )}
          >
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
                <ShoppingBag size={14} />
              )}
              Thêm nhanh
            </button>
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col gap-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-500/10 px-2 py-0.5 rounded-lg border border-orange-100 dark:border-orange-500/20 shadow-sm shadow-orange-100/50">
                <Sparkles
                  size={10}
                  className="text-orange-500 fill-orange-500"
                />
                <span className="text-[9px] font-bold text-orange-600 uppercase tracking-tighter italic">
                  Mall
                </span>
              </div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate">
                {product.shop?.shopName || "Official Store"}
              </span>
            </div>

            <h4 className="text-gray-800 dark:text-white text-sm font-bold uppercase tracking-tight line-clamp-1 group-hover:text-orange-500 transition-colors duration-300">
              {product.name}
            </h4>
          </div>

          <div className="flex items-end justify-between gap-2 mt-auto">
            <div className="flex flex-col">
              <span className="text-orange-500 font-bold text-lg tracking-tighter leading-none">
                {formatPrice(displayPrice)}
              </span>
            </div>

            {discountPercent > 0 && (
              <CustomHasDiscount
                discount={discountPercent}
                size="sm"
                className="mb-0.5 shadow-sm"
              />
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
