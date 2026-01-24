"use client";

import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { Pencil } from "lucide-react";

export const SettingCard = ({
  title,
  desc,
  isActive,
  onToggle,
  isLoading = false,
  showEditButton = false,
}: any) => {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-custom overflow-hidden transition-all group">
      <div className="p-8 flex items-center justify-between gap-6">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-800 uppercase leading-none italic">
              {title}
            </h2>
            <div
              className={cn(
                "w-2.5 h-2.5 rounded-full",
                isActive ? "bg-green-500 animate-pulse" : "bg-gray-300",
              )}
            />
          </div>
          <p className="text-sm text-gray-500 italic font-medium">
            {desc}
            {isActive && (
              <span className="ml-2 text-orange-500 font-bold tracking-tighter">
                [ĐÃ KÍCH HOẠT]
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            disabled={isLoading}
            onClick={onToggle}
            className={cn(
              "w-16 h-9 rounded-full p-1.5 transition-all duration-500 flex items-center shadow-inner relative disabled:opacity-50",
              isActive ? "bg-orange-500" : "bg-gray-200",
            )}
          >
            <motion.div
              layout
              className="w-6 h-6 bg-white rounded-full shadow-lg"
              animate={{ x: isActive ? 28 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          </button>

          {showEditButton && (
            <button
              type="button"
              className="p-3 rounded-3xl transition-all bg-gray-50 text-gray-400 border border-gray-100 hover:border-orange-200 hover:text-orange-500"
            >
              <Pencil size={18} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
