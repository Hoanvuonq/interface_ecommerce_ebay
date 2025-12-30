import { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce"; 

export const useResponsiveLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const handleResize = useCallback(
    debounce(() => {
      const width = window.innerWidth;
      const mobile = width < 992;
      setIsMobile(mobile);
      
      if (!mobile) {
        setCollapsed(width < 1200);
      }
    }, 150),
    []
  );

  useEffect(() => {
    setIsMounted(true);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      handleResize.cancel();
    };
  }, [handleResize]);

  return { collapsed, setCollapsed, isMobile, isMounted };
};