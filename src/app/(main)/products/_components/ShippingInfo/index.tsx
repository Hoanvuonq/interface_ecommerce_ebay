"use client";

import React from "react";
import { MapPin, Truck, Store, Tag, ChevronRight, LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";

interface InfoRowProps {
  label: string;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  hoverBgColor: string;
  children: React.ReactNode;
  showChevron?: boolean;
}

const InfoRow = ({
  label,
  icon: Icon,
  iconBgColor,
  iconColor,
  hoverBgColor,
  children,
  showChevron,
}: InfoRowProps) => (
  <div className={cn(
    "flex items-center p-2 rounded-xl transition-all cursor-pointer group/row",
    hoverBgColor // Nền của cả hàng khi hover (ví dụ: hover:bg-blue-50)
  )}>
    <div className="w-24 shrink-0 text-gray-500 font-medium text-sm">{label}</div>
    <div className="flex-1 flex items-center justify-between overflow-hidden">
      <div className="flex items-center gap-3 overflow-hidden">
        {/* Icon box: Khi hover hàng, icon vẫn giữ màu gốc hoặc đổi sang màu đậm hơn, KHÔNG dùng bg-current */}
        <div className={cn(
          "p-1.5 rounded-lg transition-colors shrink-0",
          iconBgColor,
          iconColor,
          "group-hover/row:bg-white group-hover/row:shadow-sm" 
        )}>
          <Icon size={18} />
        </div>
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
      {showChevron && (
        <ChevronRight
          size={16}
          className="text-gray-300 group-hover/row:text-blue-500 transition-transform group-hover/row:translate-x-1"
        />
      )}
    </div>
  </div>
);

export const ShippingInfo: React.FC<any> = ({
  shopName = "TẬP HÓA IT",
  bestPlatformVoucher,
}) => {
  return (
    <div className="w-full max-w-125 bg-white rounded-2xl border border-gray-100 p-1.5 shadow-sm">
      <div className="flex flex-col">
        
        <InfoRow
          label="Giao đến"
          icon={MapPin}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
          hoverBgColor="hover:bg-blue-50/50"
          showChevron
        >
          <span className="font-bold text-gray-900 border-b border-dashed border-gray-300 group-hover/row:text-blue-600 group-hover/row:border-blue-600 transition-colors truncate text-sm">
            Chọn địa chỉ giao hàng
          </span>
        </InfoRow>

        <div className="h-px bg-gray-50 mx-4 my-0.5" />

        <InfoRow
          label="Nhận hàng"
          icon={Truck}
          iconBgColor="bg-green-50"
          iconColor="text-green-600"
          hoverBgColor="hover:bg-green-50/50"
        >
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900 italic text-sm hover:text-green-600">
              Dự kiến 2 - 4 ngày làm việc
            </span>
            <p className="text-[11px] text-gray-600 italic leading-tight mt-0.5">
              Phí vận chuyển hiển thị khi chọn địa chỉ
            </p>
          </div>
        </InfoRow>

        <InfoRow
          label="Gửi từ"
          icon={Store}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-600"
          hoverBgColor="hover:bg-orange-50/50"
        >
          <span className="font-bold text-gray-800 hover:text-amber-600 uppercase tracking-wide text-sm truncate">
            {shopName}
          </span>
        </InfoRow>
      </div>
    </div>
  );
};