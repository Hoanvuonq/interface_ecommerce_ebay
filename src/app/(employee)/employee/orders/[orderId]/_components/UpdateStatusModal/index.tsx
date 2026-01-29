"use client";

import React, { useState } from "react";
import { PortalModal } from "@/features/PortalModal";
import { FormInput, SelectComponent, CustomButtonActions } from "@/components";
import { useToast } from "@/hooks/useToast";
import { RefreshCw, ClipboardEdit, AlertCircle } from "lucide-react";
import { cn } from "@/utils/cn";

interface UpdateStatusModalProps {
  visible: boolean;
  currentStatus: string;
  orderNumber: string;
  onClose: () => void;
  onConfirm: (newStatus: string, note?: string) => Promise<void>;
}

export const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({
  visible,
  currentStatus,
  orderNumber,
  onClose,
  onConfirm,
}) => {
  const { success, error: toastError } = useToast();

  const [newStatus, setNewStatus] = useState<string>("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const getAvailableStatuses = (current: string) => {
    const statusFlow: Record<string, { value: string; label: string }[]> = {
      PENDING: [
        { value: "PAID", label: "Đã thanh toán" },
        { value: "CANCELLED", label: "Đã hủy" },
      ],
      PAID: [
        { value: "FULFILLING", label: "Đang chuẩn bị hàng" },
        { value: "CANCELLED", label: "Đã hủy" },
      ],
      FULFILLING: [
        { value: "SHIPPED", label: "Đang giao hàng" },
        { value: "CANCELLED", label: "Đã hủy" },
      ],
      SHIPPED: [
        { value: "DELIVERED", label: "Đã giao hàng" },
        { value: "RETURNED", label: "Hoàn trả" },
      ],
      DELIVERED: [{ value: "COMPLETED", label: "Hoàn thành đơn" }],
      RETURNED: [{ value: "REFUNDED", label: "Đã hoàn tiền" }],
    };

    return statusFlow[current] || [];
  };

  const handleOk = async () => {
    if (!newStatus) {
      toastError("Vui lòng chọn trạng thái mới");
      return;
    }

    setLoading(true);
    try {
      await onConfirm(newStatus, note || undefined);
      success("Cập nhật trạng thái thành công!");
      handleClose();
    } catch (error: any) {
      toastError(error.message || "Không thể cập nhật trạng thái");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setNewStatus("");
    setNote("");
    onClose();
  };

  const availableStatuses = getAvailableStatuses(currentStatus);

  return (
    <PortalModal
      isOpen={visible}
      onClose={handleClose}
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
            <RefreshCw size={20} strokeWidth={2.5} />
          </div>
          <span className="font-bold  text-gray-800 uppercase text-sm tracking-tight">
            Cập nhật trạng thái{" "}
            <span className="text-blue-600">#{orderNumber}</span>
          </span>
        </div>
      }
      width="max-w-md"
      footer={
        <CustomButtonActions
          onCancel={handleClose}
          onSubmit={handleOk}
          isLoading={loading}
          isDisabled={availableStatuses.length === 0}
          submitText="Xác nhận cập nhật"
          cancelText="Hủy"
          className="bg-blue-600 hover:bg-blue-700 shadow-blue-100"
        />
      }
    >
      <div className="space-y-6 py-2">
        {/* Cảnh báo nếu không có trạng thái khả dụng */}
        {availableStatuses.length === 0 && (
          <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl animate-in fade-in zoom-in-95">
            <AlertCircle size={18} className="text-rose-500 mt-0.5" />
            <p className="text-xs font-bold text-rose-600 leading-relaxed uppercase tracking-tight">
              Đơn hàng này đang ở trạng thái cuối cùng hoặc không thể cập nhật
              thêm theo quy trình hệ thống.
            </p>
          </div>
        )}

        {/* Lựa chọn trạng thái */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-widest  text-gray-400 ml-1 flex items-center gap-2">
            <ClipboardEdit size={14} /> Trạng thái tiếp theo
          </label>
          <SelectComponent
            options={availableStatuses}
            value={newStatus}
            onChange={(val) => setNewStatus(val)}
            placeholder="Chọn trạng thái để tiếp tục..."
            disabled={availableStatuses.length === 0}
            className={cn(
              "h-14 rounded-2xl border-slate-100 bg-slate-50/50 shadow-sm transition-all",
              availableStatuses.length === 0 &&
                "opacity-50 grayscale cursor-not-allowed",
            )}
          />
        </div>

        {/* Ghi chú */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-widest  text-gray-400 ml-1">
            Ghi chú nội bộ (tùy chọn)
          </label>
          <FormInput
            isTextArea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Nhập lý do hoặc hướng dẫn xử lý cho nhân viên khác..."
            className="min-h-30 p-4 bg-slate-50/50 border-slate-100 rounded-2xl text-sm font-medium focus:bg-white transition-all"
            maxLength={500}
          />
          <div className="flex justify-end pr-2">
            <span
              className={cn(
                "text-[10px] font-bold tracking-widest uppercase",
                note.length >= 450 ? "text-rose-500" : " text-gray-300",
              )}
            >
              {note.length}/500
            </span>
          </div>
        </div>

        {/* Hint UI */}
        <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 flex items-start gap-3">
          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-1.5 shrink-0" />
          <p className="text-[10px] font-bold text-amber-700/70 leading-relaxed uppercase tracking-wide">
            Hành động này sẽ thay đổi luồng vận hành của đơn hàng. Hệ thống sẽ
            ghi nhận người thực hiện và thời gian cập nhật.
          </p>
        </div>
      </div>
    </PortalModal>
  );
};
