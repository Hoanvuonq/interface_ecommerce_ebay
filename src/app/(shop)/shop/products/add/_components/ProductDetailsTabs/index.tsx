"use client";
import React from 'react';
import { Info } from 'lucide-react';

export const ProductDetailsTabs: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Thông tin chi tiết
      </h3>
      
      <p className="text-gray-600 text-sm mb-4">
        Phần này dành cho các thông tin chi tiết và thuộc tính sản phẩm khác (nếu có).
      </p>
      
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-800 mb-1">Thông tin</h4>
            <p className="text-sm text-blue-700">
              Phân loại sản phẩm đã được chuyển sang tab 'Bán hàng' để quản lý cùng với biến thể.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};