// Types for fee report module - mirrors backend DTOs in
// be_ecommerce_ebay/src/main/java/com/tmdt/ebay/feature/fee/report/dto

export interface FeeTypeBreakdown {
  feeType: string;
  displayName: string;
  totalAmount: number;
  count: number;
  averageAmount?: number; // only present on shop summary
  percentageOfTotal?: number; // only present on platform summary
}

export interface ShopFeeSummaryResponse {
  shopId: string;
  shopName: string;
  periodFrom: string; // ISO date (yyyy-MM-dd)
  periodTo: string;   // ISO date

  totalOrders: number;
  completedOrders: number;

  totalGmv: number;
  totalFees: number;
  netRevenue: number; // GMV - Fees = Shop nhận về

  feeBreakdown: FeeTypeBreakdown[];
}

export interface PlatformRevenueByFeeType {
  feeType: string;
  displayName: string;
  totalAmount: number;
  count: number;
  percentageOfTotal: number;
}

export interface PlatformTopShopEntry {
  shopId: string;
  shopName: string;
  totalFees: number;
  orderCount: number;
}

export interface PlatformRevenueResponse {
  periodFrom: string;
  periodTo: string;

  totalOrders: number;
  totalShops: number;

  totalGmv: number;
  totalPlatformRevenue: number;
  averageOrderValue: number;
  averageFeePerOrder: number;

  revenueBreakdown: PlatformRevenueByFeeType[];
  topShops: PlatformTopShopEntry[];
}

export interface OrderFeeEntry {
  feeType: string;
  displayName: string;
  amount: number;
  chargedTo: 'SHOP' | 'PLATFORM';
  /** Optional: fee rate (e.g. 0.0491 = 4.91%) if backend provides */
  percentage?: number;
  /** Optional: base amount used to calculate the fee */
  baseAmount?: number;
}

export interface ItemFeeEntry {
  orderItemId: string;
  productName: string;
  feeType: string;
  amount: number;
  chargedTo: 'SHOP' | 'PLATFORM';
  /** Fee rate on product price, e.g. 0.08 = 8% */
  percentage?: number;
  /** Product/item base amount that fee is calculated on */
  baseAmount?: number;
  displayName?: string;
}

export interface OrderFeeBreakdownResponse {
  orderId: string;
  orderCode: string;
  orderDate: string;

  shopId: string;
  shopName: string;

  orderTotal: number;
  productTotal: number;
  shippingFee: number;
  totalDiscount: number;
  taxAmount: number;

  totalFees: number;
  totalOrderFees: number;
  totalItemFees: number;

  platformRevenue: number;
  shopDeduction: number;
  shopNetRevenue: number;

  orderFees: OrderFeeEntry[];
  itemFees: ItemFeeEntry[];
}