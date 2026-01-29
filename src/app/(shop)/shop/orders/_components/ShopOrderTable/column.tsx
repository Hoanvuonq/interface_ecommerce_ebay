"use client";

import { Column } from "@/components/DataTable/type";
import {
  OrderStatus,
  ShopOrderResponse,
} from "@/app/(main)/shop/_types/dto/shop.order.dto";
import { toPublicUrl } from "@/utils/storage/url";
import { toSizedVariant } from "@/utils/products/media.helpers";
import Image from "next/image";
import {
  Hash,
  Truck,
  CalendarClock,
  Eye,
  Edit3,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import { cn } from "@/utils/cn";

export const getOrderColumns = (
  actions: any,
  renderStatus: (s: OrderStatus) => React.ReactNode,
  getDeadlineInfo: (o: ShopOrderResponse) => any,
  onOpenDetail: (o: ShopOrderResponse) => void,
  onOpenUpdate: (o: ShopOrderResponse) => void,
): Column<ShopOrderResponse>[] => [
  {
    header: "Kiện hàng & Tài sản",
    className: "min-w-[300px]",
    render: (record) => {
      const first = record.items?.[0];
      const img =
        first?.imagePath && first?.imageExtension
          ? toPublicUrl(
              toSizedVariant(
                `${first.imagePath}${first.imageExtension}`,
                "_thumb",
              ),
            )
          : null;
      return (
        <div className="flex items-center gap-4 py-2">
          <div className="relative w-14 h-14 shrink-0 rounded-[1.25rem] overflow-hidden border border-orange-100 bg-orange-50/30 shadow-sm group">
            {img ? (
              <Image
                src={img}
                alt={first?.productName || "Product"}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-orange-200 uppercase font-bold italic text-xl">
                {first?.productName?.charAt(0) || "?"}
              </div>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-gray-800 text-sm truncate uppercase tracking-tighter italic leading-tight group-hover:text-orange-600 transition-colors">
              {first?.productName || "Kiện hàng trống"}
            </span>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded-md border border-gray-200">
                <Hash size={10} className="text-orange-500" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">
                  {record.orderNumber}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    header: "Đơn vị vận chuyển",
    align: "center",
    render: (record) => (
      <div className="flex flex-col items-center gap-1.5">
        <div className="px-3 py-1 bg-white text-gray-600 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border border-orange-100 shadow-sm">
          <Truck size={12} className="text-orange-400" strokeWidth={2.5} />
          {record?.shipment?.carrier || "Standard"}
        </div>
        {record?.shipment?.trackingNumber && (
          <span className="text-[9px] font-bold text-gray-500 font-mono bg-gray-50 px-1.5 rounded">
            #{record?.shipment.trackingNumber}
          </span>
        )}
      </div>
    ),
  },
  {
    header: "Tài chính",
    align: "center",
    render: (record) => (
      <div className="flex flex-col items-center gap-1">
        <div
          className={cn(
            "px-2.5 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border shadow-xs",
            record.payment?.method === "COD"
              ? "bg-amber-50 text-amber-600 border-amber-100"
              : "bg-blue-50 text-blue-600 border-blue-100",
          )}
        >
          {record.payment?.method || "N/A"}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xl font-bold text-gray-900 tracking-tight italic">
            {new Intl.NumberFormat("vi-VN").format(
              record.pricing?.grandTotal || 0,
            )}
          </span>
          <span className="text-[16px] font-semibold text-gray-600 italic">
            ₫
          </span>
        </div>
      </div>
    ),
  },
  {
    header: "Tiến độ xử lý",
    align: "center",
    render: (record) => {
      const info = getDeadlineInfo(record);
      return (
        <div
          className={cn(
            "px-4 py-1.5 rounded-2xl border text-[10px] font-bold inline-flex items-center gap-2 tracking-widest shadow-sm transition-all",
            info.color,
          )}
        >
          <CalendarClock
            size={12}
            strokeWidth={3}
            className={cn(info.isOverdue && "animate-pulse text-red-500")}
          />
          {info.text}
        </div>
      );
    },
  },
  {
    header: "Trạng thái",
    align: "center",
    render: (record) => (
      <div className="scale-95 origin-center">
        {renderStatus(record.status as OrderStatus)}
      </div>
    ),
  },
  {
    header: "Thao tác",
    align: "right",
    render: (record) => {
      const canConfirm = [OrderStatus.CREATED, OrderStatus.PAID].includes(
        record.status as OrderStatus,
      );
      const canShip = record.status === OrderStatus.FULFILLING;
      const isFinished = [
        OrderStatus.DELIVERED,
        OrderStatus.CANCELLED,
        OrderStatus.REFUNDED,
      ].includes(record.status as OrderStatus);

      return (
        <div className="flex items-center justify-end gap-2.5">
          <button
            onClick={() => onOpenDetail(record)}
            className="p-2.5 rounded-xl bg-white text-gray-500 hover:text-orange-500 hover:border-orange-200 border border-gray-100 transition-all active:scale-90 shadow-sm"
            title="Chi tiết đơn hàng"
          >
            <Eye size={18} strokeWidth={2.5} />
          </button>

          {canConfirm && (
            <button
              onClick={() =>
                actions.handleQuickAction(
                  record.orderId,
                  OrderStatus.FULFILLING,
                  "Xác nhận đơn hàng",
                )
              }
              className="px-5 py-2 bg-orange-500 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-all active:scale-95 shadow-lg shadow-orange-500/30 border-b-2 border-orange-700"
            >
              Phê duyệt
            </button>
          )}

          {canShip && (
            <button
              onClick={() =>
                actions.handleQuickAction(
                  record.orderId,
                  OrderStatus.SHIPPED,
                  "Đã giao cho đơn vị vận chuyển",
                )
              }
              className={cn(
                "px-5 py-2 bg-orange-500  text-white rounded-2xl font-bold text-[10px]",
                "uppercase tracking-widest hover:bg-orange-600 transition-all",
                "active:scale-95 shadow-lg shadow-gray-200 border-b-2 border-gray-700",
              )}
            >
              Giao hàng
            </button>
          )}

          {!isFinished && (
            <button
              onClick={() => onOpenUpdate(record)}
              className="p-2.5 rounded-xl bg-white text-gray-500 hover:text-amber-500 hover:border-amber-200 border border-gray-100 transition-all active:scale-90 shadow-sm"
            >
              <Edit3 size={18} strokeWidth={2.5} />
            </button>
          )}
        </div>
      );
    },
  },
];
