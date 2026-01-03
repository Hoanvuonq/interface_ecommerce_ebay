/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CreateTemplateRequest,
  UpdateTemplateRequest,
  GetTemplatesRequest,
  UpdateShopChatSettingsRequest,
} from "@/app/(chat)/_types/chat.dto";
import { request } from "@/utils/axios.customize";
import type { ApiResponse } from "@/api/_types/api.types";

// ==================== API ENDPOINTS ====================

const API_ENDPOINT_CHAT = "v1/chat";
const API_ENDPOINT_TEMPLATES = `${API_ENDPOINT_CHAT}/shop/templates`;

// ==================== SHOP SERVICES ====================

/**
 * Lấy cài đặt chat của shop
 */
export async function getShopSettings(): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_CHAT}/shop/settings`,
    method: "GET",
  });
}

/**
 * Cập nhật cài đặt chat
 */
export async function updateShopSettings(
  data: UpdateShopChatSettingsRequest
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_CHAT}/shop/settings`,
    method: "PUT",
    data,
  });
}

// ==================== TEMPLATE SERVICES ====================

/**
 * Tạo template trả lời nhanh
 */
export async function createTemplate(
  data: CreateTemplateRequest
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_TEMPLATES}`,
    method: "POST",
    data,
  });
}

/**
 * Lấy danh sách templates
 */
export async function getTemplates(
  params: GetTemplatesRequest = {}
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_TEMPLATES}`,
    method: "GET",
    params,
  });
}

/**
 * Cập nhật template
 */
export async function updateTemplate(
  templateId: string,
  data: UpdateTemplateRequest
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_TEMPLATES}/${templateId}`,
    method: "PUT",
    data,
  });
}

/**
 * Xóa template
 */
export async function deleteTemplate(
  templateId: string
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_TEMPLATES}/${templateId}`,
    method: "DELETE",
  });
}

/**
 * Tìm kiếm templates
 */
export async function searchTemplates(
  keyword: string
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_TEMPLATES}/search`,
    method: "GET",
    params: { keyword },
  });
}

/**
 * Lấy templates theo category
 */
export async function getTemplatesByCategory(
  category: string
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_TEMPLATES}/category/${category}`,
    method: "GET",
  });
}
