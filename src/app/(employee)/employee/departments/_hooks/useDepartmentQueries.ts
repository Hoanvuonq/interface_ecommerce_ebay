import { useQuery } from "@tanstack/react-query";
import { 
  getAllDepartments, 
  getDepartmentStatistics, 
  getDepartmentDetailById 
} from "../_services/department.service";
import { getPositionStatistics } from "../_services/position.service";

export const useDepartmentQueries = () => {
  return {
    useList: (params: any) => useQuery({
      queryKey: ["departments", "list", params],
      queryFn: () => getAllDepartments(params),
      placeholderData: (prev) => prev,
    }),

    useDetail: (id: string | null, enabled: boolean) => useQuery({
      queryKey: ["departments", "detail", id],
      queryFn: () => getDepartmentDetailById(id!),
      enabled: !!id && enabled,
    }),

    useStats: () => useQuery({
      queryKey: ["departments", "statistics"],
      queryFn: async () => {
        const [dept, pos] = await Promise.all([
          getDepartmentStatistics(),
          getPositionStatistics()
        ]);
        return { ...dept.data, totalPositions: pos.data?.totalPositions || 0 };
      },
      staleTime: 1000 * 60 * 5,
    }),
  };
};