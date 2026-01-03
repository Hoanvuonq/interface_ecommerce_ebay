/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback } from "react";
import { getChatStatistics } from "../_services";
import { GetChatStatisticsRequest } from "../_types/chat.dto";

/**
 * Hook để lấy thống kê chat
 */
export function useGetChatStatistics() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetChatStatistics = async (
    payload: GetChatStatisticsRequest
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getChatStatistics(payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy thống kê chat thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetChatStatistics, loading, error };
}
