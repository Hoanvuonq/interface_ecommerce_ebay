"use client";

import { Sparkles, Box } from "lucide-react";

interface ProductVariantsSectionProps {
  hasOptions: boolean;
  children: React.ReactNode;
}

export const ProductVariantsSection = ({
  hasOptions,
  children,
}: ProductVariantsSectionProps) => {
  return (
    <div className="p-8 bg-white rounded-4xl border border-gray-100/50 shadow-custom space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-100 rounded-2xl">
            <Box className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800 tracking-tight">
              Chi tiết biến thể
            </h3>
            <p className="text-xs font-medium text-gray-400 mt-0.5">
              {hasOptions
                ? "Thiết lập giá, kho hàng và kích thước riêng cho từng loại sản phẩm."
                : "Sản phẩm đơn (Không có phiên bản phân loại)."}
            </p>
          </div>
        </div>

        {hasOptions && (
          <div className="flex items-center gap-1.5 px-4 py-2 bg-orange-50 text-orange-600 rounded-xl text-[10px] font-bold uppercase tracking-wider shadow-sm">
            <Sparkles size={14} className="animate-pulse" /> Tự động tạo
          </div>
        )}
      </div>

      {children}
    </div>
  );
};
