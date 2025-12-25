'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2, Gift, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner'; // Hoặc library toast bạn đang dùng
import { cn } from "@/utils/cn";

const NewsletterSignup: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [subscribed, setSubscribed] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email || !emailRegex.test(email)) {
            toast.error('Vui lòng nhập email hợp lệ');
            return;
        }

        try {
            setLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate
            setSubscribed(true);
            toast.success('Đăng ký thành công!');
            setEmail('');
        } catch (error) {
            toast.error('Đăng ký thất bại. Vui lòng thử lại sau');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-20 bg-slate-950 relative overflow-hidden">
            {/* Background hiệu ứng Web3 */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] -mr-64 -mt-64" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] -ml-48 -mb-48" />

            <div className="max-w-5xl mx-auto px-4 relative z-10">
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 md:p-16 shadow-2xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        
                        {/* Cột trái: Nội dung */}
                        <div className="space-y-6 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full">
                                <Gift size={16} className="text-orange-500" />
                                <span className="text-xs font-black uppercase tracking-widest text-orange-500">Quà tặng đặc biệt</span>
                            </div>
                            
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic leading-none">
                                Đừng bỏ lỡ <br />
                                <span className="text-orange-500 text-outline-white">Ưu đãi mới</span>
                            </h2>
                            
                            <p className="text-slate-400 text-sm md:text-base font-medium max-w-md leading-relaxed">
                                Nhận voucher <span className="text-white font-bold">50.000đ</span> ngay lập tức và cập nhật những bộ sưu tập giới hạn mỗi tuần.
                            </p>

                            <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4">
                                <StatItem label="Người đăng ký" value="10K+" />
                                <StatItem label="Voucher tặng" value="50K" />
                                <StatItem label="Bảo mật" value="100%" />
                            </div>
                        </div>

                        {/* Cột phải: Form */}
                        <div className="relative">
                            <AnimatePresence mode="wait">
                                {subscribed ? (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-orange-500 rounded-[2rem] p-10 text-center space-y-4 shadow-xl shadow-orange-500/20"
                                    >
                                        <CheckCircle2 size={64} className="mx-auto text-white" strokeWidth={1.5} />
                                        <h3 className="text-2xl font-black text-white uppercase">Tuyệt vời!</h3>
                                        <p className="text-white/80 text-sm font-medium">
                                            Voucher 50K đã được gửi vào hộp thư của bạn. <br />Khám phá ngay thôi!
                                        </p>
                                    </motion.div>
                                ) : (
                                    <motion.form 
                                        onSubmit={handleSubmit}
                                        className="space-y-4"
                                    >
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-orange-500 transition-colors">
                                                <Mail size={20} />
                                            </div>
                                            <input 
                                                type="email"
                                                placeholder="Nhập địa chỉ email của bạn"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                disabled={loading}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-5 text-white outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium placeholder:text-slate-600"
                                            />
                                        </div>

                                        <button 
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-5 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-800 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs md:text-sm transition-all active:scale-95 flex items-center justify-center gap-3 shadow-lg shadow-orange-500/25"
                                        >
                                            {loading ? (
                                                <Loader2 size={20} className="animate-spin" />
                                            ) : (
                                                <>
                                                    Đăng ký nhận quà <ArrowRight size={18} strokeWidth={3} />
                                                </>
                                            )}
                                        </button>

                                        <p className="text-center text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                                            Bằng cách nhấn đăng ký, bạn đồng ý với <a href="#" className="text-slate-400 underline">Privacy Policy</a>
                                        </p>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const StatItem = ({ label, value }: { label: string; value: string }) => (
    <div className="text-center lg:text-left">
        <div className="text-xl font-black text-white leading-none">{value}</div>
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{label}</div>
    </div>
);

export default NewsletterSignup;