'use client';

import { Calendar, Tag, Users, TrendingUp } from 'lucide-react';
import type { CampaignResponse } from '../types';

interface CampaignCardProps {
    campaign: CampaignResponse;
    onClick?: () => void;
}

/**
 * Campaign Card for campaign list
 */
export function CampaignCard({ campaign, onClick }: CampaignCardProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'bg-green-500';
            case 'SCHEDULED': return 'bg-blue-500';
            case 'ENDED': return 'bg-gray-400';
            case 'CANCELLED': return 'bg-red-500';
            default: return 'bg-gray-400';
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'FLASH_SALE': return 'Flash Sale';
            case 'DAILY_DEAL': return 'Daily Deal';
            case 'MEGA_SALE': return 'Mega Sale';
            case 'SHOP_SALE': return 'Shop Sale';
            default: return type;
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('vi-VN', {
            day: 'numeric',
            month: 'short',
        });
    };

    return (
        <div
            onClick={onClick}
            className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
        >
            {/* Banner */}
            <div className="relative h-40 overflow-hidden">
                <img
                    src={campaign.bannerUrl || 'https://picsum.photos/seed/campaign/600/200'}
                    alt={campaign.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                    <span className={`${getStatusColor(campaign.status)} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                        {campaign.status}
                    </span>
                </div>

                {/* Featured Badge */}
                {campaign.isFeatured && (
                    <div className="absolute top-3 right-3">
                        <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                            <TrendingUp size={12} />
                            Featured
                        </span>
                    </div>
                )}

                {/* Campaign Type */}
                <div className="absolute bottom-3 left-3">
                    <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <Tag size={14} />
                        {getTypeLabel(campaign.campaignType)}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                {/* Title */}
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {campaign.name}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                    {campaign.description}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between text-sm">
                    {/* Date Range */}
                    <div className="flex items-center gap-1 text-gray-500">
                        <Calendar size={14} />
                        <span>{formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}</span>
                    </div>

                    {/* Products Count */}
                    <div className="flex items-center gap-1 text-gray-500">
                        <Users size={14} />
                        <span>{campaign.totalProducts} SP</span>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-center">
                        <p className="text-lg font-bold text-blue-600">{campaign.totalSlots}</p>
                        <p className="text-xs text-gray-500">Slots</p>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-bold text-green-600">{campaign.activeSlots}</p>
                        <p className="text-xs text-gray-500">Active</p>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-bold text-orange-600">{campaign.totalSold?.toLocaleString() || 0}</p>
                        <p className="text-xs text-gray-500">Đã bán</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
