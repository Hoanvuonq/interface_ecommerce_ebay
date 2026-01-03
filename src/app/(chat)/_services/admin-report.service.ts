import { GetReportsRequest,ReportStatus } from "@/app/(chat)/_types/chat.dto";
import { request } from "@/utils/axios.customize";
import { ApiResponse } from "@/api/_types/api.types";

const API_ENDPOINT_ADMIN_REPORTS = "v1/chat/admin/reports";


/**
 * [ADMIN] Lấy tất cả reports
 * GET /api/v1/chat/admin/reports
 */
export async function getAllReports(
  params: GetReportsRequest = {}
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_ADMIN_REPORTS}`,
    method: "GET",
    params,
  });
}

/**
 * [ADMIN] Lấy reports theo status
 * GET /api/v1/chat/admin/reports/status/{status}
 */
export async function getReportsByStatus(
  status: ReportStatus,
  params: Omit<GetReportsRequest, "status"> = {}
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_ADMIN_REPORTS}/status/${status}`,
    method: "GET",
    params,
  });
}

/**
 * [ADMIN] Cập nhật status report
 * PUT /api/v1/chat/admin/reports/{reportId}/status
 */
export async function updateReportStatus(
  reportId: string,
  status: ReportStatus,
  adminNote?: string
): Promise<ApiResponse<any>> {
  const params: any = { status };
  if (adminNote) {
    params.adminNote = adminNote;
  }
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_ADMIN_REPORTS}/${reportId}/status`,
    method: "PUT",
    params,
  });
}

/**
 * [ADMIN] Xóa report
 * DELETE /api/v1/chat/admin/reports/{reportId}
 */
export async function deleteReport(
  reportId: string
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_ADMIN_REPORTS}/${reportId}`,
    method: "DELETE",
  });
}

/**
 * [ADMIN] Đếm reports đang chờ
 * GET /api/v1/chat/admin/reports/pending/count
 */
export async function getPendingReportsCount(): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_ADMIN_REPORTS}/pending/count`,
    method: "GET",
  });
}

/**
 * [ADMIN] Lấy thống kê chat
 * GET /api/v1/chat/admin/statistics
 */
export async function getChatStatistics(
  params: any = {}
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: "/v1/chat/admin/statistics",
    method: "GET",
    params,
  });
}

