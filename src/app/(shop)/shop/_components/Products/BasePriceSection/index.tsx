"use client";

import { Info } from "lucide-react";
import { FormInput } from "@/components";
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
        "p-8 bg-white rounded-4xl border border-gray-100/50 shadow-sm space-y-6",
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
          <p className="text-xs font-medium text-gray-500">
            Giá này sẽ được áp dụng cho tất cả các biến thể nếu bạn không thiết
            lập riêng.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <FormInput
          label="Giá bán (VNĐ)"
          name="price"
          required
          placeholder="0"
          value={value ? value.toLocaleString("vi-VN") : ""}
          error={error}
          className="pr-12 text-lg font-bold h-14"
          onChange={(e) => {
            const rawValue = e.target.value.replace(/[^0-9]/g, "");
            onChange?.(Number(rawValue));
          }}
        />
      </div>

      <div className="flex gap-4 p-5 bg-orange-50/50 border border-gray-100 rounded-3xl">
        <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-white rounded-2xl shadow-sm text-orange-600">
          <Info size={20} strokeWidth={2.5} />
        </div>
        <div className="space-y-1">
          <h4 className="text-[11px] font-bold text-orange-700 uppercase tracking-widest">
            Mẹo đặt giá
          </h4>
          <p className="text-xs text-orange-900/70 leading-relaxed font-semibold">
            Nên đặt giá bao gồm cả phí vận chuyển hoặc các chương trình khuyến
            mãi dự kiến để thu hút khách hàng tốt hơn.
          </p>
        </div>
      </div>
    </div>
  );
};
