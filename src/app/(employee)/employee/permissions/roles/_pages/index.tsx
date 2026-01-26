"use client";

import {
  ButtonField,
  DataTable,
  FormInput,
  SelectComponent,
  StatCardComponents,
} from "@/components";
import {
  Activity,
  Database,
  Eraser,
  Plus,
  RotateCw,
  Search as SearchIcon,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useRBAC } from "../../_hooks/useRBAC";
import type { Role } from "../../_types/dto/rbac.dto";
import {
  RoleDetailModal,
  RoleForm,
  RolePermissionsModal,
} from "../_components";
import { getRoleColumns } from "./colum";

export default function RoleManagementScreen() {
  const router = useRouter();
  const {
    loading,
    roles,
    page,
    size,
    totalElements,
    setPage,
    setSize,
    fetchRoles,
    deleteRole,
    roleStatistics,
    fetchRoleStatistics,
  } = useRBAC();

  const [searchText, setSearchText] = useState("");

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [viewingRole, setViewingRole] = useState<Role | null>(null);

  useEffect(() => {
    handleSearch();
    fetchRoleStatistics();
  }, [page, size]);

  const handleSearch = () => {
    fetchRoles({
      roleName: searchText || undefined,
      page: page,
      size: size,
      isDeleted: false,
    });
  };

  const handleRefresh = () => {
    setSearchText("");
    setPage(0);
    fetchRoleStatistics();
  };

  const handleResetFilters = () => {
    setSearchText("");
    setPage(0);
    handleSearch();
  };

  const handleAdd = () => {
    setEditingRole(null);
    setIsFormModalOpen(true);
  };

  const handleDelete = async (record: Role) => {
    if (
      window.confirm(`Bạn có chắc chắn muốn xóa vai trò: ${record.roleName}?`)
    ) {
      const success = await deleteRole(record.roleId);
      if (success) {
        handleRefresh();
      }
    }
  };

  const handleFormSuccess = () => {
    setIsFormModalOpen(false);
    setEditingRole(null);
    handleRefresh();
  };

  const handlePermissionsSuccess = () => {
    setIsPermissionsModalOpen(false);
    setViewingRole(null);
  };

  const columns = useMemo(
    () =>
      getRoleColumns({
        page,
        size,
        onView: (record) => {
          setViewingRole(record);
          setIsDetailModalOpen(true);
        },
        onEdit: (record) => {
          setEditingRole(record);
          setIsFormModalOpen(true);
        },
        onManagePermissions: (record) =>
          router.push(`/employee/permissions/roles/${record.roleId}`),
        onDelete: handleDelete,
      }),
    [page, size],
  );

  const tableHeader = (
    <div className="w-full space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-orange-100 text-orange-600 rounded-2xl shadow-sm">
            <Database size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 uppercase text-xs tracking-widest leading-none">
              Role Manager
            </h3>
            <p className="text-[10px] font-bold text-gray-400 mt-1 italic">
              Quản lý và phân bổ vai trò hệ thống ({totalElements})
            </p>
          </div>
        </div>

        <ButtonField
          type="login"
          onClick={handleAdd}
          className="w-full lg:w-44 rounded-2xl shadow-xl shadow-orange-500/10 border-0 h-11 text-[12px]! font-bold uppercase"
        >
          <span className="flex gap-2 items-center">
            <Plus size={16} strokeWidth={3} className="mr-1" /> Thêm vai trò
          </span>
        </ButtonField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-8 relative group">
          <SearchIcon
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors z-10"
            size={18}
          />
          <FormInput
            placeholder="Tìm kiếm theo tên vai trò..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-12 h-12 bg-gray-50/80 rounded-2xl border-transparent focus:bg-white transition-all shadow-sm font-bold"
          />
        </div>

        <div className="md:col-span-2">
          <SelectComponent
            options={[10, 20, 50, 100].map((v) => ({
              label: `Hiện ${v} dòng`,
              value: String(v),
            }))}
            value={String(size)}
            onChange={(val) => {
              setSize(Number(val));
              setPage(0);
            }}
            className="rounded-2xl h-12"
          />
        </div>

        <div className="md:col-span-2 flex gap-2">
          <button
            onClick={handleRefresh}
            className="flex-1 flex items-center justify-center bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-orange-500 transition-all shadow-sm active:scale-90"
          >
            <RotateCw size={18} />
          </button>
          <button
            onClick={handleResetFilters}
            className="flex-1 flex items-center justify-center bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-rose-500 transition-all shadow-sm active:scale-90"
          >
            <Eraser size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen space-y-8 animate-in fade-in duration-700">
      {/* 1. Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCardComponents
          label="Tổng vai trò"
          value={roleStatistics?.totalRoles || 0}
          icon={<ShieldCheck />}
          color="text-gray-900"
        />
        <StatCardComponents
          label="Đang hoạt động"
          value={roleStatistics?.activeRoles || 0}
          icon={<Activity />}
          color="text-emerald-500"
        />
        <StatCardComponents
          label="Đã vô hiệu"
          value={roleStatistics?.deletedRoles || 0}
          icon={<ShieldAlert />}
          color="text-rose-500"
        />
      </div>

      {/* 2. Main Workspace */}
      <div className="bg-white rounded-4xl p-4 border border-gray-100 shadow-custom overflow-hidden">
        <DataTable
          data={roles}
          columns={columns}
          loading={loading}
          rowKey="roleId"
          page={page}
          size={size}
          totalElements={totalElements}
          onPageChange={(newPage) => setPage(newPage)}
          headerContent={tableHeader}
        />
      </div>

      {/* 3. Forms & Modals */}
      <RoleForm
        isOpen={isFormModalOpen}
        role={editingRole}
        onSuccess={handleFormSuccess}
        onCancel={() => {
          setIsFormModalOpen(false);
          setEditingRole(null);
        }}
      />
      <RoleDetailModal
        role={viewingRole}
        open={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
      <RolePermissionsModal
        role={viewingRole}
        open={isPermissionsModalOpen}
        onClose={() => setIsPermissionsModalOpen(false)}
        onSuccess={handlePermissionsSuccess}
      />
    </div>
  );
}
