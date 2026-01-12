"use client";

import { Sparkles } from "lucide-react";

interface ProductVariantsSectionProps {
  hasOptions: boolean;
  children: React.ReactNode; 
}

export const ProductVariantsSection = ({
  hasOptions,
  children,
}: ProductVariantsSectionProps) => {
  return (
    <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900">Chi tiết biến thể</h3>
          <p className="text-xs text-gray-500 mt-1">
            {hasOptions
              ? "Cập nhật giá và kho cho từng phân loại bên dưới."
              : "Sản phẩm không có phân loại (Biến thể mặc định)."}
          </p>
        </div>
        {hasOptions && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold uppercase tracking-wide">
            <Sparkles size={12} /> Tự động tạo
          </div>
        )}
      </div>

      {/* Khu vực chứa Table */}
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {children}
      </div>
    </div>
  );
};