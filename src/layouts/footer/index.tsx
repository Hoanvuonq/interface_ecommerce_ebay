"use client";

import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
  ChevronDown
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

import {
  CUSTOMER_SERVICE_LINKS,
  LEGAL_LINKS,
  QUICK_LINKS,
} from "@/constants/footer";
import { cn } from "@/utils/cn";


const SocialButton = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => (
  <Link
    href={href}
    aria-label={label}
    className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-orange-500 hover:text-white transition-all duration-300"
  >
    <Icon size={18} />
  </Link>
);

const FooterLinkItem = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <li>
    <Link 
      href={href} 
      className="text-slate-300 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block text-[13px] sm:text-sm"
    >
      {children}
    </Link>
  </li>
);

const AccordionItem = ({ title, children, isOpen, onClick }: { title: string; children: React.ReactNode; isOpen: boolean; onClick: () => void }) => {
  return (
    <div className="border-b border-white/10 lg:border-none">
      <button 
        onClick={onClick}
        className="flex items-center justify-between w-full py-4 lg:py-0 lg:mb-6 text-left group"
      >
        <h3 className="text-base lg:text-lg font-bold text-white uppercase tracking-wide relative">
          {title}
          <span className="hidden lg:block absolute -bottom-2 left-0 w-8 h-1 bg-orange-500 rounded-full" />
        </h3>
        <ChevronDown 
          size={18} 
          className={cn(
            "text-slate-400 lg:hidden transition-transform duration-300", 
            isOpen ? "rotate-180" : ""
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
};


export const Footer: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };
  const BG_COLOR = "bg-[#2d4ecf] dark:bg-slate-950"; 

  return (
    <footer className={cn("text-white pt-10 sm:pt-16 pb-6", BG_COLOR)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-10">
          <div className="lg:col-span-4 space-y-5 text-center lg:text-left">
            <Link href="/" className="inline-block">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                 <div className="w-8 h-8 bg-white rounded flex items-center justify-center text-[#2d4ecf] font-bold text-xl">C</div>
                 <span className="text-2xl font-bold tracking-tight">CaLaTha</span>
              </div>
            </Link>
            <p className="text-blue-100 dark:text-slate-400 text-sm leading-relaxed max-w-sm mx-auto lg:mx-0">
              Nền tảng thương mại điện tử hàng đầu Việt Nam. Chúng tôi cam kết mang đến trải nghiệm mua sắm an toàn, tiện lợi với hàng triệu sản phẩm chất lượng cao.
            </p>
            
            <div className="flex justify-center lg:justify-start gap-3">
              <SocialButton href="#" icon={Facebook} label="Facebook" />
              <SocialButton href="#" icon={Twitter} label="Twitter" />
              <SocialButton href="#" icon={Instagram} label="Instagram" />
              <SocialButton href="#" icon={Youtube} label="Youtube" />
            </div>
          </div>

          <div className="lg:col-span-2">
            <AccordionItem 
              title="Khám phá" 
              isOpen={openSection === 'discover'} 
              onClick={() => toggleSection('discover')}
            >
              <ul className="space-y-2.5">
                {QUICK_LINKS.map((link) => (
                  <FooterLinkItem key={link.href} href={link.href}>
                    {link.label}
                  </FooterLinkItem>
                ))}
              </ul>
            </AccordionItem>
          </div>

          {/* Col 3: Hỗ trợ */}
          <div className="lg:col-span-3">
            <AccordionItem 
              title="Hỗ trợ khách hàng" 
              isOpen={openSection === 'support'} 
              onClick={() => toggleSection('support')}
            >
              <ul className="space-y-2.5">
                {CUSTOMER_SERVICE_LINKS.map((link) => (
                  <FooterLinkItem key={link.href} href={link.href}>
                    {link.label}
                  </FooterLinkItem>
                ))}
              </ul>
            </AccordionItem>
          </div>

          <div className="lg:col-span-3">
            <AccordionItem 
              title="Liên hệ" 
              isOpen={openSection === 'contact'} 
              onClick={() => toggleSection('contact')}
            >
              <ul className="space-y-4">
                 <li className="flex gap-3 items-start">
                    <Phone size={18} className="text-orange-400 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-xs text-blue-200 mb-0.5">Hotline 24/7</p>
                        <a href="tel:0932070787" className="text-base font-bold hover:text-orange-400 transition-colors">
                            0932 070 787
                        </a>
                    </div>
                 </li>
                 <li className="flex gap-3 items-start">
                    <Mail size={18} className="text-orange-400 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-xs text-blue-200 mb-0.5">Email hỗ trợ</p>
                        <a href="mailto:support@calatha.com" className="text-sm hover:text-orange-400 transition-colors break-all">
                            support@calatha.com
                        </a>
                    </div>
                 </li>
                 <li className="flex gap-3 items-start">
                    <MapPin size={18} className="text-orange-400 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-xs text-blue-200 mb-0.5">Văn phòng</p>
                        <p className="text-sm leading-snug">
                            300 Độc Lập, Tân Quý,<br/>Tân Phú, TP.HCM
                        </p>
                    </div>
                 </li>
              </ul>
            </AccordionItem>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 mt-2">
          <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4">
            <p className="text-slate-300 text-xs text-center md:text-left">
              © {new Date().getFullYear()} CaLaTha. All rights reserved.
            </p>
            
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {LEGAL_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-slate-300 hover:text-orange-400 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};