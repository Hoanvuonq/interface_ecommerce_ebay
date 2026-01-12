/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CreateShopRequest {
  userId: string;
  shopName: string;
  description?: string;
  logoUrl: string;
}

export interface UpdateShopRequest {
  shopName: string;
  description?: string;
  logo?: string;
  banner?: string;
}
export interface UpdateShopResponse {
  description: any;
  logoUrl: any;
  shopName: any;
  data: any;
}
export interface Address {
  countryCode: string;
  countryName: string;
  provinceCode: string;
  provinceName: string;
  districtCode: string;
  districtName: string;
  wardCode: string;
  wardName: string;
  detail?: string;
  // Old format address names (from ward_mappings)
  districtNameOld?: string;
  provinceNameOld?: string;
  wardNameOld?: string;
}
export interface CreateShopAddressRequest {
  address: Address;
  detail: string;
  fullName: string;
  phone: string;
  isDefault?: boolean;
  isDefaultPickup?: boolean;
  isDefaultReturn?: boolean;
}
export interface UpdateShopAddressRequest {
  address: Address;
  detail: string;
  fullName: string;
  phone: string;
  isDefault?: boolean;
  isDefaultPickup?: boolean;
  isDefaultReturn?: boolean;
}
export interface CreateShopLegalRequest {
  nationality: string;
  identityType: "CMND" | "CCCD" | "Passport";
  identityNumber: string;
  fullName: string;
  fontImageUrl: string;
  backImageUrl: string;
  faceImageUrl: string;
}
export interface UpdateShopLegalRequest {
  nationality: string;
  identityType: "CMND" | "CCCD" | "Passport";
  identityNumber: string;
  fullName: string;
  fontImageUrl?: string;
  backImageUrl?: string;
  faceImageUrl?: string;
}
export interface CreateShopTaxRequest {
  type: "PERSONAL" | "HOUSEHOLD" | "COMPANY";
  registeredAddress: Address;
  email: string;
  taxIdentificationNumber: string;
}
export interface UpdateShopTaxRequest {
  type: "PERSONAL" | "HOUSEHOLD" | "COMPANY";
  registeredAddress: Address;
  email: string;
  taxIdentificationNumber: string;
}

export interface CreateShopComplete {
  shopName: string;
  description?: string;
  logoUrl: string;
  legalInfo: CreateShopLegalRequest;
  taxInfo: CreateShopTaxRequest;
  address: CreateShopAddressRequest;
}

// ShopDetailResponse từ backend
export interface ShopDetailResponse {
  shopId: string;
  shopName: string;
  userId?: string;
  username?: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  status: string;
  rejectedReason?: string;
  verifyBy?: string;
  verifyDate?: string;
  createdBy?: string;
  createdDate?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  legalInfo?: any;
  taxInfo?: any;
  address?: any;
  verificationInfo?: any;
}