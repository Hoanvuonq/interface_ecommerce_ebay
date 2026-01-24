/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { OrderResponseAdmin } from "@/api/_types/adminOrder.types";
import {
  StatusTabItem,
  StatusTabs,
} from "@/app/(shop)/shop/_components/Products/StatusTabs";
import {
  CheckCircle,
  ClipboardList,
  Clock,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { OrderFilters, OrderTable } from "../../_components";
import { adminOrderService } from "../../_services/adminOrder.service";

export const OrderListFeature: React.FC = () => {
  const [orders, setOrders] = useState<OrderResponseAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(""); 
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  const statusTabs: StatusTabItem<string>[] = useMemo(
    () => [
      { label: "Tất cả", key: "", icon: ClipboardList },
      { label: "Chờ xử lý", key: "PENDING", icon: Clock },
      { label: "Đang giao", key: "SHIPPING", icon: Truck },
      { label: "Hoàn thành", key: "COMPLETED", icon: CheckCircle },
      { label: "Đã hủy", key: "CANCELLED", icon: XCircle },
    ],
    [],
  );

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await adminOrderService.getAllOrders({
        page,
        size: pageSize,
        status: status || undefined,
      });

      if (data && data.content) {
        setOrders(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, status]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 0) {
        setPage(0);
      } else {
        fetchOrders();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-10 animate-in fade-in duration-700 bg-gray-50 dark:bg-[#0a0e14]">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-orange-500 rounded-[1.2rem] shadow-xl shadow-orange-200">
              <ShoppingBag size={28} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 uppercase tracking-tighter italic leading-none">
                Quản Lý <span className="text-orange-500">Đơn Hàng</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2 ml-1">
                Commerce Management Protocol v4.0
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Tabs Section - Đã thay thế phần nút bấm cũ */}
      <div className="space-y-4">
        <StatusTabs
          tabs={statusTabs}
          current={status}
          onChange={(key) => {
            setStatus(key);
            setPage(0); // Reset về trang đầu khi đổi tab
          }}
        />
      </div>

      {/* Table Section */}
      <div className="mt-6 bg-white dark:bg-[#1c2127] rounded-[2.5rem] border border-gray-100 dark:border-[#3b4754] shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="p-2">
          <OrderFilters search={search} onSearchChange={setSearch} />
        </div>

        <OrderTable
          orders={orders}
          loading={loading}
          page={page}
          size={pageSize}
          totalElements={totalElements}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </div>
    </div>
  );
};
