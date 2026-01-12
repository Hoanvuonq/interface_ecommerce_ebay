"use client";

import React, { useState, useEffect, useRef } from "react";
import { Grid2X2Plus, Tag as TagIcon, Check } from "lucide-react";
import { PortalModal } from "@/features/PortalModal";

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
        className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all active:scale-95"
      >
        Hủy bỏ
      </button>
      <button
        onClick={handleSubmit}
        disabled={!name.trim()}
        className={`
          flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all active:scale-95
          ${!name.trim() 
            ? "bg-gray-300 cursor-not-allowed shadow-none" 
            : "bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
          }
        `}
      >
        <Check size={16} strokeWidth={3} />
        Thêm mới
      </button>
    </div>
  );

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-blue-600">
          <div className="p-1.5 bg-blue-50 rounded-lg">
            <Grid2X2Plus size={20} strokeWidth={2.5} />
          </div>
          <span className="text-gray-800 font-bold text-lg">Thêm nhóm phân loại</span>
        </div>
      }
      footer={footerContent}
      width="max-w-md"
    >
      <div className="flex flex-col gap-5 pt-2">
        {/* Suggestion Text */}
        <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
          <span className="font-semibold text-gray-700">Gợi ý: </span>
          Màu sắc, Kích thước, Dung lượng, Chất liệu...
        </div>

        {/* Input Field Custom */}
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 bg-blue-50 rounded-md border border-blue-100">
            <TagIcon size={12} className="text-blue-600" />
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">Tên nhóm</span>
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={50}
            placeholder="Nhập tên..."
            className="w-full pl-28 pr-12 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
          />
          
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400 group-focus-within:text-blue-500 transition-colors">
            {name.length}/50
          </span>
        </div>

        {/* Existing Groups List */}
        {existingGroups.length > 0 && (
          <div className="mt-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5 ml-1">
              Các nhóm hiện có
            </div>
            <div className="flex flex-wrap gap-2">
              {existingGroups.map((g, idx) => (
                <span 
                  key={idx} 
                  className="inline-flex items-center px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-semibold text-gray-600 shadow-sm select-none"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </PortalModal>
  );
};