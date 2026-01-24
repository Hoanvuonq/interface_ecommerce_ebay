import React from "react";
import { Truck, Copy, MapPin } from "lucide-react";
import { useToast } from "@/hooks/useToast";

interface ShippingInfoCardProps {
  carrier: string;
  trackingNumber?: string;
  shippingAddress: string;
}

export const ShippingInfoCard: React.FC<ShippingInfoCardProps> = ({
  carrier,
  trackingNumber,
  shippingAddress,
}) => {
  const { success } = useToast();
  const handleCopyTracking = () => {
    if (trackingNumber) {
      navigator.clipboard.writeText(trackingNumber);
      success("Đã copy mã vận đơn!");
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
      <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Truck size={18} className="text-blue-600" />
        Vận chuyển
      </h3>

      <div className="space-y-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Đơn vị vận chuyển</p>
          <p className="text-sm font-medium text-gray-900">{carrier}</p>
        </div>

        {trackingNumber && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Mã vận đơn</p>
            <div className="flex items-center gap-2">
              <p className="text-sm font-mono text-blue-600 flex-1">
                {trackingNumber}
              </p>
              <button
                onClick={handleCopyTracking}
                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                title="Copy mã vận đơn"
              >
                <Copy size={14} className="text-gray-600" />
              </button>
            </div>
          </div>
        )}

        <div>
          <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
            <MapPin size={12} />
            Địa chỉ giao hàng
          </p>
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
              {shippingAddress}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
