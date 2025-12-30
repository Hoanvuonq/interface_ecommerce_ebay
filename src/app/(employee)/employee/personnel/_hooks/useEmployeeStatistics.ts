"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import _ from "lodash";
import { 
  useGetEmployeeStatisticsTime, 
  useGetEmployeeStatisticsAvailable, 
  useGetEmployeeStatistics
} from "../_hooks/useEmployee";
import { genderLabelMap, statusLabelMap, workerTypeLabelMap } from "../_types/employee.type";
import { COLORS, DAY_MAP, MONTH_NAMES } from "../_types/status";

export function useEmployeeStatistics(selectedYear: number, selectedMonth: number) {
  const { handleGetEmployeeStatistics } = useGetEmployeeStatistics();
  const { handleGetEmployeeStatisticsTime } = useGetEmployeeStatisticsTime();
  const { handleGetEmployeeStatisticsAvailable } = useGetEmployeeStatisticsAvailable();

  // --- QUERIES ---

  const availableQuery = useQuery({
    queryKey: ["employee-stats-available"],
    queryFn: async () => {
      const res = await handleGetEmployeeStatisticsAvailable();
      return res?.data || [];
    },
    staleTime: 1000 * 60 * 5, 
  });

  const generalQuery = useQuery({
    queryKey: ["employee-stats-general"],
    queryFn: async () => {
      const res = await handleGetEmployeeStatistics();
      return res?.data;
    }
  });

  const timeQuery = useQuery({
    queryKey: ["employee-stats-time", selectedYear, selectedMonth],
    queryFn: async () => {
      const res = await handleGetEmployeeStatisticsTime(selectedYear, selectedMonth);
      return res?.data;
    },
    enabled: !!selectedYear && !!selectedMonth,
  });

  const chartData = useMemo(() => {
    const general = generalQuery.data;
    const time = timeQuery.data;
    if (!general) return null;

    const transformGeneral = (obj: any, labelMap: any) => 
      Object.entries(obj || {}).map(([key, value], index) => ({
        name: labelMap[key] || key,
        value: value as number,
        color: COLORS[index % COLORS.length]
      }));

    return {
      status: transformGeneral(general.status, statusLabelMap),
      workType: transformGeneral(general.workType, workerTypeLabelMap),
      gender: transformGeneral(general.gender, genderLabelMap),
      department: _.chain(general.department || {})
        .map((value, name) => ({ name, value: value as number }))
        .orderBy(['value'], ['desc'])
        .value(),
      
      monthlyGrowth: _.map(time?.monthlyGrowth, (item) => ({
        name: MONTH_NAMES[item.month - 1] || `T${item.month}`,
        count: item.count || 0,
      })),
      dailyGrowth: _.map(time?.dailyGrowth, (item) => ({
        day: item.date ? new Date(item.date).getDate() : item.day,
        count: item.count || 0,
      })),
      weeklyDist: _.map(time?.weeklyDistribution, (item) => ({
        name: DAY_MAP[item.dayOfWeek] || item.dayOfWeek,
        count: item.count || 0,
      })),
      top5Days: _.chain(time?.top5Days)
        .orderBy(['count'], ['desc'])
        .take(5)
        .value()
    };
  }, [generalQuery.data, timeQuery.data]);

  const filterOptions = useMemo(() => {
    const available = availableQuery.data || [];
    
    const years = _.chain(available)
      .map('year')
      .uniq()
      .sort()
      .reverse()
      .map(y => ({ label: `Năm ${y}`, value: String(y) }))
      .value();

    const months = _.chain(available)
      .filter({ year: selectedYear })
      .map('month')
      .sort()
      .map(m => ({ label: MONTH_NAMES[m - 1], value: String(m) }))
      .value();

    return { years, months };
  }, [availableQuery.data, selectedYear]);

  // --- EXPOSE ---

  return {
    generalStats: generalQuery.data,
    timeStats: timeQuery.data,
    
    chartData,
    filterOptions,
    
    isLoading: generalQuery.isLoading || availableQuery.isLoading || timeQuery.isLoading,
    isRefetching: timeQuery.isRefetching,
    isError: generalQuery.isError || timeQuery.isError
  };
}