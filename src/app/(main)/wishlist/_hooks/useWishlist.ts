
import { useToast } from "@/hooks/useToast";
import { wishlistService } from "@/services/wishlist/wishlist.service";
import type {
    AddToWishlistRequest,
    CreateWishlistRequest,
    UpdateWishlistItemRequest,
    UpdateWishlistRequest,
    WishlistQueryParams
} from "@/types/wishlist/wishlist.types";
import { useCallback, useState } from "react";

export const useWishlist = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { success } = useToast();

  

  // Helper to handle API calls
  const handleRequest = useCallback(
    async <T>(
      requestFn: () => Promise<T>,
      successMsg?: string
    ): Promise<{ success: boolean; data?: T; error?: string }> => {
      setLoading(true);
      setError(null);
      try {
        const data = await requestFn();
        if (successMsg) {
          success(successMsg);
        }
        return { success: true, data };
      } catch (err: any) {
        let errorMessage = "Có lỗi xảy ra. Vui lòng thử lại.";

        if (typeof err === "string") {
          errorMessage = err;
        } else if (err?.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err?.response?.data?.error) {
          errorMessage = err.response.data.error;
        } else if (err?.message) {
          errorMessage = err.message;
        }

        console.error("❌ API Error:", {
          error: err,
          message: errorMessage,
          response: err?.response?.data,
        });

        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ========== Wishlist Management ==========

  /**
   * Tạo wishlist mới
   */
  const createWishlist = useCallback(
    async (requestData: CreateWishlistRequest) => {
      return handleRequest(
        () => wishlistService.createWishlist(requestData),
        "Đã tạo wishlist thành công"
      );
    },
    [handleRequest]
  );

  /**
   * Cập nhật wishlist
   */
  const updateWishlist = useCallback(
    async (wishlistId: string, requestData: UpdateWishlistRequest) => {
      return handleRequest(
        () => wishlistService.updateWishlist(wishlistId, requestData),
        "Đã cập nhật wishlist thành công"
      );
    },
    [handleRequest]
  );

  /**
   * Xóa wishlist
   */
  const deleteWishlist = useCallback(
    async (wishlistId: string) => {
      return handleRequest(
        () => wishlistService.deleteWishlist(wishlistId),
        "Đã xóa wishlist thành công"
      );
    },
    [handleRequest]
  );

  /**
   * Lấy wishlist theo ID
   */
  const getWishlistById = useCallback(
    async (wishlistId: string) => {
      return handleRequest(() => wishlistService.getWishlistById(wishlistId));
    },
    [handleRequest]
  );

  /**
   * Lấy danh sách wishlist của buyer
   */
  const getBuyerWishlists = useCallback(
    async (params?: WishlistQueryParams) => {
      return handleRequest(() => wishlistService.getBuyerWishlists(params));
    },
    [handleRequest]
  );

  /**
   * Lấy wishlist mặc định
   */
  const getDefaultWishlist = useCallback(async () => {
    return handleRequest(() => wishlistService.getDefaultWishlist());
  }, [handleRequest]);

  /**
   * Đặt wishlist làm mặc định
   */
  const setAsDefault = useCallback(
    async (wishlistId: string) => {
      return handleRequest(
        () => wishlistService.setAsDefault(wishlistId),
        "Đã đặt wishlist làm mặc định"
      );
    },
    [handleRequest]
  );

  // ========== Wishlist Items Management ==========

  /**
   * Thêm sản phẩm vào wishlist
   */
  const addToWishlist = useCallback(
    async (wishlistId: string, requestData: AddToWishlistRequest) => {
      return handleRequest(
        () => wishlistService.addToWishlist(wishlistId, requestData),
        "Đã thêm vào wishlist thành công"
      );
    },
    [handleRequest]
  );

  /**
   * Thêm sản phẩm vào wishlist mặc định (quick add)
   */
  const quickAddToWishlist = useCallback(
    async (variantId: string, quantity: number = 1) => {
      return handleRequest(
        () => wishlistService.addToDefaultWishlist({ variantId, quantity }),
        "Đã thêm vào yêu thích"
      );
    },
    [handleRequest]
  );

  /**
   * Cập nhật item trong wishlist
   */
  const updateWishlistItem = useCallback(
    async (
      wishlistId: string,
      itemId: string,
      requestData: UpdateWishlistItemRequest
    ) => {
      return handleRequest(
        () =>
          wishlistService.updateWishlistItem(wishlistId, itemId, requestData),
        "Đã cập nhật item thành công"
      );
    },
    [handleRequest]
  );

  /**
   * Xóa sản phẩm khỏi wishlist
   */
  const removeFromWishlist = useCallback(
    async (wishlistId: string, variantId: string) => {
      return handleRequest(
        () => wishlistService.removeFromWishlist(wishlistId, variantId),
        "Đã xóa khỏi wishlist"
      );
    },
    [handleRequest]
  );

  /**
   * Lấy danh sách items trong wishlist
   */
  const getWishlistItems = useCallback(
    async (wishlistId: string) => {
      return handleRequest(() => wishlistService.getWishlistItems(wishlistId));
    },
    [handleRequest]
  );

  /**
   * Kiểm tra sản phẩm có trong wishlist không
   */
  const isProductInWishlist = useCallback(async (variantId: string) => {
    try {
      const result = await wishlistService.isProductInWishlist(variantId);
      return result;
    } catch (err) {
      return false;
    }
  }, []);

  /**
   * Kiểm tra nhiều variants có trong wishlist không
   */
  const checkVariantsInWishlist = useCallback(async (variantIds: string[]) => {
    try {
      const result = await wishlistService.checkVariantsInWishlist(variantIds);
      return result;
    } catch (err) {
      return new Map<string, boolean>();
    }
  }, []);

  /**
   * Toggle wishlist - Add if not in, remove if already in
   */
  const toggleWishlist = useCallback(
    async (variantId: string) => {
      try {
        console.log("🔄 Toggling wishlist for variant:", variantId);

        // Check if already in wishlist
        const inWishlist = await isProductInWishlist(variantId);
        console.log("📊 Current status:", inWishlist);

        if (inWishlist) {
          // Get default wishlist ID
          console.log("🗑️ Removing from wishlist...");
          const defaultWishlist = await wishlistService.getDefaultWishlist();
          // Remove from wishlist
          await wishlistService.removeFromWishlist(
            defaultWishlist.id,
            variantId
          );
          console.log("✅ Removed successfully");
          return { success: true, added: false };
        } else {
          // Add to wishlist
          console.log("➕ Adding to wishlist...");
          await wishlistService.addToDefaultWishlist({
            variantId,
            quantity: 1,
          });
          console.log("✅ Added successfully");
          return { success: true, added: true };
        }
      } catch (err: any) {
        console.error("❌ Error toggling wishlist:", err);
        const errorMessage =
          typeof err === "string" ? err : err?.message || "Có lỗi xảy ra";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [isProductInWishlist]
  );

  return {
    // State
    loading,
    error,

    // Wishlist Management
    createWishlist,
    updateWishlist,
    deleteWishlist,
    getWishlistById,
    getBuyerWishlists,
    getDefaultWishlist,
    setAsDefault,

    // Wishlist Items
    addToWishlist,
    quickAddToWishlist,
    toggleWishlist,
    updateWishlistItem,
    removeFromWishlist,
    getWishlistItems,
    isProductInWishlist,
    checkVariantsInWishlist,

    // Price Target Met
    getPriceTargetMetItems: useCallback(async () => {
      return handleRequest(() => wishlistService.getPriceTargetMetItems());
    }, [handleRequest]),

    // Wishlist Sharing
    regenerateShareToken: useCallback(
      async (wishlistId: string) => {
        return handleRequest(
          () => wishlistService.regenerateShareToken(wishlistId),
          "Đã tạo lại link chia sẻ"
        );
      },
      [handleRequest]
    ),
  };
};
