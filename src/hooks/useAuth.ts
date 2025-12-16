import { useState, useEffect, useCallback } from "react";
import { isAuthenticated as checkAuth } from "@/utils/local.storage";

export function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);

  const checkAuthStatus = useCallback(() => {
    const isAuth = checkAuth();
    setAuthenticated(isAuth);
    return isAuth;
  }, []);

  useEffect(() => {
    // Check lần đầu
    checkAuthStatus();

    // Polling để check cookie changes (mỗi 3 giây - tối ưu hơn)
    const interval = setInterval(checkAuthStatus, 3000);

    // Listen for visibility change để check ngay khi tab được focus
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkAuthStatus();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Listen for focus event (khi user quay lại tab)
    const handleFocus = () => {
      checkAuthStatus();
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [checkAuthStatus]);

  return authenticated;
}

