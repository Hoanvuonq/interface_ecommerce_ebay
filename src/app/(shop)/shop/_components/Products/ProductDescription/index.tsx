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

  return (
    <div
      className={cn(
        "p-6 bg-white rounded-4xl border border-gray-100 shadow-sm space-y-6",
        className
      )}
    >
      <div className="space-y-1">
        <h3 className="text-lg font-black text-gray-900 tracking-tight">
          Mô tả sản phẩm
        </h3>
        <p className="text-xs font-medium text-gray-500">
          Nhập mô tả chi tiết để khách hàng hiểu rõ hơn về sản phẩm của bạn.
        </p>
      </div>

      <div className="space-y-2">
        <div className="relative group">
          <textarea
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            rows={8}
            maxLength={maxLength}
            placeholder="Ví dụ: Áo thun chất liệu cotton 100%, co giãn 4 chiều, thấm hút mồ hôi tốt..."
            className={cn(
              "w-full p-5 text-sm font-medium text-gray-700 bg-gray-50/50 border rounded-2xl outline-none transition-all duration-200 resize-y min-h-50",
              "placeholder:text-gray-400 placeholder:font-normal",
              error
                ? "border-red-200 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                : "border-gray-200 hover:border-gray-300 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-50"
            )}
          />
          
          <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm">
            <span
              className={cn(
                "text-[10px] font-bold tabular-nums",
                value.length >= maxLength ? "text-red-500" : "text-gray-500"
              )}
            >
              {value.length}
            </span>
            <span className="text-[10px] text-gray-300">/</span>
            <span className="text-[10px] text-gray-400 font-medium">
              {maxLength}
            </span>
          </div>
        </div>
        
        {error && (
          <p className="text-xs text-red-500 font-bold ml-1 animate-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>

      <div className="flex gap-4 p-4 bg-sky-50/60 border border-sky-100 rounded-2xl">
        <div className="shrink-0 w-8 h-8 flex items-center justify-center bg-sky-100 rounded-full text-sky-600">
          <Info size={16} strokeWidth={2.5} />
        </div>
        <div className="space-y-1 pt-0.5">
          <h4 className="text-xs font-black text-sky-700 uppercase tracking-wide">
            Gợi ý nội dung
          </h4>
          <p className="text-xs text-sky-600/90 leading-relaxed font-medium">
            Mô tả nên bao gồm: đặc điểm nổi bật, thông số kỹ thuật, hướng dẫn sử dụng và bảo quản để tăng tỷ lệ chuyển đổi.
          </p>
        </div>
      </div>
    </div>
  );
};