'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CampaignSlotResponse } from '../types';

interface CountdownState {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
    isActive: boolean;
}

/**
 * Countdown Timer Component
 * Shows days:hours:minutes:seconds until slot starts or ends
 */
export function CountdownTimer({
    slot,
    size = 'md',
    showLabels = true,
}: {
    slot: CampaignSlotResponse;
    size?: 'sm' | 'md' | 'lg';
    showLabels?: boolean;
}) {
    const [countdown, setCountdown] = useState<CountdownState>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: false,
        isActive: slot.status === 'ACTIVE',
    });

    const calculateTimeLeft = useCallback(() => {
        const now = Date.now();
        const startTime = new Date(slot.startTime).getTime();
        const endTime = new Date(slot.endTime).getTime();

        let targetTime: number;
        let isActive = false;

        if (now < startTime) {
            // Slot hasn't started
            targetTime = startTime;
        } else if (now < endTime) {
            // Slot is active
            targetTime = endTime;
            isActive = true;
        } else {
            // Slot has ended
            return {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                isExpired: true,
                isActive: false,
            };
        }

        const diff = targetTime - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds, isExpired: false, isActive };
    }, [slot.startTime, slot.endTime]);

    useEffect(() => {
        setCountdown(calculateTimeLeft());
        const timer = setInterval(() => {
            setCountdown(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [calculateTimeLeft]);

    const sizeClasses = {
        sm: 'text-lg min-w-[2rem] h-8',
        md: 'text-2xl min-w-[3rem] h-12',
        lg: 'text-4xl min-w-[4rem] h-16',
    };

    const labelClasses = {
        sm: 'text-[10px]',
        md: 'text-xs',
        lg: 'text-sm',
    };

    if (countdown.isExpired) {
        return (
            <div className="flex items-center gap-2 text-gray-500">
                <span className="text-sm">Đã kết thúc</span>
            </div>
        );
    }

    const TimeBlock = ({ value, label }: { value: number; label: string }) => (
        <div className="flex flex-col items-center">
            <div className={`
        ${sizeClasses[size]} 
        flex items-center justify-center 
        bg-slate-900 text-white font-bold rounded-lg
        shadow-lg
      `}>
                {String(value).padStart(2, '0')}
            </div>
            {showLabels && (
                <span className={`${labelClasses[size]} text-gray-500 mt-1 uppercase tracking-wide`}>
                    {label}
                </span>
            )}
        </div>
    );

    const Separator = () => (
        <span className={`${sizeClasses[size]} flex items-center justify-center text-slate-400 font-bold`}>
            :
        </span>
    );

    return (
        <div className="flex items-start gap-1">
            {countdown.days > 0 && (
                <>
                    <TimeBlock value={countdown.days} label="Ngày" />
                    <Separator />
                </>
            )}
            <TimeBlock value={countdown.hours} label="Giờ" />
            <Separator />
            <TimeBlock value={countdown.minutes} label="Phút" />
            <Separator />
            <TimeBlock value={countdown.seconds} label="Giây" />

            {countdown.isActive && (
                <div className="ml-2 flex items-center">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    <span className="ml-2 text-sm font-medium text-red-500">LIVE</span>
                </div>
            )}
        </div>
    );
}
