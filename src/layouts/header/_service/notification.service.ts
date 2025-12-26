import { request } from "@/utils/axios.customize";
import { ApiResponseDTO ,PageDTO} from "@/types/product/pagination.dto";
export type RecipientRole = "BUYER" | "SHOP" | "ADMIN" | "SYSTEM" | "EMPLOYEE";

export type NotificationReadStatus = "UNREAD" | "READ";
export type BroadcastAudience = "ALL_BUYERS" | "ALL_SHOPS" | "ALL_USERS";
export type NotificationType = "SYSTEM" | "ORDER" | "PRODUCT" | "PAYMENT" | "SHIPPING";
export type NotificationPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

export interface NotificationResponseDTO {
  id: string;
  recipientRole: RecipientRole; 
  title?: string;
  content?: string;
  type?: string;
  priority?: number;
  readStatus?: NotificationReadStatus;
  createdAt?: string;
  imageUrl?: string;
  redirectUrl?: string;
  metadata?: Record<string, any>;
}

export interface BroadcastNotificationRequest {
  targetAudience: BroadcastAudience;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  content?: string;
  category?: string;
  imageUrl?: string;
  redirectUrl?: string;
  metadata?: string;
}

export interface BroadcastHistoryRecord {
  id: string;
  createdAt: string;
  targetAudience: BroadcastAudience;
  recipientCount: number;
  type: string;
  priority: string;
  title: string;
  content?: string;
  imageUrl?: string;
  status?: string;
}

export interface BroadcastHistoryParams {
  page?: number;
  size?: number;
  targetAudience?: BroadcastAudience;
  type?: NotificationType;
  searchText?: string;
  startDate?: string;
  endDate?: string;
}

const API_BASE = "/v1/notifications";

export const notificationService = {
  // User notification APIs
  async list(params: {
    recipientRole?: RecipientRole;  // Primary filter for role-based inbox
    status?: NotificationReadStatus;
    page?: number;
    size?: number;
  }) {
    const res = await request<ApiResponseDTO<PageDTO<NotificationResponseDTO>>>({
      url: API_BASE,
      method: "GET",
      params,
    });
    return res.data!;
  },

  async countUnread() {
    const res = await request<ApiResponseDTO<number>>({
      url: `${API_BASE}/count-unread`,
      method: "GET",
    });
    return (res.data as unknown as number) ?? 0;
  },

  async markRead(id: string) {
    await request<ApiResponseDTO<void>>({
      url: `${API_BASE}/${id}/read`,
      method: "PATCH",
    });
  },

  async markAllRead() {
    const res = await request<ApiResponseDTO<number>>({
      url: `${API_BASE}/read-all`,
      method: "PATCH",
    });
    return (res.data as unknown as number) ?? 0;
  },

  async checkNew(since?: string) {
    const res = await request<ApiResponseDTO<boolean>>({
      url: `${API_BASE}/check-new`,
      method: "GET",
      params: since ? { since } : undefined,
    });
    return (res.data as unknown as boolean) ?? false;
  },

  // Admin broadcast APIs
  async sendBroadcast(data: BroadcastNotificationRequest) {
    const res = await request<ApiResponseDTO<number>>({
      url: `${API_BASE}/admin/broadcast`,
      method: "POST",
      data,
    });
    return res.data!; // Returns number of recipients
  },

  async getBroadcastHistory(params: BroadcastHistoryParams) {
    const res = await request<ApiResponseDTO<PageDTO<BroadcastHistoryRecord>>>({
      url: `${API_BASE}/admin/broadcast/history`,
      method: "GET",
      params,
    });
    return res.data!;
  },
};

export default notificationService;


