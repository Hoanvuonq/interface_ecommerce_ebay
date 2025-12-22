"use client";

import { SimpleModal } from "@/components";
import { formatPrice } from "@/hooks/useFormatPrice";
import { orderService } from "@/services/orders/order.service";
import { OrderItemResponse } from "@/types/orders/order.types";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Copy,
  CreditCard,
  Loader2,
  Mail,
  MapPin,
  Package,
  Phone,
  Receipt,
  Truck,
  XCircle,
  Star,
  StoreIcon,
  Map,
  MapPinIcon,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { ORDER_STATUS_UI } from "../../_constants/order";
import {
  PAYMENT_METHOD_LABELS,
  resolveOrderItemImageUrl,
} from "../../_types/order";
import { OrderExpirationTimer } from "../OrderExpirationTimer";
import { OrderPaymentCard } from "../OrderPaymentCard";
import { OrderTrackingTimeline } from "../OrderTrackingTimeline";
import { PayOSQRPayment } from "../PayOSQRPayment";
import { ReviewModal } from "../ReviewModal";
import { OrderDetailViewProps } from "./type";
import { OrderStatusTimeline } from "../OrderStatusTimeline";

export const OrderDetailView: React.FC<OrderDetailViewProps> = ({ order }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<OrderItemResponse | null>(
    null
  );
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  const [reviewedProductIds, setReviewedProductIds] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const reviewed = new Set<string>();
    order.items?.forEach((item) => {
      if (item.reviewed && item.productId) {
        reviewed.add(item.productId);
      }
    });
    setReviewedProductIds(reviewed);
  }, [order]);

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber);
    toast.success("Đã sao chép mã đơn hàng");
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
    window.location.reload();
  };

  const handleReviewClick = (item: OrderItemResponse) => {
    if (item.productId && reviewedProductIds.has(item.productId)) {
      toast.info("Bạn đã đánh giá sản phẩm này rồi.");
      return;
    }
    setSelectedItem(item);
    setReviewModalOpen(true);
  };
  const handleCancelPayment = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleReviewSuccess = () => {
    if (selectedItem?.productId) {
      setReviewedProductIds((prev) =>
        new Set(prev).add(selectedItem.productId!)
      );
    }
    setRefreshKey((prev) => prev + 1);
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      toast.warning("Vui lòng nhập lý do hủy đơn hàng");
      return;
    }

    setCancelling(true);
    try {
      await orderService.cancelOrder(order.orderId, cancelReason.trim());
      toast.success("Hủy đơn hàng thành công");
      setCancelModalVisible(false);
      setCancelReason("");
      setTimeout(() => window.location.reload(), 1000);
    } catch (error: any) {
      console.error("Error cancelling order:", error);
      toast.error(
        error?.response?.data?.message ||
          "Không thể hủy đơn hàng. Vui lòng thử lại."
      );
    } finally {
      setCancelling(false);
    }
  };

  const statusInfo = ORDER_STATUS_UI[order.status] || {
    label: order.status,
    icon: <AlertTriangle size={18} />,
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
    strip: "#9CA3AF",
  };

  const isPayOS = order.paymentMethod === "PAYOS";
  const showPayment = order.status === "PENDING_PAYMENT" && (order.paymentUrl || isPayOS);
  const isDelivered = order.status === "DELIVERED";
  const isCancelled = order.status === "CANCELLED";
  const canCancel =
    order.status === "CREATED" || order.status === "PENDING_PAYMENT";
  const canReview = isDelivered;

  const paymentLabel =
    PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod;
  const shippingFee = order.conkinShippingCost ?? order.shippingFee ?? 0;
  const firstItem = order.items[0];
  const showTracking = Boolean(order.trackingNumber && order.carrier);

  const recipientAddress =
    [
      order.addressLine1,
      order.addressLine2,
      order.postalCode,
      order.city,
      order.province,
      order.country,
    ]
      .filter(Boolean)
      .join(", ") || "Không có thông tin địa chỉ";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Chi tiết đơn hàng
            </h1>
            <div
              className={`px-3 py-1 rounded-full text-sm font-semibold border flex items-center gap-1.5 ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
            >
              {isDelivered ? (
                <CheckCircle2 size={14} />
              ) : isCancelled ? (
                <XCircle size={14} />
              ) : (
                statusInfo.icon
              )}
              {statusInfo.label}
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span
              className="font-mono text-gray-900 bg-gray-100 px-2 py-0.5 rounded cursor-pointer hover:bg-gray-200 transition-colors flex items-center gap-1"
              onClick={handleCopyOrderNumber}
            >
              #{order.orderNumber} <Copy size={12} />
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {new Date(order.createdAt).toLocaleString("vi-VN", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {isDelivered && firstItem && (
            <Link href={`/products/${firstItem.productId}`}>
              <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                Mua lại
              </button>
            </Link>
          )}
          <Link href="/contact">
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
              Cần trợ giúp?
            </button>
          </Link>
          {canCancel && (
            <button
              onClick={() => setCancelModalVisible(true)}
              className="px-4 py-2 bg-white border border-red-200 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors shadow-sm"
            >
              Hủy đơn
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* --- LEFT COLUMN (Main Content) --- */}
        <div className="lg:col-span-8 space-y-6">
          {/* Expiration Alert */}
          {(order.status === "CREATED" ||
            order.status === "PENDING_PAYMENT") && (
            <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
              <OrderExpirationTimer
                expiresAt={order.expiresAt}
                onExpire={() => {
                  toast.error("Đơn hàng đã hết hạn thanh toán");
                  setTimeout(() => window.location.reload(), 2000);
                }}
              />
            </div>
          )}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <Truck className="text-orange-500" size={20} />
                </div>
                Theo dõi đơn hàng
              </h3>
              {order.trackingNumber && (
                <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">
                  Vận đơn: {order.trackingNumber}
                </span>
              )}
            </div>

            <div className="max-w-md">
              <OrderStatusTimeline
                status={order.status}
                createdAt={order.createdAt}
                updatedAt={order.createdAt}
              />
            </div>
          </div>

          {showTracking && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Truck className="text-orange-500" size={20} /> Trạng thái vận
                chuyển
              </h3>
              <OrderTrackingTimeline
                trackingCode={order.trackingNumber as string}
                carrier={order.carrier as string}
              />
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Package className="text-orange-500" size={20} /> Sản phẩm (
                {order.items.length})
              </h3>
              {order.shopInfo?.shopName && (
                <Link
                  href={`/shops/${order.shopInfo.shopId}`}
                  className="text-sm font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1"
                >
                  <StoreIcon size={14} /> {order.shopInfo.shopName}
                </Link>
              )}
            </div>

            <div className="divide-y divide-gray-100">
              {order.items.map((item) => {
                const isReviewed = reviewedProductIds.has(item.productId);
                const imageUrl = resolveOrderItemImageUrl(
                  item.imageBasePath,
                  item.imageExtension,
                  "_medium"
                );

                return (
                  <div
                    key={item.itemId}
                    className="p-6 hover:bg-gray-50/30 transition-colors"
                  >
                    <div className="flex gap-4 sm:gap-6">
                      {/* Image */}
                      <Link
                        href={`/products/${item.productId}`}
                        className="shrink-0 group"
                      >
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg border border-gray-200 overflow-hidden bg-white relative flex items-center justify-center">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={item.productName}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <Package className="text-gray-300" size={32} />
                          )}
                        </div>
                      </Link>

                      {/* Content */}
                      <div className="flex-1 min-w-0 flex flex-col sm:flex-row justify-between gap-4">
                        <div className="space-y-1.5">
                          <Link href={`/products/${item.productId}`}>
                            <h4 className="font-semibold text-gray-900 line-clamp-2 hover:text-orange-600 transition-colors text-base">
                              {item.productName}
                            </h4>
                          </Link>
                          {item.variantAttributes && (
                            <div className="flex flex-wrap gap-2">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                {item.variantAttributes}
                              </span>
                            </div>
                          )}
                          <div className="text-sm text-gray-500">
                            SKU: {item.sku || "N/A"}
                          </div>
                        </div>

                        <div className="text-left sm:text-right space-y-2 shrink-0">
                          <div className="font-bold text-gray-900 text-lg">
                            {formatPrice(item.lineTotal)}
                          </div>
                          <div className="text-sm text-gray-500">
                            Qty:{" "}
                            <span className="font-medium text-gray-900">
                              {item.quantity}
                            </span>
                          </div>

                          {/* Review Button Mobile/Desktop */}
                          {canReview && (
                            <button
                              onClick={() => handleReviewClick(item)}
                              disabled={isReviewed}
                              className={`
                                  mt-2 w-full sm:w-auto text-xs font-bold px-3 py-1.5 rounded-md border flex items-center justify-center sm:justify-end gap-1.5 transition-all
                                  ${
                                    isReviewed
                                      ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
                                      : "bg-white border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300"
                                  }
                                `}
                            >
                              <Star
                                size={12}
                                className={
                                  isReviewed
                                    ? "fill-gray-400"
                                    : "fill-orange-500"
                                }
                              />
                              {isReviewed ? "Đã đánh giá" : "Viết đánh giá"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 bg-gray-50/50 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Receipt className="text-orange-500" size={18} /> Tóm tắt đơn
                hàng
              </h3>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tạm tính</span>
                <span className="font-medium text-gray-900">
                  {formatPrice(order.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Phí vận chuyển</span>
                <span className="font-medium text-gray-900">
                  {formatPrice(shippingFee)}
                </span>
              </div>
              {order.totalDiscount > 0 && (
                <div className="flex justify-between text-sm text-orange-600 bg-orange-50 px-2 py-1 rounded">
                  <span>Giảm giá</span>
                  <span className="font-medium">
                    -{formatPrice(order.totalDiscount)}
                  </span>
                </div>
              )}
              {order.taxAmount > 0 && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Thuế</span>
                  <span className="font-medium">
                    {formatPrice(order.taxAmount)}
                  </span>
                </div>
              )}
              <div className="h-px bg-gray-200 my-1"></div>
              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-gray-900">
                  Tổng cộng
                </span>
                <span className="text-2xl font-bold text-orange-600">
                  {formatPrice(order.grandTotal)}
                </span>
              </div>
              <div className="text-right text-xs text-gray-400">
                Đã bao gồm VAT (nếu có)
              </div>
            </div>
          </div>

          {/* 2. SHIPPING ADDRESS */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 bg-gray-50/50 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="text-blue-500" size={18} /> Địa chỉ nhận hàng
              </h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-5 border-gray-100">
                <span className="bg-amber-50 rounded-full p-2 inline-block">
                  <MapPinIcon size={20} className="text-orange-500" />
                </span>
                <div className="flex items-start flex-col">
                  <p className="font-bold text-gray-900 text-base mb-1 uppercase">
                    {order.recipientName || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {recipientAddress}
                  </p>
                </div>
              </div>
              <div>
                <div className="space-y-1.5 text-sm text-black">
                  <div className="inline-block bg-gray-100 rounded-2xl py-1 px-3">
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-400" />
                      <p className="ext-sm text-black leading-relaxed">
                        {order.phoneNumber || "N/A"}
                      </p>
                    </div>
                  </div>
                  {order.email && (
                    <div className="inline-block bg-gray-100 rounded-2xl py-1 px-3">
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-gray-400" />
                        <p className="ext-sm text-black leading-relaxed">
                          {order.email}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 3. SHIPPING & PAYMENT INFO */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 bg-gray-50/50 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Truck className="text-indigo-600" size={18} /> Thông tin vận
                chuyển
              </h3>
            </div>
            <div className="p-5 space-y-4 divide-y divide-gray-100">
              <div className="flex justify-between items-start pt-2 first:pt-0">
                <span className="text-sm text-gray-500">Đơn vị</span>
                <div className="text-right">
                  <span className="block font-medium text-gray-900">
                    {order.carrier || "N/A"}
                  </span>
                  <span className="block text-xs text-gray-500">
                    {order.shippingMethod || "Tiêu chuẩn"}
                  </span>
                  {order.trackingNumber && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-700 font-mono text-xs rounded border border-gray-200">
                      {order.trackingNumber}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center pt-4">
                <span className="text-sm text-gray-500">Thanh toán</span>
                <span className="font-bold bg-blue-200 text-blue-700 px-2 py-1 rounded text-xs border border-blue-100">
                  {paymentLabel}
                </span>
              </div>
            </div>
          </div>

          {showPayment && (
            <div className="bg-white rounded-2xl shadow-md border border-orange-100 p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-red-500" />
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="text-orange-500" size={20} /> Thanh toán
              </h3>

              {isPayOS ? (
                <PayOSQRPayment
                  key={refreshKey}
                  orderId={order.orderId}
                  orderNumber={order.orderNumber}
                  amount={order.grandTotal}
                  onCancelPayment={handleCancelPayment}
                  onRefresh={handleRefresh}
                />
              ) : (
                /* Regular Payment Card */
                <OrderPaymentCard
                  orderId={order.orderId}
                  paymentUrl={order.paymentUrl}
                  paymentMethod={order.paymentMethod}
                  expiresAt={order.expiresAt}
                  onCancelPayment={handleCancelPayment}
                  onRefresh={handleRefresh}
                />
              )}
            </div>
          )}

          {/* 5. CUSTOMER NOTE */}
          {order.customerNote && (
            <div className="bg-yellow-50 rounded-2xl shadow-sm border border-yellow-100 p-5">
              <h3 className="font-bold text-yellow-800 text-sm mb-2 flex items-center gap-2">
                <Receipt size={16} /> Ghi chú
              </h3>
              <p className="text-sm text-yellow-900 italic">
                "{order.customerNote}"
              </p>
            </div>
          )}
        </div>
      </div>

      {selectedItem && (
        <ReviewModal
          open={reviewModalOpen}
          onCancel={() => {
            setReviewModalOpen(false);
            setSelectedItem(null);
          }}
          onSuccess={handleReviewSuccess}
          productId={selectedItem.productId}
          productName={selectedItem.productName}
          orderId={order.orderId}
        />
      )}

      <SimpleModal
        isOpen={cancelModalVisible}
        onClose={() => {
          setCancelModalVisible(false);
          setCancelReason("");
        }}
        title={
          <div className="flex items-center gap-2 text-red-600">
            <div className="p-2 bg-red-50 rounded-full">
              <AlertTriangle size={20} />
            </div>
            <span className="font-bold text-lg">Hủy đơn hàng</span>
          </div>
        }
        footer={
          <div className="flex justify-end gap-3 w-full">
            <button
              onClick={() => setCancelModalVisible(false)}
              disabled={cancelling}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Đóng lại
            </button>
            <button
              onClick={handleCancelOrder}
              disabled={cancelling || !cancelReason.trim()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelling && <Loader2 size={16} className="animate-spin" />}
              Xác nhận hủy
            </button>
          </div>
        }
      >
        <div className="space-y-4 pt-2">
          <p className="text-sm text-gray-600">
            Bạn có chắc chắn muốn hủy đơn hàng{" "}
            <span className="font-bold text-gray-900 bg-gray-100 px-1 rounded">
              #{order.orderNumber}
            </span>
            ?
            <br />
            Hành động này{" "}
            <span className="font-bold text-red-600">không thể hoàn tác</span>.
          </p>

          {order.carrier === "CONKIN" && order.trackingNumber && (
            <div className="flex gap-3 p-3 bg-orange-50 border border-orange-100 rounded-lg text-sm text-orange-800">
              <AlertTriangle size={18} className="shrink-0 mt-0.5" />
              <span>
                Đơn hàng này sử dụng vận chuyển Conkin. Vận đơn Conkin cũng sẽ
                được hủy tự động.
              </span>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Lý do hủy đơn <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all placeholder:text-gray-400 resize-none bg-gray-50 focus:bg-white"
              placeholder="Vui lòng cho chúng tôi biết lý do..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              maxLength={500}
            />
            <div className="text-right mt-1">
              <span className="text-xs text-gray-400 font-medium">
                {cancelReason.length}/500
              </span>
            </div>
          </div>
        </div>
      </SimpleModal>
    </div>
  );
};
