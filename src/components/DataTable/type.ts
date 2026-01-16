import React from "react";

export interface Column<T> {
  header: React.ReactNode;
  accessor?: keyof T;
  render?: (
    item: T,
    index: number
  ) => React.ReactNode | { content: React.ReactNode; rowSpan?: number }; 
  className?: string;
  headerClassName?: string;
  cellClassName?: string;
  align?: "left" | "center" | "right";
}
export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading: boolean;
  rowKey?: keyof T | ((item: T) => string | number);
  emptyMessage?: string;
  page: number;
  size: number;
  totalElements: number;
  onPageChange: (newPage: number) => void;
  headerContent?: React.ReactNode;
}
