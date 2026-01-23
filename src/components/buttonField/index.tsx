"use client";

import { cn } from "@/utils/cn";
import { FC } from "react";
import { ButtonFieldProps } from "./type";

export type ButtonType = 'primary' | 'secondary' | 'danger' | 'text' | 'login';

const LoadingSpinner: FC = () => (
  <span className="w-4 h-4 border-2 border-t-2 border-white border-t-transparent rounded-full animate-spin" />
);

export const ButtonField: FC<ButtonFieldProps> = ({
  type = "primary",
  htmlType = "button",
  size = "large",
  block = true,
  loading = false,
  disabled = false,
  icon,
  onClick,
  children,
  className,
  form, 
}) => {
  
  const colorClasses: Record<string, string> = {
    primary: "bg-yellow-600 hover:bg-pink-700 text-white border-pink-600",
    secondary: "bg-gray-200 hover:bg-orange-50 text-gray-800 border-gray-300",
    danger: "bg-red-600 hover:bg-red-700 text-white border-red-600",
    text: "bg-transparent hover:bg-gray-100 text-pink-600 border-transparent",
    
    login: cn(
      "text-white border-0 shadow-lg shadow-pink-500/30",
      "bg-linear-to-r from-pink-600 via-orange-500 to-pink-600",
      "bg-[length:200%_auto]",
      "transition-all duration-500 ease-in-out",
      "hover:bg-right"
    ),
  };

  const sizeClasses = {
    small: "px-3 py-1 text-sm gap-1",
    middle: "px-4 py-2 text-base gap-2",
    large: "px-6 py-2.5 text-lg font-bold gap-2", 
  }[size];

  const blockClasses = block ? "w-full" : "inline-flex";
  
  const disabledClasses =
    disabled || loading
      ? "opacity-70 cursor-not-allowed pointer-events-none" 
      : "active:scale-95"; 

  const selectedColorClass = colorClasses[type] || colorClasses.primary;

  return (
    <button
      form={form} 
      type={htmlType}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(
        "flex items-center justify-center rounded-xl border focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-pink-500/50 cursor-pointer select-none",
        selectedColorClass,
        sizeClasses,
        blockClasses,
        disabledClasses,
        className
      )}
    >
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};