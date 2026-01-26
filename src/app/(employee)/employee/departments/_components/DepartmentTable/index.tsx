"use client";

import React, { useState, useMemo } from "react";
import {
  RotateCw,
  Eraser,
  Plus,
  Search,
  Building2,
  Briefcase,
  Users,
} from "lucide-react";
import { useDepartmentTable } from "../../_hooks/useDepartmentTable";
import { Department } from "../../_types/department.type";
import DepartmentDetail from "../DepartmentDetail";
import DepartmentForm from "../DepartmentForm";
import {
  DataTable,
  StatCardComponents,
  ButtonField,
  FormInput,
  SelectComponent,
} from "@/components";
import { cn } from "@/utils/cn";
import { getDepartmentColumns } from "./colum";

export default function DepartmentTable() {
  const logic = useDepartmentTable();

  const [detailModal, setDetailModal] = useState<{
    open: boolean;
    id: string | null;
  }>({
    open: false,
    id: null,
  });
  const [formModal, setFormModal] = useState<{
    open: boolean;
    data: Department | null;
  }>({
    open: false,
    data: null,
  });

  const columns = useMemo(
    () =>
      getDepartmentColumns({
        onEdit: (row) => setFormModal({ open: true, data: row }),
        onView: (id) => setDetailModal({ open: true, id: id }),
      }),
    [],
  );

  const tableHeader = (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative group flex-1 max-w-lg">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors z-10"
            size={18}
          />
          <FormInput
            placeholder="Truy vấn mã định danh hoặc tên phòng ban..."
            value={logic.searchText}
            onChange={(e) => logic.setSearchText(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && logic.fetchList(logic.searchText, 0)
            }
            className="pl-12 h-14 bg-gray-50/80 rounded-[1.25rem] border-transparent focus:bg-white focus:ring-4 focus:ring-orange-500/10 transition-all shadow-custom font-bold"
          />
        </div>

        {/* Actions & PageSize */}
        <div className="flex items-center gap-2">
          <SelectComponent
            options={[10, 20, 50].map((v) => ({
              label: `Hiện ${v} bản ghi`,
              value: String(v),
            }))}
            value={String(logic.pagination.pageSize)}
            onChange={(v) => logic.fetchList(logic.searchText, 0, Number(v))}
            className="w-44 h-12 rounded-2xl border-gray-100 shadow-sm"
          />

          <div className="flex p-1 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <button
              onClick={logic.refresh}
              className="p-2.5 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all"
              title="Làm mới"
            >
              <RotateCw
                size={18}
                className={cn(logic.loading && "animate-spin")}
              />
            </button>
            <button
              onClick={() => {
                logic.setSearchText("");
                logic.fetchList("", 0);
              }}
              className="p-2.5 text-gray-500 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
              title="Xóa bộ lọc"
            >
              <Eraser size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <h1 className="text-5xl font-bold text-gray-900 tracking-tighter uppercase italic leading-none">
            Phòng <span className="text-orange-500">Ban</span>
          </h1>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.4em] mt-3">
            Hệ thống quản trị nhân sự tập trung Calatha
          </p>
        </div>

        <ButtonField
          type="login"
          className="w-56! h-14 text-sm font-bold rounded-[1.25rem] shadow-xl shadow-orange-500/20 transition-all active:scale-95 border-0"
          onClick={() => setFormModal({ open: true, data: null })}
        >
          <span className="flex gap-2 items-center">
            <Plus size={20} strokeWidth={4} /> KHỞI TẠO PHÒNG BAN
          </span>
        </ButtonField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCardComponents
          label="Tổng phòng ban"
          value={logic.statistics?.totalDepartments ?? 0}
          icon={<Building2 />}
          color="text-orange-600"
          trend={5}
        />
        <StatCardComponents
          label="Tổng chức vụ"
          value={logic.statistics?.totalPositions ?? 0}
          icon={<Briefcase />}
          color="text-gray-900"
          trend={12}
        />
        <StatCardComponents
          label="Tổng nhân sự"
          value={logic.statistics?.totalEmployees ?? 0}
          icon={<Users />}
          color="text-emerald-600"
          trend={8}
        />
      </div>

      <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-custom overflow-hidden">
        <DataTable
          data={logic.departments}
          columns={columns}
          loading={logic.loading}
          rowKey="departmentId"
          page={logic.pagination.current}
          size={logic.pagination.pageSize}
          totalElements={logic.pagination.total}
          onPageChange={(p) => logic.fetchList(logic.searchText, p)}
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
