import { request } from "@/utils/axios.customize";
import { ApiResponseDTO } from "@/types/pagination.dto";
import {
  BannerResponseDTO,
  GetActiveBannersParams,
  GroupedBannerResponse,
  GetBannersByPageParams,
} from "../_types/banner.dto";

const API_ENDPOINT_HOMEPAGE_BANNERS = "v1/homepage/banners";

export const homepageService = {
  /**
   * Get active banners for homepage
   * Public endpoint - no authentication required
   */
  getActiveBanners(params?: GetActiveBannersParams) {
    return request<ApiResponseDTO<BannerResponseDTO[]>>({
      method: "GET",
      url: `/${API_ENDPOINT_HOMEPAGE_BANNERS}/active`,
      params,
    });
  },

  /**
   * Get active banners grouped by display location for a specific page
   * Example: getBannersByPage({ page: "HOMEPAGE" }) returns all HOMEPAGE_* banners grouped by location
   * Public endpoint - no authentication required
   * 
   * Note: API này KHÔNG hỗ trợ pagination (không có page/size params)
   * - page: tên trang (String) như "HOMEPAGE", "PRODUCT_PAGE", etc. (sẽ được gửi dưới dạng "prePage" parameter)
   * - locale: locale code (String)
   * - device: device type (String) như "DESKTOP", "MOBILE", "ALL"
   * 
   * Backend parameter: "prePage" (không phải "page" để tránh conflict với pagination)
   */
  getBannersByPage(params?: GetBannersByPageParams) {
    // Build query string thủ công để đảm bảo KHÔNG có page/size pagination params
    // prePage ở đây là tên trang (String), KHÔNG phải số trang
    const queryParams = new URLSearchParams();

    // prePage: tên trang (String) như "HOMEPAGE", "PRODUCT_PAGE", etc.
    // Backend đang dùng "prePage" parameter
    const pageName = params?.page || 'HOMEPAGE';
    queryParams.append('prePage', pageName); // Backend dùng "prePage" không phải "page"

    if (params?.locale) {
      queryParams.append('locale', params.locale);
    }

    if (params?.device) {
      queryParams.append('device', params.device);
    }

    // Build URL với query string thủ công để tránh axios tự động thêm params
    const queryString = queryParams.toString();
    const url = `/${API_ENDPOINT_HOMEPAGE_BANNERS}/active/by-page${queryString ? `?${queryString}` : ''}`;

    // Debug log để kiểm tra URL
    if (process.env.NODE_ENV === 'development') {
      console.log('[homepageService.getBannersByPage] Request URL:', url);
      console.log('[homepageService.getBannersByPage] Params received:', params);
    }

    return request<ApiResponseDTO<GroupedBannerResponse>>({
      method: "GET",
      url,
      // KHÔNG truyền params object để tránh axios tự động thêm params khác
      // URL đã được build đầy đủ với query string
      params: undefined, // Explicitly set to undefined để đảm bảo không có params nào khác
    });
  },

  /**
   * Get category-specific banners (or global banners as fallback)
   * Public endpoint - no authentication required
   */
  getCategoryBanners(categoryId: string, displayLocation: string = 'CATEGORY_PAGE_TOP') {
    return request<ApiResponseDTO<BannerResponseDTO[]>>({
      method: "GET",
      url: `/${API_ENDPOINT_HOMEPAGE_BANNERS}/active`,
      params: {
        categoryId,
        displayLocation,
      },
    });
  },
};
