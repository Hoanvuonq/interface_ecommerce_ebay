"use client";

import React from "react";
import { MapPin, MapPinPen } from "lucide-react";
import { ShippingAddressCardProps } from "../../_types/address";
import { Button } from "@/components/button";
import _ from "lodash";
import { cn } from "@/utils/cn";

export const CheckoutShippingAddress: React.FC<ShippingAddressCardProps> = ({
  selectedAddress,
  onOpenModal,
  hasAddress,
}) => {
  const addr = selectedAddress?.address;

  const fullAddressString = _.compact([
    addr?.detail,
    addr?.ward,
    addr?.district,
    addr?.province,
    addr?.country,
  ]).join(", ");

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group transition-all hover:border-orange-100">
      <div className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="shrink-0 mt-1">
              <div className="bg-orange-50 text-orange-500 rounded-2xl p-3 shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-all duration-500">
                <MapPin size={22} strokeWidth={2.5} />
              </div>
            </div>

            <div className="space-y-1.5 min-w-0">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-600">
                Địa chỉ nhận hàng
              </h3>

              {hasAddress ? (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900 text-[16px] uppercase tracking-tight italic">
                      {selectedAddress?.recipientName || "Người nhận chưa tên"}
                    </span>
                    <div className="h-3 w-px bg-gray-200" />
                    <span className="font-bold text-orange-600 text-sm">
                      {selectedAddress?.phone || "Trống SĐT"}
                    </span>
                  </div>
                  <p className="text-gray-700 text-[13.5px] leading-relaxed font-medium italic opacity-90">
                    {fullAddressString || "Đang tải địa chỉ chi tiết..."}
                  </p>
                </div>
              ) : (
                <p className="text-gray-400 text-sm font-bold italic tracking-tight">
                  Vui lòng thiết lập địa chỉ để tính toán phí vận chuyển...
                </p>
              )}
            </div>
          </div>

          <div className="shrink-0 self-start sm:self-center">
            <Button
              type="button"
              variant="outline"
              onClick={onOpenModal}
              className={cn(
                "rounded-xl border-gray-200 text-gray-600",
                "hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 font-black text-[10px] uppercase tracking-widest h-10 px-5 transition-all shadow-sm active:scale-95"
              )}
            >
              <div className="flex items-center gap-2">
                <MapPinPen size={16} strokeWidth={2.5} />
                <span>{hasAddress ? "Thay đổi" : "Thiết lập"}</span>
              </div>
            </Button>
          </div>
        </div>
      </div>

      <div className="h-0.5 w-full bg-linear-to-r from-transparent via-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </div>
  );
};
