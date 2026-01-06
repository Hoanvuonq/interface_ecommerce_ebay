import { request } from "@/utils/axios.customize";
import type { ApiResponse } from "@/api/_types/api.types";
import _ from "lodash";
import {
  VoucherOption,
  VoucherRecommendationResult,
  PlatformVoucherRecommendationsData,
  GroupedVouchers
} from "../_types/voucher"; 

const VOUCHER_API_BASE = "/v2/vouchers";

class VoucherService {
  private mapRecommendationResult(result: VoucherRecommendationResult | null): VoucherOption | null {
    if (!result || !result.voucher) return null;

    const { voucher: v, applicable, reason, calculatedDiscount } = result;

    return {
      ...v,
      discountAmount: v.discountValue, 
      minOrderValue: v.minOrderAmount,
      discountType: v.discountType,
      discountMethod: v.discountType,
      applicable,
      reason,
      calculatedDiscount,
      canSelect: applicable,
      isValid: v.active,
    };
  }

  async getShopVouchersWithContext(params: any): Promise<VoucherOption[]> {
    try {
      const response: ApiResponse<VoucherRecommendationResult[]> = await request({
        url: `${VOUCHER_API_BASE}/recommend/by-shop`,
        method: "POST",
        data: params,
      });

      return (response.data || [])
        .map((res) => this.mapRecommendationResult(res))
        .filter((v): v is VoucherOption => !_.isNil(v));
    } catch (error) {
      return [];
    }
  }
 async getShopVouchersForBuyer(shopId: string): Promise<VoucherOption[]> {
    try {
      const response: ApiResponse<VoucherRecommendationResult[]> =
        await request({
          url: `${VOUCHER_API_BASE}/recommend/by-shop`,
          method: "GET",
          params: { shopId },
        });

      return _.chain(response.data)
        .map((res) => this.mapRecommendationResult(res))
        .filter(_.isObject)
        .value() as VoucherOption[];
    } catch (error) {
      console.error("Error in getShopVouchersForBuyer:", error);
      return [];
    }
  }
  async getPlatformVouchersWithContext(params: any): Promise<GroupedVouchers> {
    try {
      const response: ApiResponse<PlatformVoucherRecommendationsData> = await request({
        url: `${VOUCHER_API_BASE}/recommend/by-platform`,
        method: "POST",
        data: params,
      });

      const mapList = (list: VoucherRecommendationResult[]) =>
        (list || [])
          .map((res) => this.mapRecommendationResult(res))
          .filter((v): v is VoucherOption => !_.isNil(v));

      return {
        productOrderVouchers: mapList(response.data?.productOrderVouchers),
        shippingVouchers: mapList(response.data?.shippingVouchers),
      };
    } catch (error) {
      return { productOrderVouchers: [], shippingVouchers: [] };
    }
  }
}

export const voucherService = new VoucherService();