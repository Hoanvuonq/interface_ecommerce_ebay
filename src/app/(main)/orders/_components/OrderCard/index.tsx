/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import _ from "lodash";
import {
  ChevronRight,
  Clock,
  Eye,
  MessageCircle,
  Package,
  RefreshCw,
  Store,
  Truck,
  AlertTriangle,
} from "lucide-react";

import { SimpleModal } from "@/components";
import { Button } from "@/components/button/button";
import { formatPrice } from "@/hooks/useFormatPrice";
import { formatDate } from "@/hooks/format";
import { ORDER_STATUS_MAP, STATUS_STYLE } from "../../_constants/order";
import { OrderCardProps, resolveOrderItemImageUrl } from "../../_types/order";
import { useOrderActions } from "../../_hooks/useOrderActions";
import { FaEdit } from "react-icons/fa";
import { OrderCardHeader } from "../OrderCardHeader";
import { OrderCardContent } from "../OrderCardContent";
import { cn } from "@/utils/cn";
import { OrderCardActions } from "../OrderCardActions";

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onViewDetail,
  onOrderCancelled,
}) => {
  // Logic Actions & State từ Hook
  const { state, actions } = useOrderActions(
    order.orderId,
    order.status,
    onOrderCancelled
  );
  const {
    cancelModalVisible,
    cancelReason,
    cancelling,
    canCancel,
    isPendingPayment,
    isDelivered,
  } = state;
  const { setCancelModalVisible, setCancelReason, handleConfirmCancel } =
    actions;

  const ui = useMemo(() => {
    const status = ORDER_STATUS_MAP[order.status] || {
      label: order.status,
      icon: <Clock size={14} />,
    };
    const style = STATUS_STYLE[order.status] || STATUS_STYLE.DEFAULT;
    const shopName = _.get(order, "shopInfo.shopName", "Cửa hàng");

    return {
      status,
      style,
      shop: {
        name: shopName,
        logo: _.get(order, "shopInfo.logoUrl") ?? null,
        link: _.get(order, "shopInfo.shopId", order.shopId) ?? "",
        initials: _.toUpper(shopName.substring(0, 2)),
      },
      items: {
        thumbnails: _.take(order.items, 3),
        remaining: order.items.length - 3,
        first: _.first(order.items),
      },
    };
  }, [order]);

  return (
    <article
      className={cn(
        "group relative bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 ",
        "shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(234,88,12,0.12)] hover:border-orange-100 transition-all duration-500 overflow-hidden"
      )}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-orange-500" />

      <div className="p-3 pl-5">
        <OrderCardHeader shop={ui.shop} orderNumber={order.orderNumber} />
        <div className="grid lg:grid-cols-12 gap-6 items-center">
          <OrderCardContent
            status={ui.status}
            trackingNumber={order.trackingNumber}
            createdAt={order.createdAt}
            items={order.items}
            thumbnails={ui.items.thumbnails}
            remaining={ui.items.remaining}
            isDelivered={isDelivered}
            onViewDetail={() => onViewDetail(order.orderId)}
          />
          <OrderCardActions
            grandTotal={order.grandTotal}
            paymentMethod={order.paymentMethod}
            isPendingPayment={isPendingPayment}
            paymentUrl={order.paymentUrl}
            canCancel={canCancel}
            isDelivered={isDelivered}
            firstProductId={ui.items.first?.productId}
            onViewDetail={() => onViewDetail(order.orderId)}
            onCancelClick={() => actions.setCancelModalVisible(true)}
          />
        </div>
      </div>

      <SimpleModal
        isOpen={cancelModalVisible}
        onClose={() => {
          setCancelModalVisible(false);
          setCancelReason("");
        }}
        title={
          <div className="flex items-center gap-2 text-orange-600 font-semibold uppercase tracking-tight text-lg">
            <AlertTriangle size={22} /> Hủy đơn hàng
          </div>
        }
        footer={
          <div className="flex gap-3 w-full">
            <button
              onClick={() => setCancelModalVisible(false)}
              className="flex-1 py-3 text-xs font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
              disabled={cancelling}
            >
              Đóng
            </button>
            <button
              onClick={handleConfirmCancel}
              disabled={cancelling || !cancelReason.trim()}
              className="flex-2 py-3 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold uppercase tracking-widest rounded-xl shadow-lg shadow-orange-200 transition-all flex items-center justify-center gap-2"
            >
              {cancelling && <RefreshCw size={14} className="animate-spin" />}{" "}
              Xác nhận hủy
            </button>
          </div>
        }
      >
        <div className="space-y-4 py-2">
          <p className="text-sm text-gray-600 leading-relaxed">
            Bạn có chắc muốn hủy đơn{" "}
            <span className="font-bold text-gray-900">
              #{order.orderNumber}
            </span>
            ? Hành động này không thể hoàn tác.
          </p>
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest ml-1">
              Lý do hủy đơn *
            </label>
            <textarea
              rows={4}
              className={cn(
                "w-full p-4 text-sm border border-gray-100 bg-gray-50 rounded-2xl focus:ring-4 ",
                "focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all resize-none"
              )}
              placeholder="Vui lòng nhập lý do..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </div>
        </div>
      </SimpleModal>
    </article>
  );
};
