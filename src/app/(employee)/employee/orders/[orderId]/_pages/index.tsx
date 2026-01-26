"use client";

import { OrderResponseAdmin } from "@/api/_types/adminOrder.types";
import { EmptyProductState } from "@/app/(main)/products/_components/EmptyProductState";
import { SectionLoading } from "@/components";
import { AlertCircle, ArrowLeft, ShieldAlert } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { adminOrderService } from "../../_services/adminOrder.service";
import {
    BuyerInfoCard,
    CustomerNoteCard,
    FinancialInfoCard,
    OrderDetailHeader,
    PaymentInfoCard,
    ProductListCard,
    QuickActionsCard,
    SellerInfoCard,
    ShippingInfoCard,
} from "../_components";

export const OrderDetailScreen: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.orderId as string;

  const [order, setOrder] = useState<OrderResponseAdmin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!orderId) return;
      try {
        setLoading(true);
        const data = await adminOrderService.getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        setError("Không thể tải thông tin đơn hàng");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetail();
  }, [orderId]);

  const handleCancelOrder = async (reason: string) => {
    await adminOrderService.cancelOrder(orderId, { reason });
    const updatedOrder = await adminOrderService.getOrderById(orderId);
    setOrder(updatedOrder);
  };

  const handleUpdateStatus = async (newStatus: string, note?: string) => {
    await adminOrderService.updateOrderStatus(orderId, {
      status: newStatus,
      note,
    });
    const updatedOrder = await adminOrderService.getOrderById(orderId);
    setOrder(updatedOrder);
  };

  if (loading)
    return <SectionLoading message="Đang nạp dữ liệu giao dịch..." />;
  if (error || !order)
    return (
      <EmptyProductState
        message="Mã đơn hàng không tồn tại hoặc đã bị xóa"
        onReset={() => router.back()}
      />
    );

  const shippingAddress = `${order.shippingAddress.recipientName}\n${order.shippingAddress.phoneNumber}\n${order.shippingAddress.addressLine1}${
    order.shippingAddress.addressLine2
      ? `\n${order.shippingAddress.addressLine2}`
      : ""
  }\n${order.shippingAddress.city}, ${order.shippingAddress.province}`;

  const isOverdue =
    order.status === "PENDING" &&
    (new Date().getTime() - new Date(order.createdAt).getTime()) /
      (1000 * 60 * 60) >
      24;
  const isHighValue = order.pricing.grandTotal > 10000000;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 animate-in fade-in duration-700">
      {/* Header Profile */}
      <OrderDetailHeader
        orderId={order.orderId}
        orderNumber={order.orderNumber || order.orderId.substring(0, 8)}
        status={order.status}
        createdAt={order.createdAt as string}
        onCancelOrder={handleCancelOrder}
        onUpdateStatus={handleUpdateStatus}
      />

      <main className="mx-auto px-4 sm:px-8 pt-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-[11px] font-bold uppercase   text-gray-400 hover:text-orange-500 transition-all"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Quay lại Protocol
          </button>

          <div className="flex flex-wrap gap-3">
            {isOverdue && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 shadow-sm animate-bounce">
                <AlertCircle size={16} strokeWidth={2.5} />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Xử lý chậm (Over 24h)
                </span>
              </div>
            )}
            {isHighValue && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-orange-50 border border-orange-100 text-orange-600 shadow-sm">
                <ShieldAlert size={16} strokeWidth={2.5} />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Giao dịch giá trị cao
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          <div className="xl:col-span-8 space-y-8 animate-in slide-in-from-bottom-4 duration-700">
            <ProductListCard items={order.items || []} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FinancialInfoCard
                subtotal={order.pricing.subtotal || 0}
                discount={order.pricing.totalDiscount || 0}
                shippingFee={order.pricing.shippingFee || 0}
                total={order.pricing.grandTotal || 0}
              />
             
              <PaymentInfoCard
                paymentMethod={order.paymentMethod || "N/A"}
                paymentIntentId={order.paymentIntentId}
                isPaid={order.status === "COMPLETED"}
              />
            </div>

            {order.customerNote && (
              <div className="bg-orange-50/30 rounded-4xl border border-orange-100/50">
                <CustomerNoteCard note={order.customerNote} />
              </div>
            )}
          </div>

          <div className="xl:col-span-4 space-y-8 sticky top-8 animate-in slide-in-from-right-4 duration-700 delay-200">
            <QuickActionsCard
              customerName={order.shippingAddress.recipientName || "N/A"}
              customerPhone={order.shippingAddress.phoneNumber || "N/A"}
              customerEmail={order.shippingAddress.email || "N/A"}
              shippingAddress={shippingAddress}
              shopId={order.shopInfo?.shopId}
              shopName={order.shopInfo?.shopName}
            />

            {/* Identification Blocks */}
            <div className="space-y-6 px-2">
              <div className="relative group">
                <BuyerInfoCard
                  name={order.shippingAddress.recipientName || "N/A"}
                  email={order.shippingAddress.email || "N/A"}
                  phone={order.shippingAddress.phoneNumber || "N/A"}
                />
              </div>

              <ShippingInfoCard
                carrier={order.shipment.carrier || "Standard Carrier"}
                trackingNumber={
                  order.shipment.trackingNumber || "Standard Tracking"
                }
                shippingAddress={shippingAddress}
              />

              {order.shopInfo && (
                <SellerInfoCard
                  shopName={order.shopInfo.shopName}
                  shopAddress="Merchant Hub Central • HCM City District 5"
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
