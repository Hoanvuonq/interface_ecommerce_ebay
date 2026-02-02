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
  Youtube,
  Leaf,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ContactBlock, FooterSection, SocialCircle } from "./_components";

export const Footer = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const toggleSection = (section: string) =>
    setOpenSection(openSection === section ? null : section);

  return (
    <footer className="bg-gray-100 text-[#2d3436] relative mt-4 border-t-4 border-gray-300 overflow-hidden">
      <div className="absolute top-0 left-0 w-full overflow-hidden rotate-180 leading-0 fill-gray-50/50">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-[calc(100%+1.3px)] h-20"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* CỘT 1: BRAND INFO */}
          <div className="lg:col-span-4 space-y-8 pr-4">
            <Link
              href="/"
              className="inline-block transform transition-hover hover:scale-105 duration-300"
            >
              <Image
                src="/icon/cano-v4.png"
                alt="CaLaTha"
                width={140}
                height={45}
                className="object-contain"
                priority
              />
            </Link>
            <p className="text-gray-500 text-[14px] leading-relaxed font-medium">
              Kiến tạo hệ sinh thái mua sắm thông minh, nơi niềm tin và chất
              lượng dịch vụ luôn là ưu tiên hàng đầu cho mọi gia đình Việt.
            </p>
            <div className="flex gap-4">
              <SocialCircle icon={Facebook} />
              <SocialCircle icon={Instagram} />
              <SocialCircle icon={Youtube} />
              <SocialCircle icon={Twitter} />
            </div>
          </div>

          {/* 2. VÁCH NGĂN CỘT (VERTICAL DIVIDER) */}
          <div className="hidden lg:block lg:col-span-1 h-64 border-l border-gray-100/80 my-auto" />

          {/* CỘT 2 & 3: LINKS */}
          <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-8">
            <FooterSection
              title="Khám phá"
              isOpen={openSection === "discover"}
              onClick={() => toggleSection("discover")}
            >
              <ul className="space-y-4 pt-2">
                {QUICK_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[13px] font-bold text-gray-400 hover:text-orange-500 transition-all flex items-center gap-1.5 group"
                    >
                      <ChevronRight
                        size={12}
                        className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-orange-500"
                      />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </FooterSection>

            <FooterSection
              title="Chăm sóc"
              isOpen={openSection === "support"}
              onClick={() => toggleSection("support")}
            >
              <ul className="space-y-4 pt-2">
                {CUSTOMER_SERVICE_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[13px] font-bold text-gray-400 hover:text-orange-500 transition-all flex items-center gap-1.5 group"
                    >
                      <ChevronRight
                        size={12}
                        className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-orange-500"
                      />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </FooterSection>
          </div>

          {/* CỘT 4: CONTACT */}
          <div className="lg:col-span-3 space-y-8 pl-4 lg:border-l lg:border-gray-100/80">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50/50 rounded-full border border-orange-100">
              <Leaf size={12} className="text-orange-500" />
              <span className="text-[10px] font-bold uppercase text-orange-600 tracking-widest">
                Connect with us
              </span>
            </div>
            <div className="space-y-6">
              <ContactBlock
                icon={Phone}
                title="Hotline 24/7"
                value="0932 070 787"
              />
              <ContactBlock
                icon={Mail}
                title="Hộp thư góp ý"
                value="support@calatha.com"
              />
              <ContactBlock
                icon={MapPin}
                title="Văn phòng điều hành"
                value="Tân Phú, TP. Hồ Chí Minh"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
            &copy; {new Date().getFullYear()} Cano X Tech{" "}
            <span className="w-1 h-1 rounded-full bg-orange-300" /> Excellence
            in E-commerce.
          </p>
          <div className="flex items-center gap-x-6">
            {LEGAL_LINKS.map((link, idx) => (
              <div key={link.href} className="flex items-center gap-6">
                {idx !== 0 && (
                  <div className="w-1 h-1 rounded-full bg-gray-200" />
                )}
                <Link
                  href={link.href}
                  className="text-[9px] text-gray-400 hover:text-orange-500 uppercase tracking-[0.2em] font-bold transition-all"
                >
                  {link.label}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
