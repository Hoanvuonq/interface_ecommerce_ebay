import { SimpleModal } from "@/components";
import { Button } from "@/components/button/button";
import { formatPrice } from "@/hooks/useFormatPrice";
import { orderService } from "@/services/orders/order.service";
import {
  AlertTriangle,
  ChevronRight,
  Clock,
  Eye,
  MessageCircle,
  Package,
  RefreshCw,
  Store,
  Truck,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { toast } from "sonner";
import { ORDER_STATUS_MAP, STATUS_STYLE } from "../../_constants/order";
import { OrderCardProps, resolveOrderItemImageUrl } from "../../_types/order";
import { formatDate } from "@/hooks/format";

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onViewDetail,
  onOrderCancelled,
}) => {
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  const getStatusInfo = (status: string) => {
    return (
      ORDER_STATUS_MAP[status] || {
        label: status,
        icon: <Clock size={14} />,
      }
    );
  };

  const canCancelOrder = () => {
    return order.status === "CREATED" || order.status === "PENDING_PAYMENT";
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      toast.error("Vui lòng nhập lý do hủy đơn hàng");
      return;
    }

    setCancelling(true);
    try {
      await orderService.cancelOrder(order.orderId, cancelReason.trim());
      toast.success("Đã hủy đơn hàng thành công");
      setCancelModalVisible(false);
      setCancelReason("");
      if (onOrderCancelled) {
        onOrderCancelled();
      }
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

  const statusInfo = getStatusInfo(order.status);
  const statusStyle = STATUS_STYLE[order.status] || STATUS_STYLE.DEFAULT;
  const isPendingPayment = order.status === "PENDING_PAYMENT";
  const isDelivered = order.status === "DELIVERED";
  const thumbnailItems = order.items.slice(0, 3);
  const remainingCount = order.items.length - 3;
  const firstItem = order.items[0];

  const shopName = order.shopInfo?.shopName || "Cửa hàng";
  const shopLogo = order.shopInfo?.logoUrl;
  const shopStatusLabel =
    order.status === "DELIVERED" ? "Giao hàng thành công" : undefined;
  const shopLink = order.shopInfo?.shopId || order.shopId;

  return (
    <>
      <div
        className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-300 overflow-hidden"
        onClick={() => onViewDetail(order.orderId)}
      >
        <div
          className="absolute left-0 top-0 bottom-0 w-1.5"
          style={{ backgroundColor: statusStyle.strip }}
        />

        <div className="p-5 pl-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 mb-4">
            <div className="flex items-center gap-3">
              {shopLogo ? (
                <img
                  src={shopLogo}
                  alt={shopName}
                  className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold">
                  {shopName.substring(0, 2).toUpperCase()}
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 text-sm sm:text-base hover:text-orange-600 transition-colors">
                    {shopName}
                  </span>
                  <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                    Yêu thích
                  </span>
                  <ChevronRight size={14} className="text-gray-400" />
                </div>

                <div className="flex items-center gap-2 mt-1">
                  {shopStatusLabel && (
                    <span className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
                      <Truck size={12} /> {shopStatusLabel}
                    </span>
                  )}
                  {shopStatusLabel && <span className="text-gray-300">•</span>}
                  <span className="text-xs text-gray-500">
                    Mã đơn:{" "}
                    <span className="font-mono font-medium">
                      {order.orderNumber}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div
              className="flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                <MessageCircle size={14} /> Chat
              </button>
              {shopLink && (
                <Link href={`/shops/${shopLink}`}>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                    <Store size={14} /> Xem shop
                  </button>
                </Link>
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
                  style={{
                    backgroundColor: statusStyle.tagBg,
                    color: statusStyle.tagText,
                    borderColor: statusStyle.border,
                  }}
                >
                  {statusInfo.icon}
                  {statusInfo.label}
                </span>

                {order.trackingNumber && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200 font-mono">
                    📦 {order.trackingNumber}
                  </span>
                )}

                <span className="text-xs text-gray-400 ml-auto sm:ml-0">
                  {formatDate(order.createdAt)}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-4 sm:mb-0">
                <div className="flex -space-x-3">
                  {thumbnailItems.map((item, index) => {
                    // Lấy URL ảnh trước
                    const imageUrl = resolveOrderItemImageUrl(
                      item.imageBasePath,
                      item.imageExtension,
                      "_thumb"
                    );

                    return (
                      <div
                        key={item.itemId}
                        className="relative w-16 h-16 rounded-xl border-2 border-white shadow-sm overflow-hidden bg-gray-50 hover:scale-105 hover:z-10 transition-all duration-200"
                        style={{ zIndex: thumbnailItems.length - index }}
                      >
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              e.currentTarget.nextElementSibling?.classList.remove(
                                "hidden"
                              );
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-orange-400">
                            <Package size={20} strokeWidth={1.5} />
                          </div>
                        )}

                  
                      </div>
                    );
                  })}
                  {remainingCount > 0 && (
                    <div className="w-16 h-16 rounded-xl border-2 border-white bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-500 shadow-sm z-0">
                      +{remainingCount}
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-500 hidden sm:block">
                  {order.items.length} sản phẩm
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col items-end justify-between gap-4 lg:w-56 flex-shrink-0 border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6">
              <div className="text-right w-full">
                <p className="text-xs text-gray-500 mb-1">Tổng thành tiền</p>
                <p className="text-xl font-bold text-orange-600">
                  {formatPrice(order.grandTotal)}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {order.paymentMethod}
                </p>
              </div>

              <div
                className="flex flex-col gap-2 w-full"
                onClick={(e) => e.stopPropagation()}
              >
                {isPendingPayment && order.paymentUrl ? (
                  <>
                    <a
                      href={order.paymentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-orange-200 transition-all"
                    >
                      Thanh toán ngay
                    </a>
                    {canCancelOrder() && (
                      <button
                        onClick={() => setCancelModalVisible(true)}
                        className="flex items-center justify-center w-full px-4 py-2 text-red-500 hover:bg-red-50 text-sm font-medium rounded-lg transition-colors"
                      >
                        Hủy đơn hàng
                      </button>
                    )}
                  </>
                ) : isDelivered ? (
                  <div className="flex gap-2 w-full">
                    {firstItem && (
                      <Link
                        href={`/products/${firstItem.productId}`}
                        className="flex-1"
                      >
                        <button className="w-full px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors">
                          Mua lại
                        </button>
                      </Link>
                    )}
                    <button
                      onClick={() => onViewDetail(order.orderId)}
                      className="px-3 py-2 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                ) : (
                  <Button
                    variant="edit"
                    onClick={() => onViewDetail(order.orderId)}
                    icon={<FaEdit />}
                  >
                    Xem chi tiết
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <SimpleModal
        isOpen={cancelModalVisible}
        onClose={() => {
          setCancelModalVisible(false);
          setCancelReason("");
        }}
        title={
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle size={20} />
            <span>Hủy đơn hàng</span>
          </div>
        }
        footer={
          <>
            <button
              onClick={() => setCancelModalVisible(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={cancelling}
            >
              Đóng
            </button>
            <button
              onClick={handleCancelOrder}
              disabled={cancelling || !cancelReason.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {cancelling && <RefreshCw size={14} className="animate-spin" />}
              Xác nhận hủy
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Bạn có chắc chắn muốn hủy đơn hàng
            <span className="font-bold text-gray-900">
              #{order.orderNumber}
            </span>
            ? Hành động này không thể hoàn tác.
          </p>

          {order.carrier === "CONKIN" && order.trackingNumber && (
            <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg flex gap-2 text-xs text-yellow-800">
              <AlertTriangle size={14} className="shrink-0 mt-0.5" />
              <span>
                Đơn hàng này sử dụng vận chuyển Conkin. Vận đơn Conkin cũng sẽ
                được hủy tự động.
              </span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Lý do hủy đơn <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-400"
              placeholder="Vui lòng nhập lý do hủy đơn hàng..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              maxLength={500}
            />
            <div className="text-right mt-1">
              <span className="text-xs text-gray-400">
                {cancelReason.length}/500
              </span>
            </div>
          </div>
        </div>
      </SimpleModal>
    </>
  );
};
