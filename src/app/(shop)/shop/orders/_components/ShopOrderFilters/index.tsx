"use client";

import React, { useMemo } from "react";
import { FormInput, SelectComponent } from "@/components";
import { FiSearch, FiRefreshCw } from "react-icons/fi";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";

interface ShopOrderFiltersProps {
  dateRange: [Dayjs | null, Dayjs | null];
  setDateRange: (dates: [Dayjs | null, Dayjs | null]) => void;
  searchText: string;
  setSearchText: (text: string) => void;
  carrierFilter: string | undefined;
  setCarrierFilter: (value: string | undefined) => void;
  processingFilter: string;
  setProcessingFilter: (value: string) => void;
  orderTypeFilter: string;
  setOrderTypeFilter: (value: string) => void;
  sortOption: string;
  setSortOption: (value: string) => void;
  handleResetFilters: () => void;
  onSearch: () => void;
}

export const ShopOrderFilters: React.FC<ShopOrderFiltersProps> = ({
  dateRange,
  setDateRange,
  searchText,
  setSearchText,
  carrierFilter,
  setCarrierFilter,
  processingFilter,
  setProcessingFilter,
  orderTypeFilter,
  setOrderTypeFilter,
  sortOption,
  setSortOption,
  handleResetFilters,
  onSearch,
}) => {
  // Memoize options để tránh render lại vô ích
  const filterOptions = useMemo(
    () => ({
      carriers: [
        { value: "GHN", label: "GHN" },
        { value: "SUPERSHIP", label: "SuperShip" },
        { value: "CONKIN", label: "Conkin" },
        { value: "SPX", label: "SPX" },
        { value: "NJV", label: "Ninja Van" },
        { value: "JT", label: "J&T" },
        { value: "VNPOST", label: "VNPost" },
        { value: "VIETTEL", label: "Viettel Post" },
      ],
      processing: [
        { value: "ALL", label: "Tất cả trạng thái" },
        { value: "UNPROCESSED", label: "Chưa xử lý (FULFILLING)" },
        { value: "PROCESSED", label: "Đã xử lý (READY_FOR_PICKUP)" },
        { value: "OVERDUE", label: "Quá hạn (Hạn gửi)" },
      ],
      orderTypes: [
        { value: "ALL", label: "Tất cả loại đơn" },
        { value: "COD", label: "Đơn COD" },
        { value: "ONLINE", label: "Đơn Online (PayOS/Momo...)" },
      ],
      sorting: [
        { value: "DEADLINE_ASC", label: "Hạn gửi gần nhất" },
        { value: "DEADLINE_DESC", label: "Hạn gửi xa nhất" },
        { value: "VALUE_DESC", label: "Giá trị: Cao → Thấp" },
        { value: "VALUE_ASC", label: "Giá trị: Thấp → Cao" },
      ],
    }),
    []
  );

  const handleDateChange = (index: 0 | 1, value: string) => {
    const newDate = value ? dayjs(value) : null;
    const newRange: [Dayjs | null, Dayjs | null] = [...dateRange];
    newRange[index] = newDate;
    setDateRange(newRange);
  };

  return (
    <div className="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm space-y-4 w-full animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="flex items-end gap-4 flex-wrap lg:flex-nowrap w-full overflow-x-auto pb-2">
        <div className="min-w-fit space-y-2">
          <label className="text-[12px] font-bold text-gray-700 ml-1 uppercase tracking-wider">
            Khoảng thời gian
          </label>
          <div className="flex items-center gap-2">
            <FormInput
              type="date"
              value={dateRange[0] ? dateRange[0].format("YYYY-MM-DD") : ""}
              onChange={(e) => handleDateChange(0, e.target.value)}
              className="h-11 w-44"
            />
            <span className="text-gray-500 font-bold">→</span>
            <FormInput
              type="date"
              value={dateRange[1] ? dateRange[1].format("YYYY-MM-DD") : ""}
              onChange={(e) => handleDateChange(1, e.target.value)}
              className="h-11 w-44"
            />
          </div>
        </div>

        <div className="min-w-fit space-y-2 flex-1 max-w-xs">
          <label className="text-[12px] font-bold text-gray-700 ml-1 uppercase tracking-wider">
            Tìm kiếm nhanh
          </label>
          <FormInput
            placeholder="Nhập mã đơn..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="h-11"
          />
        </div>

        {[
          {
            label: "Đơn vị vận chuyển",
            value: carrierFilter,
            onChange: setCarrierFilter,
            options: filterOptions.carriers,
            placeholder: "Tất cả đơn vị",
          },
          {
            label: "Trạng thái xử lý",
            value: processingFilter,
            onChange: setProcessingFilter,
            options: filterOptions.processing,
          },
          {
            label: "Loại đơn hàng",
            value: orderTypeFilter,
            onChange: setOrderTypeFilter,
            options: filterOptions.orderTypes,
          },
          {
            label: "Sắp xếp theo",
            value: sortOption,
            onChange: setSortOption,
            options: filterOptions.sorting,
          },
        ].map((filter, idx) => (
          <div key={idx} className="min-w-fit space-y-2 flex-1 max-w-xs">
            <label className="text-[12px] font-bold text-gray-700 ml-1 uppercase tracking-wider">
              {filter.label}
            </label>
            <SelectComponent
              placeholder={filter.placeholder}
              value={filter.value}
              onChange={filter.onChange}
              options={filter.options}
              className="h-11"
            />
          </div>
        ))}

      
      </div>
          <div className="flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={handleResetFilters}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all active:scale-95"
          >
            <FiRefreshCw
              size={16}
              className="group-hover:rotate-180 transition-transform duration-500"
            />
            Đặt lại
          </button>
          <button
            type="button"
            onClick={onSearch}
            className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-gray-900 text-sm font-bold text-white shadow-lg shadow-gray-200 hover:bg-orange-600 transition-all active:scale-95"
          >
            <FiSearch size={16} />
            Tìm kiếm
          </button>
        </div>
      </div>
  );
};
