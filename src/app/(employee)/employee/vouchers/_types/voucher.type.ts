export enum VoucherType {
  PLATFORM = "PLATFORM",
  SHOP = "SHOP",
}

export enum VoucherStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SCHEDULED = "SCHEDULED",
  ARCHIVED = "ARCHIVED",
}

export enum DiscountMethod {
  FIXED_AMOUNT = "FIXED_AMOUNT",
  PERCENTAGE = "PERCENTAGE",
}

export enum DiscountTarget {
  SHIP = "SHIP",
  PRODUCT = "PRODUCT",
}

export enum VoucherObject {
  SHOP = "SHOP",
  PRODUCT = "PRODUCT",
  CUSTOMER = "CUSTOMER",
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

export interface VoucherCreate {
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

export interface VoucherUpdate {
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

export interface VoucherObjectUpdate {
  id: string;
  obejctIds: string[];
  type: VoucherObject;
}

export interface VoucherFilter {
  type?: VoucherType;
  status?: VoucherStatus;
  shopId?: string;
  search?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface VoucherDateFilter {
  from: string;
  to: string;
  mode?: string;
  type?: VoucherType;
  status?: VoucherStatus;
}
