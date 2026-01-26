"use client";

import { useEffect, useMemo, useState } from "react";
import { useDeletePermission, useGetPermissions } from "../../_hooks/useRBAC";

import {
  ButtonField,
  DataTable,
  FormInput,
  SelectComponent,
  StatCardComponents,
} from "@/components";
import { cn } from "@/utils/cn";
import {
  Activity,
  Database,
  Eraser,
  Plus,
  Search as SearchIcon,
  ShieldAlert,
  ShieldCheck
} from "lucide-react";
import { Permission } from "../../_types/dto/rbac.dto";
import { PermissionDetailModal, PermissionForm } from "../_components";
import { getPermissionColumns } from "./colum";

export const PermissionTable = () => {
  const { handleGetPermissions, loading } = useGetPermissions();
  const { handleDeletePermission } = useDeletePermission();

  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [sort, setSort] = useState<string>("createdDate,desc");

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(
    null,
  );
  const [viewingPermission, setViewingPermission] = useState<Permission | null>(
    null,
  );

  // ==================== LIFECYCLE ====================

  useEffect(() => {
    const timeoutId = setTimeout(
      () => {
        handleSearch();
      },
      searchText !== "" ? 500 : 0,
    );

    return () => clearTimeout(timeoutId);
  }, [page, size, sort, searchText]);

  const handleSearch = async () => {
    try {
      const res = await handleGetPermissions({
        permissionName: searchText || undefined,
        page,
        size,
        sort,
        isDeleted: false,
      });

      if (res?.success && res.data) {
        if (res.data.content && Array.isArray(res.data.content)) {
          setPermissions(res.data.content);
          setTotalElements(res.data.totalElements ?? 0);
        } else if (Array.isArray(res.data)) {
          setPermissions(res.data);
          setTotalElements(res.data.length);
        }
      } else {
        setPermissions([]);
        setTotalElements(0);
      }
    } catch (error) {
      console.error("Error fetching permissions:", error);
      setPermissions([]);
      setTotalElements(0);
    }
  };

  const handleRefresh = () => {
    setSearchText("");
    setPage(0);
  };

  const handleResetFilters = () => {
    setSearchText("");
    setPage(0);
    setSort("createdDate,desc");
    setSize(10);
  };

  const handleAdd = () => {
    setEditingPermission(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (record: Permission) => {
    setEditingPermission(record);
    setIsFormModalOpen(true);
  };

  const handleViewDetail = (record: Permission) => {
    setViewingPermission(record);
    setIsDetailModalOpen(true);
  };

  const handleDelete = async (record: Permission) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa quyền hạn: ${record.permissionName}?`,
      )
    ) {
      const res = await handleDeletePermission(record.permissionId);
      if (res?.success) {
        handleRefresh();
      }
    }
  };

  const handleFormSuccess = () => {
    setIsFormModalOpen(false);
    setEditingPermission(null);
    handleRefresh();
  };

  const columns = useMemo(
    () =>
      getPermissionColumns({
        page: page,
        size: size,
        onView: (record) => handleViewDetail(record),
        onEdit: (record) => handleEdit(record),
        onDelete: (record) => handleDelete(record),
      }),
    [page, size],
  );

  const tableHeader = (
    <div className="w-full space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="p-2.5 bg-orange-100 text-orange-600 rounded-2xl shadow-sm shrink-0">
            <Database size={20} strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-gray-800 uppercase text-2xl leading-none">
              Quản lý quyền hạn
            </h3>
            <p className="text-[12px] font-semibold text-gray-400 mt-1 italic truncate">
              Đang quản lý {totalElements} định danh quyền hạn trong hệ thống
            </p>
          </div>
        </div>

        <ButtonField
          type="login"
          onClick={handleAdd}
          className="w-full lg:w-48! rounded-2xl shadow-xl shadow-orange-500/10 border-0 h-11 text-[12px]! font-bold uppercase tracking-widest"
        >
          <span className="flex items-center justify-center">
            <Plus size={16} strokeWidth={3} className="mr-1" /> Thêm định danh
          </span>
        </ButtonField>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-6 lg:col-span-7 relative group">
          <SearchIcon
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors z-10"
            size={18}
          />
          <FormInput
            placeholder="Tìm mã quyền hạn (VD: USER_CREATE)..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-12 h-12 bg-gray-50/80 rounded-2xl border-transparent focus:bg-white transition-all shadow-sm font-bold"
          />
        </div>

        <div className="md:col-span-3 lg:col-span-2">
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
            className="rounded-2xl h-12"
          />
        </div>

        <div className="md:col-span-3 lg:col-span-3 flex gap-2">
          <SelectComponent
            options={[
              { label: "Sắp xếp: Mới nhất", value: "createdDate,desc" },
              { label: "Sắp xếp: Cũ nhất", value: "createdDate,asc" },
              { label: "Tên: A-Z", value: "permissionName,asc" },
              { label: "Tên: Z-A", value: "permissionName,desc" },
            ]}
            value={sort}
            onChange={(val) => setSort(val)}
            className="flex-1 rounded-2xl h-12"
          />

          <button
            onClick={handleResetFilters}
            className={cn(
              "w-12 h-12 flex items-center justify-center bg-white border border-gray-100",
              "rounded-2xl text-gray-400 hover:text-orange-500 hover:border-orange-200 transition-all shadow-sm active:scale-90",
            )}
            title="Xóa bộ lọc"
          >
            <Eraser size={20} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCardComponents
          label="Tổng định danh"
          value={totalElements}
          icon={<ShieldCheck />}
          color="text-gray-900"
        />
        <StatCardComponents
          label="Đang hoạt động"
          value={permissions.filter((p) => !p.isDeleted).length}
          icon={<Activity />}
          color="text-emerald-500"
          trend={100}
        />
        <StatCardComponents
          label="Đã vô hiệu"
          value={permissions.filter((p) => p.isDeleted).length}
          icon={<ShieldAlert />}
          color="text-rose-500"
        />
      </div>

      <div className="bg-white rounded-4xl p-4 border border-gray-100 shadow-custom overflow-hidden">
        <DataTable
          data={permissions}
          columns={columns}
          loading={loading}
          rowKey="permissionId"
          page={page}
          size={size}
          totalElements={totalElements}
          onPageChange={(newPage) => setPage(newPage)}
          headerContent={tableHeader}
        />
      </div>

      <PermissionForm
        isOpen={isFormModalOpen}
        permission={editingPermission}
        onSuccess={handleFormSuccess}
        onCancel={() => {
          setIsFormModalOpen(false);
          setEditingPermission(null);
        }}
      />

      <PermissionDetailModal
        permission={viewingPermission}
        open={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setViewingPermission(null);
        }}
      />
    </div>
  );
};
