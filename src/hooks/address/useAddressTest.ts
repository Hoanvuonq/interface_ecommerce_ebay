import { useQuery } from "@tanstack/react-query";
import addressService from "@/services/address/address.service";
import _ from "lodash";
import type {
  GetProvincesParams,
  GetWardsParams,
} from "@/types/address/address.types";

const STALE_TIME = 24 * 60 * 60 * 1000; 

export function useProvinces() {
  const query = useQuery({
    queryKey: ["address", "provinces"],
    queryFn: async () => {
      const res = await addressService.getAllProvinces();
      const data = res as any;
      return data?.data?.content || [];
    },
    staleTime: STALE_TIME,
  });

  const findProvince = (identity: string) =>
    _.find(query.data, (p) => p.code === identity || p.name === identity);

  return { ...query, provinces: query.data || [], findProvince };
}

export function useWards(provinceCode?: string) {
  const query = useQuery({
    queryKey: ["address", "wards", provinceCode],
    queryFn: async () => {
      if (!provinceCode) return [];
      const res = await addressService.getWardsByProvinceCode(
        provinceCode,
      );
      const data = res as any;
      return data?.data?.content || [];
    },
    enabled: !!provinceCode,
    staleTime: 60 * 60 * 1000,
  });

  const findWard = (identity: string) =>
    _.find(query.data, (w) => w.code === identity || w.name === identity);

  return { ...query, wards: query.data || [], findWard };
}

export function useCountryInfo() {
  return useQuery({
    queryKey: ["address", "country"],
    queryFn: async () => {
      const res = await addressService.getCountryInfo();
      return res.data;
    },
    staleTime: STALE_TIME,
  });
}

export function useAddressDetail(type: "province" | "ward", code?: string) {
  return useQuery({
    queryKey: ["address", "detail", type, code],
    queryFn: async () => {
      if (!code) return null;
      const res =
        type === "province"
          ? await addressService.getProvinceByCode(code)
          : await addressService.getWardByCode(code);
      return res.data;
    },
    enabled: !!code,
    staleTime: STALE_TIME,
  });
}
