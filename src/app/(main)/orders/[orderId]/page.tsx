"use client";

import { OrderDetailView } from "@/app/(main)/orders/_components/OrderDetailView";
import {
  CustomBreadcrumb,
  CustomEmptyState,
  SectionLoading,
} from "@/components";
import PageContentTransition from "@/features/PageContentTransition";
import { useOrderDetail } from "@/hooks/useOrders";
import { AlertCircle, ArrowLeft, LucideListOrdered } from "lucide-react";
import { useParams } from "next/navigation";

export default function OrderDetailPage() {
  const params = useParams() as { orderId: string };
  const {
    data: order,
    isLoading: loading,
    error,
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
      <PageContentTransition>
        <div className="max-w-4xl mx-auto px-4 py-20">
          <CustomEmptyState
            icon={LucideListOrdered}
            subIcon={AlertCircle}
            title="Không tìm thấy đơn hàng"
            description={
              error instanceof Error
                ? error.message
                : "Đơn hàng không tồn tại hoặc bạn không có quyền truy cập. Vui lòng kiểm tra lại mã đơn hàng."
            }
            buttonText="Danh sách đơn hàng"
            buttonIcon={ArrowLeft}
            link="/orders"
          />
        </div>
      </PageContentTransition>
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
              {
                title: `Chi tiết #${order.orderNumber || params.orderId}`,
                href: "",
              },
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
