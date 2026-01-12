'use client';

import { usePlatformDashboard } from '@/app/manager/_components/analytics/_hooks';
import {
    AlertCircle,
    ArrowRight,
    Banknote,
    DollarSign,
    ShoppingCart,
    Users
} from 'lucide-react';
import { QuickStatCard } from '../QuickStatCard';

export function ManagerQuickStats() {
    const { data, isLoading, error } = usePlatformDashboard();
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 bg-gray-100 rounded-[28px] border border-gray-50" />
                ))}
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="p-6 bg-rose-50 rounded-[28px] border border-rose-100 flex items-center gap-3 text-rose-600">
                <AlertCircle size={20} />
                <p className="text-sm font-bold uppercase tracking-wider">Không thể tải dữ liệu phân tích</p>
            </div>
        );
    }

    const { todayMetrics, yesterdayMetrics } = data;

    const calculateGrowth = (today: number, yesterday: number) => 
        yesterday > 0 ? ((today - yesterday) / yesterday) * 100 : 0;

    return (
        <div className="space-y-6">
            <div className="flex items-end justify-between px-2">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800 tracking-tighter uppercase">
                        Tổng Quan <span className="text-orange-500">Hôm Nay</span>
                    </h2>
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-[0.2em] mt-1">
                        Cập nhật dữ liệu thời gian thực
                    </p>
                </div>
                <a
                    href="/manager/analytics"
                    className="group flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-gray-600 hover:text-orange-600 transition-all duration-300"
                >
                    Chi tiết <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <QuickStatCard
                    title="GMV Tổng giá trị"
                    value={todayMetrics.gmv}
                    growth={calculateGrowth(todayMetrics.gmv, yesterdayMetrics.gmv)}
                    format="currency"
                    icon={<Banknote />}
                />

                <QuickStatCard
                    title="Doanh thu Platform"
                    value={todayMetrics.revenue}
                    growth={calculateGrowth(todayMetrics.revenue, yesterdayMetrics.revenue)}
                    format="currency"
                    icon={<DollarSign />}
                />

                <QuickStatCard
                    title="Tổng đơn hàng"
                    value={todayMetrics.orders}
                    growth={calculateGrowth(todayMetrics.orders, yesterdayMetrics.orders)}
                    format="number"
                    icon={<ShoppingCart />}
                />

                <QuickStatCard
                    title="Người mua mới"
                    value={todayMetrics.uniqueBuyers}
                    growth={calculateGrowth(todayMetrics.uniqueBuyers, yesterdayMetrics.uniqueBuyers)}
                    format="number"
                    icon={<Users />}
                />
            </div>
        </div>
    );
}