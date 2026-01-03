/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useToast } from "@/hooks/useToast";
import {
  getConversations,
  getAllReports,
  updateReportStatus,
  deleteReport,
  getChatStatistics,
} from "../_services";
import {
  GetConversationsRequest,
  GetReportsRequest,
  GetChatStatisticsRequest,
  ReportStatus,
} from "../_types/chat.dto";
import { useWebSocketContext } from "@/providers/WebSocketProvider";
const { success: messageSuccess, error: messageError } = useToast();

export function useConversations(filters: GetConversationsRequest) {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const { subscribe, connected: isConnected } = useWebSocketContext();

  // Memoize filters to prevent unnecessary re-renders
  // We only watch specific properties to avoid recreating when filters object reference changes
  const memoizedFilters = useMemo(
    () => ({
      keyword: filters.keyword,
      conversationType: filters.conversationType,
      status: filters.status,
      size: filters.size,
    }),
    [filters.keyword, filters.conversationType, filters.status, filters.size]
  );

  const loadConversations = useCallback(
    async (reset = false) => {
      setLoading(true);
      setError(null);

      try {
        const payload = {
          ...memoizedFilters,
          page: reset ? 0 : currentPage,
        };

        const res = await getConversations(payload);

        if (res.success && res.data) {
          if (reset) {
            setConversations(res.data.content || []);
            setCurrentPage(0);
          } else {
            setConversations((prev) => [...prev, ...(res.data.content || [])]);
          }

          setHasMore(!res.data.last);
          if (!reset) {
            setCurrentPage((prev) => prev + 1);
          }
        }
      } catch (err: any) {
        setError(err?.message || "Lấy danh sách cuộc trò chuyện thất bại");
      } finally {
        setLoading(false);
      }
    },
    [memoizedFilters, currentPage]
  );

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [loading, hasMore]);

  const refresh = useCallback(() => {
    loadConversations(true);
  }, [loadConversations]);

  useEffect(() => {
    loadConversations(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memoizedFilters]);

  useEffect(() => {
    if (currentPage > 0) {
      loadConversations(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Subscribe to conversation updates for real-time unread count sync
  useEffect(() => {
    if (!isConnected) return;

    const unsubscribe = subscribe(
      "/user/queue/conversations",
      (msg: unknown) => {
        const data = (msg as { body?: string }).body
          ? JSON.parse((msg as { body: string }).body)
          : msg;

        switch (data.type) {
          case "NEW_MESSAGE":
            // Update last message and increment unread count
            if (data.data?.conversationId) {
              setConversations((prev) =>
                prev.map((conv) =>
                  conv.id === data.data.conversationId
                    ? {
                        ...conv,
                        lastMessagePreview: data.data.content || data.data.type,
                        lastMessageAt: data.data.sentAt,
                        unreadCount: (conv.unreadCount || 0) + 1,
                      }
                    : conv
                )
              );
            }
            break;

          case "CONVERSATION_UPDATED":
            // Update entire conversation object
            if (data.data?.id) {
              setConversations((prev) =>
                prev.map((conv) =>
                  conv.id === data.data.id ? { ...conv, ...data.data } : conv
                )
              );
            }
            break;

          case "MESSAGE_READ":
            // Reset unread count when messages are read
            if (data.conversationId) {
              setConversations((prev) =>
                prev.map((conv) =>
                  conv.id === data.conversationId
                    ? { ...conv, unreadCount: 0 }
                    : conv
                )
              );
            }
            break;

          default:
            break;
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [isConnected, subscribe]);

  return {
    conversations,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
  };
}

/**
 * Hook để quản lý chat statistics với state
 */
export function useChatStatistics(filters?: GetChatStatisticsRequest) {
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoize filters to prevent unnecessary re-renders
  const memoizedFilters = useMemo(() => {
    if (!filters) return null;
    return {
      startDate: filters.startDate,
      endDate: filters.endDate,
      conversationType: filters.conversationType,
    };
  }, [filters]);

  const loadStatistics = useCallback(async () => {
    if (!memoizedFilters) return;

    setLoading(true);
    setError(null);
    try {
      const res = await getChatStatistics(memoizedFilters);
      if (res.success && res.data) {
        setStatistics(res.data);
      }
    } catch (err: any) {
      setError(err?.message || "Lấy thống kê chat thất bại");
    } finally {
      setLoading(false);
    }
  }, [memoizedFilters]);

  const refresh = useCallback(() => {
    if (memoizedFilters) {
      loadStatistics();
    }
  }, [memoizedFilters, loadStatistics]);

  useEffect(() => {
    if (memoizedFilters) {
      loadStatistics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memoizedFilters]);

  return {
    statistics,
    loading,
    error,
    refresh,
  };
}

/**
 * Hook để quản lý reports với pagination
 */
export function useReports(filters?: GetReportsRequest) {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  // Memoize filters to prevent unnecessary re-renders
  const memoizedFilters = useMemo(() => {
    const defaultFilters: GetReportsRequest = {
      page: 0,
      size: 10,
    };
    const activeFilters = filters || defaultFilters;
    return {
      status: activeFilters.status,
      keyword: activeFilters.keyword,
      size: activeFilters.size,
    };
  }, [filters]);

  const loadReports = useCallback(
    async (reset = false) => {
      setLoading(true);
      setError(null);

      try {
        const payload = {
          ...memoizedFilters,
          page: reset ? 0 : currentPage,
        };

        const res = await getAllReports(payload);

        if (res.success && res.data) {
          if (reset) {
            setReports(res.data.content || []);
            setCurrentPage(0);
          } else {
            setReports((prev) => [...prev, ...(res.data.content || [])]);
          }

          setHasMore(!res.data.last);
          if (!reset) {
            setCurrentPage((prev) => prev + 1);
          }
        }
      } catch (err: any) {
        setError(err?.message || "Lấy danh sách báo cáo thất bại");
      } finally {
        setLoading(false);
      }
    },
    [memoizedFilters, currentPage]
  );

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [loading, hasMore]);

  const refresh = useCallback(() => {
    loadReports(true);
  }, [loadReports]);

  useEffect(() => {
    loadReports(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memoizedFilters]);

  useEffect(() => {
    if (currentPage > 0) {
      loadReports(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Add functions that need to update reports
  const handleUpdateReportStatus = useCallback(
    async (reportId: string, status: ReportStatus, note?: string) => {
      try {
        const res = await updateReportStatus(reportId, status, note);
        if (res.success) {
          // Update local state instead of refetching
          setReports((prev) =>
            prev.map((report) =>
              report.id === reportId
                ? { ...report, status, adminNote: note }
                : report
            )
          );
          messageSuccess("Cập nhật trạng thái báo cáo thành công");
        }
        return res;
      } catch (err: any) {
        messageError(err?.message || "Cập nhật trạng thái báo cáo thất bại");
        return null;
      }
    },
    []
  );

  const handleDeleteReport = useCallback(async (reportId: string) => {
    try {
      const res = await deleteReport(reportId);
      if (res.success) {
        // Remove from local state instead of refetching
        setReports((prev) => prev.filter((report) => report.id !== reportId));
        messageSuccess("Xóa báo cáo thành công");
      }
      return res;
    } catch (err: any) {
      messageError(err?.message || "Xóa báo cáo thất bại");
      return null;
    }
  }, []);

  return {
    reports,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    updateReportStatus: handleUpdateReportStatus,
    deleteReport: handleDeleteReport,
  };
}
