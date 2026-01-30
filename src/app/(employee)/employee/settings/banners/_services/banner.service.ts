/**
 * Banner Service for Manager
 * API Base URL: /api/v1/homepage/banners
 */

import { request } from "@/utils/axios.customize";
import { ApiResponseDTO, PageDTO } from "@/types/product/pagination.dto";
import type {
  BannerResponseDTO,
  CreateBannerRequest,
  UpdateBannerRequest,
  SearchBannersParams,
  ToggleActiveRequest,
} from "@/app/(main)/(home)/_types/banner.dto";
import axios from "axios";

const BANNER_API_BASE = "/v1/homepage/banners";

class BannerService {
  // ==================== CREATE ====================

  /**
   * Tạo banner mới
   * POST /api/v1/homepage/banners
   */
  async create(
    data: CreateBannerRequest,
  ): Promise<ApiResponseDTO<BannerResponseDTO>> {
    return request({
      url: BANNER_API_BASE,
      method: "POST",
      data,
    });
  }

  // ==================== READ ====================

  /**
   * Lấy banner theo ID
   * GET /api/v1/homepage/banners/{id}
   * Response có ETag header
   */
  async getById(id: string): Promise<BannerResponseDTO> {
    // Use axios instance directly to get full response with headers
    // Bypass the interceptor that returns only data
    const API_BASE_URL =
      (process.env.NEXT_PUBLIC_BACKEND_URL ||
        "https://raising-latina-candy-ribbon.trycloudflare.com") + "/api";

    // ✅ Backend tự đọc token từ cookies, không cần Authorization header
    const fullResponse = await axios.get(
      `${API_BASE_URL}${BANNER_API_BASE}/${id}`,
      {
        withCredentials: true,
      },
    );

    console.log("getById raw response:", {
      status: fullResponse.status,
      headers: fullResponse.headers,
      data: fullResponse.data,
    });

    // Get ETag from response headers if available
    const etag =
      fullResponse.headers?.["etag"] || fullResponse.headers?.["ETag"];

    // Parse response data - Backend returns: { success, code, message, data: BannerResponseDTO }
    const responseData = fullResponse.data;
    let bannerData: BannerResponseDTO;

    if (responseData?.data) {
      // Standard API response format
      bannerData = responseData.data;
    } else if (responseData?.id) {
      // Direct banner data
      bannerData = responseData;
    } else {
      throw new Error("Invalid response format from getById API");
    }

    // Check if version exists in data first (version can be 0, so check for undefined/null)
    if (
      (bannerData.version === undefined || bannerData.version === null) &&
      etag
    ) {
      // ETag format is usually "version" or W/"version" or "W/\"version\""
      const cleanEtag = etag.replace(/"/g, "").replace(/^W\//, "");
      const versionMatch = cleanEtag.match(/(\d+)/);
      if (versionMatch) {
        bannerData.version = parseInt(versionMatch[1], 10);
        console.log("Extracted version from ETag:", bannerData.version);
      }
    }

    // Ensure version is set (even if it's 0)
    if (bannerData.version === undefined || bannerData.version === null) {
      console.warn(
        "WARNING: Banner data does not have version field, setting to 0 as fallback",
      );
      bannerData.version = 0;
    }

    console.log("getById final result:", {
      id,
      version: bannerData.version,
      etag,
      hasVersion:
        bannerData.version !== undefined && bannerData.version !== null,
      versionType: typeof bannerData.version,
      bannerDataKeys: Object.keys(bannerData),
    });

    return bannerData;
  }

  /**
   * Lấy danh sách banners (phân trang)
   * GET /api/v1/homepage/banners?locale=vi&page=0&size=20
   */
  async list(
    locale?: string,
    page: number = 0,
    size: number = 20,
  ): Promise<PageDTO<BannerResponseDTO>> {
    const response: ApiResponseDTO<PageDTO<BannerResponseDTO>> = await request({
      url: BANNER_API_BASE,
      method: "GET",
      params: { locale, page, size },
    });
    return response.data!;
  }

  /**
   * Tìm kiếm banners
   * GET /api/v1/homepage/banners/search?keyword=...&locale=...&active=...
   */
  async search(
    params: SearchBannersParams,
  ): Promise<PageDTO<BannerResponseDTO>> {
    const response: ApiResponseDTO<PageDTO<BannerResponseDTO>> = await request({
      url: `${BANNER_API_BASE}/search`,
      method: "GET",
      params,
    });
    return response.data!;
  }

  /**
   * Lấy danh sách banners đã xóa
   * GET /api/v1/homepage/banners/deleted?page=0&size=20
   */
  async getDeleted(
    page: number = 0,
    size: number = 20,
  ): Promise<PageDTO<BannerResponseDTO>> {
    const response: ApiResponseDTO<PageDTO<BannerResponseDTO>> = await request({
      url: `${BANNER_API_BASE}/deleted`,
      method: "GET",
      params: { page, size },
    });
    return response.data!;
  }

  // ==================== UPDATE ====================

  /**
   * Cập nhật banner (cần ETag)
   * PUT /api/v1/homepage/banners/{id}
   * Requires If-Match header with ETag value
   */
  async update(
    id: string,
    data: UpdateBannerRequest,
    etag: string,
  ): Promise<ApiResponseDTO<BannerResponseDTO>> {
    return request({
      url: `${BANNER_API_BASE}/${id}`,
      method: "PUT",
      data,
      headers: {
        "If-Match": `"${etag}"`,
      },
    });
  }

  /**
   * Toggle active status
   * PUT /api/v1/homepage/banners/{id}/active
   */
  async toggleActive(
    id: string,
    data: ToggleActiveRequest,
    etag: string,
  ): Promise<ApiResponseDTO<BannerResponseDTO>> {
    return request({
      url: `${BANNER_API_BASE}/${id}/active`,
      method: "PUT",
      data,
      headers: {
        "If-Match": `"${etag}"`,
      },
    });
  }

  // ==================== DELETE ====================

  /**
   * Xóa banner (soft delete)
   * DELETE /api/v1/homepage/banners/{id}
   * Requires If-Match header
   */
  async delete(id: string, etag: string): Promise<ApiResponseDTO<void>> {
    return request({
      url: `${BANNER_API_BASE}/${id}`,
      method: "DELETE",
      headers: {
        "If-Match": `"${etag}"`,
      },
    });
  }

  /**
   * Khôi phục banner đã xóa
   * POST /api/v1/homepage/banners/{id}/restore
   */
  async restore(id: string): Promise<ApiResponseDTO<BannerResponseDTO>> {
    return request({
      url: `${BANNER_API_BASE}/${id}/restore`,
      method: "POST",
    });
  }
}

export default new BannerService();
