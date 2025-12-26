"use client";

import { ManagerQuickStats } from "../../_components/dashboard/_components/ManagerQuickStats";
export default function ManagerDashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-gray-600 mt-1">
                    Tổng quan nhanh về hoạt động platform
                </p>
            </div>
            <ManagerQuickStats />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-6 bg-white">
                    <div className="font-semibold mb-2">Đơn hàng gần đây</div>
                    <div className="text-sm text-gray-500">Coming soon...</div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6 bg-white">
                    <div className="font-semibold mb-2">Shop hoạt động</div>
                    <div className="text-sm text-gray-500">Coming soon...</div>
                </div>
            </div>
        </div>
    );
}
