/**
 * Address Service - API calls cho địa chỉ hành chính Việt Nam
 * Public API - Không cần authentication
 */

import { request } from '@/utils/axios.customize';
import type { ApiResponse } from '@/api/_types/api.types';
import type {
  CountryResponse,
  ProvinceResponse,
  WardResponse,
  PageDto,
  GetProvincesParams,
  GetWardsParams,
}  from '@/types/address/address.types';
const ADDRESS_API_BASE = '/v1/address';

class AddressService {
  // ========== Country Management ==========

  /**
   * Lấy thông tin quốc gia (Việt Nam)
   */
  async getCountryInfo(): Promise<ApiResponse<CountryResponse>> {
    const response = await request<ApiResponse<CountryResponse>>({
      url: `${ADDRESS_API_BASE}/country`,
      method: 'GET',
    });
    return response as ApiResponse<CountryResponse>;
  }

  // ========== Province Management ==========

  /**
   * Lấy danh sách tất cả tỉnh/thành phố
   * @param params - Pagination và search parameters
   */
  async getAllProvinces(params?: GetProvincesParams): Promise<ApiResponse<PageDto<ProvinceResponse>>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page !== undefined) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.size !== undefined) {
      queryParams.append('size', params.size.toString());
    }
    if (params?.search) {
      queryParams.append('search', params.search);
    }

    const url = `${ADDRESS_API_BASE}/provinces${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await request<ApiResponse<PageDto<ProvinceResponse>>>({
      url,
      method: 'GET',
    });
    return response as ApiResponse<PageDto<ProvinceResponse>>;
  }

  /**
   * Lấy chi tiết tỉnh/thành phố theo code
   * @param code - Mã tỉnh/thành phố (ví dụ: "01", "79")
   */
  async getProvinceByCode(code: string): Promise<ApiResponse<ProvinceResponse>> {
    const response = await request<ApiResponse<ProvinceResponse>>({
      url: `${ADDRESS_API_BASE}/provinces/${code}`,
      method: 'GET',
    });
    return response as ApiResponse<ProvinceResponse>;
  }

  // ========== Ward Management ==========

  /**
   * Lấy danh sách phường/xã theo mã tỉnh/thành phố
   * @param provinceCode - Mã tỉnh/thành phố
   * @param params - Pagination và search parameters
   */
  async getWardsByProvinceCode(
    provinceCode: string,
    params?: GetWardsParams
  ): Promise<ApiResponse<PageDto<WardResponse>>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page !== undefined) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.size !== undefined) {
      queryParams.append('size', params.size.toString());
    }
    if (params?.search) {
      queryParams.append('search', params.search);
    }

    const url = `${ADDRESS_API_BASE}/provinces/${provinceCode}/wards${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await request<ApiResponse<PageDto<WardResponse>>>({
      url,
      method: 'GET',
    });
    return response as ApiResponse<PageDto<WardResponse>>;
  }

  /**
   * Lấy chi tiết phường/xã theo code
   * @param code - Mã phường/xã (ví dụ: "00004")
   */
  async getWardByCode(code: string): Promise<ApiResponse<WardResponse>> {
    const response = await request<ApiResponse<WardResponse>>({
      url: `${ADDRESS_API_BASE}/wards/${code}`,
      method: 'GET',
    });
    return response as ApiResponse<WardResponse>;
  }
}

export const addressService = new AddressService();
export default addressService;

