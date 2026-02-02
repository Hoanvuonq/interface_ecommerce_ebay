"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ShoppingCart,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { useOrderDetail } from "@/hooks/useOrders";
import { OrderDetailView } from "@/app/(main)/orders/_components/OrderDetailView";
import PageContentTransition from "@/features/PageContentTransition";
import { CustomBreadcrumb, SectionLoading } from "@/components";

export default function OrderDetailPage() {
  const params = useParams() as { orderId: string };
  
  const { 
    data: order, 
    isLoading: loading, 
    error 
  } = useOrderDetail(params.orderId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SectionLoading message="Đang truy xuất thông tin đơn hàng..." />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen">
        <PageContentTransition>
          <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-red-50 rounded-3xl flex items-center justify-center mb-8 shadow-custom">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <h1 className="text-3xl font-semibold text-gray-900 uppercase tracking-tight mb-4">
              Không tìm thấy đơn hàng
            </h1>
            <p className="text-gray-500 max-w-md mx-auto mb-10 font-medium">
              {error instanceof Error ? error.message : "Đơn hàng không tồn tại hoặc bạn không có quyền truy cập. Vui lòng kiểm tra lại mã đơn hàng."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/orders">
                <button className="w-full sm:w-auto px-8 py-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center gap-2 uppercase text-xs tracking-widest">
                  <ArrowLeft size={18} />
                  Danh sách đơn hàng
                </button>
              </Link>
              <Link href="/products">
                <button className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white font-semibold rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-2 uppercase text-xs tracking-widest">
                  <ShoppingCart size={18} />
                  Tiếp tục mua sắm
                </button>
              </Link>
            </div>
          </div>
        </PageContentTransition>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageContentTransition>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <CustomBreadcrumb
              items={[
                { title: "Trang chủ", href: "/" },
                { title: "Đơn hàng của tôi", href: "/orders" },
                { title: `Chi tiết #${order.orderNumber || params.orderId}`, href: "" },
              ]}
            />

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <OrderDetailView order={order} />
          </div>
        </div>
      </PageContentTransition>
    </div>
  );
}