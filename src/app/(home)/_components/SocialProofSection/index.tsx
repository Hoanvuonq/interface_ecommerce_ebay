'use client';

import React from 'react';
import { 
    ShieldCheck, 
    RefreshCcw, 
    CreditCard, 
    Star, 
    Users, 
    ThumbsUp, 
    Headphones,
    Quote
} from 'lucide-react';
import { cn } from "@/utils/cn";

interface Review {
    id: string;
    name: string;
    rating: number;
    comment: string;
    date: string;
}

const SocialProofSection: React.FC = () => {
    const reviews: Review[] = [
        {
            id: '1',
            name: 'Nguyễn Văn A',
            rating: 5,
            comment: 'Sản phẩm tuyệt vời, giao hàng rất nhanh.',
            date: '2 ngày trước',
        },
        {
            id: '2',
            name: 'Trần Thị B',
            rating: 5,
            comment: 'Giá cả hợp lý, hỗ trợ khách hàng rất tận tình.',
            date: '5 ngày trước',
        },
        {
            id: '3',
            name: 'Lê Văn C',
            rating: 4,
            comment: 'Đóng gói cẩn thận, sản phẩm đúng mô tả.',
            date: '1 tuần trước',
        },
    ];

    const stats = [
        { label: 'Khách hàng', value: '10k+', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Đánh giá', value: '4.8', icon: Star, color: 'text-orange-500', bg: 'bg-orange-50' },
        { label: 'Hài lòng', value: '99%', icon: ThumbsUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Hỗ trợ', value: '24/7', icon: Headphones, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    const trustBadges = [
        { icon: ShieldCheck, title: 'An toàn', desc: 'Bảo mật SSL 256', color: 'text-green-600' },
        { icon: RefreshCcw, title: 'Đổi trả', desc: 'Miễn phí 30 ngày', color: 'text-blue-600' },
        { icon: CreditCard, title: 'Thanh toán', desc: 'Đa dạng hình thức', color: 'text-orange-500' },
    ];

    return (
        <section className="py-12 bg-white overflow-hidden border-t border-slate-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                
                {/* Header - Compact */}
                <div className="flex flex-col items-center mb-10 space-y-2">
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight uppercase italic text-slate-950">
                        Cộng đồng <span className="text-orange-500 text-outline">Tin Tưởng</span>
                    </h2>
                    <div className="h-1 w-10 bg-orange-500 rounded-full opacity-20" />
                </div>

                {/* Stats - Compact Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-12">
                    {stats.map((item, idx) => (
                        <div key={idx} className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3 transition-all hover:bg-white hover:shadow-md group">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-sm bg-white", item.color)}>
                                <item.icon size={18} strokeWidth={2.5} />
                            </div>
                            <div>
                                <div className="text-lg font-black tracking-tighter text-slate-900 leading-none">{item.value}</div>
                                <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-1">{item.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Reviews - Slim Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative group transition-all hover:border-orange-200">
                            <Quote className="absolute top-4 right-4 text-slate-50 group-hover:text-orange-100 transition-colors" size={32} />
                            
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-black text-[11px] text-slate-500 border border-white shadow-sm shrink-0">
                                    {review.name.charAt(0)}
                                </div>
                                <div className="min-w-0">
                                    <div className="font-black text-xs uppercase text-slate-900 truncate">{review.name}</div>
                                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{review.date}</div>
                                </div>
                            </div>

                            <div className="flex gap-0.5 mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={10} fill={i < review.rating ? "#f97316" : "none"} stroke={i < review.rating ? "#f97316" : "#e2e8f0"} strokeWidth={3} />
                                ))}
                            </div>
                            
                            <p className="text-slate-600 text-[13px] leading-snug font-medium line-clamp-3">
                                "{review.comment}"
                            </p>
                        </div>
                    ))}
                </div>

                {/* Trust Badges - Minimalist */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-50">
                    {trustBadges.map((badge, idx) => (
                        <div key={idx} className="flex items-center gap-4 px-2">
                            <div className={cn("shrink-0", badge.color)}>
                                <badge.icon size={20} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="font-black text-[11px] uppercase tracking-wider text-slate-900">{badge.title}</h3>
                                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tight leading-none mt-0.5">{badge.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SocialProofSection;