'use client';

import React from 'react';
import Image from 'next/image';
import { Package, Trash2, Tag, Info, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/utils/cn'; // Giả sử bạn có helper cn, nếu không thay bằng template string
import type { CampaignSlotProductResponse } from '../../_types/campaign.type';

interface MyRegistrationsTabProps {
    registrations: CampaignSlotProductResponse[];
    onCancel: (id: string) => void;
    formatPrice: (price: number) => string;
}

export const MyRegistrationsScreen: React.FC<MyRegistrationsTabProps> = ({
    registrations,
    onCancel,
    formatPrice
}) => {
    if (registrations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center bg-white rounded-[2.5rem] p-20 border border-gray-100 shadow-sm animate-in fade-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 ring-8 ring-gray-50/50">
                    <Package className="w-12 h-12 text-gray-300" />
                </div>
                <h3 className="text-gray-900 font-bold text-xl">Kho đăng ký trống</h3>
                <p className="text-gray-500 max-w-sm text-center mt-2 font-medium">
                    Bạn chưa có sản phẩm nào tham gia chiến dịch hệ thống. Hãy khám phá các sự kiện đang diễn ra!
                </p>
            </div>
        );
    }

    // Fix TS: Chấp nhận status có thể undefined
    const getStatusStyles = (status?: string) => {
        switch (status) {
            case 'APPROVED':
                return {
                    bg: 'bg-green-500',
                    lightBg: 'bg-green-50',
                    text: 'text-green-700',
                    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
                    label: 'Đã duyệt'
                };
            case 'PENDING':
                return {
                    bg: 'bg-amber-500',
                    lightBg: 'bg-amber-50',
                    text: 'text-amber-700',
                    icon: <Clock className="w-3.5 h-3.5" />,
                    label: 'Đang chờ'
                };
            case 'REJECTED':
                return {
                    bg: 'bg-red-500',
                    lightBg: 'bg-red-50',
                    text: 'text-red-700',
                    icon: <AlertCircle className="w-3.5 h-3.5" />,
                    label: 'Từ chối'
                };
            default:
                return {
                    bg: 'bg-gray-500',
                    lightBg: 'bg-gray-50',
                    text: 'text-gray-700',
                    icon: null,
                    label: status || 'N/A'
                };
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="flex items-center justify-between px-2">
                <div className="space-y-1">
                    <h2 className="font-black text-2xl text-gray-900 tracking-tight flex items-center gap-3">
                        Chiến dịch đã tham gia
                        <span className="bg-green-500 text-white text-xs py-1 px-3 rounded-full font-bold shadow-sm shadow-green-200">
                            {registrations.length}
                        </span>
                    </h2>
                    <p className="text-sm text-gray-500 font-medium italic">Theo dõi tiến độ duyệt và doanh thu biến thể</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {registrations.map((reg) => {
                    const status = getStatusStyles(reg.status);
                    const progress = Math.min(((reg.stockSold || 0) / (reg.stockLimit || 1)) * 100, 100);

                    return (
                        <div 
                            key={reg.id} 
                            className="group bg-white rounded-4xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden flex flex-col"
                        >
                            <div className="p-5 flex items-start gap-5">
                                <div className="relative shrink-0 w-24 h-24">
                                    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-md ring-4 ring-gray-50 group-hover:ring-green-50 transition-all">
                                        <Image
                                            src={reg.productThumbnail || 'https://picsum.photos/200/200'}
                                            alt={reg.productName || 'Product'}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            sizes="96px"
                                        />
                                    </div>
                                    {/* Badge Trạng thái ghim lên ảnh */}
                                    <div className={cn(
                                        "absolute -top-2 -right-2 p-1.5 rounded-xl border-2 border-white shadow-lg z-10",
                                        status.bg, "text-white"
                                    )}>
                                        {status.icon}
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0 pt-1">
                                    <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-green-600 transition-colors uppercase tracking-tight text-sm">
                                        {reg.productName}
                                    </h3>
                                    <p className="text-[10px] text-gray-400 font-black truncate flex items-center gap-1 mt-1 uppercase ">
                                        <Tag className="w-3 h-3 text-green-500" />
                                        {reg.campaignName}
                                    </p>
                                    
                                    <div className="mt-4 flex items-center gap-2">
                                        <span className="text-xl font-black text-red-500 tracking-tighter">
                                            {formatPrice(reg.salePrice || 0)}
                                        </span>
                                        <span className="text-[10px] font-bold text-gray-300 line-through decoration-gray-200">
                                            {formatPrice((reg.salePrice || 0) * 1.2)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="px-5 pb-5 mt-auto">
                                <div className={cn("rounded-[1.25rem] p-4 flex items-center justify-between border transition-colors", status.lightBg, "border-transparent group-hover:border-white")}>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] text-gray-500 font-bold uppercase">Sức mua</span>
                                            <span className="text-[10px] font-black text-gray-700 uppercase tracking-tighter">
                                                {reg.stockSold} / {reg.stockLimit} SP
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-200/50 rounded-full overflow-hidden shadow-inner">
                                            <div 
                                                className={cn("h-full transition-all duration-1000 ease-out rounded-full shadow-sm", status.bg)}
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    {reg.status === 'PENDING' && (
                                        <button
                                            onClick={() => onCancel(reg.id)}
                                            className="ml-4 p-3 text-red-400 hover:text-white hover:bg-red-500 rounded-2xl transition-all shadow-sm hover:shadow-red-200 active:scale-90 bg-white border border-red-50"
                                            title="Hủy đăng ký"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Thông tin hỗ trợ */}
            <div className="bg-linear-to-r from-gray-900 to-gray-800 border border-gray-700 rounded-4xl p-6 flex items-start gap-4 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                     <Info className="w-24 h-24 text-white" />
                </div>
                <div className="shrink-0 w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20">
                    <Info className="w-6 h-6 text-white" />
                </div>
                <div className="relative z-10">
                    <h4 className="text-white font-bold text-lg">Chế độ vận hành chiến dịch</h4>
                    <p className="text-gray-400 text-sm mt-1 max-w-2xl leading-relaxed">
                        Chương trình Flash Sale yêu cầu sự chính xác về kho hàng. Sản phẩm sau khi được <span className="text-green-400 font-bold">APPROVED</span> sẽ được khóa số lượng tồn kho tương ứng với giới hạn đăng ký để đảm bảo quyền lợi người mua.
                    </p>
                    <div className="flex gap-4 mt-4">
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                            <div className="w-2 h-2 rounded-full bg-amber-500" /> Chờ duyệt: Có thể hủy
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                            <div className="w-2 h-2 rounded-full bg-green-500" /> Đã duyệt: Khóa dữ liệu
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};