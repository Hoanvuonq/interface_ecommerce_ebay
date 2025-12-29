/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  GetShopRequest,
  GetShopResponse,
  GetShopDetailResponse,
  VerifyShopLegalResponse,
  VerifyShopRequest,
  VerifyShopResponse,
  VerifyShopTaxResponse,
} from "../_types/dto/manager.shop.dto";
import {
  getAllShops,
  getShopDetail,
  getShopStatistics,
  verifyShop,
  verifyShopLegal,
  verifyShopTax,
} from "../_services/manager.shop.service";
import { ApiResponse } from "@/api/_types/api.types";
import { useState } from "react";

export function useGetAllShops() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetAllShops = async (
    payload: GetShopRequest
  ): Promise<GetShopResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllShops(payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy danh sách shop thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetAllShops, loading, error };
}

export function useGetShopDetail() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetShopDetail = async (
    shopId: string
  ): Promise<GetShopDetailResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await getShopDetail(shopId);
      return res;
    } catch (err: any) {
      setError(err?.message || "Lấy chi tiết shop thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleGetShopDetail, loading, error };
}

export function useVerifyShop() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerifyShop = async (
    shopId: string,
    payload: VerifyShopRequest
  ): Promise<VerifyShopResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await verifyShop(shopId, payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Xác thực shop thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleVerifyShop, loading, error };
}

export function useVerifyShopLegal() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerifyShopLegal = async (
    shopId: string,
    legalId: string,
    payload: VerifyShopRequest
  ): Promise<VerifyShopLegalResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await verifyShopLegal(shopId, legalId, payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Xác thực định danh shop thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleVerifyShopLegal, loading, error };
}

export function useVerifyShopTax() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerifyShopTax = async (
    shopId: string,
    taxId: string,
    payload: VerifyShopRequest
  ): Promise<VerifyShopTaxResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await verifyShopTax(shopId, taxId, payload);
      return res;
    } catch (err: any) {
      setError(err?.message || "Xác thực thuế shop thất bại");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { handleVerifyShopTax, loading, error };
}

export function useGetShopStatistics() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetShopStatistics =
    async (): Promise<ApiResponse<any> | null> => {
      setLoading(true);
      setError(null);
      try {
        const res = await getShopStatistics();
        return res;
      } catch (err: any) {
        setError(err?.message || "Lấy thống kê shop thất bại");
        throw err;
      } finally {
        setLoading(false);
      }
    };

  return { handleGetShopStatistics, loading, error };
}
