export enum DeviceTarget {
  ALL = "ALL",
  DESKTOP = "DESKTOP",
  MOBILE = "MOBILE",
}

export enum BannerDisplayLocation {
  HOMEPAGE_INTRO = "HOMEPAGE_INTRO",
  HOMEPAGE_HERO = "HOMEPAGE_HERO",
  HOMEPAGE_SIDEBAR = "HOMEPAGE_SIDEBAR",
  HOMEPAGE_FOOTER = "HOMEPAGE_FOOTER",
  PRODUCT_PAGE_TOP = "PRODUCT_PAGE_TOP",
  PRODUCT_PAGE_BOTTOM = "PRODUCT_PAGE_BOTTOM",
  PRODUCT_PAGE_SIDEBAR = "PRODUCT_PAGE_SIDEBAR",
  CATEGORY_PAGE_TOP = "CATEGORY_PAGE_TOP",
  CATEGORY_PAGE_SIDEBAR = "CATEGORY_PAGE_SIDEBAR",
  PRODUCT_LIST_TOP = "PRODUCT_LIST_TOP",
  PRODUCT_LIST_SIDEBAR = "PRODUCT_LIST_SIDEBAR",
  CART_PAGE = "CART_PAGE",
  CHECKOUT_PAGE = "CHECKOUT_PAGE",
  GLOBAL = "GLOBAL",
}

export interface BannerResponseDTO {
  id: string;
  title?: string;
  subtitle?: string;
  href?: string;
  position?: number;
  priority?: number;
  active?: boolean;
  scheduleStart?: string; // ISO datetime string
  scheduleEnd?: string; // ISO datetime string
  locale?: string;
  deviceTarget?: DeviceTarget;
  displayLocation?: BannerDisplayLocation;
  trackingId?: string;

  // Original Media (backward compatibility)
  imagePath?: string;
  extension?: string;
  mediaAssetId?: string;

  // Category & Product Support
  categoryId?: string;


  // Responsive Media - Desktop
  basePathDesktop?: string;
  extensionDesktop?: string;

  // Responsive Media - Mobile
  basePathMobile?: string;
  extensionMobile?: string;

  // Responsive Media Asset IDs
  mediaDesktopId?: string;
  mediaMobileId?: string;

  version?: number; // For optimistic locking (ETag)
}

export interface GetActiveBannersParams {
  locale?: string;
  position?: number;
  device?: string;
  displayLocation?: BannerDisplayLocation | string;
  categoryId?: string; // NEW: for category-specific banners
}

// ==================== MANAGER DTOs ====================

export interface CreateBannerRequest {
  title?: string;
  subtitle?: string;
  href?: string;
  position?: number;
  priority?: number;
  active?: boolean;
  scheduleStart?: string;
  scheduleEnd?: string;
  locale?: string;
  deviceTarget?: DeviceTarget;
  displayLocation?: BannerDisplayLocation;
  trackingId?: string;
  mediaAssetId: string; // Required

  // Category & Product Support
  categoryId?: string;


  // Responsive Media Support
  mediaDesktopId?: string;
  mediaMobileId?: string;
}

export interface UpdateBannerRequest {
  title?: string;
  subtitle?: string;
  href?: string;
  position?: number;
  priority?: number;
  active?: boolean;
  scheduleStart?: string;
  scheduleEnd?: string;
  locale?: string;
  deviceTarget?: DeviceTarget;
  displayLocation?: BannerDisplayLocation;
  trackingId?: string;
  mediaAssetId?: string;

  // Category & Product Support
  categoryId?: string;


  // Responsive Media Support
  mediaDesktopId?: string;
  mediaMobileId?: string;
}

export interface SearchBannersParams {
  keyword?: string;
  locale?: string;
  active?: boolean;
  categoryIds?: string[];
  page?: number;
  size?: number;
}

export interface ToggleActiveRequest {
  active: boolean;
}

// ==================== GROUPED BANNERS ====================

export interface GroupedBannerResponse {
  banners: Record<string, BannerResponseDTO[]>; // Key: displayLocation, Value: list of banners
}

export interface GetBannersByPageParams {
  page?: string; // e.g., "HOMEPAGE", "trangchu", "PRODUCT_PAGE"
  locale?: string;
  device?: string;
}
