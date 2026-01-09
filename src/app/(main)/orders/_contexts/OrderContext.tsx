"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import {
  useInfiniteQuery,
  useQuery,
  keepPreviousData,
} from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { orderService } from "@/services/orders/order.service";
import { OrderCountResponse } from "../_types/order";
import { debounce } from "lodash";

interface OrderContextType {
  state: {
    orders: any[];
    statusFilter: string;
    searchText: string;
    debouncedSearch: string;
    isLoading: boolean;
    isFetching: boolean;
    isFetchingNextPage: boolean;
    hasNextPage: boolean;
    isPlaceholderData: boolean;
    orderCounts: OrderCountResponse | undefined;
    scrollRef: (node?: Element | null) => void;
  };
  actions: {
    setStatusFilter: (status: string) => void;
    onSearchChange: (value: string) => void;
    handleRefresh: () => void;
  };
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const handleDebounceSearch = useCallback(
    debounce((value: string) => setDebouncedSearch(value), 500),
    []
  );

  const onSearchChange = (val: string) => {
    setSearchText(val);
    handleDebounceSearch(val);
  };

  const { data: orderCounts, refetch: refetchCounts } = useQuery({
    queryKey: ["order-counts"],
    queryFn: async () => {
      try {
        const resp = await orderService.getOrderCounts();
        return (
          resp?.data || {
            awaitingPayment: 0,
            processing: 0,
            shipping: 0,
            delivered: 0,
            completed: 0,
            returning: 0,
            cancelled: 0,
            total: 0,
          }
        );
      } catch (error) {
        console.error("Lỗi lấy số lượng đơn:", error);
        return null;
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isLoading,
    isPlaceholderData,
    refetch: refetchOrders,
  } = useInfiniteQuery({
    queryKey: ["orders-infinite", statusFilter, debouncedSearch],
    queryFn: async ({ pageParam = 0 }) => {
      const statusToSend = statusFilter === "ALL" ? undefined : statusFilter;
      return await orderService.getBuyerOrders(
        pageParam as number,
        10,
        statusToSend,
        debouncedSearch
      );
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextPage : undefined,
    placeholderData: keepPreviousData,
    staleTime: 0,
    gcTime: 0,
  });

  const orders = useMemo(
    () => data?.pages.flatMap((p) => p.content || []) || [],
    [data]
  );

  // Infinite scroll observer with debounce
  const { ref: scrollRef, inView } = useInView({
    threshold: 0.1,
    rootMargin: "300px",
  });

  const fetchNextPageDebounced = useCallback(
    debounce(() => fetchNextPage(), 200),
    [fetchNextPage]
  );

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && !isFetching) {
      fetchNextPageDebounced();
    }
    return () => fetchNextPageDebounced.cancel();
  }, [
    inView,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    fetchNextPageDebounced,
  ]);

  const handleRefresh = useCallback(() => {
    refetchOrders();
    refetchCounts();
  }, [refetchOrders, refetchCounts]);

  const value = useMemo(
    () => ({
      state: {
        orders,
        statusFilter,
        searchText,
        debouncedSearch,
        isLoading: isLoading && orders.length === 0,
        isFetching,
        isFetchingNextPage,
        hasNextPage: !!hasNextPage,
        isPlaceholderData,
        orderCounts,
        scrollRef,
      },
      actions: {
        setStatusFilter,
        onSearchChange,
        handleRefresh,
      },
    }),
    [
      orders,
      statusFilter,
      searchText,
      debouncedSearch,
      isLoading,
      isFetching,
      isFetchingNextPage,
      hasNextPage,
      isPlaceholderData,
      orderCounts,
      scrollRef,
      handleRefresh,
    ]
  );

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context)
    throw new Error("useOrderContext must be used within OrderProvider");
  return context;
};
