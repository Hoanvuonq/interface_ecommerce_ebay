import { request } from "@/utils/axios.customize";
import type {
  BuyerAddressCreateRequest,
  BuyerAddressUpdateRequest,
  BuyerAddressResponseNew, // Sử dụng Type mới cho toàn bộ
} from "@/types/buyer/buyer.types";
import type { ApiResponse } from "@/api/_types/api.types";

class BuyerAddressService {
  async createAddress(
    addressData: BuyerAddressCreateRequest,
  ): Promise<ApiResponse<BuyerAddressResponseNew>> {
    const response: ApiResponse<BuyerAddressResponseNew> = await request({
      url: `/v1/buyer/addresses`,
      method: "POST",
      data: addressData,
    });
    return response; // Trả về nguyên object (có code, success, data)
  }

  // 2. Cập nhật địa chỉ
  async updateAddress(
    buyerId: string,
    addressId: string,
    addressData: BuyerAddressUpdateRequest,
  ): Promise<ApiResponse<void>> {
    const response: ApiResponse<void> = await request({
      url: `/v1/buyer/${buyerId}/addresses/${addressId}`,
      method: "PUT",
      data: addressData,
    });
    return response;
  }

  // 3. Lấy tất cả: Quan trọng nhất - Trả về ApiResponse chứa mảng data
  async getAllAddresses(
    buyerId: string,
  ): Promise<ApiResponse<BuyerAddressResponseNew[]>> {
    const response: ApiResponse<BuyerAddressResponseNew[]> = await request({
      url: `/v1/buyer/addresses`, // Tùy API có cần buyerId trên URL không
      method: "GET",
    });
    return response; // Không return response.data ở đây nữa!
  }

  // 4. Chi tiết địa chỉ
  async getAddressDetail(
    buyerId: string,
    addressId: string,
  ): Promise<ApiResponse<BuyerAddressResponseNew>> {
    const response: ApiResponse<BuyerAddressResponseNew> = await request({
      url: `/v1/buyer/${buyerId}/addresses/${addressId}`,
      method: "GET",
    });
    return response;
  }

  // 5. Xóa địa chỉ
  async deleteAddress(
    buyerId: string,
    addressId: string,
  ): Promise<ApiResponse<void>> {
    const response: ApiResponse<void> = await request({
      url: `/v1/buyer/${buyerId}/addresses/${addressId}`,
      method: "DELETE",
    });
    return response;
  }
}

export const buyerAddressService = new BuyerAddressService();
