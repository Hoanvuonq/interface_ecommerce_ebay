"use client";

import React from "react";
import { Truck, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { formatPrice } from "@/hooks/useFormatPrice";
import { ShopShippingSelectorProps } from "./type";

export const ShopShippingSelector: React.FC<ShopShippingSelectorProps> = ({
  shopId,
  shopName,
  availableOptions,
  selectedMethodCode,
  isLoading,
  onMethodChange,
}) => {
  return (
    <div className="bg-slate-50/50 p-4 sm:p-6 rounded-4xl border border-slate-100 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm text-orange-500">
            <Truck size={16} strokeWidth={2.5} />
          </div>
          <h4 className="text-sm font-semibold uppercase tracking-tight text-slate-700">
            Phương thức vận chuyển
          </h4>
        </div>
      </div>

      {isLoading ? (
        <div className="flex gap-3 items-center justify-center py-6 bg-white rounded-2xl border border-dashed border-slate-200 text-sm text-slate-400 font-bold uppercase tracking-widest">
          <Loader2 className="animate-spin w-5 h-5 text-orange-500" />
          Đang tính phí vận chuyển...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {availableOptions && availableOptions.length > 0 ? (
            availableOptions.map((option, index) => {
              const isSelected = Number(selectedMethodCode) === Number(option.serviceCode);
              const uniqueKey = `${option.serviceCode}-${option.serviceType}-${index}`;
              
              return (
                <div
                  key={uniqueKey}
                  onClick={() => {
                    if (!isSelected) {
                      onMethodChange(shopId, String(option.serviceCode));
                    }
                  }}
                  className={cn(
                    "relative p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 flex justify-between items-center group",
                    isSelected
                      ? "border-orange-500 bg-white shadow-md ring-1 ring-orange-500/20"
                      : "border-slate-100 bg-white/50 hover:border-orange-200 hover:bg-white"
                  )}
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <p
                      className={cn(
                        "text-[11px] font-semibold uppercase tracking-wide transition-colors",
                        isSelected ? "text-orange-600" : "text-slate-700"
                      )}
                    >
                      {option.displayName}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest italic">
                      Nhận hàng:{" "}
                      {option.estimatedDeliveryTime || "Dự kiến 2-4 ngày"}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-semibold text-slate-900 leading-none">
                      {formatPrice(option.fee)}
                    </span>
                    {isSelected && (
                      <CheckCircle2
                        size={16}
                        className="text-orange-500"
                        strokeWidth={3}
                      />
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-4 bg-red-50 rounded-2xl border border-red-100">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-red-500">
                Chưa hỗ trợ vận chuyển đến địa chỉ này
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};