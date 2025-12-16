/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateReportRequest, GetReportsRequest } from "@/types/chat/dto";
import { request } from "@/utils/axios.customize";
import type { ApiResponse } from "@/api/_types/api.types";

// ==================== API ENDPOINTS ====================

const API_ENDPOINT_REPORTS = "v1/chat/reports";

// ==================== USER REPORT SERVICES ====================

/**
 * [USER] Tạo report
 * POST /api/v1/chat/reports
 */
export async function createReport(
  data: CreateReportRequest
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_REPORTS}`,
    method: "POST",
    data,
  });
}

/**
 * [USER] Lấy reports của tôi
 * GET /api/v1/chat/reports/my-reports
 */
export async function getMyReports(
  params: GetReportsRequest = {}
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_REPORTS}/my-reports`,
    method: "GET",
    params,
  });
}

/**
 * [USER] Filter reports
 * GET /api/v1/chat/reports/filter
 */
export async function filterReports(
  params: GetReportsRequest = {}
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_REPORTS}/filter`,
    method: "GET",
    params,
  });
}

