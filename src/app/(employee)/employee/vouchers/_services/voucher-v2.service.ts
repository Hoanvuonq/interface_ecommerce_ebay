
import { request } from "@/utils/axios.customize";
import { ApiResponse } from "@/api/_types/api.types";
import {
  VoucherTemplate,
  VoucherInstance,
  VoucherTransaction,
  VoucherInfoResponse,
  ValidateVouchersResponse,
  CreatePlatformTemplateRequest,
  CreatePlatformDirectRequest,
  SearchTemplatesRequest,
  ValidateVouchersRequest,
  PageableResponse,
  AdminTemplateDetail,
  VoucherV2Statistics,
  OwnerType,
  TransactionType,
  PaymentStatus,
} from "../_types/voucher-v2.type";

const API_ENDPOINT = "v2/vouchers";

// ==================== 1. TEMPLATE MANAGEMENT ====================

/**
 * 1.1. Create Platform Template (PAID or FREE)
 * POST /api/v2/vouchers/templates/platform
 * Backend: ✅ Available
 */
export async function createPlatformTemplate(
  payload: CreatePlatformTemplateRequest
): Promise<ApiResponse<VoucherTemplate>> {
  return request<ApiResponse<VoucherTemplate>>({
    url: `/${API_ENDPOINT}/templates/platform`,
    method: "POST",
    data: payload,
  });
}

/**
 * 1.2. Create Platform Direct Voucher (Use immediately)
 * POST /api/v2/vouchers/templates/platform-direct
 * Backend: ✅ Available
 */
export async function createPlatformDirectVoucher(
  payload: CreatePlatformDirectRequest
): Promise<ApiResponse<VoucherTemplate>> {
  return request<ApiResponse<VoucherTemplate>>({
    url: `/${API_ENDPOINT}/templates/platform-direct`,
    method: "POST",
    data: payload,
  });
}

/**
 * 1.3. Update Template (Admin only - before any purchase)
 * PUT /api/v2/vouchers/templates/{templateId}
 * Backend: ⚠️ Check availability
 */
export async function updateTemplate(
  templateId: string,
  payload: Partial<CreatePlatformTemplateRequest>
): Promise<ApiResponse<VoucherTemplate>> {
  return request<ApiResponse<VoucherTemplate>>({
    url: `/${API_ENDPOINT}/templates/shop/${templateId}`,
    method: "PUT",
    data: payload,
  });
}

/**
 * 1.4. Delete Template (Admin only)
 * DELETE /api/v2/vouchers/templates/{templateId}
 * Backend: ✅ Available
 */
export async function deleteTemplate(
  templateId: string
): Promise<ApiResponse<string>> {
  return request<ApiResponse<string>>({
    url: `/${API_ENDPOINT}/templates/${templateId}`,
    method: "DELETE",
  });
}

/**
 * 1.5. Toggle Template Status (Active/Inactive)
 * PATCH /api/v2/vouchers/templates/{templateId}/status
 * Backend: ⚠️ Check availability
 */
export async function toggleTemplateStatus(
  templateId: string,
  active: boolean
): Promise<ApiResponse<VoucherTemplate>> {
  return request<ApiResponse<VoucherTemplate>>({
    url: `/${API_ENDPOINT}/templates/${templateId}/status`,
    method: "PATCH",
    data: { active },
  });
}

// ==================== 2. INSTANCE MANAGEMENT ====================

/**
 * 2.1. Purchase Template (Shop buys voucher pool)
 * POST /api/v2/vouchers/purchase/{templateId}
 * Backend: ✅ Available
 */
export async function purchaseTemplate(
  templateId: string,
  quantity: number
): Promise<ApiResponse<VoucherInstance>> {
  return request<ApiResponse<VoucherInstance>>({
    url: `/${API_ENDPOINT}/purchase/${templateId}`,
    method: "POST",
    params: { quantity },
  });
}

/**
 * 2.2. Grant Voucher (Admin grants free voucher to shop)
 * POST /api/v2/vouchers/grant
 * Backend: ⚠️ Check availability
 */
export async function grantVoucher(
  templateId: string,
  shopId: string,
  quantity: number,
  notes?: string
): Promise<ApiResponse<VoucherInstance>> {
  return request<ApiResponse<VoucherInstance>>({
    url: `/${API_ENDPOINT}/grant`,
    method: "POST",
    data: {
      templateId,
      shopId,
      quantity,
      notes,
    },
  });
}

/**
 * 2.3. Get Instance by ID
 * GET /api/v2/vouchers/instances/{instanceId}
 * Backend: ⚠️ Check availability
 */
export async function getInstanceById(
  instanceId: string
): Promise<ApiResponse<VoucherInstance>> {
  return request<ApiResponse<VoucherInstance>>({
    url: `/${API_ENDPOINT}/instances/${instanceId}`,
    method: "GET",
  });
}

/**
 * 2.4. Get All Instances of Template
 * GET /api/v2/vouchers/templates/{templateId}/instances
 * Backend: ⚠️ Check availability
 */
export async function getTemplateInstances(
  templateId: string
): Promise<ApiResponse<VoucherInstance[]>> {
  return request<ApiResponse<VoucherInstance[]>>({
    url: `/${API_ENDPOINT}/templates/${templateId}/instances`,
    method: "GET",
  });
}

/**
 * 2.5. Get Shop's Instances (Shop's voucher pools)
 * GET /api/v2/vouchers/instances/by-shop/{shopId}
 * Backend: ⚠️ Check availability
 */
export async function getShopInstances(
  shopId: string
): Promise<ApiResponse<VoucherInstance[]>> {
  return request<ApiResponse<VoucherInstance[]>>({
    url: `/${API_ENDPOINT}/instances/by-shop/${shopId}`,
    method: "GET",
  });
}

// ==================== 3. USAGE & VALIDATION ====================

/**
 * 3.1. Use Platform Voucher Directly
 * POST /api/v2/vouchers/use-platform/{templateId}
 * Backend: ✅ Available
 */
export async function usePlatformVoucher(
  templateId: string
): Promise<ApiResponse<boolean>> {
  return request<ApiResponse<boolean>>({
    url: `/${API_ENDPOINT}/use-platform/${templateId}`,
    method: "POST",
  });
}

/**
 * 3.2. Use Voucher from Instance (Shop uses voucher from pool)
 * POST /api/v2/vouchers/use-instance/{instanceId}
 * Backend: ✅ Available
 */
export async function useVoucherInstance(
  instanceId: string
): Promise<ApiResponse<boolean>> {
  return request<ApiResponse<boolean>>({
    url: `/${API_ENDPOINT}/use-instance/${instanceId}`,
    method: "POST",
  });
}

/**
 * 3.3. Check if Voucher is Usable
 * GET /api/v2/vouchers/check-usage/{templateId}
 * Backend: ✅ Available
 */
export async function checkVoucherUsage(
  templateId: string
): Promise<ApiResponse<boolean>> {
  return request<ApiResponse<boolean>>({
    url: `/${API_ENDPOINT}/check-usage/${templateId}`,
    method: "GET",
  });
}

/**
 * 3.4. Validate Multiple Vouchers
 * POST /api/v2/vouchers/validate
 * Backend: ✅ Available
 */
export async function validateVouchers(
  payload: ValidateVouchersRequest
): Promise<ApiResponse<ValidateVouchersResponse>> {
  return request<ApiResponse<ValidateVouchersResponse>>({
    url: `/${API_ENDPOINT}/validate`,
    method: "POST",
    data: payload,
  });
}

/**
 * 3.5. Validate Single Voucher by Code
 * GET /api/v2/vouchers/validate-code/{code}
 * Backend: ⚠️ Check availability
 */
export async function validateVoucherByCode(
  code: string,
  shopId?: string
): Promise<ApiResponse<boolean>> {
  return request<ApiResponse<boolean>>({
    url: `/${API_ENDPOINT}/validate-code/${code}`,
    method: "GET",
    params: shopId ? { shopId } : undefined,
  });
}

// ==================== 4. INFORMATION & SEARCH ====================

/**
 * 4.1. Get Template by ID (Public view)
 * GET /api/v2/vouchers/templates/{templateId}
 * Backend: ✅ Available
 */
export async function getTemplateById(
  templateId: string
): Promise<ApiResponse<VoucherTemplate>> {
  return request<ApiResponse<VoucherTemplate>>({
    url: `/${API_ENDPOINT}/templates/${templateId}`,
    method: "GET",
  });
}

/**
 * 4.2. Get Template by Code
 * GET /api/v2/vouchers/templates/by-code/{code}
 * Backend: ⚠️ Check availability
 */
export async function getTemplateByCode(
  code: string
): Promise<ApiResponse<VoucherTemplate>> {
  return request<ApiResponse<VoucherTemplate>>({
    url: `/${API_ENDPOINT}/templates/by-code/${code}`,
    method: "GET",
  });
}

/**
 * 4.3. Get Voucher Info (Template + Instances + Usability)
 * GET /api/v2/vouchers/info/{templateId}
 * Backend: ✅ Available
 */
export async function getVoucherInfo(
  templateId: string
): Promise<ApiResponse<VoucherInfoResponse>> {
  return request<ApiResponse<VoucherInfoResponse>>({
    url: `/${API_ENDPOINT}/info/${templateId}`,
    method: "GET",
  });
}

/**
 * 4.4. Search Templates (Pageable)
 * GET /api/v2/vouchers/templates
 * Backend: ✅ Available
 */
export async function searchTemplates(
  params: SearchTemplatesRequest
): Promise<ApiResponse<PageableResponse<VoucherTemplate>>> {
  return request<ApiResponse<PageableResponse<VoucherTemplate>>>({
    url: `/${API_ENDPOINT}/templates`,
    method: "GET",
    params,
  });
}

/**
 * 4.5. Get Templates by Date Range
 * GET /api/v2/vouchers/templates/by-date
 * Backend: ⚠️ Check availability
 */
export async function getTemplatesByDateRange(
  startDate: string,
  endDate: string
): Promise<ApiResponse<VoucherTemplate[]>> {
  return request<ApiResponse<VoucherTemplate[]>>({
    url: `/${API_ENDPOINT}/templates/by-date`,
    method: "GET",
    params: { startDate, endDate },
  });
}

/**
 * 4.6. Get Templates Applicable for Shop
 * GET /api/v2/vouchers/templates/applicable/{shopId}
 * Backend: ⚠️ Check availability
 */
export async function getApplicableTemplates(
  shopId: string
): Promise<ApiResponse<VoucherTemplate[]>> {
  return request<ApiResponse<VoucherTemplate[]>>({
    url: `/${API_ENDPOINT}/templates/applicable/${shopId}`,
    method: "GET",
  });
}

// ==================== 5. RECOMMENDATIONS ====================

/**
 * 5.1. Get Recommended Platform Vouchers
 * GET /api/v2/vouchers/recommend/by-platform
 * Backend: ✅ Available
 */
export async function getRecommendedPlatformVouchers(): Promise<
  ApiResponse<VoucherTemplate[]>
> {
  return request<ApiResponse<VoucherTemplate[]>>({
    url: `/${API_ENDPOINT}/recommend/by-platform`,
    method: "GET",
  });
}

/**
 * 5.2. Get Recommended Vouchers for Shop
 * GET /api/v2/vouchers/recommend/by-shop/{shopId}
 * Backend: ⚠️ Check availability
 */
export async function getRecommendedShopVouchers(
  shopId: string
): Promise<ApiResponse<VoucherTemplate[]>> {
  return request<ApiResponse<VoucherTemplate[]>>({
    url: `/${API_ENDPOINT}/recommend/by-shop/${shopId}`,
    method: "GET",
  });
}

/**
 * 5.3. Get Popular Templates (Most purchased)
 * GET /api/v2/vouchers/templates/popular
 * Backend: ⚠️ Check availability
 */
export async function getPopularTemplates(
  limit: number = 10
): Promise<ApiResponse<VoucherTemplate[]>> {
  return request<ApiResponse<VoucherTemplate[]>>({
    url: `/${API_ENDPOINT}/templates/popular`,
    method: "GET",
    params: { limit },
  });
}

// ==================== 6. TRANSACTIONS ====================

/**
 * 6.1. Get Transaction by ID
 * GET /api/v2/vouchers/transactions/{transactionId}
 * Backend: ⚠️ Check availability
 */
export async function getTransactionById(
  transactionId: string
): Promise<ApiResponse<VoucherTransaction>> {
  return request<ApiResponse<VoucherTransaction>>({
    url: `/${API_ENDPOINT}/transactions/${transactionId}`,
    method: "GET",
  });
}

/**
 * 6.2. Get All Transactions of Template
 * GET /api/v2/vouchers/templates/{templateId}/transactions
 * Backend: ⚠️ Check availability
 */
export async function getTemplateTransactions(
  templateId: string
): Promise<ApiResponse<VoucherTransaction[]>> {
  return request<ApiResponse<VoucherTransaction[]>>({
    url: `/${API_ENDPOINT}/templates/${templateId}/transactions`,
    method: "GET",
  });
}

/**
 * 6.3. Get Shop's Transactions (Purchase history)
 * GET /api/v2/vouchers/transactions/by-shop/{shopId}
 * Backend: ⚠️ Check availability
 */
export async function getShopTransactions(
  shopId: string
): Promise<ApiResponse<VoucherTransaction[]>> {
  return request<ApiResponse<VoucherTransaction[]>>({
    url: `/${API_ENDPOINT}/transactions/by-shop/${shopId}`,
    method: "GET",
  });
}

/**
 * 6.4. Get Transactions by Date Range
 * GET /api/v2/vouchers/transactions/by-date
 * Backend: ⚠️ Check availability
 */
export async function getTransactionsByDateRange(
  startDate: string,
  endDate: string,
  status?: PaymentStatus
): Promise<ApiResponse<VoucherTransaction[]>> {
  return request<ApiResponse<VoucherTransaction[]>>({
    url: `/${API_ENDPOINT}/transactions/by-date`,
    method: "GET",
    params: { startDate, endDate, status },
  });
}

// ==================== 7. STATISTICS & ANALYTICS ====================

/**
 * 7.1. Get Overall Statistics
 * GET /api/v2/vouchers/statistics
 * Backend: ⚠️ Check availability
 */
export async function getVoucherStatistics(): Promise<
  ApiResponse<VoucherV2Statistics>
> {
  return request<ApiResponse<VoucherV2Statistics>>({
    url: `/${API_ENDPOINT}/statistics`,
    method: "GET",
  });
}

/**
 * 7.2. Get Template Performance Statistics
 * GET /api/v2/vouchers/templates/{templateId}/statistics
 * Backend: ⚠️ Check availability
 */
export async function getTemplateStatistics(templateId: string): Promise<
  ApiResponse<{
    totalPurchases: number;
    totalRevenue: number;
    totalUsage: number;
    shopsPurchased: number;
    averageUsagePerShop: number;
  }>
> {
  return request<
    ApiResponse<{
      totalPurchases: number;
      totalRevenue: number;
      totalUsage: number;
      shopsPurchased: number;
      averageUsagePerShop: number;
    }>
  >({
    url: `/${API_ENDPOINT}/templates/${templateId}/statistics`,
    method: "GET",
  });
}

/**
 * 7.3. Get Revenue by Period
 * GET /api/v2/vouchers/statistics/revenue
 * Backend: ⚠️ Check availability
 */
export async function getRevenueStatistics(
  startDate: string,
  endDate: string
): Promise<
  ApiResponse<{
    totalRevenue: number;
    totalTransactions: number;
    averageTransactionValue: number;
    revenueByDay: Array<{
      date: string;
      revenue: number;
      transactions: number;
    }>;
  }>
> {
  return request<
    ApiResponse<{
      totalRevenue: number;
      totalTransactions: number;
      averageTransactionValue: number;
      revenueByDay: Array<{
        date: string;
        revenue: number;
        transactions: number;
      }>;
    }>
  >({
    url: `/${API_ENDPOINT}/statistics/shop`,
    method: "GET",
    params: { startDate, endDate },
  });
}

// ==================== 8. ADMIN UTILITIES ====================

/**
 * 8.1. Get Admin Template Detail (Full info with instances, transactions, stats)
 * Combined call for admin dashboard
 */
export async function getAdminTemplateDetail(
  templateId: string
): Promise<AdminTemplateDetail> {
  try {
    // Parallel requests for better performance
    const [templateRes, infoRes, transactionsRes] = await Promise.allSettled([
      getTemplateById(templateId),
      getVoucherInfo(templateId),
      getTemplateTransactions(templateId).catch(() => ({ data: [] })), // Fallback if not available
    ]);

    const template =
      templateRes.status === "fulfilled" ? templateRes.value.data : null;
    const info = infoRes.status === "fulfilled" ? infoRes.value.data : null;
    const transactions =
      transactionsRes.status === "fulfilled" ? transactionsRes.value.data : [];

    if (!template || !info) {
      throw new Error("Failed to fetch template details");
    }

    // Calculate statistics
    const totalUsage = info.instances.reduce(
      (sum, inst) => sum + inst.usedQuantity,
      0
    );
    const shopInstances = info.instances.filter(
      (i) => i.ownerType === OwnerType.SHOP
    );
    const totalPurchases = (transactions as VoucherTransaction[]).filter(
      (t) => t.type === TransactionType.PURCHASE
    ).length;
    const totalRevenue = (transactions as VoucherTransaction[])
      .filter((t) => t.paymentStatus === PaymentStatus.PAID)
      .reduce((sum, t) => sum + t.totalAmount, 0);

    return {
      ...template,
      instances: info.instances,
      transactions: transactions as VoucherTransaction[],
      applicableObjects: [], // TODO: Fetch if API available
      statistics: {
        totalPurchases,
        totalRevenue,
        totalUsage,
        shopsPurchased: shopInstances.length,
        averageUsagePerShop:
          shopInstances.length > 0 ? totalUsage / shopInstances.length : 0,
      },
    };
  } catch (error) {
    console.error("Error fetching admin template detail:", error);
    throw error;
  }
}

/**
 * 8.2. Bulk Delete Templates
 * DELETE /api/v2/vouchers/templates/bulk
 * Backend: ⚠️ Check availability
 */
export async function bulkDeleteTemplates(
  templateIds: string[]
): Promise<ApiResponse<{ deletedCount: number; failedIds: string[] }>> {
  return request<ApiResponse<{ deletedCount: number; failedIds: string[] }>>({
    url: `/${API_ENDPOINT}/templates/bulk`,
    method: "DELETE",
    data: { templateIds },
  });
}

/**
 * 8.3. Bulk Update Template Status
 * PATCH /api/v2/vouchers/templates/bulk-status
 * Backend: ⚠️ Check availability
 */
export async function bulkToggleTemplateStatus(
  templateIds: string[],
  active: boolean
): Promise<ApiResponse<{ updatedCount: number; failedIds: string[] }>> {
  return request<ApiResponse<{ updatedCount: number; failedIds: string[] }>>({
    url: `/${API_ENDPOINT}/templates/bulk-status`,
    method: "PATCH",
    data: { templateIds, active },
  });
}

/**
 * 8.4. Export Templates to CSV
 * GET /api/v2/vouchers/templates/export
 * Backend: ⚠️ Check availability
 */
export async function exportTemplates(
  params: SearchTemplatesRequest
): Promise<Blob> {
  return request<Blob>({
    url: `/${API_ENDPOINT}/templates/export`,
    method: "GET",
    params,
    responseType: "blob",
  });
}

/**
 * 8.5. Import Templates from CSV
 * POST /api/v2/vouchers/templates/import
 * Backend: ⚠️ Check availability
 */
export async function importTemplates(
  file: File
): Promise<
  ApiResponse<{ importedCount: number; failedCount: number; errors: string[] }>
> {
  const formData = new FormData();
  formData.append("file", file);

  return request<
    ApiResponse<{
      importedCount: number;
      failedCount: number;
      errors: string[];
    }>
  >({
    url: `/${API_ENDPOINT}/templates/import`,
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// ==================== SUMMARY ====================

/**
 * COMPLETE V2 SERVICE - 40+ APIs
 *
 * ✅ Backend có (11 APIs):
 * - createPlatformTemplate
 * - createPlatformDirectVoucher
 * - deleteTemplate
 * - purchaseTemplate
 * - usePlatformVoucher
 * - useVoucherInstance
 * - checkVoucherUsage
 * - validateVouchers
 * - getTemplateById
 * - getVoucherInfo
 * - searchTemplates
 * - getRecommendedPlatformVouchers
 *
 * ⚠️ Cần check backend (29 APIs):
 * - updateTemplate
 * - toggleTemplateStatus
 * - grantVoucher
 * - getInstanceById
 * - getTemplateInstances
 * - getShopInstances
 * - validateVoucherByCode
 * - getTemplateByCode
 * - getTemplatesByDateRange
 * - getApplicableTemplates
 * - getRecommendedShopVouchers
 * - getPopularTemplates
 * - getTransactionById
 * - getTemplateTransactions
 * - getShopTransactions
 * - getTransactionsByDateRange
 * - getVoucherStatistics
 * - getTemplateStatistics
 * - getRevenueStatistics
 * - bulkDeleteTemplates
 * - bulkToggleTemplateStatus
 * - exportTemplates
 * - importTemplates
 *
 * Frontend helper:
 * - getAdminTemplateDetail (Combines multiple APIs)
 */
