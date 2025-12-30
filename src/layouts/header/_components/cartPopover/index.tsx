"use client";

import { categoryIcons, getStandardizedKey, ICON_BG_COLORS } from "@/app/(main)/(home)/_types/categories";
import { formatPriceFull } from "@/hooks/useFormatPrice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { checkoutPreview, selectAllItemsLocal } from "@/store/theme/cartSlice";
import { cn } from "@/utils/cn";
import { resolveMediaUrl } from "@/utils/products/media.helpers";
import { ArrowRight, Loader2, Package } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

interface CartPopoverProps {
  open?: boolean;
}

export const CartPopover: React.FC<CartPopoverProps> = () => {
  const dispatch = useAppDispatch();
  const { cart, loading, checkoutLoading } = useAppSelector((state) => state.cart);
  const [checkoutProcessing, setCheckoutProcessing] = useState(false);

  const totalItems = cart?.itemCount || 0;
  const totalAmount = cart?.totalAmount || 0;
  const displayItems = cart?.shops?.flatMap((shop) => shop.items)?.slice(0, 5) || [];
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

  const ProductImage = ({ item }: { item: any }) => {
    const [imgError, setImgError] = useState(false);
    const imageUrl = resolveMediaUrl({
      imageBasePath: item.imageBasePath,
      imageExtension: item.imageExtension,
      imageUrl: item.thumbnailUrl || item.imageUrl,
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
      <div className={cn("w-full h-full flex items-center justify-center text-xl bg-gray-50", categoryUI.bg)}>
        <span>{categoryEmoji}</span>
      </div>
    );
  };

  if (totalItems === 0 && !loading) {
    return (
      <div className="w-[360px] flex flex-col items-center justify-center py-12 px-6 text-center bg-white">
        <Package size={48} className="text-gray-200 mb-3" strokeWidth={1} />
        <p className="text-gray-900 font-bold mb-1 uppercase text-xs">Giỏ hàng trống</p>
        <Link href="/products" className="mt-4 px-8 py-2.5 bg-orange-600 text-white text-[11px] font-semibold rounded shadow-md hover:bg-orange-700 transition-all">
          MUA SẮM NGAY
        </Link>
      </div>
    );
  }

  return (
    <div className="w-[380px] flex flex-col bg-white">
      {/* List items */}
      <div className="max-h-[350px] overflow-y-auto custom-scrollbar divide-y divide-gray-50">
        {displayItems.map((item) => (
          <div key={item.id} className="flex gap-3 p-4 hover:bg-gray-50/50 transition-all group">
            <div className="w-14 h-14 shrink-0 border border-gray-100 rounded-md overflow-hidden bg-gray-50">
              <ProductImage item={item} />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <h4 className="text-[12px] font-bold text-gray-800 truncate uppercase">{item.productName}</h4>
              <div className="flex justify-between items-center mt-1">
                <span className="text-[11px] text-gray-500 font-medium">
                   {formatPriceFull(item.unitPrice)} x {item.quantity}
                </span>
                <span className="text-[12px] font-semibold text-orange-600">
                  {formatPriceFull(item.totalPrice)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-gray-50 border-t border-gray-100">
        {hasMoreItems && (
          <div className="text-center mb-3">
            <span className="text-[9px] text-gray-400 font-bold bg-white px-2 py-0.5 rounded border border-gray-100 uppercase">
              CÒN {totalItems - 5} SẢN PHẨM KHÁC
            </span>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] text-gray-500 font-bold uppercase">Tổng thanh toán:</span>
          <span className="text-lg font-semibold text-orange-600">{formatPriceFull(totalAmount)}</span>
        </div>

        <div className="flex gap-2">
          <Link href="/cart" className="flex-1 py-2.5 bg-white border border-gray-200 rounded text-center text-[10px] font-semibold uppercase text-gray-600 hover:bg-gray-100 transition-all">
            VÀO GIỎ HÀNG
          </Link>
          <button
            onClick={handleCheckout}
            disabled={checkoutProcessing || checkoutLoading}
            className="flex-[1.5] flex items-center justify-center gap-2 py-2.5 bg-orange-600 rounded text-[10px] font-semibold uppercase text-white hover:bg-orange-700 transition-all shadow-md disabled:opacity-50"
          >
            {checkoutProcessing ? <Loader2 size={14} className="animate-spin" /> : "XÁC NHẬN ĐƠN"}
            {!checkoutProcessing && <ArrowRight size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
};