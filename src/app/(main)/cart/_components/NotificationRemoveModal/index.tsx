"use client";

import React from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { PortalModal } from "@/features/PortalModal"; // Đảm bảo đường dẫn đúng

interface NotificationRemoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  count?: number;
  itemName?: string;
  isLoading?: boolean;
}

export const NotificationRemoveModal: React.FC<
  NotificationRemoveModalProps
> = ({ isOpen, onClose, onConfirm, count, itemName, isLoading = false }) => {
  const isBulk = !!count;

  const titleText = isBulk ? `Xóa ${count} sản phẩm` : "Xóa sản phẩm";

  const messageContent = isBulk ? (
    <>
      Bạn có chắc chắn muốn xóa <b>{count}</b> sản phẩm đang được chọn không?
    </>
  ) : (
    <>
      Bạn có chắc chắn muốn xóa <b>{itemName}</b>?
    </>
  );

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      title="Xác nhận xóa"
      width="max-w-md"
      footer={
        <>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Hủy bỏ
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            // UPDATE UI: Màu cam gạch (Orange)
            className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 shadow-sm shadow-orange-200 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Trash2 size={16} />
            {titleText}
          </button>
        </>
      }
    >
      <div className="space-y-3">
        {/* UPDATE UI: Icon nền cam nhẹ */}
        <div className="p-3 bg-orange-50 rounded-xl w-fit text-orange-600">
          <AlertTriangle size={24} />
        </div>
        <div>
          <h4 className="font-bold text-gray-800">
            Xóa sản phẩm khỏi giỏ hàng?
          </h4>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
            {messageContent} <br />
            Hành động này không thể hoàn tác.
          </p>
        </div>
      </div>
    </PortalModal>
  );
};