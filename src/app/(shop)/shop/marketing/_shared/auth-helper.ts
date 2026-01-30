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
    const roles: any[] = user.roles || [];

    const hasRole = (roleName: string) =>
      roles.some((r) => {
        const val = typeof r === "string" ? r : r.name;
        return val?.toUpperCase().includes(roleName);
      });

    let role: DemoRole = "buyer";

    if (hasRole("ADMIN")) {
      role = "admin";
    } else if (hasRole("SHOP") || user.shopId) {
      role = "shop";
    }

    return { isLoggedIn: true, role, user, accessToken };
  } catch {
    return { isLoggedIn: false, role: null, user: null, accessToken: null };
  }
}