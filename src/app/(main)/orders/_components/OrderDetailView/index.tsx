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
import { OrderHeader } from "../OrderDetailHeader";

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
        bg: "bg-gray-100",
        text: "text-gray-600",
        border: "border-gray-200",
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
    <div className="max-w-7xl mx-auto space-y-2 animate-in fade-in duration-500 pb-10">
      <OrderHeader
        order={order}
        ui={ui}
        actions={{
          handleCopyOrderNumber: actions.handleCopyOrderNumber,
          setCancelModalVisible: actions.setCancelModalVisible,
          handleRefresh: actions.handleRefresh,
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 space-y-2">
          {ui.canCancel && (
            <OrderExpirationTimer
              expiresAt={order.expiresAt}
              onExpire={actions.handleRefresh}
            />
          )}

          <div className="bg-white rounded-4xl border border-gray-100 px-6 py-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-3 mb-6 uppercase tracking-widest">
              <div className="p-2 bg-orange-50 rounded-xl text-orange-500">
                <Truck size={18} />
              </div>
              Hành trình đơn hàng
            </h3>

            <OrderStatusTimeline
              status={order.status}
              createdAt={order.createdAt}
              updatedAt={order.updatedAt}
              trackingNumber={order.trackingNumber}
              carrier={order.carrier}
            />
          </div>

          <div className="bg-white rounded-4xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="px-6 py-5 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900 uppercase text-xs tracking-widest flex items-center gap-2">
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
            <div className="divide-y divide-gray-50">
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
