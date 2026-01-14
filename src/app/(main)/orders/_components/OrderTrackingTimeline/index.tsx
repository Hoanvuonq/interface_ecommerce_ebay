'use client';

import React, { useState, useEffect } from 'react';
import { shipmentService, type TrackingData } from '@/features/Shipment/services/shipment.service';
import { 
    Truck, 
    AlertCircle, 
    CheckCircle2, 
    Package, 
    MapPin, 
    RotateCw,
    XCircle,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

interface OrderTrackingTimelineProps {
    trackingCode: string;
    carrier: string;
}

export const OrderTrackingTimeline: React.FC<OrderTrackingTimelineProps> = ({ trackingCode, carrier }) => {
    const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        const fetchTrackingData = async () => {
            const carrierUpper = carrier?.trim().toUpperCase();
            
            if (!trackingCode || carrierUpper !== 'CONKIN') {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const data = await shipmentService.getConkinTracking(trackingCode);
                setTrackingData(data);
            } catch (err: any) {
                console.error('Failed to fetch tracking:', err);
                setError(err.message || 'Không thể tải thông tin vận chuyển');
            } finally {
                setLoading(false);
            }
        };

        fetchTrackingData();
    }, [trackingCode, carrier]);

    const getStatusInfo = (status: string) => {
        const statusMap: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
            'ORDER_CREATED': { label: 'Đã tạo đơn', icon: <Package size={16} />, color: 'text-blue-600 bg-blue-100' },
            'PICKED_UP': { label: 'Đã lấy hàng', icon: <Package size={16} />, color: 'text-indigo-600 bg-indigo-100' },
            'IN_TRANSIT': { label: 'Đang vận chuyển', icon: <Truck size={16} />, color: 'text-orange-600 bg-orange-100' },
            'OUT_FOR_DELIVERY': { label: 'Đang giao hàng', icon: <Truck size={16} />, color: 'text-yellow-600 bg-yellow-100' },
            'DELIVERED': { label: 'Đã giao hàng', icon: <CheckCircle2 size={16} />, color: 'text-green-600 bg-green-100' },
            'DELIVERY_FAILED': { label: 'Giao thất bại', icon: <AlertCircle size={16} />, color: 'text-red-600 bg-red-100' },
            'RETURNED': { label: 'Đã hoàn trả', icon: <RotateCw size={16} />, color: 'text-gray-600 bg-gray-100' },
            'CANCELLED': { label: 'Đã hủy', icon: <XCircle size={16} />, color: 'text-red-600 bg-red-100' },
        };
        
        return statusMap[status] || { 
            label: status?.replace(/_/g, ' ') || 'Cập nhật hành trình', 
            icon: <MapPin size={16} />, 
            color: 'text-gray-600 bg-gray-100' 
        };
    };

    if (carrier?.trim().toUpperCase() !== 'CONKIN') return null;

    const statuses = trackingData?.statuses || [];
    const hasManyStatuses = statuses.length > 4;
    const visibleStatuses = showAll ? statuses : statuses.slice(0, 4);

    return (
        <div className="w-full min-h-25">
            {loading ? (
                <div className="flex flex-col items-center justify-center py-10">
                    <RotateCw size={24} className="text-orange-500 animate-spin mb-2" />
                    <span className="text-gray-600 text-xs">Đang lấy dữ liệu hành trình...</span>
                </div>
            ) : error ? (
                <div className="p-4 bg-red-50 rounded-xl text-red-500 text-xs flex items-center gap-2">
                    <AlertCircle size={14} /> {error}
                </div>
            ) : statuses.length === 0 ? (
                <div className="text-center py-6">
                    <Package size={32} className="text-gray-200 mx-auto mb-2" />
                    <p className="text-gray-600 text-xs italic">Chưa có thông tin cập nhật hành trình</p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="relative pl-6 border-l-2 border-gray-100 ml-2 space-y-8 py-2">
                        {visibleStatuses.map((status, index) => {
                            const info = getStatusInfo(status.name);
                            const isFirst = index === 0;
                            return (
                                <div key={index} className="relative">
                                    <div className={`absolute -left-8.25 top-0 w-5 h-5 rounded-full border-4 border-white shadow-sm z-10 ${
                                        isFirst ? 'bg-orange-500 ring-4 ring-orange-100' : 'bg-gray-200'
                                    }`}>
                                        {isFirst && <div className="w-full h-full animate-ping bg-orange-400 rounded-full opacity-20" />}
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                                        <div>
                                            <p className={`text-sm font-bold ${isFirst ? 'text-gray-900' : 'text-gray-500'}`}>
                                                {info.label}
                                            </p>
                                            <p className="text-[11px] text-gray-600 mt-0.5">
                                                {status.description || 'Đơn hàng đang trong quá trình xử lý'}
                                            </p>
                                        </div>
                                        <span className="text-[10px] font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded w-fit">
                                            {status.createdAt}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {hasManyStatuses && (
                        <button 
                            onClick={() => setShowAll(!showAll)}
                            className="flex items-center gap-1 text-[11px] font-bold text-orange-600 uppercase tracking-wider hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-all"
                        >
                            {showAll ? (
                                <>Thu gọn <ChevronUp size={14} /></>
                            ) : (
                                <>Xem thêm {statuses.length - 4} cập nhật <ChevronDown size={14} /></>
                            )}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};