"use client";

import {
  CUSTOMER_SERVICE_LINKS,
  LEGAL_LINKS,
  QUICK_LINKS,
} from "@/constants/footer";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { ContactBlock } from "./_components/contactBlock";
import { FooterSection } from "./_components/footerSection";
import { SocialCircle } from "./_components/socialCircle";

export const Footer: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const toggleSection = (section: string) =>
    setOpenSection(openSection === section ? null : section);

  const BG_BLUE = "#2f5aff";

  return (
    <footer
      className="text-white relative border-t border-white/10"
      style={{ backgroundColor: BG_BLUE }}
    >
      <div className="absolute top-0 left-1/4 w-96 h-auto bg-blue-400/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 lg:gap-x-12">
          
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-block group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white text-[#2f5aff] rounded-xl flex items-center justify-center font-black text-xl shadow-lg transition-transform group-hover:-rotate-6">
                  C
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold leading-none tracking-tight">
                    CaLaTha <span className="text-amber-400">Mall</span>
                  </span>
                  <span className="text-[10px] text-white/50 uppercase tracking-[0.2em] mt-1">International Standard</span>
                </div>
              </div>
            </Link>
            <p className="text-white/80 text-[14px] leading-relaxed max-w-sm">
              Nền tảng thương mại điện tử uy tín, mang đến trải nghiệm mua sắm an toàn và dịch vụ vượt trội cho mọi gia đình.
            </p>
            <div className="flex gap-2">
              <SocialCircle icon={Facebook} />
              <SocialCircle icon={Instagram} />
              <SocialCircle icon={Youtube} />
              <SocialCircle icon={Twitter} />
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-2 gap-8">
            <FooterSection
              title="Về CaLaTha"
              isOpen={openSection === "discover"}
              onClick={() => toggleSection("discover")}
            >
              <ul className="space-y-3">
                {QUICK_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-[14px] text-white/70 hover:text-white hover:translate-x-1 inline-block transition-all">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </FooterSection>

            <FooterSection
              title="Hỗ trợ khách hàng"
              isOpen={openSection === "support"}
              onClick={() => toggleSection("support")}
            >
              <ul className="space-y-3">
                {CUSTOMER_SERVICE_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-[14px] text-white/70 hover:text-white hover:translate-x-1 inline-block transition-all">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </FooterSection>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-6 border-l-2 border-amber-400 pl-3">
              Thông tin liên hệ
            </h3>
            <div className="space-y-4">
              <ContactBlock icon={Phone} title="Hotline" value="0932 070 787" />
              <ContactBlock icon={Mail} title="Email" value="support@calatha.com" />
              <ContactBlock icon={MapPin} title="Địa chỉ" value="Tân Phú, TP. Hồ Chí Minh" />
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-white/40">
          <p className="text-[13px] font-medium italic">
            &copy; {new Date().getFullYear()} CaLaTha Tech. Design for Excellence.
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[12px] font-semibold hover:text-white transition-colors uppercase tracking-wider"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
