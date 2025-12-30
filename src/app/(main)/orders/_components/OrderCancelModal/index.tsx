import React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { SimpleModal } from "@/components";

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
  return (
    <SimpleModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-red-600">
          <div className="p-2 bg-red-50 rounded-full">
            <AlertTriangle size={20} />
          </div>
          <span className="font-bold text-lg">Hủy đơn hàng</span>
        </div>
      }
      footer={
        <div className="flex justify-end gap-3 w-full">
          <button
            onClick={onClose}
            disabled={isCancelling}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Đóng lại
          </button>
          <button
            onClick={onConfirm}
            disabled={isCancelling || !cancelReason.trim()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCancelling && <Loader2 size={16} className="animate-spin" />}
            Xác nhận hủy
          </button>
        </div>
      }
    >
      <div className="space-y-4 pt-2">
        <p className="text-sm text-gray-600">
          Bạn có chắc chắn muốn hủy đơn hàng{" "}
          <span className="font-bold text-gray-900 bg-gray-100 px-1 rounded">
            #{orderNumber}
          </span>
          ?
          <br />
          Hành động này <span className="font-bold text-red-600">không thể hoàn tác</span>.
        </p>

        {carrier === "CONKIN" && trackingNumber && (
          <div className="flex gap-3 p-3 bg-orange-50 border border-orange-100 rounded-lg text-sm text-orange-800">
            <AlertTriangle size={18} className="shrink-0 mt-0.5" />
            <span>
              Đơn hàng này sử dụng vận chuyển Conkin. Vận đơn Conkin cũng sẽ
              được hủy tự động.
            </span>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Lý do hủy đơn <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder:text-gray-400 resize-none bg-gray-50 focus:bg-white"
            placeholder="Vui lòng cho chúng tôi biết lý do..."
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            maxLength={500}
          />
          <div className="text-right mt-1">
            <span className="text-xs text-gray-400 font-medium">
              {cancelReason.length}/500
            </span>
          </div>
        </div>
      </div>
    </SimpleModal>
  );
};