"use client";

import { ActionBtn, ActionDropdown, DropdownItem } from "@/components";
import { Column } from "@/components/DataTable/type";
import { cn } from "@/utils/cn";
import { toSizedVariant } from "@/utils/products/media.helpers";
import { toPublicUrl } from "@/utils/storage/url";
import dayjs from "dayjs";
import {
  Clock,
  DollarSign,
  Edit3,
  Eye,
  Gift,
  MoreHorizontal,
  Search,
  Trash2,
  Zap,
  Hash,
  Copy,
  Calendar,
  Layers,
  UserCheck,
  ShieldCheck,
  Tag,
} from "lucide-react";
import Image from "next/image";
import { DiscountType, VoucherTemplate } from "../../_types/voucher-v2.type";

const resolveTemplateImageUrl = (template: VoucherTemplate) => {
  if (template.imageBasePath && template.imageExtension) {
    const rawPath = `${template.imageBasePath}${template.imageExtension}`;
    return toPublicUrl(toSizedVariant(rawPath, "_orig"));
  }
  return null;
};

export const getTemplateColumns = (
  onView?: (r: VoucherTemplate) => void,
  onEdit?: (r: VoucherTemplate) => void,
  onDelete?: (r: VoucherTemplate) => void,
  onCheckUsage?: (r: VoucherTemplate) => void,
  onUsePlatform?: (r: VoucherTemplate) => void,
  onToggleStatus?: (r: VoucherTemplate) => void,
  toastSuccess?: (msg: string) => void,
): Column<VoucherTemplate>[] => [
  {
    header: "Voucher",
    className: "min-w-[240px]",
    render: (record) => {
      const imageUrl = resolveTemplateImageUrl(record);
      return (
        <div className="flex items-center gap-4">
          <div className="relative size-12 shrink-0 rounded-xl overflow-hidden border border-orange-100 bg-orange-50/30 flex items-center justify-center group shadow-sm">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={record.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                unoptimized
              />
            ) : (
              <span className="text-orange-500 font-bold text-sm italic uppercase">
                {record.code?.slice(0, 2) || "VC"}
              </span>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-gray-800 uppercase text-[13px] tracking-tight truncate leading-tight">
              {record.name}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-[11px] font-bold text-blue-600 tracking-tighter">
                {record.code}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(record.code);
                  toastSuccess?.("Đã copy mã!");
                }}
                className="text-gray-300 hover:text-blue-500 transition-colors"
              >
                <Copy size={10} />
              </button>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    header: "Mã định danh (ID)",
    className: "w-[180px]",
    render: (record) => (
      <div className="flex items-center gap-1.5 text-slate-400 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 w-fit">
        <Hash size={10} />
        <span className="text-[10px] font-mono font-medium tracking-tighter">
          {record.id}
        </span>
      </div>
    ),
  },
  {
    header: "Ưu đãi",
    align: "right",
    className: "w-[130px]",
    render: (record) => (
      <div className="flex flex-col items-end">
        <span
          className={cn(
            "font-bold text-[15px] font-mono leading-none",
            record.discountType === DiscountType.PERCENTAGE
              ? "text-blue-600"
              : "text-emerald-600",
          )}
        >
          {record.discountType === DiscountType.PERCENTAGE
            ? `${record.discountValue}%`
            : `${record.discountValue.toLocaleString()}₫`}
        </span>
        {(record.maxDiscount ?? 0) > 0 && (
          <span className="text-[9px] font-bold text-slate-400 mt-1 italic uppercase tracking-tighter">
            Max {(record.maxDiscount ?? 0).toLocaleString()}₫
          </span>
        )}
      </div>
    ),
  },
  {
    header: "Cấu hình",
    className: "w-[160px]",
    render: (record) => (
      <div className="flex flex-col gap-1.5">
        <div className="flex flex-wrap gap-1">
          <span
            className={cn(
              "px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border",
              record.purchasable
                ? "bg-amber-50 text-amber-600 border-amber-100"
                : "bg-emerald-50 text-emerald-600 border-emerald-100",
            )}
          >
            {record.purchasable ? "Paid" : "Free"}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[9px] font-bold uppercase border border-slate-200">
            {record.creatorType}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
          <ShieldCheck size={12} className="text-blue-400" />
          <span>
            {record.voucherScope === "SHOP_ORDER"
              ? "Toàn shop"
              : record.voucherScope}
          </span>
        </div>
      </div>
    ),
  },
  {
    header: "Giới hạn & Đối tượng",
    className: "w-[180px]",
    render: (record) => (
      <div className="flex flex-col gap-1">
        <div className="text-[11px] font-medium text-slate-500">
          Min đơn:{" "}
          <b className="text-slate-800 font-bold">
            {(record.minOrderAmount ?? 0).toLocaleString()}₫
          </b>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[9px] font-bold">
            SL: {record.maxUsage}
          </span>
          {record.applyToAllCustomers && (
            <span className="flex items-center gap-1 text-[9px] bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded font-bold uppercase border border-purple-100">
              <UserCheck size={10} /> All Users
            </span>
          )}
        </div>
      </div>
    ),
  },
  {
    header: "Thời gian",
    className: "w-[160px]",
    render: (record) => (
      <div className="flex flex-col gap-1 italic">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
          <Calendar size={12} className="text-emerald-500" />
          <span>In: {dayjs(record.startDate).format("DD/MM HH:mm")}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
          <Clock size={12} className="text-rose-400" />
          <span>Out: {dayjs(record.endDate).format("DD/MM HH:mm")}</span>
        </div>
      </div>
    ),
  },
  {
    header: "Trạng thái",
    align: "center",
    className: "w-[120px]",
    render: (record) => {
      const now = dayjs();
      const isEnded = record.endDate
        ? now.isAfter(dayjs(record.endDate))
        : false;
      const isStarted = now.isAfter(dayjs(record.startDate));

      if (isEnded)
        return (
          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-400 text-[10px] font-bold uppercase border border-slate-200">
            Hết hạn
          </span>
        );
      if (!isStarted)
        return (
          <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-600 text-[10px] font-bold uppercase border border-amber-100 animate-pulse">
            Sắp tới
          </span>
        );

      return (
        <button
          onClick={() => onToggleStatus?.(record)}
          className={cn(
            "relative w-10 h-5 rounded-full transition-all duration-300 flex items-center px-1 shadow-inner",
            record.active ? "bg-emerald-500" : "bg-slate-200",
          )}
        >
          <div
            className={cn(
              "size-3.5 bg-white rounded-full shadow-md transition-transform duration-300",
              record.active ? "translate-x-4.5" : "translate-x-0",
            )}
          />
        </button>
      );
    },
  },
  {
    header: "Thao tác",
    align: "right",
    className: "w-[60px]",
    render: (record) => (
      <ActionDropdown
        trigger={<ActionBtn icon={<MoreHorizontal size={14} />} />}
        items={[
          {
            key: "view",
            label: "Chi tiết",
            icon: <Eye size={14} />,
            onClick: () => onView?.(record),
          },
          {
            key: "check",
            label: "Kiểm tra",
            icon: <Search size={14} />,
            onClick: () => onCheckUsage?.(record),
          },
          {
            key: "edit",
            label: "Chỉnh sửa",
            icon: <Edit3 size={14} />,
            onClick: () => onEdit?.(record),
          },
          ...(record.creatorType === "PLATFORM"
            ? [
                {
                  key: "use",
                  label: "Triển khai",
                  icon: <Zap size={14} />,
                  onClick: () => onUsePlatform?.(record),
                },
              ]
            : []),
          { key: "div", type: "divider" },
          {
            key: "status",
            label: record.active ? "Vô hiệu hóa" : "Kích hoạt",
            icon: <Clock size={14} />,
            onClick: () => onToggleStatus?.(record),
          },
          {
            key: "del",
            label: "Xóa",
            icon: <Trash2 size={14} />,
            danger: true,
            onClick: () => onDelete?.(record),
          },
        ]}
      />
    ),
  },
];
