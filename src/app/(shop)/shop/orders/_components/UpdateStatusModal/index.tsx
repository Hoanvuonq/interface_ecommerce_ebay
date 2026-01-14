"use client";

import React, { useEffect, useState } from "react";
import { PortalModal } from "@/features/PortalModal";
import { SelectComponent, FormInput } from "@/components";
import { OrderStatus } from "@/app/(main)/shop/_types/dto/shop.order.dto";
import { Loader2 } from "lucide-react";

interface UpdateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: any) => Promise<void>;
  initialValues?: {
    status: OrderStatus;
    note?: string;
    carrier?: string;
  };
  isLoading?: boolean;
}

export const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    status: OrderStatus.CREATED,
    note: "",
    carrier: "",
  });

  // Đồng bộ dữ liệu khi mở modal
  useEffect(() => {
    if (isOpen && initialValues) {
      setFormData({
        status: initialValues.status,
        note: initialValues.note || "",
        carrier: initialValues.carrier || "",
      });
    }
  }, [isOpen, initialValues]);

  const statusOptions = [
    { value: OrderStatus.CREATED, label: "Đã tạo" },
    { value: OrderStatus.AWAITING_PAYMENT, label: "Chờ thanh toán" },
    { value: OrderStatus.PAID, label: "Đã thanh toán" },
    { value: OrderStatus.FULFILLING, label: "Đang chuẩn bị" },
    { value: OrderStatus.READY_FOR_PICKUP, label: "Chờ lấy hàng" },
    { value: OrderStatus.SHIPPED, label: "Đang giao" },
    { value: OrderStatus.OUT_FOR_DELIVERY, label: "Đang vận chuyển" },
    { value: OrderStatus.DELIVERED, label: "Đã giao" },
    { value: OrderStatus.CANCELLED, label: "Đã hủy" },
    { value: OrderStatus.REFUNDING, label: "Đang hoàn tiền" },
    { value: OrderStatus.REFUNDED, label: "Đã hoàn tiền" },
  ];

  const carrierOptions = [
    { value: "GHN", label: "🚚 GHN - Giao Hàng Nhanh" },
    { value: "SUPERSHIP", label: "📦 SuperShip" },
    { value: "CONKIN", label: "🚛 Conkin" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      title="Cập nhật trạng thái đơn hàng"
      width="max-w-xl"
      footer={
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all active:scale-95"
          >
            Hủy
          </button>
          <button
            type="submit"
            form="update-status-form"
            disabled={isLoading}
            className="px-8 py-2 bg-orange-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all active:scale-95 flex items-center gap-2"
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            Lưu thay đổi
          </button>
        </div>
      }
    >
      <form
        id="update-status-form"
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div className="space-y-2">
          <label className="text-[12px] font-bold text-gray-600 ml-1 uppercase tracking-wider">
            Trạng thái mới <span className="text-red-500">*</span>
          </label>
          <SelectComponent
            options={statusOptions}
            value={formData.status}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, status: val }))
            }
          />
        </div>

        {formData.status === OrderStatus.SHIPPED && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
            <label className="text-[12px] font-bold text-gray-600 ml-1 uppercase tracking-wider">
              Đơn vị vận chuyển (tùy chọn)
            </label>
            <SelectComponent
              placeholder="Chọn đơn vị vận chuyển"
              options={carrierOptions}
              value={formData.carrier}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, carrier: val }))
              }
            />
            <p className="text-[10px] text-gray-400 font-medium ml-1">
              * Mã vận đơn được tạo tự động, chỉ chọn nếu muốn thay thế.
            </p>
          </div>
        )}

        <FormInput
          label="Ghi chú"
          isTextArea
          placeholder="Nhập lý do cập nhật hoặc ghi chú cho đơn hàng..."
          value={formData.note}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, note: e.target.value }))
          }
          className="min-h-32"
        />
      </form>
    </PortalModal>
  );
};
