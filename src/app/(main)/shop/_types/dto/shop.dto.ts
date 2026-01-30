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
  frontImageAssetId: string; // MediaAsset ID (private bucket)
  backImageAssetId: string; // MediaAsset ID (private bucket)
  faceImageAssetId: string; // MediaAsset ID (private bucket)
}
export interface UpdateShopLegalRequest {
  nationality: string;
  identityType: "CMND" | "CCCD" | "Passport";
  identityNumber: string;
  fullName: string;
  frontImageAssetId?: string; // MediaAsset ID (private bucket)
  backImageAssetId?: string; // MediaAsset ID (private bucket)
  faceImageAssetId?: string; // MediaAsset ID (private bucket)
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

export interface ShopLegalInfoResponse {
  legalId?: string;
  nationality?: string;
  identityType?: string;
  identityNumber?: string;
  fullName?: string;
  frontImageAssetId?: string;
  backImageAssetId?: string;
  faceImageAssetId?: string;

  frontImagePreviewUrl?: string | null;
  backImagePreviewUrl?: string | null;
  faceImagePreviewUrl?: string | null;
  verifiedStatus?: string;
  verifyDate?: string;
  rejectedReason?: string;
  verifiedBy?: string;
}

export interface ShopTaxInfoResponse {
  taxId?: string;
  type?: string;
  registeredAddress?: Address;
  email?: string;
  taxIdentificationNumber?: string;
  verifiedStatus?: string;
  verifyDate?: string;
  verifiedBy?: string;
  rejectedReason?: string;
}

export interface ShopAddressDetailResponse {
  addressId?: string;
  address?: Address;
  type?: string;
  fullName?: string;
  phone?: string;
  default?: boolean;
  defaultPickup?: boolean;
  defaultReturn?: boolean;
}

export interface ShopVerificationInfo {
  isVerified: boolean;
  canSell: boolean;
  missingFields: string[];
  redirectTo: string;
  message: string;
  rejectedReasons?: Record<string, string>;
}

// ShopDetailResponse từ backend
export interface ShopDetailResponse {
  shopId: string;
  shopName: string;
  userId?: string;
  username?: string;
  description?: string;
  logoPath: string | null; // API dùng logoPath
  bannerPath: string | null; // API dùng bannerPath
  status: string;
  rejectedReason?: string;
  verifyBy?: string;
  verifyDate?: string;
  createdBy?: string;
  createdDate?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  legalInfo?: ShopLegalInfoResponse;
  taxInfo?: ShopTaxInfoResponse;
  address?: ShopAddressDetailResponse;
  verificationInfo?: ShopVerificationInfo;
}
