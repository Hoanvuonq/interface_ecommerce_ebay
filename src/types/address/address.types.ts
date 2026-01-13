/**
 * Address Feature Types
 * Types cho địa chỉ hành chính Việt Nam
 */

/**
 * Country Response - Thông tin quốc gia
 */
export interface CountryResponse {
  code: string;
  name: string;
  fullName: string;
  totalProvinces: number;
}

/**
 * Province Response - Thông tin tỉnh/thành phố
 */
export interface ProvinceResponse {
  id: string;
  code: string;
  fullName: string;
  totalWards: number;
}

/**
 * Ward Response - Thông tin phường/xã
 */
export interface WardResponse {
  id: string;
  code: string;
  fullName: string;
  provinceCode: string;
  province?: ProvinceResponse; // Optional: thông tin province
}

/**
 * Page DTO - Pagination response
 * Match với backend PageDto structure
 */
export interface PageDto<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Get Provinces Request Parameters
 */
export interface GetProvincesParams {
  page?: number;
  size?: number;
  search?: string;
}

/**
 * Get Wards Request Parameters
 */
export interface GetWardsParams {
  page?: number;
  size?: number;
  search?: string;
}

/**
 * Import Result - Kết quả import dữ liệu
 */
export interface ImportResult {
  provinceCount: number;
  wardCount: number;
  success: boolean;
  message: string;
}

/**
 * Address Statistics Response - Thống kê địa chỉ
 */
export interface AddressStatisticsResponse {
  totalProvinces: number;
  totalWards: number;
  generatedAt: string; // ISO date string
}

