"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminOrderService } from "@/services/adminOrder.service";
import { OrderResponse } from "@/types/adminOrder.types";
import OrderDetailHeader from "../components/detail/OrderDetailHeader";
import ProductListCard from "../components/detail/ProductListCard";
import FinancialInfoCard from "../components/detail/FinancialInfoCard";
import PaymentInfoCard from "../components/detail/PaymentInfoCard";
import CustomerNoteCard from "../components/detail/CustomerNoteCard";
import BuyerInfoCard from "../components/detail/BuyerInfoCard";
import ShippingInfoCard from "../components/detail/ShippingInfoCard";
import SellerInfoCard from "../components/detail/SellerInfoCard";
import { QuickActionsCard } from "../_components";
import { ArrowLeft, AlertTriangle, Clock } from "lucide-react";

export const OrderDetailScreen: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const orderId = params?.orderId as string;

    const [order, setOrder] = useState<OrderResponse | null>(null);
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
                console.error("Failed to fetch order details:", err);
                setError("Không thể tải thông tin đơn hàng");
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetail();
    }, [orderId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error || "Không tìm thấy đơn hàng"}</p>
                    <button
                        onClick={() => router.back()}
                        className="text-blue-600 hover:text-blue-700"
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        );
    }

    // Build shipping address
    const shippingAddress = `${order.recipientName}\n${order.phoneNumber}\n${order.addressLine1}${order.addressLine2 ? `\n${order.addressLine2}` : ""
        }\n${order.city}, ${order.province}${order.postalCode ? `, ${order.postalCode}` : ""}`;

    // Handle cancel order
    const handleCancelOrder = async (reason: string) => {
        await adminOrderService.cancelOrder(orderId, { reason });
        // Refresh order data
        const updatedOrder = await adminOrderService.getOrderById(orderId);
        setOrder(updatedOrder);
    };

    // Handle update status
    const handleUpdateStatus = async (newStatus: string, note?: string) => {
        await adminOrderService.updateOrderStatus(orderId, {
            status: newStatus,
            note,
        });
        // Refresh order data
        const updatedOrder = await adminOrderService.getOrderById(orderId);
        setOrder(updatedOrder);
    };

    // Check for warnings
    const isOverdue = () => {
        const createdDate = new Date(order.createdAt);
        const now = new Date();
        const hoursDiff = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60);
        return hoursDiff > 24 && order.status === "PENDING";
    };

    const isHighValue = () => {
        return order.grandTotal > 10000000; // > 10M VND
    };

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Header */}
            <OrderDetailHeader
                orderId={order.orderId}
                orderNumber={order.orderNumber || order.orderId.substring(0, 8)}
                status={order.status}
                createdAt={order.createdAt}
                onCancelOrder={handleCancelOrder}
                onUpdateStatus={handleUpdateStatus}
            />

            {/* Back Button */}
            <div className="max-w-[1600px] mx-auto px-6 py-4">
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft size={16} />
                    <span>Quay lại danh sách</span>
                </button>
            </div>

            {/* Warning Badges */}
            {(isOverdue() || isHighValue()) && (
                <div className="max-w-[1600px] mx-auto px-6 pb-4">
                    <div className="flex gap-3">
                        {isOverdue() && (
                            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                                <Clock size={16} />
                                <span className="font-medium">⚠️ Đơn quá 24h chưa xử lý</span>
                            </div>
                        )}
                        {isHighValue() && (
                            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 text-sm">
                                <AlertTriangle size={16} />
                                <span className="font-medium">💰 Đơn hàng giá trị cao - Cần xác nhận</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="max-w-[1600px] mx-auto px-6 pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Products */}
                        <ProductListCard items={order.items || []} />

                        {/* Financial & Payment Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FinancialInfoCard
                                subtotal={order.subtotal}
                                discount={order.totalDiscount || 0}
                                shippingFee={order.shippingFee}
                                total={order.grandTotal}
                            />

                            <PaymentInfoCard
                                paymentMethod={order.paymentMethod}
                                paymentIntentId={order.paymentIntentId}
                                isPaid={order.status === "COMPLETED"}
                            />
                        </div>

                        {/* Customer Note */}
                        {order.customerNote && (
                            <CustomerNoteCard note={order.customerNote} />
                        )}
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions - ADMIN ONLY */}
                        <QuickActionsCard
                            customerName={order.recipientName}
                            customerPhone={order.phoneNumber}
                            customerEmail={order.email || "N/A"}
                            shippingAddress={shippingAddress}
                            shopId={order.shopInfo?.shopId}
                            shopName={order.shopInfo?.shopName}
                        />

                        {/* Buyer Info */}
                        <BuyerInfoCard
                            name={order.recipientName}
                            email={order.email || "N/A"}
                            phone={order.phoneNumber}
                        />

                        {/* Shipping Info */}
                        <ShippingInfoCard
                            carrier={order.carrier || "Giao Hàng Nhanh"}
                            trackingNumber={order.trackingNumber}
                            shippingAddress={shippingAddress}
                        />

                        {/* Seller Info */}
                        {order.shopInfo && (
                            <SellerInfoCard
                                shopName={order.shopInfo.shopName}
                                shopAddress="456 Đường Nguyễn Trãi, Phường 8, Quận 5, Thành phố Hồ Chí Minh"
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
