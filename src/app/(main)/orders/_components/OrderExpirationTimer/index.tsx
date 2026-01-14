import React, { useEffect, useState } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

// Extend dayjs with duration plugin
dayjs.extend(duration);

interface OrderExpirationTimerProps {
    expiresAt?: string;
    onExpire?: () => void;
    compact?: boolean;
}

export const OrderExpirationTimer: React.FC<OrderExpirationTimerProps> = ({
    expiresAt,
    onExpire,
    compact = false
}) => {
    const [isExpired, setIsExpired] = useState(false);
    const [timeLeft, setTimeLeft] = useState<string>('');

    // Calculate deadline
    const deadline = expiresAt ? dayjs(expiresAt).valueOf() : 0;

    useEffect(() => {
        if (!expiresAt) return;

        const checkExpiration = () => {
            const now = dayjs().valueOf();
            const diff = deadline - now;

            if (diff <= 0) {
                setIsExpired(true);
                setTimeLeft('Đã hết hạn');
                if (onExpire) onExpire();
                return;
            }

            // Format duration manually for better control
            const dur = dayjs.duration(diff);
            const hours = Math.floor(dur.asHours());
            const minutes = dur.minutes();
            const seconds = dur.seconds();

            if (hours > 0) {
                setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
            } else {
                setTimeLeft(`${minutes}m ${seconds}s`);
            }
        };

        // Initial check
        checkExpiration();

        // Update every second
        const timer = setInterval(checkExpiration, 1000);

        return () => clearInterval(timer);
    }, [expiresAt, deadline, onExpire]);

    if (!expiresAt) return null;

    // Render expired state
    if (isExpired) {
        if (compact) {
            return (
                <span className="flex items-center gap-1.5 text-red-600 font-medium text-sm">
                    <AlertCircle size={14} /> Đã hết hạn
                </span>
            );
        }
        return (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3 items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-red-900">Đơn hàng đã hết hạn thanh toán</h4>
                    <p className="text-sm text-red-700">
                        Đơn hàng này đã bị hủy tự động do quá hạn thanh toán. Vui lòng đặt lại đơn hàng mới.
                    </p>
                </div>
            </div>
        );
    }

    // Render active countdown state
    if (compact) {
        return (
            <span className="flex items-center gap-1.5 text-orange-600 font-medium text-sm">
                <Clock size={14} /> {timeLeft}
            </span>
        );
    }

    return (
        <div className="mb-4 bg-orange-50 border border-gray-200 rounded-lg p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-orange-100 text-orange-600 rounded-full shrink-0">
                        <Clock size={20} />
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Chờ thanh toán</h4>
                        <p className="text-sm text-gray-600 mt-0.5">
                            Vui lòng thanh toán trước <span className="font-medium text-gray-900">{dayjs(expiresAt).format('HH:mm DD/MM/YYYY')}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Đơn hàng sẽ tự động hủy nếu quá hạn.
                        </p>
                    </div>
                </div>
                
                <div className="flex flex-col items-end sm:items-end pl-11 sm:pl-0">
                    <span className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Thời gian còn lại</span>
                    <div className="text-2xl sm:text-3xl font-bold text-orange-600 tabular-nums tracking-tight">
                        {timeLeft}
                    </div>
                </div>
            </div>
        </div>
    );
};