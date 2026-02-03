
import type { ApiResponse } from "@/api/_types/api.types";
import addressService from "@/services/address/address.service";
import type {
  CountryResponse,
  PageDto,
  ProvinceResponse,
  WardResponse
} from "@/types/address/address.types";
import { useState } from "react";

export function useGetCountryInfo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CountryResponse | null>(null);

  const fetchCountryInfo =
    async (): Promise<ApiResponse<CountryResponse> | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await addressService.getCountryInfo();
        setData(response.data);
        return response;
      } catch (err: any) {
        setError(err?.message || "Lấy thông tin quốc gia thất bại");
        return null;
      } finally {
        setLoading(false);
      }
    };

  return { fetchCountryInfo, loading, error, data };
}

export function useGetAllProvinces() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PageDto<ProvinceResponse> | null>(null);

  const fetchProvinces = async (): Promise<ApiResponse<
    PageDto<ProvinceResponse>
  > | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await addressService.getAllProvinces();
      setData(response.data);
      return response;
    } catch (err: any) {
      setError(err?.message || "Lấy danh sách tỉnh/thành phố thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchProvinces, loading, error, data };
}

export function useGetProvinceByCode() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ProvinceResponse | null>(null);

  const fetchProvince = async (
    code: string,
  ): Promise<ApiResponse<ProvinceResponse> | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await addressService.getProvinceByCode(code);
      setData(response.data);
      return response;
    } catch (err: any) {
      setError(err?.message || "Lấy thông tin tỉnh/thành phố thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchProvince, loading, error, data };
}

export function useGetWardsByProvinceCode() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PageDto<WardResponse> | null>(null);

  const fetchWards = async (
    provinceCode: string,
  ): Promise<ApiResponse<PageDto<WardResponse>> | null> => {
    setLoading(true);
    setError(null);
    try {
      const response =
        await addressService.getWardsByProvinceCode(provinceCode);
      setData(response.data);
      return response;
    } catch (err: any) {
      setError(err?.message || "Lấy danh sách phường/xã thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchWards, loading, error, data };
}

export function useGetWardByCode() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<WardResponse | null>(null);

  const fetchWard = async (
    code: string,
  ): Promise<ApiResponse<WardResponse> | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await addressService.getWardByCode(code);
      setData(response.data);
      return response;
    } catch (err: any) {
      setError(err?.message || "Lấy thông tin phường/xã thất bại");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchWard, loading, error, data };
}
