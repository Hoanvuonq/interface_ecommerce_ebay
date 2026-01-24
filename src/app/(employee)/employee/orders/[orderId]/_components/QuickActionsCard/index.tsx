import React from "react";
import { Phone, Mail, Copy, Store, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/useToast";

interface QuickActionsCardProps {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  shopId?: string;
  shopName?: string;
}

export const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
  customerName,
  customerPhone,
  customerEmail,
  shippingAddress,
  shopId,
  shopName,
}) => {
  const { success } = useToast();
  const handleCallCustomer = () => {
    window.location.href = `tel:${customerPhone}`;
  };

  const handleEmailCustomer = () => {
    window.location.href = `mailto:${customerEmail}`;
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(shippingAddress);
    success("Đã copy địa chỉ giao hàng!");
  };

  const handleViewShop = () => {
    if (shopId) {
      window.open(`/employee/shops/${shopId}`, "_blank");
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
      <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <CheckCircle size={18} className="text-blue-600" />
        Thao tác nhanh
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {/* Call Customer */}
        <button
          onClick={handleCallCustomer}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 text-sm font-medium transition-colors"
        >
          <Phone size={16} />
          <span>Gọi khách</span>
        </button>

        {/* Email Customer */}
        <button
          onClick={handleEmailCustomer}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-sm font-medium transition-colors"
        >
          <Mail size={16} />
          <span>Email</span>
        </button>

        {/* Copy Address */}
        <button
          onClick={handleCopyAddress}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-sm font-medium transition-colors"
        >
          <Copy size={16} />
          <span>Copy địa chỉ</span>
        </button>

        {/* View Shop */}
        {shopId && (
          <button
            onClick={handleViewShop}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 text-sm font-medium transition-colors"
          >
            <Store size={16} />
            <span>Xem shop</span>
          </button>
        )}
      </div>

      {/* Customer Info Display */}
      <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
        <p className="text-xs text-gray-500">Thông tin liên hệ:</p>
        <div className="space-y-1">
          <p className="text-sm text-gray-700">
            <span className="text-gray-500">Tên:</span> {customerName}
          </p>
          <p className="text-sm text-gray-700">
            <span className="text-gray-500">SĐT:</span> {customerPhone}
          </p>
          <p className="text-sm text-gray-700 break-all">
            <span className="text-gray-500">Email:</span> {customerEmail}
          </p>
        </div>
      </div>
    </div>
  );
};
