"use client";

import { VoucherInstance } from "@/app/(main)/shop/_types/dto/shop.voucher.dto";
import { formatDateTime } from "@/hooks/format";
import { cn } from "@/utils/cn";

export const voucherInstanceColumns = [
  {
    header: "Mã định danh (Instance ID)",
    render: (item: VoucherInstance) => (
      <div className="flex flex-col">
        <span className="font-mono text-[11px] font-bold text-gray-800 tracking-tighter">
          {item.id}
        </span>
        <span className="text-[9px] text-gray-400 font-medium uppercase tracking-widest mt-0.5">
          Instance ID
        </span>
      </div>
    ),
  },
  {
    header: "Trạng thái",
    render: (item: VoucherInstance) => {
      const isActive = item.status === "ACTIVE";
      return (
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-1.5 h-1.5 rounded-full animate-pulse",
            isActive ? "bg-emerald-500" : "bg-gray-400"
          )} />
          <span
            className={cn(
              "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight",
              isActive
                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                : "bg-gray-100 text-gray-500 border border-gray-200",
            )}
          >
            {isActive ? "Đang khả dụng" : "Đã sử dụng / Khóa"}
          </span>
        </div>
      );
    },
  },
  {
    header: "Thời gian khởi tạo",
    render: (item: VoucherInstance) => (
      <div className="flex flex-col">
        <span className="text-[11px] font-bold text-gray-600">
          {formatDateTime(item.createdDate)}
        </span>
        <span className="text-[9px] text-gray-400 font-medium uppercase mt-0.5">
          System Logged
        </span>
      </div>
    ),
  },
];