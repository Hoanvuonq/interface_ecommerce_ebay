/**
 * Voucher Service - Optimized for Next.js with TanStack Query and Lodash
 */
import { request } from "@/utils/axios.customize";
import type { ApiResponse } from "@/api/_types/api.types";
import _ from "lodash";
import {
  PlatformVoucherRecommendationsResponse,
  VoucherOption,
  VoucherRecommendationResult,
} from "./voucher.service.type";

const VOUCHER_API_BASE = "/v2/vouchers";

class VoucherService {
  private mapRecommendationResult(result: any | null): VoucherOption | null {
    if (!result) return null;

    const v = result.voucher || result;
    if (!v || !v.code) return null;

    const maxUsage = _.get(v, "maxUsage");
    const usedCount = _.get(v, "usedCount", 0);

    const remainingCount = !_.isNil(maxUsage)
      ? Math.max(0, maxUsage - usedCount)
      : undefined;
    const remainingPercentage =
      !_.isNil(maxUsage) && maxUsage > 0
        ? Math.round((remainingCount! / maxUsage) * 100)
        : undefined;

    return {
      id: v.id,
      code: v.code,
      name: v.name,
      description: _.get(v, "description", v.name),
      imageBasePath: _.get(v, "imageBasePath"),
      imageExtension: _.get(v, "imageExtension"),

      discountAmount: _.get(v, "discountValue", _.get(v, "discountAmount", 0)),
      minOrderValue: _.get(v, "minOrderAmount", _.get(v, "minOrderValue", 0)),

      discountType: _.includes(v.discountType, "PERCENTAGE")
        ? "PERCENTAGE"
        : "FIXED",

      maxDiscount: _.get(v, "maxDiscount"),
      isValid: _.get(v, "active", true),
      maxUsage,
      usedCount,
      remainingCount,
      remainingPercentage,

      canSelect:
        _.get(result, "applicable", true) &&
        (_.isNil(remainingCount) || remainingCount > 0),
      reason:
        _.get(result, "reason") ||
        (!v.active ? "Voucher đã hết hạn" : undefined),
      voucherScope: v.voucherScope || "SHOP_ORDER",
    };
  }
 
  async getShopVouchersWithContext(params: any): Promise<VoucherOption[]> {
    try {
      const response: ApiResponse<VoucherRecommendationResult[]> =
        await request({
          url: `${VOUCHER_API_BASE}/recommend/by-shop`,
          method: "POST",
          data: _.pickBy(params, (v) => v !== null && v !== undefined),
        });

      return _.chain(response.data)
        .map((res) => this.mapRecommendationResult(res))
        .filter(_.isObject)
        .value() as VoucherOption[];
    } catch (error) {
      console.error("Error fetching shop vouchers with context:", error);
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

  /**
   * POST: Get Platform (Global) vouchers with context
   */
  async getPlatformVouchersWithContext(params: any): Promise<{
    productOrderVouchers: VoucherOption[];
    shippingVouchers: VoucherOption[];
  }> {
    try {
      const response: ApiResponse<PlatformVoucherRecommendationsResponse> =
        await request({
          url: `${VOUCHER_API_BASE}/recommend/by-platform`,
          method: "POST",
          data: _.pickBy(params, (v) => v !== null && v !== undefined),
        });

      const mapList = (list: any) =>
        _.chain(list)
          .map((res) => this.mapRecommendationResult(res))
          .filter(_.isObject)
          .value() as VoucherOption[];

      return {
        productOrderVouchers: mapList(
          _.get(response, "data.productOrderVouchers", [])
        ),
        shippingVouchers: mapList(_.get(response, "data.shippingVouchers", [])),
      };
    } catch (error) {
      console.error("Error fetching platform vouchers:", error);
      return { productOrderVouchers: [], shippingVouchers: [] };
    }
  }
}

export const voucherService = new VoucherService();
