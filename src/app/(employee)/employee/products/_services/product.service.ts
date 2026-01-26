/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  GetAllProductsAdmin,
  ParamRequest,
  RejectProductRequest,
} from "../_types/dto/product.dto";
import { ApiResponse } from "@/api/_types/api.types";
import { request } from "@/utils/axios.customize";

const API_ENDPOINT_PRODUCTS = "v1/admin/products";

export async function approveProduct(id: string, etag: string): Promise<any> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_PRODUCTS}/${id}/approve`,
    method: "POST",
    headers: { "If-Match": etag },
  });
}

export async function rejectProduct(
  id: string,
  etag: string,
  payload: RejectProductRequest,
): Promise<any> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_PRODUCTS}/${id}/reject`,
    method: "POST",
    headers: { "If-Match": etag },
    data: payload,
  });
}

export async function getPendingApprovalProducts(
  params?: GetAllProductsAdmin,
): Promise<any> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_PRODUCTS}/pending`,
    method: "GET",
    params,
  });
}

export async function getProductsByApprovalStatus(
  status: string,
  params?: GetAllProductsAdmin,
): Promise<any> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_PRODUCTS}/status/${status}`,
    method: "GET",
    params,
  });
}

export async function setProductActiveStatus(
  id: string,
  etag: string,
  active: boolean,
): Promise<any> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_PRODUCTS}/${id}/active`,
    method: "PUT",
    headers: etag ? { "If-Match": etag } : undefined,
    data: { active },
  });
}

export async function hardDeleteProduct(id: string): Promise<any> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_PRODUCTS}/${id}`,
    method: "DELETE",
  });
}

export async function restoreProduct(id: string): Promise<any> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_PRODUCTS}/${id}/restore`,
    method: "POST",
  });
}

export async function getAllProducts(
  params?: GetAllProductsAdmin,
): Promise<any> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_PRODUCTS}`,
    method: "GET",
    params,
  });
}

export async function getProductById(id: string): Promise<any> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_PRODUCTS}/${id}`,
    method: "GET",
  });
}

export const productService = {
  getProductById,
  approveProduct,
  rejectProduct,
  getAllProducts,
  getAllProductsAdmin,
  getAdminProductStatistics,
};

export async function getDeletedProducts(params?: ParamRequest): Promise<any> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_PRODUCTS}/deleted`,
    method: "GET",
    params,
  });
}

export async function getAllProductsAdmin(
  payload: GetAllProductsAdmin,
): Promise<any> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_PRODUCTS}/search`,
    method: "POST",
    data: payload,
  });
}

export async function getProductsByUser(
  userId: string,
  params?: ParamRequest,
): Promise<any> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_PRODUCTS}/user/${userId}`,
    method: "GET",
    params,
  });
}

export async function getProductsByShop(
  shopId: string,
  params?: ParamRequest,
): Promise<any> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_PRODUCTS}/shop/${shopId}`,
    method: "GET",
    params,
  });
}

export async function getAdminProductStatistics(): Promise<any> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_PRODUCTS}/statistics`,
    method: "GET",
  });
}

export async function getApprovalStatistics(): Promise<any> {
  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_PRODUCTS}/statistics/approval`,
    method: "GET",
  });
}

export async function getProductsRequiringAttention(
  params?: ParamRequest
): Promise<any> {
  // Bóc tách sort ra để không gửi lên server nếu nó gây lỗi 500
  const { sort, ...restParams } = params || {};

  return request<ApiResponse<any>>({
    url: `/${API_ENDPOINT_PRODUCTS}/attention`,
    method: "GET",
    params: restParams, // Chỉ gửi page, size và filter khác
  });
}