"use client";

import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import { Calendar } from "lucide-react";

interface DateFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errorMessage?: string;
  helpText?: string;
  containerClassName?: string;
  inputClassName?: string;
  rules?: any[];
}

export const DateField = forwardRef<HTMLInputElement, DateFieldProps>(
  (
    {
      label,
      className,
      containerClassName,
      inputClassName,
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
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-500 mb-1">
            {label}
            {rules.some((r: any) => r.required) && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            type="date"
            disabled={disabled}
            className={cn(
              // Base styles
              "block w-full rounded-xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-600 sm:text-sm sm:leading-6 transition-all duration-200 font-medium",
              
              // Custom calendar icon styling for webkit browsers (Chrome, Safari)
              "[&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer",

              // Outline & Focus styles
              "outline-none focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500",

              // Disabled styles
              disabled
                ? "bg-gray-50 text-gray-500 ring-gray-100 cursor-default focus:ring-gray-100 shadow-none"
                : "bg-white",
                
              // Error styles
              errorMessage && "ring-red-500 focus:ring-red-500",
              
              inputClassName
            )}
            {...props}
          />

          {/* Custom Calendar Icon */}
          <Calendar
            size={18}
            className={cn(
              "absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors",
              disabled ? "text-gray-600" : "text-gray-500"
            )}
          />
        </div>

        {errorMessage && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errorMessage}
          </p>
        )}

        {!errorMessage && helpText && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-600">
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

DateField.displayName = "DateField";