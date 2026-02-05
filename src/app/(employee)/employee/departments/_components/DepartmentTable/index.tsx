"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  RotateCw,
  Eraser,
  Plus,
  Building2,
  Briefcase,
  Users,
  Layers,
} from "lucide-react";
import _ from "lodash";

import { useDepartmentTable } from "../../_hooks/useDepartmentTable";
import { Department } from "../../_types/department.type";
import DepartmentDetail from "../DepartmentDetail";
import DepartmentForm from "../DepartmentForm";
import {
  DataTable,
  StatCardComponents,
  ButtonField,
  SelectComponent,
  SearchComponent,
} from "@/components";
import { cn } from "@/utils/cn";
import { getDepartmentColumns } from "./colum";

export default function DepartmentTable() {
  const logic = useDepartmentTable();
  const [detailModal, setDetailModal] = useState<{
    open: boolean;
    id: string | null;
  }>({ open: false, id: null });
  const [formModal, setFormModal] = useState<{
    open: boolean;
    data: Department | null;
  }>({ open: false, data: null });

  const debouncedSearch = useCallback(
    _.debounce((text: string) => {
      logic.setSearchText(text);
      logic.setPage(0);
    }, 500),
    [],
  );

  const handleSearchChange = (val: string) => {
    debouncedSearch(val);
  };

  const columns = useMemo(
    () =>
      getDepartmentColumns({
        onEdit: (row) => setFormModal({ open: true, data: row }),
        onView: (id) => setDetailModal({ open: true, id: id }),
      }),
    [],
  );

  const tableHeader = (
    <div className="w-full space-y-6 pb-2">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row gap-4 flex-1 max-w-3xl">
          <div className="flex-2">
            <SearchComponent
              value={logic.searchText}
              placeholder="Truy vấn mã định danh hoặc tên phòng ban..."
              onChange={handleSearchChange}
              size="md"
            />
          </div>

          <div className="flex-1">
            <SelectComponent
              options={[10, 20, 50].map((v) => ({
                label: `Hiện ${v} bản ghi`,
                value: String(v),
              }))}
              value={String(logic.pagination.pageSize)}
              onChange={(v) => logic.setPageSize(Number(v))}
              className="h-12 shadow-sm rounded-[1.25rem]"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex p-1.5 bg-gray-100/50 rounded-2xl border border-gray-200 shadow-inner">
            <button
              onClick={logic.refresh}
              className="p-2 text-gray-500 hover:text-orange-500 hover:bg-white hover:shadow-sm rounded-xl transition-all active:scale-90"
              title="Làm mới dữ liệu"
            >
              <RotateCw
                size={18}
                className={cn(logic.loading && "animate-spin")}
                strokeWidth={2.5}
              />
            </button>
            <button
              onClick={() => {
                logic.setSearchText("");
                logic.setPage(0);
              }}
              className="p-2 text-gray-400 hover:text-rose-500 hover:bg-white hover:shadow-sm rounded-xl transition-all active:scale-90"
              title="Xóa bộ lọc"
            >
              <Eraser size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-1">
          <h1 className="text-6xl font-bold text-gray-900 tracking-tighter uppercase italic leading-none">
            Phòng <span className="text-orange-500">Ban</span>
          </h1>
          <p className="text-gray-400 text-[12px] font-bold tracking-wide mt-4 flex items-center gap-2">
            <Layers size={12} className="text-orange-500" /> Hệ thống quản trị
            nhân sự tập trung Cano X
          </p>
        </div>

        <ButtonField
          type="login"
          className="w-60! h-14 text-[12px]! font-bold rounded-3xl shadow-2xl shadow-orange-500/20 transition-all hover:-translate-y-1 active:scale-95 border-0 tracking-widest"
          onClick={() => setFormModal({ open: true, data: null })}
        >
          <span className="flex gap-2.5 items-center uppercase">
            <Plus size={20} strokeWidth={4} /> Khởi tạo phòng ban
          </span>
        </ButtonField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCardComponents
          label="Tổng phòng ban"
          value={_.get(logic, "statistics.totalDepartments", 0)}
          icon={<Building2 />}
          color="text-orange-600"
          trend={5}
        />
        <StatCardComponents
          label="Tổng chức vụ"
          value={_.get(logic, "statistics.totalPositions", 0)}
          icon={<Briefcase />}
          color="text-indigo-600"
          trend={12}
        />
        <StatCardComponents
          label="Tổng nhân sự"
          value={_.get(logic, "statistics.totalEmployees", 0)}
          icon={<Users />}
          color="text-emerald-600"
          trend={8}
        />
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 border border-gray-50 shadow-custom overflow-hidden relative group/table">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-orange-50/30 rounded-full blur-3xl group-hover/table:bg-orange-100/30 transition-colors duration-1000" />

        <DataTable
          data={logic.departments}
          columns={columns}
          loading={logic.loading}
          rowKey="departmentId"
          page={logic.pagination.current}
          size={logic.pagination.pageSize}
          totalElements={logic.pagination.total}
          onPageChange={logic.setPage} 
          headerContent={tableHeader}
        />
      </div>

      <DepartmentDetail
        open={detailModal.open}
        departmentId={detailModal.id}
        onClose={() => setDetailModal({ open: false, id: null })}
        onUpdated={logic.refresh}
      />
      <DepartmentForm
        open={formModal.open}
        department={formModal.data}
        onClose={() => setFormModal({ open: false, data: null })}
        onSuccess={logic.refresh}
      />
    </div>
  );
}
