"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center">
        <div className="h-6 w-12 rounded-full bg-white/20 animate-pulse" />
      </div>
    );
  }

  const isDark = theme === 'dark';

  return (
    <label 
      className="relative inline-flex items-center cursor-pointer"
      aria-label="Chuyển đổi chế độ Sáng/Tối"
    >
      <input 
        type="checkbox" 
        className="sr-only peer"
        checked={isDark}
        onChange={() => setTheme(isDark ? 'light' : 'dark')}
      />

      <div 
        className={cn(
          "w-12 h-6 rounded-full peer-focus:outline-none transition-colors duration-300 ease-in-out",
          "bg-white/50 peer-checked:bg-pink-600",
          "flex justify-between items-center px-1.5"
        )}
      >
        <Sun size={12} className="text-yellow-200 opacity-80 peer-checked:opacity-0 transition-opacity duration-300" />
        <Moon size={12} className="text-white opacity-0 peer-checked:opacity-80 transition-opacity duration-300" />
      </div>
      
      <div 
        className={cn(
          "absolute w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ease-in-out",
          "transform top-0.5 left-0.5 pointer-events-none",
          "peer-checked:translate-x-[24px]" 
        )}
      />
    </label>
  );
};