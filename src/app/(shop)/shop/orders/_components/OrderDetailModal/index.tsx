"use client";

import React from "react";
import { PortalModal } from "@/features/PortalModal";
import { DataTable } from "@/components";
import { Column } from "@/components/DataTable/type";
import { 
  ShopOrderResponse, 
  ShopOrderItemResponse, 
  OrderStatus 
} from "@/app/(main)/shop/_types/dto/shop.order.dto";
import { resolveOrderItemImageUrl } from "@/app/(chat)/_types/customerShopChat.type";
import { OrderFeeCard } from "../OrderFeeCard";
import dayjs from "dayjs";
import { FiPackage, FiUser, FiCreditCard, FiTruck, FiMapPin } from "react-icons/fi";

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
      render: (record) => {
        const imageUrl = resolveOrderItemImageUrl(
          record.imageBasePath,
          record.imageExtension,
          "_thumb"
        );
        return (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 shrink-0">
              <img src={imageUrl || ""} alt={record.productName} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-gray-800 truncate text-sm">{record.productName}</span>
              {record.variantAttributes && (
                <span className="text-[10px] text-gray-500 font-bold uppercase">{record.variantAttributes}</span>
              )}
              {record.sku && (
                <span className="text-[10px] text-blue-500 font-mono">SKU: {record.sku}</span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      header: "Số lượng",
      align: "center",
      render: (record) => <span className="font-bold text-gray-700">x{record.quantity}</span>,
    },
    {
      header: "Đơn giá",
      align: "right",
      render: (record) => <span className="text-gray-600">{formatCurrency(record.unitPrice)}</span>,
    },
    {
      header: "Thành tiền",
      align: "right",
      render: (record) => <span className="font-bold text-orange-600">{formatCurrency(record.lineTotal)}</span>,
    },
  ];

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <FiPackage className="text-orange-500" />
          <span>Chi tiết đơn hàng: <span className="text-orange-600 font-bold tracking-tight">{order.orderNumber}</span></span>
        </div>
      }
      width="max-w-5xl"
      footer={
        <button
          onClick={onClose}
          className="px-8 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all active:scale-95"
        >
          Đóng
        </button>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50/50 rounded-3xl p-5 border border-gray-100 space-y-4">
            <h4 className="text-[11px] font-bold uppercase text-gray-500 tracking-widest flex items-center gap-2">
              <FiUser /> Thông tin chung
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Mã khách hàng:</span>
                <span className="font-bold text-gray-800">{order.buyerId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Ngày đặt hàng:</span>
                <span className="font-bold text-gray-800">{dayjs(order.createdAt).format("DD/MM/YYYY HH:mm")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Trạng thái:</span>
                <div>{renderStatus(order.status as OrderStatus)}</div>
              </div>
            </div>
          </div>

          {/* Box 2: Tài chính */}
          <div className="bg-orange-50/30 rounded-3xl p-5 border border-gray-100/50 space-y-4">
            <h4 className="text-[11px] font-bold uppercase text-orange-400 tracking-widest flex items-center gap-2">
              <FiCreditCard /> Thanh toán
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Phương thức:</span>
                <span className="font-bold text-gray-800 uppercase">{order.paymentMethod || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tạm tính sản phẩm:</span>
                <span className="font-bold">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-red-500">
                <span>Tổng giảm giá:</span>
                <span className="font-bold">-{formatCurrency(order.subtotal - order.grandTotal)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-100 text-lg">
                <span className="font-bold text-gray-800">Tổng cộng:</span>
                <span className="font-bold text-blue-600">{formatCurrency(order.grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Vận chuyển & Ghi chú */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Box 3: Vận chuyển */}
           <div className="bg-blue-50/30 rounded-3xl p-5 border border-blue-100/50 space-y-4">
            <h4 className="text-[11px] font-bold uppercase text-blue-400 tracking-widest flex items-center gap-2">
              <FiTruck /> Vận chuyển
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Đơn vị:</span>
                <span className="px-2 py-0.5 bg-white border border-blue-100 rounded-lg text-[10px] font-bold text-blue-600 uppercase italic">
                  {(order as any).carrier || "Chưa xác định"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Mã vận đơn:</span>
                <span className="font-mono font-bold text-gray-800">{(order as any).trackingNumber || "---"}</span>
              </div>
            </div>
          </div>

          {/* Box 4: Ghi chú */}
          <div className="bg-gray-50 rounded-3xl p-5 border border-gray-100 flex flex-col justify-center">
            <h4 className="text-[11px] font-bold uppercase text-gray-500 tracking-widest flex items-center gap-2 mb-2">
              <FiMapPin /> Ghi chú từ khách
            </h4>
            <p className="text-sm text-gray-600 italic">
              {order.customerNote ? `"${order.customerNote}"` : "Không có ghi chú nào từ khách hàng."}
            </p>
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-bold uppercase text-gray-500 tracking-widest ml-1">Sản phẩm trong đơn</h4>
          <DataTable
            columns={productColumns}
            data={order.items || []}
            loading={false}
            totalElements={order.items?.length || 0}
            page={0}
            size={50}
            onPageChange={() => {}}
          />
        </div>

        <div className="pt-4">
          <OrderFeeCard orderId={order.orderNumber} />
        </div>
      </div>
    </PortalModal>
  );
};