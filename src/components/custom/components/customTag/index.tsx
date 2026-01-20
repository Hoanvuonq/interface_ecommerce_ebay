import React from "react";
import { cn } from "@/utils/cn";

interface CustomTagProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
  color?: "blue" | "red" | "orange" | "green" | "purple"; 
  className?: string;
}

export const CustomTag = ({ icon, children, color = "blue", className }: CustomTagProps) => {
  const variants = {
    blue: "bg-linear-to-r from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-500/25 ring-1 ring-blue-400/50",
    red: "bg-linear-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/25 ring-1 ring-rose-400/50",
    orange: "bg-linear-to-r from-orange-600 to-amber-400 text-white shadow-lg shadow-orange-600/25 ring-1 ring-orange-600/50",
    green: "bg-linear-to-r from-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/25 ring-1 ring-emerald-400/50",
    purple: "bg-linear-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25 ring-1 ring-violet-400/50",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-[10px] font-semibold uppercase  select-none transition-transform hover:scale-105",
        variants[color],
        className
      )}
    >
      {icon && <span className="text-white/90 drop-shadow-sm">{icon}</span>}
      <span className="drop-shadow-sm">{children}</span>
    </span>
  );
};