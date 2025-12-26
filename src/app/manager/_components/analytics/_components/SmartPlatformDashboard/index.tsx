'use client';

import React, { useState, useMemo } from 'react';
import { usePlatformDashboard } from '@/hooks/analytics';
import { SmartHeroHeader } from '../SmartHeroHeader';
import { SmartMetricsPanel } from '../SmartMetricsPanel';
import { SmartComparisonChart } from '../SmartComparisonChart';
import { SmartKPICard } from '../SmartKPICard';
import { TopShopsList } from '../TopShopsList';
import { TopCategoriesList } from '../TopCategoriesList';
import { DashboardSkeleton } from '../DashboardSkeleton';
import { ErrorState } from '../ErrorState';
import { getTodayISO, formatRelativeDate } from '@/utils/analytics/formatters';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Inbox, 
  BarChart3 
} from 'lucide-react'; 

export function SmartPlatformDashboard() {
    const [selectedDate, setSelectedDate] = useState<string>(getTodayISO());
    const { data, error, isLoading, isRefreshing, refresh } = usePlatformDashboard(selectedDate);

    const conversionRate = useMemo(() => {
        if (!data || !data.todayMetrics.uniqueVisitors) return 0;
        return (data.todayMetrics.orders / data.todayMetrics.uniqueVisitors) * 100;
    }, [data]);

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    if (error) {
        return <ErrorState error={error} onRetry={refresh} />;
    }

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[40px] border border-dashed border-gray-200">
                <div className="p-4 bg-gray-50 rounded-full mb-4">
                    <Inbox className="w-12 h-12 text-gray-300" />
                </div>
                <h3 className="text-lg font-black text-gray-800 uppercase tracking-widest">Không có dữ liệu</h3>
                <p className="text-gray-400 text-sm font-medium">Vui lòng thử lại hoặc chọn một ngày khác.</p>
            </div>
        );
    }

    const { todayMetrics, yesterdayMetrics, topShops, topCategories } = data;

    // Tính toán tăng trưởng
    const calculateGrowth = (today: number, yesterday: number) => 
        yesterday > 0 ? ((today - yesterday) / yesterday) * 100 : 0;

    const mockHourlyRevenue = Array(24).fill(0).map((_, i) => {
        if (i < 6) return todayMetrics.revenue * 0.01;
        if (i < 12) return todayMetrics.revenue * 0.05;
        if (i < 18) return todayMetrics.revenue * 0.06;
        return todayMetrics.revenue * 0.04;
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <SmartHeroHeader
                revenue={todayMetrics.gmv}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                onRefresh={refresh}
                isRefreshing={isRefreshing}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-3">
                    <SmartMetricsPanel
                        visitors={todayMetrics.uniqueVisitors}
                        productViews={0} 
                        orders={todayMetrics.orders}
                        buyers={todayMetrics.uniqueBuyers}
                        conversionRate={conversionRate}
                        loading={isRefreshing}
                    />
                </div>

                <div className="lg:col-span-9">
                    <SmartComparisonChart
                        todayData={mockHourlyRevenue}
                        todayLabel={formatRelativeDate(todayMetrics.date)}
                        yesterdayLabel={formatRelativeDate(yesterdayMetrics.date)}
                        loading={isRefreshing}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SmartKPICard
                    title="Doanh thu Platform"
                    value={todayMetrics.revenue}
                    growth={calculateGrowth(todayMetrics.revenue, yesterdayMetrics.revenue)}
                    icon={<DollarSign />}
                    format="currency"
                    colorTheme="blue"
                    suffix="(Commission)"
                    loading={isRefreshing}
                />

                <SmartKPICard
                    title="Tổng đơn hàng"
                    value={todayMetrics.orders}
                    growth={calculateGrowth(todayMetrics.orders, yesterdayMetrics.orders)}
                    icon={<ShoppingBag />}
                    format="number"
                    colorTheme="purple"
                    loading={isRefreshing}
                />

                <SmartKPICard
                    title="Người mua Active"
                    value={todayMetrics.uniqueBuyers}
                    growth={calculateGrowth(todayMetrics.uniqueBuyers, yesterdayMetrics.uniqueBuyers)}
                    icon={<Users />}
                    format="number"
                    colorTheme="green"
                    loading={isRefreshing}
                />
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-2 px-2">
                    <BarChart3 className="text-orange-500 w-5 h-5" />
                    <h2 className="text-xl font-black text-gray-800 uppercase tracking-tighter italic">
                        Bảng xếp hạng <span className="text-orange-500">Hiệu suất</span>
                    </h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <TopShopsList shops={topShops} loading={isRefreshing} />
                    <TopCategoriesList categories={topCategories} loading={isRefreshing} />
                </div>
            </div>
        </div>
    );
}