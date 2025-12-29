/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  GetShopDetailResponse,
  GetShopRequest,
  GetShopResponse,
  VerifyShopLegalResponse,
  VerifyShopRequest,
  VerifyShopResponse,
  VerifyShopTaxResponse,
}from "../_types/dto/manager.shop.dto";
import { request } from "@/utils/axios.customize";
import { ApiResponse } from "@/api/_types/api.types";

const API_ENDPOINT_SHOP = "v1/shops";

export async function getAllShops(
  payload: GetShopRequest
): Promise<ApiResponse<GetShopResponse>> {
  return request<ApiResponse<GetShopResponse>>({
    url: `/${API_ENDPOINT_SHOP}`,
    method: "GET",
    params: {
      name: payload.name,
      shopStatus: payload.shopStatus,
      page: payload.page ?? 0,
      size: payload.size ?? 10,
      isDeleted: payload.isDeleted ?? false,
    },
  });
}

export async function getShopDetail(
  shopId: string
): Promise<ApiResponse<GetShopDetailResponse>> {
  return request<ApiResponse<GetShopDetailResponse>>({
    url: `/${API_ENDPOINT_SHOP}/${shopId}`,
    method: "GET",
  });
}

export async function verifyShop(
  shopId: string,
  payload: VerifyShopRequest
): Promise<ApiResponse<VerifyShopResponse>> {
  return request<ApiResponse<VerifyShopResponse>>({
    url: `/${API_ENDPOINT_SHOP}/${shopId}/verify`,
    method: "PUT",
    data: payload,
  });
}

export async function verifyShopLegal(
  shopId: string,
  legalId: string,
  payload: VerifyShopRequest
): Promise<ApiResponse<VerifyShopLegalResponse>> {
  return request<ApiResponse<VerifyShopLegalResponse>>({
    url: `/${API_ENDPOINT_SHOP}/${shopId}/legal-info/${legalId}/verify`,
    method: "PUT",
    data: payload,
  });
}

export async function verifyShopTax(
  shopId: string,
  taxId: string,
  payload: VerifyShopRequest
): Promise<ApiResponse<VerifyShopTaxResponse>> {
  return request<ApiResponse<VerifyShopTaxResponse>>({
    url: `/${API_ENDPOINT_SHOP}/${shopId}/tax-info/${taxId}/verify`,
    method: "PUT",
    data: payload,
  });
}

export async function getShopStatistics(): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_SHOP}/statistics`,
    method: "GET",
  });
}
