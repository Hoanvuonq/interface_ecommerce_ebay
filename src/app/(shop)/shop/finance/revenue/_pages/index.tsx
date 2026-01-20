"use client";

import React, { useState, useMemo } from "react";
import { 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar,
  Download,
  Filter,
  ArrowRight
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { cn } from "@/utils/cn";

// Mock data cho biểu đồ doanh thu
const MOCK_CHART_DATA = [
  { name: "01/01", revenue: 4000000, orders: 24 },
  { name: "05/01", revenue: 3000000, orders: 18 },
  { name: "10/01", revenue: 5000000, orders: 29 },
  { name: "15/01", revenue: 8000000, orders: 40 },
  { name: "20/01", revenue: 7000000, orders: 35 },
  { name: "25/01", revenue: 9000000, orders: 48 },
  { name: "30/01", revenue: 12000000, orders: 60 },
];

export default function ShopRevenueScreen() {
  const [timeRange, setTimeRange] = useState("30days");

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-700">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight flex items-center gap-3">
            <div className="p-2 bg-emerald-500 rounded-xl text-white shadow-lg shadow-emerald-200">
              <TrendingUp size={24} />
            </div>
            Quản lý doanh thu
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Theo dõi dòng tiền, lợi nhuận và hiệu suất kinh doanh của Shop
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-100 flex gap-1">
             {["7days", "30days", "90days"].map((range) => (
               <button
                 key={range}
                 onClick={() => setTimeRange(range)}
                 className={cn(
                   "px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all",
                   timeRange === range ? "bg-gray-900 text-white shadow-md" : "text-gray-500 hover:bg-gray-50"
                 )}
               >
                 {range === "7days" ? "7 Ngày" : range === "30days" ? "30 Ngày" : "3 Tháng"}
               </button>
             ))}
          </div>
          <button className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-600 hover:text-emerald-500 hover:shadow-md transition-all">
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Tổng doanh thu"
          value={128450000}
          trend="+12.5%"
          isUp={true}
          icon={<DollarSign className="text-emerald-600" />}
          color="emerald"
        />
        <StatCard 
          label="Lợi nhuận ròng"
          value={92300000}
          trend="+8.2%"
          isUp={true}
          icon={<ArrowUpRight className="text-blue-600" />}
          color="blue"
        />
        <StatCard 
          label="Chi phí vận hành"
          value={36150000}
          trend="-2.4%"
          isUp={false}
          icon={<ArrowDownRight className="text-rose-600" />}
          color="rose"
        />
        <StatCard 
          label="Số đơn hàng"
          value={452}
          trend="+18%"
          isUp={true}
          icon={<Calendar className="text-amber-600" />}
          color="amber"
          isCurrency={false}
        />
      </div>

      {/* Main Chart Section */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-custom p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 tracking-tight uppercase">Biểu đồ tăng trưởng</h3>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Doanh thu theo thời gian</p>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-gray-500 uppercase">Doanh thu</span>
             </div>
          </div>
        </div>

        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_CHART_DATA}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fontWeight: 700, fill: '#9ca3af'}} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fontWeight: 700, fill: '#9ca3af'}}
                tickFormatter={(value) => `${value/1000000}M`}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                formatter={(val: number | undefined) => [val !== undefined ? formatCurrency(val) : "0 ₫", "Doanh thu"]}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10b981" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorRev)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-custom overflow-hidden">
         <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
            <h3 className="font-bold text-gray-800 tracking-tight uppercase text-sm">Giao dịch gần đây</h3>
            <button className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
              Xem tất cả <ArrowRight size={14} />
            </button>
         </div>
         <div className="divide-y divide-gray-50">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="px-8 py-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors group">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm group-hover:scale-110 transition-transform">
                      <DollarSign size={20} />
                   </div>
                   <div>
                      <p className="text-sm font-bold text-gray-800">Thanh toán đơn hàng #ORD-992{item}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">24 Tháng 1, 2024 • 14:30</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-sm font-bold text-gray-900">+ {formatCurrency(1250000)}</p>
                   <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-md">Hoàn thành</span>
                </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}

// Sub-component StatCard
const StatCard = ({ label, value, trend, isUp, icon, color, isCurrency = true }: any) => {
  const colors: any = {
    emerald: "from-emerald-50/50 to-white border-emerald-100",
    blue: "from-blue-50/50 to-white border-blue-100",
    rose: "from-rose-50/50 to-white border-rose-100",
    amber: "from-amber-50/50 to-white border-amber-100",
  };

  return (
    <div className={cn("p-6 rounded-4xl border bg-linear-to-br shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1", colors[color])}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-white rounded-2xl shadow-sm border border-white/50">{icon}</div>
        <div className={cn(
          "px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1",
          isUp ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
        )}>
          {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trend}
        </div>
      </div>
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500 mb-1">{label}</p>
      <h3 className="text-xl font-bold text-gray-900 tracking-tight">
        {isCurrency ? new Intl.NumberFormat("vi-VN").format(value) + " ₫" : value}
      </h3>
    </div>
  );
};