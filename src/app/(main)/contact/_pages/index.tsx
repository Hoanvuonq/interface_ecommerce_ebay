"use client";

import PageContentTransition from "@/features/PageContentTransition";
import {
  ArrowUpRight,
  Building2,
  Clock,
  CreditCard,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { ContactCard } from "../_components/ContactCard";
import { SocialButton } from "../_components/SocialButton";
import { contactInfo, socialLinks } from "../_types/contact";
import { HeaderContact } from "../_components/HeaderContact";

export const ContactSreen = () => {
  return (
    <PageContentTransition>
      <div className="min-h-screen bg-[#fafafa] text-slate-900">
        <HeaderContact />
        <main className="max-w-7xl mx-auto px-4 py-2">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ContactCard icon={MapPin} title="Văn phòng chính">
                  {contactInfo.address}
                </ContactCard>

                <ContactCard icon={Phone} title="Hotline hỗ trợ">
                  <a
                    href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
                    className="text-xl"
                  >
                    {contactInfo.phone}
                  </a>
                </ContactCard>

                <ContactCard icon={Mail} title="Hòm thư điện tử">
                  <a href={`mailto:${contactInfo.email}`} className="break-all">
                    {contactInfo.email}
                  </a>
                </ContactCard>

                <ContactCard icon={Clock} title="Lịch làm việc">
                  Thứ 2 - Thứ 6: 08:00 - 17:30 <br />
                  Thứ 7: 08:00 - 12:00
                </ContactCard>
              </div>

              <div className="relative h-80 rounded-[2.5rem] bg-slate-200 overflow-hidden border border-slate-100 group shadow-inner">
                <div className="absolute inset-0 bg-linear-to-br from-orange-500/20 to-transparent z-10" />
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                  <div className="p-4 bg-white rounded-full shadow-2xl mb-4 group-hover:scale-110 transition-transform">
                    <MapPin className="text-orange-600 w-8 h-8" />
                  </div>
                  <span className="px-6 py-2 bg-white rounded-full text-xs font-bold shadow-sm uppercase tracking-tighter">
                    Xem trên Google Maps
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-3xl -mr-16 -mt-16" />
                <h3 className="text-lg font-bold mb-8 flex items-center gap-2 relative z-10">
                  <Building2 className="w-5 h-5 text-orange-600" /> Hồ sơ doanh
                  nghiệp
                </h3>
                <div className="space-y-6 relative z-10">
                  <div>
                    <p className="text-slate-400 text-[9px] uppercase tracking-widest font-bold mb-2">
                      Đơn vị chủ quản
                    </p>
                    <p className="text-sm font-semibold text-slate-800 leading-tight uppercase underline decoration-orange-500/30 decoration-4 underline-offset-4">
                      {contactInfo.companyName}
                    </p>
                  </div>
                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-[9px] uppercase tracking-widest font-bold mb-1">
                        Tax Code
                      </p>
                      <p className="font-mono text-2xl text-slate-900 font-semibold">
                        {contactInfo.taxCode}
                      </p>
                    </div>
                    <CreditCard className="w-8 h-8 text-slate-100" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {socialLinks.map((social, idx) => (
                  <SocialButton key={idx} {...social} />
                ))}
              </div>

              <Link
                href="/help"
                className="group block p-1 rounded-[2.5rem] bg-orange-500 hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-500"
              >
                <div className="bg-white rounded-[2.3rem] p-8 flex items-center justify-between group-hover:bg-transparent">
                  <div>
                    <h4 className="font-semibold text-slate-900 group-hover:text-white transition-colors">
                      Trung tâm trợ giúp
                    </h4>
                    <p className="text-xs text-slate-500 group-hover:text-orange-100 transition-colors">
                      Hỗ trợ khách hàng 24/7
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 group-hover:bg-white flex items-center justify-center text-orange-600 transition-all">
                    <ArrowUpRight size={24} />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </PageContentTransition>
  );
};
