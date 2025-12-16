"use client";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export default function TopLoadingBar() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsLoading(true);

    timeoutRef.current = setTimeout(() => {
      setIsLoading(false);
    }, 150);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [pathname]);

  return (
    <div
      className={`fixed top-0 left-0 right-0 h-0.5 z-[9999] transition-all duration-150 ease-out ${
        isLoading ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
      }`}
      style={{
        background: "linear-gradient(90deg, #1890ff, #52c41a, #faad14)",
        boxShadow: "0 0 10px rgba(24, 144, 255, 0.5)",
        transformOrigin: "left",
        willChange: "transform, opacity",
      }}
    />
  );
}
