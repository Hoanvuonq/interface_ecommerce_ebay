"use client";

import React from "react";
import { Image as ImageIcon } from "lucide-react";

interface ProductPreviewSidebarProps {
  previewImage?: string;
  name?: string;
  basePrice?: number;
  description?: string;
  totalStock: number;
}

export const ProductPreviewSidebar: React.FC<ProductPreviewSidebarProps> = ({
  previewImage,
  name,
  basePrice,
  description,
  totalStock,
}) => {
  const formattedPrice = basePrice 
    ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(basePrice)
    : "0 ₫";

  return (
    <div className="sticky top-25 w-full bg-white rounded-4xl border border-gray-200 shadow-custom overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
        <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
          <ImageIcon size={18} className="text-(--color-mainColor)" />
          Xem trước sản phẩm
        </h3>
      </div>

      <div className="p-5 flex flex-col gap-5">
        <div className="aspect-square w-full rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center relative group">
          {previewImage ? (
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-300">
              <ImageIcon size={48} className="mb-2 opacity-50" />
              <span className="text-xs font-medium">Chưa có ảnh</span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
              Tên sản phẩm
            </span>
            <p className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[40px] leading-relaxed">
              {name || "Tên sản phẩm sẽ hiển thị ở đây..."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                Giá bán
              </span>
              <p className="text-lg font-bold text-orange-600 tabular-nums">
                {formattedPrice}
              </p>
            </div>
            {/* Stock */}
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                Kho hàng
              </span>
              <p className="text-sm font-bold text-gray-700 tabular-nums">
                {totalStock}
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-gray-100" />

          {/* Description */}
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
              Mô tả ngắn
            </span>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 min-h-[80px] max-h-[150px] overflow-y-auto text-xs text-gray-600 leading-relaxed custom-scrollbar">
              {description ? (
                <div dangerouslySetInnerHTML={{ __html: description }} /> 
              ) : (
                <span className="italic text-gray-400">Mô tả sản phẩm sẽ hiển thị ở đây...</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};