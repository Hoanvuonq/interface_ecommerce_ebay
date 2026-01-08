"use client";

import React, { InputHTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import { Check } from "lucide-react";

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  containerClassName?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, containerClassName, id, checked, ...props }, ref) => {
    const checkboxId = id || `checkbox-${label?.replace(/\s+/g, "-").toLowerCase()}`;

    return (
      <label
        htmlFor={checkboxId}
        className={cn(
          "flex items-center gap-3 group cursor-pointer select-none w-fit",
          containerClassName
        )}
      >
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            id={checkboxId}
            ref={ref}
            checked={checked}
            className="sr-only" 
            {...props}
          />

          <div
            className={cn(
              "w-6 h-6 rounded-lg border-2 transition-all duration-300 flex items-center justify-center relative",
              "border-gray-200 bg-white shadow-sm", 
              "group-hover:border-orange-400 group-hover:shadow-md",
              checked 
                ? "bg-orange-500 border-orange-500 shadow-lg shadow-orange-200" 
                : "bg-white border-gray-200",
              "active:scale-90", 
              className
            )}
          >
            <Check
              size={14}
              strokeWidth={4}
              className={cn(
                "text-white transition-all duration-300 transform",
                checked 
                  ? "scale-100 opacity-100 rotate-0" 
                  : "scale-0 opacity-0 rotate-45"
              )}
            />
          </div>
        </div>

        <span
          className={cn(
            "text-sm font-bold tracking-tight transition-all duration-200",
            checked ? "text-gray-900" : "text-gray-500",
            "group-hover:text-gray-900"
          )}
        >
          {label}
        </span>
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";