"use client";

import { GrowthCard, RevenueLineChart } from "@/components";
import { OrderStatusChart } from "@/components/chart/components/OrderStatusChart";
import { AlertTriangle, Package } from "lucide-react";
import { DATA_DASHBOARD } from "../../../_constants/dashboard";

export default function ShopDashboardForm() {
  return (
    <div className="min-h-screen space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-semibold text-gray-900 italic uppercase">
            Bảng điều khiển 
          </h1>
          <p className="text-[10px] font-bold text-gray-500 uppercase -tracking-tighter ml-1">
            Số liệu thống kê thời gian thực
          </p>
        </div>
        <div className="text-[10px] font-bold italic text-gray-700 bg-white px-6 py-3 rounded-2xl border border-gray-100 uppercase tracking-widest">
          Cập nhật: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GrowthCard
          label="Doanh thu hôm nay"
          value={DATA_DASHBOARD.overview.revenueToday}
          rate={12}
        />
        <GrowthCard
          label="Đơn hàng mới"
          value={DATA_DASHBOARD.overview.ordersToday}
          rate={-5}
        />
        <GrowthCard
          label="Khách hàng mới"
          value={DATA_DASHBOARD.overview.newCustomers}
          rate={8}
        />
        <GrowthCard label="Lượt truy cập" value={1240} rate={24} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <RevenueLineChart data={DATA_DASHBOARD.charts.revenueByMonth} />
        </div>
        <div className="lg:col-span-4">
          <OrderStatusChart data={DATA_DASHBOARD.charts.ordersByStatus} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-custom">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-gray-50 rounded-2xl">
              <Package size={20} />
            </div>
            <h3 className="text-xl font-semibold italic uppercase">
              Top bán chạy
            </h3>
          </div>
          <div className="space-y-6">
            {DATA_DASHBOARD.products.bestSellers.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center font-bold text-gray-400 group-hover:bg-orange-500 group-hover:text-white transition-all">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 uppercase tracking-tight italic">
                      {item.name}
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Đã bán: {item.sold}
                    </p>
                  </div>
                </div>
                <p className="font-bold text-gray-900 italic">
                  ₫{item.revenue.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-orange-50/50 p-8 rounded-[2.5rem] border border-gray-100 shadow-custom">
            <div className="flex items-center gap-3 mb-6 text-(--color-mainColor)">
              <AlertTriangle size={20} />
              <h2 className="text-lg font-bold uppercase italic tracking-tighter">
                Cảnh báo tồn kho
              </h2>
            </div>
            <div className="space-y-4">
              {DATA_DASHBOARD.products.lowStock.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm"
                >
                  <span className="text-sm font-bold text-gray-700 italic">
                    {item.name}
                  </span>
                  <span className="text-xs font-bold text-(--color-mainColor) uppercase bg-orange-50 px-3 py-1 rounded-full">
                    Còn {item.stock}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
