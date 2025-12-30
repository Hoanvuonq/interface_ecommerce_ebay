"use client";

import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { ArrowRight, Globe, ShieldCheck, Star, Zap } from "lucide-react";
import { reviews, stats } from "./type";

const RollingBanner = () => (
  <div className="relative flex overflow-hidden border-y-2 border-slate-900 bg-white py-4 select-none">
    <div className="flex whitespace-nowrap animate-infinite-scroll gap-20">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 text-sm font-semibold uppercase tracking-widest text-slate-900">
          <Star size={16} className="fill-orange-500 text-orange-500" />
          <span>Trusted by 10,000+ Digital Pioneers</span>
          <div className="h-1 w-1 rounded-full bg-slate-300" />
        </div>
      ))}
    </div>
  </div>
);

const StatCard = ({ label, value, index }: { label: string; value: string; index: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    viewport={{ once: true }}
    className="group relative overflow-hidden bg-slate-50 p-8 hover:bg-slate-900 transition-all duration-500"
  >
    <span className="text-6xl font-semibold text-slate-200 group-hover:text-white/10 transition-colors absolute -right-2 -bottom-2 leading-none">
      0{index + 1}
    </span>
    <div className="relative z-10">
      <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400 group-hover:text-orange-500 mb-2">
        {label}
      </p>
      <p className="text-4xl font-semibold text-slate-900 group-hover:text-white transition-colors tracking-tighter">
        {value}
      </p>
    </div>
  </motion.div>
);

export const SocialProofSection = () => {
  return (
    <section className="bg-white">
      <RollingBanner />

      <div className="max-w-350 mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          <div className="lg:col-span-4 sticky top-24">
            <h2 className="text-6xl md:text-8xl font-semibold uppercase leading-[0.85] tracking-tighter text-slate-950 mb-8">
              The New <br />
              <span className="text-orange-500">Standard.</span>
            </h2>
            <p className="text-lg text-slate-500 font-medium max-w-sm mb-8 leading-relaxed">
              Chúng tôi định nghĩa lại sự tin cậy thông qua dữ liệu thực và trải nghiệm minh bạch tuyệt đối.
            </p>
            <button className="group flex items-center gap-4 bg-slate-900 text-white px-8 py-4 rounded-full font-semibold uppercase text-xs tracking-widest hover:bg-orange-500 transition-all">
              View Case Studies
              <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          <div className="lg:col-span-8 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <StatCard key={i} index={i} label={stat.label} value={stat.value} />
              ))}
            </div>

            <div className="columns-1 md:columns-2 gap-6 space-y-6 pt-12 border-t border-slate-100">
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="break-inside-avoid bg-white border border-slate-200 p-8 rounded-sm hover:border-slate-900 transition-colors"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={cn("w-1.5 h-6", i < review.rating ? "bg-orange-500" : "bg-slate-100")} />
                      ))}
                    </div>
                    <span className="text-[10px] font-semibold uppercase text-slate-400">{review.date}</span>
                  </div>
                  <p className="text-slate-900 font-bold leading-tight mb-8 text-xl">
                    "{review.comment}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="h-px w-8 bg-slate-900" />
                    <span className="text-xs font-semibold uppercase tracking-widest text-slate-900">{review.name}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center md:justify-between gap-12 grayscale opacity-50">
          <div className="flex items-center gap-3 font-semibold text-[10px] uppercase tracking-widest"><ShieldCheck /> Secure Node</div>
          <div className="flex items-center gap-3 font-semibold text-[10px] uppercase tracking-widest"><Zap /> Instant Sync</div>
          <div className="flex items-center gap-3 font-semibold text-[10px] uppercase tracking-widest"><Globe /> Distributed</div>
        </div>
      </div>
    </section>
  );
};