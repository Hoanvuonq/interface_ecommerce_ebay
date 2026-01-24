"use client";

import { useState } from "react";
import * as voucherV2Service from "../_services/voucher-v2.service";
import type {
  CreatePlatformTemplateRequest,
  CreatePlatformDirectRequest,
  SearchTemplatesRequest,
  ValidateVouchersRequest,
} from "../_types/voucher-v2.type";

export const useCreatePlatformTemplate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (request: CreatePlatformTemplateRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await voucherV2Service.createPlatformTemplate(request);
      return response;
    } catch (err: unknown) {
      const errorMessage =
        (err as Error).message || "Failed to create template";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
};

export const useCreatePlatformDirectTemplate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (request: CreatePlatformDirectRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response =
        await voucherV2Service.createPlatformDirectVoucher(request);
      return response;
    } catch (err: unknown) {
      const errorMessage =
        (err as Error).message || "Failed to create direct template";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
};

// ==================== USE VOUCHER ====================

export const useUsePlatformVoucher = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const use = async (templateId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await voucherV2Service.usePlatformVoucher(templateId);
      return response;
    } catch (err: unknown) {
      const errorMessage =
        (err as Error).message || "Failed to use platform voucher";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { use, loading, error };
};

export const useUseVoucherInstance = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const use = async (instanceId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await voucherV2Service.useVoucherInstance(instanceId);
      return response;
    } catch (err: unknown) {
      const errorMessage =
        (err as Error).message || "Failed to use voucher instance";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { use, loading, error };
};

// ==================== GET INFORMATION ====================

export const useGetVoucherInfo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const get = async (templateId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await voucherV2Service.getVoucherInfo(templateId);
      return response;
    } catch (err: unknown) {
      const errorMessage =
        (err as Error).message || "Failed to get voucher info";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { get, loading, error };
};

export const useSearchVoucherTemplates = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (params: SearchTemplatesRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await voucherV2Service.searchTemplates(params);
      return response;
    } catch (err: unknown) {
      const errorMessage =
        (err as Error).message || "Failed to search templates";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { search, loading, error };
};

export const useGetRecommendedPlatformVouchers = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const get = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await voucherV2Service.getRecommendedPlatformVouchers();
      return response;
    } catch (err: unknown) {
      const errorMessage =
        (err as Error).message || "Failed to get recommended vouchers";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { get, loading, error };
};

export const useCheckVoucherUsage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const check = async (templateId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await voucherV2Service.checkVoucherUsage(templateId);
      return response;
    } catch (err: unknown) {
      const errorMessage = (err as Error).message || "Failed to check usage";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { check, loading, error };
};

export const useGetTemplateDetail = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const get = async (templateId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await voucherV2Service.getTemplateById(templateId);
      return response;
    } catch (err: unknown) {
      const errorMessage =
        (err as Error).message || "Failed to get template detail";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { get, loading, error };
};

export const useGetAdminTemplateDetail = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const get = async (templateId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response =
        await voucherV2Service.getAdminTemplateDetail(templateId);
      return response;
    } catch (err: unknown) {
      const errorMessage =
        (err as Error).message || "Failed to get admin template detail";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { get, loading, error };
};

// ==================== VALIDATE ====================

export const useValidateVouchers = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = async (request: ValidateVouchersRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await voucherV2Service.validateVouchers(request);
      return response;
    } catch (err: unknown) {
      const errorMessage =
        (err as Error).message || "Failed to validate vouchers";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { validate, loading, error };
};

// ==================== DELETE ====================

export const useDeleteTemplate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTemplate = async (templateId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await voucherV2Service.deleteTemplate(templateId);
      return response;
    } catch (err: unknown) {
      const errorMessage =
        (err as Error).message || "Failed to delete template";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteTemplate, loading, error };
};

// ==================== UPDATE STATUS ====================

export const useUpdateTemplateStatus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (templateId: string, active: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const response = await voucherV2Service.toggleTemplateStatus(
        templateId,
        active,
      );
      return response;
    } catch (err: unknown) {
      const errorMessage = (err as Error).message || "Failed to update status";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
};
