/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useCallback } from "react";
import { useToast } from "@/hooks/useToast";
import {
  getAllReports,
  getReportsByStatus,
  updateReportStatus,
  deleteReport,
  getPendingReportsCount,
} from "../_services";
import { ReportStatus, GetReportsRequest } from "../_types/chat.dto";
const { success: messageSuccess, error: messageError } = useToast();

export function useAdminGetAllReports() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleGetAllReports = useCallback(
    async (payload: GetReportsRequest): Promise<any> => {
      setLoading(true);
      setError(null);
      try {
        const res = await getAllReports(payload);
        return res;
      } catch (err: any) {
        setError(err?.message || "Lấy danh sách báo cáo thất bại");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { handleGetAllReports, loading, error };
}

/**
 * [ADMIN] Hook để lấy reports theo trạng thái
 */
export function useAdminGetReportsByStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetReportsByStatus = useCallback(
    async (status: ReportStatus): Promise<any> => {
      setLoading(true);
      setError(null);
      try {
        const res = await getReportsByStatus(status);
        return res;
      } catch (err: any) {
        setError(err?.message || "Lấy báo cáo theo trạng thái thất bại");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { handleGetReportsByStatus, loading, error };
}

/**
 * [ADMIN] Hook để cập nhật trạng thái report
 */
export function useAdminUpdateReportStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateReportStatus = useCallback(
    async (id: string, status: ReportStatus, note?: string): Promise<any> => {
      setLoading(true);
      setError(null);
      try {
        const res = await updateReportStatus(id, status, note);
        if (res.success) {
          messageSuccess("Cập nhật trạng thái báo cáo thành công");
        }
        return res;
      } catch (err: any) {
        setError(err?.message || "Cập nhật trạng thái báo cáo thất bại");
        messageError(err?.message || "Cập nhật trạng thái báo cáo thất bại");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { handleUpdateReportStatus, loading, error };
}

/**
 * [ADMIN] Hook để xóa report
 */
export function useAdminDeleteReport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteReport = useCallback(async (id: string): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await deleteReport(id);
      if (res.success) {
        messageSuccess("Xóa báo cáo thành công");
      }
      return res;
    } catch (err: any) {
      setError(err?.message || "Xóa báo cáo thất bại");
      messageError(err?.message || "Xóa báo cáo thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { handleDeleteReport, loading, error };
}

/**
 * [ADMIN] Hook để lấy số lượng reports pending
 */
export function useAdminGetPendingReportsCount() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetPendingReportsCount = useCallback(async (): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPendingReportsCount();
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy số lượng báo cáo chờ xử lý thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { handleGetPendingReportsCount, loading, error };
}
