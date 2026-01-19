export type DemoRole = "buyer" | "shop" | "admin";

interface AuthState {
  isLoggedIn: boolean;
  role: DemoRole | null;
  user: any | null;
  accessToken: string | null;
}

export function getAuthState(): AuthState {
  if (typeof window === "undefined") {
    return { isLoggedIn: false, role: null, user: null, accessToken: null };
  }

  const accessToken = localStorage.getItem("accessToken");
  const userStr = localStorage.getItem("users");

  if (!accessToken || !userStr) {
    return { isLoggedIn: false, role: null, user: null, accessToken: null };
  }

  try {
    const user = JSON.parse(userStr);
    let role: DemoRole = "buyer";
    const roles = user.roles || [];

    if (roles.includes("ADMIN") || roles.some((r: any) => r.name === "ADMIN")) {
      role = "admin";
    } else if (
      roles.includes("SHOP") ||
      roles.some((r: any) => r.name === "SHOP") ||
      user.shopId
    ) {
      role = "shop";
    }

    return { isLoggedIn: true, role, user, accessToken };
  } catch {
    return { isLoggedIn: false, role: null, user: null, accessToken: null };
  }
}
