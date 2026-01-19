"use client";

import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useClickOutside } from "@/hooks/useClickOutside";
import { X, Search, Loader2, LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";

interface PickupModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon: LucideIcon;
  searchText: string;
  onSearchChange: (val: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  children: React.ReactNode;
}

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
        <div className="absolute inset-0 z-[100] flex flex-col justify-end overflow-hidden pointer-events-none">
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
            {/* Handle bar */}
            <div className="flex justify-center py-3 shrink-0">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
            </div>

            {/* Common Header & Search */}
            <div className="px-5 pb-4 border-b border-gray-50 shrink-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500 rounded-2xl text-white shadow-lg shadow-orange-100">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-800 uppercase tracking-tight">{title}</h3>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  placeholder={placeholder || "Tìm kiếm..."}
                  value={searchText}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full bg-gray-50 border border-transparent rounded-2xl py-3 pl-11 pr-4 text-sm outline-none focus:bg-white focus:ring-4 focus:ring-orange-50/50 transition-all shadow-inner"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar bg-white p-4 min-h-0">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Đang tải dữ liệu...</span>
                </div>
              ) : children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};