"use client";

import { cn } from "@/utils/cn";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { resolveMediaUrl as resolveMediaUrlHelper } from "@/utils/products/media.helpers";
import { Heart, ShoppingBag, Sparkles, Star } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/hooks/useFormatPrice";
import { publicProductService } from "@/services/products/product.service";
import { toast } from "sonner";
import { requireAuthentication } from "@/utils/cart/cart-auth.utils";
import { useCart } from "@/app/(main)/products/_hooks/useCart";

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

  // Lấy ảnh: Ưu tiên ảnh primary trong media, nếu không lấy variant đầu tiên
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
      const resp = await publicProductService.getBySlug(product.slug || product.id);
      const variant = resp.data.variants?.find((v: any) => v.inventory?.stock > 0) || resp.data.variants?.[0];

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

  // Dữ liệu giá từ JSON mới
  const displayPrice = product.priceAfterBestVoucher || product.priceMin;
  const originalPrice = product.priceBeforeDiscount;
  const discountPercent = product.showDiscount;

  return (
    <Link href={`/products/${product.slug || product.id}`}>
      <motion.div
        whileHover={{ y: -6 }}
        className="group h-80 relative flex flex-col bg-white dark:bg-slate-900 rounded-4xl border border-slate-100 dark:border-slate-800 transition-all duration-500 overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] "
      >
        <div className="relative aspect-square w-full overflow-hidden bg-slate-50/50 shrink-0">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />

          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            <div className="bg-slate-900/90 backdrop-blur-md text-white text-[8px] font-black px-2 py-1 rounded-full flex items-center gap-1 uppercase tracking-widest border border-white/20 shadow-lg italic">
              <Sparkles size={10} className="text-yellow-400" /> Mall
            </div>
            {discountPercent > 0 && (
              <div className="bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-lg shadow-lg italic">
                -{discountPercent}%
              </div>
            )}
          </div>

          <button className="absolute top-3 right-3 z-10 size-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm text-slate-400 hover:text-red-500">
            {isWishlisted ? <HeartFilled size={16} className="text-red-500" /> : <Heart size={16} />}
          </button>

          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-10 hidden sm:block">
            <button
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="w-full bg-white/90 backdrop-blur-md py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl transition-all flex items-center justify-center gap-2 hover:bg-orange-500 hover:text-white active:scale-95 disabled:opacity-50"
            >
              {addingToCart ? <div className="size-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" /> : <ShoppingBag size={14} strokeWidth={2.5} />}
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col min-w-0 justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter truncate italic">
              {product.shop?.shopName || "CanoX Official"}
            </span>
            <h4 className="text-slate-800 dark:text-slate-100 text-sm font-bold uppercase tracking-tight line-clamp-1 group-hover:text-orange-500 transition-colors italic">
              {product.name}
            </h4>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-700 dark:text-white font-black text-md tabular-nums tracking-tighter">
                {formatPrice(displayPrice)}
              </span>
              {discountPercent > 0 && (
                <span className="text-[10px] text-slate-400 line-through font-bold opacity-60">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>

            {/* <div className="flex items-center gap-2 pt-2 border-t border-slate-50 dark:border-slate-800">
               <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-orange-50 dark:bg-orange-500/10 rounded-md">
                <Star size={10} className="text-orange-500 fill-orange-500" />
                <span className="text-[9px] font-black text-orange-700 dark:text-orange-400 italic">
                  {product.reviewStatistics?.averageRating?.toFixed(1) || "5.0"}
                </span>
              </div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                Đã bán {product.reviewStatistics?.verifiedPurchaseCount || 0}
              </span>
            </div> */}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};