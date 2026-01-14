"use client";

import { cn } from "@/utils/cn";
import { Loader2 } from "lucide-react";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "default" | "primary" | "dashed" | "dark" | "outline" | "edit"; 
  loading?: boolean;
  icon?: React.ReactElement;
  rightIcon?: React.ReactElement;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "default",
  type = "button",  
  loading,
  className,
  disabled,
  icon: Icon,
  rightIcon,
  ...rest
}) => {
  const baseClasses =
    "cursor-pointer flex items-center justify-center gap-2 font-medium transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto";

  const variants = {
    primary: "h-12 md:h-14 rounded-2xl bg-linear-to-r from-pink-500 to-red-500 text-white hover:from-pink-600 hover:to-red-600 shadow-md border-0 font-bold",
    dashed: "h-12 md:h-14 rounded-2xl bg-white text-gray-700 border-dashed border-gray-300 hover:border-pink-400 hover:text-pink-600 font-bold",
    default: "h-12 md:h-14 rounded-2xl bg-white text-gray-700 border border-gray-300 hover:border-gray-400 hover:text-gray-900 font-bold",
    dark: "h-12 md:h-14 rounded-2xl bg-gray-900 text-white shadow-xl shadow-gray-200 hover:bg-orange-500 hover:shadow-orange-200 border-0 font-bold",
    outline: "h-12 md:h-14 rounded-2xl bg-white text-gray-600 border-2 border-gray-100 hover:bg-gray-50 hover:border-gray-200 font-bold",
    edit: "group px-5 py-2 bg-white border border-gray-200 hover:border-gray-500 hover:text-orange-600 text-gray-700 rounded-lg text-sm shadow-sm hover:shadow-md",
  };

  return (
    <button
      disabled={disabled || loading}
      className={cn(baseClasses, variants[variant], className)}
      {...rest}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          {Icon && React.isValidElement(Icon) &&
            React.cloneElement(Icon as React.ReactElement<any>, {
              className: cn(
                "w-5 h-5 transition-colors",
                variant === 'edit' ? "text-gray-600 group-hover:text-orange-500" : "",
                (Icon.props as any)?.className
              )
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