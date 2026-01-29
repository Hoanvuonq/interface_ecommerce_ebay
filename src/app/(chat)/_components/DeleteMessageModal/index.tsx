"use client";

import React from "react";
import _ from "lodash";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Loader2 } from "lucide-react";
import { DeleteMessageModalProps } from "./type";

export const DeleteMessageModal: React.FC<DeleteMessageModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-1001 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px]"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-100 overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
                  <AlertTriangle size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">
                    Thu hồi tin nhắn
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                    Bạn có muốn thu hồi tin nhắn này? (Tin nhắn sẽ bị xóa khỏi
                    cuộc trò chuyện của mọi người).
                  </p>
                </div>
                <button
                  onClick={onCancel}
                  className="text-gray-600 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 bg-gray-50 px-6 py-4">
              <button
                onClick={onCancel}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-xl transition-all"
              >
                Hủy
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-6 py-2 text-sm font-bold text-white rounded-xl shadow-lg shadow-red-200 transition-all disabled:bg-red-300"
              >
                {isLoading && <Loader2 size={16} className="animate-spin" />}
                Thu hồi
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
