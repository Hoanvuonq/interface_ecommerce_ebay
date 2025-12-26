export interface Column<T> {
  header: string;
  accessor?: keyof T;
  render?: (item: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  align?: "left" | "center" | "right";
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading: boolean;
  emptyMessage?: string;
  page: number;
  size: number;
  totalElements: number;
  onPageChange: (newPage: number) => void;
  headerContent?: React.ReactNode;
}
