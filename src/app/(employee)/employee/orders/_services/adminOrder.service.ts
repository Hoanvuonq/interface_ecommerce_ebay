import axios from "@/utils/axios.customize";
import {
  OrderResponseAdmin,
  OrderStatusUpdateRequest,
  OrderCancelRequest,
} from "@/api/_types/adminOrder.types";
import { ApiResponse, PageableResponse } from "@/api/_types/api.types";

const BASE_URL = "/v1/admin/orders";

export const adminOrderService = {
  getAllOrders: async (params: {
    status?: string;
    shopId?: string;
    buyerId?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    size?: number;
  }) => {
    const response = await axios.get<
      ApiResponse<PageableResponse<OrderResponseAdmin>>
    >(BASE_URL, { params });

    return (response as unknown as ApiResponse<PageableResponse<OrderResponseAdmin>>)
      .data;
  },

  getOrderById: async (orderId: string) => {
    const response = await axios.get<ApiResponse<OrderResponseAdmin>>(
      `${BASE_URL}/${orderId}`,
    );
    return (response as unknown as ApiResponse<OrderResponseAdmin>).data;
  },

  updateOrderStatus: async (
    orderId: string,
    data: OrderStatusUpdateRequest,
  ) => {
    const response = await axios.put<ApiResponse<void>>(
      `${BASE_URL}/${orderId}/status`,
      data,
    );
    return (response as unknown as ApiResponse<void>).data;
  },

  cancelOrder: async (orderId: string, data: OrderCancelRequest) => {
    const response = await axios.put<ApiResponse<void>>(
      `${BASE_URL}/${orderId}/cancel`,
      data,
    );
    return (response as unknown as ApiResponse<void>).data;
  },
};
