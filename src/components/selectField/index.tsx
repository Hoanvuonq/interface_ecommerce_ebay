"use client";

import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  errorMessage?: string;
  helpText?: string;
  containerClassName?: string;
  selectClassName?: string;
  labelClassName?: string; // Thêm prop này để chỉnh style Label
  rules?: any[];
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  (
    {
      label,
      options,
      className,
      containerClassName,
      selectClassName,
      labelClassName,
      errorMessage,
      helpText,
      disabled,
      rules = [],
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("mb-6", containerClassName)}>
        {label && (
          <label 
            className={cn(
                "block mb-1",
                // Style mặc định (nếu không truyền labelClassName)
                !labelClassName && "text-sm font-medium text-gray-700 dark:text-gray-300",
                // Style custom truyền vào
                labelClassName
            )}
          >
            {label}
            {rules.some((r: any) => r.required) && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            disabled={disabled}
            className={cn(
              // Base styles
              "block w-full rounded-xl border-0 py-3 px-4 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 transition-all duration-200 font-medium",
              
              // ===> QUAN TRỌNG: Ẩn mũi tên mặc định & Bỏ viền đen
              "appearance-none outline-none focus:outline-none",
              
              // Focus styles (Viền cam)
              "focus:ring-2 focus:ring-inset focus:ring-orange-500",

              // Disabled styles
              disabled
                ? "bg-gray-50 text-gray-500 ring-gray-100 cursor-default focus:ring-gray-100 shadow-none"
                : "bg-white cursor-pointer",
                
              // Error styles
              errorMessage && "ring-red-500 focus:ring-red-500",
              selectClassName
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Icon Mũi tên Custom */}
          <ChevronDown
            size={16}
            className={cn(
              "absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors",
              disabled ? "text-gray-400" : "text-gray-500"
            )}
          />
        </div>

        {errorMessage && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errorMessage}
          </p>
        )}

        {!errorMessage && helpText && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

SelectField.displayName = "SelectField";