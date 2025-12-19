/**
 * Buyer Types - Type definitions for Buyer module
 */

/**
 * Gender enum
 */
export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHER = 'OTHER'
}

/**
 * Address Type enum
 */
export enum AddressType {
    HOME = 'HOME',       // Nhà riêng
    OFFICE = 'OFFICE',   // Văn phòng
    OTHER = 'OTHER'      // Khác
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

/**
 * Buyer Address Response
 */
export interface BuyerAddressResponse {
    addressId: string;
    recipientName: string;
    phone: string;
    detailAddress: string;
    ward: string;
    district: string;
    province: string;
    country: string;
    type: AddressType;
    createdBy: string;
    createdDate: string; // ISO datetime string
    lastModifiedBy: string;
    lastModifiedDate: string; // ISO datetime string
    deleted: boolean;
    version: number;
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
    // Old format address names (from ward_mappings)
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

