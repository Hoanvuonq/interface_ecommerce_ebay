"use client";

import React, { forwardRef, useState } from "react";
import { cn } from "@/utils/cn";
import { InputFieldProps } from "./type";
import { Eye, EyeOff } from "lucide-react";

export const InputField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  InputFieldProps
>(
  (
    {
      label,
      name,
      placeholder,
      type = "text",
      maxLength,
      inputMode,
      disabled = false,
      itemClassName,
      inputClassName,
      helpText,
      errorMessage,
      onChange: onPropChange,
      value: propValue,
      rules = [],
      autoComplete
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPasswordType = type === "password";
    const inputType = isPasswordType && showPassword ? "text" : type;

    const baseInputClasses = cn(
      "w-full px-4 py-2.5 text-base rounded-lg border transition-all duration-200",
      "focus:outline-none focus:ring-2 focus:ring-orange-500",
      disabled
        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
        : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600",
      errorMessage &&
        "border-red-500 focus:border-red-500 focus:ring-red-500/50",
      isPasswordType && "pr-12",
      inputClassName
    );

   const togglePasswordVisibility = (
      e: React.MouseEvent<HTMLButtonElement>
    ) => {
      e.preventDefault();
      e.stopPropagation(); 
      setShowPassword((prev) => !prev);
    };

    const renderInput = () => {
      return (
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          type={inputType}
          name={name}
          autoComplete={isPasswordType ? "new-password" : "on"}
          placeholder={placeholder}
          maxLength={maxLength}
          inputMode={inputMode}
          disabled={disabled}
          value={propValue}
          onChange={onPropChange}
          className={baseInputClasses}
        />
      );
    };

    return (
      <div className={cn("mb-6", itemClassName)}>
        {label && (
          <label
            htmlFor={name}
            className="block text-sm font-fold text-black dark:text-gray-500 mb-1"
          >
            {label}
            {rules.some((r: any) => r.required) && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </label>
        )}

        <div className="relative">
          {renderInput()}

          {isPasswordType && !disabled && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className={cn(
                "right-3 top-1/2 -translate-y-1/2 p-1.5 hover:text-orange-500 focus:outline-none ",
                "transition-colors z-20 cursor-pointer absolute text-gray-600"
              )}
              tabIndex={-1}
            >
              {showPassword ? (
                <Eye size={20} strokeWidth={2} />
              ) : (
                <EyeOff size={20} strokeWidth={2} />
              )}
            </button>
          )}

          {maxLength && !isPasswordType && (
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-600 dark:text-gray-500">
              {`${propValue ? String(propValue).length : 0}/${maxLength}`}
            </span>
          )}
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

InputField.displayName = "InputField";
