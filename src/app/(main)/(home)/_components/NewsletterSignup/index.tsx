"use client";

import React from "react";
import { Mail, CheckCircle2, Gift, Loader2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import ScrollReveal from "@/features/ScrollReveal";
import { useNewsletter } from "../../_hooks/useNewsletter";

// Constants cho cấu hình
const STATS = [
  { label: "Người đăng ký", value: "10K+" },
  { label: "Voucher tặng", value: "50K" },
  { label: "Bảo mật", value: "100%" },
];

const NewsletterSignup: React.FC = () => {
  const { email, setEmail, loading, subscribed, handleSubscribe } = useNewsletter();

  return (
    <section className="py-10 bg-white relative overflow-hidden border-t border-gray-100">
      <div className="absolute top-0 right-0 w-125 h-125 bg-orange-100/30 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-100 h-100 bg-blue-50/40 rounded-full blur-[100px] -ml-48 -mb-48 pointer-events-none" />

      <ScrollReveal animation="slideUp" delay={150}>
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="bg-gray-50/50 shadow-newLetter backdrop-blur-2xl rounded-[3.5rem] p-8 md:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 text-center lg:text-left">
                <Badge label="Quà tặng đặc biệt" icon={<Gift size={16} />} />
                
                <h2 className="text-4xl md:text-6xl font-semibold tracking-tighter text-slate-900 uppercase italic leading-none">
                  Đừng bỏ lỡ <br />
                  <span className="bg-linear-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                    Ưu đãi mới <br />
                  </span>
                </h2>

                <p className="text-slate-500 text-sm md:text-base font-medium max-w-md mx-auto lg:mx-0 leading-relaxed">
                  Nhận voucher <span className="text-orange-600 font-bold">50.000đ</span> ngay lập tức và cập nhật bộ sưu tập mới nhất.
                </p>

                <div className="flex flex-wrap justify-center lg:justify-start gap-8 pt-4">
                  {STATS.map((stat) => (
                    <StatItem key={stat.label} {...stat} />
                  ))}
                </div>
              </div>

              <div className="relative">
                <AnimatePresence mode="wait">
                  {subscribed ? (
                    <SuccessState />
                  ) : (
                    <SubscribeForm 
                      email={email} 
                      loading={loading} 
                      onChange={setEmail} 
                      onSubmit={handleSubscribe} 
                    />
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};


const Badge = ({ label, icon }: { label: string; icon: React.ReactNode }) => (
  <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100/50 border border-orange-200 rounded-full">
    <span className="text-orange-600">{icon}</span>
    <span className="text-[10px] font-semibold uppercase tracking-widest text-orange-600">{label}</span>
  </div>
);

const StatItem = ({ label, value }: { label: string; value: string }) => (
  <div className="text-center lg:text-left">
    <div className="text-xl font-semibold text-slate-900 leading-none tracking-tight">{value}</div>
    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{label}</div>
  </div>
);

const SuccessState = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="bg-orange-500 rounded-4xl p-10 text-center space-y-4 shadow-xl shadow-orange-500/20"
  >
    <CheckCircle2 size={64} className="mx-auto text-white" strokeWidth={1.5} />
    <h3 className="text-2xl font-semibold text-white uppercase">Tuyệt vời!</h3>
    <p className="text-white/90 text-sm font-medium">Chào mừng bạn gia nhập CaLaTha! Voucher đã được gửi.</p>
  </motion.div>
);

const SubscribeForm = ({ email, loading, onChange, onSubmit }: any) => (
  <motion.form 
    onSubmit={onSubmit} 
    className="space-y-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <div className="relative group">
      <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-orange-500 transition-colors">
        <Mail size={20} />
      </div>
      <input
        type="email"
        placeholder="Nhập địa chỉ email của bạn"
        value={email}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
        className="w-full bg-white border border-gray-200 rounded-2xl py-5 pl-14 pr-5 text-slate-900 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all font-medium shadow-sm"
        required
      />
    </div>

    <button
      type="submit"
      disabled={loading}
      className="w-full py-5 bg-linear-to-r from-orange-500 to-orange-600 hover:to-orange-700 disabled:grayscale text-white rounded-2xl font-semibold uppercase tracking-[0.2em] text-xs md:text-sm transition-all active:scale-95 flex items-center justify-center gap-3 shadow-lg shadow-orange-500/20"
    >
      {loading ? <Loader2 size={20} className="animate-spin" /> : <>Đăng ký nhận quà <ArrowRight size={18} strokeWidth={3} /></>}
    </button>
    
    <p className="text-center text-[10px] text-slate-400 uppercase font-bold tracking-widest pt-2">
      Bảo mật thông tin bởi <a href="#" className="text-orange-500 underline">CaLaTha Team</a>
    </p>
  </motion.form>
);

export default NewsletterSignup;