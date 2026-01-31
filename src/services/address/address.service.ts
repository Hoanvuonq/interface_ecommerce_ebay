import { request } from "@/utils/axios.customize";
import type { ApiResponse } from "@/api/_types/api.types";
import type {
  CountryResponse,
  ProvinceResponse,
  WardResponse,
  PageDto,
  GetProvincesParams,
  GetWardsParams,
} from "@/types/address/address.types";
const ADDRESS_API_BASE = "/v1/address";

class AddressService {
  async getCountryInfo(): Promise<ApiResponse<CountryResponse>> {
    const response = await request<ApiResponse<CountryResponse>>({
      url: `${ADDRESS_API_BASE}/country`,
      method: "GET",
    });
    return response as ApiResponse<CountryResponse>;
  }

  async getAllProvinces(): Promise<ApiResponse<PageDto<ProvinceResponse>>> {
    const queryParams = new URLSearchParams();
    const url = `${ADDRESS_API_BASE}/provinces${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await request<ApiResponse<PageDto<ProvinceResponse>>>({
      url,
      method: "GET",
    });
    return response as ApiResponse<PageDto<ProvinceResponse>>;
  }

  async getProvinceByCode(
    code: string,
  ): Promise<ApiResponse<ProvinceResponse>> {
    const response = await request<ApiResponse<ProvinceResponse>>({
      url: `${ADDRESS_API_BASE}/provinces/${code}`,
      method: "GET",
    });
    return response as ApiResponse<ProvinceResponse>;
  }

  async getWardsByProvinceCode(
    provinceCode: string,
  ): Promise<ApiResponse<PageDto<WardResponse>>> {
    const queryParams = new URLSearchParams();
    const url = `${ADDRESS_API_BASE}/provinces/${provinceCode}/wards${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await request<ApiResponse<PageDto<WardResponse>>>({
      url,
      method: "GET",
    });
    return response as ApiResponse<PageDto<WardResponse>>;
  }

  async getWardByCode(code: string): Promise<ApiResponse<WardResponse>> {
    const response = await request<ApiResponse<WardResponse>>({
      url: `${ADDRESS_API_BASE}/wards/${code}`,
      method: "GET",
    });
    return response as ApiResponse<WardResponse>;
  }
}

export const addressService = new AddressService();
export default addressService;
