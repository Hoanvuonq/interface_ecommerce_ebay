"use client";
import React from 'react';
import { Info, Sparkles } from 'lucide-react';
import { cn } from "@/utils/cn";

export const ProductDetailsTabs: React.FC = () => {
  return (
    <div className="bg-white rounded-4xl p-8 shadow-sm border border-orange-100/50 animate-in fade-in duration-500">
      {/* Tiêu đề & Icon */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-orange-100 rounded-2xl">
          <Sparkles className="w-6 h-6 text-orange-600" />
        </div>
        <div className="space-y-0.5">
          <h3 className="text-xl font-bold text-gray-800 tracking-tight">
            Thông tin chi tiết
          </h3>
          <p className="text-xs font-medium text-gray-400">
            Các thuộc tính bổ sung giúp tăng độ tin cậy cho sản phẩm.
          </p>
        </div>
      </div>
      
      {/* Nội dung trống thông minh */}
      <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/30 mb-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Info className="w-8 h-8 text-gray-300" />
        </div>
        <p className="text-sm font-bold text-gray-400 text-center max-w-xs leading-relaxed">
          Phần này hiện đang được tối ưu hóa cho các thuộc tính đặc thù theo ngành hàng.
        </p>
      </div>
      
      {/* Box Thông báo trượt tab */}
      <div className="p-5 bg-orange-50/50 border border-orange-100 rounded-3xl flex gap-4">
        <div className="shrink-0 w-10 h-10 flex items-center justify-center bg-white rounded-2xl shadow-sm text-orange-600">
          <Info size={20} strokeWidth={2.5} />
        </div>
        <div className="space-y-1 pt-0.5">
          <h4 className="text-[11px] font-bold text-orange-700 uppercase tracking-widest">
            Thông tin chuyển đổi
          </h4>
          <p className="text-xs text-orange-900/70 leading-relaxed font-semibold">
            Lưu ý: Tính năng <span className="text-orange-600 font-bold">Phân loại sản phẩm</span> đã được di chuyển sang tab <span className="underline decoration-orange-300 underline-offset-4 text-orange-600">Bán hàng</span> để bạn dễ dàng quản lý cùng lúc với giá và kho hàng.
          </p>
        </div>
      </div>
    </div>
  );
};