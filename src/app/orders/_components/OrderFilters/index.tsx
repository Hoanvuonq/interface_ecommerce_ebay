import React from "react";
import { Search, Filter, ChevronDown, X } from "lucide-react";
import { STATUS_OPTIONS, OrderFiltersProps } from "../../_types/order";

export const OrderFilters: React.FC<OrderFiltersProps> = ({
  searchText,
  statusFilter,
  onSearchChange,
  onStatusChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
      <div className="relative flex-1 group">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors">
          <Search size={20} />
        </div>
        <input
          type="text"
          placeholder="Tìm theo mã đơn hàng hoặc tên sản phẩm"
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-12 pl-11 pr-10 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all shadow-sm"
        />
        {searchText && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="relative w-full sm:w-60 group">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors pointer-events-none">
          <Filter size={20} />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full h-12 pl-11 pr-10 appearance-none rounded-xl border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all shadow-sm cursor-pointer"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <ChevronDown size={16} />
        </div>
      </div>
    </div>
  );
};
