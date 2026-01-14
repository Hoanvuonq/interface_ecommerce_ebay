"use client";

import { Building2, CreditCard, Globe, HeartHandshake, Mail, MapPin, Phone, Rocket, ShieldCheck, Store, Trophy, Users } from "lucide-react";
import { StatCard } from "./_components/StatCard";
import { InfoItem } from "./_components/InfoItem";

export default function AboutScreen() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="relative bg-white py-28 overflow-hidden border-b border-gray-50">
        <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] bg-blue-50/40 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[60%] bg-orange-50/40 rounded-full blur-[120px]" />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-orange-50 border border-gray-100 text-orange-600 text-[10px] font-semibold uppercase tracking-[0.2em] mb-8">
            Our Identity
          </div>
          <h1 className="text-5xl md:text-7xl font-semibold text-gray-900 mb-8 tracking-tighter leading-[1.1]">
            Về <span className="bg-linear-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent uppercase">CaLaTha</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Nền tảng thương mại điện tử thế hệ mới, kết nối hàng triệu giá trị trên một sàn giao dịch minh bạch và tin cậy.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-16 relative z-20">
        <div className="bg-white/80 backdrop-blur-2xl rounded-[40px] shadow-[0_30px_100px_rgba(0,0,0,0.06)] p-8 md:p-14 mb-16 border border-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7 space-y-8">
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-tight">
                Xây dựng hệ sinh thái mua sắm bền vững tại Việt Nam
              </h2>
              <div className="space-y-5 text-gray-500 text-base md:text-lg font-medium leading-relaxed">
                <p>
                  <span className="text-orange-600 font-semibold">CaLaTha</span> là nền tảng đột phá vận hành bởi <strong className="text-gray-900">Công ty TNHH TM & DV Vận Chuyển Quốc Tế EBAY</strong>.
                </p>
                <p>
                  Chúng tôi kiến tạo cầu nối công nghệ, giúp doanh nghiệp tiếp cận khách hàng toàn quốc với trải nghiệm an toàn tuyệt đối.
                </p>
              </div>
            </div>
            <div className="lg:col-span-5 text-center">
              <div className="bg-linear-to-br from-orange-50 to-rose-50 p-10 rounded-[35px] border border-gray-100/50 relative group transition-all">
                  <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-xl border border-gray-50 mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Rocket className="w-12 h-12 text-orange-500" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Đổi mới & Sáng tạo</h3>
                  <p className="text-gray-500 text-sm font-semibold">Công nghệ dẫn đầu - Trải nghiệm tối ưu.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          <StatCard icon={Store} title="Shop đối tác" value="10,000+" colorClass="text-blue-600" bgColorClass="bg-blue-50" borderColorClass="border-blue-500" />
          <StatCard icon={Users} title="Khách hàng" value="1.5M+" colorClass="text-emerald-600" bgColorClass="bg-emerald-50" borderColorClass="border-emerald-500" />
          <StatCard icon={Trophy} title="Sản phẩm" value="5M+" colorClass="text-purple-600" bgColorClass="bg-purple-50" borderColorClass="border-purple-500" />
          <StatCard icon={Globe} title="Tỉnh thành" value="63/63" colorClass="text-orange-600" bgColorClass="bg-orange-50" borderColorClass="border-gray-500" />
        </div>

        <div className="bg-white rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-gray-100 p-8 md:p-14 mb-20 relative overflow-hidden">
           <div className="flex items-center gap-6 mb-12">
              <div className="h-px bg-gray-100 grow" />
              <h2 className="text-2xl font-semibold text-gray-900 uppercase tracking-tighter shrink-0">Pháp lý & Liên hệ</h2>
              <div className="h-px bg-gray-100 grow" />
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              <div className="space-y-2">
                <InfoItem icon={Building2} title="Tên công ty" content="Công ty TNHH Thương Mại Và Dịch Vụ Vận Chuyển Quốc Tế EBAY" subContent="EBAY TRADING AND INTERNATIONAL SHIPPING SERVICE COMPANY LIMITED" colorClass="text-blue-600" bgColorClass="bg-blue-50" />
                <InfoItem icon={CreditCard} title="Mã số thuế" content="0316436339" colorClass="text-emerald-600" bgColorClass="bg-emerald-50" />
                <InfoItem icon={MapPin} title="Địa chỉ trụ sở" content="300 Độc Lập, Tân Quý, Tân Phú, TP. HCM" colorClass="text-rose-600" bgColorClass="bg-rose-50" />
              </div>
              <div className="space-y-2">
                <InfoItem icon={Phone} title="Hotline hỗ trợ" content={<a href="tel:0932070787">0932 070 787</a>} colorClass="text-orange-600" bgColorClass="bg-orange-50" />
                <InfoItem icon={Mail} title="Email" content="ebayexpressvn@gmail.com" colorClass="text-indigo-600" bgColorClass="bg-indigo-50" />
                <InfoItem icon={Globe} title="Website" content="www.calatha.vn" colorClass="text-sky-600" bgColorClass="bg-sky-50" />
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="bg-white p-12 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:border-gray-200 transition-all duration-500 group">
            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-8 border border-gray-100 group-hover:bg-orange-500 group-hover:text-white transition-all duration-500">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-5 tracking-tight">Sứ mệnh</h3>
            <p className="text-gray-500 font-semibold leading-relaxed text-base">Minh bạch hóa thương mại trực tuyến, kết nối giá trị thực giữa người bán và người mua.</p>
          </div>

          <div className="bg-white p-12 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:border-blue-200 transition-all duration-500 group">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
              <Trophy className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-5 tracking-tight">Tầm nhìn</h3>
            <p className="text-gray-500 font-semibold leading-relaxed text-base">Trở thành biểu tượng uy tín của ngành E-commerce Việt Nam và khu vực Đông Nam Á.</p>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-[50px] p-12 shadow-inner relative overflow-hidden text-center">
            <h2 className="text-3xl font-semibold mb-20 uppercase tracking-widest text-gray-900">Giá trị cốt lõi</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              {['Chất lượng', 'Tin cậy', 'Cộng đồng'].map((val, idx) => (
                <div key={val} className="relative group">
                   <div className="text-[120px] font-semibold text-black absolute -top-16 left-1/2 -translate-x-1/2 select-none group-hover:text-orange-100 transition-colors duration-500">0{idx+1}</div>
                   <div className="relative z-10 pt-10">
                      <h4 className="text-xl font-semibold text-amber-200 group-hover:text-black mb-4">{val}</h4>
                      <p className="text-gray-500 text-sm font-bold leading-relaxed px-4">
                        {idx === 0 ? 'Tiêu chuẩn khắt khe cho mọi dịch vụ.' : idx === 1 ? 'Lấy sự minh bạch làm tôn chỉ hành động.' : 'Phát triển cùng thịnh vượng với đối tác.'}
                      </p>
                   </div>
                </div>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
}