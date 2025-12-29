"use client";

import { cn } from "@/utils/cn";
import { Quote, Star, CheckCircle2 } from "lucide-react";
import React from "react";
import { reviews, stats, trustBadges } from "./type";
import ScrollReveal from "@/features/ScrollReveal";

export const SocialProofSection: React.FC = () => {
  return (
    <section className="py-10 sm:py-16 bg-white overflow-hidden border-t border-slate-50">
      <ScrollReveal animation="fadeIn" delay={100}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* HEADER SECTION */}
          <div className="flex flex-col items-center mb-10 sm:mb-14 space-y-3 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight uppercase italic text-slate-950">
              Cộng đồng <span className="text-orange-500">Tin Tưởng</span>
            </h2>
            <div className="h-1.5 w-16 sm:w-24 bg-orange-500 rounded-full opacity-20" />
            <p className="text-sm sm:text-base text-slate-500 font-medium max-w-lg mx-auto">
              Hàng ngàn khách hàng đã trải nghiệm và hài lòng với chất lượng dịch vụ của chúng tôi.
            </p>
          </div>

          {/* STATS GRID */}
          {/* Mobile: 2 cột, Tablet/Desktop: 4 cột */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-12 sm:mb-16">
            {stats.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-2xl p-3 sm:p-5 border border-slate-100 flex flex-col sm:flex-row items-center sm:items-start gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-orange-100 group text-center sm:text-left"
              >
                <div
                  className={cn(
                    "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-sm bg-white",
                    item.color
                  )}
                >
                  <item.icon size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black tracking-tighter text-slate-900 leading-none mb-1">
                    {item.value}
                  </div>
                  <div className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-500">
                    {item.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* REVIEWS GRID */}
          {/* Mobile: 1 cột, Tablet: 2 cột, Desktop: 3 cột */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="flex flex-col bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] relative group transition-all duration-300 hover:border-orange-200 hover:shadow-orange-500/10 h-full"
              >
                {/* Quote Icon Background */}
                <Quote
                  className="absolute top-4 right-4 text-slate-100 group-hover:text-orange-50 transition-colors duration-300"
                  size={40}
                />

                {/* User Info */}
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-100 flex items-center justify-center font-black text-xs text-slate-500 border-2 border-white shadow-md shrink-0">
                    {review.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-black text-sm uppercase text-slate-900 truncate">
                      {review.name}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                        {review.date}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"/>
                        <div className="flex items-center text-green-600 text-[10px] font-bold uppercase gap-0.5">
                            <CheckCircle2 size={10} />
                            <span>Đã mua</span>
                        </div>
                    </div>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex gap-0.5 mb-3 relative z-10">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={cn(
                        "transition-all duration-300",
                        i < review.rating ? "fill-orange-500 text-orange-500" : "fill-slate-100 text-slate-200"
                      )}
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-slate-600 text-sm leading-relaxed font-medium relative z-10 grow">
                  "{review.comment}"
                </p>
              </div>
            ))}
          </div>

          {/* TRUST BADGES */}
          <div className="border-t border-slate-100 pt-8 sm:pt-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
              {trustBadges.map((badge, idx) => (
                <div 
                    key={idx} 
                    className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 sm:gap-4 p-2 sm:p-0"
                >
                  <div className={cn("shrink-0 p-3 rounded-full bg-opacity-10", badge.color.replace('text-', 'bg-'))}>
                    <badge.icon size={24} strokeWidth={2} className={badge.color} />
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-wide text-slate-900 mb-1">
                      {badge.title}
                    </h3>
                    <p className="text-xs font-medium text-slate-500 leading-snug">
                      {badge.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </ScrollReveal>
    </section>
  );
};