/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Search, RotateCw, Brush } from "lucide-react";
import { ButtonField, FormInput } from "@/components";
import { SelectComponent } from "@/components";
import { cn } from "@/utils/cn";
import { Button } from "@/components/button/button";
import { ShopApprovalToolbarProps } from "./type";
import { debounce } from "lodash";
export const ShopApprovalToolbar: React.FC<ShopApprovalToolbarProps> = ({
  searchText,
  setSearchText,
  pageSize,
  loading,
  onSearch,
  onRefresh,
  onReset,
  onPageSizeChange,
  activeTab,
}) => {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap gap-4 flex-1">
        <div className="md:col-span-5 relative group flex-1 min-w-75">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500 transition-colors z-10"
          />
          <FormInput
            placeholder="Tìm kiếm theo tên shop..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && onSearch(activeTab, searchText, 1)
            }
            className="w-full h-12 pl-10 pr-4 transition-all"
          />
        </div>

        <div className="min-w-35">
          <SelectComponent
            isMulti={false}
            options={[10, 20, 30, 50].map((v) => ({
              label: `${v} dòng`,
              value: v.toString(),
            }))}
            value={pageSize.toString()}
            onChange={(val) => onPageSizeChange(parseInt(val, 10))}
            placeholder="Số dòng"
          />
        </div>

        <Button
          onClick={onReset}
          variant="edit"
          disabled={loading}
          className="flex gap-2 items-center px-5 py-2.5 rounded-xl text-sm font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-50"
        >
          <span className="flex gap-2 items-center">
            <Brush size={18} /> Reset
          </span>
        </Button>

        <ButtonField
          type="login"
          onClick={onRefresh}
          loading={loading}
          className="flex w-40 items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-orange-500/20 transition-all active:scale-95 border-0 h-auto"
        >
          <span className="flex gap-2 items-center">
            <RotateCw className={cn(loading && "animate-spin")} size={18} /> Làm
            mới
          </span>
        </ButtonField>
      </div>
    </div>
  );
};
