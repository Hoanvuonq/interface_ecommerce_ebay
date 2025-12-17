"use client";

import React, { forwardRef, useState } from "react";
import { cn } from "@/utils/cn";
import { InputFieldProps } from "./type";
// Thêm icon từ lucide-react (hoặc thư viện bạn đang dùng)
import { Eye, EyeOff } from "lucide-react";

export const InputField = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputFieldProps>(
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
        },
        ref
    ) => {
        const [localValue, setLocalValue] = useState("");
        const [showPassword, setShowPassword] = useState(false); // State ẩn/hiện pass

        const value = propValue !== undefined ? propValue : localValue;

        const isPassword = type === "password";

        const baseInputClasses = cn(
            "w-full px-4 py-2.5 text-base rounded-lg border transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-pink-500",
            disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-slate-600",
            errorMessage && "border-red-500 focus:border-red-500 focus:ring-red-500/50",
            isPassword && "pr-12",
            inputClassName
        );

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;

            if (propValue === undefined) {
                setLocalValue(newValue);
            }

            if (onPropChange) {
                onPropChange(e);
            }
        };

        const togglePasswordVisibility = () => {
            setShowPassword(!showPassword);
        };

        const renderInput = () => {
            // Xác định type thực tế dựa trên state showPassword
            const inputType = isPassword ? (showPassword ? "text" : "password") : type;

            return (
                <input
                    ref={ref as React.Ref<HTMLInputElement>}
                    type={inputType}
                    name={name}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    inputMode={inputMode}
                    disabled={disabled}
                    value={value}
                    onChange={handleInputChange}
                    className={baseInputClasses}
                />
            );
        };

        return (
            <div className={cn("mb-6", itemClassName)}>
                {label && (
                    <label
                        htmlFor={name}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                        {label}
                        {rules.some((r: any) => r.required) && (
                            <span className="text-red-500 ml-1">*</span>
                        )}
                    </label>
                )}

                <div className="relative">
                    {renderInput()}

                    {/* Nút Ẩn/Hiện mật khẩu */}
                    {isPassword && !disabled && (
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-pink-500 focus:outline-none transition-colors"
                            tabIndex={-1} 
                        >
                            {showPassword ? (
                                <Eye size={20} strokeWidth={2} />
                            ) : (
                                
                                <EyeOff size={20} strokeWidth={2} />
                            )}
                        </button>
                    )}

                    {maxLength && !isPassword && (
                        <span
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 dark:text-gray-500"
                        >
                            {`${value ? String(value).length : 0}/${maxLength}`}
                        </span>
                    )}
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

InputField.displayName = "InputField";