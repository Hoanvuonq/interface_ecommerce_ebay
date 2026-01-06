import type { ReviewStatisticsResponse } from "../reviews/review.types";

export interface PublicCategoryDTO {
  id: string;
  name: string;
  slug: string;
}

export interface PublicProductMediaDTO {
  id: string;
  basePath?: string | null;
  extension?: string | null;
  url?: string | null;
  type: "IMAGE" | "VIDEO" | "AUDIO";
  title?: string | null;
  altText?: string | null;
  sortOrder?: number;
  isPrimary?: boolean;
}

export interface PublicProductOptionValueDTO {
  id: string;
  name: string;
  displayOrder?: number;
}

export interface PublicProductOptionDTO {
  id: string;
  name: string;
  values?: PublicProductOptionValueDTO[];
}

export interface PublicProductVariantDTO {
  id: string;
  sku: string;
  imageBasePath?: string | null;
  imageExtension?: string | null;
  imageUrl?: string | null;
  corePrice?: number;
  price: number;
  optionValues?: PublicProductOptionValueDTO[];
  inventory?: {
    id: string;
    stock: number;
  };
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  weightGrams?: number;
  [key: string]: any;
}

export interface ProductVoucherInfoDTO {
  voucherId: string;
  code: string;
  name?: string | null;
  description?: string | null;
  voucherScope: "SHOP_ORDER" | "SHIPPING" | "PRODUCT";
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue?: number | null;
  maxDiscount?: number | null;
  sponsorType?: "PLATFORM" | "SHOP";
  startDate?: string | null;
  endDate?: string | null;
  discountAmount?: number;
  priceAfterDiscount?: number;
}

export interface PublicShopSummaryDTO {
  shopId: string;
  shopName: string;
  description?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  status: string;
  username: string;
  userId: string;
  createdDate: string;
}

export interface PublicProductDetailDTO {
  id: string;
  name: string;
  slug: string;
  description?: string;
  basePrice: number;
  priceMin?: number | null;
  priceMax?: number | null;
  comparePrice?: number;
  active: boolean;
  approvalStatus: "APPROVED" | "PENDING" | "REJECTED" | "DRAFT";
  approvedBy?: string | null;
  approvedAt?: string | null;
  promotedUntil?: string | null;
  isFeatured?: boolean;
  category: PublicCategoryDTO;
  shop?: PublicShopSummaryDTO;
  variants: PublicProductVariantDTO[];
  media: PublicProductMediaDTO[];
  options?: PublicProductOptionDTO[];
  reviewStatistics?: ReviewStatisticsResponse;
  bestShopVoucher?: ProductVoucherInfoDTO | null;
  bestPlatformVoucher?: ProductVoucherInfoDTO | null;
  priceAfterBestVoucher?: number;
  priceAfterBestShopVoucher?: number;
  priceAfterBestPlatformVoucher?: number;
  shippingRestrictions?: ShippingRestrictionsDTO | null;
  version: number;
}

export interface ShippingRestrictionsDTO {
  restrictionType?: string | null;
  maxShippingRadiusKm?: number | null;
  countryRestrictionType?: string | null;
  restrictedCountries?: string[] | null;
  restrictedRegions?: string[] | null;
}

export interface PublicProductListItemDTO {
  id: string;
  name: string;
  slug: string;
  description?: string;
  basePrice: number;
  priceMin?: number | null;
  priceMax?: number | null;
  comparePrice?: number;
  active: boolean;
  promotedUntil?: string | null;
  isFeatured?: boolean;
  category: PublicCategoryDTO;
  media: Array<
    Pick<PublicProductMediaDTO, "id" | "url" | "type" | "isPrimary">
  >;
  bestShopVoucher?: ProductVoucherInfoDTO | null;
  bestPlatformVoucher?: ProductVoucherInfoDTO | null;
  priceAfterBestVoucher?: number;
  priceAfterBestShopVoucher?: number;
  priceAfterBestPlatformVoucher?: number;
  version: number;
  variants?: PublicProductVariantDTO[];
}

export interface PublicProductSearchQueryDTO {
  keyword?: string;
  categoryId?: string;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
  sort?: string;
}
