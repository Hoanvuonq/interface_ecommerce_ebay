/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  SendMessageRequest,
  UpdateMessageRequest,
  DeleteMessageRequest,
  ReactMessageRequest,
  MarkReadRequest,
  GetMessagesRequest,
  FilterRequest,
  ProductCardSendRequest,
  OrderCardSendRequest,
} from "@/types/chat/dto";
import { request } from "@/utils/axios.customize";
import type { ApiResponse } from "@/api/_types/api.types";

// ==================== API ENDPOINTS ====================

const API_ENDPOINT_CHAT = "v1/chat";
const API_ENDPOINT_MESSAGES = `${API_ENDPOINT_CHAT}/messages`;

// ==================== MESSAGE SERVICES ====================

/**
 * Gửi tin nhắn
 */
export async function sendMessage(
  data: SendMessageRequest
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_MESSAGES}`,
    method: "POST",
    data,
  });
}

/**
 * Lấy tin nhắn trong conversation
 */
export async function getMessages(
  conversationId: string, params: FilterRequest
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_MESSAGES}/conversation/${conversationId}`,
    method: "GET",
    params,
  });
}

/**
 * Xem chi tiết 1 message
 */
export async function getMessageById(
  messageId: string
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_MESSAGES}/${messageId}`,
    method: "GET",
  });
}

/**
 * Sửa tin nhắn
 */
export async function updateMessage(
  messageId: string,
  data: UpdateMessageRequest
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_MESSAGES}/${messageId}`,
    method: "PUT",
    data,
  });
}

/**
 * Xóa tin nhắn
 */
export async function deleteMessage(
  messageId: string,
  data: DeleteMessageRequest
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_MESSAGES}/${messageId}`,
    method: "DELETE",
    data,
  });
}

/**
 * React tin nhắn
 */
export async function reactMessage(
  messageId: string,
  data: ReactMessageRequest
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_MESSAGES}/${messageId}/react`,
    method: "POST",
    data,
  });
}

/**
 * Đánh dấu đã đọc
 */
export async function markAsRead(
  conversationId: string,
  data: MarkReadRequest
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_MESSAGES}/conversation/${conversationId}/read`,
    method: "POST",
    data,
  });
}

/**
 * Đánh dấu messages đã delivered
 */
export async function markAsDelivered(
  conversationId: string,
  messageIds: string[]
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_MESSAGES}/conversation/${conversationId}/delivered`,
    method: "POST",
    data: messageIds,
  });
}

/**
 * Tìm kiếm tin nhắn
 */
export async function searchMessages(
  conversationId: string,
  keyword: string,
  params: Omit<GetMessagesRequest, "conversationId" | "keyword"> = {}
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_MESSAGES}/conversation/${conversationId}/search`,
    method: "GET",
    params: { keyword, ...params },
  });
}

/**
 * Lấy tin nhắn media
 */
export async function getMediaMessages(
  conversationId: string,
  params: Omit<GetMessagesRequest, "conversationId"> = {}
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_MESSAGES}/conversation/${conversationId}/media`,
    method: "GET",
    params,
  });
}

/**
 * Lấy tin nhắn file
 */
export async function getFileMessages(
  conversationId: string,
  params: Omit<GetMessagesRequest, "conversationId"> = {}
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_MESSAGES}/conversation/${conversationId}/files`,
    method: "GET",
    params,
  });
}

/**
 * Lấy messages có chứa links
 */
export async function getLinkMessages(
  conversationId: string,
  params: Omit<GetMessagesRequest, "conversationId"> = {}
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_MESSAGES}/conversation/${conversationId}/links`,
    method: "GET",
    params,
  });
}

/**
 * Filter messages với nhiều điều kiện
 */
export async function findMessages(
  params: {
    conversationId?: string;
    senderId?: string;
    keyword?: string;
    types?: string[];
    statuses?: string[];
    beforeTimestamp?: string;
    page?: number;
    size?: number;
    sort?: string;
  }
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_MESSAGES}/filter`,
    method: "GET",
    params,
  });
}

/**
 * Lấy tất cả messages (Admin)
 */
export async function getAllMessages(
  params: GetMessagesRequest
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_CHAT}/admin/messages`,
    method: "GET",
    params,
  });
}

/**
 * Gửi product card
 */
export async function sendProductCard(
data: ProductCardSendRequest
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_MESSAGES}/product-card`,
    method: "POST",
    data,
  });
}

/**
 * Gửi order card
 */
export async function sendOrderCard(
data: OrderCardSendRequest
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_MESSAGES}/order-card`,
    method: "POST",
    data,
  });
}
