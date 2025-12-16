/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "@/utils/axios.customize";
import type { ApiResponse } from "@/api/_types/api.types";
import { BaseRequest ,ConversationType } from "@/types/chat/dto";
// ==================== API ENDPOINTS ====================

const API_ENDPOINT_CUSTOMER_SUPPORT = "v1/chat/customer-support";

// ==================== REQUEST INTERFACES ====================

export interface GetCustomerSupportConversationsRequest extends BaseRequest {
  status?: "ACTIVE" | "WAITING_FOR_STAFF" | "ARCHIVED" | "BLOCKED" | "DELETED" | "SUSPENDED";
  type?: ConversationType;
}

export interface GetCustomerSupportQueueRequest extends BaseRequest {
  type?: ConversationType;
}

export interface SearchCustomerSupportRequest extends BaseRequest {
  keyword: string;
  type?: ConversationType;
}

export interface GetCustomerSupportStatsRequest {
  startDate?: string;
  endDate?: string;
}

// ==================== RESPONSE INTERFACES ====================

export interface CustomerSupportStatsResponse {
  totalActive: number;
  totalArchived: number;
  totalClosed: number;
  totalCustomerSupport: number;
  totalBuyerToPlat: number;
  totalShopToPlat: number;
  averageResponseTime: number;
  averageResolutionTime: number;
  totalMessagesToday: number;
  totalMessagesThisWeek: number;
  totalMessagesThisMonth: number;
}

// ==================== CUSTOMER SUPPORT SERVICES ====================

/**
 * Lấy tất cả customer support conversations
 * Dành cho Staff/Admin xem toàn bộ yêu cầu hỗ trợ
 */
export async function getCustomerSupportConversations(
  params: GetCustomerSupportConversationsRequest = {}
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_CUSTOMER_SUPPORT}/conversations`,
    method: "GET",
    params,
  });
}

/**
 * Lấy customer support queue (conversations ACTIVE)
 * Hiển thị danh sách conversations đang chờ xử lý
 */
export async function getCustomerSupportQueue(
  params: GetCustomerSupportQueueRequest = {}
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_CUSTOMER_SUPPORT}/queue`,
    method: "GET",
    params,
  });
}

/**
 * Đếm số conversations đang chờ xử lý (WAITING_FOR_STAFF)
 * Hiển thị badge số lượng trên UI
 */
export async function getCustomerSupportQueueCount(): Promise<
  ApiResponse<number>
> {
  return request<ApiResponse<number>>({
    url: `/${API_ENDPOINT_CUSTOMER_SUPPORT}/queue/count`,
    method: "GET",
  });
}

/**
 * Đếm số conversations đang xử lý (ACTIVE)
 * Hiển thị badge số lượng trên UI
 */
export async function getCustomerSupportActiveCount(): Promise<
  ApiResponse<number>
> {
  return request<ApiResponse<number>>({
    url: `/${API_ENDPOINT_CUSTOMER_SUPPORT}/queue/active/count`,
    method: "GET",
  });
}

/**
 * Xem chi tiết conversation
 * Staff/Admin xem thông tin đầy đủ của conversation
 */
export async function getCustomerSupportConversationById(
  conversationId: string
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_CUSTOMER_SUPPORT}/conversations/${conversationId}`,
    method: "GET",
  });
}

/**
 * Xem messages của conversation
 * Lấy lịch sử chat giữa khách hàng và staff
 */
export async function getCustomerSupportMessages(
  conversationId: string,
  params: BaseRequest = {}
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_CUSTOMER_SUPPORT}/conversations/${conversationId}/messages`,
    method: "GET",
    params,
  });
}

/**
 * Tìm kiếm customer support conversations
 * Tìm theo keyword trong nội dung tin nhắn hoặc thông tin user
 */
export async function searchCustomerSupport(
  params: SearchCustomerSupportRequest
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_CUSTOMER_SUPPORT}/search`,
    method: "GET",
    params,
  });
}

/**
 * Lấy thống kê customer support
 * Dashboard overview cho Staff/Admin
 */
export async function getCustomerSupportStats(
  params: GetCustomerSupportStatsRequest = {}
): Promise<ApiResponse<CustomerSupportStatsResponse>> {
  return request<ApiResponse<CustomerSupportStatsResponse>>({
    url: `/${API_ENDPOINT_CUSTOMER_SUPPORT}/stats`,
    method: "GET",
    params,
  });
}

/**
 * Staff accept customer support conversation
 * Chuyển trạng thái từ WAITING_FOR_STAFF sang ACTIVE và thêm staff làm participant
 */
export async function acceptSupportConversation(
  conversationId: string
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_CUSTOMER_SUPPORT}/conversations/${conversationId}/accept`,
    method: "POST",
  });
}

/**
 * Staff reply message trong customer support conversation
 * Tự động join staff làm participant nếu chưa có
 */
export async function staffReply(
  conversationId: string,
  data: {
    type: string;
    content: string;
    replyToMessageId?: string;
    attachments?: any[];
    clientMessageId?: string;
    metadata?: string;
  }
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_CUSTOMER_SUPPORT}/conversations/${conversationId}/reply`,
    method: "POST",
    data,
  });
}

/**
 * Staff assign conversation cho staff khác
 */
export async function assignSupportConversation(
  conversationId: string,
  staffUserId: string
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_CUSTOMER_SUPPORT}/conversations/${conversationId}/assign`,
    method: "POST",
    params: { staffUserId },
  });
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Kiểm tra xem conversation có phải customer support không
 */
export function isCustomerSupportConversation(
  conversationType: ConversationType
): boolean {
  return (
    conversationType === ConversationType.BUYER_TO_PLATFORM ||
    conversationType === ConversationType.SHOP_TO_PLATFORM
  );
}

/**
 * Format response time (seconds) thành human-readable
 */
export function formatResponseTime(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)} giây`;
  } else if (seconds < 3600) {
    return `${Math.round(seconds / 60)} phút`;
  } else if (seconds < 86400) {
    return `${Math.round(seconds / 3600)} giờ`;
  } else {
    return `${Math.round(seconds / 86400)} ngày`;
  }
}

/**
 * Lấy màu sắc theo status
 */
export function getStatusColor(
  status: "ACTIVE" | "WAITING_FOR_STAFF" | "ARCHIVED" | "BLOCKED" | "DELETED" | "SUSPENDED"
): string {
  switch (status) {
    case "ACTIVE":
      return "green";
    case "WAITING_FOR_STAFF":
      return "orange";
    case "ARCHIVED":
      return "blue";
    case "BLOCKED":
      return "red";
    case "DELETED":
      return "gray";
    case "SUSPENDED":
      return "purple";
    default:
      return "blue";
  }
}

/**
 * Lấy icon theo conversation type
 */
export function getConversationTypeIcon(type: ConversationType): string {
  switch (type) {
    case ConversationType.BUYER_TO_PLATFORM:
      return "👤"; // Buyer
    case ConversationType.SHOP_TO_PLATFORM:
      return "🏪"; // Shop
    default:
      return "💬";
  }
}

