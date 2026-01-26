/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { SelectComponent } from "@/components";
import { cn } from "@/utils/cn";
import _ from "lodash";
import { RotateCw, Search, XCircle } from "lucide-react";
import React, { useMemo } from "react";
import { DATA_TABS, UserTableFilterProps } from "./type";
import {
  StatusTabs,
  StatusTabItem,
} from "@/app/(shop)/shop/_components/Products/StatusTabs";

export const UserTableFilter: React.FC<UserTableFilterProps> = ({ logic }) => {
  const tabsWithCounts = useMemo(() => {
    return DATA_TABS.map((tab) => ({
      ...tab,
      count: _.get(
        logic.statistics,
        tab.key === "ALL" ? "totalUsers" : `status.${tab.key}`,
        0,
      ),
    })) as StatusTabItem<string>[];
  }, [logic.statistics]);

  return (
    <div className="bg-white p-6 rounded-3xl shadow-custom border border-gray-50 mb-8 space-y-4">
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div className="flex flex-wrap gap-4 flex-1">
          <div className="relative group flex-1 min-w-75">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-orange-500 transition-colors"
              size={18}
            />
            <input
              className={cn(
                "w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border-none ",
                "focus:ring-2 focus:ring-orange-500/20 outline-none font-bold text-sm text-gray-700 placeholder:text-gray-600 transition-all",
              )}
              placeholder="Tìm kiếm username hoặc email..."
              value={logic.searchKeyword}
              onChange={(e) =>
                logic.updateState({ searchKeyword: e.target.value })
              }
              onKeyDown={(e) => e.key === "Enter" && logic.fetchUsers()}
            />
          </div>

          <div className="min-w-50">
            <SelectComponent
              isMulti={true}
              options={
                logic.roles?.data?.content?.map((r: any) => ({
                  label: `${r.description || ""} (${r.roleName})`.trim(),
                  value: r.roleName,
                })) || []
              }
              value={logic.selectedRoles}
              onChange={(selected) =>
                logic.updateState({ selectedRoles: selected })
              }
              placeholder="Tất cả vai trò"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={logic.resetFilters}
            className="p-3 bg-gray-50 text-gray-600 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all border border-transparent hover:border-rose-100 shadow-sm"
            title="Reset bộ lọc"
          >
            <XCircle size={20} />
          </button>
          <button
            onClick={() => logic.fetchUsers()}
            className="flex items-center gap-2 px-8 py-3 bg-orange-500 text-white rounded-2xl font-semibold text-xs uppercase tracking-widest shadow-lg shadow-orange-200 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <RotateCw
              size={16}
              className={cn(logic.usersLoading && "animate-spin")}
            />
            Làm mới
          </button>
        </div>
      </div>

      <div className="pt-2 border-t border-gray-50">
        <StatusTabs
          tabs={tabsWithCounts}
          current={logic.activeTab}
          onChange={(key) =>
            logic.updateState({
              activeTab: key,
              pagination: { ...logic.pagination, current: 1 },
            })
          }
        />
      </div>
    </div>
  );
};
