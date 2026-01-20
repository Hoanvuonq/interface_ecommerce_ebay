import type { ReviewStatisticsResponse } from "../../app/(shop)/shop/reviews/_types/review.types";

export interface PublicCategoryDTO {
  id: string;
  name: string;
  slug: string;
  description: string;
  active: boolean;
  imageBasePath: string;
  imageExtension: string;
  parent: string;
  children: string[];
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
export interface RatingDistribution {
  [key: string]: number;
}

export interface ReviewStatistics {
  reviewableId: string;
  totalReviews: number;
  averageRating: number;
  ratingDistribution: RatingDistribution;
  ratingPercentage: RatingDistribution;
  verifiedPurchaseCount: number;
  verifiedPurchasePercentage: number;
  commentCount: number;
  mediaReviewCount: number;
  imageReviewCount: number;
  videoReviewCount: number;
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
  priceBeforeDiscount?: number | null;
  showDiscount?: number | null;
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
  reviewStatistics?: ReviewStatistics | null;
  shop?: PublicShopSummaryDTO | null;
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

export interface ProductCategoryDto {
  id: string;
  name: string;
  slug: string;
  description: string;
  active: boolean;
  imageBasePath: string;
  imageExtension: string;
  parent: string;
  children: string[];
  defaultShippingRestrictions: ProductShippingRestrictionDto;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  version: number;
}
export interface ProductShippingRestrictionDto {
  restrictionType: "NONE" | "RADIUS" | string;
  maxShippingRadiusKm: number;
  countryRestrictionType: "ALLOW_ONLY" | "EXCLUDE_ONLY" | string;
  restrictedCountries: string[];
  restrictedRegions: string[];
}

export interface ProductShopDto {
  shopId: string;
  shopName: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | string;
  rejectedReason?: string;
  verifyBy?: string;
  verifyDate?: string;
  userId: string;
  username: string;
}

export interface ProductCampaignDto {
  campaignId: string;
  campaignName: string;
  campaignType: string;
  sponsorType: string;
  startTime: string;
  endTime: string;
  secondsRemaining: number;
}

export interface ProductVariantDto {
  id: string;
  sku: string;
  imageBasePath: string;
  imageExtension: string;
  imageAssetId: string;
  imageUrl: string;
  price: number;
  priceBeforeDiscount: number;
  hasStock: boolean;
  optionValues: Array<{
    id: string;
    name: string;
    displayOrder: number;
  }>;
  inventory: {
    id: string;
    quantity: number;
    reserved: number;
    available: number;
  };
  promotion: {
    promotionId: string;
    campaignId: string;
    stockLimit: number;
    stockSold: number;
  };
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  weightGrams: number;
  dimensionsString: string;
  weightString: string;
  volumeCm3: number;
  weightKg: number;
}

export interface ProductOptionValueDto {
  id: string;
  name: string;
  displayOrder: number;
}

export interface ProductInventoryDto {
  id: string;
  quantity: number;
  reserved: number;
  available: number;
}

export interface ProductVariantPromotionDto {
  promotionId: string;
  campaignId: string;
  stockLimit: number;
  stockSold: number;
}

export interface ProductMediaDto {
  id: string;
  basePath: string;
  extension: string;
  mediaAssetId: string;
  url: string;
  type: string;
  title: string;
  altText: string;
  sortOrder: number;
  isPrimary: boolean;
  productId: string;
}

export interface ProductOptionDto {
  id: string;
  name: string;
  values: ProductOptionValueDto[];
}

export interface PublicProductDto {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceMin: number;
  priceMax: number;
  priceBeforeDiscount: number;
  showDiscount: number;
  active: boolean;
  approvalStatus: "DRAFT" | "PENDING" | "APPROVED" | "REJECTED";
  approvedBy: string;
  approvedAt: string;
  promotedUntil: string;
  isFeatured: boolean;
  category: ProductCategoryDto;
  shop: ProductShopDto;
  activeCampaigns: Array<{
    campaignId: string;
    campaignName: string;
    campaignType: "FLASH_SALE" | string;
    sponsorType: "SHOP" | "PLATFORM";
    startTime: string;
    endTime: string;
    secondsRemaining: number;
  }>;
  variants: ProductVariantDto[];
  media: Array<{
    id: string;
    basePath: string;
    extension: string;
    mediaAssetId: string;
    url: string;
    type: "IMAGE" | "VIDEO" | "AUDIO";
    title: string;
    altText: string;
    sortOrder: number;
    isPrimary: boolean;
    productId: string;
  }>;
  options: Array<{
    id: string;
    name: string;
    values: Array<{
      id: string;
      name: string;
      displayOrder: number;
    }>;
  }>;
  reviewStatistics: ReviewStatistics;
  shippingRestrictions: ProductShippingRestrictionDto;
  bestShopVoucher: ProductVoucherInfoDTO | null;
  bestPlatformVoucher: ProductVoucherInfoDTO | null;
  priceAfterBestVoucher: number;
  priceAfterBestShopVoucher: number;
  priceAfterBestPlatformVoucher: number;
  version: number;
}

export interface PublicProductListResponse {
  content: PublicProductDto[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  previousPage: number;
  nextPage: number;
  empty: boolean;
  first: boolean;
  last: boolean;
}
