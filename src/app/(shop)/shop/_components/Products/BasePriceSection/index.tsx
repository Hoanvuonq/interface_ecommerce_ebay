"use client";

import { Info } from "lucide-react";
import { cn } from "@/utils/cn"; 

interface BasePriceSectionProps {
  value?: number;
  onChange?: (val: number) => void;
  error?: string;
  className?: string;
}

export const BasePriceSection = ({
  value,
  onChange,
  error,
  className,
}: BasePriceSectionProps) => {
  return (
    <div
      className={cn(
        "p-8 bg-white rounded-4xl border border-orange-100/50 shadow-sm space-y-6",
        className
      )}
    >
      {/* Tiêu đề */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-orange-100 rounded-xl">
           <Info className="w-5 h-5 text-orange-600" />
        </div>
        <div className="space-y-0.5">
          <h3 className="text-lg font-bold text-gray-800 tracking-tight">
            Giá cơ bản
          </h3>
          <p className="text-xs font-medium text-gray-400">
            Giá này sẽ được áp dụng cho tất cả các biến thể nếu bạn không thiết lập riêng.
          </p>
        </div>
      </div>

      {/* Input nhập liệu */}
      <div className="space-y-2">
        <label className="text-[12px] font-bold text-gray-600 ml-1 flex items-center gap-1">
          Giá bán (VNĐ) <span className="text-red-500">*</span>
        </label>
        
        <div className="relative group">
          <input
            type="text"
            value={value ? value.toLocaleString("vi-VN") : ""}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/[^0-9]/g, "");
              onChange?.(Number(rawValue));
            }}
            placeholder="0"
            className={cn(
              "w-full h-14 pl-5 pr-12 bg-gray-50/50 border rounded-2xl outline-none transition-all duration-300",
              "text-lg font-black text-gray-700 placeholder:text-gray-300 placeholder:font-normal",
              "hover:border-orange-200 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10",
              error ? "border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-500/10" : "border-gray-200"
            )}
          />
          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-orange-600 font-black text-lg select-none">
            ₫
          </div>
        </div>

        {error && (
          <p className="text-[11px] text-red-500 font-bold ml-2 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>

      {/* Box mẹo vặt */}
      <div className="flex gap-4 p-5 bg-orange-50/50 border border-orange-100 rounded-3xl">
        <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-white rounded-2xl shadow-sm text-orange-600">
          <Info size={20} strokeWidth={2.5} />
        </div>
        <div className="space-y-1">
          <h4 className="text-[11px] font-black text-orange-700 uppercase tracking-widest">
            Mẹo đặt giá
          </h4>
          <p className="text-xs text-orange-900/70 leading-relaxed font-semibold">
            Nên đặt giá bao gồm cả phí vận chuyển hoặc các chương trình khuyến mãi dự kiến để thu hút khách hàng tốt hơn.
          </p>
        </div>
      </div>
    </div>
  );
};