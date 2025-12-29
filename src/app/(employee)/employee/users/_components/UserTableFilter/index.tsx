/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { SelectComponent } from "@/components/SelectComponent";
import { cn } from "@/utils/cn";
import _ from "lodash";
import { RotateCw, Search, XCircle } from "lucide-react";
import React from "react";
import { DATA_TABS, UserTableFilterProps } from "./type";


export const UserTableFilter: React.FC<UserTableFilterProps> = ({ logic }) => {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 mb-8 space-y-6">
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div className="flex flex-wrap gap-4 flex-1">
          <div className="relative group flex-1 min-w-75">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors"
              size={18}
            />
            <input
              className={cn(
                "w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border-none ",
                "focus:ring-2 focus:ring-orange-500/20 outline-none font-bold text-sm text-slate-700 placeholder:text-slate-400 transition-all"
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
              options={logic.roles.map((r: any) => ({
                label: r.roleName,
                value: r.roleName,
              }))}
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
            className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all border border-transparent hover:border-rose-100 shadow-sm"
            title="Reset bộ lọc"
          >
            <XCircle size={20} />
          </button>
          <button
            onClick={() => logic.fetchUsers()}
            className="flex items-center gap-2 px-8 py-3 bg-orange-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-200 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <RotateCw
              size={16}
              className={cn(logic.usersLoading && "animate-spin")}
            />
            Làm mới
          </button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-100 pb-1 overflow-x-auto custom-scrollbar">
        {DATA_TABS.map((tab) => {
          const count = _.get(
            logic.statistics,
            tab.key === "ALL" ? "totalUsers" : `status.${tab.key}`,
            0
          );
          const isActive = logic.activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() =>
                logic.updateState({
                  activeTab: tab.key,
                  pagination: { ...logic.pagination, current: 1 },
                })
              }
              className={cn(
                "px-6 py-4 font-black text-[11px] uppercase tracking-widest transition-all relative whitespace-nowrap group",
                isActive
                  ? "text-orange-500"
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              <span className="relative z-10 flex items-center gap-2">
                {tab.label}
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-lg text-[9px] transition-colors",
                    isActive
                      ? "bg-orange-100 text-orange-600"
                      : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                  )}
                >
                  {count}
                </span>
              </span>

              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 rounded-t-full shadow-[0_-4px_12px_rgba(249,115,22,0.4)] animate-in slide-in-from-bottom-1" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
