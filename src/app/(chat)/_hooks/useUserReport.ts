/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback } from "react";
import {
  createReport,
  getMyReports,
  filterReports,
} from "../_services";
import { CreateReportRequest, GetReportsRequest } from "../_types/chat.dto";
import { useToast } from "@/hooks/useToast";
const { success: messageSuccess, error: messageError } = useToast();

/**
 * [USER] Hook để tạo report
 */
export function useUserCreateReport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateReport = useCallback(
    async (payload: CreateReportRequest): Promise<any> => {
      setLoading(true);
      setError(null);
      try {
        const res = await createReport(payload);
        if (res.success) {
          messageSuccess("Tạo báo cáo thành công");
        }
        return res;
      } catch (err: any) {
        setError(err?.message || "Tạo báo cáo thất bại");
        messageError(err?.message || "Tạo báo cáo thất bại");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { handleCreateReport, loading, error };
}

/**
 * [USER] Hook để lấy reports của tôi
 */
export function useUserGetMyReports() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetMyReports = useCallback(async (): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMyReports();
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy báo cáo của tôi thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { handleGetMyReports, loading, error };
}

/**
 * [USER] Hook để filter reports
 */
export function useUserFilterReports() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilterReports = useCallback(
    async (payload: GetReportsRequest = {}): Promise<any> => {
      setLoading(true);
      setError(null);
      try {
        const res = await filterReports(payload);
        return res;
      } catch (err: any) {
        setError(err?.message || "Lọc báo cáo thất bại");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { handleFilterReports, loading, error };
}

