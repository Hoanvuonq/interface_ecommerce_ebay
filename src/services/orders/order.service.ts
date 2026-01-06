import { request } from "@/utils/axios.customize";
import { getUserId } from "@/utils/jwt";
import type {
  OrderCreateRequest,
  OrderResponse,
  BuyerAddress,
} from "@/types/orders/order.types";
import type { OrderCreationResponse } from "@/types/orders/order-creation.types";
import type { ApiResponse } from "@/api/_types/api.types";

const ORDER_API_BASE = "/v1/admin/orders";
const BUYER_API_BASE = "/v1/buyer/orders";

const generateIdempotencyKey = () => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    try {
      return crypto.randomUUID();
    } catch (e) {
      // Fallback below
    }
  }

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

class OrderService {
  /**
   * Tạo order từ cart
   * Returns OrderCreationResponse with list of orders and optional payment info
   */
  async createOrder(
    orderRequest: OrderCreateRequest
  ): Promise<OrderCreationResponse> {
    console.log("🔍 Creating order with request:", orderRequest);
    const response: ApiResponse<OrderCreationResponse> = await request({
      url: BUYER_API_BASE,
      method: "POST",
      data: orderRequest,
      headers: {
        "Idempotency-Key": generateIdempotencyKey(),
      },
    });
    return response.data;
  }

  /**
   * Lấy order by ID
   */
  async getOrderById(orderId: string): Promise<OrderResponse> {
    const response: ApiResponse<OrderResponse> = await request({
      url: `${BUYER_API_BASE}/${orderId}`,
      method: "GET",
    });
    return response.data;
  }

  /**
   * Lấy danh sách orders của buyer hiện tại
   */
  async getBuyerOrders(): Promise<OrderResponse[]> {
    const response: ApiResponse<OrderResponse[]> = await request({
      url: BUYER_API_BASE,
      method: "GET",
    });
    return response.data;
  }

  /**
   * Lấy danh sách orders của buyer với shop cụ thể
   */
  async getBuyerOrdersByShop(
    shopId: string,
    page = 0,
    size = 20
  ): Promise<{ content: OrderResponse[]; totalPages: number }> {
    const response: ApiResponse<{
      content: OrderResponse[];
      totalPages: number;
      totalElements: number;
    }> = await request({
      url: `${BUYER_API_BASE}/shop/${shopId}`,
      method: "GET",
      params: { page, size },
    });
    return {
      content: response.data?.content || [],
      totalPages: response.data?.totalPages || 0,
    };
  }

  /**
   * Lấy danh sách địa chỉ đã lưu
   */
  async getSavedAddresses(): Promise<BuyerAddress[]> {
    const buyerId = getUserId();
    if (!buyerId) {
      console.error("No buyerId found");
      return [];
    }

    const response: ApiResponse<BuyerAddress[]> = await request({
      url: `${BUYER_API_BASE}/${buyerId}/address`,
      method: "GET",
    });
    return response.data;
  }

  /**
   * Lấy địa chỉ mặc định
   */
  async getDefaultAddress(): Promise<BuyerAddress | null> {
    try {
      const addresses = await this.getSavedAddresses();
      return addresses.find((addr) => addr.isDefault) || addresses[0] || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Hủy order
   */
  async cancelOrder(orderId: string, reason: string): Promise<void> {
    // Check lý do trước khi gửi
    if (!reason || reason.trim().length < 5) {
      throw new Error("Lý do hủy quá ngắn hoặc trống");
    }

    try {
      await request({
        url: `${BUYER_API_BASE}/${orderId}/cancel`,
        method: "PUT",
        data: { reason: reason.trim() },
      });
    } catch (error: any) {
      console.error("❌ Backend error message:", error?.response?.data);
      throw error;
    }
  }

  /**
   * Tạo địa chỉ mới
   */
  async createAddress(address: Partial<BuyerAddress>): Promise<BuyerAddress> {
    const buyerId = getUserId();
    if (!buyerId) {
      throw new Error("User not authenticated");
    }

    const response: ApiResponse<BuyerAddress> = await request({
      url: `${BUYER_API_BASE}/${buyerId}/address`,
      method: "POST",
      data: address,
    });
    return response.data;
  }
}

export const orderService = new OrderService();
