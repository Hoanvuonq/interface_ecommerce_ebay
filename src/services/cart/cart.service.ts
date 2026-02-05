/**
 * Cart Service - API calls cho giỏ hàng
 */

import type {
  AddToCartRequest,
  CartDto,
  CartUpdateRequest,
  SelectItemsRequest,
  UpdateCartItemRequest,
} from "@/types/cart/cart.types";
import { request } from "@/utils/axios.customize";

import type { ApiResponse } from "@/api/_types/api.types";
import { generateIdempotencyKey } from "@/utils/generateIdempotencyKey";
const CART_API_BASE = "/v1/cart";
const CART_ITEMS_API = "/v1/cart/items";
const CART_SELECTION_API = "/v1/carts/selection";

class CartService {
  /**
   * Lấy giỏ hàng hiện tại
   */
  async getCart(): Promise<CartDto> {
    const response: ApiResponse<CartDto> = await request({
      url: CART_API_BASE,
      method: "GET",
    });
    return response.data;
  }

  /**
   * Thêm sản phẩm vào giỏ hàng
   */
  async addToCart(addRequest: AddToCartRequest): Promise<CartDto> {
    try {
      const response: ApiResponse<CartDto> = await request({
        url: CART_ITEMS_API,
        method: "POST",
        data: addRequest,
        headers: { "Idempotency-Key": generateIdempotencyKey() },
      });
      return response.data;
    } catch (e: any) {
      const body = e?.response?.data;
      if (body?.code === 9402) {
        // attach server info and rethrow
        throw { type: "INSUFFICIENT_STOCK", info: body, original: e };
      }
      throw e;
    }
  }

  /**
   * Cập nhật số lượng sản phẩm trong giỏ
   */
  async updateCartItem(
    itemId: string,
    updateRequest: UpdateCartItemRequest,
    etag: string,
  ): Promise<CartDto> {
    const response: ApiResponse<CartDto> = await request({
      url: `${CART_ITEMS_API}/${itemId}`,
      method: "PUT",
      data: updateRequest,
      headers: {
        "Idempotency-Key": generateIdempotencyKey(),
        "If-Match": etag,
      },
    });
    return response.data;
  }

  /**
   * Xóa sản phẩm khỏi giỏ hàng
   */
  async removeCartItem(itemId: string, etag: string): Promise<CartDto> {
    const response: ApiResponse<CartDto> = await request({
      url: `${CART_ITEMS_API}/${itemId}`,
      method: "DELETE",
      headers: {
        "Idempotency-Key": generateIdempotencyKey(),
        "If-Match": etag,
      },
    });
    return response.data;
  }

  /**
   * Xóa tất cả sản phẩm trong giỏ
   */
  async clearCart(etag: string): Promise<CartDto> {
    const response: ApiResponse<CartDto> = await request({
      url: CART_ITEMS_API,
      method: "DELETE",
      headers: {
        "Idempotency-Key": generateIdempotencyKey(),
        "If-Match": etag,
      },
    });
    return response.data;
  }

  /**
   * Cập nhật giỏ hàng (select all/deselect all/update items)
   */
  async updateCart(cartUpdateRequest: CartUpdateRequest): Promise<CartDto> {
    const response: ApiResponse<CartDto> = await request({
      url: `${CART_API_BASE}/update`,
      method: "POST",
      data: cartUpdateRequest,
    });
    return response.data;
  }

  /**
   * Toggle chọn/bỏ chọn một item
   */
  async toggleItemSelection(itemId: string): Promise<CartDto> {
    const response: ApiResponse<CartDto> = await request({
      url: `${CART_SELECTION_API}/items/${itemId}/toggle`,
      method: "POST",
      data: {},
      headers: {
        "Idempotency-Key": generateIdempotencyKey(),
      },
    });
    return response.data;
  }

  /**
   * Chọn các items cụ thể
   */
  async selectItems(selectRequest: SelectItemsRequest): Promise<CartDto> {
    const response: ApiResponse<CartDto> = await request({
      url: `${CART_SELECTION_API}/select`,
      method: "POST",
      data: selectRequest,
      headers: {
        "Idempotency-Key": generateIdempotencyKey(),
      },
    });
    return response.data;
  }

  /**
   * Bỏ chọn các items cụ thể
   */
  async deselectItems(deselectRequest: SelectItemsRequest): Promise<CartDto> {
    const response: ApiResponse<CartDto> = await request({
      url: `${CART_SELECTION_API}/deselect`,
      method: "POST",
      data: deselectRequest,
      headers: {
        "Idempotency-Key": generateIdempotencyKey(),
      },
    });
    return response.data;
  }

  /**
   * Chọn tất cả items
   */
  async selectAllItems(): Promise<CartDto> {
    const response: ApiResponse<CartDto> = await request({
      url: `${CART_SELECTION_API}/select-all`,
      method: "POST",
      data: {},
      headers: {
        "Idempotency-Key": generateIdempotencyKey(),
      },
    });
    return response.data;
  }

  /**
   * Bỏ chọn tất cả items
   */
  async deselectAllItems(): Promise<CartDto> {
    const response: ApiResponse<CartDto> = await request({
      url: `${CART_SELECTION_API}/deselect-all`,
      method: "POST",
      data: {},
      headers: {
        "Idempotency-Key": generateIdempotencyKey(),
      },
    });
    return response.data;
  }
}

export const cartService = new CartService();

export function getCart(): any {
  throw new Error("Function not implemented.");
}
