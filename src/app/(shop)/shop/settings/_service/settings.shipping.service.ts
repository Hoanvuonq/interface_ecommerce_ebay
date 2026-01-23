import { request } from "@/utils/axios.customize";
import type { ApiResponse } from "@/api/_types/api.types";
import {
  ShippingChannel,
  PaymentMethod,
} from "../_types/settings.shipping.type";

const SHOP_SETTINGS_API = "/v1/shop/settings";

class ShopSettingsService {
  async getShippingSettings(): Promise<ShippingChannel[]> {
    const response: ApiResponse<ShippingChannel[]> = await request({
      url: `${SHOP_SETTINGS_API}/shipping`,
      method: "GET",
    });
    return response.data;
  }
  async toggleShippingChannel(channelCode: string): Promise<ShippingChannel> {
    const response: ApiResponse<ShippingChannel> = await request({
      url: `${SHOP_SETTINGS_API}/shipping/${channelCode}/toggle`,
      method: "PATCH",
    });
    return response.data;
  }

  async getPaymentSettings(): Promise<PaymentMethod[]> {
    const response: ApiResponse<PaymentMethod[]> = await request({
      url: `${SHOP_SETTINGS_API}/payment`,
      method: "GET",
    });
    return response.data;
  }

  async togglePaymentMethod(methodCode: string): Promise<PaymentMethod> {
    const response: ApiResponse<PaymentMethod> = await request({
      url: `${SHOP_SETTINGS_API}/payment/${methodCode}/toggle`,
      method: "PATCH",
    });
    return response.data;
  }
}

export const shopSettingsService = new ShopSettingsService();
