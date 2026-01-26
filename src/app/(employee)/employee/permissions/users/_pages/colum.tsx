"use client";
import { ActionBtn } from "@/components";
import { Column } from "@/components/DataTable/type";
import { cn } from "@/utils/cn";
import dayjs from "dayjs";
import { Calendar, Key, Mail, User as UserIcon } from "lucide-react";
import { IUserPermission } from "../_types/users.role";

export const getUserPermissionColumns = (
  page: number,
  size: number,
  onViewPermissions: (user: IUserPermission) => void,
): Column<IUserPermission>[] => [
  {
    header: "STT",
    align: "center",
    render: (_, index) => (
      <span className="text-[11px] font-bold text-gray-400">
        {String(page * size + index + 1).padStart(2, "0")}
      </span>
    ),
  },
  {
    header: "Danh tính người dùng",
    render: (row) => (
      <div className="flex items-center gap-3">
        <div className="p-2 bg-orange-100 text-orange-600 rounded-xl shadow-sm">
          <UserIcon size={16} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-gray-900 tracking-tight text-sm truncate uppercase">
            {row.username}
          </span>
          <div className="flex items-center gap-1.5 text-gray-400">
            <Mail size={10} />
            <span className="text-[10px] font-medium truncate italic">
              {row.email || "Chưa cập nhật email"}
            </span>
          </div>
        </div>
      </div>
    ),
  },
  {
    header: "Vai trò hệ thống",
    render: (row) => (
      <div className="flex items-center gap-2">
        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-bold uppercase tracking-widest shadow-xs">
          {row.roleName}
        </span>
      </div>
    ),
  },
  {
    header: "Trạng thái",
    align: "center",
    render: (row) => {
      const statusMap: Record<string, string> = {
        ACTIVE: "bg-emerald-50 text-emerald-600 border-emerald-100",
        LOCKED: "bg-rose-50 text-rose-600 border-rose-100",
        DELETED: "bg-gray-100 text-gray-500 border-gray-200",
      };
      const textMap: Record<string, string> = {
        ACTIVE: "Hoạt động",
        LOCKED: "Đã khóa",
        DELETED: "Đã xóa",
      };
      return (
        <span
          className={cn(
            "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border",
            statusMap[row.status] || "bg-gray-50 text-gray-400 border-gray-100",
          )}
        >
          {textMap[row.status] || row.status}
        </span>
      );
    },
  },
  {
    header: "Ngày tham gia",
    render: (row) => (
      <div className="flex items-center gap-1.5 text-gray-400 font-medium text-[11px]">
        <Calendar size={12} />
        {dayjs(row.createdDate).format("DD/MM/YYYY")}
      </div>
    ),
  },
  {
    header: "Phân quyền",
    align: "right",
    render: (row) => (
      <div className="flex justify-end pr-2">
        <ActionBtn
          onClick={() => onViewPermissions(row)}
          icon={<Key size={14} />}
          tooltip="Quản lý quyền hạn"
          color="hover:bg-orange-500 hover:text-white"
        />
      </div>
    ),
  },
];
