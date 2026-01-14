"use client";

import { Info } from "lucide-react";
import { cn } from "@/utils/cn";

interface ProductDescriptionProps {
  value?: string;
  onChange?: (val: string) => void;
  error?: string;
  className?: string;
}

export const ProductDescription = ({
  value = "",
  onChange,
  error,
  className,
}: ProductDescriptionProps) => {
  const maxLength = 5000;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={cn("p-4 space-y-3 bg-white rounded-4xl shadow-custom", className)}>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-orange-100 rounded-xl">
          <Info className="w-5 h-5 text-orange-600" />
        </div>
        <div className="space-y-0.5">
          <h3 className="text-lg font-bold text-gray-800 tracking-tight">
            Mô tả sản phẩm
          </h3>
          <p className="text-xs font-medium text-gray-500">
            Cung cấp thông tin chi tiết nhất về sản phẩm của bạn.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="relative group">
          <textarea
            value={value}
            onChange={handleTextChange} 
            rows={10}
            maxLength={maxLength}
            placeholder="Ví dụ: Áo thun chất liệu cotton 100%, co giãn 4 chiều, thấm hút mồ hôi tốt..."
            className={cn(
              "w-full p-6 text-sm font-semibold text-gray-700 bg-gray-50/50 border rounded-3xl outline-none transition-all duration-300 resize-none min-h-75",
              "placeholder:text-gray-500 placeholder:font-normal",
              error
                ? "border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                : "border-gray-200 hover:border-gray-200 focus:bg-white focus:border-gray-500 focus:ring-4 focus:ring-orange-500/10"
            )}
          />

          <div className="absolute bottom-5 right-5 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white shadow-sm border border-gray-100">
            <span
              className={cn(
                "text-[11px] font-bold tabular-nums",
                value.length >= maxLength ? "text-red-500" : "text-orange-600"
              )}
            >
              {value.length.toLocaleString()}
            </span>
            <span className="text-[11px] text-gray-300">/</span>
            <span className="text-[11px] text-gray-400 font-bold">
              {maxLength.toLocaleString()}
            </span>
          </div>
        </div>

        {error && (
          <p className="text-[11px] text-red-500 font-bold ml-2 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>

      <div className="flex gap-4 p-5 bg-gray-50 border border-gray-100 rounded-3xl">
        <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-white rounded-2xl shadow-sm text-orange-600">
          <Info size={20} strokeWidth={2.5} />
        </div>
        <div className="space-y-1">
          <h4 className="text-[11px] font-bold text-orange-700 uppercase">
            Mẹo viết mô tả thu hút
          </h4>
          <p className="text-xs text-orange-900/70 leading-relaxed font-semibold">
            Hãy tập trung vào lợi ích khách hàng nhận được, thông số kỹ thuật rõ
            ràng và hướng dẫn bảo quản để tăng uy tín cho Shop.
          </p>
        </div>
      </div>
    </div>
  );
};
