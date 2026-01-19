"use client";

import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import _ from "lodash";
import { Search, X } from "lucide-react";
import { useOrderContext } from "../../_contexts/OrderContext";

// Import từ constants mới đã refactor
import { 
  ORDER_STATUS_TABS, 
  getCountFromApi 
} from "../../_constants/order.constants";

export const OrderFilters = () => {
  const { state, actions } = useOrderContext();
  const { searchText, statusFilter, orderCounts } = state;

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* --- Search Bar --- */}
      <div className="relative group w-full">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500 transition-colors">
          <Search size={18} strokeWidth={2.5} />
        </div>
        <input
          type="text"
          placeholder="Mã đơn hàng, tên sản phẩm..."
          value={searchText}
          onChange={(e) => actions.onSearchChange(e.target.value)}
          className="w-full h-12 pl-14 pr-12 rounded-full border-2 border-gray-100 bg-white text-sm font-semibold placeholder:text-gray-500 focus:outline-none focus:border-gray-500 focus:ring-4 focus:ring-orange-50 transition-all duration-300"
        />
        {!_.isEmpty(searchText) && (
          <button
            onClick={() => actions.onSearchChange("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500 p-2 transition-all active:scale-90"
          >
            <X size={18} strokeWidth={3} />
          </button>
        )}
      </div>

      {/* --- Status Tabs --- */}
      <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
        <div className="inline-flex items-center gap-2 p-1.5 rounded-full border border-gray-100 bg-gray-50/80 shadow-inner">
          {ORDER_STATUS_TABS.map((tab) => {
            // Logic so sánh Enum
            const isSelected = statusFilter === tab.value;
            
            // Logic lấy số lượng từ API helper
            const countValue = getCountFromApi(tab.value, orderCounts);

            return (
              <button
                key={tab.value}
                onClick={() => actions.setStatusFilter(tab.value)}
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
                    className="absolute inset-0 bg-orange-500 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                {/* Tab Label */}
                <span className="relative z-10">{tab.label}</span>
                
                {/* Count Badge */}
                {countValue > 0 && (
                  <span
                    className={cn(
                      "relative z-10 px-2 py-0.5 rounded-full text-[9px] font-bold transition-colors min-w-[18px] text-center",
                      isSelected
                        ? "bg-white text-orange-600"
                        : "bg-gray-200 text-gray-500"
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