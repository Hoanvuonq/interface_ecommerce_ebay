/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useToast } from "@/hooks/useToast";
import {
  getConversations,
  createConversation,
  getConversationById,
  updateConversation,
  deleteConversation,
  archiveConversation,
  muteConversation,
  pinConversation,
  getUnreadCount,
  countTotalUnreadMessages,
  searchConversations,
  filterConversations,
  filterConversationsCreatedBy,
} from "../_services";
import {
  CreateConversationRequest,
  FilterConversationsCreatedByRequest,
  FilterConversationsRequest,
  GetConversationsRequest,
  UpdateConversationRequest,
} from "../_types/chat.dto";
import { Conversation } from "../_types/chat";
const { success: messageSuccess, error: messageError } = useToast();

export function useGetConversations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetConversations = async (
    payload: GetConversationsRequest
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getConversations(payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy danh sách cuộc trò chuyện thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetConversations, loading, error };
}

/**
 * Hook để tạo conversation mới
 */
export function useCreateConversation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateConversation = async (
    payload: CreateConversationRequest
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await createConversation(payload);
      if (res.success) {
        messageSuccess("Tạo cuộc trò chuyện thành công");
      }
      return res;
    } catch (err: any) {
      setError(err?.message || "Tạo cuộc trò chuyện thất bại");
      messageError(err?.message || "Tạo cuộc trò chuyện thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleCreateConversation, loading, error };
}

/**
 * Hook để lấy chi tiết conversation
 */
export function useGetConversationById() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetConversationById = async (
    conversationId: string
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getConversationById(conversationId);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy thông tin cuộc trò chuyện thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetConversationById, loading, error };
}

/**
 * Hook để cập nhật conversation
 */
export function useUpdateConversation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleUpdateConversation = async (
    id: string,
    payload: Partial<Conversation>
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateConversation(id, payload as UpdateConversationRequest);
      if (res.success) {
        messageSuccess("Cập nhật cuộc trò chuyện thành công");
      }
      return res;
    } catch (err: any) {
      setError(err?.message || "Cập nhật cuộc trò chuyện thất bại");
      messageError(err?.message || "Cập nhật cuộc trò chuyện thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdateConversation, loading, error };
}

/**
 * Hook để lưu trữ conversation
 */
export function useArchiveConversation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  const handleArchiveConversation = async (id: string): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await archiveConversation(id, true);
      if (res.success) {
        messageSuccess("Lưu trữ cuộc trò chuyện thành công");
      }
      return res;
    } catch (err: any) {
      setError(err?.message || "Lưu trữ cuộc trò chuyện thất bại");
      messageError(err?.message || "Lưu trữ cuộc trò chuyện thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleArchiveConversation, loading, error };
}

/**
 * Hook để tắt tiếng conversation
 */
export function useMuteConversation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  const handleMuteConversation = async (
    id: string,
    muted: boolean
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await muteConversation(id, muted);
      if (res.success) {
        messageSuccess(
          muted
            ? "Tắt tiếng cuộc trò chuyện thành công"
            : "Bật tiếng cuộc trò chuyện thành công"
        );
      }
      return res;
    } catch (err: any) {
      setError(err?.message || "Thao tác thất bại");
      messageError(err?.message || "Thao tác thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleMuteConversation, loading, error };
}

/**
 * Hook để ghim conversation
 */
export function usePinConversation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  const handlePinConversation = async (
    id: string,
    pinned: boolean
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await pinConversation(id, pinned);
      if (res.success) {
        messageSuccess(
          pinned
            ? "Ghim cuộc trò chuyện thành công"
            : "Bỏ ghim cuộc trò chuyện thành công"
        );
      }
      return res;
    } catch (err: any) {
      setError(err?.message || "Thao tác thất bại");
      messageError(err?.message || "Thao tác thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handlePinConversation, loading, error };
}

/**
 * Hook để lấy số tin nhắn chưa đọc
 */
export function useGetUnreadCount() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetUnreadCount = async (): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUnreadCount();
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy số tin nhắn chưa đọc thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetUnreadCount, loading, error };
}

/**
 * Hook để tìm kiếm conversations
 */
export function useSearchConversations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Tìm kiếm conversations
   * @param query Từ khóa tìm kiếm
   * @param params Bộ lọc bổ sung (ví dụ: conversationType)
   */
  const handleSearchConversations = async (
    query: string,
    params?: any
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await searchConversations(query, params || {});
      return res;
    } catch (err: any) {
      setError(err?.message || "Tìm kiếm cuộc trò chuyện thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleSearchConversations, loading, error };
}

/**
 * Hook để lọc conversations
 */
export function useFilterConversations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Lọc conversations theo bộ tiêu chí
   * @param params Bộ lọc (ví dụ: conversationType, status)
   */
  const handleFilterConversations = async (
    params: FilterConversationsRequest
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await filterConversations(params);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lọc cuộc trò chuyện thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleFilterConversations, loading, error };
}


/**
 * Hook để lọc conversations
 */
export function useFilterConversationsCreatedBy() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Lọc conversations theo bộ tiêu chí
   * @param params Bộ lọc (ví dụ: conversationType, status)
   */
  const handleFilterConversationsCreatedBy = async (
    params: FilterConversationsCreatedByRequest
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await filterConversationsCreatedBy(params);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lọc cuộc trò chuyện thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleFilterConversationsCreatedBy, loading, error };
}

/**
 * Hook để xóa conversation
 */
export function useDeleteConversation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteConversation = async (
    conversationId: string
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await deleteConversation(conversationId);
      if (res.success) {
        messageSuccess("Xóa cuộc trò chuyện thành công");
      }
      return res;
    } catch (err: any) {
      setError(err?.message || "Xóa cuộc trò chuyện thất bại");
      messageError(err?.message || "Xóa cuộc trò chuyện thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleDeleteConversation, loading, error };
}

/**
 * Hook để đếm tổng số tin nhắn chưa đọc trong tất cả conversations
 */
export function useCountTotalUnreadMessages() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCountTotalUnreadMessages = async (): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await countTotalUnreadMessages();
      return res;
    } catch (err: any) {
      setError(err?.message || "Đếm tin nhắn chưa đọc thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleCountTotalUnreadMessages, loading, error };
}
