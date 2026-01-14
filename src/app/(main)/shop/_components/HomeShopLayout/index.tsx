"use client";

import React from "react";
import _ from "lodash";
import { ChevronRight, Sparkles, TicketPercent } from "lucide-react";
import { cn } from "@/utils/cn";
import { ProductCard } from "@/app/(main)/products/_components";
import { ShopVoucherCard } from "../ShopVoucherCard";
import { VOUCHER_SHOP_DATA } from "../../_constants/voucher";
import type { PublicProductListItemDTO } from "@/types/product/public-product.dto";

interface HomeShopLayoutProps {
  products: PublicProductListItemDTO[];
  onViewAll: () => void;
  onSaveVoucher: (code: string) => void;
}

export default function HomeShopLayout({
  products,
  onViewAll,
  onSaveVoucher,
}: HomeShopLayoutProps) {
  return (
    <div className="animate-in slide-in-from-bottom duration-500 space-y-10 mb-10">
      
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
          <TicketPercent size={150} className="text-(--color-mainColor)" />
        </div>

        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div className="p-2 bg-orange-50 rounded-xl text-(--color-mainColor)">
            <TicketPercent size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-800 uppercase tracking-tight">
            Mã giảm giá Shop
          </h2>
        </div>

        <div
          className={cn(
            "flex gap-4 overflow-x-auto pb-4 pt-1 px-1 custom-scrollbar",
            "snap-x snap-mandatory w-full scroll-smooth"
          )}
        >
          {VOUCHER_SHOP_DATA.map((voucher) => (
            <div key={voucher.id} className="snap-start shrink-0">
              <ShopVoucherCard
                code={voucher.code}
                discountType={voucher.discountType as any}
                value={voucher.value}
                minOrder={voucher.minOrder}
                endDate={voucher.endDate}
                onSave={() => onSaveVoucher(voucher.code)}
              />
            </div>
          ))}
        </div>
      </div>

      {!_.isEmpty(products) && (
        <div>
          <div className="flex items-center gap-3 mb-6 px-1">
            <div className="p-2 bg-yellow-50 rounded-xl text-yellow-600">
              <Sparkles size={24} fill="currentColor" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 uppercase tracking-tight">
              Sản phẩm nổi bật
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {_.map(_.slice(products, 0, 10), (p) => (
              <div key={`featured-${p.id}`} className="relative group">
                <div className="absolute -inset-0.5 bg-linear-to-r from-yellow-300 to-orange-300 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500"></div>
                <div className="relative">
                  <ProductCard product={p} />
                </div>
                <div className="absolute top-3 left-3 z-10">
                  <div className="bg-yellow-400 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                    HOT
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={onViewAll}
              className="flex items-center gap-2 px-8 py-3 bg-white border border-gray-200 text-gray-600 font-bold rounded-full hover:bg-(--color-mainColor) hover:text-white hover:border-transparent hover:shadow-lg transition-all duration-300"
            >
              Xem tất cả sản phẩm <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}