"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getPayrolls, 
  markAsPaid, 
  deletePayroll, 
  getPayrollStatistics 
} from "../_service/payroll.service";
import { useToast } from "@/hooks/useToast";
import _ from "lodash";

export function usePayrollManagement(employeeId: string, year: number, page: number, size: number) {
  const queryClient = useQueryClient();
  const { success, error: toastError } = useToast();

  const payrollsQuery = useQuery({
    queryKey: ["payrolls", employeeId, year, page, size],
    queryFn: () => getPayrolls(employeeId, { 
      year, 
      page: page - 1, 
      size, 
      sortBy: "payMonth", 
      direction: "DESC" 
    }),
    placeholderData: (prev) => prev,
  });

  const statsQuery = useQuery({
    queryKey: ["payroll-stats", employeeId],
    queryFn: () => getPayrollStatistics(employeeId),
  });

  const markPaidMutation = useMutation({
    mutationFn: (payrollId: string) => markAsPaid(employeeId, payrollId),
    onSuccess: () => {
      success("Đã đánh dấu trả lương thành công!");
      queryClient.invalidateQueries({ queryKey: ["payrolls"] });
      queryClient.invalidateQueries({ queryKey: ["payroll-stats"] });
    },
    onError: (err: any) => toastError(err.message || "Không thể thực hiện thao tác"),
  });

  const deleteMutation = useMutation({
    mutationFn: (payrollId: string) => deletePayroll(employeeId, payrollId),
    onSuccess: () => {
      success("Đã xóa bảng lương!");
      queryClient.invalidateQueries({ queryKey: ["payrolls"] });
      queryClient.invalidateQueries({ queryKey: ["payroll-stats"] });
    },
    onError: (err: any) => toastError(err.message || "Xóa thất bại"),
  });

  return {
    payrolls: payrollsQuery.data?.data?.payrolls || [],
    pagination: {
      current: (payrollsQuery.data?.data?.pageNumber || 0) + 1,
      pageSize: payrollsQuery.data?.data?.pageSize || 10,
      total: payrollsQuery.data?.data?.totalElements || 0,
    },
    stats: statsQuery.data?.data || {},
    isLoading: payrollsQuery.isLoading || statsQuery.isLoading,
    isProcessing: markPaidMutation.isPending || deleteMutation.isPending,
    markPaid: markPaidMutation.mutateAsync,
    deletePayroll: deleteMutation.mutateAsync,
  };
}