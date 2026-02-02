"use client";

import React, { useId } from "react";
import { Search, XCircle } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button, FormInput } from "@/components";
import { SearchComponentProps } from "./type";

export const SearchComponent: React.FC<SearchComponentProps> = ({
  value,
  onChange,
  placeholder = "Tìm kiếm...",
  className = "",
  inputClassName = "",
  size = "md",
  onEnter,
  name = "search-input",
  id,
}) => {
  const reactId = useId();
  const inputId = id || reactId;

  const sizeStyles = {
    sm: {
      container: "h-9",
      icon: 14,
      iconPos: "left-3",
      paddingLeft: "pl-9",
      paddingRight: "pr-8",
    },
    md: {
      container: "h-12",
      icon: 18,
      iconPos: "left-4",
      paddingLeft: "pl-11",
      paddingRight: "pr-10",
    },
    lg: {
      container: "h-14",
      icon: 22,
      iconPos: "left-5",
      paddingLeft: "pl-14",
      paddingRight: "pr-12",
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <div className={cn("relative group w-full", className)}>
      <Search
        size={currentSize.icon}
        className={cn(
          "absolute top-1/2 -translate-y-1/2 text-gray-400 transition-all duration-300 z-10 pointer-events-none",
          currentSize.iconPos,
          "group-focus-within:text-orange-500 group-focus-within:scale-110",
        )}
      />

      <FormInput
        id={inputId}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(
          e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        ) => onChange(e.target.value)}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === "Enter") onEnter?.();
        }}
        className={cn(
          "w-full transition-all duration-300 border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500/40",
          currentSize.container,
          currentSize.paddingLeft,
          currentSize.paddingRight,
          "rounded-2xl font-medium",
          inputClassName,
        )}
      />

      {/* {value && (
        <Button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors z-10"
        >
          <XCircle size={currentSize.icon - 2} />
        </Button>
      )} */}

      <div className="absolute inset-y-0 right-4 hidden md:flex items-center pointer-events-none opacity-40 group-focus-within:opacity-0 transition-opacity">
        <kbd className="px-1.5 py-0.5 text-[10px] font-bold text-gray-400 bg-white border border-gray-200 rounded-md shadow-sm">
          /
        </kbd>
      </div>
    </div>
  );
};
