'use client';

import {
    Zap, Store, Shield, ChevronRight,
    ShoppingBag, Eye, Settings
} from 'lucide-react';
import Link from 'next/link';

/**
 * Demo Index Page
 * Central hub for all demo pages
 */
export default function DemoIndexPage() {
    const demos = [
        {
            title: 'Campaign (Public)',
            description: 'Flash Sale, Countdown Timer, Product Cards cho Buyer',
            href: '/demo/campaign',
            icon: Zap,
            color: 'bg-gradient-to-r from-orange-500 to-red-500',
            role: 'Public',
            features: ['Flash Sale Banner', 'Countdown Timer', 'Product Grid', 'Time Slots'],
        },
        {
            title: 'Shop Campaign',
            description: 'Đăng ký sản phẩm vào Flash Sale, quản lý Shop Sales',
            href: '/demo/shop/campaign',
            icon: Store,
            color: 'bg-gradient-to-r from-green-500 to-emerald-500',
            role: 'Shop Owner',
            features: ['Tham gia Platform Campaigns', 'Đăng ký sản phẩm', 'Quản lý Shop Sale'],
        },
        {
            title: 'Admin Campaign',
            description: 'Tạo/quản lý Platform Campaigns, duyệt đăng ký',
            href: '/demo/admin/campaign',
            icon: Shield,
            color: 'bg-gradient-to-r from-purple-500 to-indigo-500',
            role: 'Admin',
            features: ['Tạo Campaign', 'Duyệt đăng ký', 'Thống kê', 'Quản lý Slots'],
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl">
                            <Eye className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Demo Hub</h1>
                            <p className="text-gray-500">Sandbox để phát triển và test UI/UX</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Demo Cards */}
            <main className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {demos.map((demo) => {
                        const Icon = demo.icon;
                        return (
                            <Link
                                key={demo.href}
                                href={demo.href}
                                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                            >
                                {/* Header */}
                                <div className={`${demo.color} p-6 relative overflow-hidden`}>
                                    {/* Background decoration */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2" />

                                    <div className="relative flex items-center justify-between">
                                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                            <Icon className="w-8 h-8 text-white" />
                                        </div>
                                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                                            {demo.role}
                                        </span>
                                    </div>

                                    <h2 className="text-2xl font-bold text-white mt-4">
                                        {demo.title}
                                    </h2>
                                </div>

                                {/* Body */}
                                <div className="p-6">
                                    <p className="text-gray-600 mb-4">{demo.description}</p>

                                    {/* Features */}
                                    <div className="space-y-2 mb-6">
                                        {demo.features.map((feature, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-gray-500">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>

                                    {/* CTA */}
                                    <div className="flex items-center justify-between text-blue-600 font-medium group-hover:text-blue-700">
                                        <span>Xem Demo</span>
                                        <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Info Section */}
                <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-100 rounded-xl">
                            <Settings className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Về Demo Sandbox
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Các trang demo này được phát triển trong thư mục <code className="px-2 py-0.5 bg-gray-100 rounded text-sm">/demo</code> và
                                không ảnh hưởng đến cấu trúc chính của dự án. Tất cả các services được import từ thư mục chung.
                            </p>

                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                    ✅ Có Mock Data
                                </span>
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                    🔐 Demo Login
                                </span>
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                    🌐 API Integration
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
