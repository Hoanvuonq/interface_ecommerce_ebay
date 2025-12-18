"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "@/store/theme/themeSlice"; 
import { RootState } from "@/store/store";

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const dispatch = useDispatch();
  
  const currentTheme = useSelector((state: RootState) => state.theme.name);
  const isDark = currentTheme === 'dark';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-6 w-12" />;

  return (
    <label className="relative inline-flex items-center cursor-pointer select-none">
      <input 
        type="checkbox" 
        className="sr-only peer"
        checked={isDark}
        onChange={() => dispatch(toggleTheme())} 
      />

      <div 
        className={cn(
          "w-12 h-6 rounded-full transition-colors duration-300 ease-in-out flex items-center justify-between px-1",
          "bg-black/40 border border-white/20",
          "peer-checked:bg-slate-800"
        )}
      >
        <Sun 
          size={14} 
          strokeWidth={2.5}
          className={cn(
            "text-yellow-400 transition-all duration-300 z-10",
            isDark ? "opacity-30 scale-75" : "opacity-100 scale-100"
          )} 
        />
        
        <Moon 
          size={14} 
          strokeWidth={2.5}
          className={cn(
            "text-blue-200 transition-all duration-300 z-10",
            isDark ? "opacity-100 scale-100" : "opacity-30 scale-75"
          )} 
        />
      </div>
      
      <div 
        className={cn(
          "absolute w-4.5 h-4.5 bg-white rounded-full shadow-lg transition-transform duration-300 ease-in-out",
          "top-[3px] left-[3px]",
          isDark ? "translate-x-[24px]" : "translate-x-0" 
        )}
      />
    </label>
  );
};