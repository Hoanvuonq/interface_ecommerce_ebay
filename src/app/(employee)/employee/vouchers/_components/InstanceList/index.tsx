"use client";

import React, { useMemo } from "react";
import {
  VoucherInstance,
  VoucherInstanceStatus,
} from "../../_types/voucher-v2.type";
import dayjs from "dayjs";
import { DataTable, ActionBtn } from "@/components";
import { Column } from "@/components/DataTable/type";
import { Monitor, Store, Zap, Clock, AlertCircle, Hash } from "lucide-react";
import { cn } from "@/utils/cn";

interface InstanceListProps {
  instances: VoucherInstance[];
  loading?: boolean;
  onUseInstance?: (instance: VoucherInstance) => void;
}

export const InstanceList = ({
  instances,
  loading = false,
  onUseInstance,
}: InstanceListProps) => {
  // Logic giữ nguyên
  const getRemainingQuantity = (instance: VoucherInstance) =>
    instance.totalQuantity - instance.usedQuantity;

  const getUsagePercentage = (instance: VoucherInstance) =>
    (instance.usedQuantity / instance.totalQuantity) * 100;

  // Cấu hình giao diện mới cho Status
  const getStatusConfig = (status: VoucherInstanceStatus) => {
    switch (status) {
      case VoucherInstanceStatus.ACTIVE:
        return {
          label: "Hoạt động",
          className: "bg-emerald-50 text-emerald-600 border-emerald-100",
        };
      case VoucherInstanceStatus.EXPIRED:
        return {
          label: "Hết hạn",
          className: "bg-rose-50 text-rose-600 border-rose-100",
        };
      case VoucherInstanceStatus.EXHAUSTED:
        return {
          label: "Đã hết",
          className: "bg-amber-50 text-amber-600 border-amber-100",
        };
      default:
        return {
          label: status,
          className: "bg-slate-50  text-gray-600 border-slate-100",
        };
    }
  };

  const columns: Column<VoucherInstance>[] = useMemo(
    () => [
      {
        header: "Chủ sở hữu",
        render: (record) => (
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "p-2.5 rounded-xl border shadow-sm",
                record.ownerType === "PLATFORM"
                  ? "bg-blue-50 border-blue-100 text-blue-600"
                  : "bg-emerald-50 border-emerald-100 text-emerald-600",
              )}
            >
              {record.ownerType === "PLATFORM" ? (
                <Monitor size={18} />
              ) : (
                <Store size={18} />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold uppercase tracking-tight  text-gray-800">
                {record.ownerType === "PLATFORM" ? "Sàn Protocol" : "Cửa hàng"}
              </span>
              <span className="text-[10px] font-bold  text-gray-400 font-mono tracking-tighter italic">
                ID: {record.ownerId?.slice(-8).toUpperCase() || "GLOBAL"}
              </span>
            </div>
          </div>
        ),
      },
      {
        header: "Hiệu suất sử dụng",
        className: "w-[240px]",
        render: (record) => {
          const remaining = getRemainingQuantity(record);
          const percentage = getUsagePercentage(record);

          return (
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end px-1">
                <span className="text-[11px] font-bold  text-gray-700 uppercase">
                  Còn lại:{" "}
                  <span className="text-blue-600">
                    {remaining.toLocaleString()}
                  </span>
                </span>
                <span className="text-[10px] font-bold  text-gray-400">
                  {record.usedQuantity}/{record.totalQuantity}
                </span>
              </div>
              {/* Custom Progress Bar */}
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                <div
                  className={cn(
                    "h-full transition-all duration-500 rounded-full",
                    percentage < 50
                      ? "bg-emerald-500"
                      : percentage < 80
                        ? "bg-amber-500"
                        : "bg-rose-500",
                  )}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        },
      },
      {
        header: "Hạn sử dụng",
        render: (record) => {
          const expiry = dayjs(record.expiryDate);
          const now = dayjs();
          const isExpired = now.isAfter(expiry);
          const daysLeft = expiry.diff(now, "day");

          return (
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 font-mono text-[13px] font-bold">
                <Clock
                  size={12}
                  className={isExpired ? "text-rose-500" : " text-gray-400"}
                />
                <span
                  className={isExpired ? "text-rose-600" : " text-gray-700"}
                >
                  {expiry.format("DD/MM/YYYY")}
                </span>
              </div>
              {!isExpired && (
                <span
                  className={cn(
                    "text-[9px] font-bold uppercase px-2 py-0.5 rounded-md border w-fit",
                    daysLeft < 7
                      ? "bg-rose-50 text-rose-600 border-rose-100"
                      : "bg-blue-50 text-blue-600 border-blue-100",
                  )}
                >
                  Hết hạn sau {daysLeft} ngày
                </span>
              )}
            </div>
          );
        },
      },
      {
        header: "Trạng thái",
        align: "center",
        render: (record) => {
          const config = getStatusConfig(record.status);
          return (
            <span
              className={cn(
                "px-3 py-1 rounded-full text-[10px] font-bold uppercase border tracking-tighter",
                config.className,
              )}
            >
              {config.label}
            </span>
          );
        },
      },
      {
        header: "Ver",
        align: "center",
        render: (record) => (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold  text-gray-400 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
            <Hash size={10} /> {record.version}
          </span>
        ),
      },
      {
        header: "Thao tác",
        align: "right",
        render: (record) => {
          const canUse =
            record.status === VoucherInstanceStatus.ACTIVE &&
            getRemainingQuantity(record) > 0;

          return (
            <ActionBtn
              icon={<Zap size={14} />}
              label="Sử dụng"
              disabled={!canUse}
              onClick={() => onUseInstance?.(record)}
              color={
                canUse
                  ? "bg-orange-500 text-white hover:bg-orange-600 shadow-orange-200"
                  : "bg-slate-100  text-gray-400 border-slate-200"
              }
              tooltip={
                !canUse ? "Instance không khả dụng" : "Kích hoạt voucher ngay"
              }
            />
          );
        },
      },
    ],
    [onUseInstance],
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
            <AlertCircle size={20} strokeWidth={2.5} />
          </div>
          <h3 className="text-lg font-bold  text-gray-800 uppercase tracking-tight">
            Thực thể Voucher{" "}
            <span className=" text-gray-400 font-normal">
              ({instances.length})
            </span>
          </h3>
        </div>
      </div>

      <DataTable<VoucherInstance>
        data={instances}
        columns={columns}
        loading={loading}
        rowKey="id"
        size={10}
        page={0}
        totalElements={instances.length}
        onPageChange={() => {}}
        emptyMessage="Không tìm thấy thực thể nào"
      />
    </div>
  );
}
