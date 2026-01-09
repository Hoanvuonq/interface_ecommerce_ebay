import {
  CreateShopAddressRequest,
  CreateShopComplete,
  CreateShopLegalRequest,
  CreateShopRequest,
  CreateShopTaxRequest,
  UpdateShopAddressRequest,
  UpdateShopLegalRequest,
  UpdateShopRequest,
  UpdateShopResponse,
  UpdateShopTaxRequest,
} from "@/types/shop/shop.dto";
import { request } from "@/utils/axios.customize";
import { ApiResponse } from "@/api/_types/api.types";
import { FilterRequest } from "@/app/(chat)/_types/chat.dto";

const API_ENDPOINT_SHOP = "v1/public/shops";

export async function createShop(
  payload: CreateShopRequest
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_SHOP}`,
    method: "POST",
    data: payload,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function createCompleteShop(
  payload: CreateShopComplete
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_SHOP}/complete`,
    method: "POST",
    data: payload,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function updateCompleteShop(
  payload: CreateShopComplete
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_SHOP}/complete`,
    method: "PUT",
    data: payload,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function updateShop(
  shopId: string,
  payload: UpdateShopRequest
): Promise<ApiResponse<UpdateShopResponse>> {
  return request<ApiResponse<UpdateShopResponse>>({
    url: `/${API_ENDPOINT_SHOP}/${shopId}`,
    method: "PUT",
    data: payload,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function createShopAddress(
  shopId: string,
  payload: CreateShopAddressRequest
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_SHOP}/${shopId}/address`,
    method: "POST",
    data: payload,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function updateShopAddress(
  shopId: string,
  addressId: string,
  payload: UpdateShopAddressRequest
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_SHOP}/${shopId}/address/${addressId}`,
    method: "PUT",
    data: payload,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function createShopLegalInfo(
  shopId: string,
  payload: CreateShopLegalRequest
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_SHOP}/${shopId}/legal-info`,
    method: "POST",
    data: payload,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function updateShopLegalInfo(
  shopId: string,
  legalId: string,
  payload: UpdateShopLegalRequest
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_SHOP}/${shopId}/legal-info/${legalId}`,
    method: "PUT",
    data: payload,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function createShopTaxInfo(
  shopId: string,
  payload: CreateShopTaxRequest
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_SHOP}/${shopId}/tax-info`,
    method: "POST",
    data: payload,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function updateShopTaxInfo(
  shopId: string,
  taxId: string,
  payload: UpdateShopTaxRequest
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_SHOP}/${shopId}/tax-info/${taxId}`,
    method: "PUT",
    data: payload,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function getShopTaxInfo(
  shopId: string,
  taxId: string
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_SHOP}/${shopId}/tax-info/${taxId}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function getShopLegalInfo(
  shopId: string,
  legalId: string
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_SHOP}/${shopId}/legal-info/${legalId}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function getShopDetail(shopId: string): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_SHOP}/${shopId}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * Lấy shop detail của user hiện tại (tự động từ Security Context)
 * Dùng để check shop verification status
 */
export async function getCurrentUserShopDetail(): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_SHOP}/me/check`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function getAllShopAddresses(
  shopId: string
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_SHOP}/${shopId}/address`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function getProductsByShopId(
  shopId: string, 
  params: FilterRequest
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_SHOP}/${shopId}/products`,
    method: "GET",
    params,
  });
}

export async function getOrdersByShopIdAndBuyerId(
  shopId: string, 
  buyerId: string,
  params: FilterRequest
): Promise<ApiResponse<any>> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_SHOP}/${shopId}/orders`,
    method: "GET",
    params: {
      buyerId,
      ...params,
    },
  });
}