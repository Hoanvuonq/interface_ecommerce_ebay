"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2, Mail, CheckCircle2 } from "lucide-react";

export const SubscribeForm = ({ email, loading, onChange, onSubmit }: any) => {
  return (
    <motion.form 
      onSubmit={onSubmit} 
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="relative group">
        <motion.div 
          className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white group-focus-within:text-amber-400 transition-colors"
          whileFocus={{ scale: 1.1 }}
        >
          <Mail size={18} strokeWidth={2} />
        </motion.div>
        <input
          type="email"
          placeholder="Nhập địa chỉ email của bạn..."
          value={email}
          onChange={(e) => onChange(e.target.value)}
          disabled={loading}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-5 text-white text-sm outline-none focus:border-amber-400/50 focus:ring-4 focus:ring-amber-400/10 transition-all font-medium placeholder:text-white backdrop-blur-sm"
          required
        />
      </div>

      <motion.button
        type="submit"
        disabled={loading}
        whileHover={!loading ? { scale: 1.02, translateY: -2 } : {}}
        whileTap={!loading ? { scale: 0.98 } : {}}
        className="relative w-full py-4 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 disabled:opacity-70 text-slate-900 rounded-2xl font-bold uppercase tracking-widest text-[11px] transition-all shadow-xl shadow-amber-900/20 overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-2"
            >
              <Loader2 size={18} className="animate-spin" />
              <span>Đang xử lý...</span>
            </motion.div>
          ) : (
            <motion.div
              key="normal"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center justify-center gap-2"
            >
              Đăng ký nhận ưu đãi 
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <ArrowRight size={16} strokeWidth={3} />
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-center lg:justify-start gap-2 mt-2"
      >
        <CheckCircle2 size={12} className="text-amber-400" />
        <p className="text-[10px] text-white uppercase font-medium tracking-[0.15em]">
          Bảo mật bởi <span className="text-amber-400 font-bold">CaLaTha Network</span>
        </p>
      </motion.div>
    </motion.form>
  );
};