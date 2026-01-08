"use client";

import React, { InputHTMLAttributes, useId } from "react"; // Thêm useId
import { cn } from "@/utils/cn";
import { Check } from "lucide-react";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  containerClassName?: string;
  sizeClassName?: string; 
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, containerClassName, sizeClassName, id, checked, ...props }, ref) => {
    
    // FIX: Sử dụng useId của React để tạo ID duy nhất nếu prop id không được truyền vào
    const reactId = useId();
    const checkboxId = id || reactId; 

    return (
      <label
        htmlFor={checkboxId} // htmlFor luôn khớp với id của input bên dưới
        className={cn(
          "flex items-center gap-3 group cursor-pointer select-none w-fit",
          containerClassName
        )}
      >
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            id={checkboxId} // ID duy nhất
            ref={ref}
            checked={checked}
            className="sr-only" 
            {...props}
          />

          <div
            className={cn(
              "rounded-md border-2 transition-all duration-300 flex items-center justify-center relative",
              "w-5 h-5",
              sizeClassName,
              checked 
                ? "bg-orange-500 border-orange-500 shadow-sm shadow-orange-200" 
                : "bg-white border-slate-200",
              "group-hover:border-orange-400",
              className
            )}
          >
            <Check
              size={12}
              strokeWidth={4}
              className={cn(
                "text-white transition-all duration-300 transform",
                checked ? "scale-100 opacity-100" : "scale-0 opacity-0"
              )}
            />
          </div>
        </div>

        {label && (
          <span className={cn(
            "text-sm font-bold tracking-tight transition-all duration-200",
            checked ? "text-gray-900" : "text-gray-500"
          )}>
            {label}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";