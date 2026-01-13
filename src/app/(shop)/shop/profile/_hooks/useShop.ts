/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  CreateShopAddressRequest,
  CreateShopComplete,
  CreateShopLegalRequest,
  CreateShopRequest,
  CreateShopTaxRequest,
  UpdateShopAddressRequest,
  UpdateShopLegalRequest,
  UpdateShopRequest,
  UpdateShopTaxRequest,
} from "@/app/(main)/shop/_types/dto/shop.dto";
import {
  createCompleteShop,
  updateCompleteShop,
  createShop,
  createShopAddress,
  createShopLegalInfo,
  createShopTaxInfo,
  getOrdersByShopIdAndBuyerId,
  getProductsByShopId,
  getShopDetail,
  getShopLegalInfo,
  getShopTaxInfo,
  updateShop,
  updateShopAddress,
  updateShopLegalInfo,
  updateShopTaxInfo,
}  from "@/app/(main)/shop/_service/shop.service";
import { ApiResponse } from "@/api/_types/api.types";
import { FilterRequest } from "@/app/(chat)/_types/chat.dto";

export function useCreateShop() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateShop = async (
    payload: CreateShopRequest
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await createShop(payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Tạo shop thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleCreateShop, loading, error };
}

export function useUpdateCompleteShop() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateCompleteShop = async (
    payload: CreateShopComplete
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateCompleteShop(payload);
      return res;
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Cập nhật shop thất bại";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdateCompleteShop, loading, error };
}

export function useCreateCompleteShop() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateCompleteShop = async (
    payload: CreateShopComplete
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await createCompleteShop(payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Tạo shop hoàn chỉnh thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleCreateCompleteShop, loading, error };
}

export function useUpdateShop() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateShop = async (
    payload: UpdateShopRequest
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateShop( payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Cập nhật shop thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdateShop, loading, error };
}

export function useCreateShopAddress() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateAddressShop = async (
    shopId: string,
    payload: CreateShopAddressRequest
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await createShopAddress(shopId, payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Tạo địa chỉ shop thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleCreateAddressShop, loading, error };
}

export function useUpdateAddressShop() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateAddressShop = async (
    shopId: string,
    addressId: string,
    payload: UpdateShopAddressRequest
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateShopAddress(shopId, addressId, payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Cập nhật địa chỉ shop thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdateAddressShop, loading, error };
}

export function useCreateShopLegal() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateShopLegal = async (
    shopId: string,
    payload: CreateShopLegalRequest
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await createShopLegalInfo(shopId, payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Tạo thông tin định danh shop thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleCreateShopLegal, loading, error };
}

export function useUpdateShopLegal() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateShopLegal = async (
    shopId: string,
    legalId: string,
    payload: UpdateShopLegalRequest
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateShopLegalInfo(shopId, legalId, payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Cập nhật thông tin định danh shop thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdateShopLegal, loading, error };
}

export function useCreateShopTax() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateShopTax = async (
    shopId: string,
    payload: CreateShopTaxRequest
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await createShopTaxInfo(shopId, payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Tạo thông tin thuế shop thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleCreateShopTax, loading, error };
}

export function useUpdateShopTax() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateShopTax = async (
    shopId: string,
    taxId: string,
    payload: UpdateShopTaxRequest
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateShopTaxInfo(shopId, taxId, payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Cập nhật thông tin thuế shop thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleUpdateShopTax, loading, error };
}

export function useGetShopTaxInfo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetShopTaxInfo = async (
    shopId: string,
    taxId: string
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getShopTaxInfo(shopId, taxId);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy thông tin thuế shop thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetShopTaxInfo, loading, error };
}

export function useGetShopLegalInfo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetShopLegalInfo = async (
    shopId: string,
    legalId: string
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getShopLegalInfo(shopId, legalId);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy thông tin định danh shop thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetShopLegalInfo, loading, error };
}

export function useGetShopInfo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetShopInfo = async (
    shopId: string
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getShopDetail(shopId);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy thông tin shop thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetShopInfo, loading, error };
}

export function useGetProductsByShopId() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetProductsByShopId = async (
    shopId: string,
    params: FilterRequest
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProductsByShopId(shopId, params);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy sản phẩm theo shop thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetProductsByShopId, loading, error };
}

export function useGetOrdersByShopIdAndBuyerId() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetOrdersByShopIdAndBuyerId = async (
    shopId: string,
    buyerId: string,
    params: FilterRequest
  ): Promise<ApiResponse<any> | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getOrdersByShopIdAndBuyerId(shopId, buyerId, params);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy đơn hàng theo shop và người dùng thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetOrdersByShopIdAndBuyerId, loading, error };
}
