"use client";

import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import {
  CUSTOMER_SERVICE_LINKS,
  LEGAL_LINKS,
  QUICK_LINKS,
} from "@/constants/footer";
import { cn } from "@/utils/cn";
import { SubscribeForm } from "./_components/subscribeForm";
import { SocialLink } from "./_components/socialLink";
import { FooterLinkItem } from "./_components/footerLink";

export const Footer: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEmail("");
    }, 2000);
  };

  const toggleSection = (section: string) =>
    setOpenSection(openSection === section ? null : section);

  const BG_PRIMARY = "#2f5aff";

  return (
    <footer
      className="text-white pt-8 pb-3 border-t border-white/5 relative overflow-hidden"
      style={{ backgroundColor: BG_PRIMARY }}
    >
      <div className="absolute top-0 right-0 w-100 h-100 bg-white/5 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-10 pb-12 border-b border-white/10">
          <div className="lg:max-w-sm space-y-4">
            <Link href="/" className="inline-block group">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white text-[#2f5aff] rounded-lg flex items-center justify-center font-bold text-base shadow-lg transition-transform group-hover:scale-105">
                  C
                </div>
                <span className="text-xl font-bold tracking-tighter uppercase italic">
                  CaLaTha
                </span>
              </div>
            </Link>
            <p className="text-white text-[12px] leading-relaxed font-medium">
              Nền tảng thương mại điện tử hàng đầu Việt Nam, mang đến trải
              nghiệm mua sắm tuyệt vời với hàng triệu sản phẩm chất lượng.
            </p>
            <div className="flex gap-2">
              <SocialLink href="#" icon={Facebook} label="Facebook" />
              <SocialLink href="#" icon={Twitter} label="Twitter" />
              <SocialLink href="#" icon={Instagram} label="Instagram" />
              <SocialLink href="#" icon={Youtube} label="Youtube" />
            </div>
          </div>

          <div className="w-full lg:max-w-md bg-white/5 p-6 rounded-4xl border border-white/10 backdrop-blur-sm shadow-inner">
            <h4 className="text-base font-bold uppercase tracking-[0.3em] text-white/80 mb-4 ml-1">
              Ưu Đãi
            </h4>
            <SubscribeForm
              email={email}
              loading={loading}
              onChange={setEmail}
              onSubmit={handleSubscribe}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 py-6">
          <AccordionItem
            title="Khám phá"
            isOpen={openSection === "discover"}
            onClick={() => toggleSection("discover")}
          >
            <ul className="space-y-2.5 pt-2">
              {QUICK_LINKS.map((link) => (
                <FooterLinkItem key={link.href} href={link.href}>
                  {link.label}
                </FooterLinkItem>
              ))}
            </ul>
          </AccordionItem>

          <AccordionItem
            title="Dịch vụ"
            isOpen={openSection === "support"}
            onClick={() => toggleSection("support")}
          >
            <ul className="space-y-2.5 pt-2">
              {CUSTOMER_SERVICE_LINKS.map((link) => (
                <FooterLinkItem key={link.href} href={link.href}>
                  {link.label}
                </FooterLinkItem>
              ))}
            </ul>
          </AccordionItem>

          <div className="lg:col-span-2">
            <h3 className="hidden lg:block text-[10px] font-bold text-white/80 uppercase tracking-[0.2em] mb-6">
              Liên hệ
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-5">
                <ContactItem
                  icon={Phone}
                  label="Hotline 24/7"
                  value="0932 070 787"
                />
                <ContactItem
                  icon={Mail}
                  label="Email support"
                  value="support@calatha.com"
                />
              </div>
              <ContactItem
                icon={MapPin}
                label="Trụ sở chính"
                value="300 Độc Lập, Tân Quý, Tân Phú, TP.HCM"
                isLong
              />
            </div>
          </div>
        </div>

        <div
          className="pt-4
         border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} CaLaTha Tech. Built for the future.
          </p>
          <div className="flex gap-6">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[10px] font-bold uppercase text-white/80 hover:text-white transition-colors tracking-widest"
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

const ContactItem = ({ icon: Icon, label, value, isLong }: any) => (
  <div className="flex gap-3 items-start group">
    <div className="p-2 bg-white/10 rounded-xl text-amber-400 border border-white/5 group-hover:bg-amber-400 group-hover:text-slate-900 transition-all">
      <Icon size={14} />
    </div>
    <div>
      <p className="text-[9px] font-bold text-white/80 uppercase tracking-widest mb-0.5">
        {label}
      </p>
      <p
        className={cn(
          "font-bold text-white tracking-tight",
          isLong ? "text-[12px] leading-snug" : "text-[13px]"
        )}
      >
        {value}
      </p>
    </div>
  </div>
);

const AccordionItem = ({ title, children, isOpen, onClick }: any) => (
  <div className="border-b border-white/10 lg:border-none">
    <button
      onClick={onClick}
      className="flex items-center justify-between w-full py-3 lg:py-0 lg:mb-4 text-left group"
    >
      <h3 className="text-[11px] font-bold text-white uppercase tracking-[0.2em] relative">
        {title}
        <span className="hidden lg:block absolute -bottom-1.5 left-0 w-4 h-0.5 bg-amber-400 rounded-full shadow-[0_0_8px_#fbbf24]" />
      </h3>
      <ChevronDown
        size={14}
        className={cn(
          "text-white/80 lg:hidden transition-transform",
          isOpen && "rotate-180"
        )}
      />
    </button>
    <div
      className={cn(
        "overflow-hidden transition-all duration-300 lg:h-auto lg:opacity-100",
        isOpen ? "max-h-96 opacity-100 mb-4" : "max-h-0 opacity-0 lg:max-h-none"
      )}
    >
      {children}
    </div>
  </div>
);
