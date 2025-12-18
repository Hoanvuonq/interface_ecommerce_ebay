"use client";

import { cn } from "@/utils/cn";
import { Loader2 } from "lucide-react";
import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  type?: "default" | "primary" | "dashed" | "dark" | "outline";
  loading?: boolean;
  icon?: React.ReactElement;
  rightIcon?: React.ReactElement;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "default",
  loading,
  className,
  disabled,
  icon: Icon,
  rightIcon,
  ...rest
}) => {
  const baseClasses =
    "cursor-pointer flex items-center justify-center gap-2 h-12 md:h-14 font-bold rounded-2xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto";

  const variants = {
    primary: "bg-linear-to-r from-pink-500 to-red-500 text-white hover:from-pink-600 hover:to-red-600 shadow-md border-0",
    dashed: "bg-white text-gray-700 border-dashed border-gray-300 hover:border-pink-400 hover:text-pink-600",
    default: "bg-white text-gray-700 border border-gray-300 hover:border-gray-400 hover:text-gray-900",
    dark: "bg-gray-900 text-white shadow-xl shadow-gray-200 hover:bg-orange-500 hover:shadow-orange-200 border-0",
    outline: "bg-white text-gray-600 border-2 border-gray-100 hover:bg-gray-50 hover:border-gray-200",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(baseClasses, variants[type], className)}
      {...rest}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          {Icon && React.isValidElement(Icon) && 
            React.cloneElement(Icon as React.ReactElement<any>, { 
              className: cn("w-5 h-5", (Icon.props as any)?.className) 
            })
          }
          
          <span>{children}</span>
          
          {rightIcon && React.isValidElement(rightIcon) && 
            React.cloneElement(rightIcon as React.ReactElement<any>, { 
              className: cn("w-4 h-4 transition-transform", (rightIcon.props as any)?.className) 
            })
          }
        </>
      )}
    </button>
  );
};