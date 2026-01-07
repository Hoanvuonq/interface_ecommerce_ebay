import React from "react";
import { MapPin } from "lucide-react";
import { ShippingAddressCardProps } from "../../_types/address";
import { Button } from "@/components/button/button";
import { MapPinPen } from "lucide-react";
import _ from "lodash";

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
    <div className="bg-white rounded-xl shadow-custom border border-gray-100 py-3 px-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-amber-50 rounded-full p-2">
              <MapPin className="text-orange-500 w-5 h-5" />
            </span>
            <h3 className="text-gray-700 font-semibold text-sm uppercase">Địa chỉ giao hàng</h3>
          </div>

          {hasAddress ? (
            <div className="space-y-1 ml-1 sm:ml-7">
              <div className="flex items-center gap-2 text-gray-700 font-medium text-sm">
                <span className="font-semibold">{_.get(selectedAddress, "recipientName", "Chưa có tên")}</span>
                <span className="text-gray-300">|</span>
                <span>{_.get(selectedAddress, "phone", selectedAddress?.phone || "Chưa có SĐT")}</span>
              </div>
                <span className="leading-relaxed text-gray-600 text-sm">{fullAddressString}</span>
            </div>
          ) : (
            <p className="text-gray-400 text-sm ml-1 sm:ml-7 italic">Bạn chưa chọn địa chỉ giao hàng nào.</p>
          )}
        </div>

        <Button
          type="button"
          variant="edit"
          onClick={onOpenModal}
          icon={<MapPinPen  size={14}/>}
          className="text-xs!"
        >
          {hasAddress ? "Thay đổi" : "Chọn địa chỉ"}
        </Button>
      </div>
    </div>
  );
};