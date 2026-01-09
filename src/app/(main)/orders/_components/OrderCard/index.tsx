"use client";

import { formatPrice } from "@/hooks/useFormatPrice";
import { cn } from "@/utils/cn";
import _ from "lodash";
import {
  ArrowRight,
  Package,
  Truck,
  Wallet,
  Star,
  Loader2,
  RefreshCcw,
  XCircle,
  RotateCcw,
} from "lucide-react";
import Image from "next/image";
import React, { useMemo, useState, useEffect } from "react";
import { ORDER_STATUS_UI, PAYMENT_METHOD_LABELS } from "../../_constants/order";
import { OrderCardProps, resolveOrderItemImageUrl } from "../../_types/order";
import { ReviewModal } from "../ReviewModal";
import { ReviewPreviewModal } from "../ReviewPreviewModal";
import { getMyReviews } from "@/services/review/review.service";
import { ReturnOrderModal } from "../ReturnOrderModal";
import { useRouter } from "next/navigation";
import { OrderCancelModal } from "../OrderCancelModal";

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onViewDetail,
  onOrderCancelled,
}) => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);
  const [dbReview, setDbReview] = useState<any>(null);
  const [loadingReview, setLoadingReview] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const fetchMyReview = async () => {
      if (["DELIVERED", "COMPLETED"].includes(order.status)) {
        try {
          setLoadingReview(true);
          const response = await getMyReviews(0, 50);
          const foundReview = response.content?.find(
            (r: any) => r.orderId === order.orderId
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
    const config = ORDER_STATUS_UI[order.status] || ORDER_STATUS_UI.CREATED;
    const firstItem = _.first(order.items);

    const rawImageUrl = resolveOrderItemImageUrl(
      firstItem?.imageBasePath,
      firstItem?.imageExtension,
      "_medium"
    );
    const productImageUrl =
      rawImageUrl && rawImageUrl.trim() !== "" ? rawImageUrl : null;

    const rawLogoUrl = _.get(order, "shopInfo.logoUrl");
    const shopLogo = rawLogoUrl && rawLogoUrl.trim() !== "" ? rawLogoUrl : null;

    return {
      config,
      shopName: _.truncate(_.get(order, "shopInfo.shopName", "Cửa hàng"), {
        length: 20,
      }),
      shopLogo,
      itemCount: order.items.length,
      firstItem,
      productImageUrl,
      paymentLabel:
        PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod,
      isReviewed: !!dbReview || !!order.reviewed,
      canReview: ["DELIVERED", "COMPLETED"].includes(order.status),
      canReorder: ["DELIVERED", "COMPLETED"].includes(order.status),
      canReturn: [ "COMPLETED"].includes(order.status),
      canCancel: ["PENDING_PAYMENT", "CREATED", "AWAITING_PAYMENT"].includes(
        order.status
      ),
    };
  }, [order, dbReview]);

  const reviewDisplayData = useMemo(() => {
    if (!dbReview) return null;
    return {
      rating: dbReview.rating,
      comment: dbReview.comment || "Không có nhận xét.",
      media:
        dbReview.mediaAssets?.map(
          (m: any) =>
            m.url ||
            `https://pub-5341c10461574a539df355b9fbe87197.r2.dev/${m.basePath}${m.extension}`
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
    setIsCancelModalOpen(true);
  };
  const handleReturnClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsReturnOpen(true);
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
              <Package size={16} className="text-gray-300" />
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-[14px] font-black text-gray-800 leading-none uppercase truncate">
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
            ui.config.border
          )}
        >
          {ui.config.label}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl border border-gray-100 overflow-hidden shrink-0 shadow-sm bg-white">
          {ui.productImageUrl ? (
            <Image
              src={ui.productImageUrl}
              alt={ui.firstItem?.productName || "Product"}
              fill
              sizes="(max-width: 640px) 56px, 64px"
              priority={order.status === "DELIVERED"}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <Package size={20} className="text-gray-700" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-800 text-[13px] line-clamp-1 italic leading-snug">
            {ui.firstItem?.productName}
          </p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
            <div className="flex items-center gap-1 text-emerald-600 font-bold text-[11px] uppercase">
              <Truck size={12} strokeWidth={2.5} /> Freeship
            </div>
            <div className="flex items-center gap-1 text-gray-500 font-bold text-[11px] uppercase">
              <Wallet size={12} strokeWidth={2.5} /> {ui.paymentLabel}
            </div>
          </div>
        </div>

        {/* Price and Actions */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="text-right">
            <span className="text-[8px] font-bold text-gray-700 uppercase block">
              Tạm tính
            </span>
            <span className="text-sm sm:text-lg font-black text-orange-600 leading-none">
              {formatPrice(order.grandTotal)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {ui.canCancel && (
              <button
                onClick={handleCancelClick}
                className="flex items-center gap-1.5 px-4 h-9 rounded-2xl text-[10px] font-black uppercase transition-all bg-white text-gray-500 border border-gray-200 hover:border-red-500 hover:text-red-600 active:scale-95 shadow-sm cursor-pointer"
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
                  "flex items-center gap-1 px-3 h-8 rounded-xl text-[10px] font-black uppercase transition-all shadow-sm active:scale-95",
                  ui.isReviewed
                    ? "bg-white border border-emerald-100 hover:bg-emerald-100"
                    : "bg-white text-gray-900 border border-gray-200 hover:border-orange-500 hover:text-orange-600"
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
                        : "fill-orange-400 text-orange-400"
                    )}
                  />
                )}
                {ui.isReviewed ? "Xem lại" : "Đánh giá"}
              </button>
            )}
            {ui.canReturn && (
              <button
                onClick={handleReturnClick}
                className="flex items-center gap-1.5 px-4 h-9 rounded-2xl text-[10px] font-black uppercase transition-all bg-white text-rose-500 border border-rose-100 hover:bg-rose-50 active:scale-95 shadow-sm"
              >
                <RotateCcw size={14} /> Trả hàng
              </button>
            )}
            {ui.canReorder && (
              <button
                type="button"
                onClick={handleReorder}
                className="flex items-center gap-1 px-3 h-8 rounded-xl text-[10px] font-black uppercase bg-orange-600 text-white hover:bg-orange-700 transition-all shadow-sm active:scale-95"
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
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={(reason) => {
          console.log("Hủy đơn với lý do:", reason);
          setIsCancelModalOpen(false);
          onOrderCancelled?.();
        }}
        orderNumber={order.orderNumber}
        isCancelling={false}
      />
      {isReviewModalOpen && ui.productImageUrl && (
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
          productImage={ui.productImageUrl}
          orderId={order.orderId}
        />
      )}
      <ReturnOrderModal
        isOpen={isReturnOpen}
        onClose={() => setIsReturnOpen(false)}
        order={order}
      />
      {isPreviewModalOpen && reviewDisplayData && ui.productImageUrl && (
        <ReviewPreviewModal
          open={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          productName={ui.firstItem?.productName || ""}
          productImage={ui.productImageUrl}
          reviewData={reviewDisplayData}
        />
      )}
    </article>
  );
};
