"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionBtn } from "@/components";
import { Column } from "@/components/DataTable/type";
import dayjs from "dayjs";
import { Building2, Edit2, Eye } from "lucide-react";
import { Department } from "../../_types/department.type";

interface ColumnProps {
  onEdit: (row: Department) => void;
  onView: (id: string) => void;
}

export const getDepartmentColumns = ({
  onEdit,
  onView,
}: ColumnProps): Column<Department>[] => [
  {
    header: "Phòng ban",
    render: (row) => (
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100 shadow-sm shrink-0">
          <Building2 size={20} strokeWidth={2.5} />
        </div>
        <div className="min-w-0">
          <p className="font-bold text-gray-900 tracking-tight leading-none truncate">
            {row.departmentName}
          </p>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1.5 flex items-center gap-1">
            <span className="text-orange-400/60">ID:</span>{" "}
            {row.departmentId.split("-")[0]}
          </p>
        </div>
      </div>
    ),
  },
  {
    header: "Mô tả chi tiết",
    render: (row) => (
      <p className="text-xs text-gray-500 line-clamp-1 max-w-xs font-medium italic">
        {row.description || "Chưa có nội dung mô tả..."}
      </p>
    ),
  },
  {
    header: "Ngày khởi tạo",
    align: "center",
    render: (row) => (
      <span className="text-[11px] font-bold text-gray-600 uppercase tracking-tighter bg-gray-100 px-2 py-1 rounded-lg">
        {dayjs(row.createdDate).format("DD/MM/YYYY")}
      </span>
    ),
  },
  {
    header: "Hành động",
    align: "right",
    render: (row) => (
      <div className="flex justify-end gap-2 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
        <ActionBtn
          onClick={() => onEdit(row)}
          icon={<Edit2 size={14} />}
          color="hover:text-blue-500"
        />
        <ActionBtn
          onClick={() => onView(row.departmentId)}
          icon={<Eye size={14} />}
          color="hover:text-orange-500"
        />
      </div>
    ),
  },
];
