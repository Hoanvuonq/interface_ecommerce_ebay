"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useRBAC, useGetRoleDetail } from "../../../_hooks/useRBAC";
import type { Permission } from "../../../_types/dto/rbac.dto";
import {
  DataTable,
  SelectComponent,
  FormInput,
  StatCardComponents,
} from "@/components";
import {
  ArrowLeft,
  RotateCw,
  ShieldCheck,
  Database,
  Search as SearchIcon,
  Activity,
  ShieldAlert,
  Fingerprint,
} from "lucide-react";
import { getRolePermissionColumns } from "./colum";
import { Button } from "@/components/button";

export const RolePermissionsDetailScreen = () => {
  const params = useParams();
  const router = useRouter();
  const roleId = params?.roleId as string;

  const {
    loading,
    rolePermissions,
    fetchRolePermissions,
    rolePermissionsTotalElements,
  } = useRBAC();

  const { handleGetRoleDetail, loading: roleLoading } = useGetRoleDetail();

  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sort, setSort] = useState<string>("createdDate,desc");
  const [roleName, setRoleName] = useState<string>("");

  useEffect(() => {
    if (roleId) {
      handleGetRoleDetail(roleId).then((res) => {
        if (res?.success && res.data) setRoleName(res.data.roleName);
      });
    }
  }, [roleId]);

  useEffect(() => {
    if (roleId) {
      const fetchSize = searchText ? 1000 : size;
      fetchRolePermissions(roleId, {
        page: searchText ? 0 : page,
        size: fetchSize,
        sort: sort,
      });
    }
  }, [roleId, page, size, sort, searchText]);

  const handleRefresh = () => {
    setSearchText("");
    setPage(0);
  };

  const filteredPermissions = useMemo(() => {
    if (!searchText) return rolePermissions;
    return rolePermissions.filter(
      (p) =>
        p.permissionName.toLowerCase().includes(searchText.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [rolePermissions, searchText]);

  const columns = useMemo(
    () =>
      getRolePermissionColumns({
        page,
        size,
        searchText,
      }),
    [page, size, searchText],
  );

  const tableHeader = (
    <div className="w-full space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="edit"
            onClick={() => router.push("/employee/permissions/roles")}
            className="p-3 rounded-2xl bg-white border border-gray-100 shadow-sm hover:text-orange-500"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-100 text-orange-600 rounded-2xl shadow-sm">
              <Fingerprint size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 uppercase text-xs tracking-[0.2em] leading-none">
                Role Context
              </h3>
              <p className="text-sm font-bold text-orange-600 mt-1 italic uppercase">
                {roleName || "Đang xác thực..."}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-orange-500 transition-all shadow-sm active:scale-90"
          >
            <RotateCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-8 relative group">
          <SearchIcon
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors z-10"
            size={18}
          />
          <FormInput
            placeholder="Tìm kiếm mã quyền hạn trong vai trò này..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-12 h-12 bg-gray-50/80 rounded-2xl border-transparent focus:bg-white transition-all shadow-sm font-bold"
          />
        </div>

        <div className="md:col-span-4 flex gap-2">
          <SelectComponent
            options={[
              { label: "Hiện 10 dòng", value: "10" },
              { label: "Hiện 20 dòng", value: "20" },
              { label: "Hiện 50 dòng", value: "50" },
            ]}
            value={String(size)}
            onChange={(val) => {
              setSize(Number(val));
              setPage(0);
            }}
            className="flex-1 rounded-2xl h-12 shadow-sm"
          />
          <SelectComponent
            options={[
              { label: "Mới nhất", value: "createdDate,desc" },
              { label: "Cũ nhất", value: "createdDate,asc" },
              { label: "Tên A-Z", value: "permissionName,asc" },
            ]}
            value={sort}
            onChange={setSort}
            className="flex-1 rounded-2xl h-12 shadow-sm"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen space-y-8 animate-in fade-in duration-700 p-2">
      {/* Statistics Layer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCardComponents
          label="Tổng quyền hạn"
          value={rolePermissionsTotalElements}
          icon={<ShieldCheck />}
          color="text-gray-900"
        />
        <StatCardComponents
          label="Đang hoạt động"
          value={filteredPermissions.filter((p) => !p.isDeleted).length}
          icon={<Activity />}
          color="text-emerald-500"
        />
        <StatCardComponents
          label="Đã vô hiệu"
          value={filteredPermissions.filter((p) => p.isDeleted).length}
          icon={<ShieldAlert />}
          color="text-rose-500"
        />
      </div>

      {/* Main Table Workspace */}
      <div className="bg-white rounded-[3rem] p-2 border border-gray-100 shadow-custom overflow-hidden">
        <DataTable
          data={filteredPermissions}
          columns={columns}
          loading={loading || roleLoading}
          rowKey="permissionId"
          page={page}
          size={size}
          totalElements={
            searchText
              ? filteredPermissions.length
              : rolePermissionsTotalElements
          }
          onPageChange={setPage}
          headerContent={tableHeader}
        />
      </div>
    </div>
  );
};
