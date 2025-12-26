"use client";

import { formatCurrencyShort } from '@/utils/analytics/formatters';
import { cn } from "@/utils/cn";
import { Loader2, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { CustomTooltip } from '../CustomTooltip';

export interface SmartComparisonChartProps {
    todayData: number[];
    yesterdayData?: number[];
    todayLabel?: string;
    yesterdayLabel?: string;
    loading?: boolean;
}

export function SmartComparisonChart({
    todayData,
    yesterdayData,
    todayLabel = 'Hôm nay',
    yesterdayLabel = 'Hôm qua',
    loading = false,
}: SmartComparisonChartProps) {
    const chartData = useMemo(() => {
        const hours = Array.from({ length: 24 }, (_, i) => i);
        return hours.map((hour) => ({
            hour: `${hour}h`,
            today: todayData[hour] || 0,
            yesterday: yesterdayData ? yesterdayData[hour] || 0 : 0,
        }));
    }, [todayData, yesterdayData]);

    return (
        <div className={cn(
            "h-full bg-white rounded-4xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)]",
            loading && "animate-pulse"
        )}>
            <div className="p-6 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-50 rounded-2xl text-blue-600 shadow-inner">
                            <TrendingUp size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-gray-800 uppercase tracking-[0.15em] leading-none mb-1">
                                Biểu đồ <span className="text-blue-600">Doanh số</span>
                            </h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">So sánh hiệu suất 24h</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 px-4 py-2 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#EE4D2D] shadow-[0_0_8px_rgba(238,77,45,0.4)]"/>
                            <span className="text-[11px] font-black text-gray-600 uppercase tracking-wider">{todayLabel}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-gray-300"></span>
                            <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider">{yesterdayLabel}</span>
                        </div>
                    </div>
                </div>

                <div className="relative w-full h-87.5">
                    {loading && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-[2px]">
                            <Loader2 className="animate-spin text-orange-500" size={32} />
                        </div>
                    )}
                    
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={chartData}
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorToday" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#EE4D2D" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#EE4D2D" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorYesterday" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#9CA3AF" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#9CA3AF" stopOpacity={0} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid 
                                strokeDasharray="8 8" 
                                vertical={false} 
                                stroke="#F1F5F9" 
                            />

                            <XAxis
                                dataKey="hour"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 700 }}
                                dy={15}
                                interval={2}
                            />

                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 700 }}
                                tickFormatter={(value) => formatCurrencyShort(value)}
                            />

                            <Tooltip 
                                content={<CustomTooltip />} 
                                cursor={{ 
                                    stroke: '#EE4D2D', 
                                    strokeWidth: 2, 
                                    strokeDasharray: '6 6',
                                    opacity: 0.5
                                }} 
                            />

                            <Area
                                type="monotone"
                                dataKey="yesterday"
                                stroke="#CBD5E1"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorYesterday)"
                                animationDuration={1000}
                            />

                            <Area
                                type="monotone"
                                dataKey="today"
                                stroke="#EE4D2D"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorToday)"
                                animationDuration={1500}
                                dot={{ r: 0 }}
                                activeDot={{ 
                                    r: 6, 
                                    stroke: '#FFF', 
                                    strokeWidth: 3,
                                    fill: '#EE4D2D'
                                }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}