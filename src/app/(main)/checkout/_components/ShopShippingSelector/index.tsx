"use client";

import React from "react";
import { Truck, Calendar } from "lucide-react";
import { cn } from "@/utils/cn";
import { formatPrice } from "@/hooks/useFormatPrice";
import { ShopShippingSelectorProps } from "./type";
import { SectionLoading, Checkbox } from "@/components"; 

export const ShopShippingSelector: React.FC<ShopShippingSelectorProps> = ({
  shopId,
  availableOptions,
  selectedMethodCode,
  isLoading,
  onMethodChange,
}) => {
  return (
    <div className="bg-slate-50/50 rounded-2xl border border-slate-100 overflow-hidden relative">
      <div className="px-4 py-2.5 border-b border-slate-100 flex items-center gap-2 bg-white/50">
        <Truck size={14} className="text-orange-500" />
        <h4 className="text-[10px] font-bold uppercase tracking-wider  text-gray-500">
          Đơn vị vận chuyển
        </h4>
      </div>

      <div className="p-3 relative">
        {isLoading && (
          <SectionLoading
            isOverlay
            message="Đang tính phí..."
            className="bg-white/40" 
          />
        )}
        <div
          className={cn(
            "grid grid-cols-1 md:grid-cols-2 gap-2 transition-opacity duration-300",
            isLoading && "opacity-20 pointer-events-none blur-[1px]"
          )}
        >
          {availableOptions && availableOptions.length > 0 ? (
            availableOptions.map((option, index) => {
              const isSelected =
                Number(selectedMethodCode) === Number(option.serviceCode);
              const uniqueKey = `${option.serviceCode}-${option.serviceType}-${index}`;

              return (
                <div
                  key={uniqueKey}
                  onClick={() =>
                    !isSelected &&
                    onMethodChange(shopId, String(option.serviceCode))
                  }
                  className={cn(
                    "relative py-2 px-3 rounded-xl cursor-pointer transition-all duration-200 flex flex-col gap-2 group border",
                    isSelected
                      ? "border-gray-500 bg-white shadow-sm ring-1 ring-orange-500/10"
                      : "border-slate-100 bg-white/40 hover:bg-white hover:border-slate-200"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {/* THAY THẾ DIV CŨ BẰNG COMPONENT CHECKBOX */}
                      <Checkbox 
                        checked={isSelected}
                        readOnly
                        sizeClassName="w-4 h-4 rounded-md" // Tuỳ chỉnh kích thước cho vừa UI
                        containerClassName="pointer-events-none" // Để click div cha xử lý
                      />

                      <span
                        className={cn(
                          "text-[12px] font-bold truncate transition-colors uppercase tracking-tight",
                          isSelected ? " text-gray-900" : " text-gray-600"
                        )}
                      >
                        {option.displayName}
                      </span>
                    </div>

                    <span
                      className={cn(
                        "text-[13px] font-bold shrink-0 tabular-nums",
                        isSelected ? "text-orange-600" : " text-gray-700"
                      )}
                    >
                      {formatPrice(option.fee)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-medium pl-6 border-t border-gray-50 pt-1.5">
                    <Calendar size={10} className="shrink-0" />
                    <span className="truncate italic">
                      Nhận hàng: {option.estimatedDeliveryTime || "2-3 ngày"}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-6 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                Vui lòng chọn địa chỉ để thấy phí vận chuyển
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};