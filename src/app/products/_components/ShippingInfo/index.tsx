"use client";

import React from "react";
import { MapPin, Truck, Store, Tag, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";

interface ShippingInfoProps {
  shopName?: string;
  bestPlatformVoucher?: {
    voucherScope?: string;
    description?: string;
  };
}

export const ShippingInfo: React.FC<ShippingInfoProps> = ({
  shopName,
  bestPlatformVoucher,
}) => (
  <div className="w-full max-w-[500px] bg-white rounded-2xl border border-gray-100 p-2 shadow-sm">
    <div className="flex flex-col gap-y-1 text-[14px]">
      <div className="flex items-center p-3 rounded-xl hover:bg-blue-50/50 transition-all cursor-pointer group">
        <div className="w-[90px] flex-shrink-0 text-gray-500 font-medium">
          Giao đến
        </div>
        <div className="flex-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <MapPin size={16} />
            </div>
            <span className="font-bold text-gray-900 border-b border-dashed border-gray-400 group-hover:text-blue-600 group-hover:border-blue-600 transition-colors">
              Chọn địa chỉ giao hàng
            </span>
          </div>
          <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-400 transition-all translate-x-0 group-hover:translate-x-1" />
        </div>
      </div>

      {/* Phân cách nhẹ */}
      <div className="h-[1px] bg-gray-50 mx-3" />

      <div className="flex items-start p-3 rounded-xl hover:bg-green-50/30 transition-all">
        <div className="w-[90px] flex-shrink-0 text-gray-500 font-medium py-1">
          Nhận hàng
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-2">
            <Truck size={18} className="text-green-600" />
            <span className="font-semibold text-gray-900 italic">Dự kiến 2 - 4 ngày làm việc</span>
          </div>
          <p className="text-[12px] text-gray-400 mt-1 ml-7 italic leading-tight">
            Phí vận chuyển sẽ được hiển thị chính xác khi chọn địa chỉ
          </p>
        </div>
      </div>

      <div className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-all">
        <div className="w-[90px] flex-shrink-0 text-gray-500 font-medium">
          Gửi từ
        </div>
        <div className="flex-1 flex items-center gap-2">
          <div className="p-1.5 bg-gray-100 rounded-lg text-gray-600">
            <Store size={16} className="text-amber-600"/>
          </div>
          <span className="font-bold text-gray-800 uppercase tracking-wide">
            {shopName || "TẬP HÓA IT"}
          </span>
        </div>
      </div>

      {bestPlatformVoucher?.voucherScope === "SHIPPING" && (
        <div className="mt-1 flex items-center p-3 bg-orange-50/50 rounded-xl border border-orange-100/50">
          <div className="w-[90px] flex-shrink-0 text-gray-500 font-medium text-xs uppercase tracking-tighter">
            Ưu đãi hời
          </div>
          <div className="flex-1 flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[11px] font-extrabold rounded-full shadow-sm">
              <Tag size={12} fill="white" />
              <span className="uppercase whitespace-nowrap">
                {bestPlatformVoucher.description || "Miễn phí vận chuyển"}
              </span>
            </div>
            <span className="text-[11px] text-orange-600 font-medium hidden sm:inline">
              Áp dụng cho đơn từ 0đ
            </span>
          </div>
        </div>
      )}

    </div>
  </div>
);