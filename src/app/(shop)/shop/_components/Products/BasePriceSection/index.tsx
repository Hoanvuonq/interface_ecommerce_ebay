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
        "p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-4",
        className
      )}
    >
      <div>
        <h3 className="text-base font-bold text-gray-900">Giá cơ bản</h3>
        <p className="text-xs text-gray-500 mt-1">
          Giá này sẽ được áp dụng tự động cho tất cả các biến thể (bạn có thể
          chỉnh sửa riêng sau).
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700">
          Giá bán (VNĐ)
        </label>
        <div className="relative">
          <input
            type="text"
            value={value ? value.toLocaleString("vi-VN") : ""}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/[^0-9]/g, "");
              onChange?.(Number(rawValue));
            }}
            placeholder="0"
            className={cn(
              "w-full pl-4 pr-12 py-3 bg-gray-50 border rounded-xl outline-none font-bold text-gray-900 transition-all",
              "focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50",
              error ? "border-red-500 bg-red-50" : "border-gray-200"
            )}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
            ₫
          </div>
        </div>
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      </div>

      <div className="flex gap-3 p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
        <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-600 font-medium leading-relaxed">
          Mẹo: Đặt giá cao hơn giá vốn để đảm bảo lợi nhuận.
        </p>
      </div>
    </div>
  );
};
