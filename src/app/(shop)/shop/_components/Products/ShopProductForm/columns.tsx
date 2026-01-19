"use client";

import { ActionBtn } from "@/components";
import { Column } from "@/components/DataTable/type";
import { UserProductDTO } from "@/types/product/user-product.dto";
import { cn } from "@/utils/cn";
import {
  resolveMediaUrl
} from "@/utils/products/media.helpers";
import {
  CheckCircle2,
  Clock,
  Copy,
  Eye,
  FileText,
  PlayCircle,
  Send,
  ShoppingBag,
  StopCircle,
  Store,
  Tags,
  Trash2,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type StatusType = "DRAFT" | "PENDING" | "APPROVED" | "REJECTED";

const getProductThumbUrl = (record: any): string => {
  const primaryMedia =
    record.media?.find((m: any) => m.isPrimary) || record.media?.[0];
  if (primaryMedia) {
    const url = resolveMediaUrl(primaryMedia, "_thumb");
    if (url) return url;
  }

  const firstVariantWithImg = record.variants?.find((v: any) => v.imageUrl);
  if (firstVariantWithImg) {
    return firstVariantWithImg.imageUrl;
  }

  return "";
};

export const getProductColumns = (
  handleAction: (
    action: () => Promise<any>,
    successMsg: string
  ) => Promise<void>,
  userProductService: any
): Column<UserProductDTO>[] => [
  {
    header: "Sản phẩm",
    render: (record) => {
      const thumbUrl = getProductThumbUrl(record);
      return (
        <div className="flex items-center gap-4 py-1">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border border-gray-100 bg-orange-50/30 shrink-0 relative shadow-sm">
            {thumbUrl ? (
              <Image
                src={thumbUrl}
                alt={record.name}
                fill
                sizes="56px"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-orange-200 bg-orange-50/50">
                <ShoppingBag size={20} />
              </div>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <Link
              href={`/shop/products/${record.id}`}
              className="text-gray-900 font-bold hover:text-orange-500 truncate transition-colors text-[13px] uppercase tracking-tight"
            >
              {record.name}
            </Link>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest bg-gray-100 px-1.5 py-0.5 rounded">
                SKU: {record.slug?.split("-")[0] || "N/A"}
              </span>
              <span className="flex items-center gap-1 text-[9px] text-orange-500 font-bold uppercase tracking-tighter">
                <Tags size={10} strokeWidth={3} />{" "}
                {record.category?.name || "Chưa phân loại"}
              </span>
            </div>
          </div>
        </div>
      );
    },
  },
  {
  header: "Đã bán / Kho",
  align: "center",
  render: (record: any) => {
    let totalStock = 0;
    let totalQuantity = 0;
    if (Array.isArray(record.variants)) {
      record.variants.forEach((variant: any) => {
        const stock = variant.inventory?.stock ?? 0;
        const quantity = variant.inventory?.quantity ?? 0;
        totalStock += stock;
        totalQuantity += quantity;
      });
    }
    const totalSold = totalQuantity - totalStock;
    return (
      <div className="flex flex-col items-center font-bold text-xs">
        <span>
          <span className="text-orange-500">{totalSold < 0 ? 0 : totalSold}</span>
          <span className="mx-1 text-gray-500">/</span>
          <span className="text-blue-600">{totalQuantity}</span>
        </span>
        <span className="text-[10px] text-gray-500 font-normal">Đã bán / Nhập kho</span>
      </div>
    );
  },
},
  {
    header: "Giá niêm yết",
    align: "right",
    render: (record) => (
      <div className="flex flex-col items-end">
        <span className="font-bold text-gray-800 text-sm tabular-nums">
          {record.basePrice?.toLocaleString("vi-VN")}
          <span className="text-[10px] ml-0.5 text-orange-500">₫</span>
        </span>
      </div>
    ),
  },
  {
    header: "Phê duyệt",
    align: "center",
    render: (record) => {
      const configs = {
        DRAFT: {
          bg: "bg-gray-100",
          text: "text-gray-500",
          label: "Nháp",
          icon: <FileText size={12} />,
        },
        PENDING: {
          bg: "bg-orange-100",
          text: "text-orange-600",
          label: "Chờ duyệt",
          icon: <Clock size={12} />,
        },
        APPROVED: {
          bg: "bg-emerald-100",
          text: "text-emerald-700",
          label: "Đã duyệt",
          icon: <CheckCircle2 size={12} />,
        },
        REJECTED: {
          bg: "bg-red-100",
          text: "text-red-600",
          label: "Từ chối",
          icon: <XCircle size={12} />,
        },
      };
      const config =
        configs[record.approvalStatus as StatusType] || configs.DRAFT;
      return (
        <div
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-widest shadow-sm",
            config.bg,
            config.text
          )}
        >
          {config.icon} {config.label}
        </div>
      );
    },
  },
  {
    header: "Hiển thị",
    align: "center",
    render: (record) => (
      <div
        className={cn(
          "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-tighter transition-all",
          record.active
            ? "text-blue-600 bg-blue-50"
            : "text-gray-500 bg-gray-50"
        )}
      >
        {record.active ? (
          <PlayCircle size={10} fill="currentColor" fillOpacity={0.2} />
        ) : (
          <StopCircle size={10} />
        )}
        {record.active ? "Đang hoạt động" : "Tạm dừng"}
      </div>
    ),
  },
  {
    header: "Thao tác",
    align: "right",
    render: (record) => (
      <div className="flex items-center justify-end gap-1.5">
        <ActionBtn
          icon={<Eye size={16} />}
          tooltip="Xem chi tiết"
          onClick={() => (window.location.href = `/shop/products/${record.id}`)}
        />

        {record.approvalStatus === "DRAFT" && (
          <ActionBtn
            icon={<Send size={16} />}
            color="text-orange-500 bg-orange-50 border-gray-100 hover:bg-orange-500 hover:text-white"
            onClick={() =>
              handleAction(
                () =>
                  userProductService.submitForApproval(
                    record.id,
                    record.version
                  ),
                "Đã gửi yêu cầu xét duyệt"
              )
            }
          />
        )}

        <ActionBtn
          icon={<Copy size={16} />}
          tooltip="Nhân bản"
          onClick={() =>
            handleAction(
              () => userProductService.duplicate(record.id),
              "Đã sao chép sản phẩm mới"
            )
          }
        />

        <ActionBtn
          icon={<Trash2 size={16} />}
          color="text-red-500 bg-red-50 border-red-100 hover:bg-red-500 hover:text-white"
          onClick={() => {
            if (confirm("Xác nhận xóa sản phẩm này?"))
              handleAction(
                () => userProductService.delete(record.id, record.version),
                "Đã xóa sản phẩm"
              );
          }}
        />
      </div>
    ),
  },
];
