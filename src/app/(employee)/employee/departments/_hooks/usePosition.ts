import { useState } from "react";
import { ApiResponse } from "@/api/_types/api.types";
import { PositionStatistics } from "../_types/position.type";
import { getPositionStatistics } from "../_services/position.service";

export function useGetPositionStatistics() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetPositionStatistics =
    async (): Promise<ApiResponse<PositionStatistics> | null> => {
      setLoading(true);
      setError(null);
      try {
        const res = await getPositionStatistics();
        return res;
      } catch (err: unknown) {
        const errorMessage =
          (err as Error).message || "Lấy thống kê chức vụ thất bại";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    };

  return { handleGetPositionStatistics, loading, error };
}
