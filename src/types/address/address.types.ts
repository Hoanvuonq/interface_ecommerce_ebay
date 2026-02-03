export interface CountryResponse {
  code: string;
  name: string;
  fullName: string;
  totalProvinces: number;
}

export interface ProvinceResponse {
  id: string;
  code: string;
  fullName: string;
  totalWards: number;
}

export interface WardResponse {
  id: string;
  code: string;
  fullName: string;
  provinceCode: string;
  province?: ProvinceResponse;
}

export interface PageDto<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface GetProvincesParams {
  page?: number;
  size?: number;
  search?: string;
}

export interface GetWardsParams {
  page?: number;
  size?: number;
  search?: string;
}

export interface ImportResult {
  provinceCount: number;
  wardCount: number;
  success: boolean;
  message: string;
}

export interface AddressStatisticsResponse {
  totalProvinces: number;
  totalWards: number;
  generatedAt: string;
}
