"use client";
import { ActionBtn } from "@/components";
import { Column } from "@/components/DataTable/type";
import { cn } from "@/utils/cn";
import dayjs from "dayjs";
import {
  Calendar,
  Edit2,
  Eye,
  Key,
  ShieldCheck,
  Trash2,
  User,
} from "lucide-react";
import { Role } from "../../_types/dto/rbac.dto";

interface RoleColumnProps {
  page: number;
  size: number;
  onView: (record: Role) => void;
  onEdit: (record: Role) => void;
  onManagePermissions: (record: Role) => void;
  onDelete: (record: Role) => void;
}

export const getRoleColumns = ({
  page,
  size,
  onView,
  onEdit,
  onManagePermissions,
  onDelete,
}: RoleColumnProps): Column<Role>[] => [
  {
    header: "STT",
    align: "center",
    render: (_, index) => (
      <span className="font-bold text-gray-400 text-[11px]">
        {String(page * size + index + 1).padStart(2, "0")}
      </span>
    ),
  },
  {
    header: "Vai trò hệ thống",
    render: (row) => (
      <div className="flex items-center gap-3">
        <div className="p-2 bg-orange-50 text-orange-600 rounded-xl border border-orange-100 shadow-sm">
          <ShieldCheck size={16} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col min-w-37.5">
          <span className="font-bold text-gray-900 tracking-tight text-sm">
            {row.roleName}
          </span>
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
            ID: #{row.roleId.split("-")[0].toUpperCase()}
          </span>
        </div>
      </div>
    ),
  },
  {
    header: "Mô tả phạm vi",
    render: (row) => (
      <p className="text-xs text-gray-500 line-clamp-1 max-w-xs font-medium italic">
        {row.description || "Chưa có nội dung mô tả..."}
      </p>
    ),
  },
  {
    header: "Khởi tạo",
    render: (row) => (
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-gray-600">
          <User size={10} className="text-orange-500" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">
            {row.createdBy || "SYSTEM"}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-400">
          <Calendar size={10} />
          <span className="text-[10px] font-medium tracking-tighter">
            {dayjs(row.createdDate).format("DD/MM/YYYY")}
          </span>
        </div>
      </div>
    ),
  },
  {
    header: "Trạng thái",
    align: "center",
    render: (row) => (
      <span
        className={cn(
          "px-3 py-1 text-[9px] font-bold rounded-full uppercase tracking-widest border shadow-xs",
          row.isDeleted
            ? "bg-rose-50 text-rose-600 border-rose-100"
            : "bg-emerald-50 text-emerald-600 border-emerald-100",
        )}
      >
        {row.isDeleted ? "Đã xóa" : "Hoạt động"}
      </span>
    ),
  },
  {
    header: "Hành động",
    align: "right",
    render: (row) => (
      <div className="flex justify-end gap-2 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
        <ActionBtn
          onClick={() => onView(row)}
          icon={<Eye size={14} />}
          color="hover:text-blue-500"
        />
        <ActionBtn
          onClick={() => onManagePermissions(row)}
          icon={<Key size={14} />}
          color="hover:text-emerald-500"
        />
        <ActionBtn
          onClick={() => onEdit(row)}
          icon={<Edit2 size={14} />}
          color="hover:text-orange-500"
        />
        <ActionBtn
          onClick={() => onDelete(row)}
          icon={<Trash2 size={14} />}
          color="hover:text-rose-500"
        />
      </div>
    ),
  },
];
