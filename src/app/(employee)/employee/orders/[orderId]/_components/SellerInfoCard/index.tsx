import React from "react";
import { Store, MapPin } from "lucide-react";

interface SellerInfoCardProps {
  shopName: string;
  shopAddress: string;
}

export const SellerInfoCard: React.FC<SellerInfoCardProps> = ({
  shopName,
  shopAddress,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
      <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Store size={18} className="text-blue-600" />
        Thông tin shop
      </h3>

      <div className="space-y-3">
        <div>
          <p className="text-xs text-gray-500 mb-1">Tên shop</p>
          <p className="text-sm font-medium text-gray-900">{shopName}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            <MapPin size={12} />
            Địa chỉ
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">{shopAddress}</p>
        </div>
      </div>
    </div>
  );
};
