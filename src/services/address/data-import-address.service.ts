/**
 * Data Import Address Service - API calls cho import dữ liệu địa chỉ
 * Admin API - Yêu cầu authentication với role ADMIN
 */

import { request } from '@/utils/axios.customize';
import type { ApiResponse } from '@/api/_types/api.types';
import type { ImportResult, AddressStatisticsResponse }  from '@/types/address/address.types';

const ADMIN_DATA_IMPORT_API_BASE = '/v1/admin/data-import-address';

class DataImportAddressService {
  // ========== Data Import Operations ==========

  /**
   * Upload và import dữ liệu từ file JSON
   * @param file - File JSON chứa dữ liệu địa chỉ
   */
  async uploadAndImport(file: File): Promise<ApiResponse<ImportResult>> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await request<ApiResponse<ImportResult>>({
      url: `${ADMIN_DATA_IMPORT_API_BASE}/upload`,
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response as ApiResponse<ImportResult>;
  }

  /**
   * Import dữ liệu từ file có sẵn trong resources
   * @param fileName - Tên file trong resources (default: vn_only_simplified_json_generated_data_vn_units.json)
   */
  async importFromResources(
    fileName: string = 'vn_only_simplified_json_generated_data_vn_units.json'
  ): Promise<ApiResponse<ImportResult>> {
    const response = await request<ApiResponse<ImportResult>>({
      url: `${ADMIN_DATA_IMPORT_API_BASE}/import-from-resources`,
      method: 'POST',
      params: {
        fileName,
      },
    });
    return response as ApiResponse<ImportResult>;
  }

  // ========== Data Management ==========

  /**
   * Xóa tất cả dữ liệu địa chỉ
   * ⚠️ WARNING: Thao tác này sẽ xóa tất cả dữ liệu!
   */
  async clearAllData(): Promise<ApiResponse<void>> {
    const response = await request<ApiResponse<void>>({
      url: `${ADMIN_DATA_IMPORT_API_BASE}/clear`,
      method: 'DELETE',
    });
    return response as ApiResponse<void>;
  }

  /**
   * Reimport dữ liệu từ file upload (xóa dữ liệu cũ và import mới)
   * ⚠️ WARNING: Thao tác này sẽ xóa tất cả dữ liệu cũ!
   * @param file - File JSON chứa dữ liệu địa chỉ
   */
  async reimportFromUpload(file: File): Promise<ApiResponse<ImportResult>> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await request<ApiResponse<ImportResult>>({
      url: `${ADMIN_DATA_IMPORT_API_BASE}/reimport-upload`,
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response as ApiResponse<ImportResult>;
  }

  /**
   * Reimport dữ liệu từ file resources (xóa dữ liệu cũ và import mới)
   * ⚠️ WARNING: Thao tác này sẽ xóa tất cả dữ liệu cũ!
   * @param fileName - Tên file trong resources
   */
  async reimportFromResources(
    fileName: string = 'vn_only_simplified_json_generated_data_vn_units.json'
  ): Promise<ApiResponse<ImportResult>> {
    const response = await request<ApiResponse<ImportResult>>({
      url: `${ADMIN_DATA_IMPORT_API_BASE}/reimport-resources`,
      method: 'POST',
      params: {
        fileName,
      },
    });
    return response as ApiResponse<ImportResult>;
  }

  // ========== Statistics ==========

  /**
   * Lấy thống kê địa chỉ
   * @returns Thống kê số lượng provinces và wards
   */
  async getStatistics(): Promise<ApiResponse<AddressStatisticsResponse>> {
    const response = await request<ApiResponse<AddressStatisticsResponse>>({
      url: `${ADMIN_DATA_IMPORT_API_BASE}/statistics`,
      method: 'GET',
    });
    return response as ApiResponse<AddressStatisticsResponse>;
  }
}

export const dataImportAddressService = new DataImportAddressService();
export default dataImportAddressService;

