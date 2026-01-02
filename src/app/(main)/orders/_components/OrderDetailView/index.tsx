"use client";

import {
  Calendar,
  CheckCircle2,
  Copy,
  Package,
  StoreIcon,
  Truck,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import React, { useMemo } from "react";
import { ORDER_STATUS_UI } from "../../_constants/order";
import { PAYMENT_METHOD_LABELS } from "../../_types/order";
import { OrderCancelModal } from "../OrderCancelModal";
import { OrderExpirationTimer } from "../OrderExpirationTimer";
import { OrderSideInfo } from "../OrderSideInfo";
import { OrderStatusTimeline } from "../OrderStatusTimeline";
import { OrderTrackingTimeline } from "../OrderTrackingTimeline";
import { ReviewModal } from "../ReviewModal";
import { useOrderDetailView } from "../../_hooks/useOrderDetailView";
import { OrderItemRow } from "../OrderItemRow";
import { OrderDetailViewProps } from "./type";

export const OrderDetailView: React.FC<OrderDetailViewProps> = ({ order }) => {
  const { state, actions } = useOrderDetailView(order);
  const {
    refreshKey,
    reviewModalOpen,
    selectedItem,
    cancelModalVisible,
    cancelReason,
    cancelling,
    reviewedProductIds,
  } = state;

  const ui = useMemo(() => {
    const status = order.status;

    const statusInfo = ORDER_STATUS_UI[status] ||
      ORDER_STATUS_UI.DEFAULT || {
        label: status,
        bg: "bg-slate-100",
        text: "text-slate-600",
        border: "border-slate-200",
        icon: null,
      };

    return {
      statusInfo,
      isDelivered: status === "DELIVERED",
      isCancelled: status === "CANCELLED",
      canCancel: ["CREATED", "PENDING_PAYMENT"].includes(status),
      shippingFee: order.conkinShippingCost ?? order.shippingFee ?? 0,
      paymentLabel:
        PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod,
      showTracking: Boolean(order.trackingNumber && order.carrier),
    };
  }, [order]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-4xl border border-slate-100 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">
              Chi tiết đơn hàng
            </h1>
            <div
              className={`px-4 py-1 rounded-full text-xs font-semibold uppercase border flex items-center gap-2 ${ui.statusInfo.bg} ${ui.statusInfo.text} ${ui.statusInfo.border}`}
            >
              {ui.isDelivered ? (
                <CheckCircle2 size={14} />
              ) : ui.isCancelled ? (
                <XCircle size={14} />
              ) : (
                ui.statusInfo.icon
              )}
              {ui.statusInfo.label}
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-400 font-medium">
            <button
              onClick={actions.handleCopyOrderNumber}
              className="font-mono text-slate-900 bg-slate-50 px-3 py-1 rounded-lg hover:bg-slate-100 transition-all flex items-center gap-2"
            >
              #{order.orderNumber} <Copy size={12} />
            </button>
            <span className="flex items-center gap-2">
              <Calendar size={14} />{" "}
              {new Date(order.createdAt).toLocaleDateString("vi-VN")}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          {ui.canCancel && (
            <button
              onClick={() => actions.setCancelModalVisible(true)}
              className="px-6 py-2.5 bg-white border border-red-100 text-red-500 font-bold rounded-xl hover:bg-red-50 transition-all text-xs uppercase tracking-widest"
            >
              Hủy đơn
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 2. Main Content (Left) */}
        <div className="lg:col-span-8 space-y-6">
          {ui.canCancel && (
            <OrderExpirationTimer
              expiresAt={order.expiresAt}
              onExpire={actions.handleRefresh}
            />
          )}

          <div className="bg-white rounded-4xl border border-slate-100 px-6 py-4 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-3 mb-2 uppercase tracking-tight">
              <div className="p-2 bg-orange-50 rounded-xl text-orange-500">
                <Truck size={20} />
              </div>
              Hành trình đơn hàng
            </h3>
            <OrderStatusTimeline
              status={order.status}
              createdAt={order.createdAt}
              updatedAt={order.createdAt}
            />
          </div>

          {ui.showTracking && (
            <div className="bg-white rounded-4xl border border-slate-100 px-6 py-4 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-3 mb-2 uppercase tracking-tight">
                <div className="p-2 bg-blue-50 rounded-xl text-orange-500">
                  <Truck size={20} />
                </div>
                Chi tiết vận chuyển
              </h3>
              <OrderTrackingTimeline
                trackingCode={order.trackingNumber!}
                carrier={order.carrier!}
              />
            </div>
          )}

          <div className="bg-white rounded-4xl border border-slate-100 overflow-hidden shadow-sm">
            <div className="px-6 py-5 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-semibold text-slate-900 uppercase text-xs tracking-widest flex items-center gap-2">
                <Package size={18} className="text-orange-500" /> Sản phẩm (
                {order.items.length})
              </h3>
              {order.shopInfo && (
                <Link
                  href={`/shops/${order.shopInfo.shopId}`}
                  className="text-xs font-semibold text-orange-600 flex items-center gap-1 hover:underline"
                >
                  <StoreIcon size={14} /> {order.shopInfo.shopName}
                </Link>
              )}
            </div>
            <div className="divide-y divide-slate-50">
              {order.items.map((item) => (
                <OrderItemRow
                  key={item.itemId}
                  item={item}
                  isReviewed={reviewedProductIds.has(item.productId!)}
                  canReview={ui.isDelivered}
                  onReview={() => actions.handleReviewClick(item)}
                />
              ))}
            </div>
          </div>
        </div>

        <OrderSideInfo
          order={order}
          shippingFee={ui.shippingFee}
          paymentLabel={ui.paymentLabel}
          showPayment={
            order.status === "PENDING_PAYMENT" &&
            (!!order.paymentUrl || order.paymentMethod === "PAYOS")
          }
          refreshKey={refreshKey}
          handleCancelPayment={actions.handleCancelPayment}
          handleRefresh={actions.handleRefresh}
        />
      </div>

      {selectedItem && (
        <ReviewModal
          open={reviewModalOpen}
          onCancel={() => actions.setReviewModalOpen(false)}
          onSuccess={actions.handleReviewSuccess}
          productId={selectedItem.productId}
          productName={selectedItem.productName}
          orderId={order.orderId}
        />
      )}

      <OrderCancelModal
        isOpen={cancelModalVisible}
        onClose={() => actions.setCancelModalVisible(false)}
        onConfirm={actions.handleCancelOrder}
        orderNumber={order.orderNumber}
        cancelReason={cancelReason}
        setCancelReason={actions.setCancelReason}
        isCancelling={cancelling}
        carrier={order.carrier}
        trackingNumber={order.trackingNumber}
      />
    </div>
  );
};
