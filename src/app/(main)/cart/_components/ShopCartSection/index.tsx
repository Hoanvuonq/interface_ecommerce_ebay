"use client";

import { Checkbox } from "@/components/checkbox";
import { formatPriceFull } from "@/hooks/useFormatPrice";
import { useAppDispatch } from "@/store/store";
import { toggleShopSelectionLocal } from "@/store/theme/cartSlice";
import { ChevronRight, Star, Store, Tag as TagIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import { ShopCartSectionProps } from "../../_types/shop";
import { CartItem } from "../CartItems";

export const ShopCartSection: React.FC<ShopCartSectionProps> = ({
  shop,
  etag,
  onToggleShopSelection,
}) => {
  const dispatch = useAppDispatch();

  const handleShopCheckboxChange = (e?: React.BaseSyntheticEvent) => {
    e?.stopPropagation();
    if (onToggleShopSelection) {
      onToggleShopSelection(shop.shopId);
    } else {
      dispatch(toggleShopSelectionLocal(shop.shopId));
    }
  };

  return (
    <section className="mb-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between px-4 py-3 gap-4 bg-gray-50/50 border-b border-gray-100">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center"
          >
            <Checkbox
              id={`checkbox-shop-${shop.shopId}`}
              checked={shop.allSelected}
              onChange={handleShopCheckboxChange}
            />
          </div>

          <div className="flex items-center gap-3 min-w-0 group cursor-pointer">
            <div className="relative shrink-0">
              <Image
                src={shop.shopLogo || ""}
                alt={shop.shopName}
                width={32}
                height={32}
                className="md:w-8 w-10 md:h-8 h-10 rounded-lg object-cover border border-gray-100 shadow-sm transition-transform group-hover:scale-105"
                onError={(e) => {
                  (
                    e.target as HTMLImageElement
                  ).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    shop.shopName
                  )}&background=f1f5f9&color=64748b`;
                }}
              />
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-gray-50">
                <Store size={8} className="text-gray-600" />
              </div>
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="md:text-xs text-base font-bold text-gray-700 truncate group-hover:text-orange-600 transition-colors uppercase tracking-tight">
                  {shop.shopName}
                </h3>
                <ChevronRight
                  size={22}
                  className="text-gray-500 group-hover:text-orange-400 transition-transform group-hover:translate-x-0.5"
                />
              </div>

              <div className="flex items-center gap-2 mt-0.5">
                {shop.rating && shop.rating > 0 && (
                  <div className="flex items-center gap-0.5 px-1 py-0.5 bg-amber-50 rounded-md border border-amber-100/50">
                    <Star size={8} className="text-amber-400 fill-amber-400" />
                    <span className="text-[9px] font-bold text-amber-700">
                      {shop.rating.toFixed(1)}
                    </span>
                  </div>
                )}
                {shop.isVerified && (
                  <span className="text-[8px] font-bold uppercase tracking-wider text-blue-500 bg-blue-50 px-1 py-0.5 rounded border border-blue-100">
                    Uy tín
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="grid grid-cols-12 px-6 py-2 bg-gray-50 text-[10px] font-semibold uppercase tracking-widest text-gray-600 border-b border-gray-100">
          <div className="col-span-5">Sản phẩm</div>
          <div className="col-span-2 text-center">Đơn giá</div>
          <div className="col-span-2 text-center">Số lượng</div>
          <div className="col-span-2 text-center">Thành tiền</div>
          <div className="col-span-1 text-right">Xử lý</div>
        </div>

        <div className="divide-y divide-gray-50 bg-white">
          {shop.items.map((item, idx) => (
            <CartItem
              key={`${item.id}-${idx}`}
              item={item}
              etag={etag}
              selected={item.selectedForCheckout}
            />
          ))}
        </div>
      </div>

      <div className="lg:hidden divide-y divide-gray-50 bg-white">
        {shop.items.map((item, idx) => (
          <div
            key={`${item.id}-${idx}`}
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

      <div className="bg-gray-50/30 border-t border-gray-100 mt-auto">
        {shop.discount > 0 && (
          <div className="px-5 py-2 flex justify-between items-center bg-orange-50/30 border-b border-gray-100/30">
            <div className="flex items-center gap-2 text-orange-600">
              <TagIcon size={12} className="fill-orange-50" />
              <span className="text-[10px] font-bold uppercase tracking-tight">
                Shop giảm giá:
              </span>
            </div>
            <span className="text-xs font-bold text-orange-600">
              -{formatPriceFull(shop.discount)}
            </span>
          </div>
        )}

        <div className="px-5 py-3 flex justify-end items-center gap-3">
          <div className="text-right flex items-baseline gap-2">
            <p className="text-[10px] text-gray-600 font-bold uppercase leading-none">
              Tạm tính ({shop.items.length} SP):
            </p>
            <p className="text-2xl font-bold text-(--color-mainColor) leading-none tracking-tight">
              {formatPriceFull(shop.total)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
