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
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ContactBlock } from "./_components/contactBlock";
import { FooterSection } from "./_components/footerSection";
import { SocialCircle } from "./_components/socialCircle";

export const Footer = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const toggleSection = (section: string) =>
    setOpenSection(openSection === section ? null : section);

  return (
    <footer className="bg-[#f5f5f5] text-[#1a1a1a] border-t-4 border-(--color-mainColor)">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 lg:gap-x-12">
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-block">
              <Image
                src="/icon/cano-v4.png"
                alt="CaLaTha Logo"
                width={130}
                height={40}
                className="object-contain"
                priority
              />
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
              Nền tảng thương mại điện tử uy tín, mang đến trải nghiệm mua sắm
              an toàn và dịch vụ vượt trội cho mọi gia đình.
            </p>
            <div className="flex gap-3">
              <SocialCircle icon={Facebook} />
              <SocialCircle icon={Instagram} />
              <SocialCircle icon={Youtube} />
              <SocialCircle icon={Twitter} />
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-2 gap-8">
            <FooterSection
              title="Về CaLaTha"
              isOpen={openSection === "discover"}
              onClick={() => toggleSection("discover")}
            >
              <ul className="space-y-3">
                {QUICK_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm font-semibold text-gray-500 hover:text-(--color-mainColor) transition-colors relative group inline-block pb-0.5"
                    >
                      {link.label}
                      <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-(--color-mainColor) transition-all duration-300 group-hover:w-full" />
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
                    <Link
                      href={link.href}
                      className="text-sm font-semibold text-gray-500 hover:text-(--color-mainColor) transition-colors relative group inline-block pb-0.5"
                    >
                      {link.label}
                      <span className="absolute left-0 bottom-0 w-0 h-[1.5px] bg-(--color-mainColor) transition-all duration-300 group-hover:w-full" />
                    </Link>
                  </li>
                ))}
              </ul>
            </FooterSection>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-md font-bold uppercase  mb-8 border-l-2 border-(--color-mainColor) pl-4">
              Thông tin liên hệ
            </h3>
            <div className="space-y-5">
              <ContactBlock icon={Phone} title="Hotline" value="0932 070 787" />
              <ContactBlock
                icon={Mail}
                title="Email"
                value="support@calatha.com"
              />
              <ContactBlock
                icon={MapPin}
                title="Địa chỉ"
                value="Tân Phú, TP. Hồ Chí Minh"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-gray-500 font-medium">
            &copy; {new Date().getFullYear()} Cano X Tech. All rights reserved.
          </p>
          <div className="flex gap-x-6">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[10px] text-gray-500 hover:text-(--color-mainColor) uppercase tracking-wider font-semibold transition-colors"
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
