import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/orders/order.service";
import type { OrderResponse } from "@/types/orders/order.types";
import _ from "lodash";

export const useOrders = () => {
  return useQuery({
    queryKey: ["orders", "buyer"],
    queryFn: async () => {
      const response = await orderService.getBuyerOrders();
      // Sử dụng lodash để extract dữ liệu an toàn từ nhiều cấu trúc response khác nhau
      const orders = _.get(response, "data.content") || 
                     _.get(response, "content") || 
                     (Array.isArray(response) ? response : []);
      return orders as OrderResponse[];
    },
    staleTime: 1000 * 60 * 5, // Cache dữ liệu trong 5 phút
  });
};

export const useOrderDetail = (orderId: string) => {
  return useQuery({
    queryKey: ["orders", orderId],
    queryFn: () => orderService.getOrderById(orderId),
    enabled: !!orderId, // Chỉ chạy khi có orderId
    retry: 1,
  });
};