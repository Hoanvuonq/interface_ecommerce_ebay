import {
  VoucherStatus,
  VoucherType,
  VoucherObject,
  DiscountTarget,
  DiscountMethod,
} from "../voucher.type";

export interface VoucherListResponse {
  success: boolean;
  code: number;
  data: {
    content: VoucherDetail[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
  };
  message: string;
}

export interface VoucherDetailResponse {
  success: boolean;
  code: number;
  data: VoucherDetail;
  message: string;
}

export interface VoucherRecommendRequest {
  userId: string;
  productIds: string[];
  orderTotal: number;
  productTotal: number;
}

export interface VoucherRecommendShopRequest {
  shopId: string;
  productIds: string[];
  subtotal: number;
}

export interface VoucherRecommendPlatformRequest {
  total: number;
  productIds: string[];
  shopIds: number[];
}

export interface VoucherScheduleRequest {
  id: string;
  scheduledTime: string;
}

export interface VoucherByObjectRequest {
  objectIds: string[];
  voucherType: string;
}

export interface VoucherByCodeRequest {
  code: string;
}


export interface VoucherDetail {
  id: string;
  code: string;
  voucherType: VoucherType;
  discountMethod: DiscountMethod;
  discountTarget: DiscountTarget;
  discountValue: number;
  minOrderValue: number;
  maxDiscount: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  usageVersion: number;
  status: VoucherStatus;
  applyToAllShops: boolean;
  applyToAllProducts: boolean;
  applyToAllCustomers: boolean;
  customerCount: number;
  shopCount: number;
  productCount: number;
  priority: number;
  activeAt: string;
  description: string;
  metadata: string;
  effectiveDiscount: number;
}

export interface VoucherCreateRequest {
  code: string;
  voucherType: VoucherType;
  discountMethod: DiscountMethod;
  discountTarget: DiscountTarget;
  discountValue: number;
  minOrderValue: number;
  maxDiscount: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  shopIds?: string[];
  shopId?: string;
  productIds?: string[];
  customerIds?: string[];
  applyToAllShops: boolean;
  applyToAllProducts: boolean;
  applyToAllCustomers: boolean;
}

export interface VoucherUpdateRequest {
  id: string;
  code: string;
  voucherType: VoucherType;
  discountMethod: DiscountMethod;
  discountTarget: DiscountTarget;
  discountValue: number;
  minOrderValue: number;
  maxDiscount: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
}

export interface VoucherObjectUpdateRequest {
  id: string;
  obejctIds: string[];
  type: VoucherObject;
}

export interface VoucherStatistics {
  totalVouchers: number;
  activeVouchers: number;
  expiredVouchers: number;
  totalUsage: number;
  totalDiscount: number;
  averageUsage: number;
  topVouchers: VoucherDetail[];
  usageByType: Record<VoucherType, number>;
  usageByStatus: Record<VoucherStatus, number>;
}

export interface VoucherTimeStats {
  todayNewVouchers: number;
  yesterdayNewVouchers: number;
  thisMonth: number;
  lastMonth: number;
  dailyGrowth: Array<{ date: string; count: number }>;
  monthlyGrowth: Array<{ month: number; count: number }>;
  top5Days: Array<{ date: string; count: number }>;
}

export interface VoucherBehaviorStats {
  loggedInToday: number;
  thisWeekLoggedIn: number;
  loggedInThisMonth: number;
  loggedInThisYear: number;
  monthlyStats: Array<{ month: string; count: number }>;
  weeklyDistribution: Array<{ day: string; count: number }>;
}

export interface RecommendShopVoucherRequest {
  shopId: string;
  productIds: string[];
  subtotal: number;
}

export interface RecommendPlatformVoucherRequest {
  total: number;
  productIds: string[];
  shopIds: number[];
}

export interface VoucherApplicationResponse {
  success: boolean;
  globalVouchers: {
    validVouchers: string[];
    invalidVouchers: string[];
    totalDiscount: number;
    discountDetails: VoucherDiscountDetail[];
  };
  shopResults: Array<{
    shopId: string;
    validVouchers: string[];
    invalidVouchers: string[];
    totalDiscount: number;
    discountDetails: VoucherDiscountDetail[];
    hasValidVouchers: boolean;
  }>;
  totalDiscount: number;
  shippingDiscountTotal: number;
  productDiscountTotal: number;
  errors: string[];
  warnings: string[];
}

export interface VoucherDiscountDetail {
  voucherCode: string;
  voucherType: string;
  discountAmount: number;
  discountMethod: string;
  discountTarget: string;
  isValid: boolean;
  reason?: string;
}

export interface VoucherListRequest {
  type?: VoucherType;
  status?: VoucherStatus;
  shopId?: string;
  search?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface VoucherByDateRequest {
  from: string;
  to: string;
  mode?: string;
  type?: VoucherType;
  status?: VoucherStatus;
}
