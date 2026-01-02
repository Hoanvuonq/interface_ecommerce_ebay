"use client";

import { categoryIcons, getStandardizedKey, ICON_BG_COLORS } from "@/app/(main)/(home)/_types/categories";
import { formatPriceFull } from "@/hooks/useFormatPrice";
import { useAppSelector } from "@/store/store";
import { cn } from "@/utils/cn";
import { resolveMediaUrl } from "@/utils/products/media.helpers";
import { ShoppingBag } from "lucide-react";
import React, { useState } from "react";

export const CartPopoverContent: React.FC = () => {
  const { cart, loading } = useAppSelector((state) => state.cart);
  const totalItems = cart?.itemCount || 0;
  const displayItems = cart?.shops?.flatMap((shop) => shop.items)?.slice(0, 5) || [];
  const hasMoreItems = totalItems > 5;

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
      <div className={cn("w-full h-full flex items-center justify-center text-xl", categoryUI.bg)}>
        <span>{categoryEmoji}</span>
      </div>
    );
  };

  if (totalItems === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <ShoppingBag size={32} className="text-slate-300" strokeWidth={1.5} />
        </div>
        <p className="text-slate-900 font-bold mb-1 uppercase text-[10px] tracking-widest">
          Giỏ hàng đang trống
        </p>
        <p className="text-[11px] text-slate-400 italic">
          Hãy thêm sản phẩm bạn yêu thích nhé!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-slate-50">
      <div className="flex flex-col divide-y divide-slate-50">
        {displayItems.map((item) => (
          <div key={item.id} className="flex gap-3 p-4 hover:bg-white transition-all group">
            <div className="w-14 h-14 shrink-0 border border-slate-100 rounded-xl overflow-hidden bg-white shadow-sm flex items-center justify-center">
              <ProductImage item={item} />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <h4 className="text-[12px] font-bold text-slate-800 truncate leading-snug">
                {item.productName}
              </h4>
              <div className="flex justify-between items-center mt-1.5">
                <span className="text-[11px] text-slate-400 font-medium tracking-tight">
                  {formatPriceFull(item.unitPrice)} <span className="text-[9px]">x</span> {item.quantity}
                </span>
                <span className="text-[12px] font-bold text-(--color-mainColor)">
                  {formatPriceFull(item.totalPrice)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasMoreItems && (
        <div className="p-3 text-center bg-slate-50/50">
          <span className="text-[10px] text-slate-600 font-semibold uppercase">
            Và {totalItems - 5} sản phẩm khác trong giỏ
          </span>
        </div>
      )}
    </div>
  );
};