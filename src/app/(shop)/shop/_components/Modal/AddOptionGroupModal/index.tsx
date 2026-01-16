"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Grid2X2Plus,
  Tag as TagIcon,
  Check,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import { PortalModal } from "@/features/PortalModal";
import { cn } from "@/utils/cn";
import { CustomButtonActions, FormInput } from "@/components";

interface AddOptionGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
  existingGroups: string[];
}

export const AddOptionGroupModal: React.FC<AddOptionGroupModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  existingGroups,
}) => {
  const [name, setName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName("");
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onConfirm(name.trim());
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  const footerContent = (
    <CustomButtonActions
      isDisabled={!name.trim()}
      cancelText="Hủy bỏ"
      submitText="Thêm mới"
      submitIcon={Check}
      onCancel={onClose}
      onSubmit={handleSubmit}
      containerClassName="w-full flex gap-3 border-t-0"
      className="w-34! h-12 rounded-4xl"
    />
  );

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center bg-linear-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200/50 shadow-inner">
            <Grid2X2Plus
              size={24}
              className="text-orange-600"
              strokeWidth={2}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-gray-900 font-extrabold text-xl  leading-none">
              Thêm phân loại
            </span>
            <span className="text-[10px] text-gray-400 uppercase font-bold  mt-1">
              Thiết lập thuộc tính sản phẩm
            </span>
          </div>
        </div>
      }
      footer={footerContent}
      width="max-w-lg"
    >
      <div className="flex flex-col gap-8 pt-6 pb-2">
        <div className="relative group overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-r from-orange-500/5 to-pink-500/5 opacity-100 group-hover:opacity-150 transition-opacity" />
          <div className="relative flex gap-4 p-5 rounded-2xl border border-orange-100/50">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
              <Lightbulb size={16} className="text-orange-600" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="font-bold uppercase text-[10px] text-orange-600">
                  Gợi ý phổ biến
                </span>
                <Sparkles size={10} className="text-orange-400 animate-pulse" />
              </div>
              <p className="text-[13px] font-medium text-gray-600 leading-relaxed">
                Màu sắc, Kích thước, Dung lượng, Chất liệu...
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {/* Phần Label và Counter giữ bên ngoài để linh hoạt */}
          <div className="flex justify-between items-end px-1">
            <label className="text-[11px] font-semibold text-gray-400 uppercase ">
              Tên nhóm phân loại
            </label>
            <span
              className={cn(
                "text-[10px] font-bold tabular-nums transition-colors",
                name.length >= 45 ? "text-red-500" : "text-gray-300"
              )}
            >
              {name.length}/50
            </span>
          </div>

          <div className="relative group">
            {/* Icon bên trái - Tận dụng tính chất absolute của nó */}
            <div
              className={cn(
                "absolute left-5 top-1/2 -translate-y-1/2 z-10 transition-all duration-300 pointer-events-none",
                name ? "text-orange-500 scale-110" : "text-gray-300"
              )}
            >
              <TagIcon size={18} />
            </div>

            <FormInput
              ref={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={50}
              placeholder="VD: Kích cỡ, Màu sắc..."
              className="pl-14 pr-6 py-6"
              containerClassName="space-y-0"
            />
          </div>
        </div>

        {/* Existing Groups Tags */}
        {existingGroups.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-2 px-1">
              <div className="h-px flex-1 bg-gray-100" />
              <span className="text-[10px] font-bold text-gray-300 uppercase whitespace-nowrap">
                Đã sử dụng
              </span>
              <div className="h-px flex-1 bg-gray-100" />
            </div>

            <div className="flex flex-wrap gap-2 px-1">
              {existingGroups.map((g, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-[12px] font-bold text-gray-500 shadow-sm hover:border-orange-200 hover:text-orange-600 hover:bg-orange-50/30 transition-all cursor-default select-none"
                >
                  {g}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PortalModal>
  );
};
