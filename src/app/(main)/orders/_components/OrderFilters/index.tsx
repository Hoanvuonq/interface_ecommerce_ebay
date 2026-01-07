"use client";

import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import _ from "lodash";
import { Search, X } from "lucide-react";
import React from "react";
import { OrderFiltersProps, STATUS_OPTIONS } from "../../_types/order";

interface ExtendedOrderFiltersProps extends OrderFiltersProps {
  onRefresh: () => void;
  isLoading?: boolean;
}

export const OrderFilters: React.FC<ExtendedOrderFiltersProps> = ({
  searchText,
  statusFilter,
  onSearchChange,
  onStatusChange,
  onRefresh,
  isLoading,
}) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col md:flex-row items-end gap-4 w-full">
        <div className="relative flex-1 group w-full">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-(--color-mainColor)O] transition-colors duration-300">
              <Search size={18} strokeWidth={3} />
            </div>
            <input
              type="text"
              placeholder="Mã đơn hàng, tên sản phẩm..."
              value={searchText}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full h-12 pl-12 pr-12 rounded-2xl border-2 border-gray-100 bg-white text-sm font-medium text-gray-900 placeholder:text-gray-600 focus:outline-none focus:border-[#ff7300] focus:ring-4 focus:ring-orange-50 transition-all duration-300 "
            />
            {!_.isEmpty(searchText) && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-red-500 p-1.5 transition-all active:scale-90"
              >
                <X size={18} strokeWidth={3} />
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="w-full overflow-hidden">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-1 p-2 rounded-full border border-gray-200 bg-white text-gray-600 text-[11px] font-semibold"> 
              {STATUS_OPTIONS.map((option) => {
                const isSelected = statusFilter === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => onStatusChange(option.value)}
                    className={cn(
                      "relative px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap",
                      isSelected 
                        ? "text-white" 
                        : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
                    )}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="activeTabOrders"
                        className="absolute inset-0 bg-(--color-mainColor) rounded-full shadow-lg shadow-orange-300/50"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};