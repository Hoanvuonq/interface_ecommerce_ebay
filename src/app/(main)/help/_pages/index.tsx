"use client";

import PageContentTransition from "@/features/PageContentTransition";
import { ArrowUpRight, HelpCircle, MessageCircle, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FAQ_LIST, HELP_CATEGORIES } from "../_types/help";
import { FAQAccordion } from "../_components/FAQAccordion";

// --- SUB-COMPONENTS ---

// --- MAIN COMPONENT ---
export default function HelpScreen() {
  const [searchTerm, setSearchTerm] = useState("");
  const categories = useMemo(() => HELP_CATEGORIES, []);

  const filteredFaqs = useMemo(() => {
    if (!searchTerm.trim()) return FAQ_LIST;
    return FAQ_LIST.filter(faq => 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <PageContentTransition>
      <div className="min-h-screen bg-[#fafafa] text-slate-900 pb-12">
        
        <section className="bg-white pt-16 pb-12 border-b border-slate-100 relative overflow-hidden text-center">
          <div className="max-w-3xl mx-auto px-4 relative z-10">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tighter mb-4 uppercase">
              Chúng tôi có thể <span className="text-orange-600">giúp gì?</span>
            </h1>
            <div className="relative max-w-xl mx-auto group">
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
              <input 
                type="text"
                placeholder="Tìm câu hỏi hoặc từ khóa..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:bg-white focus:border-orange-500 transition-all text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </section>

        <main className="max-w-5xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-orange-600 flex items-center gap-2">
                <div className="w-4 h-[1.5px] bg-orange-600" /> Chủ đề
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                {categories.map((cat, idx) => (
                  <div key={idx} className="p-4 bg-white border border-slate-100 rounded-2xl hover:border-orange-200 transition-all group shadow-sm">
                    <cat.icon size={20} className="text-slate-400 group-hover:text-orange-600 mb-2" />
                    <h4 className="text-xs font-bold text-slate-800 mb-1">{cat.title}</h4>
                    <p className="text-[10px] text-slate-500 font-light leading-snug">{cat.description}</p>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-slate-900 rounded-3xl text-white">
                <MessageCircle size={24} className="text-orange-500 mb-3" />
                <h3 className="text-sm font-bold mb-1">Cần hỗ trợ thêm?</h3>
                <p className="text-slate-400 text-[10px] mb-4">Trò chuyện trực tiếp với chúng tôi.</p>
                <Link href="/contact" className="inline-flex items-center gap-1 text-orange-500 text-[11px] font-bold">
                  Gửi yêu cầu <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
                  <HelpCircle size={20} className="text-orange-600" /> Phổ biến
                </h2>
                <span className="text-slate-400 text-[10px] italic">{filteredFaqs.length} kết quả</span>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl px-6 py-2 shadow-sm">
                {filteredFaqs.map((faq, idx) => (
                  <FAQAccordion key={idx} item={faq} />
                ))}
                {filteredFaqs.length === 0 && (
                  <div className="py-12 text-center text-slate-400 text-xs italic">Không tìm thấy kết quả.</div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </PageContentTransition>
  );
}