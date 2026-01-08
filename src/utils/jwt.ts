/* eslint-disable @typescript-eslint/no-explicit-any */
import { PermissionEnum, RoleEnum } from "@/auth/_types/auth";
/**
 * User Info Type từ localStorage
 * ✅ Dựa vào cấu trúc user info được lưu từ backend
 */
type UserInfo = {
  userId?: string;
  id?: string;
  username?: string;
  email?: string;
  roleName?: string;
  roles?: string[];
  image?: string;
  [key: string]: any;
};

/**
 * Lấy user info từ localStorage
 * ✅ Thay thế hoàn toàn logic JWT token
 */
export const getUserInfo = (): UserInfo | null => {
  if (typeof window === "undefined") return null;

  try {
    const userInfoStr = localStorage.getItem("users");
    if (!userInfoStr) return null;

    const userInfo = JSON.parse(userInfoStr);
    return userInfo as UserInfo;
  } catch (error) {
    console.error("❌ Error parsing user info from localStorage:", error);
    return null;
  }
};

/**
 * Convert string role sang RoleEnum với validation
 */
export const toRoleEnum = (
  role: string | null | undefined
): RoleEnum | null => {
  if (!role || typeof role !== "string") return null;

  try {
    const upperRole = role.toUpperCase();
    // Validate role có tồn tại trong RoleEnum không
    if (Object.values(RoleEnum).includes(upperRole as RoleEnum)) {
      return upperRole as RoleEnum;
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Convert string permission sang PermissionEnum với validation
 */
const toPermissionEnum = (
  permission: string | PermissionEnum
): PermissionEnum | null => {
  if (!permission) return null;

  // PermissionEnum là empty enum, nên có thể là bất kỳ string nào
  // Chỉ cần đảm bảo là string và return
  if (typeof permission === "string") {
    return permission as unknown as PermissionEnum;
  }

  // Nếu đã là PermissionEnum thì return luôn
  return permission;
};

// ==================== USER INFO GETTERS ====================

/**
 * Lấy username từ user info
 */
export const getUserName = (): string | null => {
  const userInfo = getUserInfo();
  return userInfo?.username || userInfo?.email || null;
};

/**
 * Lấy userId từ user info
 */
export const getUserId = (): string | null => {
  const userInfo = getUserInfo();
  return userInfo?.userId || userInfo?.id || null;
};

/**
 * Lấy danh sách roles từ user info
 */
export const getRoles = (): RoleEnum[] => {
  const userInfo = getUserInfo();
  if (!userInfo) return [];

  // Ưu tiên roles array từ backend
  if (userInfo.roles && Array.isArray(userInfo.roles)) {
    return userInfo.roles
      .map(toRoleEnum)
      .filter((role): role is RoleEnum => role !== null);
  }

  // Fallback: roleName (single role)
  if (userInfo.roleName) {
    const role = toRoleEnum(userInfo.roleName);
    return role ? [role] : [];
  }

  return [];
};

/**
 * Lấy role đầu tiên (backward compatibility)
 */
export const getRole = (): RoleEnum | null => {
  const roles = getRoles();
  return roles.length > 0 ? roles[0] : null;
};

/**
 * Lấy danh sách permissions từ user info
 */
export const getPermissions = (): PermissionEnum[] => {
  const userInfo = getUserInfo();
  if (!userInfo || !userInfo.permissions) return [];

  if (Array.isArray(userInfo.permissions)) {
    return userInfo.permissions
      .map((p) => toPermissionEnum(p as string | PermissionEnum))
      .filter((p): p is PermissionEnum => p !== null);
  }

  return [];
};

// ==================== ROLE & PERMISSION CHECKS ====================

/**
 * Kiểm tra user có role cụ thể không
 */
export const hasRole = (role: RoleEnum): boolean => {
  return getRoles().includes(role);
};

/**
 * Kiểm tra user có bất kỳ role nào trong danh sách không
 */
export const hasAnyRole = (roles: RoleEnum[]): boolean => {
  const userRoles = getRoles();
  return userRoles.some((userRole) => roles.includes(userRole));
};

/**
 * Kiểm tra user có permission cụ thể không
 */
export const hasPermission = (permission: PermissionEnum): boolean => {
  return getPermissions().includes(permission);
};

// ==================== REDIRECT & NAVIGATION ====================

/**
 * Xác định redirect path dựa trên trang login hiện tại hoặc roles
 *
 * Logic:
 * 1. Nếu đang ở /login → return "/" (BUYER)
 * 2. Nếu đang ở /shop/login → return "/shop"
 * 3. Nếu đang ở /employee/login → return "/employee"
 * 4. Nếu không match pathname → fallback về logic dựa trên roles
 *
 * @param pathname - Optional pathname hiện tại, nếu không có sẽ tự động lấy từ window.location.pathname
 */
export const getRedirectPath = (pathname?: string): string => {
  // Lấy pathname hiện tại nếu không được truyền vào
  const currentPathname =
    pathname || (typeof window !== "undefined" ? window.location.pathname : "");

  // Kiểm tra pathname hiện tại để xác định redirect path
  if (currentPathname === "/login") {
    // Đang ở trang login BUYER → redirect về trang chủ
    return "/";
  }

  if (currentPathname === "/shop/login") {
    // Đang ở trang login SHOP → redirect về /shop
    return "/shop";
  }

  if (currentPathname === "/employee/login") {
    // Đang ở trang login EMPLOYEE → redirect về /employee
    return "/employee";
  }

  // Fallback: Nếu không match pathname, dùng logic dựa trên roles (ưu tiên theo thứ tự)
  const roles = getRoles();

  // Ưu tiên: Employee roles > SHOP > BUYER
  const employeeRoles = [
    RoleEnum.ADMIN,
    RoleEnum.ACCOUNTANT,
    RoleEnum.BUSINESS,
    RoleEnum.EXECUTIVE,
    RoleEnum.LOGISTICS,
    RoleEnum.IT,
    RoleEnum.SALE,
    RoleEnum.FINANCE,
  ];

  if (hasAnyRole(employeeRoles)) {
    return "/employee";
  }

  if (hasRole(RoleEnum.SHOP)) {
    return "/shop";
  }

  if (hasRole(RoleEnum.BUYER)) {
    return "/";
  }

  return "/";
};

// ==================== USER DETAIL UTILITIES ====================

/**
 * Lấy toàn bộ user detail từ localStorage
 */
export const getStoredUserDetail = (): any | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const userInfoStr = localStorage.getItem("users");
    if (!userInfoStr) return null;
    return JSON.parse(userInfoStr);
  } catch (error) {
    console.error("❌ Error getting stored user detail:", error);
    return null;
  }
};
/**
 * Cập nhật ảnh user trong localStorage
 */
export const updateUserImageInStorage = (imageUrl: string): void => {
  try {
    const userDetail = getStoredUserDetail();
    if (userDetail) {
      userDetail.image = imageUrl;
      localStorage.setItem("users", JSON.stringify(userDetail));
    }
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật ảnh trong localStorage:", error);
  }
};
