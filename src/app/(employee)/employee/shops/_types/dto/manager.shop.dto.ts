import { VerifiedStatus } from "../manager.shop.type";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface GetShopRequest {
  name?: string;
  shopStatus?: string[];
  page?: number;
  size?: number;
  isDeleted?: boolean;
}

export interface GetShopResponse {
  data: any;
  
}

export interface GetShopDetailResponse {
  data: any;
}

export interface VerifyShopRequest {
  verifiedStatus: VerifiedStatus;
  reason?: string;
}

export interface VerifyShopResponse {
  data: any;
}

export interface VerifyShopLegalResponse {
  data: any;
}

export interface VerifyShopTaxResponse {
  data: any;
}