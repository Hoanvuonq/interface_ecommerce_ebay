"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import _ from "lodash";
import { 
  useGetAllDepartments, 
  useGetAllEmployees, 
  useGetAllPositions, 
  useGetEmployeeStatistics 
} from "../_hooks/useEmployee";
import { Gender, WorkerType, EmployeeStatus } from "../_types/employee.type";

export function useEmployeeTable() {
  const queryClient = useQueryClient();
  const { handleGetAllEmployees } = useGetAllEmployees();
  const { handleGetAllDepartments } = useGetAllDepartments();
  const { handleGetAllPositions } = useGetAllPositions();
  const { handleGetEmployeeStatistics } = useGetEmployeeStatistics();

  // 1. Quản lý trạng thái Filters
  const [filters, setFilters] = useState({
    activeTab: "ALL",
    searchText: "",
    gender: undefined as Gender | undefined,
    type: undefined as WorkerType | undefined,
    departmentId: undefined as string | undefined,
    positionId: undefined as string | undefined,
    page: 0,
    size: 10,
  });

  // 2. Fetch danh sách nhân viên bằng useQuery
  const employeesQuery = useQuery({
    queryKey: ["employees", filters],
    queryFn: () => handleGetAllEmployees({
      fullName: filters.searchText,
      gender: filters.gender,
      status: filters.activeTab !== "ALL" ? [filters.activeTab as EmployeeStatus] : undefined,
      types: filters.type ? [filters.type] : undefined,
      departmentId: filters.departmentId,
      positionId: filters.positionId,
      page: filters.page,
      size: filters.size,
      sortBy: "createdDate",
      direction: "DESC",
    }),
    placeholderData: (previousData) => previousData,
  });

  // 3. Fetch dữ liệu bổ trợ (Departments, Positions, Stats)
  const metadataQuery = useQuery({
    queryKey: ["employee-metadata"],
    queryFn: async () => {
      const [dep, pos, stat] = await Promise.all([
        handleGetAllDepartments(),
        handleGetAllPositions(),
        handleGetEmployeeStatistics(),
      ]);
      return {
        departments: dep?.data?.departments || [],
        positions: pos?.data || [],
        statistics: stat?.data || null,
      };
    },
    staleTime: 1000 * 60 * 5, // Cache 5 phút
  });

  // 4. Các hàm xử lý (Handlers)
  const updateFilter = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 0 })); // Reset page khi lọc
  };

  const resetFilters = () => {
    setFilters({
      activeTab: "ALL",
      searchText: "",
      gender: undefined,
      type: undefined,
      departmentId: undefined,
      positionId: undefined,
      page: 0,
      size: 10,
    });
  };

  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ["employees"] });
    queryClient.invalidateQueries({ queryKey: ["employee-metadata"] });
  };

  return {
    // Data
    employees: employeesQuery.data?.data?.employees || [],
    pagination: employeesQuery.data?.data?.pagination || { totalElements: 0 },
    metadata: metadataQuery.data || { departments: [], positions: [], statistics: null },
    
    // States
    filters,
    isLoading: employeesQuery.isLoading || metadataQuery.isLoading,
    isRefetching: employeesQuery.isRefetching,

    // Actions
    updateFilter,
    resetFilters,
    refreshData,
    setPage: (page: number) => setFilters(p => ({...p, page}))
  };
}