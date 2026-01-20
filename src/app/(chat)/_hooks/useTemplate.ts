/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  getShopSettings,
  updateShopSettings,
  createTemplate,
  getTemplates,
  updateTemplate,
  deleteTemplate,
  searchTemplates,
  getTemplatesByCategory,
} from "../_services";
import {
  CreateTemplateRequest,
  UpdateTemplateRequest,
  GetTemplatesRequest,
  UpdateShopChatSettingsRequest,
} from "../_types/chat.dto";
import { useToast } from "@/hooks/useToast";

/**
 * Hook để lấy cài đặt chat của shop
 */
export function useGetShopSettings() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetShopSettings = async (): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getShopSettings();
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy cài đặt shop thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetShopSettings, loading, error };
}

/**
 * Hook để cập nhật cài đặt chat của shop
 */
export function useUpdateShopSettings() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { success: messageSuccess, error: messageError } = useToast();

  const handleUpdateShopSettings = async (
    payload: UpdateShopChatSettingsRequest
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateShopSettings(payload);
      if (res.success) {
        messageSuccess("Cập nhật cài đặt shop thành công");
      }
      return res;
    } catch (err: any) {
      setError(err?.message || "Cập nhật cài đặt shop thất bại");
      messageError(err?.message || "Cập nhật cài đặt shop thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdateShopSettings, loading, error };
}

/**
 * Hook để tạo template trả lời nhanh
 */
export function useCreateTemplate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { success: messageSuccess, error: messageError } = useToast();

  const handleCreateTemplate = async (
    payload: CreateTemplateRequest
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await createTemplate(payload);
      if (res.success) {
        messageSuccess("Tạo template thành công");
      }
      return res;
    } catch (err: any) {
      setError(err?.message || "Tạo template thất bại");
      messageError(err?.message || "Tạo template thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleCreateTemplate, loading, error };
}

/**
 * Hook để lấy danh sách templates
 */
export function useGetTemplates() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetTemplates = async (
    payload: GetTemplatesRequest = {}
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTemplates(payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy danh sách template thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetTemplates, loading, error };
}

/**
 * Hook để cập nhật template
 */
export function useUpdateTemplate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { success: messageSuccess, error: messageError } = useToast();

  const handleUpdateTemplate = async (
    templateId: string,
    payload: UpdateTemplateRequest
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateTemplate(templateId, payload);
      if (res.success) {
        messageSuccess("Cập nhật template thành công");
      }
      return res;
    } catch (err: any) {
      setError(err?.message || "Cập nhật template thất bại");
      messageError(err?.message || "Cập nhật template thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdateTemplate, loading, error };
}

/**
 * Hook để xóa template
 */
export function useDeleteTemplate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { success: messageSuccess, error: messageError } = useToast();

  const handleDeleteTemplate = async (templateId: string): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await deleteTemplate(templateId);
      if (res.success) {
        messageSuccess("Xóa template thành công");
      }
      return res;
    } catch (err: any) {
      setError(err?.message || "Xóa template thất bại");
      messageError(err?.message || "Xóa template thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleDeleteTemplate, loading, error };
}

/**
 * Hook để tìm kiếm templates
 */
export function useSearchTemplates() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearchTemplates = async (keyword: string): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await searchTemplates(keyword);
      return res;
    } catch (err: any) {
      setError(err?.message || "Tìm kiếm template thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleSearchTemplates, loading, error };
}

/**
 * Hook để lấy templates theo category
 */
export function useGetTemplatesByCategory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetTemplatesByCategory = async (
    category: string
  ): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTemplatesByCategory(category);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy template theo category thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetTemplatesByCategory, loading, error };
}

