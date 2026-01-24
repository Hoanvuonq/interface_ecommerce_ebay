import React from "react";
import { Search, Calendar } from "lucide-react";

interface OrderFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export const OrderFilters: React.FC<OrderFiltersProps> = ({
  search,
  onSearchChange,
}) => {
  return (
    <div className="p-4 border-b border-gray-200 dark:border-[#3b4754]">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              className="w-full h-10 pl-10 pr-4 rounded-lg text-sm bg-gray-50 dark:bg-[#283039] border border-gray-200 dark:border-[#3b4754] text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white dark:focus:bg-[#1c2127] transition-colors"
              placeholder="Tìm kiếm mã đơn hàng, tên khách hàng..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Date Range */}
        <div className="sm:w-64">
          <button className="w-full h-10 px-3 rounded-lg bg-gray-50 dark:bg-[#283039] border border-gray-200 dark:border-[#3b4754] text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#3b4754] transition-colors flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calendar size={16} />
              <span>Khoảng thời gian</span>
            </span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

