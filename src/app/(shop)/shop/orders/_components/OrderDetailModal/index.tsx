"use client";

import React from "react";
import Image from "next/image"; // Import thẻ Image chuẩn Next.js
import { PortalModal } from "@/features/PortalModal";
import { DataTable } from "@/components";
import { Column } from "@/components/DataTable/type";
import {
  ShopOrderResponse,
  ShopOrderItemResponse,
  OrderStatus,
} from "@/app/(main)/shop/_types/dto/shop.order.dto";
import { resolveOrderItemImageUrl } from "@/app/(chat)/_types/customerShopChat.type";
import { OrderFeeCard } from "../OrderFeeCard";
import dayjs from "dayjs";
import {
  FiPackage,
  FiUser,
  FiCreditCard,
  FiTruck,
  FiMapPin,
  FiHash,
} from "react-icons/fi";
import { cn } from "@/utils/cn";

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: ShopOrderResponse | null;
  renderStatus: (status: OrderStatus) => React.ReactNode;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  isOpen,
  onClose,
  order,
  renderStatus,
}) => {
  if (!order) return null;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN").format(amount) + " ₫";

  const productColumns: Column<ShopOrderItemResponse>[] = [
    {
      header: "Sản phẩm",
      className: "min-w-[300px]",
      render: (record) => {
        const imageUrl = resolveOrderItemImageUrl(
          record.imageBasePath,
          record.imageExtension,
          "_thumb",
        );

        return (
          <div className="flex items-center gap-4 py-1">
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-orange-100 bg-slate-50 shrink-0 shadow-inner group">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={record.productName}
                  fill
                  sizes="56px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-orange-200 font-bold italic text-xl">
                  {record.productName.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-slate-800 truncate text-sm uppercase tracking-tighter italic leading-tight">
                {record.productName}
              </span>
              <div className="flex items-center gap-2 mt-1">
                {record.variantAttributes && (
                  <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[9px] text-slate-500 font-bold uppercase tracking-widest border border-slate-200">
                    {record.variantAttributes}
                  </span>
                )}
                {record.sku && (
                  <span className="text-[10px] text-orange-500 font-bold font-mono">
                    #{record.sku}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: "Số lượng",
      align: "center",
      render: (record) => (
        <span className="px-3 py-1 bg-slate-50 rounded-xl border border-slate-100 text-xs font-bold text-slate-700">
          x{record.quantity}
        </span>
      ),
    },
    {
      header: "Đơn giá",
      align: "right",
      render: (record) => (
        <span className="text-sm font-bold text-slate-500 tabular-nums italic">
          {formatCurrency(record.unitPrice)}
        </span>
      ),
    },
    {
      header: "Thành tiền",
      align: "right",
      render: (record) => (
        <span className="text-base font-bold text-orange-600 tracking-tighter italic tabular-nums">
          {formatCurrency(record.lineTotal)}
        </span>
      ),
    },
  ];

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500 rounded-xl shadow-lg shadow-orange-200">
            <FiPackage className="text-white text-lg" />
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-bold uppercase  text-orange-400 leading-none mb-1">
              Chi tiết tài sản đơn
            </span>
            <span className="text-xl font-bold text-slate-900 uppercase tracking-tighter italic">
              Order{" "}
              <span className="text-orange-500">#{order.orderNumber}</span>
            </span>
          </div>
        </div>
      }
      width="max-w-5xl"
      footer={
        <div className="flex justify-end gap-3 p-2">
          <button
            onClick={onClose}
            className="px-10 py-3 rounded-2xl bg-slate-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-orange-600 transition-all active:scale-95 shadow-xl shadow-slate-200 border-b-4 border-slate-700 hover:border-orange-800"
          >
            Hoàn tất kiểm tra
          </button>
        </div>
      }
    >
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Thông tin chung */}
          <div className="bg-slate-50/50 rounded-4xl p-6 border border-slate-100 space-y-5 group hover:bg-white hover:border-orange-200 transition-all duration-300">
            <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
              <FiUser className="text-orange-500" /> Identity Info
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-bold uppercase text-[10px]">
                  Client Asset ID:
                </span>
                <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded-lg border border-slate-200 shadow-sm">
                  {order.buyerId.substring(0, 12)}...
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-bold uppercase text-[10px]">
                  Timestamp:
                </span>
                <span className="font-bold text-slate-800 italic">
                  {dayjs(order.createdAt).format("DD.MM.YYYY • HH:mm")}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-100">
                <span className="text-slate-500 font-bold uppercase text-[10px]">
                  Current Status:
                </span>
                <div className="scale-90 origin-right">
                  {renderStatus(order.status as OrderStatus)}
                </div>
              </div>
            </div>
          </div>

          {/* Tài chính */}
          <div className="bg-orange-50/30 rounded-4xl p-6 border border-orange-100 space-y-5 group hover:bg-white hover:border-orange-300 transition-all duration-300">
            <h4 className="text-[10px] font-bold uppercase text-orange-400 tracking-[0.2em] flex items-center gap-2">
              <FiCreditCard className="text-orange-500" /> Settlement Data
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold uppercase text-[10px]">
                  Gateway Method:
                </span>
                <span className="px-3 py-1 bg-white rounded-xl border border-orange-100 font-bold text-orange-600 text-[10px] uppercase shadow-sm">
                  {order.payment.method || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold uppercase text-[10px]">
                  Subtotal Value:
                </span>
                <span className="font-bold text-slate-700">
                  {formatCurrency(order.pricing.subtotal)}
                </span>
              </div>
              <div className="flex justify-between items-center text-red-500">
                <span className="font-bold uppercase text-[10px]">
                  Platform Discount:
                </span>
                <span className="font-bold italic">
                  -
                  {formatCurrency(
                    order.pricing.subtotal - order.pricing.grandTotal,
                  )}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t-2 border-dashed border-orange-200">
                <span className="font-bold text-slate-900 uppercase text-[10px]">
                  Total Liquidity:
                </span>
                <span className="text-2xl font-bold text-blue-600 tracking-tighter italic leading-none">
                  {formatCurrency(order.pricing.grandTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Vận chuyển & Ghi chú */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50/30 rounded-4xl p-6 border border-blue-100 space-y-5 hover:bg-white hover:border-blue-300 transition-all duration-300">
            <h4 className="text-[10px] font-bold uppercase text-blue-400 tracking-[0.2em] flex items-center gap-2">
              <FiTruck className="text-blue-500" /> Logistics Protocol
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold uppercase text-[10px]">
                  Carrier:
                </span>
                <span className="px-3 py-1 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase italic shadow-lg shadow-slate-200">
                  {(order as any).carrier || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold uppercase text-[10px]">
                  Waybill Number:
                </span>
                <div className="flex items-center gap-2 font-mono font-bold text-blue-600">
                  <FiHash />
                  <span>{(order as any).trackingNumber || "PENDING"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-4xl p-6 border border-slate-100 flex flex-col justify-center">
            <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2 mb-3">
              <FiMapPin className="text-orange-500" /> Delivery Memo
            </h4>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-inner min-h-15">
              <p className="text-xs text-slate-600 italic font-medium leading-relaxed">
                {order.customerNote
                  ? `"${order.customerNote}"`
                  : "Hệ thống: Không có ghi chú bổ sung từ người mua."}
              </p>
            </div>
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            <h4 className="text-[11px] font-bold uppercase text-slate-900 tracking-widest italic">
              Inventory Line Items
            </h4>
          </div>
          <div className="bg-white rounded-[2.5rem] border border-orange-50 shadow-custom-lg overflow-hidden p-1">
            <DataTable
              columns={productColumns}
              data={order.items || []}
              loading={false}
              totalElements={order.items?.length || 0}
              page={0}
              size={50}
              onPageChange={() => {}}
              rowKey="itemId"
            />
          </div>
        </div>

        <div className="pt-4">
          <OrderFeeCard orderId={order.orderNumber} />
        </div>
      </div>
    </PortalModal>
  );
};
