"use client";
export const HeaderContact = () => {
  return (
     <section className="bg-white border-b border-slate-100 py-3">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="max-w-2xl text-center md:text-left">
                <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-xs font-bold uppercase tracking-widest">
                  Liên hệ ngay
                </div>
                <h1 className="text-5xl md:text-3xl font-black tracking-tighter mb-6 text-slate-950">
                  CONNECT <span className="text-orange-500">WITH US</span>
                </h1>
                <p className="text-slate-500 text-lg font-light leading-relaxed">
                  Chúng tôi hỗ trợ doanh nghiệp tối ưu hóa quy trình vận chuyển quốc tế 
                  với sự tận tâm và chuyên nghiệp cao nhất.
                </p>
              </div>
              
              <div className="relative w-full max-w-xs aspect-square hidden md:block">
                <div className="absolute inset-0 bg-orange-500/10 rounded-[3rem] rotate-6" />
                <div className="absolute inset-0 bg-slate-200 rounded-[3rem] -rotate-3 overflow-hidden border-4 border-white shadow-2xl">
                   <div className="w-full h-full bg-orange-500 flex items-center justify-center text-white italic font-black text-2xl">
                     EBAY EXPRESS
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>
  )
}

