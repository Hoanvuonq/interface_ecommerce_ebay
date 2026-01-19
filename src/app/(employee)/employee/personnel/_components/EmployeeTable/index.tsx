"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Edit2,
  Eye,
  RotateCw,
  Eraser,
  DollarSign,
  Plus,
  Search,
  Briefcase,
  ShieldCheck,
  MapPin,
  CalendarDays,
} from "lucide-react";
import { useEmployeeTable } from "../../_hooks/useEmployeeTable";
import {
  statusLabelMap,
  EmployeeStatus,
  Employee,
} from "../../_types/employee.type";
import EmployeeDetail from "../EmployeeDetail";
import EmployeeForm from "../EmployeeForm";
import { SelectComponent } from "@/components";
import { StatCardComponents, DataTable } from "@/components";
import { cn } from "@/utils/cn";
import { Column } from "@/components/DataTable/type";
import { ActionBtn } from "@/components";
import { motion } from "framer-motion";

export default function EmployeeTable() {
  const router = useRouter();
  const {
    employees,
    metadata,
    filters,
    isLoading,
    updateFilter,
    resetFilters,
    refreshData,
    setPage,
  } = useEmployeeTable();

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [openDetail, setOpenDetail] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [modeForm, setModeForm] = useState<"create" | "update">("create");

  const renderStatus = (status: EmployeeStatus) => {
    const configs = {
      ACTIVE: "bg-emerald-50 text-emerald-600 border-emerald-100",
      ON_LEAVE: "bg-amber-50 text-amber-600 border-amber-100",
      RESIGNED: "bg-gray-100 text-gray-500 border-gray-200",
      TERMINATED: "bg-red-50 text-red-600 border-red-100",
      RETIRED: "bg-blue-50 text-blue-600 border-blue-100",
    };
    return (
      <span
        className={cn(
          "px-3 py-1 text-[10px] font-semibold rounded-full uppercase tracking-tighter border",
          configs[status] || configs.RESIGNED
        )}
      >
        {statusLabelMap[status]}
      </span>
    );
  };

  const columns: Column<Employee>[] = [
    {
      header: "Nhân sự thực thi",
      render: (emp) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center border-2 border-white shadow-lg overflow-hidden shrink-0">
            {emp.imageUrl ? (
              <img
                src={emp.imageUrl}
                className="w-full h-full object-cover"
                alt={emp.fullName}
              />
            ) : (
              <span className="text-orange-500 font-semibold text-lg">
                {emp.fullName.charAt(0)}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 tracking-tight text-sm leading-none truncate">
              {emp.fullName}
            </p>
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1.5 flex items-center gap-1">
              <MapPin size={10} /> {emp.phone}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Vị trí & Phòng ban",
      render: (emp) => (
        <div className="space-y-1">
          <p className="text-sm font-semibold text-gray-700 italic flex items-center gap-1">
            <Briefcase size={12} className="text-orange-400" />{" "}
            {emp.positionName}
          </p>
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest ml-4">
            {emp.departmentName}
          </p>
        </div>
      ),
    },
    {
      header: "Tình trạng",
      align: "center",
      render: (emp) => renderStatus(emp.status),
    },
    {
      header: "Quản trị",
      align: "right",
      render: (emp) => (
        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
          <ActionBtn
            onClick={() => {
              setSelectedEmployee(emp);
              setOpenDetail(true);
            }}
            icon={<Eye size={14} />}
            color="hover:text-blue-500"
          />
          <ActionBtn
            onClick={() => {
              setSelectedEmployee(emp);
              setModeForm("update");
              setOpenForm(true);
            }}
            icon={<Edit2 size={14} />}
            color="hover:text-orange-500"
          />
          <ActionBtn
            onClick={() =>
              router.push(`/employee/personnel/${emp.employeeId}/payrolls`)
            }
            icon={<DollarSign size={14} />}
            color="hover:text-emerald-500"
          />
        </div>
      ),
    },
  ];

  const tableHeader = (
    <div className="w-full space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex bg-gray-100/80 p-1 rounded-2xl relative">
          {["ALL", "ACTIVE", "ON_LEAVE", "RESIGNED"].map((key) => {
            const isActive = filters.activeTab === key;
            return (
              <button
                key={key}
                onClick={() => updateFilter({ activeTab: key })}
                className={cn(
                  "relative px-5 py-2 text-[10px] font-semibold uppercase tracking-widest rounded-lg transition-colors duration-300 z-10",
                  isActive
                    ? "text-orange-500"
                    : "text-gray-600 hover:text-gray-600"
                )}
              >
                <span className="relative z-20">
                  {key === "ALL"
                    ? "Tất cả"
                    : statusLabelMap[key as EmployeeStatus] || key}
                </span>

                {isActive && (
                  <motion.div
                    layoutId="activeTabBackground"
                    className="absolute inset-0 bg-white rounded-lg shadow-sm z-10"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="relative group lg:col-span-2">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500 transition-colors"
            size={16}
          />
          <input
            type="text"
            placeholder="Truy vấn danh tính nhân sự..."
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-orange-500/5 outline-none transition-all text-sm font-bold shadow-inner"
            value={filters.searchText}
            onChange={(e) => updateFilter({ searchText: e.target.value })}
          />
        </div>
        <SelectComponent
          options={metadata.departments.map((d: any) => ({
            label: d.departmentName,
            value: d.departmentId,
          }))}
          placeholder="Phòng ban"
          value={filters.departmentId}
          onChange={(v) => updateFilter({ departmentId: v })}
        />
        <SelectComponent
          options={metadata.positions.map((p: any) => ({
            label: p.positionName,
            value: p.positionId,
          }))}
          placeholder="Vị trí"
          value={filters.positionId}
          onChange={(v) => updateFilter({ positionId: v })}
        />
        <SelectComponent
          options={[
            { label: "10 dòng", value: "10" },
            { label: "20 dòng", value: "20" },
          ]}
          value={String(filters.size)}
          onChange={(v) => updateFilter({ size: Number(v) })}
        />
      </div>
    </div>
  );

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-semibold text-gray-900 tracking-tighter uppercase italic leading-none">
            Human{" "}
            <span className="text-orange-500 underline decoration-4 underline-offset-8">
              Resources
            </span>
          </h1>
          <p className="text-gray-800 text-xs font-bold uppercase tracking-[0.3em]">
            Workspace quản trị nhân sự tập trung
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedEmployee(null);
            setModeForm("create");
            setOpenForm(true);
          }}
          className="bg-gray-900 hover:bg-orange-500 text-white px-8 py-4 rounded-3xl font-semibold uppercase text-xs tracking-widest transition-all duration-500 shadow-2xl shadow-gray-200 flex items-center gap-2 active:scale-95"
        >
          <Plus size={18} strokeWidth={3} /> Khởi tạo nhân sự
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCardComponents
          label="Tổng quy mô"
          value={metadata.statistics?.totalEmployees ?? 0}
          color="text-gray-900"
        />
        <StatCardComponents
          label="Đang làm việc"
          value={metadata.statistics?.status?.ACTIVE ?? 0}
          color="text-emerald-500"
        />
        <StatCardComponents
          label="Đang nghỉ phép"
          value={metadata.statistics?.status?.ON_LEAVE ?? 0}
          color="text-amber-500"
        />
      </div>

      <DataTable
        data={employees}
        columns={columns as any}
        loading={isLoading}
        page={filters.page}
        size={filters.size}
        totalElements={metadata.statistics?.totalEmployees ?? 0}
        onPageChange={setPage}
        headerContent={tableHeader}
      />

      <EmployeeDetail
        open={openDetail}
        employee={selectedEmployee}
        onClose={() => setOpenDetail(false)}
      />
      <EmployeeForm
        open={openForm}
        employee={selectedEmployee}
        onClose={() => setOpenForm(false)}
        onSuccess={refreshData}
        mode={modeForm}
      />
    </div>
  );
}
