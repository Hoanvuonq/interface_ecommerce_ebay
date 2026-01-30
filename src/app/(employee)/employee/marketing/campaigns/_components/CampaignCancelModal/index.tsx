/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { CustomButtonActions, FormInput } from "@/components";
import { PortalModal } from "@/features/PortalModal";
import { cn } from "@/utils/cn";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import React, { useState } from "react";

interface CampaignCancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  campaignName: string;
  isProcessing: boolean;
}

const CAMPAIGN_REASONS = [
  "Sai sót trong thông tin cấu hình (Tên, mô tả...)",
  "Lỗi thiết lập thời gian/khung giờ",
  "Yêu cầu từ phía nhà bán hàng (Shop)",
  "Sản phẩm tham gia không đủ điều kiện/Hết hàng",
  "Chiến dịch bị trùng lặp hoặc không còn hiệu quả",
  "Vi phạm quy định/chính sách nền tảng",
  "Lý do khác (Vui lòng ghi rõ)",
];

export const CampaignCancelModal: React.FC<CampaignCancelModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  campaignName,
  isProcessing,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [otherReason, setOtherReason] = useState<string>("");

  const handleConfirm = () => {
    const finalReason =
      selectedReason === "Lý do khác (Vui lòng ghi rõ)"
        ? otherReason
        : selectedReason;
    onConfirm(finalReason);
  };

  const isButtonDisabled =
    isProcessing ||
    !selectedReason ||
    (selectedReason.startsWith("Lý do khác") && !otherReason.trim());

  const modalTitle = (
    <div className="flex items-center gap-3">
      <div className="p-2.5 bg-orange-50 rounded-2xl text-orange-500 shadow-sm border border-orange-100">
        <ShieldAlert size={22} strokeWidth={2.5} />
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-800 tracking-tight leading-none uppercase">
          Dừng chiến dịch
        </h3>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1.5 truncate max-w-75">
          Target: {campaignName}
        </p>
      </div>
    </div>
  );

  const modalFooter = (
    <div className="flex items-center justify-end gap-3 w-full border-t border-gray-50 pt-4">
      <CustomButtonActions
        cancelText="Hủy bỏ thao tác"
        submitText={isProcessing ? "Đang xử lý..." : "Xác nhận dừng ngay"}
        onCancel={onClose}
        onSubmit={handleConfirm}
        containerClassName="w-full flex gap-3 border-t-0 p-0"
        className="w-56! rounded-2xl font-black uppercase text-[11px] h-12 shadow-lg shadow-orange-100"
        disabled={isButtonDisabled}
      />
    </div>
  );

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      footer={modalFooter}
      width="max-w-xl"
      className="rounded-[2.5rem] overflow-hidden"
      preventCloseOnClickOverlay={isProcessing}
    >
      <div className="space-y-6 py-2">
        {/* Banner cảnh báo */}
        <div className="p-5 bg-orange-50/50 rounded-3xl border border-orange-100 flex gap-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-400" />
          <AlertTriangle className="text-orange-500 shrink-0" size={24} />
          <p className="text-[13px] text-orange-900 leading-relaxed font-medium">
            <span className="font-black uppercase text-[10px] block mb-1 tracking-wider">
              Cảnh báo hệ thống:
            </span>
            Việc dừng chiến dịch sẽ khiến tất cả các sản phẩm đang tham gia bị{" "}
            <span className="font-bold underline decoration-orange-300 underline-offset-4">
              gỡ bỏ khuyến mãi
            </span>{" "}
            ngay lập tức. Hành động này không thể hoàn tác.
          </p>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black text-gray-400 uppercase px-1 tracking-[0.15em] flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
            Vui lòng chọn lý do dừng
          </label>

          <div className="grid gap-2.5 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
            {CAMPAIGN_REASONS.map((reason) => (
              <label
                key={reason}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer group",
                  selectedReason === reason
                    ? "bg-orange-50/40 border-orange-200 shadow-sm shadow-orange-100/50"
                    : "bg-white border-gray-100 hover:border-orange-100 hover:bg-gray-50/30",
                )}
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                    selectedReason === reason
                      ? "border-orange-500 bg-orange-500 shadow-md shadow-orange-200"
                      : "border-gray-200 group-hover:border-orange-300",
                  )}
                >
                  {selectedReason === reason && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  )}
                </div>

                <input
                  type="radio"
                  name="cancelReason"
                  className="hidden"
                  value={reason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                />

                <span
                  className={cn(
                    "text-[13px] font-bold transition-colors duration-300",
                    selectedReason === reason
                      ? "text-orange-700"
                      : "text-gray-500 group-hover:text-gray-700",
                  )}
                >
                  {reason}
                </span>
              </label>
            ))}
          </div>
        </div>

        {selectedReason.includes("Lý do khác") && (
          <div className="animate-in fade-in slide-in-from-top-3 duration-500">
            <FormInput
              isTextArea
              label="Chi tiết lý do hệ thống"
              required
              rows={3}
              placeholder="Nhập nội dung ghi chú chi tiết cho hệ thống..."
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              className="font-bold text-gray-700 bg-gray-50/30 border-2 border-gray-100" // Custom thêm style để khớp Modal
              containerClassName="space-y-3"
            />
          </div>
        )}
      </div>
    </PortalModal>
  );
};
