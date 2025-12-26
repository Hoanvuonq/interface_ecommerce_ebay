'use client';

import { SmartPlatformDashboard } from '../../_components/analytics/_components/SmartPlatformDashboard';

export default function ManagerAnalyticsPage() {
    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="max-w-400 mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1>
                    <p className="text-gray-500">Tổng quan hiệu suất toàn sàn thương mại điện tử</p>
                </div>

                <SmartPlatformDashboard />
            </div>
        </div>
    );
}
