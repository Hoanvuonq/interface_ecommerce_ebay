"use client";

import { Package, StoreIcon, Truck, AlertCircle } from "lucide-react";
import Link from "next/link";
import React, { useMemo } from "react";
import { ORDER_STATUS_UI } from "../../_constants/order.constants";
import { useOrderDetailView } from "../../_hooks/useOrderDetailView";
import { resolveOrderItemImageUrl } from "../../_constants/order.constants";
import { PAYMENT_METHOD_LABELS } from "../../_constants/order.constants";
import { OrderCancelModal } from "../OrderCancelModal";
import { OrderHeader } from "../OrderDetailHeader";
import { OrderExpirationTimer } from "../OrderExpirationTimer";
import { OrderItemRow } from "../OrderItemRow";
import { OrderSideInfo } from "../OrderSideInfo";
import { OrderStatusTimeline } from "../OrderStatusTimeline";
import { ReviewModal } from "../ReviewModal";
import { OrderDetailViewProps } from "./type";

export const OrderDetailView: React.FC<OrderDetailViewProps> = ({ order }) => {
  const { state, actions } = useOrderDetailView(order);
  const {
    refreshKey,
    reviewModalOpen,
    selectedItem,
    cancelModalVisible,
    cancelling,
    reviewedProductIds,
  } = state;

  const ui = useMemo(() => {
    const status = order.status as keyof typeof ORDER_STATUS_UI;
    const firstItem = order.items?.[0];

    const statusInfo = ORDER_STATUS_UI[status];

    return {
      statusInfo,
      isDelivered: status === "COMPLETED" || status === "DELIVERED",
      isCancelled: status === "CANCELLED",
      canCancel: ["CREATED", "AWAITING_PAYMENT"].includes(status),
      shippingFee: order.conkinShippingCost ?? order.shippingFee ?? 0,
      paymentLabel:
        PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod,
      cancellationReason:
        (order as any).cancellationReason || "Không có lý do cụ thể",
      reBuyUrl: firstItem?.productId
        ? `/products/${firstItem.productId}`
        : "/products",
    };
  }, [order]);

  return (
    <div className="max-w-7xl mx-auto space-y-3 animate-in fade-in duration-500 pb-10">
      {/* 1. HEADER THÔNG TIN CHUNG */}
      <OrderHeader
        order={order}
        ui={ui}
        actions={{
          handleCopyOrderNumber: actions.handleCopyOrderNumber,
          setCancelModalVisible: actions.setCancelModalVisible,
          handleRefresh: actions.handleRefresh,
        }}
      />

      {ui.isCancelled && (
        <div className="bg-orange-50/50 border border-gray-100 rounded-4xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-sm animate-in slide-in-from-top-2 duration-500">
          <div className="p-3 bg-white rounded-2xl text-orange-500 shadow-sm border border-gray-100 shrink-0">
            <AlertCircle size={24} strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-[11px] font-bold text-orange-600 uppercase tracking-[0.2em] mb-1">
              Thông tin hủy đơn
            </h4>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-gray-500 text-sm font-medium">Lý do:</span>
              <span className="text-gray-900 text-sm font-bold italic">
                "{ui.cancellationReason}"
              </span>
            </div>
          </div>
          <Link href={ui.reBuyUrl} className="shrink-0 w-full sm:w-auto">
            <button className="w-full px-6 py-2.5 bg-white border border-gray-200 text-orange-600 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-orange-600 hover:text-white transition-all shadow-sm active:scale-95">
              Mua lại sản phẩm
            </button>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 space-y-3">
          {ui.canCancel && order.expiresAt && (
            <div className="bg-white rounded-4xl border border-gray-100 p-4">
              <OrderExpirationTimer
                expiresAt={order.expiresAt}
                onExpire={actions.handleRefresh}
              />
            </div>
          )}

          <div className="bg-white rounded-4xl border border-gray-100 px-6 py-6 shadow-sm">
            <h3 className="text-xs font-bold text-gray-900 flex items-center gap-3 mb-8 uppercase tracking-[0.2em]">
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
            <div className="px-6 py-5 bg-gray-50/30 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
                <Package size={18} className="text-orange-500" />
                Danh sách sản phẩm ({order.items.length})
              </h3>
              {order.shopInfo && (
                <Link
                  href={`/shops/${order.shopInfo.shopId}`}
                  className="text-[10px] font-bold uppercase tracking-wider text-orange-600 flex items-center gap-1.5 hover:text-orange-700 transition-colors"
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

        {/* CỘT PHẢI: TỔNG THANH TOÁN & ĐỊA CHỈ */}
        <div className="lg:col-span-4">
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
      </div>

      {/* MODALS PHỤ TRỢ */}
      {selectedItem && (
        <ReviewModal
          open={reviewModalOpen}
          onCancel={() => actions.setReviewModalOpen(false)}
          onSuccess={actions.handleReviewSuccess}
          productId={selectedItem.productId}
          productName={selectedItem.productName}
          productImage={resolveOrderItemImageUrl(
            selectedItem.imageBasePath,
            selectedItem.imageExtension,
            "_medium"
          )}
          orderId={order.orderId}
        />
      )}

      <OrderCancelModal
        isOpen={cancelModalVisible}
        onClose={() => actions.setCancelModalVisible(false)}
        onConfirm={(reason) => actions.handleCancelOrder(reason)}
        orderNumber={order.orderNumber}
        isCancelling={cancelling}
      />
    </div>
  );
};
