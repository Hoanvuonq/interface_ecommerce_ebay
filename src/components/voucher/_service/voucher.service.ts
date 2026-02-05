import { request } from "@/utils/axios.customize";
import {
  VoucherOption,
  GroupedVouchers,
  VoucherShopRequest,
  VoucherPlatformRequest,
  VoucherRecommendationResult,
  PlatformVoucherRecommendationsData,
  ApiResponse,
} from "../_types/voucher";
import { flattenVoucher } from "../_utils/voucher.mapper";

class VoucherService {
  async getShopVouchersWithContext(
    params: VoucherShopRequest,
  ): Promise<VoucherOption[]> {
    const res: ApiResponse<VoucherRecommendationResult[]> = await request({
      url: "/v2/vouchers/recommend/by-shop",
      method: "POST",
      data: params,
    });

    return (res.data || [])
      .map(flattenVoucher)
      .filter((v): v is VoucherOption => v !== null);
  }

  async getPlatformVouchersWithContext(
    params: VoucherPlatformRequest,
  ): Promise<GroupedVouchers> {
    const res: ApiResponse<PlatformVoucherRecommendationsData> = await request({
      url: "/v2/vouchers/recommend/by-platform",
      method: "POST",
      data: params,
    });

    const data = res.data;

    const mapList = (list: VoucherRecommendationResult[]) =>
      (list || [])
        .map(flattenVoucher)
        .filter((v): v is VoucherOption => v !== null);

    return {
      productOrderVouchers: mapList(data?.productOrderVouchers || []),
      shippingVouchers: mapList(data?.shippingVouchers || []),
    };
  }
}

export const voucherService = new VoucherService();
