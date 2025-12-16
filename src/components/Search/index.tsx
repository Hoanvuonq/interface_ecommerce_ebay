"use client";
import React, { useRef } from "react";
import { ISearch } from "./type";
import { cn } from "@/utils/cn";

export const Search: React.FC<ISearch> = ({
  searchValue,
  searchOptions,
  onChange,
  onSelect,
  onSubmit,
  placeholder = "Tìm kiếm sản phẩm...",
  className = "",
  style,
  compact = false,
  ctaColor = "#ff8800",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (value: string) => {
    if (onSelect) onSelect(value, { value });
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <form
      className={`flex items-center bg-[#2563ff] rounded-xl p-1 ${className}`}
      style={style}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      autoComplete="off"
    >
      <div className="relative flex-1">
        <input
          ref={inputRef}
          type="text"
          value={searchValue}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "w-full h-12 px-4 border-none outline-none transition-colors duration-200",
            "bg-[#f5f5f5] text-gray-900 placeholder:text-gray-500",
            "rounded-l-xl rounded-tl-xl rounded-bl-xl text-base",
          )}
          style={{
            borderTopLeftRadius: 12,
            borderBottomLeftRadius: 12,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
          }}
          list="search-suggestions"
        />
        {searchOptions && searchOptions.length > 0 && (
          <datalist id="search-suggestions">
            {searchOptions.map((opt: any, idx: number) => (
              <option
                key={opt.value || idx}
                value={typeof opt === "string" ? opt : opt.value}
              >
                {typeof opt === "string" ? opt : opt.label || opt.value}
              </option>
            ))}
          </datalist>
        )}
      </div>
      <button
        type="submit"
        className={cn(
          "h-12 px-6 rounded-r-xl font-semibold text-base flex items-center justify-center cursor-pointer",
          "transition-colors bg-[#ff8800] text-white dark:bg-[#ff8800] dark:text-white"
        )}
        style={{
          backgroundColor: ctaColor,
          color: "#fff",
          border: "none",
          borderTopRightRadius: 12,
          borderBottomRightRadius: 12,
          fontWeight: 600,
          fontSize: "15px",
        }}
      >
        <svg
          className="mr-2"
          width={18}
          height={18}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <circle cx={11} cy={11} r={8} />
          <line x1={21} y1={21} x2={16.65} y2={16.65} />
        </svg>
        Tìm
      </button>
    </form>
  );
};
