"use client";

import {
  StatusTabItem,
  StatusTabs,
} from "@/app/(shop)/shop/_components/Products/StatusTabs";
import {
  ButtonField,
  DataTable,
  FormInput,
  SelectComponent,
  StatCardComponents,
} from "@/components";
import { Clock, Plus, Search, UserCheck, UserMinus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useEmployeeTable } from "../../_hooks/useEmployeeTable";
import { Employee } from "../../_types/employee.type";
import EmployeeDetail from "../EmployeeDetail";
import EmployeeForm from "../EmployeeForm";
import { getEmployeeColumns } from "./colum";

export default function EmployeeTable() {
  const router = useRouter();
  const {
    employees,
    metadata,
    filters,
    isLoading,
    updateFilter,
    refreshData,
    setPage,
  } = useEmployeeTable();

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [openDetail, setOpenDetail] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [modeForm, setModeForm] = useState<"create" | "update">("create");

  const tabItems: StatusTabItem<string>[] = [
    {
      key: "ALL",
      label: "Tất cả",
      icon: Users,
      count: metadata.statistics?.totalEmployees,
    },
    {
      key: "ACTIVE",
      label: "Hoạt động",
      icon: UserCheck,
      count: metadata.statistics?.status?.ACTIVE,
    },
    {
      key: "ON_LEAVE",
      label: "Nghỉ phép",
      icon: Clock,
      count: metadata.statistics?.status?.ON_LEAVE,
    },
    {
      key: "RESIGNED",
      label: "Đã nghỉ",
      icon: UserMinus,
      count: metadata.statistics?.status?.RESIGNED,
    },
  ];

  const columns = useMemo(
    () =>
      getEmployeeColumns(
        (emp) => {
          setSelectedEmployee(emp);
          setOpenDetail(true);
        },
        (emp) => {
          setSelectedEmployee(emp);
          setModeForm("update");
          setOpenForm(true);
        },
        (id) => router.push(`/employee/personnel/${id}/payrolls`),
      ),
    [router],
  );

  const tableHeader = (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <StatusTabs
          tabs={tabItems}
          current={filters.activeTab}
          onChange={(key) => updateFilter({ activeTab: key })}
        />

        <div className="flex items-center gap-4">
          <ButtonField
            htmlType="submit"
            type="login"
            className="w-40! text-[12px] font-bold rounded-2xl shadow-custom hover:scale-[1.02]"
            onClick={() => {
              setSelectedEmployee(null);
              setModeForm("create");
              setOpenForm(true);
            }}
          >
            <span className="flex gap-2 items-center">
              <Plus size={16} strokeWidth={3} /> Thêm nhân sự
            </span>
          </ButtonField>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="relative group lg:col-span-2">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500 transition-colors z-10"
          />
          <FormInput
            placeholder="Tìm kiếm sản phẩm theo tên, SKU..."
            value={filters.searchText}
            onChange={(e) => updateFilter({ searchText: e.target.value })}
            className="w-full h-12 pl-10 pr-4 transition-all"
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
          className="rounded-2xl"
        />
        <SelectComponent
          options={metadata.positions.map((p: any) => ({
            label: p.positionName,
            value: p.positionId,
          }))}
          placeholder="Vị trí"
          value={filters.positionId}
          onChange={(v) => updateFilter({ positionId: v })}
          className="rounded-2xl"
        />
        <SelectComponent
          options={[
            { label: "10 dòng", value: "10" },
            { label: "20 dòng", value: "20" },
          ]}
          value={String(filters.size)}
          onChange={(v) => updateFilter({ size: Number(v) })}
          className="rounded-2xl"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <h1 className="text-5xl font-bold text-gray-900 tracking-tighter uppercase italic leading-none">
            Human{" "}
            <span className="text-orange-500 underline decoration-8 underline-offset-12 decoration-orange-100">
              Resources
            </span>
          </h1>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest pt-2">
            Workspace Quản Trị Nhân Sự Calatha
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCardComponents
          label="Tổng nhân lực"
          value={metadata.statistics?.totalEmployees ?? 0}
          icon={<Users />}
          size="md"
        />
        <StatCardComponents
          label="Đang cống hiến"
          value={metadata.statistics?.status?.ACTIVE ?? 0}
          color="text-emerald-500"
          size="md"
          icon={<UserCheck />}
        />
        <StatCardComponents
          label="Đang nghỉ phép"
          value={metadata.statistics?.status?.ON_LEAVE ?? 0}
          color="text-amber-500"
          size="md"
          icon={<Clock />}
        />
      </div>

      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-custom">
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
      </div>

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
