"use client";

import React, { useState } from "react";
import { Mail, CheckCircle2, Gift, Loader2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/utils/cn";
import ScrollReveal from "@/features/ScrollReveal";

const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const { success, error: toastError } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      toastError("Lỗi định dạng", {
        description: "Vui lòng nhập địa chỉ email hợp lệ",
      });
      return;
    }

    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubscribed(true);
      success("Đăng ký thành công", {
        description: "Voucher 50K đã được gửi vào hòm thư của bạn!",
      });
      setEmail("");
    } catch (error) {
      toastError("Đăng ký thất bại", {
        description: "Vui lòng kiểm tra lại kết nối mạng",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
      <section className="py-10 bg-white relative overflow-hidden border-t border-gray-100">
        <div className="absolute top-0 right-0 w-125 h-125 bg-orange-100/30 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-100 h-100 bg-blue-50/40 rounded-full blur-[100px] -ml-48 -mb-48" />
          <ScrollReveal animation="slideUp" delay={150}>

        <div className="max-w-5xl  mx-auto px-4 relative z-10">
          <div className="bg-gray-50/50 shadow-newLetter backdrop-blur-2xl rounded-[3.5rem] p-8 md:p-16 ">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100/50 border border-orange-200 rounded-full">
                  <Gift size={16} className="text-orange-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">
                    Quà tặng đặc biệt
                  </span>
                </div>

                <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">
                  Đừng bỏ lỡ <br />
                  <span className="bg-linear-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                    Ưu đãi mới
                  </span>
                </h2>

                <p className="text-slate-500 text-sm md:text-base font-medium max-w-md leading-relaxed">
                  Nhận voucher{" "}
                  <span className="text-orange-600 font-bold">50.000đ</span>{" "}
                  ngay lập tức và cập nhật những bộ sưu tập giới hạn mỗi tuần.
                </p>

                <div className="flex flex-wrap justify-center lg:justify-start gap-8 pt-4">
                  <StatItem label="Người đăng ký" value="10K+" />
                  <StatItem label="Voucher tặng" value="50K" />
                  <StatItem label="Bảo mật" value="100%" />
                </div>
              </div>

              <div className="relative">
                <AnimatePresence mode="wait">
                  {subscribed ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-orange-500 rounded-4xl p-10 text-center space-y-4 shadow-xl shadow-orange-500/20"
                    >
                      <CheckCircle2
                        size={64}
                        className="mx-auto text-white"
                        strokeWidth={1.5}
                      />
                      <h3 className="text-2xl font-black text-white uppercase">
                        Tuyệt vời!
                      </h3>
                      <p className="text-white/90 text-sm font-medium">
                        Chào mừng bạn gia nhập cộng đồng CaLaTha! <br />
                        Khám phá ngay thôi!
                      </p>
                    </motion.div>
                  ) : (
                    <motion.form onSubmit={handleSubmit} className="space-y-4">
                      <div className="relative group">
                        <div
                          className={cn(
                            "absolute inset-y-0 left-5 flex items-center pointer-events-none",
                            "text-slate-400 group-focus-within:text-orange-500 transition-colors"
                          )}
                        >
                          <Mail size={20} />
                        </div>
                        <input
                          type="email"
                          placeholder="Nhập địa chỉ email của bạn"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={loading}
                          className={cn(
                            "w-full bg-white border border-gray-200 rounded-2xl py-5 pl-14 pr-5 text-slate-900 outline-none",
                            "focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all font-medium placeholder:text-slate-400 shadow-sm"
                          )}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className={cn(
                          "w-full py-5 bg-linear-to-r from-orange-500 to-orange-600 hover:to-orange-700 disabled:from-slate-200 disabled:to-slate-200 text-white rounded-2xl font-black uppercase",
                          "tracking-[0.2em] text-xs md:text-sm transition-all active:scale-95 flex items-center justify-center gap-3 shadow-lg shadow-orange-500/20"
                        )}
                      >
                        {loading ? (
                          <Loader2 size={20} className="animate-spin" />
                        ) : (
                          <>
                            Đăng ký nhận quà{" "}
                            <ArrowRight size={18} strokeWidth={3} />
                          </>
                        )}
                      </button>
                      <p className="text-center text-[10px] text-slate-400 uppercase font-bold tracking-widest pt-2">
                        Đảm bảo bảo mật thông tin tuyệt đối bởi{" "}
                        <a href="#" className="text-orange-500 underline">
                          CaLaTha Team
                        </a>
                      </p>
                    </motion.form>
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

const StatItem = ({ label, value }: { label: string; value: string }) => (
  <div className="text-center lg:text-left">
    <div className="text-xl font-black text-slate-900 leading-none tracking-tight">
      {value}
    </div>
    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
      {label}
    </div>
  </div>
);

export default NewsletterSignup;
