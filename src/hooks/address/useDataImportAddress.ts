/**
 * Data Import Address Hooks - React hooks cho admin data import operations
 */

import { useState } from 'react';
import dataImportAddressService from '@/services/address/data-import-address.service';
import type { ImportResult, AddressStatisticsResponse }from '@/types/address/address.types';
import type { ApiResponse } from '@/api/_types/api.types';

/**
 * Hook để upload và import dữ liệu từ file
 */
export function useUploadAndImport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ImportResult | null>(null);

  const uploadAndImport = async (file: File): Promise<ApiResponse<ImportResult> | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await dataImportAddressService.uploadAndImport(file);
      setData(response.data);
      return response;
    } catch (err: any) {
      setError(err?.message || 'Upload và import dữ liệu thất bại');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { uploadAndImport, loading, error, data };
}

/**
 * Hook để import dữ liệu từ resources
 */
export function useImportFromResources() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ImportResult | null>(null);

  const importFromResources = async (
    fileName?: string
  ): Promise<ApiResponse<ImportResult> | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await dataImportAddressService.importFromResources(fileName);
      setData(response.data);
      return response;
    } catch (err: any) {
      setError(err?.message || 'Import dữ liệu từ resources thất bại');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { importFromResources, loading, error, data };
}

/**
 * Hook để xóa tất cả dữ liệu
 */
export function useClearAllData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearAllData = async (): Promise<ApiResponse<void> | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await dataImportAddressService.clearAllData();
      return response;
    } catch (err: any) {
      setError(err?.message || 'Xóa dữ liệu thất bại');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { clearAllData, loading, error };
}

/**
 * Hook để reimport từ upload
 */
export function useReimportFromUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ImportResult | null>(null);

  const reimportFromUpload = async (
    file: File
  ): Promise<ApiResponse<ImportResult> | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await dataImportAddressService.reimportFromUpload(file);
      setData(response.data);
      return response;
    } catch (err: any) {
      setError(err?.message || 'Reimport dữ liệu thất bại');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { reimportFromUpload, loading, error, data };
}

/**
 * Hook để reimport từ resources
 */
export function useReimportFromResources() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ImportResult | null>(null);

  const reimportFromResources = async (
    fileName?: string
  ): Promise<ApiResponse<ImportResult> | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await dataImportAddressService.reimportFromResources(fileName);
      setData(response.data);
      return response;
    } catch (err: any) {
      setError(err?.message || 'Reimport dữ liệu từ resources thất bại');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { reimportFromResources, loading, error, data };
}

/**
 * Hook để lấy thống kê địa chỉ
 */
export function useGetStatistics() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AddressStatisticsResponse | null>(null);

  const getStatistics = async (): Promise<ApiResponse<AddressStatisticsResponse> | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await dataImportAddressService.getStatistics();
      setData(response.data);
      return response;
    } catch (err: any) {
      setError(err?.message || 'Lấy thống kê thất bại');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getStatistics, loading, error, data };
}

