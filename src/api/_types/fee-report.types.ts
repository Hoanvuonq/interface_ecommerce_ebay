export interface FeeTypeBreakdown {
  feeType: string;
  displayName: string;
  totalAmount: number;
  count: number;
  averageAmount?: number;
  percentageOfTotal?: number;
}

export interface ShopFeeSummaryResponse {
  shopId: string;
  shopName: string;
  periodFrom: string;
  periodTo: string;
  totalOrders: number;
  completedOrders: number;
  totalGmv: number;
  totalFees: number;
  netRevenue: number;
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
  chargedTo: "SHOP" | "PLATFORM";
  percentage?: number;
  baseAmount?: number;
}

export interface ItemFeeEntry {
  orderItemId: string;
  productName: string;
  feeType: string;
  amount: number;
  chargedTo: "SHOP" | "PLATFORM";
  percentage?: number;
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
