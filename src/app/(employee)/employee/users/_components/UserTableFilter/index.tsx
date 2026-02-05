/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  StatusTabItem,
  StatusTabs,
} from "@/app/(shop)/shop/_components/Products/StatusTabs";
import {
  CustomButtonActions,
  SearchComponent,
  SelectComponent
} from "@/components";
import _ from "lodash";
import { RotateCw } from "lucide-react";
import React, { useMemo } from "react";
import { DATA_TABS, UserTableFilterProps } from "./type";

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

  const handleKeywordChange = (val: string) => {
    logic.updateState({
      searchKeyword: val,
      pagination: { ...logic.pagination, current: 1 },
    });
  };

  const handleTriggerSearch = () => {
    logic.updateState({ pagination: { ...logic.pagination, current: 1 } });
    logic.fetchUsers();
  };

  return (
    <div className="bg-white p-6 rounded-[2.5rem] shadow-custom border border-gray-50 mb-8 space-y-6">
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="flex-2 min-w-75">
            <SearchComponent
              value={logic.searchKeyword}
              onChange={handleKeywordChange}
              onEnter={handleTriggerSearch}
              placeholder="Tìm kiếm username hoặc email..."
              size="md"
            />
          </div>

          <div className="flex-1 min-w-50">
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
                logic.updateState({
                  selectedRoles: selected,
                  pagination: { ...logic.pagination, current: 1 },
                })
              }
              placeholder="Tất cả vai trò"
            />
          </div>
        </div>

        <CustomButtonActions
          onCancel={logic.resetFilters}
          onSubmit={handleTriggerSearch}
          isLoading={logic.usersLoading}
          cancelText="Reset"
          submitText="Làm mới"
          submitIcon={RotateCw}
          containerClassName="border-t-0 p-0 !gap-3 shrink-0"
          className="px-6"
          hasChanges={true}
        />
      </div>

      <StatusTabs
        tabs={tabsWithCounts}
        current={logic.activeTab}
        onChange={(key) =>
          logic.updateState({
            activeTab: key,
            pagination: { ...logic.pagination, current: 1 },
          })
        }
        layoutId="user-filter-tabs"
      />
    </div>
  );
};
