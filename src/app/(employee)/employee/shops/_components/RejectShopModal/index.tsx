/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { PortalModal } from "@/features/PortalModal";
import { FormInput, ButtonField } from "@/components";
import { AlertCircle, XCircle, Info, BadgeAlert } from "lucide-react";

interface RejectShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  shopName?: string;
  isLoading?: boolean;
  title?: React.ReactNode;
  subTitle?: string;
}

export const RejectShopModal: React.FC<RejectShopModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  shopName,
  isLoading,
  title,
  subTitle = "Đối tượng xử lý",
}) => {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (isOpen) setReason("");
  }, [isOpen]);

  const handleConfirm = async () => {
    if (!reason.trim()) return;
    await onConfirm(reason);
  };

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      width="max-w-md"
      title={
        title || ( // 🟢 Default title nếu không truyền
          <div className="flex items-center gap-3 text-rose-600">
            <XCircle size={22} strokeWidth={2.5} />
            <span className="font-bold uppercase text-[13px] tracking-widest">
              Từ chối phê duyệt
            </span>
          </div>
        )
      }
    >
      <div className="space-y-6 py-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="p-4 bg-rose-50/50 rounded-2xl border border-rose-100/50 flex gap-4 items-center">
          <div className="p-2 bg-white rounded-xl shadow-sm text-rose-500">
            <AlertCircle size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-rose-400 uppercase tracking-tighter">
              {subTitle}
            </span>
            <p className="text-xs font-bold text-rose-900">
              Shop: {shopName || "N/A"}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <FormInput
            isTextArea
            label="Lý do chi tiết"
            placeholder="Nêu rõ lý do để người bán điều chỉnh..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-36 rounded-2xl! border-gray-100! focus:border-rose-400!"
            required
          />
          <div className="flex items-center gap-2 ml-1 text-gray-400">
            <Info size={12} />
            <p className="text-[10px] font-medium italic">
              Lý do này sẽ được gửi trực tiếp đến hệ thống thông báo của Shop.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] text-gray-400 hover:bg-gray-100 transition-all active:scale-95"
          >
            Hủy bỏ
          </button>
          <ButtonField
            onClick={handleConfirm}
            type="login"
            loading={isLoading}
            disabled={!reason.trim() || isLoading}
            className="w-44! h-12 bg-rose-600! hover:bg-rose-700! border-0 rounded-xl shadow-lg shadow-rose-500/20 text-[11px] font-bold uppercase tracking-widest"
          >
            Xác nhận từ chối
          </ButtonField>
        </div>
      </div>
    </PortalModal>
  );
};
