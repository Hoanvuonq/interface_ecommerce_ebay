"use client";

import React, { useEffect, useState, useMemo } from "react";
import { RoleEnum } from "@/auth/_types/auth";
import { useRouter } from "next/navigation";
import { useGetAllUsersByRoleEmployee } from "../../../users/_hooks/useUser";
import { IUserPermission } from "../_types/users.role";
import {
  DataTable,
  SelectComponent,
  FormInput,
  StatCardComponents,
} from "@/components";
import { StatusTabs } from "@/app/(shop)/shop/_components/Products/StatusTabs";
import {
  Users,
  Search,
  RotateCw,
  ShieldCheck,
  ShieldAlert,
  Activity,
  Fingerprint,
  UserCheck,
} from "lucide-react";
import { getUserPermissionColumns } from "./colum";

export const UserPermissionScreen = () => {
  const router = useRouter();
  const { handleGetAllUsersByRoleEmployee, loading } =
    useGetAllUsersByRoleEmployee();

  const [users, setUsers] = useState<IUserPermission[]>([]);
  const [selectedRole, setSelectedRole] = useState<RoleEnum>(RoleEnum.ADMIN);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  const employeeRoles = [
    RoleEnum.ADMIN,
    RoleEnum.LOGISTICS,
    RoleEnum.BUSINESS,
    RoleEnum.ACCOUNTANT,
    RoleEnum.EXECUTIVE,
    RoleEnum.IT,
    RoleEnum.SALE,
    RoleEnum.FINANCE,
  ];

  const fetchUsers = async (
    role: RoleEnum,
    pageNum: number,
    sizeNum: number,
  ) => {
    const res = await handleGetAllUsersByRoleEmployee({
      roleNames: [role],
      username: searchText || undefined,
      page: pageNum,
      size: sizeNum,
      sort: "createdDate,desc",
    });

    if (res?.success && res.data) {
      const data = res.data;
      if (Array.isArray(data)) {
        setUsers(data);
        setTotalElements(data.length);
      } else if (data.content) {
        setUsers(data.content);
        setTotalElements(data.totalElements || data.content.length);
      }
    } else {
      setUsers([]);
      setTotalElements(0);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(
      () => {
        fetchUsers(selectedRole, page, size);
      },
      searchText ? 500 : 0,
    );
    return () => clearTimeout(timeoutId);
  }, [selectedRole, page, size, searchText]);

  const handleRefresh = () => {
    setSearchText("");
    setPage(0);
    fetchUsers(selectedRole, 0, size);
  };

  const columns = useMemo(
    () =>
      getUserPermissionColumns(page, size, (user) =>
        router.push(`/employee/permissions/users/${user.userId}`),
      ),
    [page, size, router],
  );

  // Chuẩn bị dữ liệu cho StatusTabs
  const tabItems = employeeRoles.map((role) => ({
    key: role,
    label: role,
    icon: Fingerprint,
  }));

  const tableHeader = (
    <div className="w-full space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <StatusTabs
          tabs={tabItems}
          current={selectedRole}
          onChange={(key) => {
            setSelectedRole(key as RoleEnum);
            setPage(0);
          }}
        />

        <button
          onClick={handleRefresh}
          className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-orange-500 transition-all shadow-sm active:scale-90 shrink-0"
        >
          <RotateCw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-9 relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors z-10"
            size={18}
          />
          <FormInput
            placeholder="Truy vấn danh tính người dùng (Username)..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-12 h-12 bg-gray-50/80 rounded-2xl border-transparent focus:bg-white transition-all shadow-sm font-bold"
          />
        </div>

        <div className="md:col-span-3">
          <SelectComponent
            options={[10, 20, 50].map((v) => ({
              label: `Hiện ${v} dòng`,
              value: String(v),
            }))}
            value={String(size)}
            onChange={(val) => {
              setSize(Number(val));
              setPage(0);
            }}
            className="rounded-2xl h-12 shadow-sm"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen space-y-8 animate-in fade-in duration-700 p-2">
      {/* 1. Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCardComponents
          label="Tổng người dùng"
          value={totalElements}
          icon={<Users />}
          color="text-gray-900"
        />
        <StatCardComponents
          label="Đang hoạt động"
          value={users.filter((u) => u.status === "ACTIVE").length}
          icon={<UserCheck />}
          color="text-emerald-500"
        />
        <StatCardComponents
          label="Đã bị khóa"
          value={users.filter((u) => u.status === "LOCKED").length}
          icon={<ShieldAlert />}
          color="text-rose-500"
        />
      </div>

      <div className="bg-white rounded-4xl p-4 border border-gray-100 shadow-custom overflow-hidden">
        <DataTable
          data={users}
          columns={columns}
          loading={loading}
          rowKey="userId"
          page={page}
          size={size}
          totalElements={totalElements}
          onPageChange={setPage}
          headerContent={tableHeader}
          emptyMessage={`Không có nhân sự nào thuộc vai trò ${selectedRole}`}
        />
      </div>
    </div>
  );
};
