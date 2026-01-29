"use client";

import React from "react";
import { OrderResponseAdmin } from "@/api/_types/adminOrder.types";
import { Column } from "@/components/DataTable/type";
import { OrderStatusBadge } from "../../_constants/getOrderStatusBadge";
import { format } from "date-fns";
import { Copy, Eye, Edit, Store } from "lucide-react";
import { ActionBtn } from "@/components";
import { toPublicUrl } from "@/utils/storage/url";
import { toSizedVariant } from "@/utils/products/media.helpers";
import Image from "next/image";

export const getOrderColumns = (
  onView: (id: string) => void,
  onEdit: (id: string) => void,
  success: (msg: string) => void
): Column<OrderResponseAdmin>[] => [
  {
    header: "Mã đơn hàng",
    render: (order) => (
      <div className="flex flex-col gap-1 group/id">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[13px] font-bold  text-gray-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
            #{(order.orderNumber || order.orderId.substring(0, 8)).toUpperCase()}
          </span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(order.orderId);
              success("Đã copy ID đơn hàng"); 
            }}
            className="opacity-0 group-hover/id:opacity-100 p-1 rounded hover:bg-slate-200 transition-all"
          >
            <Copy size={12} className=" text-gray-400" />
          </button>
        </div>
        <span className="text-[10px]  text-gray-400 font-bold ml-1 uppercase">
          {order.createdAt ? format(new Date(order.createdAt), "HH:mm - dd/MM/yyyy") : "--"}
        </span>
      </div>
    ),
  },
  {
    header: "Sản phẩm & Shop",
    render: (order) => {
      const firstItem = order.items?.[0];
      
      const imgPath = firstItem?.imagePath && firstItem?.imageExtension
        ? toPublicUrl(
            toSizedVariant(
              `${firstItem.imagePath}${firstItem.imageExtension}`,
              "_thumb" 
            )
          )
        : null;

      return (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-1.5 text-orange-600">
            <Store size={14} strokeWidth={2.5} />
            <span className="text-[11px] font-bold uppercase tracking-tight truncate max-w-45">
              {order.shopInfo?.shopName || "N/A"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 shrink-0 rounded-[1.25rem] overflow-hidden border border-orange-100 bg-orange-50/30 shadow-sm group">
              {imgPath ? (
                <Image
                  src={imgPath}
                  alt={firstItem?.productName || "Product"}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  unoptimized 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-orange-200 uppercase font-bold italic text-xl">
                  {firstItem?.productName?.charAt(0) || "?"}
                </div>
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold  text-gray-800 truncate max-w-55">
                {firstItem?.productName}
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold border border-blue-100">
                  SKU: {firstItem?.sku || "N/A"}
                </span>
                {order.itemCount > 1 && (
                  <span className="text-[10px]  text-gray-400 font-bold italic">
                    +{order.itemCount - 1} món khác
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    header: "Trạng thái",
    align: "center",
    render: (order) => <OrderStatusBadge status={order.status} />,
  },
  {
    header: "Tổng thanh toán",
    align: "right",
    render: (order) => (
      <div className="flex flex-col items-end gap-0.5">
        <span className="font-bold text-[15px] text-orange-600 font-mono">
          {new Intl.NumberFormat("vi-VN").format(order.pricing.grandTotal)}₫
        </span>
        <div className="flex items-center gap-1 text-[10px] font-bold  text-gray-400">
          <span>{order.payment.method}</span>
          <span>•</span>
          <span>{order.totalQuantity} SP</span>
        </div>
      </div>
    ),
  },
  {
    header: "Thao tác",
    align: "right",
    render: (order) => (
      <div className="flex justify-end gap-1.5">
        <ActionBtn
          onClick={() => onView(order.orderId)}
          icon={<Eye size={14} />}
          color="bg-slate-100  text-gray-700 hover:bg-slate-200 border-0"
          tooltip="Xem chi tiết"
        />
        <ActionBtn
          onClick={() => onEdit(order.orderId)}
          icon={<Edit size={14} />}
          color="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border-blue-100"
          tooltip="Cập nhật"
        />
      </div>
    ),
  },
];