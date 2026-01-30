/**
 * useBanner Hook
 * Custom hook for Banner Management
 */
"use client";

import { useState, useCallback, useRef } from "react";
import { useToast } from "@/hooks/useToast";
import bannerService from "../_services/banner.service";
import type {
  BannerResponseDTO,
  CreateBannerRequest,
  UpdateBannerRequest,
  SearchBannersParams,
  ToggleActiveRequest,
} from "@/app/(main)/(home)/_types/banner.dto";
import { PageDTO } from "@/types/product/pagination.dto";

export function useBanner() {
  const [loading, setLoading] = useState(false);
  const { success: ToastSuccess, error: ToastError } = useToast();
  const [banners, setBanners] = useState<BannerResponseDTO[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const isFetchingRef = useRef(false);
  const lastFetchParamsRef = useRef<{
    locale?: string;
    page: number;
    size: number;
    keyword?: string;
    active?: boolean;
    categoryIds?: string[];
  } | null>(null);

  // ==================== FETCH LIST ====================

  const fetchBanners = useCallback(
    async (
      locale?: string,
      page: number = 0,
      size: number = 20,
      force: boolean = false,
    ) => {
      const currentParams = { locale, page, size };

      if (isFetchingRef.current && !force) {
        return;
      }

      if (
        !force &&
        lastFetchParamsRef.current &&
        lastFetchParamsRef.current.locale === currentParams.locale &&
        lastFetchParamsRef.current.page === currentParams.page &&
        lastFetchParamsRef.current.size === currentParams.size &&
        !lastFetchParamsRef.current.keyword
      ) {
        return;
      }

      isFetchingRef.current = true;
      lastFetchParamsRef.current = currentParams;
      setLoading(true);
      try {
        const data = await bannerService.list(locale, page, size);
        setBanners(data.content);
        setTotalElements(data.totalElements);
        setTotalPages(data.totalPages);
      } catch (error: any) {
        ToastError(error.message || "Lỗi khi tải danh sách banner");
        setBanners([]);
        lastFetchParamsRef.current = null;
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    },
    [],
  );

  // ==================== SEARCH ====================

  const searchBanners = useCallback(
    async (
      params: SearchBannersParams,
      force: boolean = false,
    ): Promise<PageDTO<BannerResponseDTO>> => {
      const currentParams = {
        locale: params.locale,
        page: params.page ?? 0,
        size: params.size ?? 20,
        keyword: params.keyword,
        active: params.active,
        categoryIds: params.categoryIds,
      };

      if (isFetchingRef.current && !force) {
        return {
          content: banners,
          totalElements,
          totalPages,
        } as PageDTO<BannerResponseDTO>;
      }

      if (
        !force &&
        lastFetchParamsRef.current &&
        lastFetchParamsRef.current.locale === currentParams.locale &&
        lastFetchParamsRef.current.page === currentParams.page &&
        lastFetchParamsRef.current.size === currentParams.size &&
        lastFetchParamsRef.current.keyword === currentParams.keyword &&
        lastFetchParamsRef.current.active === currentParams.active &&
        JSON.stringify(lastFetchParamsRef.current.categoryIds || []) ===
          JSON.stringify(currentParams.categoryIds || [])
      ) {
        return {
          content: banners,
          totalElements,
          totalPages,
        } as PageDTO<BannerResponseDTO>;
      }

      isFetchingRef.current = true;
      lastFetchParamsRef.current = currentParams;
      setLoading(true);
      try {
        const data = await bannerService.search(params);
        setBanners(data.content);
        setTotalElements(data.totalElements);
        setTotalPages(data.totalPages);
        return data;
      } catch (error: any) {
        ToastError(error.message || "Lỗi khi tìm kiếm banner");
        setBanners([]);
        lastFetchParamsRef.current = null;
        return {
          content: [],
          totalElements: 0,
          totalPages: 0,
          pageable: {
            pageNumber: currentParams.page,
            pageSize: currentParams.size,
            paged: true,
          },
        } as PageDTO<BannerResponseDTO>;
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    },
    [banners, totalElements, totalPages],
  );

  // ==================== FETCH BY ID ====================

  const fetchBannerById = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const data = await bannerService.getById(id);
      return data;
    } catch (error: any) {
      ToastError(error.message || "Lỗi khi tải thông tin banner");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== FETCH DELETED ====================

  const fetchDeletedBanners = useCallback(
    async (page: number = 0, size: number = 20) => {
      setLoading(true);
      try {
        const data = await bannerService.getDeleted(page, size);
        setBanners(data.content);
        setTotalElements(data.totalElements);
        setTotalPages(data.totalPages);
      } catch (error: any) {
        ToastError(error.message || "Lỗi khi tải danh sách banner đã xóa");
        setBanners([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // ==================== CREATE ====================

  const createBanner = useCallback(
    async (data: CreateBannerRequest): Promise<boolean> => {
      setLoading(true);
      try {
        await bannerService.create(data);
        ToastSuccess("Tạo banner thành công!");
        return true;
      } catch (error: any) {
        ToastError(error.message || "Lỗi khi tạo banner");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // ==================== UPDATE ====================

  const updateBanner = useCallback(
    async (
      id: string,
      data: UpdateBannerRequest,
      etag: string,
    ): Promise<boolean> => {
      setLoading(true);
      try {
        await bannerService.update(id, data, etag);
        ToastSuccess("Cập nhật banner thành công!");
        return true;
      } catch (error: any) {
        if (error.response?.status === 409 || error.code === 13001) {
          ToastError(
            "Dữ liệu đã bị thay đổi bởi người khác. Vui lòng tải lại trang!",
          );
        } else {
          ToastError(error.message || "Lỗi khi cập nhật banner");
        }
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // ==================== TOGGLE ACTIVE ====================

  const toggleActive = useCallback(
    async (
      id: string,
      data: ToggleActiveRequest,
      etag: string,
    ): Promise<boolean> => {
      setLoading(true);
      try {
        await bannerService.toggleActive(id, data, etag);
        ToastSuccess(
          `Banner đã được ${data.active ? "kích hoạt" : "vô hiệu hóa"}!`,
        );
        return true;
      } catch (error: any) {
        if (error.response?.status === 409 || error.code === 13001) {
          ToastError(
            "Dữ liệu đã bị thay đổi bởi người khác. Vui lòng tải lại trang!",
          );
        } else {
          ToastError(error.message || "Lỗi khi cập nhật trạng thái banner");
        }
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // ==================== DELETE ====================

  const deleteBanner = useCallback(
    async (id: string, etag: string): Promise<boolean> => {
      setLoading(true);
      try {
        await bannerService.delete(id, etag);
        ToastSuccess("Xóa banner thành công!");
        return true;
      } catch (error: any) {
        if (error.response?.status === 409 || error.code === 13001) {
          ToastError(
            "Dữ liệu đã bị thay đổi bởi người khác. Vui lòng tải lại trang!",
          );
        } else {
          ToastError(error.message || "Lỗi khi xóa banner");
        }
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // ==================== RESTORE ====================

  const restoreBanner = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      await bannerService.restore(id);
      ToastSuccess("Khôi phục banner thành công!");
      return true;
    } catch (error: any) {
      ToastError(error.message || "Lỗi khi khôi phục banner");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // State
    loading,
    banners,
    totalElements,
    totalPages,

    // Methods
    fetchBanners,
    searchBanners,
    fetchBannerById,
    fetchDeletedBanners,
    createBanner,
    updateBanner,
    toggleActive,
    deleteBanner,
    restoreBanner,
  };
}
