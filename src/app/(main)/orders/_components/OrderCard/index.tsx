"use client";

import _ from "lodash";
import {
  ArrowRight,
  Loader2,
  Package,
  Receipt,
  RefreshCcw,
  RotateCcw,
  Star,
  Tag,
  Truck,
  Wallet,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

import { formatPrice } from "@/hooks/useFormatPrice";
import { getMyReviews } from "@/services/review/review.service";
import { cn } from "@/utils/cn";
import { useOrderDetailView } from "../../_hooks/useOrderDetailView";

import { ImageProductItem } from "@/components";
import type { OrderResponse } from "@/types/orders/order.types";
import {
  getOrderStatusConfig,
  PAYMENT_METHOD_LABELS
} from "../../_constants/order.constants";
import { OrderCardProps, OrderStatus } from "../../_types/order";
import { OrderCancelModal } from "../OrderCancelModal";
import { ReturnOrderModal } from "../ReturnOrderModal";
import { ReviewModal } from "../ReviewModal";
import { ReviewPreviewModal } from "../ReviewPreviewModal";
const STORAGE_BASE_URL = "https://pub-5341c10461574a539df355b9fbe87197.r2.dev/";

const extractPricing = (order: OrderResponse) => {
  if (order.pricing) {
    return {
      subtotal: order.pricing.subtotal || 0,
      shopDiscount: order.pricing.shopDiscount || 0,
      platformDiscount: order.pricing.platformDiscount || 0,
      shippingDiscount: order.pricing.shippingDiscount || 0,
      originalShippingFee: order.pricing.originalShippingFee || 0,
      shippingFee: order.pricing.shippingFee || 0,
      totalDiscount: order.pricing.totalDiscount || 0,
      grandTotal: order.pricing.grandTotal || 0,
      appliedVoucherCodes: order.pricing.appliedVoucherCodes || "",
    };
  }

  return {
    subtotal: order.subtotal || 0,
    shopDiscount: 0,
    platformDiscount: 0,
    shippingDiscount: 0,
    originalShippingFee: order.shippingFee || 0,
    shippingFee: order.shippingFee || 0,
    totalDiscount: order.totalDiscount || 0,
    grandTotal: order.grandTotal || 0,
    appliedVoucherCodes: "",
  };
};

const extractPaymentMethod = (order: OrderResponse): string => {
  return order.payment?.method || order.paymentMethod || "COD";
};

export const OrderCard: React.FC<OrderCardProps> = ({
  order: orderProp,
  onViewDetail,
  onOrderCancelled,
}) => {
  const order = orderProp as OrderResponse;
  const router = useRouter();

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);
  const [dbReview, setDbReview] = useState<any>(null);
  const [loadingReview, setLoadingReview] = useState(false);

  const {
    state: { cancelModalVisible, cancelling },
    actions: { setCancelModalVisible, handleCancelOrder },
  } = useOrderDetailView(order);

  // Extract pricing data
  const pricing = useMemo(() => extractPricing(order), [order]);
  const paymentMethod = useMemo(() => extractPaymentMethod(order), [order]);

  useEffect(() => {
    const fetchMyReview = async () => {
      const ALLOWED_STATUSES = [OrderStatus.DELIVERED, OrderStatus.COMPLETED];

      if (ALLOWED_STATUSES.includes(order.status as OrderStatus)) {
        try {
          setLoadingReview(true);
          const response = await getMyReviews(0, 50);
          const foundReview = response.content?.find(
            (r: any) => r.orderId === order.orderId,
          );
          if (foundReview) setDbReview(foundReview);
        } catch (error) {
          console.error("Error fetching review:", error);
        } finally {
          setLoadingReview(false);
        }
      }
    };
    fetchMyReview();
  }, [order.orderId, order.status]);

  const ui = useMemo(() => {
    const config = getOrderStatusConfig(order.status);

    const firstItem = _.first(order.items);

    const modalImgUrl = firstItem?.imagePath 
      ? `${STORAGE_BASE_URL}${firstItem.imagePath.replace("*", "medium")}`
      : "";

    const rawLogoUrl = _.get(order, "shopInfo.logoUrl");
    const shopLogo = rawLogoUrl && rawLogoUrl.trim() !== "" ? rawLogoUrl : null;

    const status = order.status as OrderStatus;

    const hasFreeship = pricing.shippingDiscount > 0;

    return {
      config,
      shopName: _.truncate(_.get(order, "shopInfo.shopName", "Cửa hàng"), {
        length: 20,
      }),
      shopLogo,
      itemCount: order.items.length,
      firstItem,
      modalImgUrl,
      paymentLabel: PAYMENT_METHOD_LABELS[paymentMethod] || paymentMethod,
      isReviewed: !!dbReview || !!order.reviewed,
      hasFreeship,

      canReview: [OrderStatus.DELIVERED, OrderStatus.COMPLETED].includes(
        status,
      ),
      canReorder: [OrderStatus.DELIVERED, OrderStatus.COMPLETED].includes(
        status,
      ),
      canReturn: [OrderStatus.COMPLETED].includes(status),
      canCancel: [OrderStatus.AWAITING_PAYMENT, OrderStatus.CREATED].includes(
        status,
      ),
    };
  }, [order, dbReview, pricing, paymentMethod]);

  const reviewDisplayData = useMemo(() => {
    if (!dbReview) return null;
    return {
      rating: dbReview.rating,
      comment: dbReview.comment || "Không có nhận xét.",
      media:
        dbReview.mediaAssets?.map(
          (m: any) =>
            m.url ||
            `https://pub-5341c10461574a539df355b9fbe87197.r2.dev/${m.basePath}${m.extension}`,
        ) || [],
      createdAt: dbReview.createdAt,
    };
  }, [dbReview]);

  const handleReorder = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (ui.firstItem?.productId) {
      router.push(`/products/${ui.firstItem.productId}`);
    }
  };

  const handleCancelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCancelModalVisible(true);
  };

  const handleReturnClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsReturnOpen(true);
  };

  const handleProductNameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (ui.firstItem?.productId) {
      router.push(`/products/${ui.firstItem.productId}`);
    }
  };

  return (
    <article className="group relative bg-white border border-gray-100 rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-300 mb-3 overflow-hidden">
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-50">
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative w-10 h-10 shrink-0 rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50 shadow-inner">
            {ui.shopLogo ? (
              <Image
                src={ui.shopLogo}
                alt={ui.shopName}
                fill
                sizes="40px"
                className="object-cover"
              />
            ) : (
              <Package size={16} className="text-gray-500" />
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-[14px] font-bold text-gray-800 leading-none uppercase truncate">
              {ui.shopName}
            </h4>
            <span className="text-[11px] text-gray-700 font-bold mt-1 block uppercase">
              #{order.orderNumber}
            </span>
          </div>
        </div>

        <div
          className={cn(
            "px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1.5 border shadow-xs",
            ui.config.bg,
            ui.config.text,
            ui.config.border,
          )}
        >
          {ui.config.icon}
          {ui.config.label}
        </div>
      </div>

      <div className="flex items-start gap-3 sm:gap-4">
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl border border-gray-100 overflow-hidden shrink-0 shadow-sm bg-white">
          <ImageProductItem
            imagePath={ui.firstItem?.imagePath}
            productName={ui.firstItem?.productName}
            size="md"
            fill
            priority={order.status === OrderStatus.DELIVERED}
          />
        </div>

        <div className="flex-1 min-w-0">
          <button
            onClick={handleProductNameClick}
            className="font-bold text-gray-800 text-[13px] line-clamp-1 italic leading-snug hover:text-orange-600 transition-colors text-left w-full"
          >
            {ui.firstItem?.productName}
          </button>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
            {ui.hasFreeship && (
              <div className="flex items-center gap-1 text-emerald-600 font-bold text-[11px] uppercase">
                <Truck size={12} strokeWidth={2.5} />
                {pricing.shippingDiscount > 0 ? (
                  <>
                    <span className="text-[11px] text-emerald-600">
                      {formatPrice(pricing.shippingFee)}
                    </span>
                  </>
                ) : (
                  <span className="text-[11px] text-gray-500">
                    {formatPrice(pricing.shippingFee)}
                  </span>
                )}
              </div>
            )}
            <div className="flex items-center gap-1 text-gray-500 font-bold text-[11px] uppercase">
              <Wallet size={12} strokeWidth={2.5} /> {ui.paymentLabel}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="text-right space-y-0.5">
            {pricing.subtotal > 0 && (
              <div className="flex items-center justify-end gap-1">
                <span className="text-[9px] text-gray-400 uppercase">
                  Tạm tính:
                </span>
                <span className="text-[11px] font-medium text-gray-500">
                  {formatPrice(pricing.subtotal)}
                </span>
              </div>
            )}

            {/* Shipping Fee */}
            {pricing.originalShippingFee > 0 && (
              <div className="flex items-center justify-end gap-1">
                <Truck size={10} className="text-gray-400" />
                <span className="text-[9px] text-gray-400 uppercase">
                  Ship:
                </span>
                {pricing.shippingDiscount > 0 ? (
                  <>
                    <span className="text-[10px] text-gray-400 line-through">
                      {formatPrice(pricing.originalShippingFee)}
                    </span>
                    <span className="text-[11px] font-medium text-emerald-600">
                      {formatPrice(pricing.shippingFee)}
                    </span>
                  </>
                ) : (
                  <span className="text-[11px] font-medium text-gray-500">
                    {formatPrice(pricing.shippingFee)}
                  </span>
                )}
              </div>
            )}

            {/* Total Discount */}
            {pricing.totalDiscount > 0 && (
              <div className="flex items-center justify-end gap-1">
                <Tag size={10} className="text-red-400" />
                <span className="text-[9px] text-red-400 uppercase">Giảm:</span>
                <span className="text-[11px] font-semibold text-red-500">
                  -{formatPrice(pricing.totalDiscount)}
                </span>
              </div>
            )}

            {/* Grand Total */}
            <div className="flex items-center justify-end gap-1 pt-1 border-t border-gray-100 mt-1">
              <Receipt size={12} className="text-orange-500" />
              <span className="text-[10px] font-bold text-gray-600 uppercase">
                Tổng:
              </span>
              <span className="text-base sm:text-lg font-bold text-orange-600 leading-none">
                {formatPrice(pricing.grandTotal)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {ui.canCancel && (
              <button
                onClick={handleCancelClick}
                className="flex items-center gap-1.5 px-4 h-9 rounded-2xl text-[10px] font-bold uppercase transition-all bg-white text-gray-500 border border-gray-200 hover:border-red-500 hover:text-red-600 active:scale-95 shadow-sm cursor-pointer"
              >
                <XCircle size={14} />
                Hủy đơn
              </button>
            )}

            {ui.canReview && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (ui.isReviewed) setIsPreviewModalOpen(true);
                  else setIsReviewModalOpen(true);
                }}
                disabled={loadingReview}
                className={cn(
                  "flex items-center gap-1 px-3 h-8 rounded-xl text-[10px] font-bold uppercase transition-all shadow-sm active:scale-95",
                  ui.isReviewed
                    ? "bg-white border border-emerald-100 hover:bg-emerald-100"
                    : "bg-white text-gray-900 border border-gray-200 hover:border-gray-500 hover:text-orange-600",
                )}
              >
                {loadingReview ? (
                  <Loader2 className="w-3 h-3 animate-spin text-orange-500" />
                ) : (
                  <Star
                    size={12}
                    className={cn(
                      ui.isReviewed
                        ? "fill-emerald-500 text-emerald-500"
                        : "fill-orange-400 text-orange-400",
                    )}
                  />
                )}
                {ui.isReviewed ? "Xem lại" : "Đánh giá"}
              </button>
            )}

            {ui.canReturn && (
              <button
                onClick={handleReturnClick}
                className="flex items-center gap-1.5 px-4 h-9 rounded-2xl text-[10px] font-bold uppercase transition-all bg-white text-rose-500 border border-rose-100 hover:bg-rose-50 active:scale-95 shadow-sm"
              >
                <RotateCcw size={14} /> Trả hàng
              </button>
            )}

            {ui.canReorder && (
              <button
                type="button"
                onClick={handleReorder}
                className="flex items-center gap-1 px-3 h-8 rounded-xl text-[10px] font-bold uppercase bg-orange-600 text-white hover:bg-orange-700 transition-all shadow-sm active:scale-95"
              >
                <RefreshCcw size={12} strokeWidth={2.5} />
                Mua lại
              </button>
            )}

            <button
              type="button"
              onClick={() => onViewDetail(order.orderId)}
              className="w-8 h-8 rounded-xl bg-gray-900 text-white flex items-center justify-center hover:bg-orange-600 transition-all shadow-lg active:scale-90"
              aria-label="View Order Detail"
            >
              <ArrowRight size={16} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>

      <OrderCancelModal
        isOpen={cancelModalVisible}
        onClose={() => setCancelModalVisible(false)}
        onConfirm={async (reason) => {
          await handleCancelOrder(reason);
          onOrderCancelled?.();
        }}
        orderNumber={order.orderNumber}
        isCancelling={cancelling}
      />

      {isReviewModalOpen && ui.modalImgUrl && (
        <ReviewModal
          open={isReviewModalOpen}
          onCancel={() => setIsReviewModalOpen(false)}
          onSuccess={() => {
            setDbReview({ rating: 5, comment: "Đã đánh giá" });
            setIsReviewModalOpen(false);
            onOrderCancelled?.();
          }}
          productId={ui.firstItem?.productId || ""}
          productName={ui.firstItem?.productName || ""}
          productImage={ui.modalImgUrl}
          orderId={order.orderId}
        />
      )}

      <ReturnOrderModal
        isOpen={isReturnOpen}
        onClose={() => setIsReturnOpen(false)}
        order={order}
      />

      {isPreviewModalOpen && reviewDisplayData && ui.modalImgUrl && (
        <ReviewPreviewModal
          open={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          productName={ui.firstItem?.productName || ""}
          productImage={ui.modalImgUrl}
          reviewData={reviewDisplayData}
        />
      )}
    </article>
  );
};
