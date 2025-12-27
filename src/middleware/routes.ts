import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { RoleEnum } from "@/auth/_types/auth";

// 1️⃣ CÁC ROUTE VÀ PREFIX PUBLIC
// Các route hoàn toàn public (không cần đăng nhập)
const PUBLIC_ROUTES = new Set([
  "/",
  "/login",
  "/register",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/products",
  "/category",
  "/data-deletion",
  "/403",
  "/account/verify",
  "/forgot-password",
]);

// Các route bắt đầu bằng prefix này sẽ được public
const PUBLIC_PREFIXES = [
  "/shop/login",
  "/shop/check",
  "/shop/register",
  "/shop/onboarding",
  "/shop/",
  "/employee/login",
  "/auth/", // OAuth callbacks
  "/_next",
  "/static",
  "/favicon.ico",
  "/seller/", // Public seller pages
  "/products/", // Public product detail pages
  "/category/", // Public category pages
  "/wishlist/shared/", // Shared wishlist (có token)
  "/test-", // Test pages (nếu có)
];

// 2️⃣ ĐỊNH NGHĨA ROLES VÀ PHÂN QUYỀN THEO TIỀN TỐ (PREFIX-BASED)
const EMPLOYEE_ROLES = [
  RoleEnum.ADMIN,
  RoleEnum.ACCOUNTANT,
  RoleEnum.BUSINESS,
  RoleEnum.EXECUTIVE,
  RoleEnum.LOGISTICS,
  RoleEnum.IT,
  RoleEnum.SALE,
  RoleEnum.FINANCE,
];

// Định nghĩa các role được phép truy cập theo TIỀN TỐ (Prefix) của route
// Ví dụ: /manager/dashboard sẽ dùng rules của /manager
const ROUTE_ROLE_PREFIX_MAP: Record<string, RoleEnum[]> = {
  "/manager": [RoleEnum.ADMIN], // Chỉ ADMIN được vào bất cứ route nào bắt đầu bằng /manager
  "/employee": EMPLOYEE_ROLES, // Các role trong EMPLOYEE_ROLES được vào bất cứ route nào bắt đầu bằng /employee
  "/shop": [RoleEnum.SHOP], // Chỉ SHOP được vào bất cứ route nào bắt đầu bằng /shop
  "/": [RoleEnum.BUYER], // Route gốc và các route còn lại (ví dụ: /profile, /orders) mặc định cho BUYER
};

/**
 * Các trang login/register - nếu đã đăng nhập thì không được vào
 */
const AUTH_ROUTES = new Set([
  "/login",
  "/register",
  "/shop/login",
  "/shop/register",
  "/employee/login",
]);

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) console.log(`[Middleware] 🔍 Checking route: ${pathname}`);

  // --- 0️⃣ Kiểm tra nếu đã đăng nhập thì không được vào trang login/register ---
  const isLoggedIn = req.cookies.get("isLoggedIn")?.value === "true";
  
  if (isLoggedIn && AUTH_ROUTES.has(pathname)) {
    // Kiểm tra có returnUrl không (từ query params) - ưu tiên quay lại trang cũ
    const returnUrl = searchParams.get("returnUrl");
    
    if (returnUrl && returnUrl.startsWith("/")) {
      // Có returnUrl hợp lệ → quay lại trang cũ
      if (isDev) {
        console.log(`[Middleware] 🚫 Already logged in, redirecting from ${pathname} to returnUrl: ${returnUrl}`);
      }
      const url = req.nextUrl.clone();
      url.pathname = returnUrl;
      url.searchParams.delete("returnUrl"); // Xóa returnUrl khỏi query params
      return NextResponse.redirect(url);
    }

    // Không có returnUrl → redirect về trang chủ
    if (isDev) {
      console.log(`[Middleware] 🚫 Already logged in, redirecting from ${pathname} to home: /`);
    }
    
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.delete("returnUrl"); // Xóa returnUrl nếu có
    return NextResponse.redirect(url);
  }

  // --- 1️⃣ Xử lý Public Routes ---
  // Kiểm tra shop management routes cần authentication (loại trừ khỏi public)
  const isShopManagementRoute = pathname.startsWith("/shop/") && (
    pathname.startsWith("/shop/dashboard") ||
    pathname.startsWith("/shop/products") ||
    pathname.startsWith("/shop/orders") ||
    pathname.startsWith("/shop/settings") ||
    pathname.startsWith("/shop/profile") ||
    pathname.startsWith("/shop/wallet") ||
    pathname.startsWith("/shop/analytics") ||
    pathname.startsWith("/shop/vouchers") ||
    pathname.startsWith("/shop/reviews") ||
    pathname.startsWith("/shop/chat")
  );

  // Nếu không phải shop management route, kiểm tra public
  if (!isShopManagementRoute) {
    const isPublic =
      PUBLIC_ROUTES.has(pathname) ||
      PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));

    if (isPublic) {
      if (isDev) console.log(`[Middleware] ✅ Public route: ${pathname}`);
      return NextResponse.next();
    }
  }

  // --- 2️⃣ Kiểm tra Xác thực (Authentication) ---
  if (isDev)
    console.log(`[Middleware] 🔒 Protected: ${pathname} | isLoggedIn: ${isLoggedIn}`);

  if (!isLoggedIn) {
    if (isDev) console.log(`[Middleware] ❌ Redirecting to login from: ${pathname}`);
    const url = req.nextUrl.clone();

    // Chuyển hướng đến trang login phù hợp và lưu returnUrl để quay lại sau khi login
    if (pathname.startsWith("/shop")) url.pathname = "/shop/login";
    else if (pathname.startsWith("/employee") || pathname.startsWith("/manager"))
      url.pathname = "/employee/login";
    else url.pathname = "/login";

    // Lưu returnUrl để quay lại đúng đường dẫn sau khi login
    url.searchParams.set("returnUrl", pathname);
    return NextResponse.redirect(url);
  }

  // --- 3️⃣ Kiểm tra Phân quyền (Authorization) (Chỉ chạy khi đã đăng nhập) ---

  // Đọc user roles từ cookie (Base64 encoded JSON array: ["ADMIN","SHOP"])
  const userRolesCookie = req.cookies.get("userRoles")?.value;
  let userRoles: RoleEnum[] = [];

  if (userRolesCookie) {
    try {
      // Decode Base64 trước khi parse JSON
      const decodedJson = Buffer.from(userRolesCookie, "base64").toString("utf-8");
      const rolesArray = JSON.parse(decodedJson) as string[];
      userRoles = rolesArray
        .map((role) => role.toUpperCase() as RoleEnum)
        .filter((role): role is RoleEnum => 
          Object.values(RoleEnum).includes(role)
        );
    } catch (error) {
      console.error("[Middleware] ❌ Error parsing userRoles cookie (Base64 decode or JSON parse failed):", error);
      userRoles = [];
    }
  }

  // Nếu đã đăng nhập với role SHOP và đang ở /shop/check thì bỏ qua check, đi thẳng /shop
  if (pathname === "/shop/check" && isLoggedIn && userRoles.includes(RoleEnum.SHOP)) {
    const url = req.nextUrl.clone();
    url.pathname = "/shop";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Tìm prefix dài nhất khớp với pathname để áp dụng quy tắc phân quyền
  const requiredPrefix = Object.keys(ROUTE_ROLE_PREFIX_MAP)
    .filter((prefix) => prefix !== "/" && pathname.startsWith(prefix)) // Lọc ra prefix khớp (trừ "/")
    .sort((a, b) => b.length - a.length) // Sắp xếp giảm dần theo độ dài
    [0]; // Lấy prefix dài nhất khớp

  // Lấy danh sách role cần thiết (nếu không tìm thấy prefix dài nhất, dùng quy tắc mặc định "/")
  const allowedRoles = ROUTE_ROLE_PREFIX_MAP[requiredPrefix || "/"];

  if (isDev) {
    console.log(`[Middleware] 🔑 User roles from cookie:`, userRoles);
    console.log(`[Middleware] 🔑 Allowed roles for ${pathname}:`, allowedRoles);
  }

  // Kiểm tra nếu không có rule cho route này → cho phép (đã đăng nhập)
  if (!allowedRoles || allowedRoles.length === 0) {
    if (isDev) console.log(`[Middleware] ✅ No role restriction for: ${pathname}`);
    return NextResponse.next();
  }

  // Kiểm tra user có bất kỳ role nào trong danh sách yêu cầu không
  const hasPermission = userRoles.some((role) => allowedRoles.includes(role));

  if (!hasPermission) {
    if (isDev)
      console.log(`[Middleware] ❌ User does not have permission for: ${pathname} (User Roles: ${userRoles.join(", ")}, Required: ${allowedRoles.join(", ")})`);
    const url = req.nextUrl.clone();
    url.pathname = "/403";
    // Lưu returnUrl để quay lại đúng đường dẫn sau khi giải quyết (nếu có quyền)
    url.searchParams.set("returnUrl", pathname);
    url.searchParams.set("reason", "insufficient_permissions");
    return NextResponse.redirect(url);
  }

  if (isDev) console.log(`[Middleware] ✅ Access granted for: ${pathname}`);
  return NextResponse.next();
}


// Cấu hình matcher để middleware chạy trên tất cả các pages trừ các tài nguyên tĩnh, API, v.v.
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};