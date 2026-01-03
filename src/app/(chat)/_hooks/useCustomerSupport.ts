/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  getCustomerSupportConversations,
  getCustomerSupportQueue,
  getCustomerSupportQueueCount,
  getCustomerSupportActiveCount,
  getCustomerSupportConversationById,
  getCustomerSupportMessages,
  searchCustomerSupport,
  getCustomerSupportStats,
  acceptSupportConversation,
  assignSupportConversation,
  staffReply,
  GetCustomerSupportConversationsRequest,
  GetCustomerSupportQueueRequest,
  SearchCustomerSupportRequest,
  GetCustomerSupportStatsRequest,
} from "../_services/customer-support.service";
import { useToast } from "@/hooks/useToast";

const { success: messageSuccess, error: messageError } = useToast();
export function useGetCustomerSupportConversations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetCustomerSupportConversations = async (
    payload: GetCustomerSupportConversationsRequest = {}
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCustomerSupportConversations(payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy danh sách hỗ trợ khách hàng thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetCustomerSupportConversations, loading, error };
}

/**
 * Hook để lấy customer support queue (conversations ACTIVE)
 */
export function useGetCustomerSupportQueue() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetCustomerSupportQueue = async (
    payload: GetCustomerSupportQueueRequest = {}
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCustomerSupportQueue(payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy hàng đợi hỗ trợ thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetCustomerSupportQueue, loading, error };
}

/**
 * Hook để đếm số conversations đang chờ xử lý (WAITING_FOR_STAFF)
 */
export function useGetCustomerSupportQueueCount() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetCustomerSupportQueueCount = async (): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCustomerSupportQueueCount();
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy số lượng hàng đợi thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetCustomerSupportQueueCount, loading, error };
}

/**
 * Hook để đếm số conversations đang xử lý (ACTIVE)
 */
export function useGetCustomerSupportActiveCount() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetCustomerSupportActiveCount = async (): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCustomerSupportActiveCount();
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy số lượng active thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetCustomerSupportActiveCount, loading, error };
}

/**
 * Hook để xem chi tiết customer support conversation
 */
export function useGetCustomerSupportConversationById() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetCustomerSupportConversationById = async (
    conversationId: string
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCustomerSupportConversationById(conversationId);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy thông tin cuộc trò chuyện thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetCustomerSupportConversationById, loading, error };
}

/**
 * Hook để xem messages của customer support conversation
 */
export function useGetCustomerSupportMessages() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetCustomerSupportMessages = async (
    conversationId: string,
    payload: GetCustomerSupportConversationsRequest = {}
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCustomerSupportMessages(conversationId, payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy tin nhắn thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetCustomerSupportMessages, loading, error };
}

/**
 * Hook để tìm kiếm customer support conversations
 */
export function useSearchCustomerSupport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearchCustomerSupport = async (
    payload: SearchCustomerSupportRequest
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await searchCustomerSupport(payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Tìm kiếm hỗ trợ khách hàng thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleSearchCustomerSupport, loading, error };
}

/**
 * Hook để lấy thống kê customer support
 */
export function useGetCustomerSupportStats() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetCustomerSupportStats = async (
    payload: GetCustomerSupportStatsRequest = {}
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCustomerSupportStats(payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy thống kê hỗ trợ khách hàng thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetCustomerSupportStats, loading, error };
}

/**
 * Hook để staff accept customer support conversation
 */
export function useAcceptCustomerSupportConversation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAcceptCustomerSupportConversation = async (
    conversationId: string
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await acceptSupportConversation(conversationId);
      if (res.success) {
        messageSuccess("Tiếp nhận cuộc trò chuyện thành công");
      }
      return res;
    } catch (err: any) {
      setError(err?.message || "Tiếp nhận cuộc trò chuyện thất bại");
      messageError(err?.message || "Tiếp nhận cuộc trò chuyện thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleAcceptCustomerSupportConversation, loading, error };
}

/**
 * Hook để staff assign conversation cho staff khác
 */
export function useAssignCustomerSupportConversation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAssignCustomerSupportConversation = async (
    conversationId: string,
    staffUserId: string
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await assignSupportConversation(conversationId, staffUserId);
      if (res.success) {
        messageSuccess("Chuyển cuộc trò chuyện thành công");
      }
      return res;
    } catch (err: any) {
      setError(err?.message || "Chuyển cuộc trò chuyện thất bại");
      messageError(err?.message || "Chuyển cuộc trò chuyện thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleAssignCustomerSupportConversation, loading, error };
}

/**
 * Hook để staff reply message trong customer support conversation
 */
export function useStaffReply() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStaffReply = async (
    conversationId: string,
    data: {
      type: string;
      content: string;
      replyToMessageId?: string;
      attachments?: any[];
      clientMessageId?: string;
      metadata?: string;
    }
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await staffReply(conversationId, data);
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

  return { handleStaffReply, loading, error };
}
