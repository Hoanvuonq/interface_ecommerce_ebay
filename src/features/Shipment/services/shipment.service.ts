/**
 * Shipment Service - API calls for shipment tracking
 */

import { request } from '@/utils/axios.customize';
import type { ApiResponse } from '@/api/_types/api.types';
import type {
  PackagePriceRequest,
  PackageConkinResponse,
  GHNCostsRequest,
  GHNCostsResponse,
  CostsRequest,
  CostsShipmentResponse,
} from '@/features/Shipment/types/shipment.types';

/**
 * Actual format from Conkin API
 */
export interface TrackingStatus {
  id: string;
  name: string;              // e.g., "ORDER_CREATED", "PICKED_UP", "IN_TRANSIT"
  description: string | null;
  createdAt: string;         // "22:20:42 10/11/2025"
  updatedAt: string | null;
  billId: string | null;
}

export interface TrackingData {
  date_create: string;       // "22:20:42 10/11/2025"
  bill_house: string;        // Bill ID from Conkin
  company_service: string;   // "Dedicated line VINADW F"
  country_name: string;      // "Belgium (BE)"
  statuses: TrackingStatus[]; // Timeline events
}

export interface ConkinTrackingResponse {
  status: number;
  message: string;
  data?: TrackingData;
}

const SHIPMENT_API_BASE = '/v1/shipment';

class ShipmentService {




  async getConkinShipmentPrice(requestData: PackagePriceRequest): Promise<PackageConkinResponse> {
    try {

      const response: PackageConkinResponse = await request({
        url: `${SHIPMENT_API_BASE}/information-price-shipment-conkin`,
        method: 'POST',
        data: requestData,
      });

      return response;
    } catch (error: any) {
      console.error('Failed to get Conkin shipment price:', error);
      throw new Error(error.message || 'Không thể lấy giá vận chuyển Conkin');
    }
  }


  async getConkinTracking(trackingCode: string): Promise<TrackingData | null> {
    try {
      const response: ApiResponse<ConkinTrackingResponse> = await request({
        url: `${SHIPMENT_API_BASE}/conkin/tracking/${trackingCode}`,
        method: 'GET',
      });


      const trackingResponse = response.data;

      // If backend response is successful
      if (response.success && trackingResponse) {
        // Check Conkin API status
        if (trackingResponse.status === 200 && trackingResponse.data) {
          return trackingResponse.data;
        }

        // If Conkin returns 400 (not found) or other error status
        // Throw error with message from Conkin API
        if (trackingResponse.status !== 200) {
          throw new Error(trackingResponse.message || 'Không thể tải thông tin vận chuyển');
        }
      }

      // Backend error
      if (!response.success) {
        throw new Error(response.message || 'Không thể tải thông tin vận chuyển');
      }

      return null;
    } catch (error: any) {
      console.error('Failed to fetch tracking info:', error);
      // Re-throw with message
      throw new Error(error.message || 'Không thể tải thông tin vận chuyển');
    }
  }

  /**
   * Get GHN shipment costs
   * @param requestData GHN costs request with items, from, to addresses
   * @returns GHN costs response with pricing information
   */
  async getGHNCosts(requestData: GHNCostsRequest): Promise<GHNCostsResponse> {
    try {

      const response: GHNCostsResponse = await request({
        url: `${SHIPMENT_API_BASE}/ghn/costs`,
        method: 'POST',
        data: requestData,
      });

      return response;
    } catch (error: any) {
      console.error('❌ [GHN Service] Failed to get GHN costs:', error);
      console.error('❌ [GHN Service] Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw new Error(error.message || 'Không thể lấy giá vận chuyển GHN');
    }
  }

  /**
   * Get costs for all shipment methods (GHN, CONKIN, etc.)
   * @param requestData Costs request with items, buyer addressId, shop addressId
   * @returns List of shipment costs responses
   */
  async getCostsShipments(requestData: CostsRequest): Promise<CostsShipmentResponse[]> {
    try {

      const sanitizedData: CostsRequest = {
        ...requestData,
        cod_value: typeof requestData.cod_value === 'number' ? requestData.cod_value : Number(requestData.cod_value),
        insurance_value: typeof requestData.insurance_value === 'number' ? requestData.insurance_value : Number(requestData.insurance_value),
        items: requestData.items.map(item => ({
          ...item,
          price: typeof item.price === 'number' ? item.price : Number(item.price),
          quantity: typeof item.quantity === 'number' ? item.quantity : Number(item.quantity),
          width: typeof item.width === 'number' ? item.width : Number(item.width),
          height: typeof item.height === 'number' ? item.height : Number(item.height),
          length: typeof item.length === 'number' ? item.length : Number(item.length),
          weight: typeof item.weight === 'number' ? item.weight : Number(item.weight),
        })),
      };


      // Backend đang dùng @GetMapping, nhưng GET với body không được hỗ trợ tốt
      // Thử dùng POST (backend cần được sửa từ @GetMapping sang @PostMapping)
      // Hoặc nếu backend bắt buộc dùng GET, có thể cần sửa backend
      const response: ApiResponse<CostsShipmentResponse[]> = await request({
        url: `${SHIPMENT_API_BASE}/costs-shipments`,
        method: 'POST', // Đổi sang POST vì GET với body không được hỗ trợ tốt
        data: sanitizedData,
        headers: {
          'Content-Type': 'application/json',
        },
      });


      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Không thể lấy giá vận chuyển');
    } catch (error: any) {
      console.error('❌ [Costs Shipments Service] Failed to get costs:', error);
      console.error('❌ [Costs Shipments Service] Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw new Error(error.message || 'Không thể lấy giá vận chuyển');
    }
  }
}

export const shipmentService = new ShipmentService();
