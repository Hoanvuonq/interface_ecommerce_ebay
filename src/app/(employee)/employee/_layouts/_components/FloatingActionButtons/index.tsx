"use client";

import React, { useState } from "react";
import { MessageCircle, X, Users, MessageSquare } from "lucide-react";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";

export const FloatingActionButtons = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed right-6 bottom-6 z-40 flex flex-col gap-3 items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="flex flex-col gap-3 mb-2"
          >
            <div className="flex items-center gap-3 group">
              <span className="bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                Chat nội bộ
              </span>
              <button className="w-12 h-12 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center text-blue-600 hover:scale-110 transition-all active:scale-95">
                <Users size={20} />
              </button>
            </div>

            <div className="flex items-center gap-3 group">
              <span className="bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                Chat hỗ trợ
              </span>
              <button className="w-12 h-12 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center text-orange-500 hover:scale-110 transition-all active:scale-95">
                <MessageSquare size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-2xl shadow-lg flex items-center justify-center text-white transition-all duration-300 active:scale-90",
          isOpen
            ? "bg-slate-900 rotate-45 shadow-slate-200"
            : "bg-gradient-to-br from-orange-500 to-amber-600 shadow-orange-500/30"
        )}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
};