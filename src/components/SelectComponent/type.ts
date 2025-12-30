import { useEffect, useLayoutEffect } from "react";

export interface Option {
  label: string;
  value: string;
}

export interface SelectProps {
  options: Option[];
  value?: string | string[]; // Có thể là 1 string hoặc mảng string
  onChange: (value: any) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  isMulti?: boolean; // Thêm prop để phân biệt chọn 1 hay nhiều
}

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
