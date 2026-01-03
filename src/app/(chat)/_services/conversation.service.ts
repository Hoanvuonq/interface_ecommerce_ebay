/* eslint-disable @typescript-eslint/no-explicit-any */

import { CreateConversationRequest,
  UpdateConversationRequest,
  GetConversationsRequest,
  ShareContentRequest,
  AddParticipantRequest,
  FilterConversationsRequest,
  FilterConversationsCreatedByRequest, } from "@/app/(chat)/_types/chat.dto";
import { request } from "@/utils/axios.customize";
import { ApiResponse } from "@/api/_types/api.types";

// ==================== API ENDPOINTS ====================

const API_ENDPOINT_CHAT = "v1/chat";
const API_ENDPOINT_CONVERSATIONS = `${API_ENDPOINT_CHAT}/conversations`;

// ==================== CONVERSATION SERVICES ====================

/**
 * Tạo hoặc lấy conversation
 */
export async function createConversation(
  data: CreateConversationRequest
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_CONVERSATIONS}`,
    method: "POST",
    data,
  });
}

/**
 * Lấy danh sách conversations
 */
export async function getConversations(
  params: GetConversationsRequest = {}
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_CONVERSATIONS}`,
    method: "GET",
    params,
  });
}

/**
 * Lấy chi tiết conversation
 */
export async function getConversationById(
  conversationId: string
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_CONVERSATIONS}/${conversationId}`,
    method: "GET",
  });
}

/**
 * Cập nhật conversation
 */
export async function updateConversation(
  conversationId: string,
  data: UpdateConversationRequest
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_CONVERSATIONS}/${conversationId}`,
    method: "PUT",
    data,
  });
}

/**
 * Archive/Unarchive conversation
 */
export async function archiveConversation(
  conversationId: string,
  isArchived: boolean
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_CONVERSATIONS}/${conversationId}/archive`,
    method: "POST",
    params: { isArchived },
  });
}

/**
 * Mute/Unmute conversation
 */
export async function muteConversation(
  conversationId: string,
  isMuted: boolean
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_CONVERSATIONS}/${conversationId}/mute`,
    method: "POST",
    params: { isMuted },
  });
}

/**
 * Pin/Unpin conversation
 */
export async function pinConversation(
  conversationId: string,
  isPinned: boolean
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_CONVERSATIONS}/${conversationId}/pin`,
    method: "POST",
    params: { isPinned },
  });
}

/**
 * Đếm conversations chưa đọc
 */
export async function getUnreadCount(): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_CONVERSATIONS}/unread/count`,
    method: "GET",
  });
}

/**
 * Xóa conversation (soft delete)
 */
export async function deleteConversation(
  conversationId: string
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_CONVERSATIONS}/${conversationId}`,
    method: "DELETE",
  });
}

/**
 * Đếm tổng số tin nhắn chưa đọc trong tất cả conversations
 */
export async function countTotalUnreadMessages(): Promise<ApiResponse<number>> {
  return request<ApiResponse<number>>({
    url: `/${API_ENDPOINT_CONVERSATIONS}/unread/messages/count`,
    method: "GET",
  });
}

/**
 * Tìm kiếm conversations
 */
export async function searchConversations(
  keyword: string,
  params: Omit<GetConversationsRequest, "keyword"> = {}
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_CONVERSATIONS}/search`,
    method: "GET",
    params: { keyword, ...params },
  });
}

export async function filterConversations(params: FilterConversationsRequest): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_CONVERSATIONS}/filter`,
    method: "GET",
    params,
  }); 
}

export async function filterConversationsCreatedBy(params: FilterConversationsCreatedByRequest): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_CONVERSATIONS}/filter/createdBy`,
    method: "GET",
    params,
  }); 
}

/**
 * Share sản phẩm vào conversation
 */
export async function shareToConversation(
  conversationId: string,
  data: ShareContentRequest
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_CONVERSATIONS}/${conversationId}/share/product`,
    method: "POST",
    data,
  });
}

// ==================== PARTICIPANT SERVICES ====================

/**
 * Thêm thành viên vào nhóm
 */
export async function addParticipants(
  conversationId: string,
  data: AddParticipantRequest
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_CONVERSATIONS}/${conversationId}/participants`,
    method: "POST",
    data,
  });
}

/**
 * Xóa thành viên khỏi nhóm
 */
export async function removeParticipant(
  conversationId: string,
  userId: string
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_CONVERSATIONS}/${conversationId}/participants/${userId}`,
    method: "DELETE",
  });
}

/**
 * Rời khỏi nhóm
 */
export async function leaveConversation(
  conversationId: string
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_CONVERSATIONS}/${conversationId}/participants/leave`,
    method: "POST",
  });
}

/**
 * Promote thành admin
 */
export async function promoteParticipant(
  conversationId: string,
  userId: string
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_CONVERSATIONS}/${conversationId}/participants/${userId}/promote`,
    method: "POST",
  });
}

/**
 * Demote xuống member
 */
export async function demoteParticipant(
  conversationId: string,
  userId: string
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_CONVERSATIONS}/${conversationId}/participants/${userId}/demote`,
    method: "POST",
  });
}

/**
 * Lấy danh sách thành viên
 */
export async function getParticipants(
  conversationId: string
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_CONVERSATIONS}/${conversationId}/participants`,
    method: "GET",
  });
}

/**
 * Đặt nickname
 */
export async function updateNickname(
  conversationId: string,
  userId: string,
  nickname: string
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_CONVERSATIONS}/${conversationId}/participants/${userId}/nickname`,
    method: "PUT",
    params: { nickname },
  });
}

/**
 * Lấy tất cả conversations (Admin)
 */
export async function getAllConversations(
  params: GetConversationsRequest = {}
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_CHAT}/admin/conversations`,
    method: "GET",
    params,
  });
}
