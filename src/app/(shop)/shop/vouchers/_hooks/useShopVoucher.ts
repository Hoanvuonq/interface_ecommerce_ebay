/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import * as React from "react";
import {
  CreateShopVoucherRequest,
  PurchaseVoucherRequest,
  SearchVoucherTemplatesRequest,
  ValidateVouchersRequest,
  RecommendPlatformVouchersResponse,
}  from "@/app/(main)/shop/_types/dto/shop.voucher.dto";
import {
  createShopVoucher,
  purchaseVoucher,
  applyShopVoucher,
  applyVoucherInstance,
  getVoucherInfo,
  searchVoucherTemplates,
  getRecommendedVouchersForShop,
  getRecommendedPlatformVouchers,
  validateVouchers,
  checkVoucherUsage,
  deleteVoucherTemplate,
  updateVoucherTemplate,
  toggleVoucherActive,
  getVoucherStats,
  duplicateVoucher,
} from "@/app/(main)/shop/_service/shop.voucher.service";
import { ApiResponse } from "@/api/_types/api.types";

// ==================== CREATE SHOP VOUCHER ====================

/**
 * Hook: Tạo voucher riêng cho shop
 */
export function useCreateShopVoucher() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateVoucher = async (
    payload: CreateShopVoucherRequest
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await createShopVoucher(payload);
      return res;
    } catch (err: any) {
      // Extract error message from axios response or fallback to generic message
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Tạo voucher thất bại";
      setError(errorMessage);

      // Return the error response so modal can show proper message
      if (err?.response?.data) {
        return err.response.data;
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleCreateVoucher, loading, error };
}

// ==================== PURCHASE VOUCHER ====================

/**
 * Hook: Mua voucher từ template Platform
 */
export function usePurchaseVoucher() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePurchase = async (
    payload: PurchaseVoucherRequest
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await purchaseVoucher(payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Không thể mua voucher");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handlePurchase, loading, error };
}

// ==================== USE VOUCHER ====================

/**
 * Hook: Sử dụng voucher tự tạo
 */
export function useShopVoucherUsage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUseShopVoucher = async (
    templateId: string
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await applyShopVoucher(templateId);
      return res;
    } catch (err: any) {
      setError(err?.message || "Không thể sử dụng voucher");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleUseShopVoucher, loading, error };
}

/**
 * Hook: Sử dụng voucher từ instance đã mua
 */
export function useVoucherInstanceUsage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUseInstance = async (
    instanceId: string
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await applyVoucherInstance(instanceId);
      return res;
    } catch (err: any) {
      setError(err?.message || "Không thể sử dụng voucher");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleUseInstance, loading, error };
}

// ==================== GET VOUCHER INFO ====================

/**
 * Hook: Lấy thông tin chi tiết voucher
 */
export function useGetVoucherInfo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVoucherInfo = async (
    templateId: string
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getVoucherInfo(templateId);
      return res;
    } catch (err: any) {
      setError(err?.message || "Không thể lấy thông tin voucher");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchVoucherInfo, loading, error };
}

// ==================== SEARCH VOUCHER TEMPLATES ====================

/**
 * Hook: Tìm kiếm voucher templates (manual mode)
 */
export function useSearchVoucherTemplates() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchTemplates = async (
    params: SearchVoucherTemplatesRequest
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await searchVoucherTemplates(params);
      return res;
    } catch (err: any) {
      setError(err?.message || "Không thể tìm kiếm voucher");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { searchTemplates, loading, error };
}

// ==================== RECOMMEND VOUCHERS ====================

/**
 * Hook: Lấy danh sách voucher gợi ý cho shop
 */
export function useGetRecommendedVouchers() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);

  const fetchRecommendedForShop =
    async (): Promise<ApiResponse<any> | null> => {
      setLoading(true);
      setError(null);
      try {
        const res = await getRecommendedVouchersForShop();
        if (res.code === 1000) {
          setData(res.data);
        }
        return res;
      } catch (err: any) {
        setError(err?.message || "Không thể lấy danh sách voucher");
        return null;
      } finally {
        setLoading(false);
      }
    };

  return { data, fetchRecommendedForShop, loading, error };
}

/**
 * Hook: Lấy danh sách voucher platform
 */
export function useGetRecommendedPlatformVouchers() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RecommendPlatformVouchersResponse>([]);

  const fetchData = async (): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getRecommendedPlatformVouchers();
      if (res.code === 1000) {
        setData(res.data);
      }
      return res;
    } catch (err: any) {
      setError(err?.message || "Không thể lấy danh sách voucher platform");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchData();
  };

  // Auto fetch on mount
  React.useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch };
}

// ==================== VALIDATE VOUCHERS ====================

/**
 * Hook: Validate nhiều vouchers
 */
export function useValidateVouchers() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateVoucherCodes = async (
    payload: ValidateVouchersRequest
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await validateVouchers(payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Không thể validate voucher");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { validateVoucherCodes, loading, error };
}

// ==================== CHECK VOUCHER USAGE ====================

/**
 * Hook: Kiểm tra voucher có thể sử dụng
 */
export function useCheckVoucherUsage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkUsage = async (
    templateId: string
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await checkVoucherUsage(templateId);
      return res;
    } catch (err: any) {
      setError(err?.message || "Không thể kiểm tra voucher");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { checkUsage, loading, error };
}

// ==================== DELETE VOUCHER ====================

/**
 * Hook: Xóa voucher template
 */
export function useDeleteVoucher() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (
    templateId: string
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await deleteVoucherTemplate(templateId);
      return res;
    } catch (err: any) {
      setError(err?.message || "Không thể xóa voucher");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleDelete, loading, error };
}

// ==================== UPDATE VOUCHER ====================

/**
 * Hook: Cập nhật voucher template
 */
export function useUpdateVoucher() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async (
    templateId: string,
    payload: CreateShopVoucherRequest
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateVoucherTemplate(templateId, payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Không thể cập nhật voucher");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdate, loading, error };
}

// ==================== TOGGLE ACTIVE ====================

/**
 * Hook: Toggle active status voucher
 */
export function useToggleVoucherActive() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = async (
    templateId: string
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await toggleVoucherActive(templateId);
      return res;
    } catch (err: any) {
      setError(err?.message || "Không thể thay đổi trạng thái");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleToggle, loading, error };
}

// ==================== GET VOUCHER STATS ====================

/**
 * Hook: Lấy thống kê voucher
 */
export function useGetVoucherStats() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);

  const fetchStats = async (
    templateId: string
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getVoucherStats(templateId);
      if (res.code === 1000) {
        setStats(res.data);
      }
      return res;
    } catch (err: any) {
      setError(err?.message || "Không thể lấy thống kê");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { stats, fetchStats, loading, error };
}

// ==================== GET ALL VOUCHER STATS ====================

/**
 * Hook: Lấy thống kê của tất cả vouchers shop
 */
export function useGetAllVoucherStats() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allStats, setAllStats] = useState<any[]>([]);

  const fetchAllStats = async (voucherTemplates: any[]) => {
    setLoading(true);
    setError(null);
    try {
      const statsPromises = voucherTemplates.map(async (template) => {
        try {
          const response = await getVoucherStats(template.id);
          if (response.code === 1000) {
            return {
              voucherCode: template.code,
              voucherName: template.name,
              templateId: template.id,
              ...response.data,
            };
          }
        } catch (err) {
          console.error(`Failed to fetch stats for ${template.id}:`, err);
        }
        return null;
      });

      const results = await Promise.all(statsPromises);
      const validStats = results.filter((s) => s !== null);
      setAllStats(validStats);
      return validStats;
    } catch (err: any) {
      setError(err?.message || "Có lỗi xảy ra khi lấy thống kê");
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { allStats, fetchAllStats, loading, error };
}

// ==================== DUPLICATE VOUCHER ====================

/**
 * Hook: Duplicate voucher
 */
export function useDuplicateVoucher() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDuplicate = async (
    templateId: string
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await duplicateVoucher(templateId);
      return res;
    } catch (err: any) {
      setError(err?.message || "Không thể sao chép voucher");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleDuplicate, loading, error };
}