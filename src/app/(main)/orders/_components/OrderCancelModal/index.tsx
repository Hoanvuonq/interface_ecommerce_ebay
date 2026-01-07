"use client";

import React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { PortalModal } from "@/features/PortalModal"; 

interface OrderCancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderNumber: string;
  cancelReason: string;
  setCancelReason: (value: string) => void;
  isCancelling: boolean;
  carrier?: string;
  trackingNumber?: string | null;
}

export const OrderCancelModal: React.FC<OrderCancelModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  orderNumber,
  cancelReason,
  setCancelReason,
  isCancelling,
  carrier,
  trackingNumber,
}) => {
  const modalTitle = (
    <div className="flex items-center gap-2 text-red-600">
      <div className="p-2 bg-red-50 rounded-full">
        <AlertTriangle size={20} />
      </div>
      <span className="font-bold text-lg leading-none">Hủy đơn hàng</span>
    </div>
  );

  const modalFooter = (
    <div className="flex justify-end gap-3 w-full">
      <button
        type="button"
        onClick={onClose}
        disabled={isCancelling}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
      >
        Đóng lại
      </button>
      <button
        type="button"
        onClick={onConfirm}
        disabled={isCancelling || !cancelReason.trim()}
        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isCancelling && <Loader2 size={16} className="animate-spin" />}
        Xác nhận hủy
      </button>
    </div>
  );

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      footer={modalFooter}
      width="max-w-md"
      preventCloseOnClickOverlay={isCancelling}
    >
      <div className="space-y-5 py-2 font-sans">
        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-sm text-gray-600 leading-relaxed">
            Bạn có chắc chắn muốn hủy đơn hàng{" "}
            <span className="font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200 shadow-sm">
              #{orderNumber}
            </span>
            ?
            <br />
            <span className="mt-2 block">
              Hành động này <span className="font-bold text-red-600 underline decoration-2 underline-offset-2">không thể hoàn tác</span>.
            </span>
          </p>
        </div>

        {carrier === "CONKIN" && trackingNumber && (
          <div className="flex gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-800 animate-in fade-in slide-in-from-top-1 duration-300">
            <AlertTriangle size={18} className="shrink-0 mt-0.5 text-amber-600" />
            <span className="font-medium">
              Đơn hàng này sử dụng vận chuyển Conkin. Vận đơn Conkin cũng sẽ
              được hủy tự động trên hệ thống.
            </span>
          </div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-700">
            Lý do hủy đơn <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all placeholder:text-gray-600 resize-none bg-gray-50 focus:bg-white"
            placeholder="Vui lòng cho chúng tôi biết lý do tại sao bạn muốn hủy đơn hàng này..."
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            maxLength={500}
            disabled={isCancelling}
          />
          <div className="flex justify-between items-center px-1">
             <span className="text-[10px] text-gray-600 italic">
               *Thông tin này giúp chúng tôi cải thiện dịch vụ
             </span>
            <span className={`text-xs font-bold ${cancelReason.length >= 500 ? 'text-red-500' : 'text-gray-600'}`}>
              {cancelReason.length}/500
            </span>
          </div>
        </div>
      </div>
    </PortalModal>
  );
};