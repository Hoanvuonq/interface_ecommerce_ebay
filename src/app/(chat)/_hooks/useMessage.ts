/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback } from "react";
import {
  sendMessage,
  getMessages,
  getMessageById,
  updateMessage,
  deleteMessage,
  reactMessage,
  markAsRead,
  markAsDelivered,
  searchMessages,
  getMediaMessages,
  getFileMessages,
  getLinkMessages,
  findMessages,
  sendProductCard,
  sendOrderCard,
} from "../_services";
import {
  FilterRequest,
  OrderCardSendRequest,
  ProductCardSendRequest,
  SendMessageRequest,
  FindMessagesRequest,
} from "../_types/chat.dto";
import { useToast } from "@/hooks/useToast";
const { success: messageSuccess, error: messageError } = useToast();

/**
 * Hook để lấy tin nhắn trong conversation
 */
export function useGetMessages() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetMessages = async (
    conversationId: string,
    params: FilterRequest
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMessages(conversationId, params);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy tin nhắn thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetMessages, loading, error };
}

/**
 * Hook để gửi tin nhắn
 */
export function useSendMessage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleSendMessage = async (
    payload: SendMessageRequest
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await sendMessage(payload);
      if (res.success) {
        messageSuccess("Gửi tin nhắn thành công");
      }
      return res;
    } catch (err: any) {
      setError(err?.message || "Gửi tin nhắn thất bại");
      messageError(err?.message || "Gửi tin nhắn thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleSendMessage, loading, error };
}

/**
 * Hook để cập nhật tin nhắn
 */
export function useUpdateMessage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleUpdateMessage = async (
    id: string,
    payload: { content: string }
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateMessage(id, payload);
      if (res.success) {
        messageSuccess("Sửa tin nhắn thành công");
      }
      return res;
    } catch (err: any) {
      setError(err?.message || "Sửa tin nhắn thất bại");
      messageError(err?.message || "Sửa tin nhắn thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdateMessage, loading, error };
}

/**
 * Hook để xóa tin nhắn
 */
export function useDeleteMessage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleDeleteMessage = async (
    id: string,
    payload: { deleteType: "DELETE_FOR_ME" | "DELETE_FOR_EVERYONE" }
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await deleteMessage(id, payload);
      if (res.success) {
        messageSuccess("Xóa tin nhắn thành công");
      }
      return res;
    } catch (err: any) {
      setError(err?.message || "Xóa tin nhắn thất bại");
      messageError(err?.message || "Xóa tin nhắn thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleDeleteMessage, loading, error };
}

/**
 * Hook để react tin nhắn
 */
export function useReactMessage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleReactMessage = async (
    id: string,
    payload: { emoji: string; action: "ADD" | "REMOVE" }
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await reactMessage(id, payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "React tin nhắn thất bại");
      messageError(err?.message || "React tin nhắn thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleReactMessage, loading, error };
}

/**
 * Hook để đánh dấu tin nhắn đã đọc
 */
export function useMarkAsRead() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMarkAsRead = async (
    conversationId: string,
    payload: { messageIds?: string[]; lastReadMessageId?: string }
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await markAsRead(conversationId, payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Đánh dấu đã đọc thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleMarkAsRead, loading, error };
}

/**
 * Hook để tìm kiếm tin nhắn
 */
export function useSearchMessages() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearchMessages = async (
    conversationId: string,
    query: string
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await searchMessages(conversationId, query);
      return res;
    } catch (err: any) {
      setError(err?.message || "Tìm kiếm tin nhắn thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleSearchMessages, loading, error };
}

/**
 * Hook để lấy tin nhắn media
 */
export function useGetMediaMessages() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetMediaMessages = async (
    conversationId: string
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMediaMessages(conversationId);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy tin nhắn media thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetMediaMessages, loading, error };
}

/**
 * Hook để lấy tin nhắn file
 */
export function useGetFileMessages() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetFileMessages = async (
    conversationId: string
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getFileMessages(conversationId);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy tin nhắn file thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetFileMessages, loading, error };
}

export function useSendProductCard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendProductCard = async (
    payload: ProductCardSendRequest
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await sendProductCard(payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Gửi product card thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleSendProductCard, loading, error };
}

export function useSendOrderCard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOrderCard = async (
    payload: OrderCardSendRequest
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await sendOrderCard(payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Gửi order card thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleSendOrderCard, loading, error };
}

/**
 * Hook để lấy chi tiết 1 message
 */
export function useGetMessageById() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetMessageById = async (messageId: string): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMessageById(messageId);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy chi tiết tin nhắn thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetMessageById, loading, error };
}

/**
 * Hook để đánh dấu messages đã delivered
 */
export function useMarkAsDelivered() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMarkAsDelivered = async (
    conversationId: string,
    messageIds: string[]
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await markAsDelivered(conversationId, messageIds);
      return res;
    } catch (err: any) {
      setError(err?.message || "Đánh dấu delivered thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleMarkAsDelivered, loading, error };
}

/**
 * Hook để lấy messages có chứa links
 */
export function useGetLinkMessages() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetLinkMessages = async (
    conversationId: string,
    params: FilterRequest = {}
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getLinkMessages(conversationId, params);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy tin nhắn links thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetLinkMessages, loading, error };
}

/**
 * Hook để filter messages với nhiều điều kiện
 */
export function useFindMessages() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFindMessages = async (
    params: FindMessagesRequest
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await findMessages(params);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lọc tin nhắn thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleFindMessages, loading, error };
}
