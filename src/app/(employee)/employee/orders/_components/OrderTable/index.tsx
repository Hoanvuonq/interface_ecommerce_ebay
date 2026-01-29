"use client";

import React, { useMemo } from "react";
import { OrderResponseAdmin } from "@/api/_types/adminOrder.types";
import { DataTable } from "@/components";
import { EmptyProductState } from "@/app/(main)/products/_components/EmptyProductState";
import { getOrderColumns } from "./colum";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";

interface OrderTableProps {
  orders: OrderResponseAdmin[];
  loading: boolean;
  page: number;
  size: number;
  totalElements: number;
  onPageChange: (newPage: number) => void;
}

export const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  loading,
  page,
  size,
  totalElements,
  onPageChange,
}) => {
  const router = useRouter();
  const { success } = useToast(); 

  const handleView = (id: string) => router.push(`/employee/orders/${id}`);
  const handleEdit = (id: string) => router.push(`/employee/orders/${id}`);

  const columns = useMemo(
    () => getOrderColumns(handleView, handleEdit, success),
    [router, success],
  );

  if (!loading && orders.length === 0) {
    return (
      <EmptyProductState
        message="Không tìm thấy đơn hàng - Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác"
        isShop={true}
      />
    );
  }

  return (
    <div className="animate-in fade-in duration-700">
      <DataTable
        data={orders}
        columns={columns}
        loading={loading}
        page={page}
        size={size}
        totalElements={totalElements}
        onPageChange={onPageChange}
        rowKey="orderId"
        emptyMessage="Hiện tại chưa có đơn hàng nào"
      />
    </div>
  );
};
