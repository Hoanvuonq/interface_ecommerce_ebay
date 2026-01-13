"use client";

import React, { useState, useEffect, useRef } from "react";
import { Grid2X2Plus, Tag as TagIcon, Check, Lightbulb } from "lucide-react";
import { PortalModal } from "@/features/PortalModal";
import { cn } from "@/utils/cn";

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
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onConfirm(name.trim());
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const footerContent = (
    <div className="flex items-center gap-3 w-full justify-end py-2">
      <button
        onClick={onClose}
        className="px-6 py-2.5 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-all active:scale-95"
      >
        Hủy bỏ
      </button>
      <button
        onClick={handleSubmit}
        disabled={!name.trim()}
        className={cn(
          "flex items-center gap-2 px-8 py-2.5 rounded-2xl text-sm font-black text-white transition-all active:scale-95 shadow-lg",
          !name.trim()
            ? "bg-gray-200 cursor-not-allowed shadow-none text-gray-400"
            : "bg-orange-500 hover:bg-orange-600 shadow-orange-500/30"
        )}
      >
        <Check size={18} strokeWidth={3} />
        THÊM MỚI
      </button>
    </div>
  );

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-xl">
            <Grid2X2Plus size={22} className="text-orange-600" strokeWidth={2.5} />
          </div>
          <span className="text-gray-800 font-black text-xl tracking-tight">Thêm nhóm phân loại</span>
        </div>
      }
      footer={footerContent}
      width="max-w-md"
    >
      <div className="flex flex-col gap-6 pt-4">
        {/* Suggestion Box */}
        <div className="flex gap-3 p-4 bg-orange-50/50 rounded-2xl border border-orange-100/50">
          <Lightbulb size={18} className="text-orange-600 shrink-0 mt-0.5" />
          <div className="text-xs font-semibold text-orange-800 leading-relaxed">
            <span className="font-black uppercase tracking-wider text-[10px] block mb-0.5">Gợi ý</span>
            Màu sắc, Kích thước, Dung lượng, Chất liệu hoặc Loại bề mặt...
          </div>
        </div>

        {/* Custom Input Field */}
        <div className="space-y-2">
          <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">
            Tên nhóm phân loại
          </label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors">
              <TagIcon size={18} />
            </div>
            
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={50}
              placeholder="Nhập tên (VD: Kích cỡ)..."
              className={cn(
                "w-full pl-12 pr-16 py-4 bg-gray-50/50 border-2 border-gray-100 rounded-2xl text-base font-bold text-gray-800 outline-none transition-all",
                "placeholder:text-gray-300 placeholder:font-normal",
                "focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 hover:border-gray-200"
              )}
            />
            
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black tabular-nums text-gray-300 group-focus-within:text-orange-400">
              {name.length}/50
            </div>
          </div>
        </div>

        {/* Existing Groups Tags */}
        {existingGroups.length > 0 && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">
              Các nhóm đã có
            </div>
            <div className="flex flex-wrap gap-2">
              {existingGroups.map((g, idx) => (
                <div 
                  key={idx} 
                  className="px-4 py-2 rounded-xl bg-white border border-gray-100 text-xs font-bold text-gray-600 shadow-sm hover:border-orange-200 hover:text-orange-600 transition-all cursor-default"
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