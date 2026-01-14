"use client";
import React from "react";
import { AlertTriangle, Info, Package } from "lucide-react";
import { ShippingTable } from "@/app/(shop)/shop/_components/Products/ShippingTable";
interface Variant {
  sku?: string;
  weightGrams?: number;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  optionValueNames?: string[];
}

interface ProductShippingTabsProps {
  variants: Variant[];
  optionNames: string[];
  onUpdateVariant: (index: number, field: string, value: any) => void;
}

export const ProductShippingTabs: React.FC<ProductShippingTabsProps> = ({
  variants,
  optionNames,
  onUpdateVariant,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
      {/* Header Section */}
      <div className="flex items-start gap-4">
        <div className="p-3 bg-orange-100 rounded-lg">
          <Package className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Thông tin vận chuyển
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Nhập cân nặng và kích thước đóng gói cho từng biến thể để tính phí
            vận chuyển chính xác.
          </p>
        </div>
      </div>

      {/* Content Section */}
      {variants.length === 0 ? (
        <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-orange-50 to-orange-100 border border-gray-200 rounded-xl">
          <div className="p-2 bg-orange-200 rounded-full">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="font-semibold text-orange-800 text-sm">
              Chưa có biến thể
            </p>
            <p className="text-orange-700 text-xs mt-1">
              Vui lòng tạo biến thể ở tab 'Bán hàng' trước khi nhập thông tin
              này.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Shipping Table */}
          <ShippingTable
            variants={variants}
            optionNames={optionNames}
            onUpdateVariant={onUpdateVariant}
          />
        </div>
      )}

      {/* Info Section */}
      <div className="p-5 bg-gradient-to-r from-orange-50 to-amber-50 border border-gray-200 rounded-xl">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-orange-800 mb-2">
              Lưu ý quan trọng
            </h4>
            <div className="text-sm text-orange-700 space-y-1">
              <p>
                • <strong>Cân nặng:</strong> Được tính theo gram (g)
              </p>
              <p>
                • <strong>Kích thước:</strong> Được tính theo centimet (cm)
              </p>
              <p>
                • <strong>Quan trọng:</strong> Đây là kích thước{" "}
                <strong>sau khi đóng gói</strong> kiện hàng
              </p>
              <p>
                • Thông tin này sẽ được sử dụng để tính phí vận chuyển chính xác
                nhất
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
