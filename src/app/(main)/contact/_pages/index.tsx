"use client";

import { SectionPageComponents } from "@/features/SectionPageComponents";
import {
  ArrowUpRight,
  Building2,
  Clock,
  CreditCard,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { HeaderContact } from "../_components/HeaderContact";
import { InfoItem } from "../_components/InfoItem";
import { SocialButton } from "../_components/SocialButton";
import { contactInfo, socialLinks } from "../_types/contact";

export const ContactSreen = () => {
  return (
    <SectionPageComponents>
      <HeaderContact />
      <main className="max-w-7xl mx-auto px-4 py-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem icon={MapPin} title="Văn phòng">
                {contactInfo.address}
              </InfoItem>

              <InfoItem icon={Phone} title="Hotline">
                <Link
                  href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
                  className="text-xl font-bold text-gray-900 hover:text-orange-600 transition-colors"
                >
                  {contactInfo.phone}
                </Link>
              </InfoItem>

              <InfoItem icon={Mail} title="Email hỗ trợ">
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="hover:text-orange-600 transition-colors"
                >
                  {contactInfo.email}
                </a>
              </InfoItem>

              <InfoItem icon={Clock} title="Giờ làm việc">
                <p>Thứ 2 - Thứ 6: 08:00 - 17:30</p>
                <p className="text-gray-500">Thứ 7: 08:00 - 12:00</p>
              </InfoItem>
            </div>

            <div className="relative h-72 rounded-3xl bg-gray-100 overflow-hidden border border-gray-100 group">
              <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=21.0285,105.8542&zoom=13&size=600x300&maptype=roadmap&style=feature:all|saturation:-100')] bg-cover bg-center opacity-60 grayscale group-hover:grayscale-0 transition-all duration-500" />

              <div className="absolute inset-0 bg-linear-to-t from-white/80 via-transparent to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_0_4px_rgba(34,197,94,0.2)]" />
                  <span className="text-sm font-semibold text-gray-700 bg-white/80 backdrop-blur px-3 py-1 rounded-full">
                    Đang mở cửa
                  </span>
                </div>

                <a
                  href="#"
                  className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-medium text-sm shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-0.5 active:scale-95"
                >
                  <MapPin size={16} /> Chỉ đường
                </a>
              </div>
            </div>
          </div>

          {/* Cột phải: Hồ sơ & Kết nối */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-linear-to-br from-white to-orange-50/30 border border-orange-100 p-8 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl -mr-10 -mt-10" />

              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-orange-500" />
                Hồ sơ doanh nghiệp
              </h3>

              <div className="space-y-6 relative z-10">
                <div>
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                    Đơn vị chủ quản
                  </p>
                  <p className="text-base font-bold text-gray-900 leading-tight uppercase">
                    {contactInfo.companyName}
                  </p>
                </div>

                <div className="pt-6 border-t border-dashed border-orange-200/50 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                      Mã số thuế
                    </p>
                    <p className="font-mono text-xl text-gray-800 font-bold tracking-tight">
                      {contactInfo.taxCode}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white border border-orange-100 flex items-center justify-center text-orange-400 shadow-sm">
                    <CreditCard size={20} />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-500 mb-4 px-1">
                Kết nối với chúng tôi
              </p>
              <div className="grid grid-cols-4 gap-3">
                {socialLinks.map((social, idx) => (
                  <SocialButton key={idx} {...social} />
                ))}
              </div>
            </div>

            <Link
              href="/help"
              className="group block relative overflow-hidden rounded-3xl bg-gray-900 p-1"
            >
              <div className="absolute inset-0 bg-linear-to-r from-orange-600 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative bg-gray-900 group-hover:bg-opacity-90 rounded-[1.3rem] p-6 flex items-center justify-between transition-all">
                <div>
                  <h4 className="font-bold text-white mb-1 flex items-center gap-2">
                    Trung tâm trợ giúp
                    <ArrowUpRight
                      size={16}
                      className="text-gray-500 group-hover:text-white transition-colors"
                    />
                  </h4>
                  <p className="text-sm text-gray-600 group-hover:text-orange-100 transition-colors">
                    Câu hỏi thường gặp & Hỗ trợ
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/10 group-hover:bg-white text-white group-hover:text-orange-600 flex items-center justify-center transition-all duration-300 transform group-hover:rotate-12">
                  <MessageCircle size={24} />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </SectionPageComponents>
  );
};
