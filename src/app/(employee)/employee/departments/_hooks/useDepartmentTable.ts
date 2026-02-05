import { useState } from "react";
import { useDepartmentQueries } from "./useDepartmentQueries"; // Đường dẫn tới file query trung tâm

export const useDepartmentTable = () => {
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({ current: 0, pageSize: 10 });
  const { useList, useStats } = useDepartmentQueries();

  // 🟢 Query bốc danh sách: Tự chạy lại mỗi khi searchText hoặc pagination thay đổi
  const listQuery = useList({
    departmentName: searchText || undefined,
    page: pagination.current,
    size: pagination.pageSize,
  });

  // 🟢 Query bốc thống kê
  const statsQuery = useStats();

  return {
    departments: listQuery.data?.data?.departments || [],
    statistics: statsQuery.data,
    loading: listQuery.isLoading || listQuery.isFetching,
    statsLoading: statsQuery.isLoading,
    searchText,
    setSearchText,
    pagination: {
      ...pagination,
      total: listQuery.data?.data?.totalElements || 0,
    },
    // Hàm điều hướng
    setPage: (p: number) => setPagination((prev) => ({ ...prev, current: p })),
    setPageSize: (s: number) =>
      setPagination((prev) => ({ ...prev, pageSize: s, current: 0 })),
    // Hàm làm mới thủ công
    refresh: () => {
      listQuery.refetch();
      statsQuery.refetch();
    },
  };
};
