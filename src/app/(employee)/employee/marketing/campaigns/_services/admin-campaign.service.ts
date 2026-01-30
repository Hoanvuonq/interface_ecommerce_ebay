/**
 * Admin Campaign Service - API calls for admin campaign management
 */

import { request } from "@/utils/axios.customize";
import type { ApiResponse } from "@/api/_types/api.types";
import type {
  CampaignResponse,
  CampaignSlotProductResponse,
  CampaignSlotResponse,
  CampaignStatisticsResponse,
  CreateCampaignRequest,
  UpdateCampaignRequest,
  CreateSlotsRequest,
  PagedResponse,
} from "../_types/types";
import type { CampaignStatus } from "@/app/(shop)/shop/marketing/campaigns/_types/campaign.type";


const ADMIN_API = "/v1/admin/campaigns";

class AdminCampaignService {
 
  async createCampaign(req: CreateCampaignRequest): Promise<CampaignResponse> {
    const response: ApiResponse<CampaignResponse> = await request({
      url: ADMIN_API,
      method: "POST",
      data: req,
    });
    return response.data;
  }

  /**
   * Get all campaigns with pagination
   */
  async getAllCampaigns(
    page = 0,
    size = 10,
  ): Promise<PagedResponse<CampaignResponse>> {
    const response: ApiResponse<PagedResponse<CampaignResponse>> =
      await request({
        url: ADMIN_API,
        method: "GET",
        params: { page, size },
      });
    return response.data;
  }

  /**
   * Get campaigns by status
   */
  async getCampaignsByStatus(
    status: CampaignStatus,
    page = 0,
    size = 10,
  ): Promise<PagedResponse<CampaignResponse>> {
    const response: ApiResponse<PagedResponse<CampaignResponse>> =
      await request({
        url: `${ADMIN_API}/status/${status}`,
        method: "GET",
        params: { page, size },
      });
    return response.data;
  }

  /**
   * Update campaign
   */
  async updateCampaign(
    campaignId: string,
    req: UpdateCampaignRequest,
  ): Promise<CampaignResponse> {
    const response: ApiResponse<CampaignResponse> = await request({
      url: `${ADMIN_API}/${campaignId}`,
      method: "PUT",
      data: req,
    });
    return response.data;
  }

  /**
   * Delete campaign (soft delete)
   */
  async deleteCampaign(campaignId: string): Promise<void> {
    await request({
      url: `${ADMIN_API}/${campaignId}`,
      method: "DELETE",
    });
  }

  // ============================================================
  // CAMPAIGN LIFECYCLE
  // ============================================================

  /**
   * Schedule campaign (DRAFT → SCHEDULED)
   */
  async scheduleCampaign(campaignId: string): Promise<CampaignResponse> {
    const response: ApiResponse<CampaignResponse> = await request({
      url: `${ADMIN_API}/${campaignId}/schedule`,
      method: "POST",
    });
    return response.data;
  }

  /**
   * Cancel campaign
   */
  async cancelCampaign(
    campaignId: string,
    reason: string,
  ): Promise<CampaignResponse> {
    const response: ApiResponse<CampaignResponse> = await request({
      url: `${ADMIN_API}/${campaignId}/cancel`,
      method: "POST",
      data: { reason },
    });
    return response.data;
  }

  // ============================================================
  // SLOT MANAGEMENT
  // ============================================================

  /**
   * Create slots for campaign
   */
  async createSlots(
    campaignId: string,
    req: CreateSlotsRequest[],
  ): Promise<CampaignSlotResponse[]> {
    const response: ApiResponse<CampaignSlotResponse[]> = await request({
      url: `${ADMIN_API}/${campaignId}/slots`,
      method: "POST",
      data: { slots: req },
    });
    return response.data;
  }

  /**
   * Get campaign statistics
   */
  async getCampaignStatistics(
    campaignId: string,
  ): Promise<CampaignStatisticsResponse> {
    const response: ApiResponse<CampaignStatisticsResponse> = await request({
      url: `${ADMIN_API}/${campaignId}/statistics`,
      method: "GET",
    });
    return response.data;
  }

  // ============================================================
  // REGISTRATION MANAGEMENT
  // ============================================================

  /**
   * Get all pending registrations
   */
  async getPendingRegistrations(
    page = 0,
    size = 10,
  ): Promise<PagedResponse<CampaignSlotProductResponse>> {
    const response: ApiResponse<PagedResponse<CampaignSlotProductResponse>> =
      await request({
        url: `${ADMIN_API}/registrations/pending`,
        method: "GET",
        params: { page, size },
      });
    return response.data;
  }

  /**
   */
  async getPendingRegistrationsForCampaign(
    campaignId: string,
    page = 0,
    size = 10,
  ): Promise<PagedResponse<CampaignSlotProductResponse>> {
    const response: ApiResponse<PagedResponse<CampaignSlotProductResponse>> =
      await request({
        url: `${ADMIN_API}/${campaignId}/registrations/pending`,
        method: "GET",
        params: { page, size },
      });
    return response.data;
  }

  /**
   * Approve a registration
   */
  async approveRegistration(
    registrationId: string,
  ): Promise<CampaignSlotProductResponse> {
    const response: ApiResponse<CampaignSlotProductResponse> = await request({
      url: `${ADMIN_API}/registrations/${registrationId}/approve`,
      method: "PUT",
    });
    return response.data;
  }

  /**
   * Reject a registration
   */
  async rejectRegistration(
    registrationId: string,
    reason: string,
  ): Promise<CampaignSlotProductResponse> {
    const response: ApiResponse<CampaignSlotProductResponse> = await request({
      url: `${ADMIN_API}/registrations/${registrationId}/reject`,
      method: "PUT",
      data: { reason },
    });
    return response.data;
  }

  /**
   * Batch approve registrations
   */
  async batchApprove(registrationIds: string[]): Promise<{ approved: number }> {
    const response: ApiResponse<{ approved: number }> = await request({
      url: `${ADMIN_API}/registrations/batch-approve`,
      method: "POST",
      data: registrationIds,
    });
    return response.data;
  }

  /**
   * Batch reject registrations
   */
  async batchReject(
    registrationIds: string[],
    reason: string,
  ): Promise<{ rejected: number }> {
    const response: ApiResponse<{ rejected: number }> = await request({
      url: `${ADMIN_API}/registrations/batch-reject`,
      method: "POST",
      data: { ids: registrationIds, reason },
    });
    return response.data;
  }
}

export const adminCampaignService = new AdminCampaignService();
