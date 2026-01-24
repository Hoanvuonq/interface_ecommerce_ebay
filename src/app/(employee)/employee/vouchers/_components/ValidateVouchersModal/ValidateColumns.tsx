"use client";

import { Column } from "@/components/DataTable/type";
import { cn } from "@/utils/cn";
import { CheckCircle2, Info, XCircle } from "lucide-react";

export const getValidColumns = (): Column<any>[] => [
  {
    header: "Mã định danh",
    render: (record) => (
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-600 text-[11px] font-bold border border-emerald-100 uppercase flex items-center gap-1.5 shadow-sm">
          <CheckCircle2 size={12} /> {record.code}
        </span>
      </div>
    ),
  },
  {
    header: "Giá trị ưu đãi",
    align: "right",
    render: (record) => (
      <span className="font-bold text-orange-600 font-mono">
        {record.discountValue.toLocaleString()}₫
      </span>
    ),
  },
  {
    header: "ID Mẫu (Template)",
    className: "max-w-[150px]",
    render: (record) => (
      <span className="text-[10px] font-bold  text-gray-400 font-mono truncate block italic">
        {record.templateId}
      </span>
    ),
  },
  {
    header: "Trạng thái",
    align: "center",
    render: (record) => (
      <span
        className={cn(
          "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border tracking-tighter",
          record.isUsable
            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
            : "bg-amber-100 text-amber-700 border-amber-200",
        )}
      >
        {record.isUsable ? "Khả dụng" : "Bị giới hạn"}
      </span>
    ),
  },
];

// Cột cho Voucher không hợp lệ
export const getInvalidColumns = (): Column<any>[] => [
  {
    header: "Mã từ chối",
    render: (record) => (
      <span className="px-2 py-0.5 rounded-lg bg-rose-50 text-rose-600 text-[11px] font-bold border border-rose-100 uppercase flex items-center gap-1.5 shadow-sm w-fit">
        <XCircle size={12} /> {record.code}
      </span>
    ),
  },
  {
    header: "Nguyên nhân lỗi",
    render: (record) => (
      <div className="flex items-start gap-2 max-w-75">
        <Info size={12} className=" text-gray-300 mt-1 shrink-0" />
        <span className="text-[11px] font-bold  text-gray-500 italic leading-relaxed">
          {record.reason}
        </span>
      </div>
    ),
  },
];
