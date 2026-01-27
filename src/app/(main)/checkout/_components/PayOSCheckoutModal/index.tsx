"use client";

import React from "react";
import { Loader2, CreditCard, Timer } from "lucide-react";
import { PortalModal } from "@/features/PortalModal";
import { PayOSQRPayment } from "@/app/(main)/orders/_components/PayOSQRPayment";
import { PayOSPaymentResponse } from "@/types/payment/payment.types";

interface PayOSCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  payosInfo: PayOSPaymentResponse | null;
  selectedOrder: any;
  remainingSeconds: number | null;
  formatRemain: (sec: number | null) => string;
}

export const PayOSCheckoutModal: React.FC<PayOSCheckoutModalProps> = ({
  isOpen,
  onClose,
  payosInfo,
  selectedOrder,
  remainingSeconds,
  formatRemain,
}) => {
  
  const modalTitle = (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 shadow-sm">
        <CreditCard size={20} />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-900 uppercase tracking-tight leading-none">
          Thanh toán <span className="text-orange-500">QR</span>
        </h3>
        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-1">
          Mã đơn: #{selectedOrder?.orderNumber || "..."}
        </p>
      </div>
    </div>
  );

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      width="max-w-lg"
      className="rounded-4xl"
    >
      {payosInfo ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-gray-50 border border-gray-100 p-4 rounded-2xl shadow-inner">
            <div className="flex items-center gap-2 text-gray-500">
              <Timer size={16} />
              <span className="text-xs font-semibold uppercase tracking-widest">Hết hạn sau</span>
            </div>
            <span
              className={`font-mono font-bold text-lg px-3 py-1 rounded-lg ${
                remainingSeconds && remainingSeconds < 60
                  ? "bg-red-100 text-red-600 animate-pulse"
                  : "bg-white text-orange-600 border border-gray-100"
              }`}
            >
              {formatRemain(remainingSeconds)}
            </span>
          </div>

          <div className="p-2 bg-white rounded-3xl border border-gray-50 shadow-sm">
            <PayOSQRPayment
              orderId={selectedOrder?.orderId}
              orderNumber={selectedOrder?.orderNumber || ""}
              amount={selectedOrder?.grandTotal}
              onRefresh={() => {}}
              onCancelPayment={onClose}
            />
          </div>
          
          <p className="text-center text-[10px] text-gray-600 font-bold uppercase tracking-widest px-4">
            Vui lòng không tắt cửa sổ này cho đến khi giao dịch được xác nhận
          </p>
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-100 border-t-orange-500 rounded-full animate-spin" />
            <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-orange-500" size={24} />
          </div>
          <div className="text-center space-y-2">
             <p className="text-gray-900 font-semibold uppercase tracking-tighter text-lg">Đang khởi tạo mã QR</p>
             <p className="text-gray-600 text-xs font-medium italic">Vui lòng chờ trong giây lát...</p>
          </div>
        </div>
      )}
    </PortalModal>
  );
};