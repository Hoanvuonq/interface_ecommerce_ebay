"use client";

import React, { useState } from "react";
import { 
  Edit2, Eye, RotateCw, Eraser, Plus, Search, 
  Building2, Briefcase, Users, ChevronRight 
} from "lucide-react";
import dayjs from "dayjs";
import { useDepartmentTable } from "../../_hooks/useDepartmentTable";
import { Department } from "../../_types/department.type";
import DepartmentDetail from "../DepartmentDetail";
import DepartmentForm from "../DepartmentForm";
import { DataTable, ActionBtn, StatCardComponents } from "@/components";
import { SelectComponent } from "@/components/SelectComponent";
import { Column } from "@/components/DataTable/type";
import { cn } from "@/utils/cn";

export default function DepartmentTable() {
  const logic = useDepartmentTable();
  const [detailModal, setDetailModal] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [formModal, setFormModal] = useState<{ open: boolean; data: Department | null }>({ open: false, data: null });

  const columns: Column<Department>[] = [
    {
      header: "Phòng ban",
      render: (row) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 shadow-sm">
            <Building2 size={20} />
          </div>
          <div>
            <p className="font-semibold text-gray-900 tracking-tight leading-none">{row.departmentName}</p>
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1.5 flex items-center gap-1">
               ID: {row.departmentId.split('-')[0]}
            </p>
          </div>
        </div>
      )
    },
    {
      header: "Mô tả",
      render: (row) => (
        <p className="text-xs text-gray-500 line-clamp-1 max-w-75 italic">
          {row.description || "Chưa có mô tả..."}
        </p>
      )
    },
    {
      header: "Ngày khởi tạo",
      align: "center",
      render: (row) => (
        <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-tighter">
          {dayjs(row.createdDate).format("DD/MM/YYYY")}
        </span>
      )
    },
    {
      header: "Quản trị",
      align: "right",
      render: (row) => (
        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
          <ActionBtn 
            onClick={() => setFormModal({ open: true, data: row })} 
            icon={<Edit2 size={14}/>} 
            color="hover:text-blue-500" 
          />
          <ActionBtn 
            onClick={() => setDetailModal({ open: true, id: row.departmentId })} 
            icon={<Eye size={14}/>} 
            color="hover:text-orange-500" 
          />
        </div>
      )
    }
  ];

  const tableHeader = (
    <div className="w-full space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative group flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Truy vấn tên phòng ban..."
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-500/5 outline-none transition-all text-sm font-bold shadow-inner"
            value={logic.searchText}
            onChange={(e) => logic.setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && logic.fetchList(logic.searchText, 0)}
          />
        </div>
        
        <div className="flex gap-3">
          <SelectComponent 
            options={[10, 20, 50].map(v => ({ label: `Hiện ${v}`, value: String(v) }))}
            value={String(logic.pagination.pageSize)}
            onChange={(v) => logic.fetchList(logic.searchText, 0, Number(v))}
            className="w-32"
          />
          <button onClick={logic.refresh} className="p-3.5 bg-white text-gray-600 hover:text-orange-500 rounded-2xl border border-gray-100 shadow-sm transition-all active:scale-90">
            <RotateCw size={20} className={cn(logic.loading && "animate-spin")} />
          </button>
          <button onClick={() => { logic.setSearchText(""); logic.fetchList("", 0); }} className="p-3.5 bg-white text-gray-600 hover:text-red-500 rounded-2xl border border-gray-100 shadow-sm transition-all active:scale-90">
            <Eraser size={20} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen space-y-10 animate-in fade-in duration-700">
      {/* 1. Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <h1 className="text-5xl font-semibold text-gray-900 tracking-tighter uppercase italic leading-none">
            Phòng <span className="text-orange-500 underline decoration-4 underline-offset-8">Ban</span>
          </h1>
          <p className="text-gray-600 text-xs font-bold uppercase tracking-[0.3em] mt-3">Cấu trúc tổ chức hệ thống Calatha</p>
        </div>
        <button 
          onClick={() => setFormModal({ open: true, data: null })}
          className="bg-gray-900 hover:bg-orange-500 text-white px-8 py-4 rounded-2xl font-semibold uppercase text-xs tracking-widest transition-all duration-500 shadow-2xl shadow-gray-200 flex items-center gap-2 active:scale-95"
        >
          <Plus size={18} strokeWidth={3} /> Thêm phòng ban
        </button>
      </div>

      {/* 2. Quick Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCardComponents label="Tổng phòng ban" value={logic.statistics?.totalDepartments ?? 0} icon={<Building2 />} color="text-gray-900" />
        <StatCardComponents label="Tổng chức vụ" value={logic.statistics?.totalPositions ?? 0} icon={<Briefcase />} color="text-blue-500" />
        <StatCardComponents label="Tổng nhân sự" value={logic.statistics?.totalEmployees ?? 0} icon={<Users />} color="text-emerald-500" />
      </div>

      {/* 3. Main Data Workspace */}
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

      {/* 4. Modals */}
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