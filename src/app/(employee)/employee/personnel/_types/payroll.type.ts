/**
 * Payroll Types
 * Định nghĩa các kiểu dữ liệu cho quản lý bảng lương nhân viên
 */

export interface PayrollResponse {
  // Identification
  id: string; // UUID

  // Salary Period
  payMonth: string; // Format: "YYYY-MM" (e.g., "2025-10")

  // Salary Components
  baseSalary: number; // Lương cơ bản (VND)
  bonus: number; // Thưởng thêm (VND), default = 0
  deduction: number; // Khấu trừ (VND), default = 0
  total: number; // Tổng lương thực lãnh (VND) - tự động tính

  // Payment Status
  paid: boolean; // Đã trả lương chưa
  paidDate: string; // Ngày trả lương (ISO 8601 datetime)
  expectedPayDate: string; // Ngày dự kiến trả lương (ISO 8601 datetime)

  // Attachment
  attachmentUrl?: string; // Link đến file đính kèm (phiếu lương, hợp đồng...)
}

export interface PayrollCreateRequest {
  payMonth: string; // Bắt buộc, format: "YYYY-MM" (e.g., "2025-10")
  baseSalary: number; // Bắt buộc, > 0
  bonus?: number; // Tùy chọn, >= 0, default = 0
  deduction?: number; // Tùy chọn, >= 0, default = 0
  total: number; // Bắt buộc, tổng lương thực tế
  attachmentUrl?: string; // Tùy chọn, max 255 ký tự
  expectedPayDate: string; // Bắt buộc, ISO 8601 datetime
}

export interface PayrollUpdateRequest {
  payMonth: string; // Bắt buộc, format: "YYYY-MM"
  baseSalary: number; // Bắt buộc, > 0
  bonus?: number; // Tùy chọn, >= 0
  deduction?: number; // Tùy chọn, >= 0
  total: number; // Bắt buộc, tổng lương thực tế
  attachmentUrl?: string; // Tùy chọn
  paidDate?: string; // Tùy chọn, ISO 8601 datetime (khi đã trả lương)
  expectedPayDate: string; // Bắt buộc, ISO 8601 datetime
}

export interface PayRollPageResponse {
  payrolls: PayrollResponse[]; // Danh sách bảng lương
  pageNumber: number; // Page hiện tại (0-based)
  pageSize: number; // Số items per page
  totalPages: number; // Tổng số pages
  totalElements: number; // Tổng số records
}

export interface GetPayrollsRequest {
  year?: number; // Năm (4 digits), ví dụ: 2025
  page?: number; // Page number (0-based), default = 0
  size?: number; // Items per page, default = 10, max = 100
  sortBy?: "payMonth" | "baseSalary" | "total" | "paidDate"; // Sort field
  direction?: "ASC" | "DESC"; // Sort direction
}
