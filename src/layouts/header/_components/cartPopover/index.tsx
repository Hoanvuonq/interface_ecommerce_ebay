"use client";

import {
  categoryIcons,
  getStandardizedKey,
  ICON_BG_COLORS,
} from "@/app/(main)/(home)/_types/categories";
import { formatPriceFull } from "@/hooks/useFormatPrice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { checkoutPreview, selectAllItemsLocal } from "@/store/theme/cartSlice";
import { cn } from "@/utils/cn";
import { resolveMediaUrl } from "@/utils/products/media.helpers";
import { ArrowRight, Loader2, Package, ShoppingBag } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

interface CartPopoverProps {
  open?: boolean;
}

export const CartPopover: React.FC<CartPopoverProps> = () => {
  const dispatch = useAppDispatch();
  const { cart, loading, checkoutLoading } = useAppSelector(
    (state) => state.cart
  );
  const [checkoutProcessing, setCheckoutProcessing] = useState(false);

  const totalItems = cart?.itemCount || 0;
  const totalAmount = cart?.totalAmount || 0;
  const displayItems =
    cart?.shops?.flatMap((shop) => shop.items)?.slice(0, 5) || [];
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
      sessionStorage.setItem(
        "checkoutRequest",
        JSON.stringify(checkoutRequest)
      );
      window.location.href = "/checkout";
    } catch (error: any) {
      toast.error("Không thể tạo đơn hàng. Vui lòng thử lại");
    } finally {
      setCheckoutProcessing(false);
    }
  };

  const ProductImage = ({ item }: { item: any }) => {
    const [imgError, setImgError] = useState(false);
    const imageUrl = resolveMediaUrl(
      {
        imageBasePath: item.imageBasePath,
        imageExtension: item.imageExtension,
        imageUrl: item.thumbnailUrl || item.imageUrl,
      },
      "_thumb"
    );

    const categoryKey = getStandardizedKey(item.productName);
    const categoryUI = ICON_BG_COLORS[categoryKey] || ICON_BG_COLORS["default"];
    const categoryEmoji = categoryIcons[categoryKey] || "📦";

    if (imageUrl && !imgError) {
      return (
        <img
          src={imageUrl}
          alt={item.productName}
          className="w-full h-full object-contain p-1 transition-transform group-hover:scale-110 duration-500"
          onError={() => setImgError(true)}
        />
      );
    }

    return (
      <div
        className={cn(
          "w-full h-full flex items-center justify-center text-xl",
          categoryUI.bg
        )}
      >
        <span>{categoryEmoji}</span>
      </div>
    );
  };

  if (totalItems === 0 && !loading) {
    return (
      <div className="w-90 flex flex-col items-center justify-center py-10 px-6 text-center bg-white rounded-2xl">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <ShoppingBag size={32} className="text-slate-300" strokeWidth={1.5} />
        </div>
        <p className="text-slate-900 font-bold mb-1 uppercase text-xs tracking-widest">
          Giỏ hàng đang trống
        </p>
        <p className="text-[11px] text-slate-400 mb-6 italic">
          Hãy thêm sản phẩm bạn yêu thích nhé!
        </p>
        <Link
          href="/products"
          className="w-full py-3 bg-orange-500 text-white text-[11px] font-bold rounded-xl shadow-lg shadow-orange-200 hover:bg-orange-700 active:scale-[0.98] transition-all uppercase tracking-widest"
        >
          Mua sắm ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="w-95 flex flex-col bg-white overflow-hidden rounded-2xl border border-slate-100 shadow-2xl font-inter">
      <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
          Sản phẩm mới thêm
        </span>
        <span className="text-[12px] font-semibold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
          {totalItems} món
        </span>
      </div>

      <div className="max-h-80 overflow-y-auto custom-scrollbar divide-y divide-slate-50">
        {displayItems.map((item) => (
          <div
            key={item.id}
            className="flex gap-3 p-3.5 hover:bg-slate-50/80 transition-all group"
          >
            <div className="w-14 h-14 shrink-0 border border-slate-100 rounded-xl overflow-hidden bg-white shadow-sm flex items-center justify-center">
              <ProductImage item={item} />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <h4 className="text-[12px] font-bold text-slate-800 truncate leading-snug">
                {item.productName}
              </h4>
              <div className="flex justify-between items-center mt-1.5">
                <span className="text-[11px] text-slate-400 font-medium tracking-tight">
                  {formatPriceFull(item.unitPrice)}{" "}
                  <span className="text-[10px]">x</span> {item.quantity}
                </span>
                <span className="text-[12px] font-bold text-orange-500">
                  {formatPriceFull(item.totalPrice)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer chứa nút bấm */}
      <div className="p-4 bg-white border-t border-slate-100">
        {hasMoreItems && (
          <div className="text-center mb-4">
            <span className="text-[9px] text-slate-400 font-bold bg-slate-50 px-3 py-1 rounded-full border border-slate-100 uppercase tracking-tighter">
              Và {totalItems - 5} sản phẩm khác trong giỏ
            </span>
          </div>
        )}

        <div className="flex items-center justify-between mb-5 px-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Tổng cộng:
          </span>
          <span className="text-lg font-black text-orange-500 tracking-tight">
            {formatPriceFull(totalAmount)}
          </span>
        </div>

        <div className="grid grid-cols-2">
          <Link href="/cart" className="flex-1">
            <button className="flex items-center w-full justify-center gap-2 py-3 text-[10px] text-slate-600 hover:text-orange-500 hover:bg-orange-50 rounded-2xl transition-all font-semibold uppercase tracking-widest border border-slate-100">
              Giỏ hàng
            </button>
          </Link>

          <button
            onClick={handleCheckout}
            disabled={checkoutProcessing || checkoutLoading}
            className="flex w-full items-center justify-center gap-2 py-3 text-[10px] text-white bg-slate-900 hover:bg-orange-500 rounded-2xl transition-all font-semibold uppercase tracking-widest shadow-lg shadow-slate-200"
          >
            {checkoutProcessing ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <>
                Thanh toán
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
