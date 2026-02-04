/* eslint-disable @next/next/no-img-element */
"use client";

import { ActionBtn, ActionDropdown } from "@/components";
import { Column } from "@/components/DataTable/type";
import { UserProductDTO } from "@/types/product/user-product.dto";
import { cn } from "@/utils/cn";
import { toPublicUrl } from "@/utils/storage/url";
import {
  CheckCircle2,
  Clock,
  Copy,
  Eye,
  FileText,
  MoreVerticalIcon,
  PlayCircle,
  Send,
  ShoppingBag,
  StopCircle,
  Tags,
  Trash2,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type StatusType = "DRAFT" | "PENDING" | "APPROVED" | "REJECTED";

const APPROVAL_CONFIGS = {
  DRAFT: {
    bg: "bg-slate-100/80",
    text: " text-gray-500",
    label: "BẢN NHÁP",
    icon: <FileText size={12} strokeWidth={2.5} />,
  },
  PENDING: {
    bg: "bg-orange-50",
    text: "text-orange-600",
    label: "CHỜ DUYỆT",
    icon: <Clock size={12} strokeWidth={2.5} />,
  },
  APPROVED: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    label: "ĐÃ DUYỆT",
    icon: <CheckCircle2 size={12} strokeWidth={2.5} />,
  },
  REJECTED: {
    bg: "bg-red-50",
    text: "text-red-500",
    label: "BỊ TỪ CHỐI",
    icon: <XCircle size={12} strokeWidth={2.5} />,
  },
};

const getProductThumbUrl = (record: any): string => {
  const imageMedia = record.media?.filter((m: any) => m.type === "IMAGE") || [];

  const primaryMedia =
    imageMedia.find((m: any) => m.isPrimary) || imageMedia[0];

  const mediaPath = primaryMedia?.imagePath || primaryMedia?.url;

  if (mediaPath) {
    return toPublicUrl(mediaPath.replace("*", "orig"));
  }

  const variantWithImage = record.variants?.find(
    (v: any) => v.imagePath || v.imageUrl,
  );
  const variantPath = variantWithImage?.imagePath || variantWithImage?.imageUrl;

  if (variantPath) {
    return toPublicUrl(variantPath.replace("*", "orig"));
  }

  return "";
};

export const getProductColumns = (
  handleAction: (
    action: () => Promise<any>,
    successMsg: string,
  ) => Promise<void>,
  userProductService: any,
  onDeleteRequest: (record: any) => void,
): Column<UserProductDTO>[] => [
  {
    header: "Thông tin sản phẩm",
    className: "min-w-[320px]",
    render: (record) => {
      const thumbUrl = getProductThumbUrl(record);
      return (
        <div className="flex items-center gap-4 py-2">
          <div className="group relative w-16 h-16 rounded-2xl overflow-hidden border border-orange-100 bg-orange-50/10 shrink-0 shadow-sm transition-all hover:border-orange-400">
            {thumbUrl ? (
              <Image
                src={thumbUrl}
                alt={record.name || "Product image"}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                unoptimized={true}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-orange-200 bg-orange-50/30">
                <ShoppingBag size={24} />
              </div>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <Link
              href={`/shop/products/${record.id}`}
              className=" text-gray-800 font-bold hover:text-orange-500 truncate transition-colors text-[13px] uppercase tracking-tight italic"
            >
              {record.name}
            </Link>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <span className="text-[11px]  text-gray-500 font-semibold bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/40">
                #: {record.slug?.split("-")[0] || "N/A"}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-orange-500 font-bold uppercase tracking-tight">
                <Tags size={12} strokeWidth={2.5} />{" "}
                {record.category?.name || "Chưa phân loại"}
              </span>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    header: "Kho hàng",
    align: "center",
    render: (record: any) => {
      let totalStock = 0,
        totalQuantity = 0;
      record.variants?.forEach((v: any) => {
        totalStock += v.inventory?.stock ?? 0;
        totalQuantity += v.inventory?.quantity ?? 0;
      });
      const totalSold = Math.max(0, totalQuantity - totalStock);
      return (
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center text-xs font-bold px-3 py-1 bg-white rounded-full border border-orange-100 shadow-sm">
            <span className="text-orange-600">{totalSold}</span>
            <span className="mx-1.5  text-gray-300">/</span>
            <span className="text-blue-500">{totalQuantity}</span>
          </div>
          <span className="text-[9px]  text-gray-400 uppercase tracking-widest font-semibold italic">
            Đã bán / Tổng
          </span>
        </div>
      );
    },
  },
  {
    header: "Giá niêm yết",
    align: "right",
    render: (record) => (
      <div className="flex flex-col items-end pr-2">
        <div className="font-bold  text-gray-700 text-lg tabular-nums flex items-baseline gap-1">
          {record.basePrice?.toLocaleString("vi-VN")}
          <span className="text-[10px] text-orange-500 uppercase font-bold italic tracking-tighter">
            Vnđ
          </span>
        </div>
      </div>
    ),
  },
  {
    header: "Trạng thái phê duyệt",
    align: "center",
    render: (record) => {
      const config =
        APPROVAL_CONFIGS[record.approvalStatus as StatusType] ||
        APPROVAL_CONFIGS.DRAFT;
      return (
        <div
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-bold tracking-widest border transition-all shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]",
            config.bg,
            config.text,
            "border-current/10",
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
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase transition-all border",
          record.active
            ? "text-blue-600 bg-blue-50/50 border-blue-100"
            : " text-gray-400 bg-slate-50 border-slate-100",
        )}
      >
        <div
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            record.active ? "bg-blue-600 animate-pulse" : "bg-slate-300",
          )}
        />
        {record.active ? "Đang hoạt động" : "Tạm dừng"}
      </div>
    ),
  },
  {
    header: "Thao tác",
    align: "right",
    render: (record) => {
      const dropdownItems = [];

      if (record.approvalStatus === "DRAFT") {
        dropdownItems.push({
          key: "submit",
          icon: <Send size={14} />,
          label: "Gửi xét duyệt ngay",
          onClick: () =>
            handleAction(
              () =>
                userProductService.submitForApproval(record.id, record.version),
              "Đã gửi yêu cầu xét duyệt thành công",
            ),
        });
      }

      // columns.tsx trong phần dropdownItems của APPROVED
      if (record.approvalStatus === "APPROVED") {
        const isActive = record.active;
        dropdownItems.push({
          key: isActive ? "unpublish" : "publish",
          icon: isActive ? <StopCircle size={14} /> : <PlayCircle size={14} />,
          label: isActive ? "Ngừng hiển thị" : "Bật hiển thị lại",
          onClick: () => {
            // 🟢 DEBUG: Bro mở console xem số này có phải là undefined không
            console.log(
              `Action: ${isActive ? "unpublish" : "publish"}, ID: ${record.id}, Version: ${record.version}`,
            );

            handleAction(
              () =>
                isActive
                  ? userProductService.unpublish(record.id, record.version)
                  : userProductService.publish(record.id, record.version),
              isActive
                ? "Sản phẩm đã được tạm ẩn"
                : "Sản phẩm đã được hiển thị công khai",
            );
          },
        });
      }

      if (dropdownItems.length > 0)
        dropdownItems.push({
          key: "div-1",
          type: "divider" as const,
          label: "",
        });

      dropdownItems.push(
        {
          key: "duplicate",
          icon: <Copy size={14} />,
          label: "Sao chép sản phẩm",
          onClick: () =>
            handleAction(
              () => userProductService.duplicate(record.id),
              "Đã nhân bản sản phẩm mới thành công",
            ),
        },
        {
          key: "delete",
          icon: <Trash2 size={14} />,
          label: "Xóa vĩnh viễn",
          danger: true,
          onClick: () => onDeleteRequest(record),
        },
      );

      return (
        <div className="flex items-center justify-end gap-2 pr-1">
          <ActionBtn
            icon={<Eye size={16} strokeWidth={2.2} />}
            tooltip="Xem chi tiết"
            color="border-slate-100 hover:border-orange-200 hover:bg-orange-50 transition-all active:scale-90"
            onClick={() =>
              (window.location.href = `/shop/products/${record.id}`)
            }
          />

          {record.approvalStatus === "DRAFT" && (
            <ActionBtn
              icon={<Send size={16} strokeWidth={2.2} />}
              tooltip="Gửi duyệt ngay"
              color="text-orange-500 bg-orange-50/50 border-orange-100 hover:bg-orange-500 hover:text-white"
              onClick={() =>
                handleAction(
                  () =>
                    userProductService.submitForApproval(
                      record.id,
                      record.version,
                    ),
                  "Yêu cầu xét duyệt đã được gửi",
                )
              }
            />
          )}

          <ActionDropdown
            trigger={
              <div className="p-2.5 rounded-xl border border-orange-100 shadow-sm bg-white text-orange-500 hover:bg-orange-500 hover:text-white transition-all active:scale-95 cursor-pointer group">
                <MoreVerticalIcon
                  size={18}
                  strokeWidth={2.2}
                  className="group-hover:rotate-90 transition-transform duration-300"
                />
              </div>
            }
            items={dropdownItems}
            placement="bottomRight"
          />
        </div>
      );
    },
  },
];
