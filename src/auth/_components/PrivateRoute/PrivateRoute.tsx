"use client";

import { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { useAuthVerification } from "@/auth/_hooks/useAuth";

interface PrivateRouteProps {
  children: ReactNode;
  redirectOnFailure?: boolean;
  loadingComponent?: ReactNode;
  fallbackComponent?: ReactNode;
}

export default function PrivateRoute({
  children,
  redirectOnFailure = true,
  loadingComponent,
  fallbackComponent,
}: PrivateRouteProps) {
  const { authenticated, loading, error } = useAuthVerification({
    redirectOnFailure,
    autoVerify: true,
  });

  if (loading) {
    return (
      loadingComponent || (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <Loader2 className="large" aria-label="Đang xác thực..." />
        </div>
      )
    );
  }

  if (!authenticated) {
    if (fallbackComponent) {
      return <>{fallbackComponent}</>;
    }
    // Nếu redirectOnFailure = true, đã redirect rồi, return null
    // Nếu redirectOnFailure = false, return null để không render children
    return null;
  }

  // Authenticated - render children
  return <>{children}</>;
}
