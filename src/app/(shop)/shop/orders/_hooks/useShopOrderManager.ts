"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  OrderStatus,
  ShopOrderResponse,
} from "@/app/(main)/shop/_types/dto/shop.order.dto";
import {
  useGetShopOrders,
  useGetShopOrderStatistics,
  useUpdateShopOrderStatus,
  useGetShopOrderById,
} from "../../vouchers/_hooks/useShopOrder";
import {
  TAB_KEYS,
  TAB_STATUS_MAP,
  OrderStatistics,
} from "../_constants/tabsRender";
import { useToast } from "@/hooks/useToast";
import { Dayjs } from "dayjs";

export const useShopOrderManager = () => {
  const { success: toastSuccess, error: toastError } = useToast();

  // State
  const [orders, setOrders] = useState<ShopOrderResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true); // For skeleton on first load only
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [statistics, setStatistics] = useState<OrderStatistics>({
    total: 0,
    awaitingPayment: 0,
    pendingConfirm: 0,
    readyToShip: 0,
    shipping: 0,
    delivered: 0,
    returnsRefunds: 0,
  });

  // Filter States
  const [activeTab, setActiveTab] = useState<string>(TAB_KEYS.ALL);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    null,
    null,
  ]);
  const [carrierFilter, setCarrierFilter] = useState<string | undefined>();
  const [processingFilter, setProcessingFilter] = useState<string>("ALL");
  const [orderTypeFilter, setOrderTypeFilter] = useState<string>("ALL");
  const [sortOption, setSortOption] = useState<string>("DEADLINE_ASC");
  const [searchText, setSearchText] = useState<string>("");

  const { handleGetShopOrders } = useGetShopOrders();
  const { handleGetShopOrderStatistics } = useGetShopOrderStatistics();
  const { handleUpdateShopOrderStatus } = useUpdateShopOrderStatus();
  const { handleGetShopOrderById } = useGetShopOrderById();

  // Dùng string cho Date để so sánh giá trị thay vì tham chiếu mảng
  const fromDateStr = dateRange[0]?.toISOString();
  const toDateStr = dateRange[1]?.toISOString();

  // 1. Fetch Stats - NOT in useCallback to avoid circular deps
  const fetchStats = async () => {
    const res = await handleGetShopOrderStatistics("week");
    if (res?.success && res.data) {
      const ordersByStatus = res.data.ordersByStatus || {};
      const toCount = (s: OrderStatus) => Number(ordersByStatus[s] ?? 0);
      setStatistics({
        total: res.data.totalOrders ?? 0,
        awaitingPayment: toCount(OrderStatus.AWAITING_PAYMENT),
        pendingConfirm:
          toCount(OrderStatus.CREATED) + toCount(OrderStatus.PAID),
        readyToShip:
          toCount(OrderStatus.FULFILLING) +
          toCount(OrderStatus.READY_FOR_PICKUP),
        shipping:
          toCount(OrderStatus.SHIPPED) + toCount(OrderStatus.OUT_FOR_DELIVERY),
        delivered: toCount(OrderStatus.DELIVERED),
        returnsRefunds:
          toCount(OrderStatus.CANCELLED) +
          toCount(OrderStatus.REFUNDING) +
          toCount(OrderStatus.REFUNDED),
      });
    }
  };

  // 2. Fetch Data chính - NOT in useCallback to avoid circular deps
  const refreshData = async (page = 1, size = 10) => {
    setLoading(true);
    const statuses =
      activeTab === TAB_KEYS.ALL ? undefined : TAB_STATUS_MAP[activeTab]?.join(',');

    const res = await handleGetShopOrders({
      status: statuses,
      fromDate: fromDateStr,
      toDate: toDateStr,
      page: page - 1,
      size,
    });

    if (res?.success && res.data) {
      setOrders(res.data.content || []);
      setPagination((prev) => ({
        ...prev,
        current: page,
        total: res.data.totalElements || 0,
      }));
    }
    setLoading(false);
    setIsInitialLoading(false); // Only show skeleton on initial load
  };

  // EFFECT 1: Fetch stats on mount & when date range changes
  useEffect(() => {
    fetchStats();
  }, [fromDateStr, toDateStr]);

  // EFFECT 2: Fetch orders on mount & when activeTab changes
  useEffect(() => {
    refreshData(1, pagination.pageSize); // Reset to page 1 when tab changes
  }, [activeTab, pagination.pageSize]);

  // Handlers
  const handleQuickAction = async (
    orderId: string,
    status: OrderStatus,
    note: string
  ) => {
    const res = await handleUpdateShopOrderStatus(orderId, { status, note });
    if (res?.success) {
      toastSuccess("Cập nhật thành công");
      fetchStats();
      refreshData(pagination.current, pagination.pageSize);
    } else {
      toastError(res?.message || "Thất bại");
    }
  };

  return {
    state: {
      orders,
      loading,
      isInitialLoading, // Add this
      pagination,
      statistics,
      activeTab,
      dateRange,
      searchText,
      carrierFilter,
      processingFilter,
      orderTypeFilter,
      sortOption,
    },
    actions: {
      setActiveTab,
      setDateRange,
      setSearchText,
      setCarrierFilter,
      setProcessingFilter,
      setOrderTypeFilter,
      setSortOption,
      refreshData,
      handleQuickAction,
      handleGetShopOrderById,
    },
  };
};
