import { useState, useEffect, useCallback } from "react";
import { isAuthenticated as checkAuth, getCachedUser } from "@/utils/local.storage";
import { isLocalhost } from "@/utils/env";

export function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);

 const checkAuthStatus = useCallback(() => {
    let isAuth = false;
    if (isLocalhost()) {
      isAuth = !!getCachedUser();
    } else {
      isAuth = checkAuth();
    }
    setAuthenticated(isAuth);
    return isAuth;
  }, []);

  useEffect(() => {
    // Check lần đầu
    checkAuthStatus();

    const interval = setInterval(checkAuthStatus, 3000);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkAuthStatus();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const handleFocus = () => {
      checkAuthStatus();
    };
    window.addEventListener("focus", handleFocus);

    const handleStorage = () => {
      if (isLocalhost()) checkAuthStatus();
    };
    window.addEventListener("storage", handleStorage);


    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorage);
    };
  }, [checkAuthStatus]);

  return authenticated;
}

