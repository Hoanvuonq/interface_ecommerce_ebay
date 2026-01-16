'use client';

import { Clock, Zap, ChevronRight } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';
import type { CampaignSlotResponse } from '../types';

interface SlotTabsProps {
    slots: CampaignSlotResponse[];
    activeSlotId: string;
    onSlotChange: (slotId: string) => void;
}

/**
 * Slot Tabs - Time slot selector with countdown
 */
export function SlotTabs({ slots, activeSlotId, onSlotChange }: SlotTabsProps) {
    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Hôm nay';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Ngày mai';
        }
        return date.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric' });
    };

    const getStatusBadge = (slot: CampaignSlotResponse) => {
        switch (slot.status) {
            case 'ACTIVE':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500 text-white text-xs font-medium rounded-full">
                        <Zap size={10} />
                        ĐANG DIỄN RA
                    </span>
                );
            case 'UPCOMING':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500 text-white text-xs font-medium rounded-full">
                        <Clock size={10} />
                        SẮP TỚI
                    </span>
                );
            case 'ENDED':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-400 text-white text-xs font-medium rounded-full">
                        ĐÃ KẾT THÚC
                    </span>
                );
        }
    };

    return (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {slots.map((slot) => {
                const isActive = slot.id === activeSlotId;
                const isLive = slot.status === 'ACTIVE';
                const isEnded = slot.status === 'ENDED';

                return (
                    <button
                        key={slot.id}
                        onClick={() => onSlotChange(slot.id)}
                        disabled={isEnded}
                        className={`
              relative flex-shrink-0 p-4 rounded-2xl border-2 transition-all duration-200
              min-w-[180px] text-left cursor-pointer
              ${isActive
                                ? isLive
                                    ? 'border-red-500 bg-red-50 shadow-lg shadow-red-500/20'
                                    : 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/20'
                                : isEnded
                                    ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                            }
            `}
                    >
                        {/* Status Badge */}
                        <div className="mb-2">
                            {getStatusBadge(slot)}
                        </div>

                        {/* Date */}
                        <p className="text-sm font-medium text-gray-900 mb-1">
                            {formatDate(slot.startTime)}
                        </p>

                        {/* Time Range */}
                        <p className="text-lg font-bold text-gray-700 flex items-center gap-1">
                            {formatTime(slot.startTime)}
                            <ChevronRight size={16} className="text-gray-400" />
                            {formatTime(slot.endTime)}
                        </p>

                        {/* Capacity */}
                        <p className="text-xs text-gray-500 mt-2">
                            {slot.approvedProducts}/{slot.maxProducts} sản phẩm
                        </p>

                        {/* Fully Booked Badge */}
                        {slot.isFullyBooked && (
                            <div className="absolute top-2 right-2">
                                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                                    Full
                                </span>
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
