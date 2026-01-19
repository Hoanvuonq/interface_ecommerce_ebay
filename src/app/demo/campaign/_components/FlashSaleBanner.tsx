'use client';

import { Zap, ChevronRight, Flame } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';
import type { CampaignResponse, CampaignSlotResponse } from '../types';

interface FlashSaleBannerProps {
    campaign: CampaignResponse;
    activeSlot: CampaignSlotResponse | null;
}

/**
 * Flash Sale Hero Banner
 * Vibrant gradient background with countdown timer
 */
export function FlashSaleBanner({ campaign, activeSlot }: FlashSaleBannerProps) {
    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-8 md:p-12">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-60 h-60 bg-yellow-300 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white rounded-full blur-3xl opacity-20" />
            </div>

            {/* Animated Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${3 + Math.random() * 4}s`,
                        }}
                    >
                        <Flame className="w-4 h-4 text-yellow-300 opacity-60" />
                    </div>
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Left Side */}
                <div className="text-center md:text-left">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                        <Zap className="w-5 h-5 text-yellow-300" />
                        <span className="text-white font-semibold text-sm uppercase tracking-wide">
                            {campaign.campaignType === 'FLASH_SALE' ? 'Flash Sale' : campaign.campaignType}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
                        {campaign.name}
                    </h1>

                    {/* Description */}
                    <p className="text-white/90 text-lg max-w-lg">
                        {campaign.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-6 mt-6 justify-center md:justify-start">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">{campaign.totalProducts}</p>
                            <p className="text-white/70 text-sm">Sản phẩm</p>
                        </div>
                        <div className="w-px h-12 bg-white/30" />
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">{campaign.totalSold?.toLocaleString()}</p>
                            <p className="text-white/70 text-sm">Đã bán</p>
                        </div>
                        <div className="w-px h-12 bg-white/30" />
                        <div className="text-center">
                            <p className="text-3xl font-bold text-yellow-300">50%</p>
                            <p className="text-white/70 text-sm">Giảm tới</p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Countdown */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                    <p className="text-white/80 text-center mb-3 font-medium">
                        {activeSlot?.status === 'ACTIVE' ? 'Kết thúc sau' : 'Bắt đầu sau'}
                    </p>
                    {activeSlot && (
                        <CountdownTimer slot={activeSlot} size="lg" showLabels={true} />
                    )}
                    <button className="mt-6 w-full bg-white text-red-500 py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors cursor-pointer">
                        Xem tất cả deal
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Custom Styles */}
            <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
}
