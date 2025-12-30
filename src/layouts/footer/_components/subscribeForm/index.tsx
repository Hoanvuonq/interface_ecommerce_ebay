"use client";

import { motion } from "framer-motion";
import { ArrowRight, Loader2, Mail } from "lucide-react";

export const SubscribeForm = ({ email, loading, onChange, onSubmit }: any) => (
  <motion.form 
    onSubmit={onSubmit} 
    className="space-y-3"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="relative group">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white group-focus-within:text-amber-400 transition-colors">
        <Mail size={16} strokeWidth={2.5} />
      </div>
      <input
        type="email"
        placeholder="Nhập địa chỉ email của bạn..."
        value={email}
        onChange={(e) => onChange(e.target.value)}
        disabled={loading}
        className="w-full bg-white/10 border border-white/10 rounded-2xl py-3.5 pl-12 pr-5 text-white text-sm outline-none focus:border-amber-400/50 focus:ring-4 focus:ring-amber-400/5 transition-all font-medium placeholder:text-white/30"
        required
      />
    </div>

    <button
      type="submit"
      disabled={loading}
      className="w-full py-3.5 bg-linear-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 disabled:opacity-50 text-slate-900 rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20"
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <>Đăng ký nhận ưu đãi <ArrowRight size={14} strokeWidth={3} /></>
      )}
    </button>
    
    <p className="text-[9px] text-white uppercase font-medium tracking-[0.2em] text-center lg:text-left mt-2">
      Dữ liệu được bảo mật bởi <span className="text-amber-400 font-bold">CaLaTha Network</span>
    </p>
  </motion.form>
);