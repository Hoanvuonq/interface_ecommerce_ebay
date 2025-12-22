/**
 * Shipment Types
 */

export interface PackageInfo {
  weight: number;
  width: number;
  length: number;
  height: number;
  weightChargeMin?: number;
}

export interface PackagePriceRequest {
  name_city_from: string;
  name_city_to: string;
  packages: PackageInfo[];
}

export interface OverSize {
  price: number;
  description?: string;
  name?: string;
  id?: string;
}

export interface PackageConkinData {
  nameService?: string;
  nameCompany?: string;
  constPPXD?: number;
  constVAT?: number;
  priceNet?: number;
  pricePeakSeason?: number;
  priceOther?: number;
  priceTotal: number;
  overSize?: OverSize;
  zone?: string;
  totalWeight?: number;
}

export interface PackageConkinResponse {
  status: number;
  message: string;
  data: PackageConkinData;
}

// ========== GHN Costs Types ==========

export interface GHNItem {
  name: string;
  code: string;
  price: number;
  quantity: number;
  length: number;
  width: number;
  height: number;
  weight: number;
  category: {
    level1: string;
  };
}

export interface GHNAddress {
  province: string;
  district: string;
  ward: string;
}

export interface GHNCostsRequest {
  insurance_value?: number;
  items: GHNItem[];
  to: GHNAddress;
  from: GHNAddress;
  cod_value?: number;
}

export interface GHNCostsResponse {
  code: number;
  message: string;
  data?: {
    total: number;
    service_fee: number;
    insurance_fee: number;
    pick_station_fee: number;
    cod_fee: number;
    return_fee: number;
    r2s_fee: number;
    coupon_value: number;
    [key: string]: any;
  };
}

// ========== Costs Shipments Types ==========

export interface CostsItemRequest {
  name: string;
  code?: string;
  price: number;
  quantity: number;
  width: number;
  height: number;
  length: number;
  weight: number;
  category: {
    level1: string;
  };
}

export interface CostsRequest {
  items: CostsItemRequest[];
  id_buyer_address: string;
  id_shop_address: string; // shop addressId (không phải shopId)
  cod_value: number;
  insurance_value: number;
}

export interface CostsShipmentResponse {
  costs?: number; // Tổng chi phí vận chuyển
  serviceCompanyType?: string; // Loại dịch vụ vận chuyển (GHN, CONKIN, etc.)
  total?: number; // Alias cho costs (để tương thích)
  service_fee?: number;
  insurance_fee?: number;
  pick_station_fee?: number;
  cod_fee?: number;
  return_fee?: number;
  r2s_fee?: number;
  coupon_value?: number;
  [key: string]: any;
}

