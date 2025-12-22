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
            if (!trackingCode || carrier !== 'CONKIN') {
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

    // Map status to Vietnamese and Icon
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
            label: status.replace(/_/g, ' '), 
            icon: <MapPin size={16} />, 
            color: 'text-gray-600 bg-gray-100' 
        };
    };

    if (carrier !== 'CONKIN') {
        return null;
    }

    const statuses = (trackingData?.statuses || []).filter(Boolean);
    const hasManyStatuses = statuses.length > 4;
    const visibleStatuses = showAll || !hasManyStatuses ? statuses : statuses.slice(0, 4);

    return (
        <div className="rounded-2xl border border-gray-100 shadow-sm bg-white overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Theo dõi vận chuyển</h3>
                    <p className="text-gray-500 text-xs mt-0.5">Cập nhật mới nhất từ Conkin</p>
                </div>
                <div className="bg-orange-100 text-orange-700 font-mono text-xs px-3 py-1 rounded-full font-medium border border-orange-200">
                    {trackingCode}
                </div>
            </div>

            <div className="p-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-8">
                        <RotateCw size={32} className="text-orange-500 animate-spin mb-3" />
                        <span className="text-gray-500 text-sm">Đang tải thông tin vận chuyển...</span>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center text-center gap-3 py-6">
                        <div className="p-3 bg-red-50 text-red-500 rounded-full">
                            <AlertCircle size={32} />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900 mb-1">Hiện không lấy được thông tin theo dõi</p>
                            <p className="text-sm text-gray-500 max-w-xs mx-auto">
                                Vui lòng thử lại sau hoặc sử dụng mã vận đơn ở trên để tra cứu trực tiếp.
                            </p>
                        </div>
                    </div>
                ) : !trackingData || !trackingData.statuses || trackingData.statuses.length === 0 ? (
                    <div className="flex flex-col items-center text-center py-8">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <Package size={32} className="text-gray-300" />
                        </div>
                        <p className="text-gray-500 text-sm">Chưa có thông tin vận chuyển</p>
                    </div>
                ) : (
                    <>
                        {/* Info Summary */}
                        <div className="bg-orange-50/50 rounded-xl border border-orange-100 p-4 mb-6">
                            <div className="flex flex-wrap gap-y-4 gap-x-8">
                                <div>
                                    <span className="text-gray-500 block text-xs mb-1">Ngày tạo</span>
                                    <span className="font-semibold text-gray-900 text-sm">{trackingData.date_create}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block text-xs mb-1">Dịch vụ</span>
                                    <span className="font-semibold text-gray-900 text-sm">{trackingData.company_service}</span>
                                </div>
                                {trackingData.country_name && (
                                    <div>
                                        <span className="text-gray-500 block text-xs mb-1">Quốc gia</span>
                                        <span className="font-semibold text-gray-900 text-sm">{trackingData.country_name}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="relative pl-4 border-l-2 border-gray-100 space-y-8 ml-3 my-4">
                            {visibleStatuses.map((status, index) => {
                                const info = getStatusInfo(status.name);
                                const isFirst = index === 0;
                                
                                return (
                                    <div key={index} className="relative">
                                        <div className={`absolute -left-[25px] top-0 w-5 h-5 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${
                                            isFirst ? 'bg-orange-500 text-white ring-4 ring-orange-100' : 'bg-gray-200 text-gray-500'
                                        }`}>
                                            {isFirst && <div className="w-2 h-2 bg-white rounded-full" />}
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`font-semibold text-sm ${isFirst ? 'text-gray-900' : 'text-gray-600'}`}>
                                                        {info.label}
                                                    </span>
                                                    {isFirst && (
                                                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold uppercase rounded-full tracking-wide">
                                                            Mới nhất
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {/* If location info is available in status object, display it here */}
                                                    {/* {status.location && <span>{status.location}</span>} */}
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-400 font-mono whitespace-nowrap bg-gray-50 px-2 py-1 rounded">
                                                {status.createdAt}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {hasManyStatuses && (
                            <button
                                type="button"
                                className="flex items-center gap-1 text-xs font-medium text-orange-600 hover:text-orange-700 hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-colors ml-auto"
                                onClick={() => setShowAll((prev) => !prev)}
                            >
                                {showAll ? (
                                    <>Thu gọn <ChevronUp size={14} /></>
                                ) : (
                                    <>Xem thêm <ChevronDown size={14} /></>
                                )}
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};