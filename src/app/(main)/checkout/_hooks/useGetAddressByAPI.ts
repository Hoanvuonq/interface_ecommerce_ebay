"use client";

import { useQuery } from "@tanstack/react-query";
import { addressService } from "@/services/address/address.service";
import _ from "lodash";

export const useAddress = (options?: {
  enabled?: boolean;
  provinceCode?: string;
  isVietnam?: boolean;
}) => {
  const enabled = options?.enabled ?? true;
  const isVietnam = options?.isVietnam ?? true;

  const countriesQuery = useQuery({
    queryKey: ["address", "countries"],
    queryFn: async () => {
      const res = await addressService.getCountryInfo();
      const data = res?.data;
      return Array.isArray(data) ? data : data ? [data] : [];
    },
    enabled: enabled,
    staleTime: 1000 * 60 * 60,
  });

  const provincesQuery = useQuery({
    queryKey: ["address", "provinces"],
    queryFn: async () => {
      const res = await addressService.getAllProvinces();
      return res?.data?.content || (res?.data as any) || [];
    },
    enabled: enabled && isVietnam,
    staleTime: 1000 * 60 * 30,
  });

  const wardsQuery = useQuery({
    queryKey: ["address", "wards", options?.provinceCode],
    queryFn: async () => {
      if (!options?.provinceCode) return [];
      const res = await addressService.getWardsByProvinceCode(
        options.provinceCode,
      );
      return res?.data?.content || (res?.data as any) || [];
    },
    enabled: enabled && isVietnam && !!options?.provinceCode,
    staleTime: 1000 * 60 * 10,
  });

  return {
    countries: countriesQuery.data || [],
    provinces: provincesQuery.data || [],
    wards: wardsQuery.data || [],
    isLoading: provincesQuery.isLoading || wardsQuery.isLoading,
    isFetching: provincesQuery.isFetching || wardsQuery.isFetching,
    refreshProvinces: provincesQuery.refetch,
  };
};
