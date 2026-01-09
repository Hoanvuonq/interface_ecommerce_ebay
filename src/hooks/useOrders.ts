import { useInfiniteQuery, useQuery,keepPreviousData } from "@tanstack/react-query";
import { orderService } from "@/services/orders/order.service";
import type { OrderResponse } from "@/types/orders/order.types";
import _ from "lodash";
export const useOrders = () => {
  return useQuery({
    queryKey: ["orders", "buyer"],
    queryFn: async () => {
      const response = await orderService.getBuyerOrders();
      const orders =
        _.get(response, "data.content") ||
        _.get(response, "content") ||
        (Array.isArray(response) ? response : []);
      return orders as OrderResponse[];
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useOrderDetail = (orderId: string) => {
  return useQuery({
    queryKey: ["orders", orderId],
    queryFn: () => orderService.getOrderById(orderId),
    enabled: !!orderId,
    retry: 1,
  });
};

export const useInfiniteOrders = (status: string, search: string) => {
  return useInfiniteQuery({
    // CỰC KỲ QUAN TRỌNG: queryKey phải chứa status và search
    queryKey: ["orders", "infinite", status, search], 
    queryFn: async ({ pageParam = 0 }) => {
      const response = await orderService.getBuyerOrders(
        pageParam as number, 
        10, 
        status === "ALL" ? undefined : status, 
        search
      );
      return response;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      // Dừng lại nếu hasNext = false (Ví dụ trang 8/8)
      return lastPage.hasNext ? lastPage.nextPage : undefined;
    },
    // Fix lỗi nháy: Giữ dữ liệu cũ trong lúc fetch dữ liệu mới
    placeholderData: (previousData) => previousData, 
    staleTime: 0, // Force lấy mới khi đổi tab
    gcTime: 0,    // Xóa cache cũ ngay lập tức để tránh trắng màn hình
  });
};