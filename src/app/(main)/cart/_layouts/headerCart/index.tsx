"use client";

import React from "react";
import { RefreshCw, ShoppingCart } from "lucide-react";
import { cn } from "@/utils/cn";

interface HeaderCartProps {
  itemCount: number;
  loading: boolean;
  onRefresh: () => void;
}

export const HeaderCart: React.FC<HeaderCartProps> = ({
  itemCount, 
  loading, 
  onRefresh 
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 mb-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 shadow-inner shrink-0">
          <ShoppingCart size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Giỏ hàng của bạn
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-100">
              {itemCount} sản phẩm
            </span>
            <span className="text-red-700 text-xs font-bold">
              • Kiểm tra kỹ trước khi thanh toán
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onRefresh}
        disabled={loading}
        className="flex items-center justify-center gap-2 px-6 py-2.5 cursor-pointer rounded-xl border border-orange-300 text-orange-600 hover:bg-orange-50 transition-all font-bold text-sm active:scale-95 disabled:opacity-50"
      >
        <RefreshCw
          size={16}
          className={cn(loading && "animate-spin")}
        />
        {loading ? "Đang tải..." : "Làm mới"}
      </button>
    </div>
  );
};