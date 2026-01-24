import React from "react";
import { Search, Calendar } from "lucide-react";
import { FormInput } from "@/components";

interface OrderFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export const OrderFilters: React.FC<OrderFiltersProps> = ({
  search,
  onSearchChange,
}) => {
  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <div className="md:col-span-5 relative group">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500 transition-colors z-10"
            />
            <FormInput
              placeholder="Tìm kiếm mã đơn hàng, tên khách hàng..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full h-12 pl-10 pr-4 transition-all"
            />
          </div>
        </div>

        <div className="sm:w-64">
          <button className="w-full h-12 px-3 rounded-2xl bg-gray-50 dark:bg-[#283039] border border-gray-200 dark:border-[#3b4754] text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#3b4754] transition-colors flex items-center justify-between">
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
