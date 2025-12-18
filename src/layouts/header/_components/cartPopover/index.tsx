"use client";

import React, { useEffect, useState } from "react";
import {
  ShoppingCart,
  Package,
  ArrowRight,
  Loader2,
  Zap,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  fetchCart,
  checkoutPreview,
  selectAllItemsLocal,
} from "@/store/theme/cartSlice";
import Link from "next/link";
import { resolveMediaUrl } from "@/utils/products/media.helpers";
import { isAuthenticated } from "@/utils/local.storage";
import { cn } from "@/utils/cn";
import { toast } from "sonner";
import { getStandardizedKey, ICON_BG_COLORS, categoryIcons  } from "@/app/(home)/_types/categories";
import { formatPriceFull } from "@/hooks/useFormatPrice";

interface CartPopoverProps {
  open?: boolean;
}

export const CartPopover: React.FC<CartPopoverProps> = ({ open }) => {
  const dispatch = useAppDispatch();
  const { cart, loading, checkoutLoading } = useAppSelector((state) => state.cart);
  const [checkoutProcessing, setCheckoutProcessing] = useState(false);

  useEffect(() => {
    if (open && !cart && isAuthenticated()) {
      dispatch(fetchCart());
    }
  }, [open, cart, dispatch]);


  const totalItems = cart?.itemCount || 0;
  const totalAmount = cart?.totalAmount || 0;

  const displayItems = cart?.shops
      ?.flatMap((shop) => shop.items)
      ?.slice(0, 5) || [];

  const hasMoreItems = totalItems > 5;

  const handleCheckout = async () => {
    if (!cart) return;
    setCheckoutProcessing(true);
    try {
      dispatch(selectAllItemsLocal());
      const checkoutRequest = {
        shops: cart.shops.map((shop) => ({
          shopId: shop.shopId,
          itemIds: shop.items.map((item) => item.id),
          vouchers: [],
        })),
      };

      const preview = await dispatch(checkoutPreview(checkoutRequest)).unwrap();
      sessionStorage.setItem("checkoutPreview", JSON.stringify(preview));
      sessionStorage.setItem("checkoutRequest", JSON.stringify(checkoutRequest));
      window.location.href = "/checkout";
    } catch (error: any) {
      toast.error("Không thể tạo đơn hàng. Vui lòng thử lại");
    } finally {
      setCheckoutProcessing(false);
    }
  };

  const PLACEHOLDER_IMAGE = "/placeholder-product.png";

  const ProductImage = ({ item }: { item: any }) => {
    const [imgError, setImgError] = useState(false);
    
    const imageUrl = resolveMediaUrl({
      imageBasePath: item.imageBasePath,
      imageExtension: item.imageExtension,
      imageUrl: (item as any).thumbnailUrl || (item as any).imageUrl,
    }, "_thumb");

    const categoryKey = getStandardizedKey(item.productName);
    const categoryUI = ICON_BG_COLORS[categoryKey] || ICON_BG_COLORS['default'];
    const categoryEmoji = categoryIcons[categoryKey] || '📦';

    if (imageUrl && !imgError) {
      return (
        <img
          src={imageUrl}
          alt={item.productName}
          className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
          onError={() => setImgError(true)}
        />
      );
    }

    return (
      <div className={cn(
        "w-full h-full flex items-center justify-center text-xl shadow-inner",
        categoryUI.bg
      )}>
        <span className={cn(categoryUI.text, "filter drop-shadow-sm")}>
          {categoryEmoji}
        </span>
      </div>
    );
  };

  return (
    <div className="w-96 flex flex-col bg-white overflow-hidden shadow-2xl rounded-b-xl border border-gray-100">

      <div className="max-h-100 overflow-y-auto custom-scrollbar bg-white">
        {totalItems === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <Package size={48} className="text-gray-200 mb-3" strokeWidth={1} />
            <p className="text-gray-900 font-bold mb-1 uppercase text-xs">Giỏ hàng trống</p>
            <p className="text-gray-400 text-[11px] mb-6">Bạn chưa có sản phẩm nào</p>
            <Link
              href="/products"
              className="px-8 py-2.5 bg-[#661b1b] text-white text-[11px] font-black rounded shadow-md hover:bg-[#4a1313] transition-all"
            >
              MUA SẮM NGAY
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {displayItems.map((item) => (
              <div key={item.id} className="flex gap-3 p-4 hover:bg-orange-50/20 transition-all group">
                <div className="w-16 h-16 shrink-0 bg-gray-50 border border-gray-100 rounded-lg overflow-hidden">
                  <ProductImage item={item} />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <h4 className="text-[13px] font-bold text-gray-800 line-clamp-1 uppercase group-hover:text-orange-600 transition-colors">
                    {item.productName}
                  </h4>
                  
                  <div className="mt-1 flex flex-col gap-1">
                    <span className="text-[10px] text-gray-400 font-medium italic">
                      {item.variantAttributes || "Phân loại mặc định"}
                    </span>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-[11px] text-gray-500 font-medium uppercase tracking-tighter">
                        {formatPriceFull(item.unitPrice)} <span className="mx-0.5 text-gray-300">×</span> {item.quantity}
                      </p>
                      <p className="text-sm font-black text-orange-600 tracking-tighter">
                        {formatPriceFull(item.totalPrice)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {totalItems > 0 && (
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          {hasMoreItems && (
            <div className="text-center mb-3">
              <span className="text-[10px] text-gray-400 font-bold bg-white px-3 py-0.5 rounded-full border border-gray-100 uppercase">
                CÒN {totalItems - 5} SẢN PHẨM KHÁC
              </span>
            </div>
          )}

          <div className="flex items-center justify-between mb-4 px-1">
            <span className="text-[11px] text-gray-500 font-black uppercase tracking-widest">
              Tổng thanh toán:
            </span>
            <span className="text-xl font-black text-orange-600 tracking-tighter">
              {formatPriceFull(totalAmount)}
            </span>
          </div>

          <div className="flex gap-2">
             <Link
              href="/cart"
              className="flex-1 flex items-center justify-center py-2.5 bg-white border border-gray-200 rounded-lg text-[11px] font-black uppercase text-gray-600 hover:bg-gray-100 transition-all active:scale-95"
            >
              Giỏ hàng
            </Link>
            <button
              onClick={handleCheckout}
              disabled={checkoutProcessing || checkoutLoading}
              className="flex-[1.5] flex items-center justify-center gap-2 py-2.5 bg-orange-500 rounded-lg text-[11px] font-black uppercase text-white hover:bg-orange-600 transition-all shadow-lg shadow-orange-100 active:scale-95 disabled:opacity-50"
            >
              {checkoutProcessing ? <Loader2 size={14} className="animate-spin" /> : "Xác nhận"}
              {!checkoutProcessing && <ArrowRight size={14} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};