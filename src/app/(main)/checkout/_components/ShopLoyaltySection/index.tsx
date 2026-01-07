"use client";

import React from "react";
import { Gift, Sparkles } from "lucide-react";
import { formatPrice } from "@/hooks/useFormatPrice";

interface ShopLoyaltySectionProps {
  loyalty: any;
}

export const ShopLoyaltySection: React.FC<ShopLoyaltySectionProps> = ({ loyalty }) => {
  return (
    <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-100/50 flex flex-col w-full h-full justify-between transition-all hover:bg-amber-50">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-100 rounded-lg">
              <Gift size={14} className="text-amber-600" />
            </div>
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-tight">
              Điểm thưởng Shop
            </span>
          </div>
          <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full shadow-sm">
            Sẵn có: {loyalty?.availablePoints || 0} đ
          </span>
        </div>

        <p className="text-[11px] text-amber-700/80 italic font-medium leading-relaxed">
          {loyalty?.message || "Chưa có ưu đãi điểm thưởng"}
        </p>
      </div>

      <div className="mt-4 bg-white/60 rounded-xl p-2.5 flex items-center gap-2.5 border border-white">
        <div className="bg-amber-500 rounded-full p-1">
          <Sparkles size={10} className="text-white" />
        </div>
        <span className="text-[10px] font-bold text-gray-600">
          Nhận thêm{" "}
          <b className="text-amber-700 text-xs">
            {formatPrice(loyalty?.expectedPointsEarned || 0)}
          </b>{" "}
          khi mua
        </span>
      </div>
    </div>
  );
};