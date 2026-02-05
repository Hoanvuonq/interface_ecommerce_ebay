import _ from "lodash";
import { request } from "@/utils/axios.customize";
import { generateIdempotencyKey } from "@/utils/generateIdempotencyKey";
import {
  CheckoutValidationErrorResponse,
  CheckoutOrderPreviewRequest,
  OrderPreviewResponse,
} from "../_types/checkout.type";

const CART_API_BASE = "/v1/cart";

type CheckoutResult = OrderPreviewResponse | CheckoutValidationErrorResponse;

export const checkoutService = {
  checkout: async (payload: CheckoutOrderPreviewRequest): Promise<CheckoutResult> => {
    const cleanPayload = _.omitBy(payload, _.isNil);
    const response = (await request({
      url: `${CART_API_BASE}/checkout`,
      method: "POST",
      data: cleanPayload,
      headers: { "Idempotency-Key": generateIdempotencyKey() },
    })) as any;

    return response?.data ?? response;
  },

  getCheckoutDetails: async (
    payload: CheckoutOrderPreviewRequest,
  ): Promise<CheckoutResult> => {
    const response = (await request({
      url: `${CART_API_BASE}/checkout/get`,
      method: "POST",
      data: payload,
    })) as any;

    return response?.data ?? response;
  },
};
