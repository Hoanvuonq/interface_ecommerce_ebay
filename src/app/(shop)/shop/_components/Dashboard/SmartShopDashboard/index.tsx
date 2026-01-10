"use client";

import { ErrorState } from "@/app/manager/_components/analytics/_components/ErrorState";
import { useShopDashboard } from "@/app/manager/_components/analytics/_hooks";
import { formatRelativeDate, getTodayISO } from "@/utils/analytics/formatters";
import { CircleDollarSign, ShoppingBag, ShoppingCart } from "lucide-react";
import { useMemo, useState } from "react";
import { DashboardSkeleton } from "../DashboardSkeleton";
import { SmartComparisonChart } from "../SmartComparisonChart";
import { SmartHeroHeader } from "../SmartHeroHeader";
import { SmartKPICard } from "../SmartKPICard";
import { SmartMetricsPanel } from "../SmartMetricsPanel";

export function SmartShopDashboard() {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayISO());
  const { data, error, isLoading, isRefreshing, refresh } =
    useShopDashboard(selectedDate);

  const conversionRate = useMemo(() => {
    const orders = data?.todayMetrics?.orders || 0;
    const visitors = data?.todayMetrics?.uniqueVisitors || 0;

    if (visitors === 0) return 0;
    return (orders / visitors) * 100;
  }, [data]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refresh} />;
  }

  if (!data || !data.todayMetrics) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] shadow-custom border border-dashed border-gray-200">
        <div className="p-4 bg-gray-50 rounded-full mb-4">
          <ShoppingBag size={40} className="text-gray-300" />
        </div>
        <p className="text-gray-500 font-medium italic uppercase tracking-widest text-xs">
          Không có dữ liệu để hiển thị
        </p>
      </div>
    );
  }

  const { todayMetrics, yesterdayMetrics, growthPercentages, hourlyRevenue } =
    data;

  const averageOrderValue =
    todayMetrics.orders > 0 ? todayMetrics.revenue / todayMetrics.orders : 0;

  const yesterdayAOV =
    yesterdayMetrics?.orders > 0
      ? yesterdayMetrics.revenue / yesterdayMetrics.orders
      : 0;

  const aovGrowth =
    yesterdayAOV > 0
      ? ((averageOrderValue - yesterdayAOV) / yesterdayAOV) * 100
      : 0;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <SmartHeroHeader
        revenue={todayMetrics.revenue}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onRefresh={refresh}
        isRefreshing={isRefreshing}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3 h-full">
          <SmartMetricsPanel
            visitors={todayMetrics.uniqueVisitors}
            productViews={todayMetrics.productViews}
            orders={todayMetrics.orders}
            buyers={todayMetrics.uniqueVisitors}
            conversionRate={conversionRate}
            loading={isRefreshing}
          />
        </div>

        <div className="lg:col-span-9 h-full">
          <SmartComparisonChart
            todayData={hourlyRevenue}
            todayLabel={formatRelativeDate(todayMetrics.date)}
            yesterdayLabel={formatRelativeDate(yesterdayMetrics?.date || "")}
            loading={isRefreshing}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <SmartKPICard
          title="Giá trị TB / Đơn"
          value={averageOrderValue}
          growth={aovGrowth}
          icon={<CircleDollarSign size={20} strokeWidth={2.5} />}
          format="currency"
          colorTheme="blue"
          loading={isRefreshing}
        />

        <SmartKPICard
          title="Sản phẩm đã bán"
          value={todayMetrics.itemsSold}
          growth={growthPercentages?.orders || 0}
          icon={<ShoppingBag size={20} strokeWidth={2.5} />}
          format="number"
          colorTheme="purple"
          loading={isRefreshing}
        />

        <SmartKPICard
          title="Tỷ lệ thêm giỏ hàng"
          value={todayMetrics.cartAdds}
          icon={<ShoppingCart size={20} strokeWidth={2.5} />}
          format="number"
          suffix="lượt"
          colorTheme="green"
          loading={isRefreshing}
        />
      </div>

      <div className="flex justify-center opacity-20">
        <div className="w-32 h-1 bg-linear-to-r from-transparent via-orange-500 to-transparent rounded-full" />
      </div>
    </div>
  );
}
