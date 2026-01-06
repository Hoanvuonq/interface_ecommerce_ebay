"use client";

import { formatPrice } from "@/hooks/useFormatPrice";
import { CheckCircle2, Truck } from "lucide-react";

interface TotalAmountCheckoutListProps {
  originalShopPrice: number;
  finalShopTotal: number;
  totalDiscount: number;
  productOrOrderDiscount: number;
  shipDiscount: number;
}
export const TotalAmountCheckoutList = ({
  originalShopPrice,
  finalShopTotal,
  totalDiscount,
  productOrOrderDiscount,
  shipDiscount,
}: TotalAmountCheckoutListProps) => {
  return (
    <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex justify-between items-end">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Tổng shop
        </span>
        {productOrOrderDiscount > 0 && (
          <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 size={12} /> Giảm đơn hàng: -
            {formatPrice(productOrOrderDiscount)}
          </p>
        )}
        {shipDiscount > 0 && (
          <p className="text-[10px] text-blue-600 font-bold flex items-center gap-1">
            <Truck size={12} /> Giảm vận chuyển: -{formatPrice(shipDiscount)}
          </p>
        )}
      </div>
      <div className="text-right">
        {totalDiscount > 0 && (
          <p className="text-[10px] text-slate-400 line-through mb-1">
            {formatPrice(originalShopPrice)}
          </p>
        )}
        <span className="text-2xl font-bold text-slate-900 tracking-tighter">
          {formatPrice(finalShopTotal)}
        </span>
      </div>
    </div>
  );
};
