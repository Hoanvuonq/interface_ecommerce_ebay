/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "@/utils/axios.customize";
import { ApiResponse } from "@/api/_types/api.types";
import {
  VoucherListRequest,
  VoucherListResponse,
  VoucherDetailResponse,
  VoucherCreateRequest,
  VoucherUpdateRequest,
  VoucherScheduleRequest,
  RecommendShopVoucherRequest,
  RecommendPlatformVoucherRequest,
} from "../_types/dto/voucher.dto";
import { VoucherType, VoucherStatus } from "../_types/voucher.type";

const API_ENDPOINT_VOUCHERS = "v1/vouchers";

// =============== API CÓ TRÊN BACKEND ===============

// Get all vouchers with filters (✅ Backend có)
export async function getVouchers(
  params?: VoucherListRequest,
): Promise<VoucherListResponse> {
  return request<VoucherListResponse>({
    url: `/${API_ENDPOINT_VOUCHERS}`,
    method: "GET",
    params,
  });
}

// Create platform voucher (✅ Backend có: POST /api/v1/vouchers/platform)
export async function createPlatformVoucher(
  payload: VoucherCreateRequest,
): Promise<VoucherDetailResponse> {
  return request<VoucherDetailResponse>({
    url: `/${API_ENDPOINT_VOUCHERS}/platform`,
    method: "POST",
    data: payload,
  });
}

// Create shop voucher (✅ Backend có: POST /api/v1/vouchers/shop)
export async function createShopVoucher(
  payload: VoucherCreateRequest,
): Promise<VoucherDetailResponse> {
  return request<VoucherDetailResponse>({
    url: `/${API_ENDPOINT_VOUCHERS}/shop`,
    method: "POST",
    data: payload,
  });
}

// Update base voucher (✅ Backend có: PUT /api/v1/vouchers/base)
export async function updateBaseVoucher(
  payload: VoucherUpdateRequest,
): Promise<VoucherDetailResponse> {
  return request<VoucherDetailResponse>({
    url: `/${API_ENDPOINT_VOUCHERS}/base`,
    method: "PUT",
    data: payload,
  });
}

// Update voucher object relationships (✅ Backend có: PUT /api/v1/vouchers/object)
export async function updateObjectVoucher(
  payload: any,
): Promise<VoucherDetailResponse> {
  return request<VoucherDetailResponse>({
    url: `/${API_ENDPOINT_VOUCHERS}/object`,
    method: "PUT",
    data: payload,
  });
}

// Delete voucher (✅ Backend có)
export async function deleteVoucher(id: string): Promise<ApiResponse<string>> {
  return request<ApiResponse<string>>({
    url: `/${API_ENDPOINT_VOUCHERS}/${id}`,
    method: "DELETE",
  });
}

// Get vouchers by object (✅ Backend có: GET /api/v1/vouchers/by-object)
export async function getVouchersByObject(
  objectIds: string[],
  voucherType: VoucherType,
): Promise<VoucherDetailResponse[]> {
  return request<VoucherDetailResponse[]>({
    url: `/${API_ENDPOINT_VOUCHERS}/by-object`,
    method: "GET",
    params: {
      objectIds: objectIds.join(","),
      voucherType,
    },
  });
}

// Get voucher by code (✅ Backend có: GET /api/v1/vouchers/by-code/{code})
export async function getVoucherByCode(
  code: string,
): Promise<VoucherDetailResponse> {
  return request<VoucherDetailResponse>({
    url: `/${API_ENDPOINT_VOUCHERS}/by-code/${code}`,
    method: "GET",
  });
}

// Get vouchers by date range (✅ Backend có: GET /api/v1/vouchers/by-date)
export async function getVouchersByDateRange(
  from: string,
  to: string,
  mode?: string,
  type?: VoucherType,
  status?: string,
): Promise<VoucherDetailResponse[]> {
  return request<VoucherDetailResponse[]>({
    url: `/${API_ENDPOINT_VOUCHERS}/by-date`,
    method: "GET",
    params: { from, to, mode, type, status },
  });
}

// Activate voucher (✅ Backend có)
export async function activateVoucher(
  id: string,
): Promise<VoucherDetailResponse> {
  return request<VoucherDetailResponse>({
    url: `/${API_ENDPOINT_VOUCHERS}/${id}/activate`,
    method: "POST",
  });
}

// Deactivate voucher (✅ Backend có)
export async function deactivateVoucher(
  id: string,
): Promise<VoucherDetailResponse> {
  return request<VoucherDetailResponse>({
    url: `/${API_ENDPOINT_VOUCHERS}/${id}/deactivate`,
    method: "POST",
  });
}

// Schedule voucher (✅ Backend có)
export async function scheduleVoucher(
  payload: VoucherScheduleRequest,
): Promise<VoucherDetailResponse> {
  return request<VoucherDetailResponse>({
    url: `/${API_ENDPOINT_VOUCHERS}/${payload.id}/schedule`,
    method: "POST",
    params: { scheduledTime: payload.scheduledTime },
  });
}

// Archive voucher (✅ Backend có)
export async function archiveVoucher(
  id: string,
): Promise<VoucherDetailResponse> {
  return request<VoucherDetailResponse>({
    url: `/${API_ENDPOINT_VOUCHERS}/${id}/archive`,
    method: "POST",
  });
}

// Recommend shop vouchers (✅ Backend có: POST /api/v1/vouchers/recommend_shop)
export async function recommendShopVouchers(
  payload: RecommendShopVoucherRequest,
): Promise<VoucherDetailResponse[]> {
  return request<VoucherDetailResponse[]>({
    url: `/${API_ENDPOINT_VOUCHERS}/recommend_shop`,
    method: "POST",
    data: payload,
  });
}

// Recommend platform vouchers (✅ Backend có: POST /api/v1/vouchers/recommend_platform)
export async function recommendPlatformVouchers(
  payload: RecommendPlatformVoucherRequest,
): Promise<VoucherDetailResponse[]> {
  return request<VoucherDetailResponse[]>({
    url: `/${API_ENDPOINT_VOUCHERS}/recommend_platform`,
    method: "POST",
    data: payload,
  });
}

// =============== MOCK DATA CHO API CHƯA CÓ ===============

// Get voucher by ID (❌ Backend chưa có - dùng mock)
export async function getVoucherById(
  id: string,
): Promise<VoucherDetailResponse> {
  // Mock data
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    success: true,
    code: 1000,
    message: "Voucher detail fetched successfully (MOCK)",
    data: {
      id,
      code: `VOUCHER${id.slice(0, 8).toUpperCase()}`,
      description: "This is mock data from frontend",
      voucherType: VoucherType.PLATFORM,
      status: VoucherStatus.ACTIVE,
      discountMethod: "PERCENTAGE" as any,
      discountTarget: "ORDER" as any,
      discountValue: 20,
      maxDiscount: 50000,
      minOrderValue: 100000,
      usageLimit: 1000,
      usedCount: 250,
      usageVersion: 1,
      applyToAllShops: false,
      applyToAllProducts: false,
      applyToAllCustomers: false,
      customerCount: 0,
      shopCount: 0,
      productCount: 0,
      priority: 1,
      activeAt: new Date().toISOString(),
      metadata: "{}",
      effectiveDiscount: 20,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
  };
}

// Get voucher statistics (❌ Backend chưa có - dùng mock)
export async function getVoucherStatistics(): Promise<ApiResponse<any>> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    success: true,
    code: 1000,
    message: "Voucher statistics fetched successfully (MOCK)",
    data: {
      totalVouchers: 150,
      activeVouchers: 85,
      expiredVouchers: 45,
      scheduledVouchers: 20,
      totalUsage: 12500,
      totalDiscount: 3500000,
      avgDiscountPerOrder: 280000,
      conversionRate: 68.5,
    },
  };
}

// Get voucher time statistics (❌ Backend chưa có - dùng mock)
export async function getVoucherTimeStats(
  year: number,
  month: number,
): Promise<ApiResponse<any>> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const daysInMonth = new Date(year, month, 0).getDate();
  const dailyStats = Array.from({ length: daysInMonth }, (_, i) => ({
    date: `${year}-${String(month).padStart(2, "0")}-${String(i + 1).padStart(
      2,
      "0",
    )}`,
    usage: Math.floor(Math.random() * 500) + 100,
    revenue: Math.floor(Math.random() * 50000000) + 10000000,
    discount: Math.floor(Math.random() * 5000000) + 1000000,
  }));

  return {
    success: true,
    code: 1000,
    message: "Voucher time statistics fetched successfully (MOCK)",
    data: {
      year,
      month,
      dailyStats,
      summary: {
        totalUsage: dailyStats.reduce((sum, d) => sum + d.usage, 0),
        totalRevenue: dailyStats.reduce((sum, d) => sum + d.revenue, 0),
        totalDiscount: dailyStats.reduce((sum, d) => sum + d.discount, 0),
      },
    },
  };
}

// Get voucher behavior statistics (❌ Backend chưa có - dùng mock)
export async function getVoucherBehaviorStats(
  year: number,
  month: number,
): Promise<ApiResponse<any>> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    success: true,
    code: 1000,
    message: "Voucher behavior statistics fetched successfully (MOCK)",
    data: {
      year,
      month,
      topVouchers: [
        { code: "SUMMER2024", usage: 1250, conversion: 72.5 },
        { code: "NEWUSER50", usage: 980, conversion: 85.2 },
        { code: "FLASH20", usage: 856, conversion: 68.3 },
      ],
      userSegments: [
        { segment: "New Users", usage: 3500, avgDiscount: 45000 },
        { segment: "Regular Users", usage: 6200, avgDiscount: 35000 },
        { segment: "VIP Users", usage: 2800, avgDiscount: 65000 },
      ],
      deviceBreakdown: {
        mobile: 65,
        desktop: 28,
        tablet: 7,
      },
    },
  };
}
