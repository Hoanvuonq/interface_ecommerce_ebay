/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  PayrollCreateRequest,
  PayrollUpdateRequest,
  GetPayrollsRequest,
}  from "../_types/payroll.type";
import { request } from "@/utils/axios.customize";
import type { ApiResponse } from "@/api/_types/api.types";

const API_ENDPOINT_EMPLOYEES = "v1/employees";

/**
 * Lấy danh sách bảng lương của một nhân viên
 */
export async function getPayrolls(
  employeeId: string,
  params?: GetPayrollsRequest
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_EMPLOYEES}/${employeeId}/payrolls`,
    method: "GET",
    params,
  });
}

/**
 * Lấy chi tiết một bảng lương
 */
export async function getPayrollById(
  employeeId: string,
  payrollId: string
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_EMPLOYEES}/${employeeId}/payrolls/${payrollId}`,
    method: "GET",
  });
}

/**
 * Tạo bảng lương mới
 */
export async function createPayroll(
  employeeId: string,
  payload: PayrollCreateRequest
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_EMPLOYEES}/${employeeId}/payrolls`,
    method: "POST",
    data: payload,
  });
}

/**
 * Cập nhật bảng lương
 */
export async function updatePayroll(
  employeeId: string,
  payrollId: string,
  payload: PayrollUpdateRequest
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_EMPLOYEES}/${employeeId}/payrolls/${payrollId}`,
    method: "PUT",
    data: payload,
  });
}

/**
 * Xóa bảng lương (soft delete)
 */
export async function deletePayroll(
  employeeId: string,
  payrollId: string
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_EMPLOYEES}/${employeeId}/payrolls/${payrollId}`,
    method: "DELETE",
  });
}

/**
 * Đánh dấu đã trả lương
 */
export async function markAsPaid(
  employeeId: string,
  payrollId: string
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_EMPLOYEES}/${employeeId}/payrolls/${payrollId}/paid`,
    method: "PATCH",
  });
}

/**
 * Lấy thống kê bảng lương của nhân viên
 */
export async function getPayrollStatistics(
  employeeId: string
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_EMPLOYEES}/${employeeId}/payrolls/statistics`,
    method: "GET",
  });
}
