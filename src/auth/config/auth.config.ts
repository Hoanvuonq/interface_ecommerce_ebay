// @/auth/auth.config.ts
import { RoleEnum } from "@/auth/_types/auth";

export const PUBLIC_ROUTES = new Set([
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

export const PUBLIC_PREFIXES = [
  "/shop/login",
  "/shop/check",
  "/shop/register",
  "/shop/onboarding",
  "/shop/",
  "/employee/login",
  "/auth/",
  "/_next",
  "/static",
  "/favicon.ico",
  "/seller/",
  "/products/",
  "/category/",
  "/wishlist/shared/",
  "/test-",
];

export const ROUTE_PERMISSIONS: Record<string, RoleEnum[]> = {
  "/manager": [RoleEnum.ADMIN],
  "/employee": [RoleEnum.ADMIN, RoleEnum.SALE, RoleEnum.IT],
  "/shop": [RoleEnum.SHOP],
};
