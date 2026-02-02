/**
 * Buyer Types - Type definitions for Buyer module
 */

/**
 * Gender enum
 */
export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

/**
 * Buyer Create Request
 */
export interface BuyerCreateRequest {
  userId: string;
  fullName: string;
  phone: string;
  dateOfBirth?: string; // ISO date string (YYYY-MM-DD)
  gender: Gender;
}

/**
 * Buyer Update Request
 */
export interface BuyerUpdateRequest {
  fullName: string;
  phone: string;
  dateOfBirth: string; // ISO date string (YYYY-MM-DD)
  gender: Gender;
}
export enum AddressType {
  HOME = "HOME",
  OFFICE = "OFFICE",
  OTHER = "OTHER",
}

export interface GeoInfo {
  latitude: number;
  longitude: number;
  userVerified: boolean;
  userAdjusted: boolean;
  confirmed: boolean;
}
export interface AddressDetail {
  country: string;
  zipCode: string;
  province: string;
  ward: string;
  detail: string;
  district: string;
  geoinfo: GeoInfo | null;
  isInternational: boolean;
}
export interface BuyerAddressResponse {
  addressId: string;
  recipientName: string;
  phone: string;
  type: AddressType;
  isDefault: boolean;
  address: AddressDetail;
  default: boolean;
  defaultPickup: boolean;
  defaultReturn: boolean;
}

/**
 * Buyer Response
 */
export interface BuyerResponse {
  buyerId: string;
  fullName: string;
  phone: string;
  dateOfBirth: string; // ISO date string
  gender: Gender;
  createdBy: string;
  createdDate: string; // ISO datetime string
  lastModifiedBy: string;
  lastModifiedDate: string; // ISO datetime string
  deleted: boolean;
  version: number;
}

/**
 * Buyer Detail Response
 */
export interface BuyerDetailResponse {
  buyerId: string;
  fullName: string;
  phone: string;
  dateOfBirth: string; // ISO date string
  gender: Gender;
  addresses: BuyerAddressResponse[];
  createdBy: string;
  createdDate: string; // ISO datetime string
  lastModifiedBy: string;
  lastModifiedDate: string; // ISO datetime string
  deleted: boolean;
  version: number;
}

/**
 * Buyer Address Create Request
 */
export interface BuyerAddressCreateRequest {
  recipientName: string;
  phone: string;
  detailAddress: string;
  ward: string;
  district: string;
  province: string;
  country: string;
  type?: AddressType;
  districtNameOld?: string;
  provinceNameOld?: string;
  wardNameOld?: string;
}

/**
 * Buyer Address Update Request
 */
export interface BuyerAddressUpdateRequest {
  recipientName: string;
  phone: string;
  detailAddress: string;
  ward: string;
  district: string;
  province: string;
  country: string;
  type: AddressType;
  // Old format address names (from ward_mappings)
  districtNameOld?: string;
  provinceNameOld?: string;
  wardNameOld?: string;
}
