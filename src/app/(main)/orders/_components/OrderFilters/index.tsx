"use client";

import React, { useMemo } from "react";
import { Search, X, Filter } from "lucide-react";
import { STATUS_OPTIONS, OrderFiltersProps } from "../../_types/order";
import { SelectComponent } from "@/components/SelectComponent";
import _ from "lodash";

export const OrderFilters: React.FC<OrderFiltersProps> = ({
  searchText,
  statusFilter,
  onSearchChange,
  onStatusChange,
}) => {
  const statusOptions = useMemo(() => 
    STATUS_OPTIONS.map(option => ({
      label: option.label,
      value: option.value
    })), 
  []);

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full items-end">
      <div className="relative flex-1 w-full group">
        <label className="text-[10px] font-semibold uppercase text-slate-400 ml-1 mb-1.5 block tracking-[0.15em]">
          Tìm kiếm đơn hàng
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors duration-300">
            <Search size={18} strokeWidth={2.5} />
          </div>
          <input
            type="text"
            placeholder="Mã đơn hàng hoặc tên sản phẩm..."
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-12 pl-12 pr-12 rounded-2xl border border-slate-200 bg-white text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all duration-300 shadow-sm shadow-slate-100"
          />
          
          {/* Nút Clear nhanh bằng Lodash check empty */}
          {!_.isEmpty(searchText) && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-all active:scale-90"
            >
              <X size={16} strokeWidth={3} />
            </button>
          )}
        </div>
      </div>

      <div className="w-full md:w-72 group">
        <label className="text-[10px] font-semibold uppercase text-slate-400 ml-1 mb-1.5 tracking-[0.15em] flex items-center gap-1.5">
          <Filter size={10} strokeWidth={3} /> Trạng thái
        </label>
        <SelectComponent
          options={statusOptions}
          value={statusFilter}
          onChange={(val) => onStatusChange(val as string)}
          placeholder="Tất cả trạng thái"
          className="shadow-sm shadow-slate-100"
        />
      </div>
    </div>
  );
};