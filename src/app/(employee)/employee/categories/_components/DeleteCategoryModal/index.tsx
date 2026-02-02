"use client";

import React from "react";
import { AlertCircle, Trash2 } from "lucide-react";
import { PortalModal } from "@/features/PortalModal";
import { CategoryResponse } from "@/types/categories/category.detail";
import { cn } from "@/utils/cn";

interface DeleteCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string, version: string) => void;
  category: CategoryResponse | null;
  isLoading?: boolean;
}

export const DeleteCategoryModal: React.FC<DeleteCategoryModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  category,
  isLoading = false,
}) => {
  if (!category) return null;

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      width="max-w-md"
      className="rounded-[2.5rem]"
    >
      <div className="flex flex-col items-center text-center p-4">
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-3xl flex items-center justify-center animate-pulse">
            <Trash2 size={40} strokeWidth={1.5} />
          </div>
          <div className="absolute -top-2 -right-2 bg-white p-1 rounded-full shadow-sm border border-orange-100">
            <AlertCircle className="text-orange-600" size={24} />
          </div>
        </div>

        <h3 className="text-xl font-extrabold uppercase italic tracking-tight text-gray-900">
          Terminate Asset?
        </h3>

        <div className="mt-4 p-4 bg-orange-50/30 rounded-2xl border border-dashed border-orange-200 w-full">
          <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-1">
            Xác nhận xóa danh mục
          </p>
          <p className="text-sm font-bold text-orange-600 truncate uppercase">
            {category.name}
          </p>
        </div>

        <p className="text-[11px] font-medium text-gray-400 mt-4 leading-relaxed px-4">
          Hành động này không thể hoàn tác. Mọi dữ liệu liên quan đến danh mục
          này sẽ bị loại bỏ khỏi hệ thống.
        </p>

        <div className="grid grid-cols-2 gap-4 w-full mt-8">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="py-4 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em] transition-all active:scale-95 disabled:opacity-50"
          >
            Abort
          </button>

          <button
            onClick={() =>
              onConfirm(category.id, String(category.version || ""))
            }
            disabled={isLoading}
            className={cn(
              "py-4 rounded-2xl text-white text-[10px] font-bold uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center disabled:opacity-50",
              "bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-200",
            )}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Purge"
            )}
          </button>
        </div>
      </div>
    </PortalModal>
  );
};
