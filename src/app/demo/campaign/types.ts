/**
 * Campaign Types - Based on Backend DTOs
 * Location: demo/campaign/types.ts
 */

// ============================================================
// ENUMS
// ============================================================

export type CampaignStatus = 'ACTIVE' | 'PAUSED' | 'ENDED' | 'CANCELLED';
export type CampaignType = 'FLASH_SALE' | 'DAILY_DEAL' | 'MEGA_SALE' | 'SHOP_SALE';
export type SlotStatus = 'UPCOMING' | 'ACTIVE' | 'ENDED';
export type SponsorType = 'PLATFORM' | 'SHOP';
export type RegistrationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// ============================================================
// RESPONSE DTOs
// ============================================================

export interface CampaignResponse {
  id: string;
  name: string;
  description: string;
  campaignType: CampaignType;
  sponsorType: SponsorType;
  status: CampaignStatus;

  // Scheduling
  startDate: string;
  endDate: string;
  isRecurring?: boolean;
  recurringStartTime?: string;
  recurringEndTime?: string;

  // Display
  bannerAssetId?: string;
  thumbnailAssetId?: string;
  bannerUrl?: string;
  thumbnailUrl?: string;
  displayPriority?: number;
  isFeatured?: boolean;

  // Shop Info (if SHOP campaign)
  shopId?: string;
  shopName?: string;

  // Slots (optional, included when fetching detail)
  slots?: CampaignSlotResponse[];

  // Statistics
  totalSlots?: number;
  activeSlots?: number;
  totalProducts?: number;
  totalSold?: number;

  // Audit
  createdDate?: string;
  createdBy?: string;
  scheduledAt?: string;
  scheduledBy?: string;
}

export interface CampaignSlotResponse {
  id: string;
  campaignId: string;
  campaignName?: string;

  // Time
  slotDate: string;
  startTime: string;
  endTime: string;
  status: SlotStatus;
  slotName?: string;

  // Capacity
  maxProducts?: number;
  registeredProducts?: number;
  approvedProducts?: number;
  isFullyBooked?: boolean;

  // Time helpers
  secondsUntilStart?: number;
  secondsUntilEnd?: number;
  durationMinutes?: number;

  // Products (optional, for detail view)
  products?: CampaignSlotProductResponse[];
}

export interface CampaignSlotProductResponse {
  id: string;

  // Slot Info
  slotId: string;
  slotStartTime?: string;
  slotEndTime?: string;
  campaignId?: string;
  campaignName?: string;

  // Product Info
  productId: string;
  productName: string;
  productSlug?: string;
  productThumbnail?: string;
  variantId?: string;
  variantSku?: string;

  // Shop Info
  shopId?: string;
  shopName?: string;

  // Pricing
  originalPrice: number;
  salePrice: number;
  discountPercent: number;
  discountAmount?: number;

  // Stock
  stockLimit: number;
  stockSold: number;
  stockRemaining: number;
  isSoldOut?: boolean;
  purchaseLimitPerUser?: number;

  // Registration Status
  status?: RegistrationStatus;
  rejectionReason?: string;

  // Display
  displayPriority?: number;

  // Audit
  createdDate?: string;
}
