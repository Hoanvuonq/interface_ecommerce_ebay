"use client";

import { useState, useEffect } from "react";
import { useGetAllDepartments, useGetDepartmentStatistics } from "../_hooks/useDepartment";
import { Department } from "../_types/department.type";
import { useToast } from "@/hooks/useToast";
import _ from "lodash";

export const useDepartmentTable = () => {
  const { handleGetAllDepartments, loading } = useGetAllDepartments();
  const { handleGetDepartmentStatistics } = useGetDepartmentStatistics();
  const { error: toastError } = useToast();

  const [departments, setDepartments] = useState<Department[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({ current: 0, pageSize: 10, total: 0 });

  const fetchMetadata = async () => {
    const res = await handleGetDepartmentStatistics();
    if (res?.data) setStatistics(res.data);
  };

  const fetchList = async (name = searchText, page = pagination.current, size = pagination.pageSize) => {
    const res = await handleGetAllDepartments({
      departmentName: name || undefined,
      page,
      size,
      sort: "asc",
    });
    if (res?.data) {
      setDepartments(res.data.departments);
      setPagination(prev => ({ ...prev, total: res.data.totalElements || 0, current: page, pageSize: size }));
    }
  };

  useEffect(() => {
    fetchMetadata();
    fetchList();
  }, []);

  return {
    departments,
    statistics,
    loading,
    searchText,
    setSearchText,
    pagination,
    fetchList,
    fetchMetadata,
    refresh: () => { fetchList(); fetchMetadata(); }
  };
};