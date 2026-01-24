import React from "react";
import { CreditCard, CheckCircle, Clock } from "lucide-react";

interface PaymentInfoCardProps {
  paymentMethod: string;
  paymentIntentId?: string;
  isPaid: boolean;
}

export const PaymentInfoCard: React.FC<PaymentInfoCardProps> = ({
  paymentMethod,
  paymentIntentId,
  isPaid,
}) => {
  const getPaymentStatusBadge = () => {
    if (isPaid) {
      return (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-green-50 border border-green-200">
          <CheckCircle size={20} className="text-green-600" />
          <div>
            <p className="text-sm font-semibold text-green-700">
              Đã thanh toán
            </p>
            <p className="text-xs text-green-600">Payment completed</p>
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200">
        <Clock size={20} className="text-amber-600" />
        <div>
          <p className="text-sm font-semibold text-amber-700">
            Chưa thanh toán
          </p>
          <p className="text-xs text-amber-600">Awaiting payment</p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <CreditCard size={18} className="text-blue-600" />
        Thông tin thanh toán
      </h3>

      <div className="space-y-4">
        {/* Payment Status - Prominent */}
        {getPaymentStatusBadge()}

        {/* Payment Method */}
        <div>
          <p className="text-xs text-gray-500 mb-1">Phương thức</p>
          <p className="text-sm font-medium text-gray-700">
            {paymentMethod === "BANK_TRANSFER"
              ? "Chuyển khoản"
              : paymentMethod === "COD"
                ? "COD - Tiền mặt"
                : paymentMethod === "VNPAY"
                  ? "VNPay"
                  : paymentMethod}
          </p>
        </div>

        {/* Transaction ID */}
        {paymentIntentId && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Mã giao dịch</p>
            <p className="text-sm font-mono text-gray-600 break-all">
              {paymentIntentId}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
