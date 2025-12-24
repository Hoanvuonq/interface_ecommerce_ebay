import React from "react";
import { MapPin } from "lucide-react";
import { ShippingAddressCardProps } from "../../_types/address";
import { Button } from "@/components/button/button";
import { MapPinPen } from "lucide-react";

export const ShippingAddressCard: React.FC<ShippingAddressCardProps> = ({
  selectedAddress,
  onOpenModal,
  hasAddress,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100 p-4 sm:p-5 mb-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <span className=" bg-amber-50 rounded-full p-2">
              <MapPin className="text-orange-500 w-5 h-5" />
            </span>
            <h3 className="text-gray-900 font-medium text-base uppercase">
              Địa chỉ giao hàng
            </h3>
          </div>

          {hasAddress && selectedAddress ? (
            <div className="space-y-1 ml-1 sm:ml-7">
              <div className="flex items-center gap-2 text-gray-900 font-semibold text-sm sm:text-base">
                <span>{selectedAddress.recipientName || "Chưa có tên"}</span>
                <span className="text-gray-300">|</span>
                <span>{selectedAddress.phone || "Chưa có SĐT"}</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                {selectedAddress.detailAddress},{" "}
                {[
                  selectedAddress.ward,
                  selectedAddress.district,
                  selectedAddress.province,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
          ) : (
            <p className="text-gray-400 text-sm ml-1 sm:ml-7 italic">
              Bạn chưa chọn địa chỉ giao hàng nào.
            </p>
          )}
        </div>

        <Button variant="edit" onClick={onOpenModal} icon={<MapPinPen />}>
          {hasAddress ? "Thay đổi" : "Chọn địa chỉ"}
        </Button>
      </div>
    </div>
  );
};
