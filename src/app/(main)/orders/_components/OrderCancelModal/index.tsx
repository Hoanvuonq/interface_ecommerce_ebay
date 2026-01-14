"use client";

import { PortalModal } from "@/features/PortalModal";
import { cn } from "@/utils/cn";
import { AlertCircle, Loader2, MessageSquare } from "lucide-react";
import React, { useState } from "react";

interface OrderCancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void; 
  orderNumber: string;
  isCancelling: boolean;
}

const PREDEFINED_REASONS = [
  "Tôi muốn cập nhật địa chỉ/số điện thoại nhận hàng",
  "Tôi muốn thêm/thay đổi mã giảm giá",
  "Tôi muốn thay đổi sản phẩm (kích thước, màu sắc, số lượng...)",
  "Thủ tục thanh toán quá rắc rối",
  "Tìm thấy chỗ mua khác tốt hơn (Rẻ hơn, uy tín hơn...)",
  "Tôi không có nhu cầu mua nữa",
  "Lý do khác",
];

export const OrderCancelModal: React.FC<OrderCancelModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  orderNumber,
  isCancelling,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [otherReason, setOtherReason] = useState<string>("");

  const handleConfirm = () => {
    const finalReason = selectedReason === "Lý do khác" ? otherReason : selectedReason;
    onConfirm(finalReason);
  };

  const isButtonDisabled = isCancelling || !selectedReason || (selectedReason === "Lý do khác" && !otherReason.trim());

  const modalTitle = (
    <div className="flex items-center gap-3">
      <div className="p-2.5 bg-orange-50 rounded-2xl text-orange-500 shadow-sm border border-gray-100">
        <AlertCircle size={22} strokeWidth={2.5} />
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-800 tracking-tight leading-none">Hủy đơn hàng</h3>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1.5">Mã đơn: #{orderNumber}</p>
      </div>
    </div>
  );

  const modalFooter = (
    <div className="flex items-center justify-end gap-3 w-full border-t border-gray-50 pt-4 mt-2">
      <button
        type="button"
        onClick={onClose}
        className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-gray-700 transition-colors"
      >
        Không phải bây giờ
      </button>
      <button
        type="button"
        onClick={handleConfirm}
        disabled={isButtonDisabled}
        className={cn(
          "flex items-center gap-2 px-8 py-2.5 text-xs font-bold uppercase tracking-widest text-white rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed",
          "bg-orange-500 hover:bg-orange-600 shadow-orange-200"
        )}
      >
        {isCancelling ? <Loader2 size={16} className="animate-spin" /> : "Xác nhận hủy"}
      </button>
    </div>
  );

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      footer={modalFooter}
      width="max-w-lg"
      preventCloseOnClickOverlay={isCancelling}
    >
      <div className="space-y-6 py-2 font-sans">
        {/* Warning Banner */}
        <div className="p-4 bg-orange-50/50 rounded-2xl border border-gray-100 flex gap-3">
          <div className="w-1.5 h-auto bg-orange-400 rounded-full shrink-0" />
          <p className="text-[13px] text-orange-800 leading-relaxed font-medium">
            <span className="font-bold uppercase text-[11px] block mb-1">Lưu ý quan trọng:</span>
            Hành động này <span className="font-bold underline">không thể hoàn tác</span>. Bạn chỉ có thể cập nhật thông tin nhận hàng 1 lần duy nhất thay vì hủy đơn.
          </p>
        </div>

        {/* Reasons List */}
        <div className="space-y-3">
          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] px-1">Vui lòng chọn lý do</label>
          <div className="grid gap-2">
            {PREDEFINED_REASONS.map((reason) => (
              <label
                key={reason}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer group",
                  selectedReason === reason
                    ? "bg-orange-50 border-gray-200 shadow-sm shadow-orange-100"
                    : "bg-white border-gray-100 hover:border-gray-200"
                )}
              >
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                  selectedReason === reason ? "border-gray-500 bg-orange-500" : "border-gray-200 group-hover:border-gray-300"
                )}>
                  {selectedReason === reason && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <input
                  type="radio"
                  name="cancelReason"
                  className="hidden"
                  value={reason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                />
                <span className={cn(
                  "text-[13px] font-bold transition-colors",
                  selectedReason === reason ? "text-orange-700" : "text-gray-600"
                )}>
                  {reason}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Other Reason Input */}
        {selectedReason === "Lý do khác" && (
          <div className="space-y-2 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center gap-2 px-1">
              <MessageSquare size={14} className="text-orange-500" />
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Chi tiết lý do khác</label>
            </div>
            <textarea
              rows={3}
              className="w-full px-4 py-3 text-[13px] border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-gray-500 transition-all placeholder:text-gray-300 resize-none bg-gray-50/50 font-medium"
              placeholder="Vui lòng cho chúng tôi biết thêm thông tin..."
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              maxLength={200}
            />
          </div>
        )}
      </div>
    </PortalModal>
  );
};