"use client";

import { FormInput, SectionLoading } from "@/components";
import { useClickOutside } from "@/hooks/useClickOutside";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import React, { useRef } from "react";
import { PickupModalProps } from "./type";

export const PickupModal: React.FC<PickupModalProps> = ({
  isOpen,
  onClose,
  title,
  icon: Icon,
  searchText,
  onSearchChange,
  placeholder,
  isLoading,
  children,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  useClickOutside(modalRef, onClose);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 z-100 flex flex-col justify-end overflow-hidden pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/30 backdrop-blur-[2px] pointer-events-auto cursor-pointer"
          />

          <motion.div
            ref={modalRef}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-full bg-white rounded-t-[2.5rem] shadow-[0_-10px_50px_rgba(0,0,0,0.2)] border-t border-gray-100 flex flex-col max-h-[90%] pointer-events-auto"
          >
            <div className="flex justify-center py-3 shrink-0">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
            </div>

            <div className="px-5 pb-4 border-b border-gray-50 shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500 rounded-2xl text-white shadow-lg shadow-orange-100">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-800 uppercase tracking-tight">
                    {title}
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="md:col-span-5 relative group">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500 transition-colors z-10"
                />
                <FormInput
                  placeholder={placeholder || "Tìm kiếm..."}
                  value={searchText}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full h-12 pl-10 pr-4 transition-all"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar bg-white p-4 min-h-0">
              {isLoading ? (
                <SectionLoading message=" Đang tải dữ liệu..." />
              ) : (
                children
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
