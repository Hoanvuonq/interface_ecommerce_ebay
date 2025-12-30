"use client";

import { formatNumber } from '@/utils/analytics/formatters';
import { cn } from "@/utils/cn";
import {
    Eye,
    Loader2,
    ShoppingBag,
    Smartphone,
    UserCheck,
    Zap
} from 'lucide-react';
import { SmartMetricRow } from '../SmartMetricRow';

export interface SmartMetricsPanelProps {
    visitors: number;
    productViews: number;
    orders: number;
    buyers: number;
    conversionRate: number;
    loading?: boolean;
}

export function SmartMetricsPanel({
    visitors,
    productViews,
    orders,
    buyers,
    conversionRate,
    loading = false,
}: SmartMetricsPanelProps) {
    return (
        <div className={cn(
            "h-full bg-white rounded-4xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]",
            loading && "pointer-events-none"
        )}>
            <div className="p-6 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-linear-to-b from-orange-500 to-red-600 rounded-full" />
                    <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-[0.15em]">
                        Chỉ số <span className="text-orange-500">Tổng quan</span>
                    </h3>
                </div>
                {loading && <Loader2 className="animate-spin text-orange-500" size={16} />}
            </div>

            <div className="px-3 pb-6 space-y-1">
                <SmartMetricRow
                    icon={<Eye size={18} strokeWidth={2.5} />}
                    label="Lượt truy cập"
                    value={formatNumber(visitors)}
                    colorClass="text-blue-600"
                    bgClass="bg-blue-50/50"
                    loading={loading}
                />

                <SmartMetricRow
                    icon={<Smartphone size={18} strokeWidth={2.5} />}
                    label="Xem sản phẩm"
                    value={formatNumber(productViews)}
                    colorClass="text-purple-600"
                    bgClass="bg-purple-50/50"
                    loading={loading}
                />

                <SmartMetricRow
                    icon={<ShoppingBag size={18} strokeWidth={2.5} />}
                    label="Đơn hàng"
                    value={formatNumber(orders)}
                    colorClass="text-orange-500"
                    bgClass="bg-orange-50/50"
                    loading={loading}
                />

                <SmartMetricRow
                    icon={<UserCheck size={18} strokeWidth={2.5} />}
                    label="Người mua"
                    value={formatNumber(buyers)}
                    colorClass="text-teal-600"
                    bgClass="bg-teal-50/50"
                    loading={loading}
                />

                <SmartMetricRow
                    icon={<Zap size={18} strokeWidth={2.5} />}
                    label="Tỷ lệ chuyển đổi"
                    value={conversionRate.toFixed(2)}
                    suffix="%"
                    colorClass="text-rose-500"
                    bgClass="bg-rose-50/50"
                    loading={loading}
                />
            </div>
        </div>
    );
}