"use client";

import { ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface AppThemeProviderProps {
  children: ReactNode;
}

export default function AppThemeProvider({ children }: AppThemeProviderProps) {
  // 1. Lấy trạng thái theme từ Redux
  // Giả sử state.theme.name trả về "light" hoặc "dark"
  const reduxTheme = useSelector((state: RootState) => state.theme.name);
  
  // Bạn không cần primaryColor nữa nếu không dùng Antd Token
  // const primaryColor = useSelector((state: RootState) => state.theme.primaryColor || "#1890ff");
  
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light"); 

  useEffect(() => {
    setMounted(true);
    setTheme(reduxTheme); 
  }, [reduxTheme]);

  useEffect(() => {
    // 2. LOGIC THEME CƠ SỞ (Đã có sẵn và hoạt động tốt cho Tailwind)
    
    // Đặt data-theme attribute (tốt cho các thư viện khác hoặc CSS variables)
    document.documentElement.setAttribute("data-theme", theme);
    
    // Quản lý class 'dark' trên <html> cho Tailwind Dark Mode
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    // Quản lý màu nền và màu chữ cơ bản trên <body> (rất tốt)
    document.body.classList.toggle("bg-slate-900", theme === "dark");
    document.body.classList.toggle("text-slate-100", theme === "dark");
    document.body.classList.toggle("bg-white", theme !== "dark");
    document.body.classList.toggle("text-slate-800", theme !== "dark");
    
  }, [theme]);

  // Vẫn cần check mounted để tránh lỗi Hydration Warning
  if (!mounted) return null;

  // 3. LOẠI BỎ HOÀN TOÀN CÁC COMPONENT CỦA ANTD
  return <>{children}</>;
}