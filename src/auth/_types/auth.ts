import { Gender } from "@/types/employee/employee";

export type User = AdminUser | ShopUser | BuyerUser | EmployeeUser;

export interface BaseUser {
  id: string;
  username: string;
  email: string;
  role: RoleEnum;
  permissions: PermissionEnum[];
}

export interface AdminUser extends BaseUser {
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
}

export interface BuyerUser extends BaseUser {
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
}

export interface EmployeeUser extends BaseUser {
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
}

export enum PermissionEnum {}

export enum RoleEnum {
  ADMIN = "ADMIN",
  SHOP = "SHOP",
  BUYER = "BUYER",
  LOGISTICS = "LOGISTICS",
  BUSINESS = "BUSINESS",
  ACCOUNTANT = "ACCOUNTANT",
  EXECUTIVE = "EXECUTIVE",
  IT = "IT",
  SALE = "SALE",
  FINANCE = "FINANCE",
}

export type ShopStatus =
  | "PENDING"
  | "ACTIVE"
  | "REJECTED"
  | "SUSPENDED"
  | "CLOSED";

export interface AuthResponseData {
  // ✅ DEPRECATED: Tokens được lưu trong HttpOnly cookies, không trả về trong response
  // ✅ Giữ lại để backward compatibility
  accessToken?: string;
  refreshToken?: string;
  // ✅ User information từ backend (BaseUserResponse)
  user?: {
    userId?: string;
    id?: string;
    username?: string;
    email?: string;
    image?: string;
    roleName?: string;
    roles?: string[];
    [key: string]: any;
  };
  emailVerified: boolean;
  email?: string;
  hasShopRole?: boolean;
  hasBuyerRole?: boolean;
  shopProfileExists?: boolean;
  requiresShopProfile?: boolean;
  requiresShopVerification?: boolean;
  shopId?: string | null;
  shopStatus?: ShopStatus | string | null;
  loginContextRole?: "BUYER" | "SHOP" | string | null;
}

export interface ShopUser extends BaseUser {
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

export interface ResendOtpRequest {
  email: string;
  otpType:
    | "ACCOUNT_ACTIVATION"
    | "PASSWORD_RESET"
    | "TWO_FACTOR_AUTH"
    | "WALLET_PASSWORD_RESET";
}

export interface VerifyRequest {
  email: string;
  otpCode: string;
}
export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordRequest {
  email: string;
  password: string;
  confirmPassword: string;
}
export interface VerifyPasswordRequest {
  email: string;
  otpCode: string;
}
export interface ForgotPasswordRequest {
  email: string;
}
export interface RefreshTokenRequest {
  // ✅ DEPRECATED: Backend đọc refreshToken từ cookies, không cần truyền
  // ✅ Giữ lại để backward compatibility, có thể là empty string
  refreshToken?: string;
}

export interface LogoutRequest {
  // ✅ DEPRECATED: Backend đọc refreshToken từ cookies, không cần truyền
  // ✅ Giữ lại để backward compatibility, có thể là empty string
  refreshToken?: string;
}

export interface UpdateEmployeeClientRequest {
  fullName?: string;
  gender?: Gender;
  dateOfBirth?: string;
  phone?: string;
  addressDetail?: string;
}

export interface UpdateBuyerClientRequest {
  fullName?: string;
  gender?: Gender;
  dateOfBirth?: string;
  phone?: string;
}

export interface UpdateUserClientRequest {
  image?: string;
}

export interface Oauth2LoginRequest {
  loginType: "GOOGLE" | "FACEBOOK";
  role: "BUYER" | "SHOP";
}

export interface Oauth2LoginCallBackRequest {
  code: string;
  loginType: "GOOGLE" | "FACEBOOK";
  role: "BUYER" | "SHOP";
}
