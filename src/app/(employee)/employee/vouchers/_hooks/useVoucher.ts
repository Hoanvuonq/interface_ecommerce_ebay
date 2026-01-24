"use client";

import { useState } from "react";
import {
  VoucherListRequest,
  VoucherCreateRequest,
  VoucherUpdateRequest,
  VoucherObjectUpdateRequest,
  RecommendShopVoucherRequest,
  RecommendPlatformVoucherRequest,
} from "../_types/dto/voucher.dto";
import { VoucherType } from "../_types/voucher.type";
import * as voucherService from "../_services/voucher.service";
 
export const useGetVouchers = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetVouchers = async (filters: VoucherListRequest = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await voucherService.getVouchers(filters);
      return response;
    } catch (err: unknown) {
      const errorMessage = (err as Error).message || "Failed to fetch vouchers";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetVouchers, loading, error };
};

export const useCreateVoucher = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreatePlatformVoucher = async (
    voucherData: VoucherCreateRequest,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await voucherService.createPlatformVoucher(voucherData);
      return response;
    } catch (err: unknown) {
      const errorMessage =
        (err as Error).message || "Failed to create platform voucher";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShopVoucher = async (voucherData: VoucherCreateRequest) => {
    setLoading(true);
    setError(null);

    try {
      const response = await voucherService.createShopVoucher(voucherData);
      return response;
    } catch (err: unknown) {
      const errorMessage =
        (err as Error).message || "Failed to create shop voucher";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    handleCreatePlatformVoucher,
    handleCreateShopVoucher,
    loading,
    error,
  };
};

export const useUpdateVoucher = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateBaseVoucher = async (voucherData: VoucherUpdateRequest) => {
    setLoading(true);
    setError(null);

    try {
      const response = await voucherService.updateBaseVoucher(voucherData);
      return response;
    } catch (err: unknown) {
      const errorMessage =
        (err as Error).message || "Failed to update base voucher";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateObjectVoucher = async (
    voucherData: VoucherObjectUpdateRequest,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await voucherService.updateObjectVoucher(voucherData);
      return response;
    } catch (err: unknown) {
      const errorMessage =
        (err as Error).message || "Failed to update object voucher";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    handleUpdateBaseVoucher,
    handleUpdateObjectVoucher,
    loading,
    error,
  };
};

export const useDeleteVoucher = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteVoucher = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await voucherService.deleteVoucher(id);
      return response;
    } catch (err: unknown) {
      const errorMessage = (err as Error).message || "Failed to delete voucher";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleDeleteVoucher, loading, error };
};

export const useVoucherStatistics = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetVoucherStatistics = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await voucherService.getVoucherStatistics();
      return response;
    } catch (err: unknown) {
      const errorMessage =
        (err as Error).message || "Failed to fetch voucher statistics";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetVoucherStatistics, loading, error };
};

export const useVoucherTimeStats = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetVoucherTimeStats = async (year: number, month: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await voucherService.getVoucherTimeStats(year, month);
      return response;
    } catch (err: unknown) {
      const errorMessage =
        (err as Error).message || "Failed to fetch voucher time statistics";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetVoucherTimeStats, loading, error };
};

export const useVoucherBehaviorStats = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetVoucherBehaviorStats = async (year: number, month: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await voucherService.getVoucherBehaviorStats(
        year,
        month,
      );
      return response;
    } catch (err: unknown) {
      const errorMessage =
        (err as Error).message || "Failed to fetch voucher behavior statistics";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetVoucherBehaviorStats, loading, error };
};

export const useVoucherActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleActivateVoucher = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await voucherService.activateVoucher(id);
      return response;
    } catch (err: unknown) {
      const errorMessage =
        (err as Error).message || "Failed to activate voucher";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateVoucher = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await voucherService.deactivateVoucher(id);
      return response;
    } catch (err: unknown) {
      const errorMessage =
        (err as Error).message || "Failed to deactivate voucher";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleVoucher = async (id: string, scheduledTime: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await voucherService.scheduleVoucher({
        id,
        scheduledTime,
      });
      return response;
    } catch (err: unknown) {
      const errorMessage =
        (err as Error).message || "Failed to schedule voucher";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleArchiveVoucher = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await voucherService.archiveVoucher(id);
      return response;
    } catch (err: unknown) {
      const errorMessage =
        (err as Error).message || "Failed to archive voucher";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    handleActivateVoucher,
    handleDeactivateVoucher,
    handleScheduleVoucher,
    handleArchiveVoucher,
    loading,
    error,
  };
};

export const useGetVoucherById = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetVoucherById = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await voucherService.getVoucherById(id);
      return response;
    } catch (err: unknown) {
      const errorMessage =
        (err as Error).message || "Failed to fetch voucher by ID";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetVoucherById, loading, error };
};

export const useGetVouchersByObject = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetVouchersByObject = async (
    objectIds: string[],
    voucherType: VoucherType,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await voucherService.getVouchersByObject(
        objectIds,
        voucherType,
      );
      return response;
    } catch (err: unknown) {
      const errorMessage =
        (err as Error).message || "Failed to fetch vouchers by object";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetVouchersByObject, loading, error };
};

export const useGetVoucherByCode = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetVoucherByCode = async (code: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await voucherService.getVoucherByCode(code);
      return response;
    } catch (err: unknown) {
      const errorMessage =
        (err as Error).message || "Failed to fetch voucher by code";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetVoucherByCode, loading, error };
};

export const useGetVouchersByDateRange = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetVouchersByDateRange = async (
    from: string,
    to: string,
    mode?: string,
    type?: VoucherType,
    status?: string,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await voucherService.getVouchersByDateRange(
        from,
        to,
        mode,
        type,
        status,
      );
      return response;
    } catch (err: unknown) {
      const errorMessage =
        (err as Error).message || "Failed to fetch vouchers by date range";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetVouchersByDateRange, loading, error };
};

export const useRecommendShopVouchers = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRecommendShopVouchers = async (
    payload: RecommendShopVoucherRequest,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await voucherService.recommendShopVouchers(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage =
        (err as Error).message || "Failed to recommend shop vouchers";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleRecommendShopVouchers, loading, error };
};

export const useRecommendPlatformVouchers = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRecommendPlatformVouchers = async (
    payload: RecommendPlatformVoucherRequest,
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await voucherService.recommendPlatformVouchers(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage =
        (err as Error).message || "Failed to recommend platform vouchers";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleRecommendPlatformVouchers, loading, error };
};
