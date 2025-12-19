/**
 * Wishlist Types - Dựa trên backend DTOs
 */

// Response Types
export interface WishlistResponse {
    id: string;
    name: string;
    description?: string;
    isPublic: boolean;
    isDefault: boolean;
    buyerId: string;
    buyerName?: string;
    itemCount: number;
    createdAt: string;
    updatedAt: string;
    items?: WishlistItemResponse[];
    // Share fields
    shareToken?: string;
    shareUrl?: string;
    ogMetadata?: WishlistOgMetadata;
    // Cover image fields
    imageBasePath?: string;
    imageExtension?: string;
}

/**
 * Open Graph metadata for social media sharing
 */
export interface WishlistOgMetadata {
    title: string;
    description: string;
    imageUrl?: string;
    url: string;
    itemCount: number;
    ownerName: string;
}


export interface WishlistSummaryResponse {
    id: string;
    name: string;
    description?: string;
    isPublic: boolean;
    isDefault: boolean;
    buyerId: string;
    buyerName?: string;
    itemCount: number;
    createdAt: string;
    updatedAt: string;
    // Cover image fields - for thumbnail display in list view
    imageBasePath?: string;
    imageExtension?: string;
}

export interface WishlistVariantOptionResponse {
    option: string;
    value: string;
}

export interface WishlistItemResponse {
    id: string;
    variantId: string;
    sku?: string;
    productId: string;
    productName: string;
    /**
     * ✅ MediaAsset fields (normalized storage)
     * basePath + extension from MediaAsset, variants built on-demand
     */
    imageBasePath?: string;
    imageExtension?: string;
    /**
     * ✅ Computed URL from MediaAsset (original variant for images)
     */
    productImage?: string;
    productPrice: number;
    productDescription?: string;
    quantity: number;
    notes?: string;
    priority: number;
    priorityText?: string;
    desiredPrice?: number;
    isPriceTargetMet?: boolean;
    createdAt: string;
    updatedAt: string;
    options?: WishlistVariantOptionResponse[];
}

// Request Types
export interface CreateWishlistRequest {
    name: string;
    description?: string;
    isPublic?: boolean;
    isDefault?: boolean;
    coverImageAssetId?: string;
}

export interface UpdateWishlistRequest {
    name?: string;
    description?: string;
    isPublic?: boolean;
    isDefault?: boolean;
    coverImageAssetId?: string;
}

export interface AddToWishlistRequest {
    variantId: string;
    quantity?: number;
    notes?: string;
    priority?: number;
    desiredPrice?: number;
}

export interface UpdateWishlistItemRequest {
    quantity?: number;
    notes?: string;
    priority?: number;
    desiredPrice?: number;
}

// Pagination
export interface WishlistQueryParams {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
}

export interface SearchWishlistParams {
    keyword: string;
    page?: number;
    size?: number;
}

// Enum for Priority
export enum WishlistPriority {
    NORMAL = 0,
    HIGH = 1,
    URGENT = 2
}

// Priority text mapping
export const PRIORITY_TEXT = [
  "Bình thường", // Tương ứng giá trị 0
  "Ưu tiên",     // Tương ứng giá trị 1
  "Rất ưu tiên"  // Tương ứng giá trị 2
];
/**
 * WishlistItemsGroup - Nhóm items đạt giá mong muốn theo wishlist
 */
export interface WishlistItemsGroup {
    wishlistId: string;
    wishlistName: string;
    wishlistDescription?: string;
    isPublic: boolean;
    isDefault: boolean;
    items: WishlistItemResponse[];
    itemCount: number;
}

/**
 * PriceTargetMetResponse - Response cho API lấy danh sách sản phẩm đạt giá mong muốn
 */
export interface PriceTargetMetResponse {
    wishlists: WishlistItemsGroup[];
    totalItems: number;
    totalWishlists: number;
}

