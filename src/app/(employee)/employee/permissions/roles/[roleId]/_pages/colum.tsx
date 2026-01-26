/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import dayjs from "dayjs";
import { ShieldCheck, User, Calendar, Clock } from "lucide-react";
import { Permission } from "../../../_types/dto/rbac.dto";
import { Column } from "@/components/DataTable/type";
import { cn } from "@/utils/cn";

interface PermissionColumnProps {
  page: number;
  size: number;
  searchText: string;
}

export const getRolePermissionColumns = ({
  page,
  size,
  searchText,
}: PermissionColumnProps): Column<Permission>[] => [
  {
    header: "STT",
    align: "center",
    render: (_, index) => (
      <span className="font-bold text-gray-400 text-[11px]">
        {searchText
          ? String(index + 1).padStart(2, "0")
          : String(page * size + index + 1).padStart(2, "0")}
      </span>
    ),
  },
  {
    header: "Định danh quyền hạn",
    render: (row) => (
      <div className="flex items-center gap-3">
        <div className="p-2 bg-orange-50 text-orange-500 rounded-xl border border-orange-100 shadow-sm">
          <ShieldCheck size={16} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-gray-900 tracking-tight text-sm uppercase">
            {row.permissionName}
          </span>
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
            Module: {row.permissionName.split("_")[0]}
          </span>
        </div>
      </div>
    ),
  },
  {
    header: "Mô tả phạm vi",
    render: (row) => (
      <p className="text-xs text-gray-500 line-clamp-1 max-w-xs font-medium italic leading-relaxed">
        {row.description || "Chưa có nội dung mô tả..."}
      </p>
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
        {row.isDeleted ? "Đã vô hiệu" : "Hoạt động"}
      </span>
    ),
  },
  {
    header: "Khởi tạo hệ thống",
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
    header: "Cập nhật cuối",
    render: (row) => (
      <div className="flex items-center gap-1.5 text-gray-400">
        <Clock size={10} />
        <span className="text-[10px] font-medium tracking-tighter">
          {dayjs(row.lastModifiedDate).format("DD/MM/YYYY HH:mm")}
        </span>
      </div>
    ),
  },
];
