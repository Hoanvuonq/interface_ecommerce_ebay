"use client";

import React from "react";
import { MapPin, MapPinPen } from "lucide-react";
import { ShippingAddressCardProps } from "../../_types/address";
import { Button } from "@/components/button/button";
import _ from "lodash";
import { cn } from "@/utils/cn";

export const CheckoutShippingAddress: React.FC<ShippingAddressCardProps> = ({
  selectedAddress,
  onOpenModal,
  hasAddress,
}) => {
  const fullAddressString = _.compact([
    selectedAddress?.detailAddress,
    selectedAddress?.ward,
    selectedAddress?.district,
    selectedAddress?.province,
  ]).join(", ");

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group">
      <div className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="flex items-start gap-4 flex-1">
            <div className="shrink-0 mt-0.5">
              <div className="bg-orange-50 text-orange-500 rounded-xl p-2.5 shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                <MapPin size={20} strokeWidth={2.5} />
              </div>
            </div>

            <div className="space-y-1 min-w-0">
              <h3 className="text-sm font-bold uppercase text-gray-800 ">
                Địa chỉ nhận hàng
              </h3>
              
              {hasAddress ? (
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-600 text-[15px]">
                      {_.get(selectedAddress, "recipientName", "Chưa có tên")}
                    </span>
                    <div className="h-3 w-px bg-gray-200" />
                    <span className="font-semibold text-gray-600 text-sm">
                      {selectedAddress?.phone || "Chưa có SĐT"}
                    </span>
                  </div>
                  <p className="text-gray-500 text-[13px] leading-snug line-clamp-2 italic">
                    {fullAddressString}
                  </p>
                </div>
              ) : (
                <p className="text-gray-400 text-[13px] font-medium italic">
                  Vui lòng cập nhật địa chỉ để nhận hàng nhanh nhất
                </p>
              )}
            </div>
          </div>

          <div className="shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={onOpenModal}
              className="rounded-lg border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-orange-500 hover:border-gray-200 font-bold text-xs h-9! px-4 transition-all"
            >
              <div className="flex items-center gap-2">
                <MapPinPen size={14} />
                <span>{hasAddress ? "Thay đổi" : "Chọn địa chỉ"}</span>
              </div>
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};