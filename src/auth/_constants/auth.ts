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
  "/auth/", // OAuth callbacks
  "/products/", // Public product detail pages
  "/category/", // Public category pages
  "/wishlist/shared/", // Shared wishlist (có token)
  "/test-", // Test pages
  "/seller/", // Public seller pages
  "/_next", // Next.js internal routes
  "/static", // Static files
  "/favicon.ico", // Favicon
];
