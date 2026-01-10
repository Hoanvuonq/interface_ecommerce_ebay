import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { RoleEnum } from "@/auth/_types/auth";
import {
  PUBLIC_ROUTES,
  PUBLIC_PREFIXES,
  ROUTE_PERMISSIONS,
} from "@/auth/config/auth.config";

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

const ROUTE_ROLE_PREFIX_MAP: Record<string, RoleEnum[]> = {
  "/manager": [RoleEnum.ADMIN],
  "/employee": EMPLOYEE_ROLES,
  "/shop": [RoleEnum.SHOP],
  "/": [RoleEnum.BUYER],
};

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

  const isLoggedIn = req.cookies.get("isLoggedIn")?.value === "true";

  if (isLoggedIn && AUTH_ROUTES.has(pathname)) {
    const returnUrl = searchParams.get("returnUrl");

    if (returnUrl && returnUrl.startsWith("/")) {
      if (isDev) {
        console.log(
          `[Middleware] 🚫 Already logged in, redirecting from ${pathname} to returnUrl: ${returnUrl}`
        );
      }
      const url = req.nextUrl.clone();
      url.pathname = returnUrl;
      url.searchParams.delete("returnUrl");
      return NextResponse.redirect(url);
    }

    if (isDev) {
      console.log(
        `[Middleware] 🚫 Already logged in, redirecting from ${pathname} to home: /`
      );
    }

    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.delete("returnUrl");
    return NextResponse.redirect(url);
  }

  const isShopManagementRoute =
    pathname.startsWith("/shop/") &&
    (pathname.startsWith("/shop/dashboard") ||
      pathname.startsWith("/shop/products") ||
      pathname.startsWith("/shop/orders") ||
      pathname.startsWith("/shop/settings") ||
      pathname.startsWith("/shop/profile") ||
      pathname.startsWith("/shop/wallet") ||
      pathname.startsWith("/shop/analytics") ||
      pathname.startsWith("/shop/vouchers") ||
      pathname.startsWith("/shop/reviews") ||
      pathname.startsWith("/shop/chat"));

  if (!isShopManagementRoute) {
    const isPublic =
      PUBLIC_ROUTES.has(pathname) ||
      PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));

    if (isPublic) {
      if (isDev) console.log(`[Middleware] ✅ Public route: ${pathname}`);
      return NextResponse.next();
    }
  }

  if (isDev)
    console.log(
      `[Middleware] 🔒 Protected: ${pathname} | isLoggedIn: ${isLoggedIn}`
    );

  if (!isLoggedIn) {
    if (isDev)
      console.log(`[Middleware] ❌ Redirecting to login from: ${pathname}`);
    const url = req.nextUrl.clone();

    if (pathname.startsWith("/shop")) url.pathname = "/shop/login";
    else if (
      pathname.startsWith("/employee") ||
      pathname.startsWith("/manager")
    )
      url.pathname = "/employee/login";
    else url.pathname = "/login";

    url.searchParams.set("returnUrl", pathname);
    return NextResponse.redirect(url);
  }

  const userRolesCookie = req.cookies.get("userRoles")?.value;
  let userRoles: RoleEnum[] = [];

  if (userRolesCookie) {
    try {
      const decodedJson = Buffer.from(userRolesCookie, "base64").toString(
        "utf-8"
      );
      const rolesArray = JSON.parse(decodedJson) as string[];
      userRoles = rolesArray
        .map((role) => role.toUpperCase() as RoleEnum)
        .filter((role): role is RoleEnum =>
          Object.values(RoleEnum).includes(role)
        );
    } catch (error) {
      console.error(
        "[Middleware] ❌ Error parsing userRoles cookie (Base64 decode or JSON parse failed):",
        error
      );
      userRoles = [];
    }
  }

  if (
    pathname === "/shop/check" &&
    isLoggedIn &&
    userRoles.includes(RoleEnum.SHOP)
  ) {
    const url = req.nextUrl.clone();
    url.pathname = "/shop";
    url.search = "";
    return NextResponse.redirect(url);
  }

  const requiredPrefix = Object.keys(ROUTE_ROLE_PREFIX_MAP)
    .filter((prefix) => prefix !== "/" && pathname.startsWith(prefix))
    .sort((a, b) => b.length - a.length)[0];

  const allowedRoles = ROUTE_ROLE_PREFIX_MAP[requiredPrefix || "/"];

  if (isDev) {
    console.log(`[Middleware] 🔑 User roles from cookie:`, userRoles);
    console.log(`[Middleware] 🔑 Allowed roles for ${pathname}:`, allowedRoles);
  }

  if (!allowedRoles || allowedRoles.length === 0) {
    if (isDev)
      console.log(`[Middleware] ✅ No role restriction for: ${pathname}`);
    return NextResponse.next();
  }

  const hasPermission = userRoles.some((role) => allowedRoles.includes(role));

  if (!hasPermission) {
    if (isDev)
      console.log(
        `[Middleware] ❌ User does not have permission for: ${pathname} (User Roles: ${userRoles.join(
          ", "
        )}, Required: ${allowedRoles.join(", ")})`
      );
    const url = req.nextUrl.clone();
    url.pathname = "/403";
    url.searchParams.set("returnUrl", pathname);
    url.searchParams.set("reason", "insufficient_permissions");
    return NextResponse.redirect(url);
  }

  if (isDev) console.log(`[Middleware] ✅ Access granted for: ${pathname}`);
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
