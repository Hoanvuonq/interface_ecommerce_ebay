import { request } from "@/utils/axios.customize";
import { ApiResponse } from "@/api/_types/api.types";
import { PositionStatistics } from "../_types/position.type";

const API_ENDPOINT_POSITION = "v1/positions";

export async function getPositionStatistics(): Promise<ApiResponse<PositionStatistics>> {
    return request<ApiResponse<PositionStatistics>>({
      url: `/${API_ENDPOINT_POSITION}/statistics`,
      method: "GET",
    });
  }