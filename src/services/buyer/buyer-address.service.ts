/**
 * Buyer Address Service - API calls cho quản lý địa chỉ buyer
 */

import { request } from '@/utils/axios.customize';
import type {
    BuyerAddressCreateRequest,
    BuyerAddressUpdateRequest,
 BuyerAddressResponse } from '@/types/buyer/buyer.types';
import type { ApiResponse } from '@/api/_types/api.types';

class BuyerAddressService {
    /**
     * Tạo địa chỉ mới cho buyer
     */
    async createAddress(buyerId: string, addressData: BuyerAddressCreateRequest): Promise<BuyerAddressResponse> {
        const response: ApiResponse<BuyerAddressResponse> = await request({
            url: `/v1/buyers/${buyerId}/address`,
            method: 'POST',
            data: addressData,
        });
        return response.data;
    }

    /**
     * Cập nhật địa chỉ của buyer
     */
    async updateAddress(
        buyerId: string,
        addressId: string,
        addressData: BuyerAddressUpdateRequest
    ): Promise<void> {
        await request({
            url: `/v1/buyers/${buyerId}/address/${addressId}`,
            method: 'PUT',
            data: addressData,
        });
    }

    /**
     * Lấy tất cả địa chỉ của buyer
     */
    async getAllAddresses(buyerId: string): Promise<BuyerAddressResponse[]> {
        const response: ApiResponse<BuyerAddressResponse[]> = await request({
            url: `/v1/buyers/${buyerId}/address`,
            method: 'GET',
        });
        return response.data;
    }

    /**
     * Lấy chi tiết một địa chỉ
     */
    async getAddressDetail(buyerId: string, addressId: string): Promise<BuyerAddressResponse> {
        const response: ApiResponse<BuyerAddressResponse> = await request({
            url: `/v1/buyers/${buyerId}/address/${addressId}`,
            method: 'GET',
        });
        return response.data;
    }

    /**
     * Xóa địa chỉ của buyer
     */
    async deleteAddress(buyerId: string, addressId: string): Promise<void> {
        await request({
            url: `/v1/buyers/${buyerId}/address/${addressId}`,
            method: 'DELETE',
        });
    }
}

export const buyerAddressService = new BuyerAddressService();

