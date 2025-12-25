"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
} from "lucide-react";

import {
  QUICK_LINKS,
  CUSTOMER_SERVICE_LINKS,
  LEGAL_LINKS,
} from "@/constants/footer";
import { cn } from "@/utils/cn"; 
import { SocialLink } from "./_components/socialLink";
import { FooterHeader } from "./_components/footerHeader";
import { FooterLink } from "./_components/footerLink";
import { ContactItem } from "./_components/contactItem";

const PRIMARY_COLOR = "var(--color-primary)";

export const Footer: React.FC = () => {
  return (
    <footer style={{ backgroundColor: PRIMARY_COLOR }} className="text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-6">
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-block">
              <Image
                src="/icon/final.svg"
                alt="CaLaTha Logo"
                width={160}
                height={50}
                className="h-12 w-auto object-contain brightness-0 invert"
                priority
              />
            </Link>
            <p className="text-white text-sm leading-7 pr-4 text-justify">
              Nền tảng thương mại điện tử hàng đầu Việt Nam. Chúng tôi cam kết mang đến trải nghiệm mua sắm an toàn, tiện lợi với hàng triệu sản phẩm chất lượng cao.
            </p>
            
            <div className="flex gap-3 pt-2">
              <SocialLink href="#" icon={Facebook} label="Facebook" />
              <SocialLink href="#" icon={Twitter} label="Twitter" />
              <SocialLink href="#" icon={Instagram} label="Instagram" />
              <SocialLink href="#" icon={Youtube} label="Youtube" />
            </div>
          </div>

          <div className="lg:col-span-2 md:pl-4">
            <FooterHeader>Khám phá</FooterHeader>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <FooterLink key={link.href} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <FooterHeader>Hỗ trợ khách hàng</FooterHeader>
            <ul className="space-y-3">
              {CUSTOMER_SERVICE_LINKS.map((link) => (
                <FooterLink key={link.href} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <FooterHeader>Liên hệ</FooterHeader>
            <div className="mt-6 text-white!">
              <ContactItem 
                icon={Phone} 
                href="tel:0932070787" 
                text={<span className="font-semibold text-lg tracking-wide">0932 070 787</span>} 
              />
              <ContactItem 
                icon={Mail} 
                href="mailto:ebayexpressvn@gmail.com" 
                text="ebayexpressvn@gmail.com" 
              />
              <ContactItem 
                icon={MapPin} 
                text={
                  <>
                    300 Độc Lập, Phường Tân Quý,<br />
                    Quận Tân Phú, TP. HCM
                  </>
                } 
              />
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-2 mt-2">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white text-sm text-center md:text-left">
              © {new Date().getFullYear()} CaLaTha. All rights reserved.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6">
              {LEGAL_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm text-white transition-colors",
                    "hover:text-orange-400"
                  )}
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