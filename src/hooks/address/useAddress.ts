/**
 * Address Hooks - React hooks cho address operations
 */

import { useState } from 'react';
import addressService from '@/services/address/address.service';
import type {
  CountryResponse,
  ProvinceResponse,
  WardResponse,
  PageDto,
  GetProvincesParams,
  GetWardsParams,
}  from '@/types/address/address.types';
import type { ApiResponse } from '@/api/_types/api.types';

/**
 * Hook để lấy thông tin quốc gia
 */
export function useGetCountryInfo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CountryResponse | null>(null);

  const fetchCountryInfo = async (): Promise<ApiResponse<CountryResponse> | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await addressService.getCountryInfo();
      setData(response.data);
      return response;
    } catch (err: any) {
      setError(err?.message || 'Lấy thông tin quốc gia thất bại');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchCountryInfo, loading, error, data };
}

/**
 * Hook để lấy danh sách tỉnh/thành phố
 */
export function useGetAllProvinces() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PageDto<ProvinceResponse> | null>(null);

  const fetchProvinces = async (
    params?: GetProvincesParams
  ): Promise<ApiResponse<PageDto<ProvinceResponse>> | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await addressService.getAllProvinces(params);
      setData(response.data);
      return response;
    } catch (err: any) {
      setError(err?.message || 'Lấy danh sách tỉnh/thành phố thất bại');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchProvinces, loading, error, data };
}

/**
 * Hook để lấy chi tiết tỉnh/thành phố
 */
export function useGetProvinceByCode() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ProvinceResponse | null>(null);

  const fetchProvince = async (
    code: string
  ): Promise<ApiResponse<ProvinceResponse> | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await addressService.getProvinceByCode(code);
      setData(response.data);
      return response;
    } catch (err: any) {
      setError(err?.message || 'Lấy thông tin tỉnh/thành phố thất bại');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchProvince, loading, error, data };
}

/**
 * Hook để lấy danh sách phường/xã theo tỉnh/thành phố
 */
export function useGetWardsByProvinceCode() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<PageDto<WardResponse> | null>(null);

  const fetchWards = async (
    provinceCode: string,
    params?: GetWardsParams
  ): Promise<ApiResponse<PageDto<WardResponse>> | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await addressService.getWardsByProvinceCode(provinceCode, params);
      setData(response.data);
      return response;
    } catch (err: any) {
      setError(err?.message || 'Lấy danh sách phường/xã thất bại');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchWards, loading, error, data };
}

/**
 * Hook để lấy chi tiết phường/xã
 */
export function useGetWardByCode() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<WardResponse | null>(null);

  const fetchWard = async (code: string): Promise<ApiResponse<WardResponse> | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await addressService.getWardByCode(code);
      setData(response.data);
      return response;
    } catch (err: any) {
      setError(err?.message || 'Lấy thông tin phường/xã thất bại');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { fetchWard, loading, error, data };
}

