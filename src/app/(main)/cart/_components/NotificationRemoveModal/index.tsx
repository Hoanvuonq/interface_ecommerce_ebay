"use client";

import React from "react";
import { AlertTriangle, Trash2, Loader2 } from "lucide-react";
import { PortalModal } from "@/features/PortalModal";
import { cn } from "@/utils/cn";

interface NotificationRemoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  count?: number;
  itemName?: string;
  entityName?: string;
  isLoading?: boolean;
}

export const NotificationRemoveModal: React.FC<
  NotificationRemoveModalProps
> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Xác nhận xóa",
  description,
  count,
  itemName,
  entityName = "mục",
  isLoading = false,
}) => {
  const isBulk = typeof count === "number" && count > 0;

  const labelText = isBulk ? `${count} ${entityName}` : entityName;
  const displayItemName = itemName ? `"${itemName}"` : "";

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      width="max-w-md"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-2xl text-[13px] font-bold text-slate-500 hover:bg-slate-100 transition-all disabled:opacity-50 uppercase tracking-tight"
          >
            Hủy bỏ
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              "px-5 py-2.5 rounded-2xl text-[13px] font-bold text-white transition-all flex items-center gap-2 uppercase tracking-tight italic shadow-lg",
              "bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-orange-200 active:scale-95",
              "disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100",
            )}
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Trash2 size={16} strokeWidth={2.5} />
            )}
            Xóa {labelText}
          </button>
        </div>
      }
    >
      <div className="flex flex-col items-center text-center sm:text-left sm:flex-row sm:items-start gap-4 py-2">
        <div className="shrink-0 p-4 bg-orange-50 rounded-3xl text-orange-500 border border-orange-100/50 shadow-inner">
          <AlertTriangle size={32} strokeWidth={2} />
        </div>

        <div className="space-y-2">
          <h4 className="font-bold text-slate-800 text-lg leading-tight uppercase italic tracking-tight">
            Bạn muốn xóa {isBulk ? "các" : ""} {entityName}?
          </h4>

          <div className="text-[13px] text-slate-500 leading-relaxed font-medium">
            {isBulk ? (
              <p>
                Hành động này sẽ xóa vĩnh viễn{" "}
                <span className="text-orange-600 font-bold italic">
                  {count}
                </span>{" "}
                {entityName} đã chọn.
              </p>
            ) : (
              <p>
                Bạn có chắc chắn muốn loại bỏ{" "}
                <span className="text-orange-600 font-bold italic">
                  {displayItemName || entityName}
                </span>{" "}
                khỏi danh sách không?
              </p>
            )}
            {description && (
              <p className="mt-1 text-slate-400">{description}</p>
            )}
            <p className="mt-2 text-red-400 font-bold text-[11px] uppercase tracking-widest flex items-center justify-center sm:justify-start gap-1">
              <span className="w-1 h-1 rounded-full bg-red-400 animate-pulse" />
              Hành động này không thể hoàn tác
            </p>
          </div>
        </div>
      </div>
    </PortalModal>
  );
};
