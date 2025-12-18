"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { initTheme } from "@/store/theme/themeSlice";

export default function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.name);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    dispatch(initTheme());
    setMounted(true);
  }, [dispatch]);

  useEffect(() => {
    if (!mounted) return;
    const html = window.document.documentElement;
    
    if (theme === "dark") {
      html.classList.add("dark");
      html.style.colorScheme = "dark"; 
    } else {
      html.classList.remove("dark");
      html.style.colorScheme = "light";
    }
  }, [theme, mounted]);
  useEffect(() => {
    const root = window.document.documentElement;
    
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    
    root.style.colorScheme = theme;
  }, [theme]);

  // Ngăn chặn lỗi mismatch UI (Hydration)
  if (!mounted) return <div className="invisible">{children}</div>;

  return <>{children}</>;
}