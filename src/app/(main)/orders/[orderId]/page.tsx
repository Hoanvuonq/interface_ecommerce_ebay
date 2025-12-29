"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Home,
  ShoppingCart,
  Loader2,
  AlertCircle,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { useOrderDetail } from "@/hooks/useOrders";
import { OrderDetailView } from "@/app/(main)/orders/_components/OrderDetailView";
import PageContentTransition from "@/features/PageContentTransition";
import { CustomBreadcrumb, SectionLoading } from "@/components";

export default function OrderDetailPage() {
  const params = useParams() as { orderId: string };
  const { order, loading, error } = useOrderDetail(params.orderId);

  React.useEffect(() => {}, [params.orderId, loading, order, error]);

  if (loading) {
    return <SectionLoading message="Đang tải đơn hàng..." />;
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#f8f9fa]">
        <PageContentTransition>
          <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Không tìm thấy đơn hàng
            </h1>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              {error ||
                "Đơn hàng không tồn tại hoặc bạn không có quyền xem. Vui lòng kiểm tra lại mã đơn hàng."}
            </p>

            <div className="flex gap-4">
              <Link href="/orders">
                <button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2">
                  <ArrowLeft size={18} />
                  Về danh sách đơn hàng
                </button>
              </Link>
              <Link href="/cart">
                <button className="px-6 py-3 bg-orange-600 text-white font-medium rounded-xl hover:bg-orange-700 transition-colors shadow-sm flex items-center gap-2">
                  <ShoppingCart size={18} />
                  Về giỏ hàng
                </button>
              </Link>
            </div>
          </div>
        </PageContentTransition>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <PageContentTransition>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CustomBreadcrumb
            items={[
              { title: "Trang chủ", href: "/" },
              { title: "Sản phẩm", href: "" },
              { title: `#${order.orderNumber}`, href: "" },
            ]}
          />

          <OrderDetailView order={order} />
        </div>
      </PageContentTransition>
    </div>
  );
}
