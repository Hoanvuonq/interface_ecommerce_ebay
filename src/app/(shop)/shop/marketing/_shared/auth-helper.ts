export type DemoRole = "buyer" | "shop" | "admin";

interface AuthState {
  isLoggedIn: boolean;
  role: DemoRole | null;
  user: any | null;
  accessToken: string | null;
}

export function getAuthState(): AuthState {
  return {
    isLoggedIn: true,
    role: "shop",
    user: { id: "dev", roles: ["SHOP"], shopId: "dummy-shop" },
    accessToken: "dummy-token"
  };
}
