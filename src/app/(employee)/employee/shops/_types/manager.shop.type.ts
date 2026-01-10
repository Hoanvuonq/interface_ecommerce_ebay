import { Address } from "@/app/(main)/shop/_types/dto/shop.dto";

export type VerifiedStatus = "PENDING" | "VERIFIED" | "REJECTED";

export type ShopStatus =
  | "PENDING"
  | "ACTIVE"
  | "REJECTED"
  | "SUSPENDED"
  | "CLOSED";

export type Shop = {
  shopId: string;
  shopName: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  status: ShopStatus;
  rejectedReason?: string;
  verifyBy?: string;
  verifyDate?: string;
  createdBy?: string;
  createdDate?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  deleted: boolean;
  version: number;
  username?: string;
};

export const type: Record<string, string> = {
  PERSONAL: "Cá nhân",
  COMPANY: "Doanh nghiệp",
  HOUSEHOLD: "Hộ kinh doanh",
};

export const nationalityMap: Record<string, string> = {
  vn: "Việt Nam",
  us: "Hoa Kỳ",
  jp: "Nhật Bản",
  kr: "Hàn Quốc",
  uk: "Anh",
  fr: "Pháp",
  de: "Đức",
  au: "Úc",
  ca: "Canada",
  sg: "Singapore",
};

export const identityMap: Record<string, string> = {
  CCCD: "Căn Cước Công Dân (CCCD)",
  CMND: "Chứng Minh Nhân Dân (CMND)",
  PASSPORT: "Hộ chiếu",
};

export const colorMap: Record<ShopStatus, string> = {
  PENDING: "orange",
  ACTIVE: "green",
  REJECTED: "red",
  SUSPENDED: "volcano",
  CLOSED: "gray",
};

export const labelMap: Record<ShopStatus, string> = {
  PENDING: "Chờ duyệt",
  ACTIVE: "Đang hoạt động",
  REJECTED: "Bị từ chối",
  SUSPENDED: "Bị tạm khóa",
  CLOSED: "Đã đóng",
};

export const verifyStatusMap: Record<VerifiedStatus, string> = {
  PENDING: "Chờ duyệt",
  VERIFIED: "Đã duyệt",
  REJECTED: "Bị từ chối",
};

export const verifyStatusColorMap: Record<VerifiedStatus, string> = {
  PENDING: "orange",
  VERIFIED: "green",
  REJECTED: "red",
};

export type IdentityType = "CCCD" | "CMND" | "PASSPORT";

export type BusinessType = "PERSONAL" | "COMPANY" | "HOUSEHOLD";

export type ShopDetail = {
  shopId: string;
  shopName: string;
  description: string;
  logoUrl: string;
  bannerUrl: string;
  status: ShopStatus;
  rejectedReason?: string;
  verifyBy?: string;
  verifyDate?: string;
  createdBy?: string;
  createdDate?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  deleted: boolean;
  version: number;
  username?: string;
  legalInfo?: {
    legalId?: string;
    nationality?: string;
    identityType?: IdentityType;
    identityNumber?: string;
    fullname?: string;
    frontImageUrl?: string;
    backImageUrl?: string;
    faceImageUrl?: string;
    verifiedStatus?: VerifiedStatus;
    verifyDate?: string;
    rejectedReason?: string;
    verifiedBy?: string;
    createdBy?: string;
    createdDate?: string;
    lastModifiedBy?: string;
    lastModifiedDate?: string;
  };
  taxInfo?: {
    taxId?: string;
    type?: BusinessType;
    registeredAddress?: Address;
    email?: string;
    taxIdentificationNumber?: string;
    verifiedStatus?: VerifiedStatus;
    verifyDate?: string;
    rejectedReason?: string;
    verifiedBy?: string;
    createdBy?: string;
    createdDate?: string;
    lastModifiedBy?: string;
    lastModifiedDate?: string;
  }
};