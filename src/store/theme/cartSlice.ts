import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { cartService } from "@/services/cart/cart.service";

import {
  CartDto,
  AddToCartRequest,
  UpdateCartItemRequest,
  CartUpdateRequest,
  SelectItemsRequest,
  OrderPreviewRequest,
  OrderPreviewResponse,
  CheckoutValidationErrorResponse,
} from "@/types/cart/cart.types";
import { useToast } from "@/hooks/useToast";
import { isAuthError } from "@/utils/cart/cart-auth.utils";

interface CartState {
  cart: CartDto | null;
  loading: boolean;
  error: string | null;
  etag: string | null;
  checkoutPreview: OrderPreviewResponse | null;
  checkoutLoading: boolean;
  checkoutError: string | null;
}

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
  etag: null,
  checkoutPreview: null,
  checkoutLoading: false,
  checkoutError: null,
};

const { success, error } = useToast();

const mergeSelectionState = (
  incomingCart: CartDto | any,
  previousCart?: CartDto | null
): CartDto | null => {
  if (!incomingCart || !incomingCart.shops) {
    return incomingCart;
  }

  const selectionMap = new Map<string, boolean>();

  previousCart?.shops?.forEach((shop) => {
    shop.items?.forEach((item) => {
      selectionMap.set(item.id, !!item.selectedForCheckout);
    });
  });

  const normalizedShops = incomingCart.shops.map((shop: any) => {
    const items = shop.items || [];
    const normalizedItems = items.map((item: any) => {
      const preservedSelection = selectionMap.get(item.id) ?? false;
      return {
        ...item,
        selectedForCheckout: preservedSelection,
      };
    });

    const hasSelectedItems = normalizedItems.some(
      (item: any) => item.selectedForCheckout
    );
    const allSelected =
      normalizedItems.length > 0 &&
      normalizedItems.every((item: any) => item.selectedForCheckout);

    return {
      ...shop,
      items: normalizedItems,
      hasSelectedItems,
      allSelected,
    };
  });

  return {
    ...incomingCart,
    shops: normalizedShops,
  };
};

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      return await cartService.getCart();
    } catch (error: any) {
      if (isAuthError(error)) {
        return rejectWithValue("Authentication required");
      }
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart"
      );
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (request: AddToCartRequest, { rejectWithValue }) => {
    try {
      const response = await cartService.addToCart(request);
      return response;
    } catch (error: any) {
      const errorMessage =
        error.message ||
        error.response?.data?.message ||
        "Failed to add to cart";
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async (
    {
      itemId,
      request,
      etag,
    }: { itemId: string; request: UpdateCartItemRequest; etag: string },
    { rejectWithValue }
  ) => {
    try {
      return await cartService.updateCartItem(itemId, request, etag);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update cart item"
      );
    }
  }
);

export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async (
    { itemId, etag }: { itemId: string; etag: string },
    { rejectWithValue }
  ) => {
    try {
      return await cartService.removeCartItem(itemId, etag);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove cart item"
      );
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (etag: string, { rejectWithValue }) => {
    try {
      return await cartService.clearCart(etag);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to clear cart"
      );
    }
  }
);

export const updateCart = createAsyncThunk(
  "cart/updateCart",
  async (request: CartUpdateRequest, { rejectWithValue }) => {
    try {
      return await cartService.updateCart(request);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update cart"
      );
    }
  }
);

export const toggleItemSelection = createAsyncThunk(
  "cart/toggleItemSelection",
  async (itemId: string, { rejectWithValue }) => {
    try {
      return await cartService.toggleItemSelection(itemId);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle item selection"
      );
    }
  }
);

export const selectItems = createAsyncThunk(
  "cart/selectItems",
  async (request: SelectItemsRequest, { rejectWithValue }) => {
    try {
      return await cartService.selectItems(request);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to select items"
      );
    }
  }
);

export const deselectItems = createAsyncThunk(
  "cart/deselectItems",
  async (request: SelectItemsRequest, { rejectWithValue }) => {
    try {
      return await cartService.deselectItems(request);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to deselect items"
      );
    }
  }
);

export const selectAllItems = createAsyncThunk(
  "cart/selectAllItems",
  async (_, { rejectWithValue }) => {
    try {
      return await cartService.selectAllItems();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to select all items"
      );
    }
  }
);

export const deselectAllItems = createAsyncThunk(
  "cart/deselectAllItems",
  async (_, { rejectWithValue }) => {
    try {
      return await cartService.deselectAllItems();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to deselect all items"
      );
    }
  }
);

export const checkoutPreview = createAsyncThunk(
  "cart/checkoutPreview",
  async (request: OrderPreviewRequest, { rejectWithValue }) => {
    try {
      const result = await cartService.checkout(request);

      if ("errors" in result) {
        return rejectWithValue(result as CheckoutValidationErrorResponse);
      }
      return result as OrderPreviewResponse;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to preview checkout"
      );
    }
  }
);

export const removeCartItems = createAsyncThunk(
  "cart/removeCartItems",
  async (
    { itemIds, etag }: { itemIds: string[]; etag: string },
    { rejectWithValue }
  ) => {
    try {
      const deletePromises = itemIds.map((id) =>
        cartService.removeCartItem(id, etag)
      );

      await Promise.all(deletePromises);

      return itemIds;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove items"
      );
    }
  }
);

// Slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCheckoutPreview: (state) => {
      state.checkoutPreview = null;
      state.checkoutError = null;
    },
    clearCartError: (state) => {
      state.error = null;
    },

    toggleItemSelectionLocal: (state, action: PayloadAction<string>) => {
      if (!state.cart) return;
      const itemId = action.payload;

      for (const shop of state.cart.shops) {
        const item = shop.items.find((i) => i.id === itemId);
        if (item) {
          item.selectedForCheckout = !item.selectedForCheckout;

          const selectedCount = shop.items.filter(
            (i) => i.selectedForCheckout
          ).length;
          shop.hasSelectedItems = selectedCount > 0;
          shop.allSelected = selectedCount === shop.items.length;
          break;
        }
      }
    },

    selectAllItemsLocal: (state) => {
      if (!state.cart) return;

      state.cart.shops.forEach((shop) => {
        shop.items.forEach((item) => {
          item.selectedForCheckout = true;
        });
        shop.hasSelectedItems = true;
        shop.allSelected = true;
      });
    },

    deselectAllItemsLocal: (state) => {
      if (!state.cart) return;

      state.cart.shops.forEach((shop) => {
        shop.items.forEach((item) => {
          item.selectedForCheckout = false;
        });
        shop.hasSelectedItems = false;
        shop.allSelected = false;
      });
    },

    toggleShopSelectionLocal: (state, action: PayloadAction<string>) => {
      if (!state.cart) return;

      const shopId = action.payload;
      const shop = state.cart.shops.find((s) => s.shopId === shopId);

      if (shop) {
        const newSelection = !shop.allSelected;
        shop.items.forEach((item) => {
          item.selectedForCheckout = newSelection;
        });
        shop.allSelected = newSelection;
        shop.hasSelectedItems = newSelection;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = mergeSelectionState(action.payload, state.cart);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          "Failed to fetch cart";

        if (!isAuthError({ message: state.error })) {
        }
      });

    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = mergeSelectionState(action.payload, state.cart);
        success("Đã thêm vào giỏ hàng");
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        error(action.payload as string);
      });

    builder
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = mergeSelectionState(action.payload, state.cart);
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        const errorMsg = action.payload as string;
        if (errorMsg && errorMsg !== "undefined") {
          state.error = errorMsg;
          error(errorMsg);
        }
      });

    builder
      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.loading = false;
        if (!action.payload || !action.payload.shops?.length) {
          if (state.cart) {
            state.cart.shops.forEach((shop) => {
              shop.items = shop.items.filter(
                (item) => item.id !== action.meta.arg.itemId
              );
            });
            state.cart.shops = state.cart.shops.filter(
              (shop) => shop.items.length > 0
            );
          }
        } else {
          state.cart = mergeSelectionState(action.payload, state.cart);
        }
        success("Đã xóa sản phẩm khỏi giỏ hàng");
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        error(action.payload as string);
      });

    builder
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload) {
          state.cart = {
            ...action.payload,
            shops: [],
            itemCount: 0,
            totalAmount: 0,
            version: action.payload?.version || 0,
          };
        } else {
          state.cart = null;
        }

        success("Đã xóa tất cả sản phẩm");
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        error((action.payload as string) || "Không thể xóa giỏ hàng");
      });

    builder
      .addCase(updateCart.fulfilled, (state, action) => {
        state.cart = mergeSelectionState(action.payload, state.cart);
      })
      .addCase(updateCart.rejected, (state, action) => {
        state.error = action.payload as string;
        error(action.payload as string);
      });

    builder
      .addCase(toggleItemSelection.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(toggleItemSelection.rejected, (state, action) => {
        state.error = action.payload as string;
        error(action.payload as string);
      });

    builder
      .addCase(selectItems.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(selectItems.rejected, (state, action) => {
        state.error = action.payload as string;
        error(action.payload as string);
      });

    builder
      .addCase(deselectItems.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(deselectItems.rejected, (state, action) => {
        state.error = action.payload as string;
        error(action.payload as string);
      });

    builder
      .addCase(selectAllItems.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(selectAllItems.rejected, (state, action) => {
        state.error = action.payload as string;
        error(action.payload as string);
      });

    builder
      .addCase(deselectAllItems.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(deselectAllItems.rejected, (state, action) => {
        state.error = action.payload as string;
        error(action.payload as string);
      });

    builder
      .addCase(checkoutPreview.pending, (state) => {
        state.checkoutLoading = true;
        state.checkoutError = null;
      })
      .addCase(checkoutPreview.fulfilled, (state, action) => {
        state.checkoutLoading = false;
        state.checkoutPreview = action.payload;
      })
      .addCase(checkoutPreview.rejected, (state, action) => {
        state.checkoutLoading = false;
        state.checkoutError =
          (action.payload as any)?.message || "Checkout validation failed";
        error(state.checkoutError ?? "Checkout validation failed");
      });
  },
});

export const {
  clearCheckoutPreview,
  clearCartError,
  toggleItemSelectionLocal,
  selectAllItemsLocal,
  deselectAllItemsLocal,
  toggleShopSelectionLocal,
} = cartSlice.actions;
export default cartSlice.reducer;
