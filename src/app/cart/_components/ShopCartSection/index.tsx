"use client";

import React, { useMemo } from "react";
import {
  Store,
  CheckCircle2,
  Star,
  ChevronRight,
  Tag as TagIcon,
} from "lucide-react";
import type { ShopDto } from "@/types/cart/cart.types";
import { CartItem } from "../CartItems";
import { VoucherComponents } from "@/components/voucherComponents";
import { useAppDispatch } from "@/store/store";
import { toggleShopSelectionLocal } from "@/store/theme/cartSlice";
import { cn } from "@/utils/cn";
import { ShopCartSectionProps } from "../../_types/shop";
import { formatPriceFull } from "@/hooks/useFormatPrice";

export const ShopCartSection: React.FC<ShopCartSectionProps> = ({
  shop,
  etag,
  onToggleShopSelection,
}) => {
  const dispatch = useAppDispatch();

  const handleShopCheckboxChange = () => {
    if (onToggleShopSelection) {
      onToggleShopSelection(shop.shopId);
    } else {
      dispatch(toggleShopSelectionLocal(shop.shopId));
    }
  };

  return (
    <section className="mb-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between px-5 py-4 gap-4 bg-white border-b border-gray-50">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="relative flex items-center justify-center">
            <input
              type="checkbox"
              id={`shop-${shop.shopId}`}
              className={cn(
                " checked:bg-orange-500 checked:border-orange-500 transition-all cursor-pointer",
                "peer appearance-none w-5 h-5 border-2 border-gray-200 rounded-md"
              )}
              checked={shop.allSelected}
              onChange={handleShopCheckboxChange}
            />
            <CheckCircle2
              size={12}
              className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
            />
            {shop.hasSelectedItems && !shop.allSelected && (
              <div className="absolute w-2.5 h-0.5 bg-orange-500 rounded-full" />
            )}
          </div>

          <div className="flex items-center gap-3 min-w-0 group cursor-pointer">
            <div className="relative shrink-0">
              <img
                src={shop.shopLogo || ""}
                alt={shop.shopName}
                className="w-10 h-10 rounded-xl object-cover border border-gray-100 shadow-sm transition-transform group-hover:scale-105"
                onError={(e) => {
                  (
                    e.target as HTMLImageElement
                  ).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    shop.shopName
                  )}&background=f3f4f6&color=6b7280`;
                }}
              />
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-gray-50">
                <Store size={10} className="text-gray-400" />
              </div>
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-gray-900 truncate group-hover:text-orange-500 transition-colors">
                  {shop.shopName}
                </h3>
                <ChevronRight
                  size={14}
                  className="text-gray-300 group-hover:text-orange-400 transition-transform group-hover:translate-x-0.5"
                />
              </div>

              <div className="flex items-center gap-2 mt-0.5">
                {shop.rating && shop.rating > 0 && (
                  <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-50 rounded-md">
                    <Star size={10} className="text-amber-400 fill-amber-400" />
                    <span className="text-[10px] font-bold text-amber-700">
                      {shop.rating.toFixed(1)}
                    </span>
                  </div>
                )}
                {shop.isVerified && (
                  <span className="text-[9px] font-black uppercase tracking-tighter text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                    Đối tác uy tín
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="shrink-0 flex items-center">
          <VoucherComponents
            shopId={shop.shopId}
            shopName={shop.shopName}
            className="w-full sm:w-auto"
          />
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="grid grid-cols-12 px-6 py-3 bg-gray-50/50 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50">
          <div className="col-span-5">Thông tin Sản phẩm</div>
          <div className="col-span-2 text-center">Đơn giá</div>
          <div className="col-span-2 text-center">Số lượng</div>
          <div className="col-span-2 text-center">Thành tiền</div>
          <div className="col-span-1 text-right">Xử lý</div>
        </div>

        <div className="divide-y divide-gray-50 bg-white">
          {shop.items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              etag={etag}
              selected={item.selectedForCheckout}
            />
          ))}
        </div>
      </div>

      <div className="lg:hidden divide-y divide-gray-50 bg-white">
        {shop.items.map((item) => (
          <div
            key={item.id}
            className="p-2 transition-colors active:bg-gray-50"
          >
            <CartItem
              item={item}
              etag={etag}
              selected={item.selectedForCheckout}
              isMobile={true}
            />
          </div>
        ))}
      </div>

      <div className="bg-gray-50/50 border-t border-gray-100 mt-auto">
        {shop.discount > 0 && (
          <div className="px-5 py-2.5 flex justify-between items-center bg-orange-50/40 border-b border-orange-100/50">
            <div className="flex items-center gap-2 text-orange-600">
              <TagIcon size={14} className="fill-orange-50" />
              <span className="text-[11px] font-bold uppercase tracking-tight">
                Cửa hàng giảm giá:
              </span>
            </div>
            <span className="text-sm font-black text-orange-600">
              -{formatPriceFull(shop.discount)}
            </span>
          </div>
        )}

        <div className="px-5 py-4 flex justify-end items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">
              Tạm tính ({shop.items.length} SP)
            </p>
            <p className="text-lg font-black text-gray-900 leading-none tracking-tight">
              {formatPriceFull(shop.total)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
