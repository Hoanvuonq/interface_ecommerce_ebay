"use client";

import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import _ from "lodash";
import { Search, X } from "lucide-react";
import { useOrderContext } from "../../_contexts/OrderContext";
import { MAP_COUNT_KEY, STATUS_OPTIONS } from "../../_types/order";

export const OrderFilters = () => {
  const { state, actions } = useOrderContext();
  const { searchText, statusFilter, orderCounts } = state;

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="relative group w-full">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors">
          <Search size={18} strokeWidth={2.5} />
        </div>
        <input
          type="text"
          placeholder="Mã đơn hàng, tên sản phẩm..."
          value={searchText}
          onChange={(e) => actions.onSearchChange(e.target.value)}
          className="w-full h-12 pl-14 pr-12 rounded-full border-2 border-gray-100 bg-white text-sm font-bold placeholder:text-gray-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-50 transition-all duration-300"
        />
        {!_.isEmpty(searchText) && (
          <button
            onClick={() => actions.onSearchChange("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-red-500 p-2 transition-all active:scale-90"
          >
            <X size={18} strokeWidth={3} />
          </button>
        )}
      </div>

      <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
        <div className="inline-flex items-center gap-2 p-1.5 rounded-full border border-gray-100 bg-gray-50/80 shadow-inner">
          {STATUS_OPTIONS.map((option) => {
            const isSelected = statusFilter === option.value;
            const countKey = MAP_COUNT_KEY[option.value];
            const countValue = orderCounts ? (orderCounts as any)[countKey] : 0;

            return (
              <button
                key={option.value}
                onClick={() => actions.setStatusFilter(option.value)}
                className={cn(
                  "relative px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
                  "transition-all duration-500 flex items-center gap-2 whitespace-nowrap overflow-hidden",
                  isSelected
                    ? "text-white shadow-lg shadow-orange-200"
                    : "text-gray-500 hover:text-gray-900 hover:bg-white/80"
                )}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeTabOrders"
                    className="absolute inset-0 bg-orange-500"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{option.label}</span>
                {countValue > 0 && (
                  <span
                    className={cn(
                      "relative z-10 px-2 py-0.5 rounded-full text-[9px] font-bold transition-colors min-w-4.5 text-center",
                      isSelected
                        ? "bg-white text-orange-600"
                        : "bg-gray-200 text-gray-400"
                    )}
                  >
                    {countValue > 99 ? "99+" : countValue}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
