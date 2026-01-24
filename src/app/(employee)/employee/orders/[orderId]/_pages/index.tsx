"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminOrderService } from "../../_services/adminOrder.service";
import { OrderResponseAdmin } from "@/api/_types/adminOrder.types";
import {
  QuickActionsCard,
  SellerInfoCard,
  ShippingInfoCard,
  BuyerInfoCard,
  CustomerNoteCard,
  PaymentInfoCard,
  FinancialInfoCard,
  OrderDetailHeader,
  ProductListCard,
} from "../_components";
import { ArrowLeft, AlertCircle, ShieldAlert, Sparkles } from "lucide-react";
import { SectionLoading } from "@/components";
import { EmptyProductState } from "@/app/(main)/products/_components/EmptyProductState";
import { cn } from "@/utils/cn";

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

        {/* Master Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Main Transaction Details */}
          <div className="xl:col-span-8 space-y-8 animate-in slide-in-from-bottom-4 duration-700">
            {/* Items Card */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-white">
              <ProductListCard items={order.items || []} />
            </div>

            {/* Financial Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-[2.5rem] p-8 shadow-lg shadow-slate-200/40 border border-slate-50">
                <FinancialInfoCard
                  subtotal={order.pricing.subtotal || 0}
                  discount={order.pricing.totalDiscount || 0}
                  shippingFee={order.pricing.shippingFee || 0}
                  total={order.pricing.grandTotal || 0}
                />
              </div>
              <div className="bg-white rounded-[2.5rem] p-8 shadow-lg shadow-slate-200/40 border border-slate-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5">
                  <Sparkles size={100} />
                </div>
                <PaymentInfoCard
                  paymentMethod={order.paymentMethod || "N/A"}
                  paymentIntentId={order.paymentIntentId}
                  isPaid={order.status === "COMPLETED"}
                />
              </div>
            </div>

            {/* Note Card */}
            {order.customerNote && (
              <div className="bg-orange-50/30 rounded-4xl border border-orange-100/50">
                <CustomerNoteCard note={order.customerNote} />
              </div>
            )}
          </div>

          <div className="xl:col-span-4 space-y-8 sticky top-8 animate-in slide-in-from-right-4 duration-700 delay-200">
            <div className="p-1 rounded-[2.5rem] bg-linear-to-br from-orange-400 to-rose-500 shadow-2xl shadow-orange-200">
              <div className="bg-white rounded-[2.4rem] p-2">
                <QuickActionsCard
                  customerName={order.shippingAddress.recipientName || "N/A"}
                  customerPhone={order.shippingAddress.phoneNumber || "N/A"}
                  customerEmail={order.shippingAddress.email || "N/A"}
                  shippingAddress={shippingAddress}
                  shopId={order.shopInfo?.shopId}
                  shopName={order.shopInfo?.shopName}
                />
              </div>
            </div>

            {/* Identification Blocks */}
            <div className="space-y-6 px-2">
              <div className="relative group">
                <div className="absolute -inset-2 bg-linear-to-r from-blue-50 to-indigo-50 rounded-4xl opacity-0 group-hover:opacity-100 transition-opacity" />
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
