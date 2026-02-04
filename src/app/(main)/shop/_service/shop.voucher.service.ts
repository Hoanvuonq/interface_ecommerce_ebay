/* eslint-disable @typescript-eslint/no-explicit-any */
import { request } from "@/utils/axios.customize";
import { ApiResponse } from "@/api/_types/api.types";
import {
  CreateShopVoucherRequest,
  CreateShopVoucherResponse,
  PurchaseVoucherRequest,
  PurchaseVoucherResponse,
  VoucherInfo,
  SearchVoucherTemplatesRequest,
  SearchVoucherTemplatesResponse,
  ValidateVouchersRequest,
  ValidateVouchersResponse,
  RecommendVouchersForShopResponse,
  RecommendPlatformVouchersResponse,
  UseVoucherResponse,
  CheckVoucherUsageResponse,
  VoucherTemplate,
}  from "../_types/dto/shop.voucher.dto";

const API_ENDPOINT = "/v2/vouchers";

// ==================== SHOP VOUCHER APIs ====================

/**
 * 1. Tạo voucher riêng cho shop
 * POST /api/v2/vouchers/templates/shop
 * Role: SHOP
 */
export async function createShopVoucher(
  payload: CreateShopVoucherRequest
): Promise<ApiResponse<CreateShopVoucherResponse>> {
  return request<ApiResponse<CreateShopVoucherResponse>>({
    url: `${API_ENDPOINT}/templates/shop`,
    method: "POST",
    data: payload,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * 2. Shop mua voucher từ template Platform
 * POST /api/v2/vouchers/purchase
 * Role: SHOP
 */
export async function purchaseVoucher(
  payload: PurchaseVoucherRequest
): Promise<ApiResponse<PurchaseVoucherResponse>> {
  return request<ApiResponse<PurchaseVoucherResponse>>({
    url: `${API_ENDPOINT}/purchase`,
    method: "POST",
    data: payload,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * 3. Sử dụng voucher tự tạo
 * POST /api/v2/vouchers/use-shop/{templateId}
 * Role: SHOP
 */
export async function applyShopVoucher(
  templateId: string
): Promise<ApiResponse<UseVoucherResponse>> {
  return request<ApiResponse<UseVoucherResponse>>({
    url: `${API_ENDPOINT}/use-shop/${templateId}`,
    method: "POST",
  });
}

/**
 * 4. Sử dụng voucher từ instance đã mua
 * POST /api/v2/vouchers/use-instance/{instanceId}
 * Role: Authenticated User (SHOP/CUSTOMER)
 */
export async function applyVoucherInstance(
  instanceId: string
): Promise<ApiResponse<UseVoucherResponse>> {
  return request<ApiResponse<UseVoucherResponse>>({
    url: `${API_ENDPOINT}/use-instance/${instanceId}`,
    method: "POST",
  });
}

/**
 * 5. Xem thông tin voucher
 * GET /api/v2/vouchers/info/{templateId}
 * Role: Authenticated User
 */
export async function getVoucherInfo(
  templateId: string
): Promise<ApiResponse<VoucherInfo>> {
  return request<ApiResponse<VoucherInfo>>({
    url: `${API_ENDPOINT}/info/${templateId}`,
    method: "GET",
  });
}

/**
 * 6. Tìm kiếm voucher templates (pageable)
 * GET /api/v2/vouchers/templates
 * Role: Authenticated User
 */
export async function searchVoucherTemplates(
  params: SearchVoucherTemplatesRequest
): Promise<ApiResponse<SearchVoucherTemplatesResponse>> {
  return request<ApiResponse<SearchVoucherTemplatesResponse>>({
    url: `${API_ENDPOINT}/templates`,
    method: "GET",
    params: {
      scope: params.scope || "all",
      q: params.q,
      page: params.page || 0,
      size: params.size || 20,
      sort: params.sort || "createdDate,desc",
    },
  });
}

/**
 * 7. Gợi ý voucher áp dụng cho shop
 * GET /api/v2/vouchers/recommend/by-shop
 * Role: SHOP
 */
export async function getRecommendedVouchersForShop(): Promise<
  ApiResponse<RecommendVouchersForShopResponse>
> {
  return request<ApiResponse<RecommendVouchersForShopResponse>>({
    url: `${API_ENDPOINT}/recommend/by-shop`,
    method: "GET",
  });
}

/**
 * 8. Gợi ý voucher platform
 * GET /api/v2/vouchers/recommend/by-platform
 * Role: Authenticated User
 */
export async function getRecommendedPlatformVouchers(): Promise<
  ApiResponse<RecommendPlatformVouchersResponse>
> {
  return request<ApiResponse<RecommendPlatformVouchersResponse>>({
    url: `${API_ENDPOINT}/recommend/by-platform`,
    method: "GET",
  });
}

/**
 * 9. Validate nhiều vouchers cùng lúc
 * POST /api/v2/vouchers/validate
 * Role: Authenticated User
 */
export async function validateVouchers(
  payload: ValidateVouchersRequest
): Promise<ApiResponse<ValidateVouchersResponse>> {
  return request<ApiResponse<ValidateVouchersResponse>>({
    url: `${API_ENDPOINT}/validate`,
    method: "POST",
    data: payload,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * 10. Kiểm tra voucher có thể sử dụng
 * GET /api/v2/vouchers/check-usage/{templateId}
 * Role: Authenticated User
 */
export async function checkVoucherUsage(
  templateId: string
): Promise<ApiResponse<CheckVoucherUsageResponse>> {
  return request<ApiResponse<CheckVoucherUsageResponse>>({
    url: `${API_ENDPOINT}/check-usage/${templateId}`,
    method: "GET",
  });
}

/**
 * 11. Lấy chi tiết voucher template (admin view)
 * GET /api/v2/vouchers/templates/{templateId}
 * Role: ADMIN (Shop không dùng API này, dùng getVoucherInfo thay thế)
 */
export async function getVoucherTemplate(
  templateId: string
): Promise<ApiResponse<VoucherTemplate>> {
  return request<ApiResponse<VoucherTemplate>>({
    url: `${API_ENDPOINT}/templates/${templateId}`,
    method: "GET",
  });
}

/**
 * 12. Xóa voucher template
 * DELETE /api/v2/vouchers/templates/{templateId}
 * Role: SHOP
 */
export async function deleteVoucherTemplate(
  templateId: string
): Promise<ApiResponse<boolean>> {
  return request<ApiResponse<boolean>>({
    url: `${API_ENDPOINT}/templates/shop/${templateId}`,
    method: "DELETE",
  });
}

/**
 * 13. Cập nhật voucher template
 * PUT /api/v2/vouchers/templates/{templateId}
 * Role: SHOP
 */
export async function updateVoucherTemplate(
  templateId: string,
  payload: CreateShopVoucherRequest
): Promise<ApiResponse<VoucherTemplate>> {
  return request<ApiResponse<VoucherTemplate>>({
    url: `${API_ENDPOINT}/templates/shop/${templateId}`,
    method: "PUT",
    data: payload,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * 14. Toggle active status của voucher
 * PATCH /api/v2/vouchers/templates/{templateId}/toggle-active
 * Role: SHOP
 */
export async function toggleVoucherActive(
  templateId: string
): Promise<ApiResponse<VoucherTemplate>> {
  return request<ApiResponse<VoucherTemplate>>({
    url: `${API_ENDPOINT}/templates/${templateId}/toggle-active`,
    method: "PATCH",
  });
}

/**
 * 15. Lấy thống kê usage của voucher
 * GET /api/v2/vouchers/templates/{templateId}/stats
 * Role: SHOP
 */
export async function getVoucherStats(
  templateId: string
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `${API_ENDPOINT}/templates/${templateId}/stats`,
    method: "GET",
  });
}

/**
 * 16. Duplicate voucher
 * POST /api/v2/vouchers/templates/{templateId}/duplicate
 * Role: SHOP
 */
export async function duplicateVoucher(
  templateId: string
): Promise<ApiResponse<VoucherTemplate>> {
  return request<ApiResponse<VoucherTemplate>>({
    url: `${API_ENDPOINT}/templates/${templateId}/duplicate`,
    method: "POST",
  });
}

// ==================== SHOP QUERY APIs (NEW) ====================

/**
 * 17. Lấy danh sách voucher đã mua từ platform
 * GET /api/v2/vouchers/instances/shop
 * Role: SHOP
 */
export async function getShopInstances(
  params: { page?: number; size?: number } = {}
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `${API_ENDPOINT}/instances/shop`,
    method: "GET",
    params: {
      page: params.page || 0,
      size: params.size || 20,
    },
  });
}

/**
 * 18. Lấy lịch sử giao dịch voucher
 * GET /api/v2/vouchers/transactions/shop
 * Role: SHOP
 */
export async function getShopTransactions(
  params: { page?: number; size?: number } = {}
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `${API_ENDPOINT}/transactions/shop`,
    method: "GET",
    params: {
      page: params.page || 0,
      size: params.size || 20,
    },
  });
}

/**
 * 19. Lấy thống kê voucher của shop
 * GET /api/v2/vouchers/statistics/shop
 * Role: SHOP
 */
export async function getShopStatistics(): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `${API_ENDPOINT}/statistics/shop`,
    method: "GET",
  });
}

