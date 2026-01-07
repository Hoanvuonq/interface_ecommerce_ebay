"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { IPortalModal } from "./type";
import { cn } from "@/utils/cn";

export const PortalModal: React.FC<IPortalModal> = ({
  isOpen,
  onClose,
  children,
  title,
  footer,
  width = "max-w-lg",
  className = "",
  preventCloseOnClickOverlay = false,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6 font-sans">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !preventCloseOnClickOverlay && onClose()}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              `
              relative w-full ${width} bg-white rounded-2xl shadow-2xl flex flex-col 
              overflow-hidden border border-gray-100 z-10 max-h-[90vh] 
              ${className}
            `
            )}
          >
            {title && (
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-white sticky top-0 z-20">
                <div className="text-base font-bold text-gray-800">{title}</div>
                <button
                  onClick={onClose}
                  className="p-2 cursor-pointer text-gray-600 hover:text-orange-600 hover:bg-amber-50 rounded-lg transition-colors hover:scale-105 focus:outline-none"
                >
                  <X size={20} />
                </button>
              </div>
            )}

            <div className="p-4 overflow-y-auto custom-scrollbar flex-1 relative">
              {children}
            </div>

            {footer && (
              <div className="bg-gray-50 px-6 py-2 border-t border-gray-100 flex justify-end gap-2 sticky bottom-0 z-20">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};
