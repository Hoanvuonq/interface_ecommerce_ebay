import {
  CheckoutValidationErrorResponse,
  CheckoutOrderPreviewRequest,
  OrderPreviewResponse,
} from "../_types/checkout.type";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { checkoutService } from "../_services/checkout.service";

// Hàm Checkout Preview chính
export const checkoutPreviewMain = createAsyncThunk(
  "cart/checkoutPreview",
  async (request: CheckoutOrderPreviewRequest, { rejectWithValue }) => {
    try {
      const result = await checkoutService.checkout(request);

      if ("errors" in result) {
        return rejectWithValue(result as CheckoutValidationErrorResponse);
      }
      return result as OrderPreviewResponse;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to preview checkout",
      );
    }
  },
);
